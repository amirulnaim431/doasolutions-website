<?php
// Included by files.php after authentication and request validation.
const DOA_FILE_LIMIT = 3 * 1024 ** 3;
const DOA_STORAGE_LIMIT = 5 * 1024 ** 3;
const DOA_CHUNK_LIMIT = 8 * 1024 ** 2;

function doa_uploaded_mime(string $path, string $name, array $types): ?string {
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($path);
    if (!isset($types[$extension]) || !in_array($mime, $types[$extension], true)) {
        return null;
    }
    return match ($extension) {
        'm4a' => 'audio/mp4',
        'ogg', 'opus' => 'audio/ogg',
        default => $mime,
    };
}

function doa_upload_storage(PDO $db, string $dir): void {
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('Attachment directory unavailable.');
    }
    // Hold this lock through each short chunk request and quota update.
    $lock = fopen($dir . '/.upload-lock', 'c');
    if (!$lock || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Could not lock upload storage.');
    }
    register_shutdown_function(static function () use ($lock) { fclose($lock); });
    $db->exec('CREATE TABLE IF NOT EXISTS pending_uploads (
        id TEXT PRIMARY KEY, owner TEXT NOT NULL, name TEXT NOT NULL,
        bytes INTEGER NOT NULL, touched INTEGER NOT NULL
    )');
    $expired = doa_run($db, 'SELECT id FROM pending_uploads WHERE touched < ?', [time() - 86400])->fetchAll(PDO::FETCH_COLUMN);
    foreach ($expired as $id) {
        $path = $dir . '/' . $id;
        if (!is_file($path) || unlink($path)) {
            doa_run($db, 'DELETE FROM pending_uploads WHERE id=?', [$id]);
        }
    }
}

function doa_upload_free(PDO $db): int {
    return DOA_STORAGE_LIMIT - (int) $db->query('SELECT
        (SELECT COALESCE(SUM(stored),0) FROM attachments) +
        (SELECT COALESCE(SUM(bytes),0) FROM pending_uploads)')->fetchColumn();
}

function doa_upload_chunk(PDO $db, string $dir, string $user, array $types): never {
    $id = $_POST['id'] ?? '';
    $action = $_POST['action'];
    if (!is_string($id) || !preg_match('/^[a-f0-9]{32}$/D', $id)) {
        doa_json(['error' => 'Invalid upload ID.'], 400);
    }
    $upload = doa_run($db, 'SELECT * FROM pending_uploads WHERE id=? AND owner=?', [$id, $user])->fetch(PDO::FETCH_ASSOC);
    $path = $dir . '/' . $id;
    if ($action === 'begin') {
        $name = $_POST['name'] ?? '';
        $size = filter_var($_POST['bytes'] ?? null, FILTER_VALIDATE_INT);
        if (!is_string($name) || !$size || $size < 1 || $size > DOA_FILE_LIMIT) {
            doa_json(['error' => 'Files must be 3 GB or smaller.'], 413);
        }
        $name = substr(basename(str_replace('\\', '/', $name)), 0, 165);
        if (!isset($types[strtolower(pathinfo($name, PATHINFO_EXTENSION))])) {
            doa_json(['error' => 'Unsupported file format.'], 415);
        }
        if (!$upload) {
            if (is_file($path) || doa_run($db, 'SELECT 1 FROM pending_uploads WHERE id=? UNION ALL SELECT 1 FROM attachments WHERE id=?', [$id, $id])->fetchColumn()) {
                doa_json(['error' => 'Upload ID already in use.'], 409);
            }
            if ($size > doa_upload_free($db)) {
                doa_json(['error' => 'This file would exceed the 5 GB shared limit. Check Shared Files and Trash.'], 409);
            }
            doa_run($db, 'INSERT INTO pending_uploads VALUES(?,?,?,?,?)', [$id,$user,$name,$size,time()]);
        } elseif ((int) $upload['bytes'] !== $size || $upload['name'] !== $name) {
            doa_json(['error' => 'Upload details changed.'], 409);
        }
        doa_run($db, 'UPDATE pending_uploads SET touched=? WHERE id=?', [time(),$id]);
        doa_json(['offset' => is_file($path) ? filesize($path) : 0]);
    }
    if (!$upload) {
        if ($action === 'finish' && doa_run($db, 'SELECT 1 FROM attachments WHERE id=? AND owner=?', [$id,$user])->fetchColumn()) {
            doa_json(['ok' => true]);
        }
        doa_json(['error' => 'Upload expired. Select the file again.'], 404);
    }
    $offset = is_file($path) ? filesize($path) : 0;
    if ($action === 'cancel') {
        if ($offset > 0 && !unlink($path)) {
            throw new RuntimeException('Could not remove incomplete upload.');
        }
        doa_run($db, 'DELETE FROM pending_uploads WHERE id=?', [$id]);
        doa_json(['ok' => true]);
    }
    if ($action === 'chunk') {
        $part = $_FILES['chunk'] ?? [];
        $length = (int) ($part['size'] ?? 0);
        $start = filter_var($_POST['offset'] ?? null, FILTER_VALIDATE_INT);
        if (($part['error'] ?? -1) !== UPLOAD_ERR_OK || $length < 1 || $length > DOA_CHUNK_LIMIT ||
            $start === false || $start < 0 || $start + $length > (int) $upload['bytes']) {
            doa_json(['error' => 'Invalid upload part.'], 400);
        }
        if ($start + $length === $offset) {
            doa_json(['offset' => $offset]);
        }
        if ($start !== $offset) {
            doa_json(['error' => 'Upload position changed.'], 409);
        }
        $input = fopen($part['tmp_name'], 'rb');
        $output = fopen($path, 'c+b');
        if (!$input || !$output || fseek($output, $offset) !== 0) {
            throw new RuntimeException('Could not open upload.');
        }
        chmod($path, 0600);
        $written = stream_copy_to_stream($input, $output, $length);
        if ($written !== $length || !fflush($output)) {
            ftruncate($output, $offset);
            throw new RuntimeException('Could not save upload part.');
        }
        fclose($input);
        fclose($output);
        doa_run($db, 'UPDATE pending_uploads SET touched=? WHERE id=?', [time(),$id]);
        doa_json(['offset' => $offset + $length]);
    }
    if ($action !== 'finish' || $offset !== (int) $upload['bytes']) {
        doa_json(['error' => 'Upload is incomplete.'], 409);
    }
    $mime = doa_uploaded_mime($path, $upload['name'], $types);
    if (!$mime) {
        unlink($path);
        doa_run($db, 'DELETE FROM pending_uploads WHERE id=?', [$id]);
        doa_json(['error' => 'The file content does not match a supported format.'], 415);
    }
    $db->beginTransaction();
    doa_run($db, 'INSERT INTO attachments(id,owner,name,mime,bytes,stored,encoding,created) VALUES(?,?,?,?,?,?,?,?)',
        [$id,$user,$upload['name'],$mime,$offset,$offset,'',time()]);
    doa_run($db, 'DELETE FROM pending_uploads WHERE id=?', [$id]);
    $db->commit();
    doa_json(['ok' => true], 201);
}
