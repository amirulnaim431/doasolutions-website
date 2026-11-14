<?php
require_once __DIR__ . '/bootstrap.php';
doa_start();
$user = doa_require_user(true)['username'];
$session = hash('sha256', session_id());
$post = $_SERVER['REQUEST_METHOD'] === 'POST';
if ($post) {
    doa_verify_write();
} elseif ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    doa_json(['error' => 'Method not allowed.'], 405);
}
session_write_close();

function doa_body(int $limit): array {
    $raw = file_get_contents('php://input', false, null, 0, $limit + 1);
    $data = json_decode($raw, true);
    if (strlen($raw) > $limit || !is_array($data)) {
        doa_json(['error' => 'Invalid or oversized request.'], 400);
    }
    return $data;
}

function doa_input_text(mixed $value, int $max): string {
    if (!is_string($value) || strlen($value) > $max) {
        doa_json(['error' => 'A field is invalid or too long.'], 422);
    }
    return trim($value);
}

function doa_id(mixed $value): string {
    if (!is_string($value) || !preg_match('/^[a-zA-Z0-9_-]{1,96}$/D', $value)) {
        doa_json(['error' => 'Invalid record ID.'], 422);
    }
    return $value;
}

function doa_invoice_balance(): ?int {
    $path = dirname(__DIR__) . '/finance-control/uploads/sales-documents/company.json';
    if (!is_file($path)) {
        return 0;
    }
    $file = fopen($path, 'rb');
    if (!$file || !flock($file, LOCK_SH)) {
        return null;
    }
    $data = json_decode(stream_get_contents($file), true);
    fclose($file);
    if (!is_array($data['documents'] ?? null)) {
        return null;
    }
    $balance = 0;
    foreach ($data['documents'] as $doc) {
        if (($doc['type'] ?? '') !== 'invoice' || in_array($doc['status'] ?? '', ['Draft', 'Void', 'Voided', 'Cancelled'], true)) {
            continue;
        }
        $total = 0;
        foreach (($doc['items'] ?? []) as $line) {
            $base = (int) round((float) ($line['quantity'] ?? 0) * (int) ($line['unitPriceCents'] ?? 0));
            $net = max(0, $base - (int) ($line['discountCents'] ?? 0));
            $total += $net + (int) round($net * (float) ($line['taxRate'] ?? 0) / 100);
        }
        $total = max(0, $total - (int) ($doc['documentDiscountCents'] ?? 0) + (int) ($doc['adjustmentCents'] ?? 0));
        $paid = (int) ($doc['amountPaidCents'] ?? 0);
        if (!empty($doc['installmentPlan']['enabled'])) {
            $total = (int) ($doc['installmentPlan']['totalAmountCents'] ?? 0) ?: $total;
            $paid = max($paid, (int) ($doc['installmentPlan']['paidToDateCents'] ?? 0));
        }
        foreach (($doc['payments'] ?? []) as $payment) {
            $paid += (int) ($payment['amountCents'] ?? 0);
        }
        $balance += max(0, $total - $paid);
    }
    return $balance;
}

function doa_workspace(PDO $db, string $user, string $session): array {
    $strokes = doa_run($db, 'SELECT id, owner, tool, points FROM strokes ORDER BY rowid')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($strokes as &$stroke) {
        $stroke['points'] = json_decode($stroke['points'], true);
    }
    unset($stroke);
    return [
        'tasks' => doa_run($db, 'SELECT * FROM tasks ORDER BY due="",due,rowid')->fetchAll(PDO::FETCH_ASSOC),
        'messages' => doa_run($db, 'SELECT * FROM (SELECT id,owner,body,created FROM messages ORDER BY id DESC LIMIT 100) ORDER BY id')->fetchAll(PDO::FETCH_ASSOC),
        'attachments' => doa_run($db, 'SELECT id,owner,name,mime,bytes,stored,created,deleted FROM attachments ORDER BY rowid')->fetchAll(PDO::FETCH_ASSOC),
        'note' => doa_run($db, 'SELECT body,version FROM notes WHERE id=1')->fetch(PDO::FETCH_ASSOC),
        'strokes' => $strokes,
        'presence' => doa_presence($db, $user, $session),
        'balance' => doa_invoice_balance(),
        'today' => date('Y-m-d'),
        'weekStart' => date('Y-m-d', strtotime('monday this week')),
        'weekEnd' => date('Y-m-d', strtotime('sunday this week')),
    ];
}

function doa_save_task(PDO $db, array $data): void {
    $id = doa_id($data['id'] ?? null);
    $title = doa_input_text($data['title'] ?? null, 720);
    $owner = doa_input_text($data['owner'] ?? null, 64);
    $status = $data['status'] ?? '';
    $due = doa_input_text($data['due'] ?? '', 10);
    $date = $due === '' ? null : DateTimeImmutable::createFromFormat('!Y-m-d', $due);
    if ($title === '' || !isset(DOA_USERS[$owner]) || !in_array($status, ['todo', 'doing', 'done'], true)
        || ($due !== '' && (!$date || $date->format('Y-m-d') !== $due))) {
        doa_json(['error' => 'Enter a task, owner, status, and valid date.'], 422);
    }
    $version = (int) ($data['version'] ?? 0);
    $stmt = $version > 0
        ? doa_run($db, 'UPDATE tasks SET title=?,owner=?,due=?,status=?,version=version+1 WHERE id=? AND version=?', [$title,$owner,$due,$status,$id,$version])
        : doa_run($db, 'INSERT OR IGNORE INTO tasks(id,title,owner,due,status) VALUES(?,?,?,?,?)', [$id,$title,$owner,$due,$status]);
    if ($stmt->rowCount() === 0) {
        doa_json(['error' => 'This task changed. Reopen it to see the latest version.'], 409);
    }
}

function doa_save_stroke(PDO $db, string $user, array $data): void {
    $id = doa_id($data['id'] ?? null);
    $tool = $data['tool'] ?? '';
    $points = $data['points'] ?? [];
    if (!in_array($tool, ['pen', 'highlight', 'eraser'], true) || !is_array($points) || count($points) < 1 || count($points) > 800) {
        doa_json(['error' => 'Invalid drawing stroke.'], 422);
    }
    foreach ($points as $point) {
        if (!is_array($point) || count($point) !== 2 || !isset($point[0], $point[1])) {
            doa_json(['error' => 'Invalid drawing point.'], 422);
        }
        foreach ($point as $coord) {
            if ((!is_int($coord) && !is_float($coord)) || $coord < 0 || $coord > 1) {
                doa_json(['error' => 'Invalid drawing point.'], 422);
            }
        }
    }
    doa_run($db, 'INSERT OR IGNORE INTO strokes SELECT ?,?,?,?,? WHERE (SELECT COUNT(*) FROM strokes) < 2500', [$id,$user,$tool,json_encode($points),time()]);
    if (!doa_run($db, 'SELECT 1 FROM strokes WHERE id=?', [$id])->fetchColumn()) {
        doa_json(['error' => 'The drawing board is full. Undo a recent stroke to continue.'], 409);
    }
}

try {
    $db = doa_db();
    if (!$post) {
        doa_json(doa_workspace($db, $user, $session));
    }
    $data = doa_body(130000);
    switch ($data['action'] ?? '') {
        case 'task':
            doa_save_task($db, $data);
            break;
        case 'message':
            $body = doa_input_text($data['body'] ?? null, 9600);
            if ($body === '') {
                doa_json(['error' => 'Enter a message.'], 422);
            }
            doa_run($db, 'INSERT OR IGNORE INTO messages(client_id,owner,body,created) VALUES(?,?,?,?)', [doa_id($data['id'] ?? null),$user,$body,time()]);
            break;
        case 'note':
            $note = doa_input_text($data['body'] ?? null, 64000);
            $stmt = doa_run($db, 'UPDATE notes SET body=?,version=version+1 WHERE id=1 AND version=?', [$note,(int) ($data['version'] ?? -1)]);
            if ($stmt->rowCount() === 0) {
                doa_json(['error' => 'The note was updated by someone else. Copy your draft before loading the latest note.'], 409);
            }
            break;
        case 'stroke':
            doa_save_stroke($db, $user, $data);
            break;
        case 'undo':
            doa_run($db, 'DELETE FROM strokes WHERE id=? AND owner=?', [doa_id($data['id'] ?? null),$user]);
            break;
        case 'trash-file':
            doa_run($db, 'UPDATE attachments SET deleted=?,deleted_by=? WHERE id=? AND deleted IS NULL', [time(),$user,doa_id($data['id'] ?? null)]);
            break;
        case 'restore-file':
            doa_run($db, 'UPDATE attachments SET deleted=NULL,deleted_by=NULL WHERE id=?', [doa_id($data['id'] ?? null)]);
            break;
        default:
            doa_json(['error' => 'Unknown action.'], 400);
    }
    doa_json(doa_workspace($db, $user, $session));
} catch (Throwable $exception) {
    error_log('DOA Back Office workspace storage unavailable');
    doa_json(['error' => 'Workspace temporarily unavailable. Please retry.'], 503);
}
