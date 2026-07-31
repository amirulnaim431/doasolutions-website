<?php
session_start();

if ( empty( $_SESSION['doa_finance_user'] ) ) {
	header( 'Location: ../../' );
	exit;
}

$active_user = $_SESSION['doa_finance_user'];
$staff_role  = 'admin';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sales Documents | DOA Finance Control</title>
    <meta name="robots" content="noindex, nofollow" />
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <!-- THESIS: This surface is a daily staff document desk, not a proposal page. OWN-WORLD: DOA emerald, white A4 paper, compact controls, exact money tables, acceptance metadata, payment instructions. STORY: staff create, issue, print, convert and track sales documents in one protected workspace. FIRST VIEWPORT: sidebar, KPI strip, document list, editor and live A4 preview. FORM: operate-mode internal backoffice under the existing finance PHP app. -->
    <main
      class="doc-app"
      data-user-name="<?php echo htmlspecialchars( $active_user['name'] ?? '', ENT_QUOTES, 'UTF-8' ); ?>"
      data-user-role="<?php echo htmlspecialchars( $staff_role, ENT_QUOTES, 'UTF-8' ); ?>"
    >
      <aside class="doc-sidebar">
        <a class="doc-back" href="../../">Finance Control</a>
        <div>
          <p class="doc-logo">DOA</p>
          <h1>Sales Documents</h1>
          <p>Quotation and invoice generator for internal DOA staff.</p>
        </div>
        <nav aria-label="Finance modules" class="module-nav">
          <span class="doc-nav-label">Finance Modules</span>
          <a href="../../?section=dashboard">Dashboard</a>
          <a class="is-current" href="./">Sales Documents</a>
          <a href="../../?section=reconciliation">Bank Reconciliation</a>
          <a href="../../?section=partnerLedger">Partner Ledger</a>
          <a href="../../?section=reports">Reports</a>
          <a href="../../?section=taxChecklist">Tax Checklist</a>
        </nav>
        <nav aria-label="Sales document sections">
          <span class="doc-nav-label">Sales Documents</span>
          <button class="is-active" type="button" data-view="overview">Overview</button>
          <button type="button" data-view="editor" data-action="new-quotation">New Quotation</button>
          <button type="button" data-view="editor" data-action="new-invoice">New Invoice</button>
          <button type="button" data-view="documents">Documents</button>
          <button type="button" data-view="clients">Clients</button>
          <button type="button" data-view="items">Service Items</button>
          <button type="button" data-view="settings">Settings</button>
        </nav>
        <div class="doc-user">
          <span><?php echo htmlspecialchars( substr( $active_user['name'], 0, 1 ), ENT_QUOTES, 'UTF-8' ); ?></span>
          <div>
            <strong><?php echo htmlspecialchars( $active_user['name'], ENT_QUOTES, 'UTF-8' ); ?></strong>
            <small>Admin access demo</small>
          </div>
        </div>
      </aside>

      <section class="doc-main">
        <header class="doc-topbar">
          <div>
            <p class="doc-kicker">Internal Backoffice</p>
            <h2>Quotation & Invoice Generator</h2>
            <p>Authenticated MVP using fictional/local records. Official deployment should connect these models to a database and server PDF renderer.</p>
          </div>
          <div class="doc-topbar-actions">
            <button type="button" class="primary" id="newQuotationTop">New Quotation</button>
            <button type="button" id="newInvoiceTop">New Invoice</button>
            <button type="button" id="printDocumentTop">Print / Save PDF</button>
          </div>
        </header>

        <section id="view-overview" class="doc-view is-visible">
          <div class="doc-metrics" id="metrics"></div>
          <div class="doc-grid doc-grid--overview">
            <section class="doc-panel">
              <div class="doc-panel-head">
                <div>
                  <p class="doc-kicker">Recent</p>
                  <h3>Recent documents</h3>
                </div>
                <button type="button" data-view-jump="documents">View all</button>
              </div>
              <div id="recentDocuments" class="doc-list"></div>
            </section>
            <section class="doc-panel">
              <div class="doc-panel-head">
                <div>
                  <p class="doc-kicker">Attention</p>
                  <h3>Requires attention</h3>
                </div>
              </div>
              <div id="attentionList" class="doc-list"></div>
            </section>
          </div>
        </section>

        <section id="view-documents" class="doc-view">
          <section class="doc-panel">
            <div class="doc-panel-head doc-panel-head--stack">
              <div>
                <p class="doc-kicker">Find</p>
                <h3>Quotation and invoice history</h3>
              </div>
              <div class="doc-filters">
                <input id="documentSearch" placeholder="Search number, client or project" />
                <select id="documentStatusFilter">
                  <option value="all">All statuses</option>
                </select>
                <select id="documentTypeFilter">
                  <option value="all">All types</option>
                  <option value="quotation">Quotations</option>
                  <option value="invoice">Invoices</option>
                </select>
              </div>
            </div>
            <div class="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Number</th>
                    <th>Client</th>
                    <th>Project</th>
                    <th>Issue</th>
                    <th>Expiry / Due</th>
                    <th>Total</th>
                    <th>Balance</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="documentRows"></tbody>
              </table>
            </div>
          </section>
        </section>

        <section id="view-editor" class="doc-view">
          <div class="doc-editor-layout">
            <form id="documentForm" class="doc-panel doc-form">
              <div class="doc-panel-head">
                <div>
                  <p class="doc-kicker">Create</p>
                  <h3 id="editorTitle">New Quotation</h3>
                </div>
                <span id="autosaveStatus" class="doc-pill">Draft autosaved locally</span>
              </div>

              <details open>
                <summary>Document type and client</summary>
                <div class="form-grid">
                  <label>Type
                    <select id="docType">
                      <option value="quotation">Quotation</option>
                      <option value="invoice">Invoice</option>
                    </select>
                  </label>
                  <label>Status
                    <select id="docStatus"></select>
                  </label>
                  <label>Existing client
                    <select id="clientSelect"></select>
                  </label>
                  <label>Company / client name
                    <input id="clientName" required placeholder="Client company name" />
                  </label>
                  <label>Registration number
                    <input id="clientRegistration" placeholder="Optional" />
                  </label>
                  <label>Contact person
                    <input id="clientContact" placeholder="Attention to" />
                  </label>
                  <label>Email
                    <input id="clientEmail" type="email" placeholder="client@example.com" />
                  </label>
                  <label>Phone number
                    <input id="clientPhone" placeholder="+60..." />
                  </label>
                  <label class="wide">Billing address
                    <textarea id="clientAddress" placeholder="Billing address"></textarea>
                  </label>
                  <label>Tax / SST number
                    <input id="clientTax" placeholder="If applicable" />
                  </label>
                  <label>Internal notes
                    <input id="clientNotes" placeholder="Not shown on document" />
                  </label>
                </div>
                <button type="button" id="saveClientButton">Save / update client directory</button>
              </details>

              <details open>
                <summary>Document information</summary>
                <div class="form-grid">
                  <label>Document number
                    <input id="docNumber" placeholder="Draft until issued" />
                  </label>
                  <label>Issue date
                    <input id="issueDate" type="date" required />
                  </label>
                  <label id="validUntilWrap">Valid-until date
                    <input id="validUntilDate" type="date" />
                  </label>
                  <label id="dueDateWrap">Due date
                    <input id="dueDate" type="date" />
                  </label>
                  <label class="wide">Project title
                    <input id="projectTitle" required placeholder="Project / scope title" />
                  </label>
                  <label>Client reference / PO
                    <input id="clientReference" placeholder="PO or attention reference" />
                  </label>
                  <label>Prepared by
                    <input id="preparedBy" placeholder="Optional metadata only" />
                  </label>
                  <label>Currency
                    <select id="currency">
                      <option value="MYR">MYR / RM</option>
                    </select>
                  </label>
                </div>
              </details>

              <details open>
                <summary>Line items</summary>
                <div class="line-table">
                  <div class="line-head">
                    <span>Item</span><span>Qty</span><span>Unit</span><span>Price</span><span>Disc</span><span>Tax</span><span>Total</span><span></span>
                  </div>
                  <div id="lineItems"></div>
                </div>
                <div class="line-actions">
                  <button type="button" id="addLineButton">Add Item</button>
                  <label>Document discount
                    <input id="documentDiscount" inputmode="decimal" value="0" />
                  </label>
                  <label>Adjustment
                    <input id="adjustment" inputmode="decimal" value="0" />
                  </label>
                  <label>Deposit / paid
                    <input id="amountPaid" inputmode="decimal" value="0" />
                  </label>
                </div>
              </details>

              <details open>
                <summary id="termsSummary">Terms, notes and acceptance</summary>
                <div class="form-grid">
                  <label class="wide quotation-only">Payment schedule
                    <textarea id="paymentSchedule"></textarea>
                  </label>
                  <label class="wide quotation-only">Scope and change-request terms
                    <textarea id="scopeTerms"></textarea>
                  </label>
                  <label class="wide quotation-only">Project timeline
                    <textarea id="projectTimeline"></textarea>
                  </label>
                  <label class="wide quotation-only">Client acceptance note
                    <textarea id="acceptanceNote"></textarea>
                  </label>
                  <label class="quotation-only">Accepted by
                    <input id="acceptedBy" placeholder="For record only" />
                  </label>
                  <label class="quotation-only">Designation
                    <input id="acceptanceDesignation" placeholder="For record only" />
                  </label>
                  <label class="quotation-only">Acceptance date
                    <input id="acceptanceDate" type="date" />
                  </label>
                  <label class="quotation-only">PO / reference number
                    <input id="poNumber" placeholder="If applicable" />
                  </label>
                  <label class="wide invoice-only">Payment instructions
                    <textarea id="paymentInstructions"></textarea>
                  </label>
                  <label class="wide invoice-only">Payment reference reminder
                    <textarea id="paymentReferenceReminder"></textarea>
                  </label>
                  <label class="wide invoice-only">Late-payment note
                    <textarea id="latePaymentNote"></textarea>
                  </label>
                  <label class="wide">Additional notes
                    <textarea id="additionalNotes"></textarea>
                  </label>
                  <label class="invoice-only">Payment account
                    <select id="bankAccount"></select>
                  </label>
                </div>
              </details>

              <div class="form-actions">
                <button type="submit" class="primary">Save Draft</button>
                <button type="button" id="issueButton">Issue Document</button>
                <button type="button" id="duplicateButton">Duplicate</button>
                <button type="button" id="convertButton">Convert to Invoice</button>
                <button type="button" id="recordPaymentButton">Record Payment</button>
                <button type="button" id="voidButton">Void</button>
              </div>
              <p id="formError" class="form-error" role="alert"></p>
            </form>

            <aside class="doc-preview-panel">
              <div class="preview-actions">
                <button type="button" id="printDocumentButton">Print / Save PDF</button>
                <button type="button" id="downloadJsonButton">Download data</button>
              </div>
              <div id="documentPreview" class="a4-document"></div>
            </aside>
          </div>
        </section>

        <section id="view-clients" class="doc-view">
          <section class="doc-panel">
            <div class="doc-panel-head">
              <div><p class="doc-kicker">Directory</p><h3>Clients</h3></div>
              <button type="button" id="createClientFromDirectory">New client</button>
            </div>
            <div id="clientDirectory" class="directory-grid"></div>
          </section>
        </section>

        <section id="view-items" class="doc-view">
          <section class="doc-panel">
            <div class="doc-panel-head">
              <div><p class="doc-kicker">Catalogue</p><h3>Service Items</h3></div>
              <button type="button" id="createItemButton">New item</button>
            </div>
            <div id="serviceItemsDirectory" class="directory-grid"></div>
          </section>
        </section>

        <section id="view-settings" class="doc-view">
          <form id="settingsForm" class="doc-panel doc-form">
            <div class="doc-panel-head">
              <div><p class="doc-kicker">Admin</p><h3>Document settings</h3></div>
              <button type="submit" class="primary">Save settings</button>
            </div>
            <div class="form-grid">
              <label>Legal name <input id="settingCompanyName" /></label>
              <label>Registration number <input id="settingRegistration" /></label>
              <label>Email <input id="settingEmail" /></label>
              <label>Phone <input id="settingPhone" /></label>
              <label>Website <input id="settingWebsite" /></label>
              <label class="wide">Business address <textarea id="settingAddress"></textarea></label>
              <label>Quotation prefix <input id="settingQuotationPrefix" /></label>
              <label>Invoice prefix <input id="settingInvoicePrefix" /></label>
              <label>Next quotation sequence <input id="settingQuotationNext" type="number" min="1" /></label>
              <label>Next invoice sequence <input id="settingInvoiceNext" type="number" min="1" /></label>
              <label>Default validity days <input id="settingValidityDays" type="number" min="1" /></label>
              <label>Default payment term days <input id="settingPaymentDays" type="number" min="1" /></label>
              <label class="wide">Default quotation terms <textarea id="settingQuotationTerms"></textarea></label>
              <label class="wide">Default invoice notes <textarea id="settingInvoiceNotes"></textarea></label>
              <label class="wide">Footer <textarea id="settingFooter"></textarea></label>
              <label class="wide">Bank accounts, one per line: Bank | Holder | Number | DuitNow | Instruction
                <textarea id="settingBankAccounts"></textarea>
              </label>
            </div>
            <p class="doc-note">Documents use client acceptance metadata for quotations and payment instructions for invoices.</p>
          </form>
        </section>
      </section>

      <dialog id="paymentDialog" class="doc-dialog">
        <form method="dialog" id="paymentForm">
          <h3>Record invoice payment</h3>
          <label>Payment date <input id="paymentDate" type="date" required /></label>
          <label>Amount <input id="paymentAmount" inputmode="decimal" required /></label>
          <label>Method
            <select id="paymentMethod"><option>Bank Transfer</option><option>Cash</option><option>Card</option><option>DuitNow / QR</option></select>
          </label>
          <label>Transaction reference <input id="paymentReference" /></label>
          <label>Notes <textarea id="paymentNotes"></textarea></label>
          <div class="form-actions"><button value="cancel" type="button" id="cancelPayment">Cancel</button><button value="default" class="primary">Save payment</button></div>
        </form>
      </dialog>

      <template id="lineItemTemplate">
        <div class="line-row">
          <select data-field="serviceItemId"></select>
          <input data-field="quantity" inputmode="decimal" />
          <input data-field="unit" />
          <input data-field="unitPrice" inputmode="decimal" />
          <input data-field="discount" inputmode="decimal" />
          <input data-field="taxRate" inputmode="decimal" />
          <strong data-line-total>RM 0.00</strong>
          <div><button type="button" data-line-action="duplicate">Copy</button><button type="button" data-line-action="remove">Del</button></div>
          <textarea data-field="description" placeholder="Description"></textarea>
        </div>
      </template>
    </main>
    <script src="./app.js"></script>
  </body>
</html>
