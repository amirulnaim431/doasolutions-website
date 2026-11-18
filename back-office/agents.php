<?php
declare(strict_types=1);
require_once __DIR__ . '/bootstrap.php';
doa_start();
doa_require_user(true);
session_write_close();
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    doa_json(['error' => 'Method not allowed.'], 405);
}
doa_json(['agents' => doa_agents()]);
