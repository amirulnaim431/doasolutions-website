<?php
require_once __DIR__ . '/bootstrap.php';
doa_start();
$error = '';
$next = doa_target((string) ($_POST['next'] ?? $_GET['next'] ?? ''));
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    doa_verify_write(false);
    if (($_POST['action'] ?? '') === 'logout') {
        try {
            if ($user = doa_user()) {
                doa_run(doa_db(), 'DELETE FROM presence WHERE user = ? AND session = ?', [$user['username'], hash('sha256', session_id())]);
            }
        } catch (Throwable $exception) {
            error_log('DOA Back Office could not update presence at sign-out');
        }
        $_SESSION = [];
        session_destroy();
        header('Location: /back-office/', true, 303);
        exit;
    }
    try {
        if (doa_login(strtolower(trim((string) ($_POST['username'] ?? ''))), (string) ($_POST['password'] ?? ''))) {
            header('Location: ' . $next, true, 303);
            exit;
        }
        $error = 'Sign-in failed. Check your username and password, or try again in a few minutes.';
    } catch (Throwable $exception) {
        error_log('DOA Back Office sign-in storage unavailable');
        $error = 'Sign-in is temporarily unavailable. Please try again.';
    }
}
$user = doa_user();
$operations = ($_GET['page'] ?? '') === 'operations';
$page = $operations ? 'operations' : 'dashboard';
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="doa-csrf" content="<?= doa_e(doa_csrf()) ?>">
  <title><?= $user ? ($operations ? 'Operations' : 'Dashboard') : 'Sign in' ?> | DOA Back Office</title>
  <?php doa_styles(); ?>
</head>
<body class="bo-page" data-page="<?= doa_e($page) ?>" data-user="<?= doa_e($user['username'] ?? '') ?>">
<?php if (!$user) : ?>
  <main class="bo-login">
    <section class="bo-login-brand">
      <a href="/" aria-label="DOA Solutions website"><img src="/wp-content/themes/doa-astra-child/assets/images/doa-logo-128.fb0dbfeda9d9.webp" width="84" height="84" alt="DOA Solutions"></a>
      <h1>DOA Back Office</h1>
      <p>A shared workspace for finance and operations.</p>
    </section>
    <section class="bo-login-area">
      <form method="post" class="bo-login-form">
        <h2>Sign in</h2>
        <input type="hidden" name="_csrf" value="<?= doa_e(doa_csrf()) ?>">
        <input type="hidden" name="next" value="<?= doa_e($next) ?>">
        <label>Username <input name="username" autocomplete="username" required maxlength="64" autofocus></label>
        <label>Password <input type="password" name="password" autocomplete="current-password" required maxlength="1024"></label>
        <?php if ($error) : ?><p role="alert" class="bo-error"><?= doa_e($error) ?></p><?php endif; ?>
        <button class="bo-primary" type="submit">Sign in</button>
        <a href="/">Back to DOA Solutions</a>
      </form>
    </section>
  </main>
<?php else : ?>
  <div class="bo-shell">
    <?php doa_sidebar($page); ?>
    <main class="bo-content">
      <header class="bo-top">
        <div><h1><?= $operations ? 'Operations' : 'Dashboard' ?></h1>
          <?php if (!$operations) : ?><p>Welcome, <?= doa_e($user['name']) ?></p><?php endif; ?>
        </div>
        <div class="bo-top-actions">
          <div id="bo-presence" class="bo-presence" aria-label="Team online status">Checking who’s online…</div>
          <button class="bo-primary" id="bo-new-task" type="button">+ Add task</button>
        </div>
      </header>
      <p id="bo-error" class="bo-error" role="alert" hidden></p>
      <?php if ($operations) : ?>
        <div class="bo-operations">
          <div class="bo-operation-main">
            <section class="bo-panel">
              <header class="bo-panel-head"><h2>Tasks &amp; plan</h2>
                <select id="bo-period" aria-label="Task period"><option value="all">All tasks</option><option value="week">This week</option><option value="overdue">Overdue</option></select>
              </header>
              <div id="bo-board" class="bo-board" aria-label="Task board"></div>
            </section>
            <div class="bo-workpads">
              <section class="bo-panel bo-notes">
                <header class="bo-panel-head"><h2>Shared notes</h2><span id="bo-note-status" role="status"></span></header>
                <textarea id="bo-note" aria-label="Shared notes" placeholder="Write a note for the team…" maxlength="16000" rows="9" disabled></textarea>
                <div class="bo-note-actions"><button id="bo-reload-note" type="button" hidden>Load latest note</button><button id="bo-save-note" type="button" disabled>Save note</button></div>
              </section>
              <section class="bo-panel">
                <header class="bo-panel-head"><h2>Doodle board</h2><span id="bo-doodle-status" role="status"></span></header>
                <div class="bo-tools" role="group" aria-label="Drawing tools">
                  <?php foreach (['pen' => 'Pen', 'highlight' => 'Highlighter', 'eraser' => 'Eraser'] as $key => $label) : ?>
                    <button type="button" data-tool="<?= $key ?>" aria-label="<?= $label ?>" title="<?= $label ?>" aria-pressed="<?= $key === 'pen' ? 'true' : 'false' ?>"><?= doa_icon($key) ?></button>
                  <?php endforeach; ?>
                  <button id="bo-undo" type="button" aria-label="Undo your last stroke" title="Undo your last stroke"><?= doa_icon('undo') ?></button>
                </div>
                <canvas id="bo-doodle" aria-label="Shared freehand drawing board" width="720" height="540"></canvas>
              </section>
            </div>
          </div>
          <section class="bo-panel bo-chat">
            <header><h2>Team chat</h2><p>Oun · Azim Aziz</p></header>
            <div id="bo-messages" class="bo-messages" role="log" aria-label="Chat messages"></div>
            <form id="bo-chat-form" class="bo-chat-form">
              <button id="bo-pick-file" type="button" aria-label="Attach a file" title="Attach a file">＋</button>
              <input name="body" aria-label="Message" placeholder="Write a message…" required maxlength="2400">
              <button class="bo-primary" type="submit">Send</button>
            </form>
            <div class="bo-file-actions">
              <input id="bo-file-input" type="file" hidden multiple>
              <span id="bo-file-status" role="status">Drop files here</span>
              <button id="bo-file-trash" type="button" aria-expanded="false">Trash</button>
            </div>
            <div id="bo-trash-list" class="bo-trash-list" hidden></div>
          </section>
        </div>
      <?php else : ?>
        <div class="bo-stats">
          <article class="bo-panel">Due today <strong id="bo-due">–</strong></article>
          <article class="bo-panel">In progress <strong id="bo-progress">–</strong></article>
          <article class="bo-panel">Awaiting payment <strong id="bo-balance">–</strong></article>
        </div>
        <div class="bo-dashboard">
          <section class="bo-panel"><h2>Upcoming tasks</h2><div id="bo-upcoming" class="bo-list"></div></section>
          <div class="bo-dashboard-side">
            <section class="bo-panel"><h2>Recent messages</h2><div id="bo-recent" class="bo-list"></div></section>
            <section class="bo-panel"><h2>Quick access</h2><div class="bo-list bo-links"><a href="/finance-control/"><?= doa_icon('finance') ?> DOA Finance <span>→</span></a><a href="/back-office/?page=operations"><?= doa_icon('tasks') ?> Operations <span>→</span></a></div></section>
          </div>
        </div>
      <?php endif; ?>
    </main>
  </div>
  <dialog id="bo-task-dialog" class="bo-dialog">
    <form id="bo-task-form">
      <h2 id="bo-task-heading">Add task</h2>
      <label>Task <input name="title" required maxlength="180"></label>
      <div class="bo-form-row">
        <label>Owner <select name="owner"><?php foreach (DOA_USERS as $key => $name) : ?><option value="<?= doa_e($key) ?>"><?= doa_e($name) ?></option><?php endforeach; ?></select></label>
        <label>Due date <input name="due" type="date"></label>
      </div>
      <label>Status <select name="status"><option value="todo">To do</option><option value="doing">In progress</option><option value="done">Done</option></select></label>
      <p id="bo-task-error" class="bo-error" role="alert" hidden></p>
      <div class="bo-dialog-actions"><button type="button" id="bo-cancel-task">Cancel</button><button type="submit" class="bo-primary">Save task</button></div>
    </form>
  </dialog>
  <script src="/back-office/app.js?v=20261114.2" defer></script>
<?php endif; ?>
</body>
</html>
