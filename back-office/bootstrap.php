<?php
declare(strict_types=1);

date_default_timezone_set('Asia/Kuala_Lumpur');

const DOA_USERS = ['oun' => 'Oun', 'azim_aziz' => 'Azim Aziz'];

function doa_start(): void {
    header('Cache-Control: private, no-store, max-age=0');
    header('X-Robots-Tag: noindex, nofollow');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: same-origin');
    ini_set('session.use_strict_mode', '1');
    session_set_cookie_params([
        'path' => '/', 'httponly' => true, 'samesite' => 'Lax',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    ]);
    session_start();
}

function doa_e(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function doa_csrf(): string {
    return $_SESSION['doa_csrf'] ??= bin2hex(random_bytes(32));
}

function doa_user(): ?array {
    $key = $_SESSION['doa_finance_user']['username'] ?? '';
    if (!isset(DOA_USERS[$key]) || ($_SESSION['doa_last_active'] ?? 0) < time() - 28800) {
        return null;
    }
    $_SESSION['doa_last_active'] = time();
    return ['username' => $key, 'name' => DOA_USERS[$key]];
}

function doa_require_user(bool $json = false): array {
    $user = doa_user();
    if ($user) {
        return $user;
    }
    if ($json) {
        doa_json(['error' => 'Please sign in again.'], 401);
    }
    $next = (string) ($_SERVER['REQUEST_URI'] ?? '/back-office/');
    header('Location: /back-office/?next=' . rawurlencode($next), true, 303);
    exit;
}

function doa_target(string $next): string {
    $allowed = ['/back-office/', '/back-office/?page=operations', '/finance-control/', '/finance-control/showcase/quotation-invoice/'];
    return in_array($next, $allowed, true) ? $next : '/back-office/';
}

function doa_json(array $data, int $status = 200): never {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function doa_verify_write(bool $json = true): void {
    $sent = $_SERVER['HTTP_X_DOA_CSRF'] ?? $_POST['_csrf'] ?? '';
    $token = $_SESSION['doa_csrf'] ?? '';
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && is_string($sent) && $token !== '' && hash_equals($token, $sent)) {
        return;
    }
    if ($json) {
        doa_json(['error' => 'Refresh this page and try again.'], 403);
    }
    http_response_code(403);
    exit('Refresh this page and try again.');
}

function doa_db(): PDO {
    static $db;
    if ($db) {
        return $db;
    }
    $dir = doa_data_directory();
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('Workspace storage unavailable.');
    }
    $db = new PDO('sqlite:' . $dir . '/workspace.sqlite', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA busy_timeout = 5000');
    $db->exec('CREATE TABLE IF NOT EXISTS tasks (id TEXT PRIMARY KEY, title TEXT NOT NULL, owner TEXT NOT NULL, due TEXT NOT NULL, status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1);
        CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, client_id TEXT UNIQUE NOT NULL, owner TEXT NOT NULL, body TEXT NOT NULL, created INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY CHECK(id=1), body TEXT NOT NULL, version INTEGER NOT NULL);
        INSERT OR IGNORE INTO notes VALUES (1, "", 0);
        CREATE TABLE IF NOT EXISTS strokes (id TEXT PRIMARY KEY, owner TEXT NOT NULL, tool TEXT NOT NULL, points TEXT NOT NULL, created INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS presence (user TEXT NOT NULL, session TEXT NOT NULL, seen INTEGER NOT NULL, PRIMARY KEY(user, session));
        CREATE TABLE IF NOT EXISTS attempts (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
        CREATE TABLE IF NOT EXISTS credentials (user TEXT PRIMARY KEY, hash TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS attachments (id TEXT PRIMARY KEY, owner TEXT NOT NULL, name TEXT NOT NULL, mime TEXT NOT NULL, bytes INTEGER NOT NULL, stored INTEGER NOT NULL, encoding TEXT NOT NULL, created INTEGER NOT NULL, deleted INTEGER, deleted_by TEXT);
        CREATE TABLE IF NOT EXISTS bank_records (kind TEXT NOT NULL, id TEXT NOT NULL, payload TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, PRIMARY KEY(kind,id));');
    $db->exec('CREATE TABLE IF NOT EXISTS task_agents (task_id TEXT PRIMARY KEY, agent_id TEXT NOT NULL, outcome TEXT NOT NULL DEFAULT "", updated_by TEXT NOT NULL, updated_at INTEGER NOT NULL)');
    return $db;
}

function doa_agents(): array {
    static $agents;
    if ($agents === null) {
        $data = require __DIR__ . '/agents-data.php';
        $agents = is_array($data) ? $data : [];
    }
    return $agents;
}

function doa_agent(string $id): ?array {
    foreach (doa_agents() as $agent) {
        if ($agent['id'] === $id) return $agent;
    }
    return null;
}

function doa_data_directory(): string {
    return getenv('DOA_BACK_OFFICE_DATA') ?: dirname(__DIR__, 2) . '/.doa-back-office';
}

function doa_run(PDO $db, string $sql, array $args = []): PDOStatement {
    $stmt = $db->prepare($sql);
    $stmt->execute($args);
    return $stmt;
}

function doa_login(string $username, string $password): bool {
    $db = doa_db();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $bucket = hash('sha256', $ip);
    $now = time();
    doa_run($db, 'DELETE FROM attempts WHERE expires <= ?', [$now]);
    doa_run($db, 'INSERT INTO attempts VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET count = count+1', [$bucket, $now + 900]);
    if ((int) doa_run($db, 'SELECT count FROM attempts WHERE bucket = ?', [$bucket])->fetchColumn() > 10) {
        return false;
    }
    $path = getenv('DOA_BACK_OFFICE_DATA') ? __DIR__ . '/accounts.local.php' : dirname(__DIR__, 2) . '/doa-back-office-accounts.php';
    $accounts = is_file($path) ? require $path : [];
    if (!isset(DOA_USERS[$username], $accounts[$username]) || strlen($password) > 1024) {
        return false;
    }
    $hash = doa_run($db, 'SELECT hash FROM credentials WHERE user = ?', [$username])->fetchColumn();
    $valid = $hash ? password_verify($password, $hash)
        : hash_equals($accounts[$username]['password_hash'], hash('sha256', $password));
    if (!$valid) {
        return false;
    }
    if (!$hash) {
        doa_run($db, 'INSERT OR IGNORE INTO credentials VALUES (?,?)', [$username, password_hash($password, PASSWORD_DEFAULT)]);
    }
    session_regenerate_id(true);
    $_SESSION = ['doa_finance_user' => ['username' => $username, 'name' => DOA_USERS[$username]], 'doa_last_active' => $now];
    doa_run($db, 'DELETE FROM attempts WHERE bucket = ?', [$bucket]);
    return true;
}

function doa_presence(PDO $db, string $user, string $session): array {
    $now = time();
    doa_run($db, 'DELETE FROM presence WHERE seen < ?', [$now - 90]);
    doa_run($db, 'INSERT INTO presence VALUES (?,?,?) ON CONFLICT(user,session) DO UPDATE SET seen=excluded.seen', [$user, $session, $now]);
    $online = doa_run($db, 'SELECT DISTINCT user FROM presence')->fetchAll(PDO::FETCH_COLUMN);
    return array_map(static fn($key, $name) => ['id' => $key, 'name' => $name, 'online' => in_array($key, $online, true)], array_keys(DOA_USERS), array_values(DOA_USERS));
}

function doa_styles(): void {
    echo '<script src="/back-office/theme.js?v=1"></script>';
    echo '<link rel="stylesheet" href="/back-office/style.css?v=20261114.4">';
}

function doa_theme_toggle(): void {
    echo '<button type="button" class="bo-theme-toggle" data-bo-theme>Night mode</button>';
}

function doa_sidebar(string $active): void {
    $user = doa_user();
    ?>
    <aside class="bo-sidebar">
      <a class="bo-brand" href="/back-office/">
        <img src="/wp-content/themes/doa-astra-child/assets/images/doa-logo-128.fb0dbfeda9d9.webp" width="43" height="43" alt="">
        <span><strong>DOA Solutions</strong><small>Back office</small></span>
      </a>
      <nav aria-label="Back office">
      <?php foreach (['dashboard' => ['Dashboard', '/back-office/', 'home'], 'finance' => ['DOA Finance', '/finance-control/', 'finance'], 'operations' => ['Operations', '/back-office/?page=operations', 'tasks']] as $key => [$label, $url, $icon]) : ?>
        <a href="<?= doa_e($url) ?>" <?= $active === $key ? 'aria-current="page"' : '' ?>><?= doa_icon($icon) ?><?= doa_e($label) ?></a>
      <?php endforeach; ?>
      </nav>
      <div class="bo-account">
        <span class="bo-avatar" aria-hidden="true"><?= doa_e(substr($user['name'], 0, 1)) ?></span>
        <strong><?= doa_e($user['name']) ?></strong>
        <form method="post" action="/back-office/">
          <input type="hidden" name="_csrf" value="<?= doa_e(doa_csrf()) ?>">
          <button name="action" value="logout" type="submit">Sign out</button>
        </form>
      </div>
    </aside>
    <?php
}

function doa_finance_tabs(string $active): void {
    ?>
    <div class="bo-finance-header"><h1>DOA Finance</h1><?php doa_theme_toggle(); ?></div>
    <nav class="bo-finance-tabs" aria-label="DOA Finance">
      <a href="/finance-control/" <?= $active === 'bank' ? 'aria-current="page"' : '' ?>>Bank Reconciliation</a>
      <a href="/finance-control/showcase/quotation-invoice/" <?= $active === 'sales' ? 'aria-current="page"' : '' ?>>Sales Documents</a>
    </nav>
    <?php
}

function doa_icon(string $name): string {
    $paths = [
        'home' => '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',
        'finance' => '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
        'tasks' => '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2M8 9h8m-8 4h8m-8 4h5"/>',
        'pen' => '<path d="m4 20 4-1 12-12-3-3L5 16l-1 4zm10-13 3 3"/>',
        'highlight' => '<path d="m4 18 5 2 11-11-5-5L4 15zm7-11 5 5M3 21h6"/>',
        'eraser' => '<path d="m4 15 9-10a2 2 0 0 1 3 0l4 4a2 2 0 0 1 0 3l-7 8H8zm5-5 8 7m-7 3h11"/>',
        'undo' => '<path d="m9 5-6 6 6 6m-6-6h12a5 5 0 0 1 0 10h-3"/>',
    ];
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' . $paths[$name] . '</svg>';
}
