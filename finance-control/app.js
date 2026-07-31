const statuses = [
  'Matched to invoice',
  'Matched to expense',
  'Matched to partner contribution',
  'Matched to partner reimbursement',
  'Personal transaction, ignore',
  'Unknown, needs review',
];

const sampleTransactions = [
  {
    date: '2026-07-01',
    description: 'FPX TRANSFER BIG EVENTS SDN BHD INV-2026-018',
    moneyIn: 2800,
    moneyOut: 0,
  },
  {
    date: '2026-07-02',
    description: 'GOOGLE WORKSPACE MONTHLY SUBSCRIPTION',
    moneyIn: 0,
    moneyOut: 72,
  },
  {
    date: '2026-07-03',
    description: 'OUN PERSONAL TRANSFER TO DOA CAPITAL',
    moneyIn: 1500,
    moneyOut: 0,
  },
  {
    date: '2026-07-04',
    description: 'MCDONALDS PERSONAL DINNER',
    moneyIn: 0,
    moneyOut: 38.9,
  },
  {
    date: '2026-07-05',
    description: 'HOSTINGER CLOUD HOSTING INVOICE',
    moneyIn: 0,
    moneyOut: 349,
  },
  {
    date: '2026-07-05',
    description: 'CLIENT PAYMENT ABOOS BARBERSHOP CRM INV-2026-021',
    moneyIn: 4200,
    moneyOut: 0,
  },
  {
    date: '2026-07-06',
    description: 'AZIM PAID CANVA TEAM USING PERSONAL CARD',
    moneyIn: 0,
    moneyOut: 120,
  },
  {
    date: '2026-07-07',
    description: 'ATM WITHDRAWAL CASH WALLET',
    moneyIn: 0,
    moneyOut: 500,
  },
];

const state = {
  transactions: [],
  uploads: [],
};

const storageKey = 'doa-finance-control-v1';

const transactionRows = document.querySelector('#transactionRows');
const uploadList = document.querySelector('#uploadList');
const accountOwner = document.querySelector('#accountOwner');
const accountType = document.querySelector('#accountType');
const statementFile = document.querySelector('#statementFile');
const parserStatus = document.querySelector('#parserStatus');
const statusFilter = document.querySelector('#statusFilter');
const searchInput = document.querySelector('#searchInput');

function currency(value) {
  return new Intl.NumberFormat('en-MY', {
    style: 'currency',
    currency: 'MYR',
  }).format(value || 0);
}

function saveState() {
  localStorage.setItem(storageKey, JSON.stringify({
    transactions: state.transactions,
    uploads: state.uploads,
  }));
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    state.transactions = Array.isArray(saved.transactions) ? saved.transactions : [];
    state.uploads = Array.isArray(saved.uploads) ? saved.uploads : [];
  } catch {
    state.transactions = [];
    state.uploads = [];
  }
}

function transactionKey(transaction) {
  return [
    transaction.date,
    normalize(transaction.description),
    Number(transaction.moneyIn || 0).toFixed(2),
    Number(transaction.moneyOut || 0).toFixed(2),
    transaction.owner,
  ].join('|');
}

function normalize(value) {
  return String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function suggestMatch(transaction) {
  const description = normalize(transaction.description);
  const incoming = Number(transaction.moneyIn) > 0;

  if (incoming && /(inv-|invoice|client payment|crm|website|maintenance)/.test(description)) {
    return { status: 'Matched to invoice', match: 'Invoice payment detected' };
  }

  if (/capital|contribution|transfer to doa/.test(description)) {
    return { status: 'Matched to partner contribution', match: 'Partner capital / contribution' };
  }

  if (/reimburse|paid .* personal|personal card/.test(description)) {
    return { status: 'Matched to partner reimbursement', match: 'Partner reimbursement' };
  }

  if (/hostinger|google|canva|domain|server|subscription|workspace/.test(description)) {
    return { status: 'Matched to expense', match: 'Business expense' };
  }

  if (/mcdonald|dinner|personal|shopping|grocer|family/.test(description)) {
    return { status: 'Personal transaction, ignore', match: 'Likely personal spending' };
  }

  return { status: 'Unknown, needs review', match: 'No confident match' };
}

function addTransactions(rows, sourceName, rawContent = '', storedFile = null) {
  const existingKeys = new Set(state.transactions.map(transactionKey));
  const owner = accountOwner.value;
  const type = accountType.value;
  const normalizedRows = rows.map((row, index) => {
    const suggested = suggestMatch(row);
    const transaction = {
      id: `${Date.now()}-${index}-${Math.random().toString(16).slice(2)}`,
      date: row.date || new Date().toISOString().slice(0, 10),
      description: row.description || 'Manual bank transaction',
      owner,
      accountType: type,
      moneyIn: Number(row.moneyIn || 0),
      moneyOut: Number(row.moneyOut || 0),
      match: suggested.match,
      status: suggested.status,
      note: '',
      sourceName,
      duplicate: false,
    };

    const key = transactionKey(transaction);
    transaction.duplicate = existingKeys.has(key);
    existingKeys.add(key);
    return transaction;
  });

  state.transactions = [...normalizedRows, ...state.transactions];
  state.uploads.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: sourceName,
    owner,
    type,
    rows: normalizedRows.length,
    duplicateRows: normalizedRows.filter((row) => row.duplicate).length,
    importedAt: new Date().toLocaleString('en-MY'),
    rawContent: rawContent.slice(0, 75000),
    storedFile,
  });

  saveState();
  render();
}

async function storeOriginalFile(file) {
  const body = new FormData();
  body.append('statement', file);

  const response = await fetch('./upload.php', {
    method: 'POST',
    body,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Could not store uploaded statement.');
  }

  return payload;
}

function parseAmount(value) {
  const cleaned = String(value || '').replace(/,/g, '').replace(/[^\d.-]/g, '');
  return Number(cleaned) || 0;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === ',' && !quoted) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (!lines.length) return [];

  const header = parseCsvLine(lines[0]).map(normalize);
  const dateIndex = header.findIndex((item) => /date|tarikh/.test(item));
  const descriptionIndex = header.findIndex((item) => /description|details|reference|transaction|butiran/.test(item));
  const debitIndex = header.findIndex((item) => /debit|withdrawal|money out|out|keluar/.test(item));
  const creditIndex = header.findIndex((item) => /credit|deposit|money in|in|masuk/.test(item));
  const amountIndex = header.findIndex((item) => item === 'amount' || item === 'jumlah');

  return lines.slice(1).map((line) => {
    const cells = parseCsvLine(line);
    const amount = amountIndex >= 0 ? parseAmount(cells[amountIndex]) : 0;
    return {
      date: cells[dateIndex] || new Date().toISOString().slice(0, 10),
      description: cells[descriptionIndex] || cells.find((cell) => Number.isNaN(Number(cell))) || 'Imported transaction',
      moneyIn: creditIndex >= 0 ? parseAmount(cells[creditIndex]) : Math.max(amount, 0),
      moneyOut: debitIndex >= 0 ? parseAmount(cells[debitIndex]) : Math.abs(Math.min(amount, 0)),
    };
  }).filter((row) => row.description || row.moneyIn || row.moneyOut);
}

function render() {
  renderMetrics();
  renderRows();
  renderUploads();
}

function renderMetrics() {
  const businessRows = state.transactions.filter((row) => row.status !== 'Personal transaction, ignore');
  const moneyIn = businessRows.reduce((sum, row) => sum + Number(row.moneyIn || 0), 0);
  const moneyOut = businessRows.reduce((sum, row) => sum + Number(row.moneyOut || 0), 0);
  const review = state.transactions.filter((row) => row.status === 'Unknown, needs review').length;
  const ignored = state.transactions.filter((row) => row.status === 'Personal transaction, ignore').length;

  document.querySelector('#moneyInMetric').textContent = currency(moneyIn);
  document.querySelector('#moneyOutMetric').textContent = currency(moneyOut);
  document.querySelector('#reviewMetric').textContent = String(review);
  document.querySelector('#ignoredMetric').textContent = String(ignored);
}

function renderRows() {
  const filter = statusFilter.value;
  const query = normalize(searchInput.value);

  const rows = state.transactions.filter((row) => {
    const statusMatch = filter === 'all' || row.status === filter;
    const queryMatch = !query || normalize(`${row.description} ${row.owner} ${row.match} ${row.status}`).includes(query);
    return statusMatch && queryMatch;
  });

  if (!rows.length) {
    transactionRows.innerHTML = '<tr><td colspan="8">No transactions yet. Upload a CSV, load the sample statement, or add a manual entry.</td></tr>';
    return;
  }

  transactionRows.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.date)}</td>
      <td>
        <strong>${escapeHtml(row.description)}</strong>
        ${row.duplicate ? '<span class="duplicate-pill">Possible duplicate upload</span>' : ''}
      </td>
      <td>${escapeHtml(row.owner)}<br /><small>${escapeHtml(row.accountType)}</small></td>
      <td class="amount-in">${row.moneyIn ? currency(row.moneyIn) : '-'}</td>
      <td class="amount-out">${row.moneyOut ? currency(row.moneyOut) : '-'}</td>
      <td><span class="match-pill">${escapeHtml(row.match)}</span></td>
      <td>
        <select data-field="status" data-id="${row.id}">
          ${statuses.map((status) => `<option ${status === row.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </td>
      <td>
        <input data-field="note" data-id="${row.id}" value="${escapeAttribute(row.note)}" placeholder="Manual correction note" />
      </td>
    </tr>
  `).join('');
}

function renderUploads() {
  if (!state.uploads.length) {
    uploadList.innerHTML = '<p class="intro">No statement files stored yet.</p>';
    return;
  }

  uploadList.innerHTML = state.uploads.map((upload) => `
    <div class="upload-item">
      <div>
        <strong>${escapeHtml(upload.name)}</strong>
        <small>${escapeHtml(upload.owner)} · ${escapeHtml(upload.type)} · ${upload.rows} rows · ${upload.duplicateRows} duplicate warning(s)</small>
        ${upload.storedFile ? `<small>Stored source: ${escapeHtml(upload.storedFile.storedName)}</small>` : ''}
      </div>
      <small>${escapeHtml(upload.importedAt)}</small>
    </div>
  `).join('');
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll('\n', ' ');
}

function setParserStatus(label, type = 'neutral') {
  parserStatus.textContent = label;
  parserStatus.className = `status-badge ${type}`;
}

function showSection(sectionName, shouldPersist = true) {
  const target = document.querySelector(`#section-${sectionName}`);
  const button = document.querySelector(`.sidebar-nav button[data-section="${sectionName}"]`);
  if (!target || !button) return;

  document.querySelectorAll('.sidebar-nav button').forEach((item) => item.classList.remove('is-active'));
  button.classList.add('is-active');
  document.querySelectorAll('.section').forEach((section) => section.classList.remove('is-visible'));
  target.classList.add('is-visible');

  if (shouldPersist) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('section', sectionName);
    window.history.replaceState(null, '', nextUrl);
  }
}

document.querySelectorAll('.sidebar-nav button').forEach((button) => {
  button.addEventListener('click', () => showSection(button.dataset.section));
});

const initialSection = new URLSearchParams(window.location.search).get('section');
if (initialSection) showSection(initialSection, false);

document.querySelector('#loadSampleButton').addEventListener('click', () => {
  addTransactions(sampleTransactions, 'sample-july-2026.csv', 'Sample statement generated in browser.');
  setParserStatus('Sample imported');
});

document.querySelector('#clearStatementButton').addEventListener('click', () => {
  state.transactions = [];
  state.uploads = [];
  saveState();
  setParserStatus('Rows cleared');
  render();
});

statementFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const extension = file.name.split('.').pop().toLowerCase();
  let storedFile = null;

  try {
    setParserStatus('Storing original file...');
    storedFile = await storeOriginalFile(file);
  } catch (error) {
    setParserStatus(error.message, 'danger');
    return;
  }

  if (extension === 'csv') {
    const text = await file.text();
    const rows = parseCsv(text);
    addTransactions(rows, file.name, text, storedFile);
    setParserStatus(`${rows.length} CSV rows imported`);
    return;
  }

  state.uploads.unshift({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: file.name,
    owner: accountOwner.value,
    type: accountType.value,
    rows: 0,
    duplicateRows: 0,
    importedAt: new Date().toLocaleString('en-MY'),
    rawContent: '',
    storedFile,
  });

  saveState();
  setParserStatus(`${extension.toUpperCase()} stored, parser later`, 'warn');
  renderUploads();
});

document.querySelector('#manualForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  addTransactions([{
    date: form.get('date'),
    description: form.get('description'),
    moneyIn: parseAmount(form.get('moneyIn')),
    moneyOut: parseAmount(form.get('moneyOut')),
  }], 'manual-entry');
  event.currentTarget.reset();
});

transactionRows.addEventListener('change', (event) => {
  const target = event.target;
  if (!target.dataset.id) return;
  const row = state.transactions.find((item) => item.id === target.dataset.id);
  if (!row) return;
  row[target.dataset.field] = target.value;
  saveState();
  renderMetrics();
});

transactionRows.addEventListener('input', (event) => {
  const target = event.target;
  if (!target.dataset.id || target.dataset.field !== 'note') return;
  const row = state.transactions.find((item) => item.id === target.dataset.id);
  if (!row) return;
  row.note = target.value;
  saveState();
});

statusFilter.addEventListener('change', renderRows);
searchInput.addEventListener('input', renderRows);

document.querySelector('#resetDemoButton').addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  state.transactions = [];
  state.uploads = [];
  render();
  setParserStatus('Demo reset');
});

document.querySelector('#exportButton').addEventListener('click', () => {
  const headers = ['date', 'description', 'owner', 'accountType', 'moneyIn', 'moneyOut', 'match', 'status', 'note', 'sourceName', 'duplicate'];
  const csv = [
    headers.join(','),
    ...state.transactions.map((row) => headers.map((header) => `"${String(row[header] ?? '').replaceAll('"', '""')}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'doa-bank-reconciliation-review.csv';
  link.click();
  URL.revokeObjectURL(link.href);
});

loadState();
render();
