<?php
require_once __DIR__ . '/bootstrap.php';
doa_start();
$user = doa_require_user(true)['username'];
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    doa_verify_write();
} elseif ($method !== 'GET') {
    doa_json(['error' => 'Method not allowed.'], 405);
}
session_write_close();

$types = [
    'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'],
    'webp' => ['image/webp'], 'gif' => ['image/gif'],
    'mp3' => ['audio/mpeg'], 'm4a' => ['audio/mp4','video/mp4','audio/x-m4a'],
    'wav' => ['audio/wav','audio/x-wav','audio/vnd.wave'], 'ogg' => ['audio/ogg','application/ogg'],
    'opus' => ['audio/ogg','application/ogg'], 'aac' => ['audio/aac','audio/x-hx-aac'],
    'mp4' => ['video/mp4','audio/mp4'], 'webm' => ['video/webm','audio/webm'], 'mov' => ['video/quicktime'],
    'pdf' => ['application/pdf'], 'txt' => ['text/plain'], 'csv' => ['text/csv','text/plain','application/csv'],
    'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/zip'],
    'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/zip'],
    'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation','application/zip'],
    'zip' => ['application/zip','application/x-zip'],
];

try {
    $db = doa_db();
    $dir = doa_data_directory() . '/files';
    if ($method === 'POST' && isset($_POST['purge'])) {
        $id = $_POST['purge'];
        if (!is_string($id) || !preg_match('/^[a-f0-9]{32}$/D', $id)) {
            doa_json(['error' => 'File not found.'], 404);
        }
        $removed = doa_run($db, 'DELETE FROM attachments WHERE id=? AND deleted IS NOT NULL', [$id]);
        if (!$removed->rowCount()) {
            doa_json(['error' => 'This file is no longer in Trash.'], 409);
        }
        if (is_file($dir . '/' . $id)) {
            unlink($dir . '/' . $id);
        }
        doa_json(['ok' => true]);
    }
    if ($method === 'GET') {
        $id = $_GET['id'] ?? '';
        if (!is_string($id) || !preg_match('/^[a-f0-9]{32}$/D', $id)) {
            doa_json(['error' => 'File not found.'], 404);
        }
        $item = doa_run($db, 'SELECT * FROM attachments WHERE id=? AND deleted IS NULL', [$id])->fetch(PDO::FETCH_ASSOC);
        $path = $dir . '/' . $id;
        if (!$item || !is_file($path)) {
            doa_json(['error' => 'File not found.'], 404);
        }
        $mime = $item['mime'];
        $inline = !isset($_GET['download']) && preg_match('~^(image|audio|video)/~', $mime);
        header('Content-Type: ' . $mime);
        header('Content-Disposition: ' . ($inline ? 'inline' : 'attachment') . "; filename*=UTF-8''" . rawurlencode($item['name']));
        $bytes = (int) $item['bytes'];
        header('Accept-Ranges: bytes');
        $start = 0;
        $end = $bytes - 1;
        if (isset($_SERVER['HTTP_RANGE'])) {
            $range = $_SERVER['HTTP_RANGE'];
            if (preg_match('/^bytes=(\d*)-(\d*)$/D', $range, $matches) && ($matches[1] !== '' || $matches[2] !== '')) {
                $start = $matches[1] !== '' ? (int) $matches[1] : max(0, $bytes - (int) $matches[2]);
                if ($matches[1] !== '' && $matches[2] !== '') {
                    $end = min($end, (int) $matches[2]);
                }
            } else {
                $start = $bytes;
            }
            if ($start >= $bytes || $end < $start) {
                header('Content-Range: bytes */' . $bytes);
                http_response_code(416);
                exit;
            }
            http_response_code(206);
            header("Content-Range: bytes $start-$end/$bytes");
        }
        $length = $end - $start + 1;
        header('Content-Length: ' . $length);
        $gzip = $item['encoding'] === 'gzip';
        $file = $gzip ? gzopen($path, 'rb') : fopen($path, 'rb');
        if (!$file) {
            http_response_code(503);
            exit;
        }
        if ($gzip) {
            gzseek($file, $start);
        } else {
            fseek($file, $start);
        }
        while ($length > 0 && !connection_aborted()) {
            $chunk = $gzip ? gzread($file, min($length, 65536)) : fread($file, min($length, 65536));
            if ($chunk === false || $chunk === '') {
                break;
            }
            echo $chunk;
            $length -= strlen($chunk);
        }
        $gzip ? gzclose($file) : fclose($file);
        exit;
    }

    $incoming = $_FILES['file'] ?? null;
    if (!$incoming || ($incoming['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        doa_json(['error' => 'The upload did not complete. Try a smaller file.'], 400);
    }
    $bytes = (int) $incoming['size'];
    if ($bytes <= 0 || $bytes > 25 * 1024 * 1024) {
        doa_json(['error' => 'Files must be between 1 byte and 25 MB.'], 413);
    }
    $name = substr(basename(str_replace('\\', '/', $incoming['name'])), 0, 165);
    $extension = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($incoming['tmp_name']);
    if (!isset($types[$extension]) || !in_array($mime, $types[$extension], true)) {
        doa_json(['error' => 'Unsupported file format. Try a common image, audio, video, PDF, Office document, or ZIP.'], 415);
    }
    if ($extension === 'm4a') {
        $mime = 'audio/mp4';
    } elseif ($extension === 'opus') {
        $mime = 'audio/ogg';
    }
    if ($mime === 'application/ogg' && $extension === 'ogg') {
        $mime = 'audio/ogg';
    }
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('Attachment directory unavailable.');
    }
    $id = bin2hex(random_bytes(16));
    $path = $dir . '/' . $id;
    if (!move_uploaded_file($incoming['tmp_name'], $path)) {
        throw new RuntimeException('Could not store upload.');
    }
    chmod($path, 0600);
    $encoding = '';
    $stored = $bytes;
    $compressed = $path . '.tmp';
    $source = fopen($path, 'rb');
    $target = gzopen($compressed, 'wb3');
    $complete = $source && $target;
    if ($complete) {
        while (!feof($source)) {
            $chunk = fread($source, 65536);
            if ($chunk === false || ($chunk !== '' && gzwrite($target, $chunk) !== strlen($chunk))) {
                $complete = false;
                break;
            }
        }
    }
    if ($source) {
        fclose($source);
    }
    if ($target) {
        $complete = gzclose($target) && $complete;
    }
    if ($complete && ($smaller = filesize($compressed)) > 0 && $smaller < $bytes * .95 && rename($compressed, $path)) {
        $encoding = 'gzip';
        $stored = $smaller;
        chmod($path, 0600);
    }
    if (is_file($compressed)) {
        unlink($compressed);
    }
    try {
        $saved = doa_run($db, 'INSERT INTO attachments(id,owner,name,mime,bytes,stored,encoding,created)
            SELECT ?,?,?,?,?,?,?,? WHERE (SELECT COALESCE(SUM(stored),0) FROM attachments) + ? <= 524288000',
            [$id,$user,$name,$mime,$bytes,$stored,$encoding,time(),$stored]);
        if (!$saved->rowCount()) {
            unlink($path);
            doa_json(['error' => 'The 500 MB attachment limit has been reached. Empty finished files from Trash.'], 409);
        }
    } catch (Throwable $exception) {
        unlink($path);
        throw $exception;
    }
    doa_json(['ok' => true, 'name' => $name, 'stored' => $stored, 'bytes' => $bytes], 201);
} catch (Throwable $exception) {
    error_log('DOA Back Office attachment storage unavailable');
    doa_json(['error' => 'File storage temporarily unavailable.'], 503);
}
