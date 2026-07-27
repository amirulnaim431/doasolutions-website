'use client';

import { useMemo, useState } from 'react';

const base = '/showcase/r-yang';

const modules = [
  {
    id: 'workforce',
    label: 'Workforce',
    metric: '210',
    unit: 'logs',
    title: 'Field team control',
    summary: 'Attendance, leave, expenses, contracts, recruitment and announcements for site teams.',
  },
  {
    id: 'quality',
    label: 'Quality',
    metric: '9',
    unit: 'matrix',
    title: 'Service quality review',
    summary: 'Competencies, KPIs, review cycles, feedback questions and nine-box calibration.',
  },
  {
    id: 'timesheets',
    label: 'Timesheets',
    metric: '53h',
    unit: 'tracked',
    title: 'Project hours',
    summary: 'Timesheet submissions, approval queues and pivot reports by site, employee, project and task.',
  },
  {
    id: 'facilities',
    label: 'Facilities',
    metric: '21',
    unit: 'screens',
    title: 'Asset maintenance',
    summary: 'Asset master data, service requests, maintenance teams, schedules, plans and cost reports.',
  },
];

const sites = [
  ['MCC Office Tower', 'Cleaning team', '92%', 'On track'],
  ['Retail Block A', 'Landscape + hygiene', '84%', 'Watch'],
  ['Healthcare Wing', 'Maintenance crew', '96%', 'Clear'],
  ['Education Campus', 'Waste + audit', '78%', 'Escalate'],
];

const queueRows = [
  ['Leave request', 'Nadia Osman', 'Workforce', 'Today', 'To approve'],
  ['Expense claim', 'Muhammad Amir', 'Finance', '12 Jul', 'Submitted'],
  ['Quality review', 'Adam Iskandar', 'Site Quality', 'Q3', 'Manager'],
  ['Maintenance order', 'Team A', 'Facilities', 'This week', 'Active'],
  ['Timesheet line', 'Super User', 'Timesheets', '21h', 'To approve'],
];

const serviceContext = [
  ['Integrated FM', 'Cleaning, maintenance and facilities management need one shared service view.'],
  ['Site workforce', 'Supervisors need attendance, timesheets and approval status without chasing messages.'],
  ['Asset upkeep', 'Maintenance plans, requests and cost reporting should sit near the people doing the work.'],
  ['ESG readiness', 'Waste, hygiene, audit and sustainable practice can become reportable operating data.'],
];

const workflow = [
  ['Set up site', 'Departments, roles, contracts, assets and service scopes.'],
  ['Run daily work', 'Attendance, tasks, expenses, leave and maintenance requests.'],
  ['Review quality', 'KPI, competency, feedback and nine-box review cycles.'],
  ['Report clearly', 'Approval queues, pivots, exceptions and management summaries.'],
];

export function RYangDemo() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const active = modules.find((module) => module.id === activeModule) ?? modules[0];
  const filteredQueue = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return queueRows;
    return queueRows.filter((row) => row.join(' ').toLowerCase().includes(value));
  }, [query]);

  return (
    <main className="ryang-site ryang-polished">
      <div
        className="ryang-contract"
        dangerouslySetInnerHTML={{
          __html: '<!-- THESIS: R-Yang needs a facilities operations cockpit, not a generic ERP brochure. OWN-WORLD: light control room, dark command rail, precise tables, teal status language, field-service site cards. STORY: management sees site work, workforce, timesheets, quality and maintenance connected, then scopes a DOA build. FIRST VIEWPORT: compact nav, operational command board, site health, approval queue and module toggles. FORM: polished operate-mode showcase demo informed by Drive screenshots and public R-Yang facilities context. -->',
        }}
      />

      <header className="ryang-topbar">
        <a href={base} className="ryang-mark" aria-label="R-Yang demo home"><span>R</span><b>R-Yang</b></a>
        <nav aria-label="R-Yang demo navigation">
          <a href="#command">Command</a>
          <a href="#coverage">Coverage</a>
          <a href="#workflow">Workflow</a>
          <a href="#pitch">Pitch</a>
        </nav>
        <a className="ryang-primary-link" href="#pitch">Scope demo</a>
      </header>

      <section className="ryang-command-deck" id="command">
        <div className="ryang-brief">
          <p>R-Yang facilities operations demo</p>
          <h1>Turn site work, teams and assets into one control room.</h1>
          <span>This presentation demo translates the screenshot set into a client-ready operating system for cleaning, landscape, hygiene, maintenance and facilities teams.</span>
          <div className="ryang-brief__actions">
            <a href="#coverage">View system map</a>
            <a href="#pitch">Pitch modules</a>
          </div>
        </div>

        <div className="ryang-board-shell" aria-label="R-Yang sample operations dashboard">
          <div className="ryang-board-head">
            <div>
              <span>Live sample board</span>
              <b>Facilities Command</b>
            </div>
            <em>Demo data / subject to replacement</em>
          </div>

          <div className="ryang-module-ribbon" aria-label="Module selector">
            {modules.map((module) => (
              <button
                type="button"
                key={module.id}
                className={activeModule === module.id ? 'is-active' : ''}
                onClick={() => setActiveModule(module.id)}
              >
                <span>{module.label}</span>
                <b>{module.metric}</b>
                <small>{module.unit}</small>
              </button>
            ))}
          </div>

          <div className="ryang-board-main">
            <section className="ryang-active-panel">
              <div className="ryang-active-panel__title">
                <span>{active.label}</span>
                <h2>{active.title}</h2>
                <p>{active.summary}</p>
              </div>
              <div className="ryang-flowline">
                {['Master data', 'Request', 'Approval', 'Report'].map((step, index) => (
                  <i key={step} className={index === 1 ? 'is-current' : ''}>{step}</i>
                ))}
              </div>
              <div className="ryang-kpi-strip">
                <article><b>94%</b><span>site readiness</span></article>
                <article><b>18</b><span>open approvals</span></article>
                <article><b>RM 8.2k</b><span>sample costs</span></article>
              </div>
            </section>

            <aside className="ryang-sites-panel">
              <div className="ryang-panel-title"><span>Site health</span><b>4 active</b></div>
              {sites.map(([site, team, score, state]) => (
                <article key={site}>
                  <div><b>{site}</b><span>{team}</span></div>
                  <strong>{score}</strong>
                  <em className={state === 'Escalate' ? 'is-risk' : state === 'Watch' ? 'is-watch' : ''}>{state}</em>
                </article>
              ))}
            </aside>
          </div>
        </div>

        <aside className="ryang-approval-panel">
          <div className="ryang-panel-title"><span>Approval queue</span><b>{filteredQueue.length}</b></div>
          <label>
            <span>Search queue</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Leave, maintenance, timesheet..." />
          </label>
          <div className="ryang-approval-list">
            {filteredQueue.length ? filteredQueue.map(([item, person, area, due, state]) => (
              <article key={`${item}-${person}`}>
                <div><b>{item}</b><span>{person}</span></div>
                <em>{area}</em>
                <small>{due}</small>
                <strong>{state}</strong>
              </article>
            )) : <p>No matching sample approvals.</p>}
          </div>
        </aside>
      </section>

      <section className="ryang-context-strip" id="coverage">
        {serviceContext.map(([title, copy]) => (
          <article key={title}>
            <b>{title}</b>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="ryang-section ryang-screenshot-map">
        <div className="ryang-section__intro">
          <p>What I read from the screenshot folder</p>
          <h2>The demo should sell clarity across messy back-office modules.</h2>
        </div>
        <div className="ryang-map-grid">
          {modules.map((module) => (
            <article key={module.id}>
              <span>{module.label}</span>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <button type="button" onClick={() => setActiveModule(module.id)}>Focus in command board</button>
            </article>
          ))}
        </div>
      </section>

      <section className="ryang-workflow-polished" id="workflow">
        <div>
          <p>Connected workflow</p>
          <h2>From site setup to management reporting.</h2>
          <span>All sample entries are synthetic. Real client data, device details, team names and financial values should replace these before production.</span>
        </div>
        <ol>
          {workflow.map(([title, copy]) => (
            <li key={title}>
              <b>{title}</b>
              <p>{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="ryang-scope-board">
        <div className="ryang-board-head">
          <div>
            <span>Pitch scope</span>
            <b>Facilities operating layer</b>
          </div>
          <button type="button" onClick={() => setNotice('Demo scope marked: workforce, site quality, timesheets and facilities.')}>Mark scope</button>
        </div>
        <div className="ryang-scope-table" role="table" aria-label="R-Yang demo scope table">
          <div role="row"><b>Area</b><b>Demo screens</b><b>Value for R-Yang</b><b>Status</b></div>
          <div role="row"><span>Workforce</span><span>Attendance, leave, expenses, recruitment, contracts</span><span>Less manual follow-up across site teams</span><strong>Mapped</strong></div>
          <div role="row"><span>Quality</span><span>KPI, competency, review periods, nine-box analysis</span><span>Consistent service-quality review</span><strong>Mapped</strong></div>
          <div role="row"><span>Timesheets</span><span>Projects, tasks, approvals, pivots and attendance comparison</span><span>Clear work-hour reporting by site and task</span><strong>Mapped</strong></div>
          <div role="row"><span>Facilities</span><span>Assets, maintenance plans, requests, schedules, cost reports</span><span>Maintenance visibility near workforce data</span><strong>Mapped</strong></div>
        </div>
        {notice ? <p className="ryang-notice" role="status">{notice}</p> : null}
      </section>

      <section className="ryang-final-polished" id="pitch">
        <p>Client pitch</p>
        <h2>Give R-Yang a demo that feels like the business is already running inside it.</h2>
        <div>
          <a href="mailto:doasolutions@outlook.com?subject=R-Yang%20facilities%20demo%20scope">Scope this demo</a>
          <a href="/showcase/">Back to showcase</a>
        </div>
        <small>Demo only. Counts, statuses, locations, costs, IoT references and workflows are sample placeholders informed by public R-Yang context and the provided screenshot inventory. No live integration or verified device claim is implied.</small>
      </section>
    </main>
  );
}
