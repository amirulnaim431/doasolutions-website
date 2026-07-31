const appRoot = document.querySelector('.doc-app');
const userName = appRoot?.dataset.userName || 'DOA Staff';
const storageKey = 'doa-sales-documents-v3-company';
const apiUrl = './data.php';
const doaRegistrationNumber = '202503146827 (003736059-H)';
let isHydrated = false;
let saveTimer = null;

const quotationStatuses = ['Draft', 'Issued', 'Sent', 'Accepted', 'Rejected', 'Expired', 'Superseded', 'Void'];
const invoiceStatuses = ['Draft', 'Issued', 'Sent', 'Partially Paid', 'Paid', 'Overdue', 'Void'];

const defaultSettings = {
  companyName: 'DOA Solutions',
  registration: doaRegistrationNumber,
  address: 'Business address placeholder',
  email: 'hello@doasolutions.com.my',
  phone: '',
  website: 'doasolutions.com.my',
  quotationPrefix: 'QT',
  invoicePrefix: 'INV',
  quotationNext: 1,
  invoiceNext: 1,
  validityDays: 14,
  paymentDays: 14,
  quotationTerms: 'This quotation is valid until the stated valid-until date. Any additional scope will be quoted separately.',
  invoiceNotes: 'Please use the invoice number as payment reference.',
  footer: 'This is a computer-generated document. No signature is required.',
  bankAccounts: [
    {
      bank: 'Bank placeholder',
      holder: 'DOA Solutions',
      number: 'Account number placeholder',
      duitnow: '',
      instruction: 'Please include invoice number as payment reference.',
    },
  ],
};

const seedClients = [];

const seedItems = [
  { id: 'item-system-development', name: 'System Design & Development', description: 'Custom system planning, interface design and development work.', category: 'Development', unit: 'project', priceCents: 0, taxRate: 0, active: true },
  { id: 'item-deployment', name: 'Deployment & Configuration', description: 'Production deployment, configuration and handover preparation.', category: 'Deployment', unit: 'service', priceCents: 0, taxRate: 0, active: true },
  { id: 'item-support', name: 'Monthly System Support & Maintenance', description: 'Monthly support, monitoring and small fixes.', category: 'Support', unit: 'month', priceCents: 0, taxRate: 0, active: true },
];

const state = {
  settings: structuredClone(defaultSettings),
  clients: structuredClone(seedClients),
  items: structuredClone(seedItems),
  documents: [],
  activeDocumentId: null,
};

const els = {};
[
  'metrics', 'recentDocuments', 'attentionList', 'documentRows', 'documentSearch', 'documentStatusFilter',
  'documentTypeFilter', 'documentForm', 'editorTitle', 'autosaveStatus', 'docType', 'docStatus', 'clientSelect',
  'clientName', 'clientRegistration', 'clientContact', 'clientEmail', 'clientPhone', 'clientAddress', 'clientTax',
  'clientNotes', 'saveClientButton', 'docNumber', 'issueDate', 'validUntilDate', 'dueDate', 'projectTitle',
  'clientReference', 'preparedBy', 'currency', 'lineItems', 'addLineButton', 'documentDiscount', 'adjustment',
  'amountPaid', 'paymentSchedule', 'scopeTerms', 'projectTimeline', 'acceptanceNote', 'acceptedBy',
  'acceptanceDesignation', 'acceptanceDate', 'poNumber', 'paymentInstructions', 'paymentReferenceReminder',
  'latePaymentNote', 'additionalNotes', 'bankAccount', 'documentPreview', 'formError', 'convertButton',
  'recordPaymentButton', 'voidButton', 'deleteButton', 'issueButton', 'duplicateButton', 'clientDirectory', 'serviceItemsDirectory',
  'settingsForm', 'paymentDialog', 'paymentForm', 'paymentDate', 'paymentAmount', 'paymentMethod', 'paymentReference',
  'paymentNotes', 'cancelPayment', 'createClientFromDirectory', 'installmentEnabled', 'installmentLabel', 'installmentTotalAmount',
  'installmentTotal', 'installmentCurrent', 'installmentAmount', 'installmentPaidToDate', 'installmentNextDueDate',
  'installmentNotes', 'createItemButton', 'itemDialog', 'itemForm', 'itemDialogTitle', 'itemId', 'itemName',
  'itemDescription', 'itemCategory', 'itemUnit', 'itemPrice', 'itemTaxRate', 'itemActive', 'cancelItem',
].forEach((id) => { els[id] = document.getElementById(id); });

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function cents(value) {
  const cleaned = String(value || '0').replace(/,/g, '').replace(/[^\d.-]/g, '');
  return Math.round((Number(cleaned) || 0) * 100);
}

function decimalAmount(centsValue) {
  return ((Number(centsValue) || 0) / 100).toFixed(2);
}

function syncInstallmentPaidToDate() {
  const current = Math.max(1, Number(els.installmentCurrent.value || 0));
  const amountCents = cents(els.installmentAmount.value);
  els.installmentPaidToDate.value = decimalAmount(current * amountCents);
  collectForm();
}

function syncInstallmentAmountFromTotal() {
  const total = cents(els.installmentTotalAmount.value);
  const count = Math.max(1, Number(els.installmentTotal.value || 0));
  if (!total || !count) return;
  els.installmentAmount.value = decimalAmount(Math.round(total / count));
  syncInstallmentPaidToDate();
}

function money(centsValue) {
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' }).format((centsValue || 0) / 100);
}

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-MY', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + Number(days || 0));
  return next.toISOString().slice(0, 10);
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function snapshotState() {
  return {
    settings: state.settings,
    clients: state.clients,
    items: state.items,
    documents: state.documents,
    activeDocumentId: state.activeDocumentId,
  };
}

function applyLoadedState(saved = {}) {
  state.settings = { ...structuredClone(defaultSettings), ...(saved.settings || {}) };
  if (!state.settings.registration || state.settings.registration === 'Registration number placeholder') {
    state.settings.registration = doaRegistrationNumber;
  }
  state.clients = Array.isArray(saved.clients) ? saved.clients : structuredClone(seedClients);
  state.items = Array.isArray(saved.items) && saved.items.length ? saved.items : structuredClone(seedItems);
  state.documents = Array.isArray(saved.documents) ? saved.documents : [];
  state.activeDocumentId = saved.activeDocumentId || state.documents[0]?.id || null;
  if (state.activeDocumentId && !state.documents.some((doc) => doc.id === state.activeDocumentId)) {
    state.activeDocumentId = state.documents[0]?.id || null;
  }
}

function queueRemoteSave() {
  if (!isHydrated) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveStateNow, 350);
}

async function saveStateNow(statusText = 'Saved to shared view') {
  if (!isHydrated) return false;
  clearTimeout(saveTimer);
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshotState()),
    });
    if (!response.ok) throw new Error('Shared save failed');
    els.autosaveStatus.textContent = statusText;
    return true;
  } catch {
    els.autosaveStatus.textContent = 'Shared save failed';
    return false;
  }
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify(snapshotState()));
  queueRemoteSave();
}

async function loadState() {
  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load shared data');
    applyLoadedState(await response.json());
    localStorage.setItem(storageKey, JSON.stringify(snapshotState()));
    isHydrated = true;
    els.autosaveStatus.textContent = 'Shared view loaded';
  } catch {
    try {
      applyLoadedState(JSON.parse(localStorage.getItem(storageKey) || '{}'));
    } catch {
      applyLoadedState({});
    }
    isHydrated = true;
    els.autosaveStatus.textContent = 'Offline local view';
  }
}

function createBlankClient() {
  return {
    id: uid('client'),
    name: '',
    registration: '',
    contact: '',
    email: '',
    phone: '',
    address: '',
    tax: '',
    notes: '',
  };
}

function createBlankDocument(type = 'quotation') {
  const issueDate = today();
  return {
    id: uid('doc'),
    type,
    status: 'Draft',
    number: `DRAFT-${Date.now().toString().slice(-5)}`,
    issueDate,
    validUntilDate: addDays(issueDate, state.settings.validityDays),
    dueDate: addDays(issueDate, state.settings.paymentDays),
    projectTitle: '',
    clientReference: '',
    preparedBy: userName,
    currency: 'MYR',
    client: structuredClone(state.clients[0] || createBlankClient()),
    items: [createLineItem()],
    documentDiscountCents: 0,
    adjustmentCents: 0,
    amountPaidCents: 0,
    installmentPlan: {
      enabled: false,
      label: '',
      totalAmountCents: 0,
      total: 12,
      current: 1,
      amountCents: 0,
      paidToDateCents: 0,
      nextDueDate: '',
      notes: '',
    },
    paymentSchedule: '50% deposit upon acceptance, balance according to agreed milestone or completion.',
    scopeTerms: state.settings.quotationTerms,
    projectTimeline: 'Timeline to be confirmed after acceptance and required materials are received.',
    acceptanceNote: 'Acceptance details are recorded for administration only.',
    acceptedBy: '',
    acceptanceDesignation: '',
    acceptanceDate: '',
    poNumber: '',
    paymentInstructions: state.settings.invoiceNotes,
    paymentReferenceReminder: 'Please include the invoice number in the payment reference.',
    latePaymentNote: 'Please contact DOA Solutions if payment timing requires discussion.',
    additionalNotes: '',
    bankAccountId: 'bank-0',
    payments: [],
    history: [{ action: 'Document created', by: userName, at: new Date().toISOString() }],
    sourceQuotationId: '',
  };
}

function createLineItem(seed = {}) {
  return {
    id: uid('line'),
    serviceItemId: seed.serviceItemId || '',
    name: seed.name || '',
    description: seed.description || '',
    quantity: seed.quantity || '1',
    unit: seed.unit || 'project',
    unitPriceCents: seed.unitPriceCents ?? 0,
    discountCents: seed.discountCents || 0,
    taxRate: seed.taxRate || 0,
  };
}

function getActiveDocument() {
  return state.documents.find((item) => item.id === state.activeDocumentId) || null;
}

function calculateLine(line) {
  const quantity = Number(line.quantity || 0);
  const subtotal = Math.max(0, Math.round(quantity * Number(line.unitPriceCents || 0)));
  const discounted = Math.max(0, subtotal - Number(line.discountCents || 0));
  const tax = Math.round(discounted * (Number(line.taxRate || 0) / 100));
  return { subtotal, discounted, tax, total: discounted + tax };
}

function calculateDocument(doc) {
  const lines = doc.items.map(calculateLine);
  const subtotal = lines.reduce((sum, line) => sum + line.discounted, 0);
  const tax = lines.reduce((sum, line) => sum + line.tax, 0);
  const lineTotal = Math.max(0, subtotal + tax - Number(doc.documentDiscountCents || 0) + Number(doc.adjustmentCents || 0));
  const installmentTotal = doc.installmentPlan?.enabled ? Number(doc.installmentPlan.totalAmountCents || 0) : 0;
  const total = installmentTotal || lineTotal;
  const installmentPaid = doc.installmentPlan?.enabled ? Number(doc.installmentPlan.paidToDateCents || 0) : 0;
  const paid = Math.max(Number(doc.amountPaidCents || 0), installmentPaid) + (doc.payments || []).reduce((sum, payment) => sum + Number(payment.amountCents || 0), 0);
  const balance = Math.max(0, total - paid);
  return { subtotal, tax, total, paid, balance };
}

function officialNumber(type) {
  const year = new Date().getFullYear();
  const key = type === 'quotation' ? 'quotationNext' : 'invoiceNext';
  const prefix = type === 'quotation' ? state.settings.quotationPrefix : state.settings.invoicePrefix;
  const number = `${prefix}-${year}-${String(state.settings[key]).padStart(4, '0')}`;
  state.settings[key] += 1;
  return number;
}

function switchView(view) {
  document.querySelectorAll('.doc-view').forEach((section) => section.classList.remove('is-visible'));
  document.getElementById(`view-${view}`)?.classList.add('is-visible');
  document.querySelectorAll('.sales-tabs button').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.view === view && !button.dataset.action);
  });
  if (view === 'editor') renderEditor();
}

function newDocument(type) {
  const doc = createBlankDocument(type);
  state.documents.unshift(doc);
  state.activeDocumentId = doc.id;
  saveState();
  switchView('editor');
  renderAll();
}

function populateSelects() {
  els.clientSelect.innerHTML = [
    '<option value="">Create / custom client</option>',
    ...state.clients.map((client) => `<option value="${client.id}">${escapeHtml(client.name)}</option>`),
  ].join('');

  const activeDoc = getActiveDocument();
  const statuses = activeDoc?.type === 'invoice' ? invoiceStatuses : quotationStatuses;
  els.docStatus.innerHTML = statuses.map((status) => `<option>${status}</option>`).join('');
  els.documentStatusFilter.innerHTML = ['<option value="all">All statuses</option>', ...new Set([...quotationStatuses, ...invoiceStatuses])].map((status) => {
    if (String(status).includes('option')) return status;
    return `<option>${status}</option>`;
  }).join('');

  els.bankAccount.innerHTML = state.settings.bankAccounts.map((bank, index) => `<option value="bank-${index}">${escapeHtml(bank.bank)} - ${escapeHtml(bank.holder)}</option>`).join('');
}

function renderEditor() {
  const doc = getActiveDocument();
  if (!doc) {
    populateSelects();
    els.editorTitle.textContent = 'No document selected';
    els.lineItems.innerHTML = '';
    els.documentPreview.innerHTML = '<section class="a4-empty"><h2>No document yet</h2><p>Create a quotation or invoice to start. This account has no sample documents.</p></section>';
    document.body.classList.remove('is-invoice', 'is-quotation');
    els.convertButton.hidden = true;
    els.recordPaymentButton.hidden = true;
    els.deleteButton.hidden = true;
    return;
  }
  populateSelects();
  els.editorTitle.textContent = doc.type === 'quotation' ? 'Quotation Editor' : 'Invoice Editor';
  els.docType.value = doc.type;
  els.docStatus.value = doc.status;
  els.clientSelect.value = state.clients.find((client) => client.name === doc.client.name)?.id || '';
  els.clientName.value = doc.client.name || '';
  els.clientRegistration.value = doc.client.registration || '';
  els.clientContact.value = doc.client.contact || '';
  els.clientEmail.value = doc.client.email || '';
  els.clientPhone.value = doc.client.phone || '';
  els.clientAddress.value = doc.client.address || '';
  els.clientTax.value = doc.client.tax || '';
  els.clientNotes.value = doc.client.notes || '';
  els.docNumber.value = doc.number || '';
  els.issueDate.value = doc.issueDate || today();
  els.validUntilDate.value = doc.validUntilDate || '';
  els.dueDate.value = doc.dueDate || '';
  els.projectTitle.value = doc.projectTitle || '';
  els.clientReference.value = doc.clientReference || '';
  els.preparedBy.value = doc.preparedBy || '';
  els.currency.value = doc.currency || 'MYR';
  els.documentDiscount.value = (doc.documentDiscountCents || 0) / 100;
  els.adjustment.value = (doc.adjustmentCents || 0) / 100;
  els.amountPaid.value = (doc.amountPaidCents || 0) / 100;
  const plan = doc.installmentPlan || {};
  els.installmentEnabled.value = plan.enabled ? 'yes' : 'no';
  els.installmentLabel.value = plan.label || '';
  els.installmentTotalAmount.value = (plan.totalAmountCents || 0) / 100;
  els.installmentTotal.value = plan.total || '';
  els.installmentCurrent.value = plan.current || '';
  els.installmentAmount.value = (plan.amountCents || 0) / 100;
  els.installmentPaidToDate.value = (plan.paidToDateCents || 0) / 100;
  els.installmentNextDueDate.value = plan.nextDueDate || '';
  els.installmentNotes.value = plan.notes || '';
  els.paymentSchedule.value = doc.paymentSchedule || '';
  els.scopeTerms.value = doc.scopeTerms || '';
  els.projectTimeline.value = doc.projectTimeline || '';
  els.acceptanceNote.value = doc.acceptanceNote || '';
  els.acceptedBy.value = doc.acceptedBy || '';
  els.acceptanceDesignation.value = doc.acceptanceDesignation || '';
  els.acceptanceDate.value = doc.acceptanceDate || '';
  els.poNumber.value = doc.poNumber || '';
  els.paymentInstructions.value = doc.paymentInstructions || '';
  els.paymentReferenceReminder.value = doc.paymentReferenceReminder || '';
  els.latePaymentNote.value = doc.latePaymentNote || '';
  els.additionalNotes.value = doc.additionalNotes || '';
  els.bankAccount.value = doc.bankAccountId || 'bank-0';
  document.body.classList.toggle('is-invoice', doc.type === 'invoice');
  document.body.classList.toggle('is-quotation', doc.type === 'quotation');
  els.convertButton.hidden = doc.type !== 'quotation' || doc.status !== 'Accepted';
  els.recordPaymentButton.hidden = doc.type !== 'invoice';
  els.deleteButton.hidden = false;
  renderLineItems();
  renderPreview();
}

function renderLineItems() {
  const doc = getActiveDocument();
  if (!doc) {
    els.lineItems.innerHTML = '';
    return;
  }
  els.lineItems.innerHTML = '';
  doc.items.forEach((line) => {
    const node = document.getElementById('lineItemTemplate').content.firstElementChild.cloneNode(true);
    node.dataset.id = line.id;
    const serviceSelect = node.querySelector('[data-field="serviceItemId"]');
    serviceSelect.innerHTML = '<option value="">Custom item</option>' + state.items.filter((item) => item.active).map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('');
    serviceSelect.value = line.serviceItemId || '';
    node.querySelector('[data-field="quantity"]').value = line.quantity || '1';
    node.querySelector('[data-field="unit"]').value = line.unit || '';
    node.querySelector('[data-field="unitPrice"]').value = (line.unitPriceCents || 0) / 100;
    node.querySelector('[data-field="discount"]').value = (line.discountCents || 0) / 100;
    node.querySelector('[data-field="taxRate"]').value = line.taxRate || 0;
    node.querySelector('[data-field="description"]').value = line.description || '';
    node.querySelector('[data-line-total]').textContent = money(calculateLine(line).total);
    els.lineItems.appendChild(node);
  });
}

function collectForm() {
  const doc = getActiveDocument();
  if (!doc) return;
  doc.type = els.docType.value;
  doc.status = els.docStatus.value || 'Draft';
  doc.number = els.docNumber.value || doc.number;
  doc.issueDate = els.issueDate.value;
  doc.validUntilDate = els.validUntilDate.value;
  doc.dueDate = els.dueDate.value;
  doc.projectTitle = els.projectTitle.value;
  doc.clientReference = els.clientReference.value;
  doc.preparedBy = els.preparedBy.value;
  doc.currency = els.currency.value;
  doc.client = {
    id: els.clientSelect.value || doc.client.id || uid('client'),
    name: els.clientName.value,
    registration: els.clientRegistration.value,
    contact: els.clientContact.value,
    email: els.clientEmail.value,
    phone: els.clientPhone.value,
    address: els.clientAddress.value,
    tax: els.clientTax.value,
    notes: els.clientNotes.value,
  };
  doc.documentDiscountCents = cents(els.documentDiscount.value);
  doc.adjustmentCents = cents(els.adjustment.value);
  doc.amountPaidCents = cents(els.amountPaid.value);
  doc.installmentPlan = {
    enabled: els.installmentEnabled.value === 'yes',
    label: els.installmentLabel.value,
    totalAmountCents: cents(els.installmentTotalAmount.value),
    total: Math.max(1, Number(els.installmentTotal.value || 0)),
    current: Math.max(1, Number(els.installmentCurrent.value || 0)),
    amountCents: cents(els.installmentAmount.value),
    paidToDateCents: cents(els.installmentPaidToDate.value),
    nextDueDate: els.installmentNextDueDate.value,
    notes: els.installmentNotes.value,
  };
  doc.paymentSchedule = els.paymentSchedule.value;
  doc.scopeTerms = els.scopeTerms.value;
  doc.projectTimeline = els.projectTimeline.value;
  doc.acceptanceNote = els.acceptanceNote.value;
  doc.acceptedBy = els.acceptedBy.value;
  doc.acceptanceDesignation = els.acceptanceDesignation.value;
  doc.acceptanceDate = els.acceptanceDate.value;
  doc.poNumber = els.poNumber.value;
  doc.paymentInstructions = els.paymentInstructions.value;
  doc.paymentReferenceReminder = els.paymentReferenceReminder.value;
  doc.latePaymentNote = els.latePaymentNote.value;
  doc.additionalNotes = els.additionalNotes.value;
  doc.bankAccountId = els.bankAccount.value;
  saveState();
  renderMetrics();
  renderDocuments();
  renderLists();
  renderPreview();
}

function renderPreview() {
  const doc = getActiveDocument();
  if (!doc) {
    els.documentPreview.innerHTML = '<section class="a4-empty"><h2>No document yet</h2><p>Create a quotation or invoice to start. This account has no sample documents.</p></section>';
    return;
  }
  const totals = calculateDocument(doc);
  const selectedBankIndex = Number(String(doc.bankAccountId || 'bank-0').replace('bank-', '')) || 0;
  const bank = state.settings.bankAccounts[selectedBankIndex] || state.settings.bankAccounts[0];
  const title = doc.type === 'quotation' ? 'QUOTATION' : 'INVOICE';
  const expiryLabel = doc.type === 'quotation' ? 'Valid Until' : 'Due Date';
  const expiryValue = doc.type === 'quotation' ? doc.validUntilDate : doc.dueDate;
  const plan = doc.installmentPlan || {};
  const remainingInstallments = plan.enabled ? Math.max(0, Number(plan.total || 0) - Number(plan.current || 0)) : 0;
  const dueThisInstallment = plan.enabled ? Number(plan.amountCents || 0) : 0;
  const installmentSummary = plan.enabled ? `
    <section class="a4-installments">
      <h2>${escapeHtml(plan.label || 'Installment Plan')}</h2>
      <dl>
        <dt>Current payment</dt><dd>${Number(plan.current || 1)} of ${Number(plan.total || 1)}</dd>
        <dt>Total amount</dt><dd>${money(plan.totalAmountCents)}</dd>
        <dt>Installment amount</dt><dd>${money(plan.amountCents)}</dd>
        <dt>Paid to date</dt><dd>${money(plan.paidToDateCents)}</dd>
        <dt>Next due date</dt><dd>${formatDate(plan.nextDueDate)}</dd>
        <dt>Remaining installments</dt><dd>${remainingInstallments}</dd>
      </dl>
      ${plan.notes ? `<p>${escapeHtml(plan.notes).replaceAll('\n', '<br>')}</p>` : ''}
    </section>
  ` : '';
  const paymentDetailsBlock = `
    <h2>Payment Details</h2>
    <p><b>${escapeHtml(bank.bank)}</b><br>${escapeHtml(bank.holder)}<br>${escapeHtml(bank.number)}</p>
    ${bank.duitnow ? `<p>${escapeHtml(bank.duitnow).replaceAll('\n', '<br>')}</p>` : ''}
    <p>${escapeHtml(bank.instruction || doc.paymentInstructions).replaceAll('\n', '<br>')}</p>
  `;

  els.documentPreview.innerHTML = `
    <header class="a4-header">
      <div>
        <span class="a4-logo"><img src="/wp-content/themes/doa-astra-child/assets/images/doa-logo-icon-glow.png" alt="DOA" /></span>
        <p>${escapeHtml(state.settings.companyName)}</p>
        <small>${escapeHtml(state.settings.registration || doaRegistrationNumber)}</small>
      </div>
      <div>
        <h1>${title}</h1>
        <p>${escapeHtml(doc.number)}</p>
      </div>
    </header>
    <section class="a4-meta">
      <div><span>Issue Date</span><b>${formatDate(doc.issueDate)}</b></div>
      <div><span>${expiryLabel}</span><b>${formatDate(expiryValue)}</b></div>
      <div><span>Project</span><b>${escapeHtml(doc.projectTitle || '-')}</b></div>
      <div><span>Reference</span><b>${escapeHtml(doc.clientReference || doc.poNumber || '-')}</b></div>
    </section>
    <section class="a4-parties">
      <div>
        <h2>${doc.type === 'quotation' ? 'Prepared For' : 'Bill To'}</h2>
        <b>${escapeHtml(doc.client.name || 'Client name')}</b>
        <p>${escapeHtml(doc.client.address || 'Client billing address').replaceAll('\n', '<br>')}</p>
        <small>${escapeHtml(doc.client.contact || '')} ${doc.client.email ? ` / ${escapeHtml(doc.client.email)}` : ''}</small>
      </div>
      <div>
        <h2>From</h2>
        <b>${escapeHtml(state.settings.companyName)}</b>
        <p>${escapeHtml(state.settings.address).replaceAll('\n', '<br>')}</p>
        <small>${escapeHtml(state.settings.email)} ${state.settings.phone ? ` / ${escapeHtml(state.settings.phone)}` : ''}</small>
      </div>
    </section>
    <table class="a4-items">
      <colgroup>
        <col class="a4-col-index" />
        <col class="a4-col-description" />
        <col class="a4-col-qty" />
        <col class="a4-col-unit" />
        <col class="a4-col-money" />
        <col class="a4-col-money" />
      </colgroup>
      <thead><tr><th>#</th><th>Description</th><th>Qty</th><th>Unit</th><th>Unit Price</th><th>Total</th></tr></thead>
      <tbody>
        ${doc.items.map((line, index) => `
          <tr>
            <td>${index + 1}</td>
            <td><span class="a4-line-name">${escapeHtml(line.name || serviceName(line.serviceItemId) || 'Custom item')}</span><span class="a4-line-description">${escapeHtml(line.description || '').replaceAll('\n', '<br>')}</span></td>
            <td>${escapeHtml(line.quantity)}</td>
            <td>${escapeHtml(line.unit)}</td>
            <td>${money(line.unitPriceCents)}</td>
            <td>${money(calculateLine(line).total)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <section class="a4-bottom">
      <div class="a4-notes">
        ${doc.type === 'quotation' ? `
          <h2>Terms</h2>
          <p>${escapeHtml(doc.paymentSchedule).replaceAll('\n', '<br>')}</p>
          <p>${escapeHtml(doc.scopeTerms).replaceAll('\n', '<br>')}</p>
          <p>${escapeHtml(doc.projectTimeline).replaceAll('\n', '<br>')}</p>
          <h2>Client Acceptance</h2>
          <dl>
            <dt>Accepted by</dt><dd>${escapeHtml(doc.acceptedBy || '-')}</dd>
            <dt>Designation</dt><dd>${escapeHtml(doc.acceptanceDesignation || '-')}</dd>
            <dt>Acceptance date</dt><dd>${formatDate(doc.acceptanceDate)}</dd>
            <dt>PO / Reference</dt><dd>${escapeHtml(doc.poNumber || '-')}</dd>
          </dl>
          ${paymentDetailsBlock}
        ` : `
          ${paymentDetailsBlock}
          <h2>Notes</h2>
          <p>${escapeHtml(doc.paymentReferenceReminder).replaceAll('\n', '<br>')}</p>
          <p>${escapeHtml(doc.latePaymentNote).replaceAll('\n', '<br>')}</p>
        `}
        ${doc.additionalNotes ? `<h2>Additional Notes</h2><p>${escapeHtml(doc.additionalNotes).replaceAll('\n', '<br>')}</p>` : ''}
      </div>
      <div class="a4-totals">
        ${installmentSummary}
        <div><span>Subtotal</span><b>${money(totals.subtotal)}</b></div>
        <div><span>Tax / SST</span><b>${money(totals.tax)}</b></div>
        <div><span>Document discount</span><b>${money(doc.documentDiscountCents)}</b></div>
        <div><span>Adjustment</span><b>${money(doc.adjustmentCents)}</b></div>
        <div class="grand"><span>${plan.enabled ? 'Project Grand Total' : (doc.type === 'quotation' ? 'Grand Total' : 'Total Due')}</span><b>${money(totals.total)}</b></div>
        ${plan.enabled ? `<div class="now-due"><span>Due This Installment</span><b>${money(dueThisInstallment)}</b></div>` : ''}
        <div><span>${plan.enabled ? 'Paid To Date' : 'Paid / Deposit'}</span><b>${money(totals.paid)}</b></div>
        <div><span>${plan.enabled ? 'Remaining Balance' : 'Balance Due'}</span><b>${money(totals.balance)}</b></div>
      </div>
    </section>
    <footer class="a4-footer">
      <span>${escapeHtml(state.settings.website)} / ${escapeHtml(state.settings.email)}</span>
      <b>${escapeHtml(state.settings.footer)}</b>
    </footer>
  `;
}

function serviceName(id) {
  return state.items.find((item) => item.id === id)?.name || '';
}

function renderMetrics() {
  const thisMonth = new Date().toISOString().slice(0, 7);
  const quotationDocs = state.documents.filter((doc) => doc.type === 'quotation');
  const invoiceDocs = state.documents.filter((doc) => doc.type === 'invoice');
  const quotedThisMonth = quotationDocs.filter((doc) => String(doc.issueDate).startsWith(thisMonth));
  const quotedValue = quotedThisMonth.reduce((sum, doc) => sum + calculateDocument(doc).total, 0);
  const outstanding = invoiceDocs.reduce((sum, doc) => sum + calculateDocument(doc).balance, 0);
  const paidThisMonth = invoiceDocs.reduce((sum, doc) => sum + (doc.payments || []).filter((payment) => String(payment.date).startsWith(thisMonth)).reduce((paySum, payment) => paySum + payment.amountCents, 0), 0);
  els.metrics.innerHTML = [
    ['Quotations this month', quotedThisMonth.length],
    ['Total quoted value', money(quotedValue)],
    ['Accepted quotations', quotationDocs.filter((doc) => doc.status === 'Accepted').length],
    ['Outstanding invoices', money(outstanding)],
    ['Overdue invoices', invoiceDocs.filter((doc) => doc.status === 'Overdue').length],
    ['Payments this month', money(paidThisMonth)],
  ].map(([label, value]) => `<article class="metric-card"><span>${label}</span><b>${value}</b></article>`).join('');
}

function renderDocuments() {
  const query = String(els.documentSearch?.value || '').toLowerCase();
  const status = els.documentStatusFilter?.value || 'all';
  const type = els.documentTypeFilter?.value || 'all';
  const rows = state.documents.filter((doc) => {
    const queryMatch = !query || `${doc.number} ${doc.client?.name} ${doc.projectTitle}`.toLowerCase().includes(query);
    const statusMatch = status === 'all' || doc.status === status;
    const typeMatch = type === 'all' || doc.type === type;
    return queryMatch && statusMatch && typeMatch;
  });
  els.documentRows.innerHTML = rows.length ? rows.map((doc) => {
    const totals = calculateDocument(doc);
    return `
      <tr>
        <td><b>${escapeHtml(doc.number)}</b><small>${doc.type}</small></td>
        <td>${escapeHtml(doc.client?.name || '-')}</td>
        <td>${escapeHtml(doc.projectTitle || '-')}</td>
        <td>${formatDate(doc.issueDate)}</td>
        <td>${formatDate(doc.type === 'quotation' ? doc.validUntilDate : doc.dueDate)}</td>
        <td>${money(totals.total)}</td>
        <td>${doc.type === 'invoice' ? money(totals.balance) : '-'}</td>
        <td><span class="status">${escapeHtml(doc.status)}</span></td>
        <td class="row-actions">
          <button type="button" data-doc-action="open" data-id="${doc.id}">Open</button>
          <button type="button" data-doc-action="duplicate" data-id="${doc.id}">Duplicate</button>
          <button type="button" data-doc-action="delete" data-id="${doc.id}">Delete</button>
        </td>
      </tr>
    `;
  }).join('') : '<tr><td colspan="9">No documents found.</td></tr>';
}

function renderLists() {
  const recent = state.documents.slice(0, 5);
  els.recentDocuments.innerHTML = recent.length ? recent.map((doc) => `
    <article class="mini-document-row">
      <button type="button" data-open-doc="${doc.id}"><b>${escapeHtml(doc.number)}</b><span>${escapeHtml(doc.client?.name || '-')} / ${money(calculateDocument(doc).total)}</span></button>
      <button type="button" class="mini-delete" data-delete-doc="${doc.id}">Delete</button>
    </article>
  `).join('') : '<p>No documents yet.</p>';
  const attention = state.documents.filter((doc) => ['Draft', 'Overdue', 'Expired'].includes(doc.status)).slice(0, 6);
  els.attentionList.innerHTML = attention.length ? attention.map((doc) => `<button type="button" data-open-doc="${doc.id}"><b>${escapeHtml(doc.status)} / ${escapeHtml(doc.number)}</b><span>${escapeHtml(doc.projectTitle || 'Untitled')}</span></button>`).join('') : '<p>No attention items.</p>';
}

function renderDirectories() {
  els.clientDirectory.innerHTML = state.clients.map((client) => `<article class="directory-card"><b>${escapeHtml(client.name)}</b><span>${escapeHtml(client.contact || '-')}</span><small>${escapeHtml(client.email || '')}</small><button type="button" data-use-client="${client.id}">Use in document</button></article>`).join('');
  els.serviceItemsDirectory.innerHTML = state.items.length ? state.items.map((item) => `
    <article class="directory-card ${item.active ? '' : 'is-muted'}">
      <b>${escapeHtml(item.name)}</b>
      <span>${escapeHtml(item.category || 'Uncategorised')} / ${escapeHtml(item.unit || '-')}</span>
      <small>${money(item.priceCents)} / Tax ${Number(item.taxRate || 0)}% / ${item.active ? 'Active' : 'Inactive'}</small>
      <p>${escapeHtml(item.description || '').replaceAll('\n', '<br>')}</p>
      <div class="directory-actions">
        <button type="button" data-edit-item="${item.id}">Edit</button>
        <button type="button" data-delete-item="${item.id}" class="mini-delete">Delete</button>
      </div>
    </article>
  `).join('') : '<p>No service items yet.</p>';
}

function openItemDialog(id = '') {
  const item = state.items.find((entry) => entry.id === id) || {
    id: '',
    name: '',
    description: '',
    category: '',
    unit: 'project',
    priceCents: 0,
    taxRate: 0,
    active: true,
  };
  els.itemDialogTitle.textContent = item.id ? 'Edit service item' : 'New service item';
  els.itemId.value = item.id;
  els.itemName.value = item.name || '';
  els.itemDescription.value = item.description || '';
  els.itemCategory.value = item.category || '';
  els.itemUnit.value = item.unit || 'project';
  els.itemPrice.value = decimalAmount(item.priceCents || 0);
  els.itemTaxRate.value = item.taxRate || 0;
  els.itemActive.value = item.active === false ? 'no' : 'yes';
  els.itemDialog.showModal();
  els.itemName.focus();
}

function saveItem(event) {
  event.preventDefault();
  const id = els.itemId.value || uid('item');
  const nextItem = {
    id,
    name: els.itemName.value.trim(),
    description: els.itemDescription.value.trim(),
    category: els.itemCategory.value.trim() || 'General',
    unit: els.itemUnit.value.trim() || 'project',
    priceCents: cents(els.itemPrice.value),
    taxRate: Number(els.itemTaxRate.value || 0),
    active: els.itemActive.value === 'yes',
  };
  if (!nextItem.name || !nextItem.description) {
    els.autosaveStatus.textContent = 'Service name and description are required';
    return;
  }
  const index = state.items.findIndex((item) => item.id === id);
  if (index >= 0) state.items[index] = nextItem;
  else state.items.unshift(nextItem);
  els.itemDialog.close();
  saveState();
  saveStateNow('Service item saved');
  renderDirectories();
  renderLineItems();
}

function deleteItem(id) {
  const item = state.items.find((entry) => entry.id === id);
  if (!item) return;
  const isUsed = state.documents.some((doc) => doc.items?.some((line) => line.serviceItemId === id));
  const message = isUsed
    ? `${item.name} is used in existing documents. Hide it from new items instead?`
    : `Delete ${item.name}?`;
  if (!window.confirm(message)) return;
  if (isUsed) item.active = false;
  else state.items = state.items.filter((entry) => entry.id !== id);
  saveState();
  saveStateNow(isUsed ? 'Service item marked inactive' : 'Service item deleted');
  renderDirectories();
  renderLineItems();
}

function renderSettings() {
  const fields = {
    settingCompanyName: 'companyName',
    settingRegistration: 'registration',
    settingEmail: 'email',
    settingPhone: 'phone',
    settingWebsite: 'website',
    settingAddress: 'address',
    settingQuotationPrefix: 'quotationPrefix',
    settingInvoicePrefix: 'invoicePrefix',
    settingQuotationNext: 'quotationNext',
    settingInvoiceNext: 'invoiceNext',
    settingValidityDays: 'validityDays',
    settingPaymentDays: 'paymentDays',
    settingQuotationTerms: 'quotationTerms',
    settingInvoiceNotes: 'invoiceNotes',
    settingFooter: 'footer',
  };
  Object.entries(fields).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (input) input.value = state.settings[key] || '';
  });
  document.getElementById('settingBankAccounts').value = state.settings.bankAccounts.map((bank) => [bank.bank, bank.holder, bank.number, bank.duitnow, bank.instruction].join(' | ')).join('\n');
}

function renderAll(includeEditor = true) {
  populateSelects();
  renderMetrics();
  renderDocuments();
  renderLists();
  renderDirectories();
  renderSettings();
  if (includeEditor) renderEditor();
}

function validateDocument(doc) {
  if (!doc.client.name.trim()) return 'Client name is required.';
  if (!doc.projectTitle.trim()) return 'Project title is required.';
  if (!doc.items.length || doc.items.every((item) => !item.description.trim() && !item.serviceItemId)) return 'At least one line item is required.';
  if (doc.type === 'quotation' && doc.validUntilDate && doc.validUntilDate < doc.issueDate) return 'Valid-until date cannot be before issue date.';
  if (doc.type === 'invoice' && doc.dueDate && doc.dueDate < doc.issueDate) return 'Due date cannot be before issue date.';
  return '';
}

async function issueDocument() {
  const doc = getActiveDocument();
  if (!doc) return;
  collectForm();
  const error = validateDocument(doc);
  if (error) {
    els.formError.textContent = error;
    return;
  }
  if (doc.status === 'Draft') doc.status = 'Issued';
  if (doc.number.startsWith('DRAFT')) doc.number = officialNumber(doc.type);
  doc.issuedSnapshot = structuredClone(doc);
  doc.history.push({ action: 'Issued', by: userName, at: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(snapshotState()));
  await saveStateNow('Document issued and saved');
  els.formError.textContent = '';
  renderAll();
}

function duplicateDocument(id = state.activeDocumentId) {
  const original = state.documents.find((doc) => doc.id === id);
  if (!original) return;
  const copy = structuredClone(original);
  copy.id = uid('doc');
  copy.number = `DRAFT-${Date.now().toString().slice(-5)}`;
  copy.status = 'Draft';
  copy.history = [{ action: 'Duplicated from ' + original.number, by: userName, at: new Date().toISOString() }];
  state.documents.unshift(copy);
  state.activeDocumentId = copy.id;
  saveState();
  saveStateNow('Duplicate saved to shared view');
  switchView('editor');
  renderAll();
}

function deleteDocument(id = state.activeDocumentId) {
  const doc = state.documents.find((item) => item.id === id);
  if (!doc) return;
  const confirmed = window.confirm(`Delete ${doc.number || 'this document'}? This cannot be undone.`);
  if (!confirmed) return;
  state.documents = state.documents.filter((item) => item.id !== id);
  state.activeDocumentId = state.documents[0]?.id || null;
  saveState();
  saveStateNow('Document deleted from shared view');
  renderAll();
  if (!state.activeDocumentId) switchView('overview');
}

function convertToInvoice() {
  const quotation = getActiveDocument();
  if (!quotation) return;
  collectForm();
  if (quotation.type !== 'quotation') return;
  const invoice = structuredClone(quotation);
  invoice.id = uid('doc');
  invoice.type = 'invoice';
  invoice.status = 'Draft';
  invoice.number = `DRAFT-${Date.now().toString().slice(-5)}`;
  invoice.sourceQuotationId = quotation.id;
  invoice.dueDate = addDays(today(), state.settings.paymentDays);
  invoice.issueDate = today();
  invoice.payments = [];
  invoice.history = [{ action: `Converted from ${quotation.number}`, by: userName, at: new Date().toISOString() }];
  state.documents.unshift(invoice);
  state.activeDocumentId = invoice.id;
  saveState();
  saveStateNow('Invoice saved to shared view');
  switchView('editor');
  renderAll();
}

function recordPayment() {
  const doc = getActiveDocument();
  if (!doc || doc.type !== 'invoice') return;
  els.paymentDate.value = today();
  els.paymentAmount.value = calculateDocument(doc).balance / 100;
  els.paymentDialog.showModal();
}

function savePayment(event) {
  event.preventDefault();
  const doc = getActiveDocument();
  if (!doc) return;
  const amountCents = cents(els.paymentAmount.value);
  doc.payments = doc.payments || [];
  doc.payments.push({
    id: uid('pay'),
    date: els.paymentDate.value,
    amountCents,
    method: els.paymentMethod.value,
    reference: els.paymentReference.value,
    notes: els.paymentNotes.value,
    recordedBy: userName,
  });
  const totals = calculateDocument(doc);
  doc.status = totals.balance <= 0 ? 'Paid' : 'Partially Paid';
  doc.history.push({ action: 'Payment recorded', by: userName, at: new Date().toISOString() });
  els.paymentDialog.close();
  saveState();
  renderAll();
}

function saveClient() {
  const doc = getActiveDocument();
  if (!doc) {
    newDocument('quotation');
    return;
  }
  collectForm();
  const existingIndex = state.clients.findIndex((client) => client.id === doc.client.id || client.name === doc.client.name);
  if (existingIndex >= 0) state.clients[existingIndex] = structuredClone(doc.client);
  else state.clients.unshift(structuredClone(doc.client));
  saveState();
  els.autosaveStatus.textContent = existingIndex >= 0 ? 'Client updated' : 'Client added';
  renderAll();
}

function startNewClient() {
  const doc = getActiveDocument();
  if (!doc) {
    newDocument('quotation');
    return;
  }
  doc.client = createBlankClient();
  saveState();
  switchView('editor');
  renderEditor();
  els.clientSelect.value = '';
  els.clientName.focus();
  els.autosaveStatus.textContent = 'New client ready';
}

function updateLineFromNode(node, line) {
  const field = node.dataset.field;
  if (!field) return;
  if (field === 'unitPrice') line.unitPriceCents = cents(node.value);
  else if (field === 'discount') line.discountCents = cents(node.value);
  else if (field === 'taxRate') line.taxRate = Number(node.value || 0);
  else if (field === 'serviceItemId') {
    line.serviceItemId = node.value;
    const item = state.items.find((entry) => entry.id === node.value);
    if (item) {
      line.name = item.name;
      line.description = item.description;
      line.unit = item.unit;
      line.unitPriceCents = item.priceCents;
      line.taxRate = item.taxRate;
    }
  } else {
    line[field] = node.value;
  }
}

document.querySelectorAll('.sales-tabs button').forEach((button) => {
  button.addEventListener('click', () => {
    if (button.dataset.action === 'new-quotation') newDocument('quotation');
    else if (button.dataset.action === 'new-invoice') newDocument('invoice');
    else switchView(button.dataset.view);
  });
});

document.querySelectorAll('[data-view-jump]').forEach((button) => button.addEventListener('click', () => switchView(button.dataset.viewJump)));
document.getElementById('newQuotationTop').addEventListener('click', () => newDocument('quotation'));
document.getElementById('newInvoiceTop').addEventListener('click', () => newDocument('invoice'));
document.getElementById('printDocumentTop').addEventListener('click', () => window.print());
document.getElementById('printDocumentButton').addEventListener('click', () => window.print());

els.documentForm.addEventListener('input', collectForm);
els.documentForm.addEventListener('change', collectForm);
[els.installmentCurrent, els.installmentAmount].forEach((input) => {
  input.addEventListener('input', syncInstallmentPaidToDate);
  input.addEventListener('change', syncInstallmentPaidToDate);
});
[els.installmentTotalAmount, els.installmentTotal].forEach((input) => {
  input.addEventListener('input', syncInstallmentAmountFromTotal);
  input.addEventListener('change', syncInstallmentAmountFromTotal);
});
els.documentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  collectForm();
  const doc = getActiveDocument();
  if (!doc) return;
  doc.history.push({ action: 'Draft saved', by: userName, at: new Date().toISOString() });
  localStorage.setItem(storageKey, JSON.stringify(snapshotState()));
  els.autosaveStatus.textContent = 'Saving shared draft...';
  const saved = await saveStateNow('Draft saved to shared view');
  if (!saved) els.formError.textContent = 'Could not save to the shared view. Please try again.';
});

els.clientSelect.addEventListener('change', () => {
  const client = state.clients.find((item) => item.id === els.clientSelect.value);
  if (!client) return;
  const doc = getActiveDocument();
  if (!doc) return;
  doc.client = structuredClone(client);
  saveState();
  renderEditor();
});

els.lineItems.addEventListener('input', (event) => {
  const row = event.target.closest('.line-row');
  const doc = getActiveDocument();
  const line = doc?.items.find((item) => item.id === row?.dataset.id);
  if (!line) return;
  updateLineFromNode(event.target, line);
  saveState();
  const total = row.querySelector('[data-line-total]');
  if (total) total.textContent = money(calculateLine(line).total);
  renderPreview();
});

els.lineItems.addEventListener('change', (event) => {
  const row = event.target.closest('.line-row');
  const doc = getActiveDocument();
  const line = doc?.items.find((item) => item.id === row?.dataset.id);
  if (!line) return;
  updateLineFromNode(event.target, line);
  saveState();
  renderEditor();
});

els.lineItems.addEventListener('click', (event) => {
  const action = event.target.dataset.lineAction;
  if (!action) return;
  const doc = getActiveDocument();
  if (!doc) return;
  const row = event.target.closest('.line-row');
  const index = doc.items.findIndex((item) => item.id === row?.dataset.id);
  if (index < 0) return;
  if (action === 'remove' && doc.items.length > 1) doc.items.splice(index, 1);
  if (action === 'duplicate') doc.items.splice(index + 1, 0, { ...structuredClone(doc.items[index]), id: uid('line') });
  saveState();
  renderEditor();
});

els.addLineButton.addEventListener('click', () => {
  const doc = getActiveDocument();
  if (!doc) return;
  doc.items.push(createLineItem());
  saveState();
  renderEditor();
});

els.issueButton.addEventListener('click', issueDocument);
els.duplicateButton.addEventListener('click', () => duplicateDocument());
els.deleteButton.addEventListener('click', () => deleteDocument());
els.convertButton.addEventListener('click', convertToInvoice);
els.recordPaymentButton.addEventListener('click', recordPayment);
els.voidButton.addEventListener('click', () => {
  const doc = getActiveDocument();
  if (!doc) return;
  doc.status = 'Void';
  doc.history.push({ action: 'Voided', by: userName, at: new Date().toISOString() });
  saveState();
  saveStateNow('Document voided and saved');
  renderAll();
});
els.saveClientButton.addEventListener('click', saveClient);
els.createClientFromDirectory.addEventListener('click', startNewClient);
els.createItemButton.addEventListener('click', () => openItemDialog());
els.itemForm.addEventListener('submit', saveItem);
els.cancelItem.addEventListener('click', () => els.itemDialog.close());

els.clientDirectory.addEventListener('click', (event) => {
  const clientId = event.target.dataset.useClient;
  if (!clientId) return;
  const client = state.clients.find((item) => item.id === clientId);
  const doc = getActiveDocument();
  if (!client || !doc) return;
  doc.client = structuredClone(client);
  saveState();
  switchView('editor');
  renderAll();
});

els.serviceItemsDirectory.addEventListener('click', (event) => {
  const editButton = event.target.closest('button[data-edit-item]');
  if (editButton) {
    openItemDialog(editButton.dataset.editItem);
    return;
  }
  const deleteButton = event.target.closest('button[data-delete-item]');
  if (deleteButton) deleteItem(deleteButton.dataset.deleteItem);
});

els.documentRows.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-doc-action]');
  const action = button?.dataset.docAction;
  const id = button?.dataset.id;
  if (!action || !id) return;
  if (action === 'open') {
    state.activeDocumentId = id;
    saveState();
    switchView('editor');
    renderAll();
  }
  if (action === 'duplicate') duplicateDocument(id);
  if (action === 'delete') deleteDocument(id);
});

[els.documentSearch, els.documentStatusFilter, els.documentTypeFilter].forEach((input) => input.addEventListener('input', renderDocuments));
document.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('button[data-delete-doc]');
  const deleteId = deleteButton?.dataset.deleteDoc;
  if (deleteId) {
    deleteDocument(deleteId);
    return;
  }
  const openButton = event.target.closest('button[data-open-doc]');
  const id = openButton?.dataset.openDoc;
  if (id) {
    state.activeDocumentId = id;
    saveState();
    switchView('editor');
    renderAll();
  }
});

els.paymentForm.addEventListener('submit', savePayment);
els.cancelPayment.addEventListener('click', () => els.paymentDialog.close());

document.getElementById('downloadJsonButton').addEventListener('click', () => {
  const doc = getActiveDocument();
  if (!doc) return;
  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${doc.number}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
});

els.settingsForm.addEventListener('submit', (event) => {
  event.preventDefault();
  state.settings.companyName = document.getElementById('settingCompanyName').value;
  state.settings.registration = document.getElementById('settingRegistration').value;
  state.settings.email = document.getElementById('settingEmail').value;
  state.settings.phone = document.getElementById('settingPhone').value;
  state.settings.website = document.getElementById('settingWebsite').value;
  state.settings.address = document.getElementById('settingAddress').value;
  state.settings.quotationPrefix = document.getElementById('settingQuotationPrefix').value || 'QT';
  state.settings.invoicePrefix = document.getElementById('settingInvoicePrefix').value || 'INV';
  state.settings.quotationNext = Number(document.getElementById('settingQuotationNext').value || 1);
  state.settings.invoiceNext = Number(document.getElementById('settingInvoiceNext').value || 1);
  state.settings.validityDays = Number(document.getElementById('settingValidityDays').value || 14);
  state.settings.paymentDays = Number(document.getElementById('settingPaymentDays').value || 14);
  state.settings.quotationTerms = document.getElementById('settingQuotationTerms').value;
  state.settings.invoiceNotes = document.getElementById('settingInvoiceNotes').value;
  state.settings.footer = document.getElementById('settingFooter').value;
  state.settings.bankAccounts = document.getElementById('settingBankAccounts').value.split('\n').filter(Boolean).map((line) => {
    const [bank, holder, number, duitnow, instruction] = line.split('|').map((part) => part.trim());
    return { bank, holder, number, duitnow, instruction };
  });
  saveState();
  renderAll();
});

loadState().then(() => renderAll());

