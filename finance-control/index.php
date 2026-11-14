<?php
require_once dirname( __DIR__ ) . '/back-office/bootstrap.php';
doa_start();
$active_user = doa_require_user();
$asset_version = '20260731-logosize';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>DOA Finance | DOA Back Office</title>
    <meta name="doa-csrf" content="<?= doa_e( doa_csrf() ) ?>">
    <meta name="robots" content="noindex, nofollow" />
    <link rel="stylesheet" href="./styles.css?v=<?php echo htmlspecialchars( $asset_version, ENT_QUOTES, 'UTF-8' ); ?>" />
    <?php doa_styles(); ?>
  </head>
  <body class="bo-finance">
    <main class="app-shell" data-user-name="<?php echo htmlspecialchars( $active_user['name'] ?? '', ENT_QUOTES, 'UTF-8' ); ?>">
      <section class="dashboard">
        <?php doa_sidebar( 'finance' ); ?>
          <section class="content">
            <?php doa_finance_tabs( 'bank' ); ?>
            <header class="topbar">
              <div>
                <h1>Bank statement import and reconciliation</h1>
                <p>
                  Bank reconciliation means checking whether money in the bank matches invoices,
                  payments, expenses, and partner ledger entries in the system.
                </p>
              </div>
              <div class="topbar-actions">
                <button id="exportButton" type="button">Export review CSV</button>
                <button id="importBrowserRecords" type="button" hidden>Import records from this browser</button>
              </div>
            </header>

            <p id="financeSaveStatus" role="status">Loading shared records…</p>
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
                        <option>Azim personal</option>
                        <option>Don personal</option>
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
                      <option>Suggested, needs review</option>
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

          </section>
        </section>
        <script src="./app.js?v=20261114" defer></script>
    </main>
  </body>
</html>
