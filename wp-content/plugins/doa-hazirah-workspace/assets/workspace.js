(() => {
  "use strict";

  const config = window.DOAHazirah;
  const main = document.getElementById("hazi-main");
  const modalRoot = document.getElementById("modal-root");
  const toastRegion = document.getElementById("toast-region");
  const state = {
    data: null,
    view: "overview",
    year: Number(config.year),
    calendarMonth: new Date(`${config.today}T12:00:00`).getMonth(),
    search: "",
    filters: { status: "", priority: "" },
    timelineScale: "month",
    pendingDateChange: null,
    savedAt: null,
  };

  const esc = (value = "") => String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
  const label = (map, key) => map[key] || key;
  const dateObj = value => new Date(`${value}T12:00:00`);
  const isoDate = date => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const addDays = (value, days) => {
    const date = dateObj(value);
    date.setDate(date.getDate() + days);
    return isoDate(date);
  };
  const dayDiff = (a, b) => Math.round((dateObj(b) - dateObj(a)) / 86400000);
  const niceDate = (value, withYear = false) => {
    if (!value) return "—";
    return new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) }).format(dateObj(value));
  };
  const niceDateTime = value => value ? new Intl.DateTimeFormat("en-MY", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value.replace(" ", "T"))) : "";
  const monthNames = Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat("en", { month: "long" }).format(new Date(2026, i, 1)));
  const colorFor = () => "#087f62";
  const timelineWidths = { month: 104, week: 208, day: 620 };
  const icon = (name, className = "") => `<svg class="ui-icon ${esc(className)}" aria-hidden="true" focusable="false"><use href="${esc(config.iconSprite)}#icon-${esc(name)}"></use></svg>`;
  const addProjectButton = () => `<button class="primary-button add-project-button">${icon("plus")}<span>Add project</span></button>`;

  async function api(path, options = {}) {
    const response = await fetch(`${config.api}${path}`, {
      credentials: "same-origin",
      ...options,
      headers: { "Content-Type": "application/json", "X-WP-Nonce": config.nonce, ...(options.headers || {}) },
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.message || "Something went wrong. Please try again.");
    if (payload.nonce) config.nonce = payload.nonce;
    return payload;
  }

  function toast(message, type = "") {
    const item = document.createElement("div");
    item.className = `toast ${type}`;
    item.textContent = message;
    toastRegion.appendChild(item);
    setTimeout(() => item.remove(), 3500);
  }

  function projects({ includeArchived = false } = {}) {
    if (!state.data) return [];
    const query = state.search.trim().toLowerCase();
    return state.data.projects.filter(project => {
      if (!includeArchived && project.archived) return false;
      if (query && !`${project.title} ${project.owner || ""} ${project.client_department || ""} ${project.description || ""}`.toLowerCase().includes(query)) return false;
      if (state.filters.status && project.status !== state.filters.status) return false;
      if (state.filters.priority && project.priority !== state.filters.priority) return false;
      return true;
    });
  }

  function summaryFrom(items) {
    const today = config.today;
    const monthEnd = new Date(dateObj(today).getFullYear(), dateObj(today).getMonth() + 1, 0);
    const end = isoDate(monthEnd);
    return {
      active: items.filter(p => !["completed", "cancelled"].includes(p.status) && !p.archived).length,
      due_this_month: items.filter(p => p.due_date && p.due_date >= today && p.due_date <= end && p.status !== "completed" && !p.archived).length,
      upcoming: items.filter(p => p.start_date && p.start_date > today && p.status !== "completed" && !p.archived).length,
      completed: items.filter(p => p.status === "completed" && !p.archived).length,
      overdue: items.filter(p => p.due_date && p.due_date < today && !["completed", "cancelled"].includes(p.status) && !p.archived).length,
    };
  }

  function header(kicker, title, text, actions = "") {
    return `<div class="page-heading"><div><span class="eyebrow">${esc(kicker)}</span><h1>${esc(title)}</h1><p>${esc(text)}</p></div>${actions ? `<div class="heading-actions">${actions}</div>` : ""}</div>`;
  }

  function passwordNotice() {
    if (!state.data.settings.force_password || state.view === "settings") return "";
    return `<div class="force-password"><div><strong>Make this space completely yours</strong><span>Please replace the temporary password in Settings.</span></div><button class="secondary-button" data-view-jump="settings">Change password</button></div>`;
  }

  function statusBadge(project) {
    return `<span class="badge status-${esc(project.status)}">${esc(label(config.statusLabels, project.status))}</span>`;
  }
  function priorityBadge(project) {
    return `<span class="badge priority-${esc(project.priority)}">${esc(label(config.priorityLabels, project.priority))}</span>`;
  }
  function progress(project) {
    return `<div class="progress-wrap"><div class="progress-track"><i style="width:${Number(project.progress)}%"></i></div><span>${Number(project.progress)}%</span></div>`;
  }
  function emptyState(title, copy, button = true) {
    return `<div class="empty-state"><div class="empty-icon">${icon("folder")}</div><h3>${esc(title)}</h3><p>${esc(copy)}</p>${button ? addProjectButton() : ""}</div>`;
  }

  function projectRows(items, compact = false) {
    if (!items.length) return emptyState("A fresh page", "Nothing matches this view yet. Adjust the filters or add a new project.");
    return `<div class="project-list">${items.map(project => `
      <div class="project-row">
        <div class="project-main"><i class="project-dot" style="background:${esc(colorFor(project))}"></i><span><strong>${esc(project.title)}</strong><small>${esc(project.client_department || project.owner || "Project owner")}</small></span></div>
        <div class="date-cell"><span class="cell-label">Due</span>${niceDate(project.due_date, true)}</div>
        <div>${statusBadge(project)}</div>
        <div class="priority-cell">${progress(project)}</div>
        <button class="open-button" data-open="${project.id}" aria-label="Open ${esc(project.title)}">${icon("chevron-right")}</button>
      </div>`).join("")}</div>`;
  }

  function renderOverview() {
    const items = projects();
    const summary = summaryFrom(state.data.projects);
    const attention = items.filter(p => p.warnings?.length || (p.due_date && p.due_date < config.today && !["completed", "cancelled"].includes(p.status))).slice(0, 5);
    const current = items.filter(p => p.start_date && p.due_date && p.start_date <= config.today && p.due_date >= config.today && !["completed", "cancelled"].includes(p.status)).slice(0, 6);
    const completed = state.data.projects.filter(p => p.status === "completed").length;
    const annualPercent = state.data.projects.length ? Math.round((completed / state.data.projects.length) * 100) : 0;
    main.innerHTML = `
      ${header("Monday momentum", `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${state.data.settings.display_name}`, "Here’s what is moving, what needs attention, and what you can feel good about.")}
      ${passwordNotice()}
      <section class="summary-grid" aria-label="Project summary">
        ${[
          ["folder", "Active projects", summary.active, "Moving right now"],
          ["clock", "Due this month", summary.due_this_month, "Keep these close"],
          ["calendar", "Upcoming", summary.upcoming, "Ready when you are"],
          ["completed", "Completed", summary.completed, "Nicely done"],
          ["warning", "Overdue", summary.overdue, summary.overdue ? "Needs a little love" : "All clear"],
        ].map(card => `<article class="summary-card"><div class="summary-card-top">${icon(card[0])}<small>${card[1]}</small></div><strong>${card[2]}</strong><span>${card[3]}</span></article>`).join("")}
      </section>
      <div class="dashboard-grid">
        <div class="stack">
          <section class="panel"><div class="panel-head"><div><h2>Current projects</h2><p>The work sitting on your desk right now</p></div><button class="text-button" data-view-jump="projects">See all</button></div>${projectRows(current)}</section>
          <section class="panel"><div class="panel-head"><div><h2>Upcoming deadlines</h2><p>Your next important dates</p></div><button class="text-button" data-view-jump="calendar">Calendar</button></div>${projectRows(items.filter(p => p.due_date && p.due_date >= config.today && p.status !== "completed").sort((a,b) => a.due_date.localeCompare(b.due_date)).slice(0,5), true)}</section>
        </div>
        <div class="stack">
          <section class="panel"><div class="panel-head"><div><h3>Needs attention</h3><p>Conflicts, overlaps and overdue work</p></div></div><div class="panel-body attention-list">${attention.length ? attention.map(p => `<button class="attention-item" data-open="${p.id}" style="border:0;width:100%;text-align:left;cursor:pointer"><i></i><span><strong>${esc(p.title)}</strong><small>${esc(p.warnings?.[0]?.message || `Overdue since ${niceDate(p.due_date)}`)}</small></span>${icon("chevron-right")}</button>`).join("") : `<div class="empty-state compact-empty"><div class="empty-icon">${icon("check-circle")}</div><h3>All clear</h3><p>No urgent conflicts need your attention.</p></div>`}</div></section>
          <section class="year-progress"><h3>Your ${state.year} progress</h3><p>Every completed project moves the year forward.</p><div class="big-progress"><i style="width:${annualPercent}%"></i></div><strong>${annualPercent}%</strong></section>
          <section class="panel"><div class="panel-head"><div><h3>Recent activity</h3><p>Your latest workspace changes</p></div></div><div class="panel-body activity-list">${state.data.activity.slice(0,7).map(a => `<div class="activity-item"><span class="activity-icon">${icon("check-circle")}</span><span><strong>${esc(a.action)}${a.title ? ` · ${esc(a.title)}` : ""}</strong><small>${niceDateTime(a.created_at)}</small></span></div>`).join("") || `<div class="empty-state compact-empty"><div class="empty-icon">${icon("clock")}</div><h3>No activity yet</h3><p>Your latest changes will appear here.</p></div>`}</div></section>
        </div>
      </div>`;
  }

  function filtersToolbar(extra = "") {
    return `<div class="toolbar"><div class="toolbar-group">
      <input class="field-control search-control view-search" type="search" value="${esc(state.search)}" placeholder="Search projects…">
      <select class="field-control filter-status"><option value="">All statuses</option>${Object.entries(config.statusLabels).map(([key, value]) => `<option value="${key}" ${state.filters.status === key ? "selected" : ""}>${esc(value)}</option>`).join("")}</select>
      <select class="field-control filter-priority"><option value="">All priorities</option>${Object.entries(config.priorityLabels).map(([key, value]) => `<option value="${key}" ${state.filters.priority === key ? "selected" : ""}>${esc(value)}</option>`).join("")}</select>
      <button class="text-button reset-filters">Reset</button>
    </div>${extra}</div>`;
  }

  function projectTable(items, context = "active") {
    if (!items.length) return emptyState(context === "archive" ? "Archive is tidy" : "No projects here", context === "archive" ? "Archived work will wait safely here until you need it." : "Try another filter or add your next piece of work.", context !== "archive");
    return `<div class="data-table-wrap"><table class="data-table"><thead><tr><th>Project</th><th>Start</th><th>Deadline</th><th>Status</th><th>Priority</th><th>Auto progress</th><th>Updated</th><th>Actions</th></tr></thead><tbody>
      ${items.map(p => `<tr><td data-label="Project"><span class="table-title">${esc(p.title)}</span></td><td data-label="Start">${niceDate(p.start_date, true)}</td><td data-label="Deadline">${niceDate(p.due_date, true)}</td><td data-label="Status">${statusBadge(p)}</td><td data-label="Priority">${priorityBadge(p)}</td><td data-label="Auto progress">${progress(p)}</td><td data-label="Updated">${niceDate(p.updated_at?.slice(0,10), true)}</td><td data-label="Actions"><div class="table-actions"><button class="mini-button" data-open="${p.id}">Open</button>${context === "archive" ? `<button class="mini-button" data-action="restore" data-id="${p.id}">Restore</button>` : context === "completed" ? `<button class="mini-button" data-action="reopen" data-id="${p.id}">Reopen</button><button class="mini-button" data-action="archive" data-id="${p.id}">Archive</button>` : `<button class="mini-button" data-action="duplicate" data-id="${p.id}">Duplicate</button><button class="mini-button" data-action="complete" data-id="${p.id}">Complete</button><button class="mini-button" data-action="archive" data-id="${p.id}">Archive</button>`}</div></td></tr>`).join("")}
    </tbody></table></div>`;
  }

  function renderProjects() {
    main.innerHTML = `${header("Everything in one place", "My Projects", "Search, filter and open every piece of work.", addProjectButton())}
      ${filtersToolbar()}<section class="panel">${projectTable(projects())}</section>`;
  }

  function renderCompleted() {
    const items = projects().filter(p => p.status === "completed");
    main.innerHTML = `${header("A year worth celebrating", "Completed", "Compare planned dates with the day each project crossed the finish line.")}
      ${filtersToolbar(`<span class="saved-indicator">${items.length} completed</span>`)}<section class="panel">${projectTable(items, "completed")}</section>`;
  }

  function renderArchive() {
    const items = projects({ includeArchived: true }).filter(p => p.archived);
    main.innerHTML = `${header("Safely out of sight", "Archive", "Older work stays searchable and can be restored at any time.")}
      ${filtersToolbar(`<span class="saved-indicator">${items.length} archived</span>`)}<section class="panel">${projectTable(items, "archive")}</section>`;
  }

  function yearToolbar() {
    return `<div class="toolbar"><div class="toolbar-group"><div class="year-switcher"><button class="year-prev" aria-label="Previous year">${icon("chevron-left")}</button><strong>${state.year}</strong><button class="year-next" aria-label="Next year">${icon("chevron-right")}</button></div><button class="secondary-button year-today">Today</button><div class="inline-search">${icon("search")}<input class="field-control search-control view-search" type="search" value="${esc(state.search)}" placeholder="Find work on the timeline…"></div></div><div class="toolbar-group"><div class="timeline-scale" role="group" aria-label="Timeline view">${["day","week","month"].map(scale => `<button class="${state.timelineScale === scale ? "active" : ""}" data-timeline-scale="${scale}">${scale[0].toUpperCase()+scale.slice(1)}</button>`).join("")}</div><span class="saved-indicator">${state.savedAt ? `Saved ${state.savedAt}` : "Everything saved"}</span>${addProjectButton()}</div></div>`;
  }

  function renderTimeline() {
    const items = projects().filter(p => p.start_date && p.due_date && p.start_date <= `${state.year}-12-31` && p.due_date >= `${state.year}-01-01`);
    const start = `${state.year}-01-01`;
    const end = `${state.year}-12-31`;
    const total = dayDiff(start, `${state.year + 1}-01-01`);
    const now = dateObj(config.today);
    const isCurrentYear = now.getFullYear() === state.year;
    const currentMonth = isCurrentYear ? now.getMonth() : -1;
    main.innerHTML = `${header("Your whole year at a glance", "Annual Timeline", "Plan and monitor your work across the entire year.")}
      ${yearToolbar()}
      <section class="timeline-shell"><div class="timeline-scroll"><div class="timeline-grid scale-${state.timelineScale}" style="--month-width:${timelineWidths[state.timelineScale]}px;--timeline-left:440px">
        <div class="timeline-left-head"><span>Project / Work</span><span>Owner</span><span>Status</span><span>Priority</span><span>Progress</span></div>
        ${monthNames.map((name, index) => `<div class="month-head ${index === currentMonth ? "current" : ""}"><strong>${name.slice(0,3)}</strong><div class="weeks">${(state.timelineScale === "day" ? ["1","8","15","22","29"] : state.timelineScale === "week" ? ["W1","W2","W3","W4"] : []).map(value => `<span>${value}</span>`).join("")}</div></div>`).join("")}
        ${items.length ? items.map(project => {
          const visibleStart = project.start_date < start ? start : project.start_date;
          const visibleEnd = project.due_date > end ? end : project.due_date;
          const left = (dayDiff(start, visibleStart) / total) * 100;
          const width = Math.max(.35, ((dayDiff(visibleStart, visibleEnd) + 1) / total) * 100);
          return `<div class="timeline-left-row"><div class="tl-title"><i class="project-dot" style="background:${esc(colorFor(project))}"></i><span>${esc(project.title)}</span></div><div class="tl-category">${esc(project.owner || "—")}</div><div>${statusBadge(project)}</div><div>${priorityBadge(project)}</div><div>${project.progress}%</div></div>
            ${monthNames.map((_, index) => `<div class="timeline-month-cell ${index === currentMonth ? "current" : ""}"></div>`).join("")}
            <div class="timeline-row-track"><div class="timeline-bar ${project.warnings?.length ? "has-warning" : ""}" data-timeline-id="${project.id}" style="left:${left}%;width:${width}%;background:${esc(colorFor(project))}" title="${esc(project.title)} · Drag to move all stages; use the handles to amend the first or final date"><i class="timeline-bar-progress" style="width:${project.progress}%"></i><span class="resize-handle left" data-resize="start"></span><span class="timeline-bar-label">${esc(project.title)}</span>${(project.stages || []).filter(stage => stage.end_date && stage.end_date >= visibleStart && stage.end_date <= visibleEnd).map(stage => `<i class="stage-marker ${stage.is_completed ? "complete" : ""}" title="${esc(stage.stage_name)} deadline · ${niceDate(stage.end_date,true)}" style="left:${Math.max(0, Math.min(100, (dayDiff(visibleStart,stage.end_date)/Math.max(1,dayDiff(visibleStart,visibleEnd)))*100))}%"></i>`).join("")}<span class="resize-handle right" data-resize="end"></span></div></div>`;
        }).join("") : `<div style="grid-column:1/-1">${emptyState("Nothing planned for this year", "Move to another year or add the first project.", true)}</div>`}
        ${isCurrentYear ? `<i class="today-line" style="left:calc(var(--timeline-left) + (100% - var(--timeline-left)) * ${dayDiff(start, config.today) / total})"></i>` : ""}
      </div></div></section>`;
    bindTimelineDrag();
  }

  function renderCalendar() {
    const year = state.year;
    const month = state.calendarMonth;
    const first = new Date(year, month, 1);
    const gridStart = new Date(year, month, 1 - ((first.getDay() + 6) % 7));
    const cells = Array.from({ length: 42 }, (_, i) => {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);
      return date;
    });
    const relevant = projects().filter(p => (p.stages || []).some(stage => (stage.start_date && dateObj(stage.start_date).getFullYear() === year) || (stage.end_date && dateObj(stage.end_date).getFullYear() === year)));
    const nextDeadlines = relevant.flatMap(project => (project.stages || []).filter(stage => stage.end_date && stage.end_date >= config.today).map(stage => ({project,stage}))).sort((a,b) => a.stage.end_date.localeCompare(b.stage.end_date)).slice(0,8);
    main.innerHTML = `${header("Dates with context", "Calendar", "See every stage start and deadline in a familiar monthly view.")}
      <div class="toolbar"><div class="toolbar-group"><button class="secondary-button calendar-prev icon-control" aria-label="Previous month">${icon("chevron-left")}</button><div class="year-switcher"><strong style="min-width:160px">${monthNames[month]} ${year}</strong></div><button class="secondary-button calendar-next icon-control" aria-label="Next month">${icon("chevron-right")}</button><button class="secondary-button calendar-today">Today</button></div>${addProjectButton()}</div>
      <div class="calendar-layout"><section class="calendar-card"><div class="calendar-head">${["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => `<span>${d}</span>`).join("")}</div><div class="calendar-grid">${cells.map(date => {
        const iso = isoDate(date);
        const events = relevant.flatMap(project => (project.stages || []).filter(stage => stage.start_date === iso || stage.end_date === iso).map(stage => ({project,stage,type:stage.end_date === iso ? "Deadline" : "Start"})));
        return `<div class="calendar-day ${date.getMonth() !== month ? "muted" : ""} ${iso === config.today ? "today" : ""}"><span class="day-number">${date.getDate()}</span><div class="calendar-events">${events.slice(0,3).map(event => `<button class="calendar-event" data-open="${event.project.id}" style="border-left-color:${esc(colorFor(event.project))}" title="${esc(event.project.title)} · ${esc(event.stage.stage_name)} ${event.type.toLowerCase()}">${esc(event.stage.stage_name)}</button>`).join("")}</div></div>`;
      }).join("")}</div></section>
      <section class="panel"><div class="panel-head"><div><h3>Next stage deadlines</h3><p>Coming up after today</p></div></div><div class="panel-body deadline-list">${nextDeadlines.map(item => `<button class="deadline" data-open="${item.project.id}" style="text-align:left;background:#fff;cursor:pointer"><strong>${esc(item.project.title)} · ${esc(item.stage.stage_name)}</strong><small>${niceDate(item.stage.end_date,true)} · ${label(config.priorityLabels,item.project.priority)}</small></button>`).join("") || "<p>No upcoming stage deadlines.</p>"}</div></section></div>`;
  }

  function renderSettings() {
    const settings = state.data.settings;
    main.innerHTML = `${header("Make it feel like yours", "Settings", "Update your profile, planning defaults and password.")}
      ${settings.force_password ? '<div class="force-password"><div><strong>Temporary password still in use</strong><span>Choose a private password of at least 10 characters below.</span></div></div>' : ""}
      <div class="settings-grid">
        <section class="settings-card"><h2>${icon("user")} Profile & defaults</h2><p>Your everyday workspace preferences.</p><form id="profile-form" class="form-grid">
          <div class="form-field full"><label for="display-name">Display name</label><input id="display-name" name="display_name" value="${esc(settings.display_name)}" required></div>
          <div class="form-field"><label for="default-year">Default year</label><input id="default-year" name="default_year" type="number" min="2000" max="2100" value="${settings.default_year}" required></div>
          <div class="form-field"><label for="reminder-days">Reminder period (days)</label><input id="reminder-days" name="reminder_days" type="number" min="0" max="90" value="${settings.reminder_days}" required></div>
          <div class="form-actions"><button class="primary-button" type="submit">${icon("check-circle")}<span>Save preferences</span></button></div>
        </form></section>
        <section class="settings-card"><h2>${icon("lock")} Change password</h2><p>Enter the current password before choosing a new one.</p><form id="password-form" class="form-grid">
          <div class="form-field full"><label for="current-password">Current password</label><input id="current-password" name="current_password" type="password" autocomplete="current-password" required></div>
          <div class="form-field full"><label for="new-password">New password</label><input id="new-password" name="new_password" type="password" autocomplete="new-password" minlength="10" required><span class="form-help">At least 10 characters; a short phrase is easiest to remember.</span></div>
          <div class="form-field full"><label for="confirm-password">Confirm new password</label><input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password" minlength="10" required></div>
          <div class="form-actions"><button class="primary-button" type="submit">${icon("lock")}<span>Change password</span></button></div>
        </form></section>
        <section class="settings-card"><h2>${icon("priority")} Status & priority colours</h2><p>Friendly colour cues always appear with text labels.</p><div class="category-pills">${Object.entries(config.statusLabels).map(([k,v]) => `<span class="badge status-${k}">${esc(v)}</span>`).join("")}</div><div class="category-pills">${Object.entries(config.priorityLabels).map(([k,v]) => `<span class="badge priority-${k}">${esc(v)}</span>`).join("")}</div></section>
      </div>`;
  }

  function render() {
    document.querySelectorAll(".nav-item[data-view]").forEach(item => item.classList.toggle("active", item.dataset.view === state.view));
    const views = { overview: renderOverview, projects: renderProjects, timeline: renderTimeline, calendar: renderCalendar, completed: renderCompleted, archive: renderArchive, settings: renderSettings };
    (views[state.view] || renderOverview)();
    history.replaceState(null, "", `${config.workspaceUrl}?view=${state.view}`);
  }

  async function refresh(message = "") {
    const data = await api(`bootstrap?year=${state.year}&include_archived=1`);
    state.data = data;
    if (message) toast(message);
    render();
  }

  function openProjectModal(id = null) {
    const project = id ? state.data.projects.find(item => Number(item.id) === Number(id)) : null;
    const p = project || {
      title:"", description:"", owner:state.data.settings.display_name, client_department:"",
      status:"planned", priority:"medium", notes:"",
      stages:[
        ["setup","Setup"],["questionnaire","Questionnaire"],["field_work","Field Work"],
        ["data_processing","Data Processing"],["report","Report"],
      ].map(([stage_key,stage_name], sort_order) => ({stage_key,stage_name,start_date:"",end_date:"",is_completed:false,sort_order})),
    };
    modalRoot.innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title"><div class="modal-head"><div><h2 id="project-modal-title">${icon(project ? "edit" : "plus")} ${project ? "Edit project" : "Add a new project"}</h2><p>${project ? "Update the details and stage schedule." : "Give the work a name, then plan each stage when ready."}</p></div><button class="modal-close" aria-label="Close">×</button></div>
      <form id="project-form"><div class="modal-body"><div class="form-grid">
        <div class="form-field full"><label>Project / work title</label><input name="title" value="${esc(p.title)}" maxlength="220" required></div>
        <div class="form-field full"><label>Description</label><textarea name="description">${esc(p.description || "")}</textarea></div>
        <div class="form-field"><label>Owner</label><input name="owner" value="${esc(p.owner)}" required></div>
        <div class="form-field"><label>Client or department</label><input name="client_department" value="${esc(p.client_department || "")}"></div>
        <div class="form-field"><label>Status</label><select name="status">${Object.entries(config.statusLabels).map(([key,value]) => `<option value="${key}" ${key===p.status?"selected":""}>${esc(value)}</option>`).join("")}</select></div>
        <div class="form-field"><label>Priority</label><select name="priority">${Object.entries(config.priorityLabels).map(([key,value]) => `<option value="${key}" ${key===p.priority?"selected":""}>${esc(value)}</option>`).join("")}</select></div>
        <div class="form-field full"><div class="stages-heading"><div><label>Project stages</label><span>Enter dates when known. Progress updates automatically as stages are marked done.</span></div><strong>${Number(p.progress || 0)}% complete</strong></div><div class="stage-editor">${(p.stages || []).map(stageInput).join("")}</div></div>
        <div class="form-field full"><label>Notes</label><textarea name="notes">${esc(p.notes || "")}</textarea></div>
      </div></div><div class="modal-footer"><button type="button" class="secondary-button modal-cancel">Cancel</button><button class="primary-button" type="submit">${project ? "Save changes" : "Create project"}</button></div></form></div></div>`;
    modalRoot.querySelector(".modal input")?.focus();
    modalRoot.querySelector("#project-form").dataset.id = project?.id || "";
  }

  function stageInput(stage) {
    return `<div class="stage-row ${stage.is_completed ? "is-complete" : ""}" data-stage-key="${esc(stage.stage_key)}">
      <div class="stage-name"><span class="stage-number">${Number(stage.sort_order) + 1}</span><strong>${esc(stage.stage_name)}</strong></div>
      <label><span>Start</span><input name="stage_start" type="date" value="${esc(stage.start_date || "")}"></label>
      <label><span>End / deadline</span><input name="stage_end" type="date" value="${esc(stage.end_date || "")}"></label>
      <label class="stage-done"><input name="stage_done" type="checkbox" ${stage.is_completed ? "checked" : ""}><span>${icon("check-circle")} Done</span></label>
    </div>`;
  }

  function openDateConfirm(project, proposedStart, proposedDue, stages) {
    const warnings = project.warnings || [];
    state.pendingDateChange = { projectId: project.id, stages };
    modalRoot.innerHTML = `<div class="modal-backdrop"><div class="modal small" role="dialog" aria-modal="true"><div class="modal-head"><div><h2>${icon("calendar")} Save this date change?</h2><p>Nothing moves until you confirm it.</p></div><button class="modal-close" aria-label="Close">×</button></div><div class="modal-body"><p>Move <strong>${esc(project.title)}</strong> to these new dates?</p><div class="date-change"><div><span>Original</span><strong>${niceDate(project.start_date,true)} – ${niceDate(project.due_date,true)}</strong></div><span class="date-change-arrow">${icon("chevron-right")}</span><div><span>Proposed</span><strong>${niceDate(proposedStart,true)} – ${niceDate(proposedDue,true)}</strong></div></div><p><strong>${dayDiff(proposedStart, proposedDue)+1} days</strong> total duration</p>${warnings.length ? `<div class="impact-box"><strong>Review impact</strong><br>${esc(warnings[0].message)}</div>` : ""}</div><div class="modal-footer"><button class="secondary-button modal-cancel">Cancel</button><button class="primary-button confirm-date-change" data-id="${project.id}" data-start="${proposedStart}" data-due="${proposedDue}">${icon("check-circle")}<span>Save changes</span></button></div></div></div>`;
  }

  function bindTimelineDrag() {
    document.querySelectorAll(".timeline-bar").forEach(bar => {
      bar.addEventListener("pointerdown", event => {
        if (event.button !== 0) return;
        const project = state.data.projects.find(p => Number(p.id) === Number(bar.dataset.timelineId));
        const mode = event.target.dataset.resize || "move";
        const startX = event.clientX;
        const yearWidth = bar.closest(".timeline-row-track").getBoundingClientRect().width;
        const originalLeft = parseFloat(bar.style.left);
        const originalWidth = parseFloat(bar.style.width);
        delete bar.dataset.delta;
        bar.setPointerCapture(event.pointerId);
        const move = e => {
          const deltaDays = Math.round(((e.clientX - startX) / yearWidth) * (dayDiff(`${state.year}-01-01`,`${state.year+1}-01-01`)));
          const deltaPercent = ((e.clientX - startX) / yearWidth) * 100;
          if (mode === "start") {
            bar.style.left = `${originalLeft + deltaPercent}%`;
            bar.style.width = `${Math.max(.4, originalWidth - deltaPercent)}%`;
          } else if (mode === "end") {
            bar.style.width = `${Math.max(.4, originalWidth + deltaPercent)}%`;
          } else {
            bar.style.left = `${originalLeft + deltaPercent}%`;
          }
          bar.dataset.delta = String(deltaDays);
        };
        const up = () => {
          bar.removeEventListener("pointermove", move);
          bar.removeEventListener("pointerup", up);
          const delta = Number(bar.dataset.delta || 0);
          if (!delta) return render();
          let nextStart = project.start_date, nextDue = project.due_date;
          if (mode === "start") nextStart = addDays(nextStart, delta);
          else if (mode === "end") nextDue = addDays(nextDue, delta);
          else { nextStart = addDays(nextStart, delta); nextDue = addDays(nextDue, delta); }
          if (nextDue < nextStart) { toast("The due date cannot be earlier than the start date.", "error"); return render(); }
          const stages = (project.stages || []).map(stage => ({ ...stage }));
          if (mode === "move") {
            stages.forEach(stage => {
              if (stage.start_date) stage.start_date = addDays(stage.start_date, delta);
              if (stage.end_date) stage.end_date = addDays(stage.end_date, delta);
            });
          } else if (mode === "start") {
            const first = stages.find(stage => stage.start_date === project.start_date);
            if (first) first.start_date = nextStart;
          } else {
            const last = [...stages].reverse().find(stage => stage.end_date === project.due_date);
            if (last) last.end_date = nextDue;
          }
          if (stages.some(stage => stage.start_date && stage.end_date && stage.end_date < stage.start_date)) {
            toast("A stage cannot end before it starts.", "error");
            return render();
          }
          openDateConfirm(project, nextStart, nextDue, stages);
        };
        bar.addEventListener("pointermove", move);
        bar.addEventListener("pointerup", up);
      });
      bar.addEventListener("click", event => {
        if (event.target.closest(".resize-handle")) return;
        if (!bar.dataset.delta) openProjectModal(bar.dataset.timelineId);
        delete bar.dataset.delta;
      });
    });
  }

  async function projectAction(id, action) {
    if (["archive", "complete", "restore", "reopen"].includes(action) && !window.confirm(`${label({archive:"Archive",complete:"Mark as complete",restore:"Restore",reopen:"Reopen"},action)} this project?`)) return;
    const response = await api(`projects/${id}/action`, { method: "POST", body: JSON.stringify({ action }) });
    await refresh(response.message);
  }

  document.addEventListener("click", async event => {
    const nav = event.target.closest("[data-view]");
    const jump = event.target.closest("[data-view-jump]");
    if (nav || jump) {
      state.view = (nav || jump).dataset.view || (nav || jump).dataset.viewJump;
      document.getElementById("sidebar").classList.remove("open");
      document.getElementById("sidebar-scrim").classList.remove("visible");
      document.getElementById("mobile-menu").setAttribute("aria-expanded", "false");
      document.body.classList.remove("mobile-nav-open");
      render();
      return;
    }
    if (event.target.closest(".add-project-button")) return openProjectModal();
    const opener = event.target.closest("[data-open]");
    if (opener) return openProjectModal(opener.dataset.open);
    const action = event.target.closest("[data-action]");
    if (action) return projectAction(action.dataset.id, action.dataset.action);
    if (event.target.closest(".modal-close,.modal-cancel") || (event.target.classList.contains("modal-backdrop"))) return modalRoot.replaceChildren();
    if (event.target.closest(".reset-filters")) {
      state.search = ""; state.filters = { status:"", priority:"" }; render(); return;
    }
    if (event.target.closest(".year-prev")) { state.year--; render(); return; }
    if (event.target.closest(".year-next")) { state.year++; render(); return; }
    if (event.target.closest(".year-today")) { state.year = dateObj(config.today).getFullYear(); render(); return; }
    const scaleButton = event.target.closest("[data-timeline-scale]");
    if (scaleButton) { state.timelineScale = scaleButton.dataset.timelineScale; render(); return; }
    if (event.target.closest(".calendar-prev")) {
      state.calendarMonth--; if (state.calendarMonth < 0) { state.calendarMonth = 11; state.year--; } render(); return;
    }
    if (event.target.closest(".calendar-next")) {
      state.calendarMonth++; if (state.calendarMonth > 11) { state.calendarMonth = 0; state.year++; } render(); return;
    }
    if (event.target.closest(".calendar-today")) {
      state.year = dateObj(config.today).getFullYear(); state.calendarMonth = dateObj(config.today).getMonth(); render(); return;
    }
    const confirmDates = event.target.closest(".confirm-date-change");
    if (confirmDates) {
      const pending = state.pendingDateChange;
      const project = state.data.projects.find(p => Number(p.id) === Number(pending?.projectId));
      try {
        if (!project || !pending) throw new Error("That timeline change expired. Please try again.");
        const result = await api(`projects/${project.id}`, { method:"PUT", body:JSON.stringify({ ...project, stages:pending.stages }) });
        modalRoot.replaceChildren(); state.pendingDateChange = null; state.savedAt = new Intl.DateTimeFormat("en", {hour:"numeric",minute:"2-digit"}).format(new Date()); await refresh(result.message);
      } catch (error) { toast(error.message, "error"); }
    }
  });

  document.addEventListener("change", event => {
    if (event.target.matches('[name="stage_done"]')) {
      event.target.closest(".stage-row").classList.toggle("is-complete", event.target.checked);
      const checks = Array.from(document.querySelectorAll('[name="stage_done"]'));
      const done = checks.filter(input => input.checked).length;
      const output = document.querySelector(".stages-heading>strong");
      if (output) output.textContent = `${Math.round((done / Math.max(1, checks.length)) * 100)}% complete`;
    }
    if (event.target.matches(".filter-status")) { state.filters.status = event.target.value; render(); }
    if (event.target.matches(".filter-priority")) { state.filters.priority = event.target.value; render(); }
  });

  document.addEventListener("input", event => {
    if (event.target.matches(".view-search")) { state.search = event.target.value; render(); }
  });

  document.addEventListener("submit", async event => {
    event.preventDefault();
    const form = event.target;
    try {
      if (form.id === "project-form") {
        const raw = Object.fromEntries(new FormData(form).entries());
        const stages = Array.from(form.querySelectorAll(".stage-row")).map((row, sort_order) => ({
          stage_key: row.dataset.stageKey,
          start_date: row.querySelector('[name="stage_start"]').value,
          end_date: row.querySelector('[name="stage_end"]').value,
          is_completed: row.querySelector('[name="stage_done"]').checked,
          sort_order,
        }));
        delete raw.stage_start;
        delete raw.stage_end;
        delete raw.stage_done;
        const payload = { ...raw, stages };
        const id = form.dataset.id;
        const response = await api(id ? `projects/${id}` : "projects", { method:id ? "PUT" : "POST", body:JSON.stringify(payload) });
        modalRoot.replaceChildren(); await refresh(response.message);
      } else if (form.id === "profile-form") {
        const raw = Object.fromEntries(new FormData(form).entries());
        const response = await api("settings/profile", { method:"PUT", body:JSON.stringify(raw) });
        state.data.settings = { ...state.data.settings, ...raw }; toast(response.message); render();
      } else if (form.id === "password-form") {
        const raw = Object.fromEntries(new FormData(form).entries());
        const response = await api("settings/password", { method:"PUT", body:JSON.stringify(raw) });
        state.data.settings.force_password = false; config.currentUser.forceChange = false; form.reset(); toast(response.message); render();
      }
    } catch (error) { toast(error.message, "error"); }
  });

  document.getElementById("mobile-menu").addEventListener("click", event => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
    document.getElementById("sidebar-scrim").classList.toggle("visible", sidebar.classList.contains("open"));
    document.body.classList.toggle("mobile-nav-open", sidebar.classList.contains("open"));
    event.currentTarget.setAttribute("aria-expanded", sidebar.classList.contains("open") ? "true" : "false");
  });
  const closeMobileNav = () => {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebar-scrim").classList.remove("visible");
    document.getElementById("mobile-menu").setAttribute("aria-expanded", "false");
    document.body.classList.remove("mobile-nav-open");
  };
  document.getElementById("sidebar-scrim").addEventListener("click", closeMobileNav);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMobileNav();
      if (modalRoot.children.length) modalRoot.replaceChildren();
    }
  });
  document.getElementById("global-search").addEventListener("input", event => {
    state.search = event.target.value;
    if (state.view === "overview") state.view = "projects";
    render();
  });

  document.getElementById("top-date").textContent = new Intl.DateTimeFormat("en-MY", { weekday:"long", day:"numeric", month:"long", year:"numeric" }).format(new Date());
  const initialView = new URLSearchParams(location.search).get("view");
  if (["overview","projects","timeline","calendar","completed","archive","settings"].includes(initialView)) state.view = initialView;
  refresh().catch(error => {
    main.innerHTML = emptyState("Couldn’t open the workspace", error.message, false);
  });
})();

