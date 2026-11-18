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
  <?php if ($user && $operations) : ?>
    <link rel="stylesheet" href="/back-office/task-board.css?v=1">
    <link rel="stylesheet" href="/back-office/chat.css?v=1">
    <link rel="stylesheet" href="/back-office/agents.css?v=3">
    <link rel="stylesheet" href="/back-office/operations.css?v=3">
    <link rel="stylesheet" href="/back-office/operations-controls.css?v=2">
  <?php endif; ?>
  <?php if (!$user) : ?>
    <link rel="stylesheet" href="/back-office/login-space.css?v=1">
    <script src="/back-office/login-space.js?v=1" defer></script>
  <?php endif; ?>
</head>
<body class="bo-page" data-page="<?= doa_e($page) ?>" data-user="<?= doa_e($user['username'] ?? '') ?>">
<?php if (!$user) : ?>
  <main class="bo-login">
    <section class="bo-login-brand">
      <div class="bo-login-space" aria-hidden="true">
        <canvas></canvas><canvas></canvas><canvas></canvas>
      </div>
      <a href="/" aria-label="DOA Solutions website"><img src="/wp-content/themes/doa-astra-child/assets/images/doa-logo-128.fb0dbfeda9d9.webp" width="84" height="84" alt="DOA Solutions"></a>
      <h1>DOA Back Office</h1>
      <p>A shared workspace for finance and operations.</p>
    </section>
    <section class="bo-login-area">
      <form method="post" class="bo-login-form">
        <?php doa_theme_toggle(); ?>
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
      <?php if ($operations) : ?><div class="bo-orbit-strip" aria-hidden="true"><div class="bo-orbit-track"><i></i></div><div class="bo-planet"></div></div><?php endif; ?>
      <header class="bo-top">
        <div><h1><?= $operations ? 'Operations' : 'Dashboard' ?></h1>
          <?php if (!$operations) : ?><p>Welcome, <?= doa_e($user['name']) ?></p><?php endif; ?>
        </div>
        <div class="bo-top-actions">
          <?php doa_theme_toggle(); ?>
          <?php if ($operations) : ?><button id="bo-motion" type="button" aria-pressed="false" hidden>Motion off</button><?php endif; ?>
          <div id="bo-presence" class="bo-presence" aria-label="Team online status">Checking who’s online…</div>
          <?php if ($operations) : ?><button id="bo-open-files" type="button" aria-controls="bo-shared-files" aria-expanded="false">Shared Files</button><?php endif; ?>
          <button class="bo-primary" id="bo-new-task" type="button">+ Add task</button>
        </div>
      </header>
      <p id="bo-error" class="bo-error" role="alert" hidden></p>
      <?php if ($operations) : ?>
        <section class="bo-panel bo-shared-files" id="bo-shared-files" aria-labelledby="bo-files-title" hidden>
          <header class="bo-panel-head"><div><h2 id="bo-files-title">Shared Files</h2><p id="bo-storage-used"></p></div>
            <button class="bo-primary" id="bo-manager-upload" type="button">Upload files</button>
          </header>
          <input id="bo-file-search" type="search" aria-label="Search shared files" placeholder="Search shared files…">
          <p id="bo-manager-progress" role="status"></p>
          <div id="bo-file-list" class="bo-file-list"></div>
          <button id="bo-file-trash" type="button" aria-expanded="false">Trash</button>
          <div id="bo-trash-list" class="bo-trash-list" hidden></div>
        </section>
        <div class="bo-operations">
          <div class="bo-operation-main">
            <section class="bo-panel">
              <header class="bo-panel-head"><h2><?= doa_icon('tasks') ?> Tasks &amp; plan</h2>
                <div class="bo-task-views" role="group" aria-label="Task view">
                  <button type="button" data-task-view="board" aria-pressed="false">Board</button>
                  <button type="button" data-task-view="dates" aria-pressed="false">By due date</button>
                </div>
              </header>
              <div class="bo-task-filters">
                <input id="bo-task-search" type="search" placeholder="Search tasks…" aria-label="Search tasks">
                <select id="bo-task-owner" aria-label="Task assignee">
                  <option value="all">Everyone</option><option value="<?= doa_e($user['username']) ?>">Mine</option>
                  <?php foreach (DOA_USERS as $key => $name) : if ($key !== $user['username']) : ?>
                    <option value="<?= doa_e($key) ?>"><?= doa_e($name) ?></option>
                  <?php endif; endforeach; ?>
                </select>
                <select id="bo-period" aria-label="Task period"><option value="all">All dates</option><option value="week">This week + overdue</option><option value="overdue">Overdue</option></select>
              </div>
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
                <div class="bo-doodle-settings">
                  <label id="bo-ink-settings">Ink color
                    <select id="bo-ink-color">
                      <option value="#07643d">Green</option><option value="#172536">Ink</option>
                      <option value="#2866bd">Blue</option><option value="#b92c45">Red</option>
                      <option value="#7f409b">Purple</option><option value="#cf760d">Orange</option>
                    </select>
                  </label>
                  <label id="bo-eraser-settings" hidden>Eraser size
                    <input id="bo-eraser-size" type="range" min="8" max="100" value="27" aria-describedby="bo-eraser-value">
                    <output id="bo-eraser-value" for="bo-eraser-size">27 px</output>
                  </label>
                </div>
                <canvas id="bo-doodle" aria-label="Shared freehand drawing board" width="720" height="540"></canvas>
              </section>
            </div>
            <section class="bo-panel bo-agent-roster" aria-labelledby="bo-agents-title">
              <header class="bo-panel-head"><div><h2 id="bo-agents-title">DOA Agency Desk</h2><p>Tell the Project Manager what you need in your Codex chat. The Project Manager selects specialists, tracks the work here, and reports progress in Automated Updates.</p></div></header>
              <p class="bo-agent-start">Start in <strong>DOA Agency Desk — Project Manager</strong> in Codex. Website chat messages do not start an AI session.</p>
              <details class="bo-agent-directory"><summary>Browse specialist agents <span id="bo-agent-count"></span></summary>
                <div class="bo-agent-filters"><input id="bo-agent-search" type="search" placeholder="Search agents and specialties…" aria-label="Search agents"><select id="bo-agent-division" aria-label="Agent division"><option value="all">All divisions</option></select></div>
                <div id="bo-agent-list" class="bo-agent-list" aria-live="polite"></div>
              </details>
            </section>
          </div>
          <section class="bo-panel bo-chat">
            <header>
              <div class="bo-communication-switch" role="group" aria-label="Communication feeds">
                <button type="button" data-bo-feed="team" aria-pressed="true" aria-controls="bo-messages bo-chat-composer">Team Chat</button>
                <button type="button" data-bo-feed="updates" aria-pressed="false" aria-controls="bo-updates">Automated Updates</button>
              </div>
            </header>
            <div id="bo-messages" class="bo-messages" role="log" aria-label="Team Chat messages"></div>
            <div id="bo-updates" class="bo-messages" role="log" aria-label="Automated Updates" hidden></div>
            <div id="bo-chat-composer">
            <form id="bo-chat-form" class="bo-chat-form">
              <button id="bo-pick-file" type="button" aria-label="Attach a file" title="Attach a file">＋</button>
              <input name="body" aria-label="Message" placeholder="Write a message…" required maxlength="2400">
              <button class="bo-primary" type="submit">Send</button>
            </form>
            <div class="bo-file-actions">
              <input id="bo-file-input" type="file" hidden multiple>
              <span id="bo-file-status" role="status">Drop files here · Up to 3 GB per file</span>
            </div>
            </div>
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
            <section class="bo-panel">
              <header class="bo-panel-head"><h2>Recent messages</h2><a href="/back-office/?page=operations#bo-chat-form">Open chat →</a></header>
              <div id="bo-recent" class="bo-list"></div>
            </section>
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
        <label>Specialist agent <select name="agent_id" id="bo-task-agent"><option value="">No agent assigned</option></select></label>
        <label>Result or evidence <textarea name="outcome" maxlength="4000" rows="3" placeholder="Required before an agent task is marked done"></textarea></label>
        <label>Reporting as <select name="reporter"><option value="human">Me</option><option value="codex">Codex</option></select></label>
        <p class="bo-form-help">This records who reported the result. Agents do not run automatically in this version.</p>
      <p id="bo-task-error" class="bo-error" role="alert" hidden></p>
      <div class="bo-dialog-actions"><button type="button" id="bo-copy-task">Copy for Codex</button><button type="button" id="bo-cancel-task">Cancel</button><button type="submit" class="bo-primary">Save task</button></div>
    </form>
  </dialog>
  <?php if ($operations) : ?>
    <template id="bo-message-trash-icon">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 6h18m-16 0 1 14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1l1-14M9 6V3h6v3m-5 4v7m4-7v7"/>
      </svg>
    </template>
    <dialog id="bo-message-delete-dialog" class="bo-dialog bo-message-delete-dialog" aria-labelledby="bo-message-delete-title" aria-describedby="bo-message-delete-description">
      <div class="bo-black-hole-scene" aria-hidden="true">
        <div class="bo-black-hole">
          <span class="bo-black-hole-ring"></span>
          <span class="bo-black-hole-core"></span>
        </div>
      </div>
      <form class="bo-delete-message-form">
        <h2 id="bo-message-delete-title">Delete this message?</h2>
        <p id="bo-message-delete-description">It’ll disappear from Team chat for everyone.</p>
        <p id="bo-message-delete-error" class="bo-delete-message-error" role="alert" hidden></p>
        <div class="bo-delete-message-actions">
          <button type="button" id="bo-cancel-message-delete" autofocus>Cancel</button>
          <button type="submit" id="bo-confirm-message-delete">Delete for everyone</button>
        </div>
      </form>
    </dialog>
  <?php endif; ?>
  <script src="/back-office/app.js?v=20261118.7" defer></script>
<?php endif; ?>
</body>
</html>
