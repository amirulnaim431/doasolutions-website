(() => {
  'use strict';
  const byId = id => document.getElementById('bo-' + id);
  const user = document.body.dataset.user;
  const operations = document.body.dataset.page === 'operations';
  const csrf = document.querySelector('meta[name="doa-csrf"]').content;
  const names = { oun: 'Oun', azim_aziz: 'Azim Aziz' };
  const lanes = { todo: 'To do', doing: 'In progress', done: 'Done' };
  const money = new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR' });
  const time = new Intl.DateTimeFormat('en-MY', { timeStyle: 'short', timeZone: 'Asia/Kuala_Lumpur' });
  const day = new Intl.DateTimeFormat('en-MY', { dateStyle: 'medium', timeZone: 'Asia/Kuala_Lumpur' });
  let state;
  let busy = false;
  let generation = 0;
  let editing;
  let noteVersion = 0;
  let noteDirty = false;
  let noteTimer;
  let noteBusy = false;
  let tool = 'pen';
  let drawing;
  let pendingStroke;
  let chatRequest;
  let chatSignature;
  let tasksSignature;
  const canvas = byId('doodle');
  const context = canvas?.getContext('2d');
  const taskForm = byId('task-form');
  const dialog = byId('task-dialog');

  function node(tag, text, className) {
    const element = document.createElement(tag);
    if (text !== undefined) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function error(message = '', area = byId('error')) {
    area.textContent = message;
    area.hidden = !message;
  }

  async function request(data) {
    const options = { cache: 'no-store', signal: AbortSignal.timeout(12000) };
    if (data) Object.assign(options, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'X-DOA-CSRF': csrf },
      body: JSON.stringify(data),
    });
    const response = await fetch('/back-office/api.php', options);
    const payload = await response.json();
    if (!response.ok) throw Object.assign(new Error(payload.error || 'Request failed.'), { status: response.status });
    return payload;
  }

  async function refresh() {
    if (busy || document.hidden) return;
    const started = ++generation;
    try {
      const updates = await request();
      if (started !== generation) return;
      show(updates);
    } catch (problem) {
      if (started !== generation) return;
      byId('presence').textContent = 'Online status unavailable';
      error(problem.status === 401 ? 'Your session expired. Open Sign in in a new tab to keep your draft here.' : 'Could not refresh the workspace. Reconnecting…');
    }
  }

  async function save(data) {
    if (busy) throw new Error('Another change is saving. Try again in a moment.');
    busy = true;
    generation += 1;
    try {
      const updates = await request(data);
      show(updates);
      error();
    } finally {
      busy = false;
    }
  }

  function avatar(owner) {
    return node('span', owner === 'azim_aziz' ? 'Z' : 'O', 'bo-avatar' + (owner === 'azim_aziz' ? ' azim' : ''));
  }

  function show(updates) {
    state = updates;
    byId('presence').replaceChildren(...state.presence.map(person => {
      const badge = node('div', undefined, 'bo-person');
      badge.dataset.online = String(person.online);
      badge.title = person.name + (person.online ? ' is online' : ' is offline');
      badge.append(avatar(person.id), node('span', person.name + (person.online ? ' · Online' : ' · Offline')));
      return badge;
    }));
    const signature = JSON.stringify([state.tasks, state.today]);
    if (signature !== tasksSignature) {
      tasksSignature = signature;
      renderTasks();
    }
    if (operations) {
      renderMessages();
      if (!noteDirty) adoptNote(state.note);
      renderDrawing();
    } else {
      byId('balance').textContent = state.balance === null ? 'Unavailable' : money.format(state.balance / 100);
      const recent = state.messages.slice(-3).reverse();
      byId('recent').replaceChildren(...(recent.length ? recent.map(entry => {
        const item = node('div', undefined, 'bo-recent-entry');
        item.append(node('strong', names[entry.owner] || entry.owner), node('div', entry.body.slice(0,150)));
        return item;
      }) : [node('p', 'No team messages yet.')]));
    }
  }

  function taskButton(task) {
    const button = node('button', undefined, 'bo-task');
    button.type = 'button';
    const meta = node('small');
    meta.append(node('span', names[task.owner] || task.owner), node('span', task.due || 'No due date'));
    button.append(node('strong', task.title), meta);
    button.addEventListener('click', () => openTask(task));
    return button;
  }

  function renderTasks() {
    if (!state) return;
    if (!operations) {
      const active = state.tasks.filter(task => task.status !== 'done');
      byId('due').textContent = active.filter(task => task.due === state.today).length;
      byId('progress').textContent = active.filter(task => task.status === 'doing').length;
      byId('upcoming').replaceChildren(...(active.length ? active.slice(0,8).map(taskButton) : [node('p','No upcoming tasks. Add one to get started.')]));
      return;
    }
    const period = byId('period').value;
    const filtered = state.tasks.filter(task => {
      if (period === 'overdue') return task.due && task.due < state.today && task.status !== 'done';
      if (period === 'week') return task.due >= state.weekStart && task.due <= state.weekEnd;
      return true;
    });
    byId('board').replaceChildren(...Object.entries(lanes).map(([status,label]) => {
      const column = node('section', undefined, 'bo-lane');
      const tasks = filtered.filter(task => task.status === status);
      const title = node('h3', label);
      title.append(node('span', tasks.length));
      column.append(title, ...(tasks.length ? tasks.map(taskButton) : [node('p','No tasks')]));
      return column;
    }));
  }

  function openTask(task) {
    editing = task || { id: crypto.randomUUID(), version: 0, title: '', owner: user, due: '', status: 'todo' };
    byId('task-heading').textContent = task ? 'Edit task' : 'Add task';
    for (const field of ['title','owner','due','status']) taskForm.elements.namedItem(field).value = editing[field];
    error('', byId('task-error'));
    dialog.showModal();
  }

  byId('new-task').addEventListener('click', () => openTask());
  byId('cancel-task').addEventListener('click', () => dialog.close());
  taskForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = taskForm.querySelector('[type=submit]');
    submit.disabled = true;
    try {
      await save({ action: 'task', id: editing.id, version: editing.version, ...Object.fromEntries(new FormData(taskForm)) });
      dialog.close();
    } catch (problem) {
      error(problem.message, byId('task-error'));
      if (problem.status === 409) await refresh();
    } finally {
      submit.disabled = false;
    }
  });

  function renderMessages() {
    const log = byId('messages');
    const signature = JSON.stringify([state.messages.at(-1)?.id, state.attachments.map(file => [file.id,file.deleted])]);
    if (signature === chatSignature) return;
    const stick = chatSignature === undefined || log.scrollHeight - log.scrollTop - log.clientHeight < 80;
    chatSignature = signature;
    const rows = [];
    let previousDay;
    const entries = [...state.messages, ...state.attachments.filter(file => !file.deleted).map(file => ({...file, attachment:true}))]
      .sort((a,b) => a.created - b.created);
    const previousFiles = new Map([...log.querySelectorAll('[data-attachment]')].map(card => [card.dataset.attachment,card]));
    for (const message of entries) {
      const when = new Date(message.created * 1000);
      const date = day.format(when);
      if (date !== previousDay) rows.push(node('p', date));
      previousDay = date;
      const container = node('div', undefined, 'bo-message' + (message.owner === user ? ' mine' : ''));
      const content = node('div');
      const header = node('header');
      header.append(node('strong', names[message.owner] || message.owner), node('time', time.format(when)));
      content.append(header, message.attachment ? (previousFiles.get(message.id) || fileCard(message)) : node('p', message.body));
      container.append(avatar(message.owner), content);
      rows.push(container);
    }
    log.replaceChildren(...(rows.length ? rows : [node('p', 'Start a conversation with your teammate.')]));
    if (stick) log.scrollTop = log.scrollHeight;
    renderTrash();
  }

  function formatBytes(bytes) {
    return bytes >= 1048576 ? (bytes / 1048576).toFixed(1) + ' MB' : Math.max(1,Math.round(bytes / 1024)) + ' KB';
  }

  function fileCard(file) {
    const card = node('div', undefined, 'bo-file-card');
    card.dataset.attachment = file.id;
    const url = '/back-office/files.php?id=' + encodeURIComponent(file.id);
    card.append(node('strong',file.name), node('small',formatBytes(file.stored) + (file.stored < file.bytes ? ' stored · compressed' : '')));
    const type = file.mime.split('/')[0];
    if (['audio','video','image'].includes(type)) {
      const preview = node(type === 'image' ? 'img' : type);
      if (type === 'image') {
        preview.alt = file.name;
        preview.loading = 'lazy';
      } else {
        preview.controls = true;
        preview.preload = 'none';
      }
      preview.src = url;
      card.append(preview);
    }
    const actions = node('div');
    const download = node('a','Download');
    download.href = url + '&download=1';
    const trash = node('button','Move to Trash');
    trash.type = 'button';
    trash.addEventListener('click', async () => {
      try { await save({action:'trash-file',id:file.id}); } catch (problem) { error(problem.message); }
    });
    actions.append(download,trash);
    card.append(actions);
    return card;
  }

  function renderTrash() {
    const list = byId('trash-list');
    const files = state?.attachments.filter(file => file.deleted) || [];
    byId('file-trash').textContent = files.length ? 'Trash (' + files.length + ')' : 'Trash';
    list.replaceChildren(...(files.length ? files.map(file => {
      const card = node('div',undefined,'bo-file-card');
      const actions = node('div');
      const restore = node('button','Restore');
      restore.type = 'button';
      restore.addEventListener('click', async () => {
        try { await save({action:'restore-file',id:file.id}); } catch (problem) { error(problem.message); }
      });
      const remove = node('button','Delete permanently');
      remove.type = 'button';
      remove.addEventListener('click', async () => {
        if (!confirm('Permanently delete “' + file.name + '” for both users?')) return;
        const body = new FormData();
        body.set('purge',file.id);
        try { await fileRequest(body); await refresh(); } catch (problem) { error(problem.message); }
      });
      actions.append(restore,remove);
      card.append(node('strong',file.name),actions);
      return card;
    }) : [node('p','Trash is empty.')]));
  }

  async function fileRequest(body) {
    const response = await fetch('/back-office/files.php', {method:'POST',headers:{'X-DOA-CSRF':csrf},body});
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Upload failed. The server may have rejected the file size.');
    return result;
  }

  async function compressImage(file) {
    if (!['image/jpeg','image/png','image/webp'].includes(file.type) || file.size < 180000) return file;
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1,1920 / Math.max(bitmap.width,bitmap.height));
      const image = document.createElement('canvas');
      image.width = Math.max(1,Math.round(bitmap.width*scale));
      image.height = Math.max(1,Math.round(bitmap.height*scale));
      image.getContext('2d').drawImage(bitmap,0,0,image.width,image.height);
      bitmap.close();
      const blob = await new Promise(resolve => image.toBlob(resolve,'image/webp',.84));
      if (!blob || blob.type !== 'image/webp' || blob.size >= file.size * .95) return file;
      return new File([blob],file.name.replace(/\.[^.]+$/, '') + '.webp',{type:'image/webp'});
    } catch { return file; }
  }

  let uploading = false;
  async function shareFiles(files) {
    if (uploading || !files.length) return;
    uploading = true;
    let shared = 0;
    const failed = [];
    for (const original of files) {
      byId('file-status').textContent = 'Uploading ' + original.name + '…';
      try {
        const file = await compressImage(original);
        if (file.size > 25 * 1024 * 1024) throw new Error('25 MB limit per file.');
        const body = new FormData();
        body.set('file',file,file.name);
        await fileRequest(body);
        shared++;
      } catch (problem) {
        failed.push(original.name + ' · ' + problem.message);
      }
    }
    byId('file-status').textContent = shared ? shared + (shared === 1 ? ' file shared' : ' files shared') : 'Drop files here';
    if (failed.length) error(failed.join(' '));
    uploading = false;
    await refresh();
  }

  function adoptNote(note) {
    const input = byId('note');
    if (input.value !== note.body) input.value = note.body;
    input.disabled = false;
    noteVersion = note.version;
    byId('note-status').textContent = 'Saved';
    byId('reload-note').hidden = true;
    byId('save-note').disabled = true;
  }

  async function saveNote() {
    clearTimeout(noteTimer);
    if (!noteDirty || noteBusy) return;
    if (busy) {
      noteTimer = setTimeout(saveNote, 500);
      return;
    }
    noteBusy = true;
    const original = byId('note').value;
    byId('note-status').textContent = 'Saving…';
    try {
      await save({ action:'note', version:noteVersion, body:original });
      noteDirty = byId('note').value !== original;
      noteVersion = state.note.version;
      if (noteDirty) noteTimer = setTimeout(saveNote, 800);
      else adoptNote(state.note);
    } catch (problem) {
      byId('note-status').textContent = problem.status === 409 ? 'Another edit was saved' : 'Unsaved';
      byId('reload-note').hidden = problem.status !== 409;
      error(problem.message);
    } finally {
      noteBusy = false;
    }
  }

  function renderDrawing() {
    if (!context || !state) return;
    context.clearRect(0,0,canvas.width,canvas.height);
    const strokes = [...state.strokes];
    if (pendingStroke && !strokes.some(s => s.id === pendingStroke.id)) strokes.push(pendingStroke);
    if (drawing) strokes.push(drawing);
    for (const stroke of strokes) {
      context.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';
      context.strokeStyle = stroke.tool === 'highlight' ? '#a2c94666' : '#07643d';
      context.lineWidth = { pen:3, highlight:17, eraser:27 }[stroke.tool];
      context.lineCap = 'round';
      context.lineJoin = 'round';
      const [x,y] = stroke.points[0];
      context.beginPath();
      context.moveTo(x*canvas.width,y*canvas.height);
      context.lineTo(x*canvas.width+.01,y*canvas.height);
      for (const [px,py] of stroke.points.slice(1)) context.lineTo(px*canvas.width,py*canvas.height);
      context.stroke();
    }
    context.globalCompositeOperation = 'source-over';
  }

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    const norm = n => Math.round(Math.max(0, Math.min(1,n))*10000)/10000;
    return [norm((event.clientX-rect.left)/rect.width),norm((event.clientY-rect.top)/rect.height)];
  }

  if (operations) {
    const picker = byId('file-input');
    const chat = byId('chat-form').closest('.bo-chat');
    byId('pick-file').addEventListener('click', () => picker.click());
    picker.addEventListener('change', () => {
      shareFiles([...picker.files]);
      picker.value = '';
    });
    chat.addEventListener('dragover', event => {
      if (event.dataTransfer.types.includes('Files')) {
        event.preventDefault();
        chat.classList.add('is-drop-target');
      }
    });
    chat.addEventListener('dragleave', event => {
      if (!chat.contains(event.relatedTarget)) chat.classList.remove('is-drop-target');
    });
    chat.addEventListener('drop', event => {
      event.preventDefault();
      chat.classList.remove('is-drop-target');
      shareFiles([...event.dataTransfer.files]);
    });
    byId('file-trash').addEventListener('click', () => {
      const list = byId('trash-list');
      list.hidden = !list.hidden;
      byId('file-trash').setAttribute('aria-expanded',String(!list.hidden));
      renderTrash();
    });
    byId('period').addEventListener('change', renderTasks);
    byId('chat-form').addEventListener('submit', async event => {
      event.preventDefault();
      const input = event.currentTarget.elements.namedItem('body');
      const submit = event.currentTarget.querySelector('button');
      const body = input.value.trim();
      if (!body) return;
      if (chatRequest?.body !== body) chatRequest = { action:'message', id:crypto.randomUUID(), body };
      submit.disabled = true;
      try {
        await save(chatRequest);
        if (input.value.trim() === body) input.value = '';
        chatRequest = null;
        const log = byId('messages');
        log.scrollTop = log.scrollHeight;
      } catch (problem) { error(problem.message); }
      finally { submit.disabled = false; }
    });
    byId('note').addEventListener('input', () => {
      noteDirty = true;
      byId('save-note').disabled = false;
      byId('note-status').textContent = 'Unsaved';
      clearTimeout(noteTimer);
      noteTimer = setTimeout(saveNote, 900);
    });
    byId('save-note').addEventListener('click', saveNote);
    byId('reload-note').addEventListener('click', async () => {
      if (!confirm('Replace your current draft with the latest saved note?')) return;
      noteDirty = false;
      await refresh();
    });
    document.querySelectorAll('[data-tool]').forEach(button => button.addEventListener('click', () => {
      tool = button.dataset.tool;
      document.querySelectorAll('[data-tool]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    }));
    canvas.addEventListener('pointerdown', event => {
      if (!state || drawing || pendingStroke || busy || event.button !== 0) return;
      canvas.setPointerCapture(event.pointerId);
      drawing = { id:crypto.randomUUID(), action:'stroke', tool, points:[point(event)], pointer:event.pointerId };
      renderDrawing();
    });
    canvas.addEventListener('pointermove', event => {
      if (!drawing || drawing.pointer !== event.pointerId || drawing.points.length >= 800) return;
      drawing.points.push(point(event));
      renderDrawing();
    });
    canvas.addEventListener('pointercancel', () => { drawing = null; renderDrawing(); });
    canvas.addEventListener('pointerup', async event => {
      if (!drawing || drawing.pointer !== event.pointerId) return;
      pendingStroke = drawing;
      drawing = null;
      try {
        await save(pendingStroke);
        byId('doodle-status').textContent = 'Saved';
      } catch (problem) { error(problem.message); byId('doodle-status').textContent = 'Stroke not saved'; }
      finally { pendingStroke = null; renderDrawing(); }
    });
    byId('undo').addEventListener('click', async () => {
      const last = state?.strokes.findLast(stroke => stroke.owner === user);
      if (!last) return;
      try { await save({action:'undo',id:last.id}); }
      catch (problem) { error(problem.message); }
    });
    window.addEventListener('beforeunload', event => {
      if (noteDirty || pendingStroke) event.preventDefault();
    });
  }
  refresh();
  setInterval(refresh, operations ? 5000 : 20000);
  document.addEventListener('visibilitychange', refresh);
})();
