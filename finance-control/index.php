<?php
session_start();

$users = array(
	'oun' => array(
		'password' => '123',
		'name'     => 'Oun',
	),
	'azim_aziz' => array(
		'password' => '123',
		'name'     => 'Azim Aziz',
	),
);

if ( isset( $_GET['logout'] ) ) {
	$_SESSION = array();
	session_destroy();
	header( 'Location: ./' );
	exit;
}

$login_error = '';

if ( 'POST' === $_SERVER['REQUEST_METHOD'] ) {
	$username = isset( $_POST['username'] ) ? trim( $_POST['username'] ) : '';
	$password = isset( $_POST['password'] ) ? $_POST['password'] : '';

	if ( isset( $users[ $username ] ) && hash_equals( $users[ $username ]['password'], $password ) ) {
		$_SESSION['doa_finance_user'] = array(
			'username' => $username,
			'name'     => $users[ $username ]['name'],
		);
		header( 'Location: ./' );
		exit;
	}

	$login_error = 'Invalid username or password.';
}

$active_user = isset( $_SESSION['doa_finance_user'] ) ? $_SESSION['doa_finance_user'] : null;
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DOA Finance Control</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <main class="app-shell" data-user-name="<?php echo htmlspecialchars( $active_user['name'] ?? '', ENT_QUOTES, 'UTF-8' ); ?>">
      <?php if ( ! $active_user ) : ?>
        <section class="login-screen">
          <div class="login-card">
            <p class="eyebrow">Internal Finance Control</p>
            <h1>DOA Accounting Workspace</h1>
            <p class="intro">
              Beginner-friendly records for invoices, expenses, partner ledgers, and bank reconciliation.
            </p>

            <form class="login-form" method="post">
              <label>
                Username
                <input name="username" autocomplete="username" placeholder="oun" required />
              </label>
              <label>
                Password
                <input name="password" type="password" autocomplete="current-password" placeholder="123" required />
              </label>
              <p class="login-error" role="alert"><?php echo htmlspecialchars( $login_error, ENT_QUOTES, 'UTF-8' ); ?></p>
              <button type="submit">Enter finance app</button>
            </form>

            <div class="demo-users">
              <span>Access accounts</span>
              <code>oun / 123</code>
              <code>azim_aziz / 123</code>
            </div>
          </div>
        </section>
      <?php else : ?>
        <section class="dashboard">
          <aside class="sidebar">
            <div>
              <p class="brand-mark">DOA</p>
              <h2>Finance Control</h2>
              <p class="sidebar-note">Accounting for a small Malaysian IT partnership.</p>
            </div>

            <nav class="sidebar-nav" aria-label="Finance sections">
              <button class="is-active" data-section="reconciliation">Bank Reconciliation</button>
              <button data-section="dashboard">Dashboard</button>
              <button data-section="partnerLedger">Partner Ledger</button>
              <button data-section="reports">Reports</button>
              <button data-section="taxChecklist">Tax Checklist</button>
            </nav>

            <div class="sidebar-user">
              <span id="activeUserInitial"><?php echo htmlspecialchars( substr( $active_user['name'], 0, 1 ), ENT_QUOTES, 'UTF-8' ); ?></span>
              <div>
                <strong id="activeUserName"><?php echo htmlspecialchars( $active_user['name'], ENT_QUOTES, 'UTF-8' ); ?></strong>
                <small>Partner access</small>
              </div>
              <a class="logout-link" href="./?logout=1">Logout</a>
            </div>
          </aside>

          <section class="content">
            <header class="topbar">
              <div>
                <p class="eyebrow">Module 21</p>
                <h1>Bank statement import and reconciliation</h1>
                <p>
                  Bank reconciliation means checking whether money in the bank matches invoices,
                  payments, expenses, and partner ledger entries in the system.
                </p>
              </div>
              <div class="topbar-actions">
                <button id="exportButton" type="button">Export review CSV</button>
                <button id="resetDemoButton" type="button">Reset demo data</button>
              </div>
            </header>

            <section id="section-reconciliation" class="section is-visible">
              <div class="metrics-grid">
                <article class="metric-card">
                  <span>Money in</span>
                  <strong id="moneyInMetric">RM0.00</strong>
                  <small>Incoming payments detected</small>
                </article>
                <article class="metric-card">
                  <span>Money out</span>
                  <strong id="moneyOutMetric">RM0.00</strong>
                  <small>Outgoing payments detected</small>
                </article>
                <article class="metric-card">
                  <span>Needs review</span>
                  <strong id="reviewMetric">0</strong>
                  <small>Unknown or unmatched transactions</small>
                </article>
                <article class="metric-card">
                  <span>Ignored personal</span>
                  <strong id="ignoredMetric">0</strong>
                  <small>Excluded from business profit</small>
                </article>
              </div>

              <div class="work-grid">
                <section class="panel upload-panel">
                  <div class="panel-heading">
                    <div>
                      <p class="eyebrow">Upload monthly statement</p>
                      <h2>Import statement</h2>
                    </div>
                    <span id="parserStatus" class="status-badge neutral">CSV ready</span>
                  </div>

                  <div class="form-grid">
                    <label>
                      Account owner
                      <select id="accountOwner">
                        <option>DOA business account</option>
                        <option>Oun personal</option>
                        <option>Naim personal</option>
                        <option>Azim personal</option>
                      </select>
                    </label>
                    <label>
                      Account type
                      <select id="accountType">
                        <option>Business bank</option>
                        <option>Personal bank</option>
                        <option>Cash wallet</option>
                        <option>E-wallet</option>
                      </select>
                    </label>
                  </div>

                  <label class="file-drop">
                    <input id="statementFile" type="file" accept=".csv,.xlsx,.xls,.pdf" />
                    <span>Drop or choose CSV / Excel / PDF statement</span>
                    <small>CSV is parsed now. Excel/PDF files are stored for later parser review.</small>
                  </label>

                  <div class="sample-actions">
                    <button id="loadSampleButton" type="button">Load sample statement</button>
                    <button id="clearStatementButton" type="button">Clear imported rows</button>
                  </div>

                  <div class="explain-box">
                    <strong>Why personal statements are allowed</strong>
                    <p>
                      Partners sometimes pay business costs using personal accounts. Mark private spending as
                      <b>Personal transaction, ignore</b> so it does not affect DOA profit.
                    </p>
                  </div>
                </section>

                <section class="panel">
                  <div class="panel-heading">
                    <div>
                      <p class="eyebrow">Fallback</p>
                      <h2>Manual entry</h2>
                    </div>
                  </div>
                  <form id="manualForm" class="manual-form">
                    <label>
                      Date
                      <input name="date" type="date" required />
                    </label>
                    <label>
                      Description
                      <input name="description" placeholder="Bank reference / payee / client" required />
                    </label>
                    <label>
                      Money in
                      <input name="moneyIn" inputmode="decimal" placeholder="0.00" />
                    </label>
                    <label>
                      Money out
                      <input name="moneyOut" inputmode="decimal" placeholder="0.00" />
                    </label>
                    <button type="submit">Add transaction</button>
                  </form>
                </section>
              </div>

              <section class="panel">
                <div class="panel-heading">
                  <div>
                    <p class="eyebrow">Matching workspace</p>
                    <h2>Statement transactions</h2>
                  </div>
                  <div class="filters">
                    <select id="statusFilter" aria-label="Filter reconciliation status">
                      <option value="all">All statuses</option>
                      <option>Matched to invoice</option>
                      <option>Matched to expense</option>
                      <option>Matched to partner contribution</option>
                      <option>Matched to partner reimbursement</option>
                      <option>Personal transaction, ignore</option>
                      <option>Unknown, needs review</option>
                    </select>
                    <input id="searchInput" placeholder="Search transaction..." />
                  </div>
                </div>

                <div class="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Owner</th>
                        <th>Money in</th>
                        <th>Money out</th>
                        <th>Suggested match</th>
                        <th>Status</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody id="transactionRows"></tbody>
                  </table>
                </div>
              </section>

              <section class="panel audit-panel">
                <div>
                  <p class="eyebrow">Original files</p>
                  <h2>Upload audit trail</h2>
                </div>
                <div id="uploadList" class="upload-list"></div>
              </section>
            </section>

            <section id="section-dashboard" class="section">
              <div class="placeholder-panel">
                <p class="eyebrow">Dashboard</p>
                <h2>Cash in, cash out, profit, invoices, receipts, and tax readiness.</h2>
                <p>This internal section is ready for the next module build. The bank reconciliation module already feeds the records that clean up profit and partner balances.</p>
              </div>
            </section>

            <section id="section-partnerLedger" class="section">
              <div class="placeholder-panel">
                <p class="eyebrow">Partner ledger</p>
                <h2>Oun, Naim, and Azim contributions, reimbursements, drawings, and balances.</h2>
                <p>Personal bank transactions marked as partner contribution or reimbursement are designed to flow here.</p>
              </div>
            </section>

            <section id="section-reports" class="section">
              <div class="placeholder-panel">
                <p class="eyebrow">Reports</p>
                <h2>Profit & Loss, cashflow, unpaid invoices, expense breakdown, and tax prep exports.</h2>
                <p>Unknown bank transactions remain excluded from finalized reports until reviewed.</p>
              </div>
            </section>

            <section id="section-taxChecklist" class="section">
              <div class="placeholder-panel">
                <p class="eyebrow">Malaysia tax readiness</p>
                <h2>Form P / CP30 preparation checklist.</h2>
                <p>This app helps prepare records for Malaysian tax filing. Final tax treatment should be reviewed by a qualified accountant or tax agent.</p>
              </div>
            </section>
          </section>
        </section>
        <script src="./app.js"></script>
      <?php endif; ?>
    </main>
  </body>
</html>
