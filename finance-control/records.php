<?php
require_once dirname(__DIR__) . '/back-office/bootstrap.php';
doa_start();
doa_require_user(true);
$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'POST') {
    doa_verify_write();
} elseif ($method !== 'GET') {
    doa_json(['error' => 'Method not allowed.'], 405);
}
session_write_close();

function doa_bank_snapshot(PDO $db): array {
    $data = ['transactions' => [], 'uploads' => []];
    $rows = doa_run($db, 'SELECT * FROM bank_records ORDER BY rowid DESC')->fetchAll(PDO::FETCH_ASSOC);
    foreach ($rows as $row) {
        $item = json_decode($row['payload'], true);
        $item['version'] = $row['version'];
        $data[$row['kind']][] = $item;
    }
    return $data;
}

function doa_bank_insert(PDO $db, string $kind, array $rows): void {
    foreach ($rows as $row) {
        if (!is_array($row) || !is_string($row['id'] ?? null) || !preg_match('/^[A-Za-z0-9_-]{1,96}$/D', $row['id'])) {
            throw new InvalidArgumentException('A saved record has an invalid ID.');
        }
        unset($row['rawContent'], $row['version']);
        $payload = json_encode($row, JSON_INVALID_UTF8_SUBSTITUTE | JSON_THROW_ON_ERROR);
        if (strlen($payload) > 12000) {
            throw new InvalidArgumentException('A saved record is too large.');
        }
        doa_run($db, 'INSERT OR IGNORE INTO bank_records(kind,id,payload) VALUES(?,?,?)', [$kind, $row['id'], $payload]);
    }
}

try {
    $db = doa_db();
    if ($method === 'GET') {
        doa_json(doa_bank_snapshot($db));
    }
    $raw = file_get_contents('php://input', false, null, 0, 5000001);
    $input = json_decode($raw, true);
    if (strlen($raw) > 5000000 || !is_array($input)) {
        doa_json(['error' => 'Invalid or oversized request.'], 400);
    }
    if (($input['action'] ?? '') === 'add') {
        $transactions = $input['transactions'] ?? [];
        $uploads = $input['uploads'] ?? [];
        if (!is_array($transactions) || !is_array($uploads) || count($transactions) > 5000 || count($uploads) > 1000) {
            doa_json(['error' => 'Too many rows for one import.'], 422);
        }
        $db->beginTransaction();
        doa_bank_insert($db, 'uploads', array_reverse($uploads));
        doa_bank_insert($db, 'transactions', array_reverse($transactions));
        $db->commit();
    } elseif (($input['action'] ?? '') === 'review') {
        $row = doa_run($db, "SELECT payload,version FROM bank_records WHERE kind='transactions' AND id=?", [$input['id'] ?? ''])->fetch(PDO::FETCH_ASSOC);
        $field = $input['field'] ?? '';
        $value = $input['value'] ?? '';
        if (!$row || !in_array($field, ['status','note'], true) || !is_string($value) || strlen($value) > 4000) {
            doa_json(['error' => 'Invalid review update.'], 422);
        }
        $item = json_decode($row['payload'], true);
        $item[$field] = $value;
        $changed = doa_run($db, "UPDATE bank_records SET payload=?,version=version+1 WHERE kind='transactions' AND id=? AND version=?", [json_encode($item), $input['id'], (int) ($input['version'] ?? 0)]);
        if (!$changed->rowCount()) {
            doa_json(['error' => 'This transaction changed. Copy your edit and refresh before retrying.'], 409);
        }
    } else {
        doa_json(['error' => 'Unknown action.'], 400);
    }
    doa_json(doa_bank_snapshot($db));
} catch (Throwable $exception) {
    if (isset($db) && $db->inTransaction()) {
        $db->rollBack();
    }
    if ($exception instanceof InvalidArgumentException) {
        doa_json(['error' => $exception->getMessage()], 422);
    }
    error_log('DOA Finance reconciliation storage unavailable');
    doa_json(['error' => 'Shared Finance records are unavailable.'], 503);
}
