'use client';

import { useMemo, useState } from 'react';

const base = '/showcase/r-yang';

const modules = [
  {
    id: 'hr',
    label: 'Workforce',
    title: 'Field workforce control',
    summary: 'Cleaner, landscape, hygiene and maintenance teams can be tracked through attendance, leave, expenses, contracts and announcements.',
    stats: [['210', 'attendance logs'], ['14', 'leave items'], ['7', 'expense claims'], ['3', 'contracts due']],
  },
  {
    id: 'talent',
    label: 'Site Quality',
    title: 'Service quality review',
    summary: 'Competencies, KPIs, performance cycles, approval matrix, feedback questions and nine-box calibration for site teams.',
    stats: [['9', 'matrix groups'], ['4', 'review periods'], ['12', 'job profiles'], ['2', 'active reviews']],
  },
  {
    id: 'timesheet',
    label: 'Timesheets',
    title: 'Project hours and approval',
    summary: 'Projects, tasks, submitted timesheets, approval queues, employee summaries and site attendance comparisons.',
    stats: [['53h', 'project hours'], ['21h', 'my timesheet'], ['5', 'pending lines'], ['3', 'active projects']],
  },
  {
    id: 'facilities',
    label: 'Facilities',
    title: 'Asset and service-order control',
    summary: 'Asset master data, maintenance teams, cleaning plans, requests, schedules, service items and cost reports.',
    stats: [['21', 'asset screens'], ['6', 'service plans'], ['RM 8.2k', 'sample costs'], ['4', 'open orders']],
  },
];

const approvalRows = [
  ['Leave request', 'Nadia Osman', 'Workforce', 'To approve', 'Today'],
  ['Expense claim', 'Muhammad Amir', 'Finance', 'Submitted', '12 Jul'],
  ['Quality review', 'Adam Iskandar', 'Site Quality', 'Sent to manager', 'Q3'],
  ['Maintenance order', 'Team A', 'Facilities', 'Active', 'This week'],
  ['Timesheet line', 'Super User', 'Timesheets', 'To approve', '21h'],
];

const workflowBlocks = [
  ['Organisation setup', 'Departments, site roles, contracts and workforce master records.'],
  ['Daily operations', 'Attendance, leave, expense, announcements and site timesheet submissions.'],
  ['Quality cycle', 'Competency templates, KPI setup, review forms and nine-box analysis.'],
  ['Facilities control', 'Asset categories, maintenance teams, cleaning plans, schedules and cost reporting.'],
  ['Management view', 'Approvals, pivots, grouped reports and exception lists for decisions.'],
];

const screenshotFindings = [
  ['Workforce', 'Dashboard, announcements, employee records, leave, attendance, expenses, contracts and recruitment.'],
  ['Quality', 'Competency areas, levels, KPIs, performance planning, feedback questions and review periods.'],
  ['Timesheets', 'Projects, tasks, personal timesheets, approval queues and pivot reports by employee/project/task.'],
  ['Facilities', 'Asset master data, maintenance teams, requests, schedules, plans, product cards and cost reports.'],
];

const serviceContext = [
  ['Integrated FM', 'Public R-Yang pages describe integrated facilities management, cleaning and maintenance services.'],
  ['Cleaning + landscape', 'The pitch can connect staff rosters, site tasks, inspections and client reporting.'],
  ['IoT + automation', 'Use sensor or checklist placeholders carefully until real device details are confirmed.'],
  ['ESG operations', 'Track waste, hygiene, service quality and sustainable practice as demo reporting concepts.'],
];

export function RYangDemo() {
  const [activeModule, setActiveModule] = useState(modules[0].id);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const current = modules.find((module) => module.id === activeModule) ?? modules[0];
  const filteredRows = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return approvalRows;
    return approvalRows.filter((row) => row.join(' ').toLowerCase().includes(value));
  }, [query]);

  return (
    <main className="ryang-site">
      <div
        className="ryang-contract"
        dangerouslySetInnerHTML={{
          __html: '<!-- THESIS: R-Yang turns scattered ERP screenshots into one people-and-facilities command center, refusing the generic module grid. OWN-WORLD: light control-room UI, ink tables, teal proof marks, precise panels, dense but calm operator typography. STORY: a decision maker sees HR, talent, timesheets and facilities joined as one workflow, then asks DOA to scope the build. FIRST VIEWPORT: left operating spine, center live workflow canvas, right approval queue and demo proof. FORM: established showcase extension, operate-mode cockpit, built from Drive screenshot inventory. -->',
        }}
      />
      <header className="ryang-nav">
        <a href={base} className="ryang-logo" aria-label="R-Yang demo home"><span>R</span><b>YANG</b></a>
        <nav aria-label="R-Yang demo navigation">
          <a href="#system">System</a>
          <a href="#modules">Modules</a>
          <a href="#workflow">Workflow</a>
          <a href="#pitch">Pitch</a>
        </nav>
        <a className="ryang-nav-cta" href="#pitch">Request scope</a>
      </header>

      <section className="ryang-hero" id="system">
        <aside className="ryang-spine" aria-label="R-Yang module selector">
          <p>Operating suite</p>
          {modules.map((module) => (
            <button
              key={module.id}
              type="button"
              className={activeModule === module.id ? 'is-active' : ''}
              onClick={() => setActiveModule(module.id)}
            >
              <span>{module.label}</span>
              <i aria-hidden="true" />
            </button>
          ))}
        </aside>

        <div className="ryang-command">
          <div className="ryang-command__top">
            <p>R-Yang demo system</p>
            <span>Sample data / presentation only</span>
          </div>
          <div className="ryang-command__headline">
            <span>{current.label}</span>
            <h1>Facilities, people and service orders in one operating cockpit.</h1>
            <p>{current.summary}</p>
          </div>
          <div className="ryang-flow-map" aria-label={`${current.label} workflow preview`}>
            {['Master data', 'Request', 'Approval', 'Report'].map((step, index) => (
              <div className={index === 1 ? 'is-hot' : ''} key={step}>
                <b>{step}</b>
                <span>{current.label}</span>
              </div>
            ))}
          </div>
          <div className="ryang-stat-grid">
            {current.stats.map(([value, label]) => <article key={label}><strong>{value}</strong><span>{label}</span></article>)}
          </div>
        </div>

        <aside className="ryang-queue">
          <div className="ryang-queue__head">
            <span>Approval queue</span>
            <b>{filteredRows.length}</b>
          </div>
          <label>
            <span>Search sample queue</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Leave, Sites, Facilities..." />
          </label>
          <div className="ryang-queue-list">
            {filteredRows.length ? filteredRows.map(([type, owner, team, state, due]) => (
              <article key={`${type}-${owner}`}>
                <div><b>{type}</b><span>{owner}</span></div>
                <em>{team}</em>
                <strong>{state}</strong>
                <small>{due}</small>
              </article>
            )) : <p className="ryang-empty">No matching sample approvals.</p>}
          </div>
        </aside>
      </section>

      <section className="ryang-proof">
        <p>Screenshot inventory + public context</p>
        <div>{screenshotFindings.map(([label, copy]) => <article key={label}><b>{label}</b><span>{copy}</span></article>)}</div>
      </section>

      <section className="ryang-context" aria-label="R-Yang service context">
        {serviceContext.map(([title, copy]) => (
          <article key={title}>
            <b>{title}</b>
            <p>{copy}</p>
          </article>
        ))}
      </section>

      <section className="ryang-section" id="modules">
        <div className="ryang-section__head">
          <p>What the demo should prove</p>
          <h2>R-Yang is not only a brochure. It is an operating layer.</h2>
        </div>
        <div className="ryang-module-grid">
          {modules.map((module) => (
            <article key={module.id}>
              <span>{module.label}</span>
              <h3>{module.title}</h3>
              <p>{module.summary}</p>
              <button type="button" onClick={() => setActiveModule(module.id)}>Preview module</button>
            </article>
          ))}
        </div>
      </section>

      <section className="ryang-workflow" id="workflow">
        <div>
          <p>Connected workflow</p>
          <h2>From site setup to daily service records to management reports.</h2>
          <span>Based on the screenshots and public service positioning, the strongest pitch is to make complex facilities operations understandable and searchable for the management team.</span>
        </div>
        <ol>
          {workflowBlocks.map(([title, copy]) => <li key={title}><b>{title}</b><p>{copy}</p></li>)}
        </ol>
      </section>

      <section className="ryang-board">
        <div className="ryang-board__toolbar">
          <span>Sample facilities management board</span>
          <button type="button" onClick={() => setStatus('Demo scope added: HR, Talent, Timesheets and Facilities.')}>Build scope</button>
        </div>
        <div className="ryang-board__table" role="table" aria-label="R-Yang sample system scope">
          <div role="row"><b>Area</b><b>Key screens</b><b>Facilities value</b><b>Demo status</b></div>
          {screenshotFindings.map(([area, copy]) => (
            <div role="row" key={area}><span>{area}</span><span>{copy}</span><span>Reduce manual site follow-up</span><strong>Mapped</strong></div>
          ))}
        </div>
        {status ? <p className="ryang-status" role="status">{status}</p> : null}
      </section>

      <section className="ryang-final" id="pitch">
        <p>Pitch angle</p>
        <h2>Give R-Yang a demo that makes facilities operations feel visible, not overwhelming.</h2>
        <div>
          <a href="mailto:doasolutions@outlook.com?subject=R-Yang%20demo%20scope">Scope this demo</a>
          <a href="/showcase/">Back to showcase</a>
        </div>
        <small>All counts, names, statuses and workflows on this page are synthetic demo data derived from the screenshot inventory and public R-Yang service context. No HashMicro claims, live integrations, IoT device details or client results are implied.</small>
      </section>
    </main>
  );
}
