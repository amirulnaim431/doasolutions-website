const statuses = [
  'Suggested, needs review',
  'Matched to invoice',
  'Matched to expense',
  'Matched to partner contribution',
  'Matched to partner reimbursement',
  'Personal transaction, ignore',
  'Unknown, needs review',
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

const csrf = document.querySelector('meta[name="doa-csrf"]').content;
const saveStatus = document.querySelector('#financeSaveStatus');
const importBrowser = document.querySelector('#importBrowserRecords');
let sharedReady = false;
let sharedBusy = false;

async function records(data) {
  if (sharedBusy) throw new Error('Another change is saving. Try again in a moment.');
  sharedBusy = true;
  try {
    const options = { cache: 'no-store' };
    if (data) Object.assign(options, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DOA-CSRF': csrf },
      body: JSON.stringify(data),
    });
    saveStatus.textContent = data ? 'Saving shared records…' : 'Loading shared records…';
    const response = await fetch('./records.php', options);
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.error || 'Shared records unavailable.');
    Object.assign(state, { transactions: payload.transactions, uploads: payload.uploads });
    sharedReady = true;
    saveStatus.textContent = 'Shared records loaded';
    render();
  } catch (error) {
    saveStatus.textContent = error.message;
    throw error;
  } finally {
    sharedBusy = false;
  }
}

function browserRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return {
      transactions: Array.isArray(saved.transactions) ? saved.transactions.filter(row => row.sourceName !== 'sample-july-2026.csv') : [],
      uploads: Array.isArray(saved.uploads) ? saved.uploads.filter(row => row.name !== 'sample-july-2026.csv').map(({rawContent,...row}) => row) : [],
    };
  } catch {
    return { transactions: [], uploads: [] };
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

async function addTransactions(rows, sourceName, storedFile = null) {
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
      status: suggested.status === 'Unknown, needs review' ? suggested.status : 'Suggested, needs review',
      note: '',
      sourceName,
      duplicate: false,
    };

    const key = transactionKey(transaction);
    transaction.duplicate = existingKeys.has(key);
    existingKeys.add(key);
    return transaction;
  });

  await records({ action: 'add', transactions: normalizedRows, uploads: [{
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: sourceName,
    owner,
    type,
    rows: normalizedRows.length,
    duplicateRows: normalizedRows.filter((row) => row.duplicate).length,
    importedAt: new Date().toLocaleString('en-MY'),
    storedFile,
  }] });
}

async function storeOriginalFile(file) {
  const body = new FormData();
  body.append('statement', file);

  const response = await fetch('./upload.php', {
    method: 'POST',
    headers: { 'X-DOA-CSRF': csrf },
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
  const review = state.transactions.filter((row) => ['Unknown, needs review', 'Suggested, needs review'].includes(row.status)).length;
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
        <select data-field="status" data-id="${escapeAttribute(row.id)}">
          ${statuses.map((status) => `<option ${status === row.status ? 'selected' : ''}>${status}</option>`).join('')}
        </select>
      </td>
      <td>
        <input data-field="note" data-id="${escapeAttribute(row.id)}" value="${escapeAttribute(row.note)}" placeholder="Manual correction note" />
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

importBrowser.addEventListener('click', async () => {
  if (!sharedReady || !confirm('Import this browser’s existing reconciliation records into the shared DOA Finance workspace?')) return;
  importBrowser.disabled = true;
  try {
    await records({ action: 'add', ...browserRecords() });
    saveStatus.textContent = 'Browser records imported. The original browser copy is still available.';
    importBrowser.hidden = true;
  } catch (error) {
    saveStatus.textContent = error.message;
  } finally {
    importBrowser.disabled = false;
  }
});

statementFile.addEventListener('change', async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (!sharedReady || sharedBusy) throw new Error('Wait for the shared workspace to finish loading.');
    statementFile.disabled = true;
    const extension = file.name.split('.').pop().toLowerCase();
    setParserStatus('Storing original file…');
    const original = await storeOriginalFile(file);
    if (extension === 'csv') {
      const rows = parseCsv(await file.text());
      await addTransactions(rows, file.name, original);
      setParserStatus(`${rows.length} CSV rows imported`);
    } else {
      await addTransactions([], file.name, original);
      setParserStatus(`${extension.toUpperCase()} stored. Use CSV to import transaction rows.`, 'warn');
    }
  } catch (error) {
    setParserStatus(error.message, 'danger');
  } finally {
    statementFile.disabled = false;
    statementFile.value = '';
  }
});

document.querySelector('#manualForm').addEventListener('submit', async event => {
  event.preventDefault();
  if (!sharedReady) return;
  const form = new FormData(event.currentTarget);
  const submit = event.currentTarget.querySelector('[type=submit]');
  submit.disabled = true;
  try {
    await addTransactions([{
      date: form.get('date'),
      description: form.get('description'),
      moneyIn: parseAmount(form.get('moneyIn')),
      moneyOut: parseAmount(form.get('moneyOut')),
    }], 'manual-entry');
    document.querySelector('#manualForm').reset();
  } catch (error) {
    saveStatus.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
});

transactionRows.addEventListener('change', async event => {
  const target = event.target;
  if (!target.dataset.id || !sharedReady) return;
  const row = state.transactions.find(item => item.id === target.dataset.id);
  if (!row) return;
  try {
    await records({ action: 'review', id: row.id, version: row.version, field: target.dataset.field, value: target.value });
  } catch (error) {
    saveStatus.textContent = error.message;
  }
});

statusFilter.addEventListener('change', renderRows);
searchInput.addEventListener('input', renderRows);

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

records().then(() => {
  const saved = browserRecords();
  importBrowser.hidden = !saved.transactions.length && !saved.uploads.length;
}).catch(() => {});
