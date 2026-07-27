'use client';

import { useMemo, useState } from 'react';
import {
  Activity,
  BadgeCheck,
  Bell,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  ClipboardList,
  ClipboardPlus,
  Clock3,
  FileBarChart,
  FileText,
  LayoutDashboard,
  ListFilter,
  MapPin,
  Menu,
  Receipt,
  Search,
  Settings,
  TriangleAlert,
  UserCheck,
  UserPlus,
  UserRoundCog,
  Users,
  UsersRound,
  UserX,
  Wrench,
  X,
} from 'lucide-react';
import {
  approvalRows,
  attendanceRows,
  attentionItems,
  inspections,
  issueRows,
  scheduleJobs,
  siteOperations,
  type ApprovalRequest,
  type AttendanceStatus,
  type IssueStatus,
  type JobStatus,
  type Severity,
  type SiteOperation,
  type SiteStatus,
} from './r-yang/data';
import { StatusIcon, type StatusTone } from './r-yang/StatusIcon';

type DetailTab = 'Overview' | 'Attendance' | 'Tasks' | 'Inspections' | 'Issues' | 'Assets' | 'Timesheets' | 'Activity Log';

const navGroups = [
  {
    title: 'Operations',
    items: [
      ['Overview', LayoutDashboard],
      ['Live Operations', Activity],
      ['Sites', MapPin],
      ['Schedule', CalendarDays],
    ],
  },
  {
    title: 'Workforce',
    items: [
      ['Workforce', Users],
      ['Attendance', UserCheck],
      ['Timesheets', Clock3],
      ['Approvals', BadgeCheck],
    ],
  },
  {
    title: 'Service Quality',
    items: [
      ['Inspections', ClipboardCheck],
      ['Issues & Complaints', TriangleAlert],
      ['Maintenance', Wrench],
      ['Reports', FileBarChart],
      ['Settings', Settings],
    ],
  },
] as const;

const siteFilters = ['All Sites', 'Commercial', 'Healthcare', 'Education', 'Retail', 'Residential'];
const statusFilters: Array<'All statuses' | SiteStatus> = ['All statuses', 'On Track', 'Watch', 'Attention Required', 'Escalated'];
const detailTabs: DetailTab[] = ['Overview', 'Attendance', 'Tasks', 'Inspections', 'Issues', 'Assets', 'Timesheets', 'Activity Log'];

function statusTone(value: SiteStatus | JobStatus | AttendanceStatus | IssueStatus | Severity | string): StatusTone {
  if (['On Track', 'Completed', 'Present', 'Passed', 'Resolved'].includes(value)) return 'green';
  if (['Watch', 'Pending', 'Late', 'In Progress', 'Assigned', 'Investigating', 'Awaiting Client', 'Action needed'].includes(value)) return 'amber';
  if (['Attention Required', 'Escalated', 'Delayed', 'No check-in', 'Failed', 'Overdue', 'Critical', 'critical'].includes(value)) return 'red';
  if (['Upcoming', 'New', 'info'].includes(value)) return 'blue';
  return 'grey';
}

function statusClass(value: string) {
  return `ryops-badge is-${statusTone(value)}`;
}

function AppShell({ children, onOpenOverview }: { children: React.ReactNode; onOpenOverview: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="ryops-app">
      <div
        className="ryang-contract"
        dangerouslySetInnerHTML={{
          __html: '<!-- THESIS: R-Yang opens as daily operations software, not a sales page. OWN-WORLD: neutral enterprise shell, compact tables, thin borders, semantic status color, restrained R-Yang accent. STORY: supervisors and managers see today operations, exceptions, approvals and site details immediately. FIRST VIEWPORT: sidebar, compact header, live summary, requires-attention queue and site table. FORM: operate-mode internal dashboard; pitch content is separated into a solution overview modal. -->',
        }}
      />
      <SidebarNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
      <section className="ryops-main">
        <TopHeader onMenu={() => setMenuOpen(true)} onOpenOverview={onOpenOverview} />
        {children}
        <div className="ryops-footer-note">Demo by DOA Solutions · Sample operational data only</div>
      </section>
    </main>
  );
}

function SidebarNavigation({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <aside className={`ryops-sidebar ${open ? 'is-open' : ''}`} aria-label="R-Yang system navigation">
        <div className="ryops-brand">
          <span>R</span>
          <div>
            <b>R-Yang</b>
            <small>Operations System</small>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu"><X /></button>
        </div>
        {navGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <p>{group.title}</p>
            {group.items.map(([label, Icon], index) => (
              <a key={label} href="#overview" className={label === 'Overview' ? 'is-active' : ''}>
                <StatusIcon icon={Icon} tone={label === 'Overview' || index === 0 ? 'blue' : 'grey'} label={label} />
                <span>{label}</span>
              </a>
            ))}
          </nav>
        ))}
      </aside>
      {open ? <button type="button" className="ryops-scrim" onClick={onClose} aria-label="Close navigation" /> : null}
    </>
  );
}

function TopHeader({ onMenu, onOpenOverview }: { onMenu: () => void; onOpenOverview: () => void }) {
  return (
    <header className="ryops-topbar">
      <button className="ryops-menu-button" type="button" onClick={onMenu} aria-label="Open navigation"><Menu /></button>
      <div className="ryops-title">
        <h1>Operations Overview</h1>
        <p>Monday, 28 July 2026 · Live operational status across all sites</p>
      </div>
      <label className="ryops-global-search">
        <Search aria-hidden="true" />
        <span className="sr-only">Global search</span>
        <input placeholder="Search sites, staff, issues..." />
      </label>
      <select aria-label="Site selector" defaultValue="All sites">
        <option>All sites</option>
        <option>MCC Office Tower</option>
        <option>Retail Block A</option>
        <option>Healthcare Wing</option>
        <option>Education Campus</option>
      </select>
      <button className="ryops-icon-button" type="button" aria-label="7 notifications">
        <Bell />
        <span>7</span>
      </button>
      <button className="ryops-overview-link" type="button" onClick={onOpenOverview}>View Solution Overview</button>
      <div className="ryops-profile" aria-label="Signed in user">
        <b>Ops Manager</b>
        <span>RY</span>
      </div>
    </header>
  );
}

function OperationsSummary({ activeMetric, onSelectMetric }: { activeMetric: string; onSelectMetric: (metric: string) => void }) {
  const totals = {
    activeSites: siteOperations.length + 16,
    staffScheduled: 186,
    checkedIn: 171,
    lateAbsent: 15,
    completed: siteOperations.reduce((total, site) => total + site.tasksCompleted, 0),
    totalTasks: siteOperations.reduce((total, site) => total + site.tasksTotal, 0),
    openIssues: issueRows.filter((issue) => issue.status !== 'Resolved').length + 3,
  };
  const metrics = [
    ['Active Sites', `${totals.activeSites}`, Building2, 'blue'],
    ['Staff Scheduled', `${totals.staffScheduled}`, UsersRound, 'grey'],
    ['Checked In', `${totals.checkedIn}`, CircleCheck, 'green'],
    ['Late / Absent', `${totals.lateAbsent}`, UserX, 'red'],
    ['Jobs Completed', `${totals.completed} / ${totals.totalTasks}`, ClipboardList, 'amber'],
    ['Open Issues', `${totals.openIssues}`, CircleAlert, 'red'],
  ] as const;

  return (
    <section className="ryops-summary" aria-label="Operational summary">
      {metrics.map(([label, value, Icon, tone]) => (
        <button key={label} type="button" className={activeMetric === label ? 'is-active' : ''} onClick={() => onSelectMetric(label)}>
          <StatusIcon icon={Icon} tone={tone} size="md" label={label} />
          <span>{label}</span>
          <b>{value}</b>
        </button>
      ))}
    </section>
  );
}

function AttentionQueue({ acknowledged, onAcknowledge, onOpenSite }: { acknowledged: string[]; onAcknowledge: (id: string) => void; onOpenSite: (siteName: string) => void }) {
  const visibleItems = attentionItems.filter((item) => !acknowledged.includes(item.id));

  return (
    <section className="ryops-panel ryops-attention">
      <div className="ryops-panel-head">
        <div>
          <h2>Requires Attention</h2>
          <p>{visibleItems.length ? `${visibleItems.length} active exceptions need action` : 'No active exceptions in this demo view'}</p>
        </div>
        <StatusIcon icon={TriangleAlert} tone={visibleItems.some((item) => item.severity === 'critical') ? 'red' : 'amber'} size="md" label="Attention" />
      </div>
      {visibleItems.length ? (
        <div className="ryops-attention-list">
          {visibleItems.map((item) => (
            <article key={item.id}>
              <span className={statusClass(item.severity)}>{item.severity}</span>
              <div>
                <b>{item.title}</b>
                <p>{item.site} · {item.supervisor} · {item.time}</p>
              </div>
              <button type="button" onClick={() => onOpenSite(item.site)}>{item.action}</button>
              <button type="button" className="ryops-ghost-action" onClick={() => onAcknowledge(item.id)}>Acknowledge</button>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="All exceptions acknowledged" copy="New late, failed or overdue items will appear here." />
      )}
    </section>
  );
}

function SiteOperationsTable({
  sites,
  selectedStatus,
  onStatusChange,
  search,
  onSearchChange,
  onOpenSite,
}: {
  sites: SiteOperation[];
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  onOpenSite: (site: SiteOperation) => void;
}) {
  return (
    <section className="ryops-panel ryops-sites-table">
      <div className="ryops-table-toolbar">
        <div>
          <h2>Live Site Operations</h2>
          <p>{sites.length} matching site operations</p>
        </div>
        <div className="ryops-filter-row">
          <label>
            <ListFilter aria-hidden="true" />
            <select value={selectedStatus} onChange={(event) => onStatusChange(event.target.value)}>
              {statusFilters.map((status) => <option key={status}>{status}</option>)}
            </select>
          </label>
          <label>
            <Search aria-hidden="true" />
            <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search site or supervisor" />
          </label>
        </div>
      </div>
      {sites.length ? (
        <div className="ryops-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Site</th>
                <th>Service Type</th>
                <th>Supervisor</th>
                <th>Staff</th>
                <th>Attendance</th>
                <th>Current Shift</th>
                <th>Tasks</th>
                <th>Last Update</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site.id} onClick={() => onOpenSite(site)}>
                  <td><b>{site.name}</b><span>{site.category}</span></td>
                  <td>{site.serviceType}</td>
                  <td>{site.supervisor}</td>
                  <td>{site.staffCheckedIn} / {site.staffScheduled}</td>
                  <td><span className={statusClass(site.attendanceNote === 'Complete' ? 'Present' : site.attendanceNote.includes('absent') ? 'No check-in' : 'Late')}>{site.attendanceNote}</span></td>
                  <td>{site.shift}</td>
                  <td>{site.tasksCompleted} / {site.tasksTotal} completed</td>
                  <td>{site.lastUpdate}</td>
                  <td><span className={statusClass(site.status)}>{site.status}</span></td>
                  <td><button type="button" onClick={(event) => { event.stopPropagation(); onOpenSite(site); }}>Open</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState title="No sites match this filter" copy="Adjust the site category, status filter or search term." />
      )}
    </section>
  );
}

function SiteDetailsDrawer({ site, tab, onTabChange, onClose }: { site: SiteOperation | null; tab: DetailTab; onTabChange: (tab: DetailTab) => void; onClose: () => void }) {
  if (!site) return null;
  const siteAttendance = attendanceRows.filter((row) => row.site === site.name);
  const siteIssues = issueRows.filter((issue) => issue.site === site.name);
  const siteInspection = inspections.find((inspection) => inspection.site === site.name) ?? inspections[0];

  return (
    <div className="ryops-drawer-wrap" role="dialog" aria-modal="true" aria-labelledby="site-detail-title">
      <button className="ryops-drawer-scrim" type="button" onClick={onClose} aria-label="Close site details" />
      <aside className="ryops-drawer">
        <div className="ryops-drawer-head">
          <div>
            <span className={statusClass(site.status)}>{site.status}</span>
            <h2 id="site-detail-title">{site.name}</h2>
            <p>{site.address}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close site details"><X /></button>
        </div>
        <div className="ryops-detail-tabs" role="tablist" aria-label="Site detail sections">
          {detailTabs.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'is-active' : ''} onClick={() => onTabChange(item)}>{item}</button>
          ))}
        </div>
        <div className="ryops-drawer-body">
          {tab === 'Overview' ? <SiteOverview site={site} inspection={siteInspection} /> : null}
          {tab === 'Attendance' ? <AttendancePanel rows={siteAttendance.length ? siteAttendance : attendanceRows.slice(0, 4)} /> : null}
          {tab === 'Tasks' ? <ScheduleTimeline rows={scheduleJobs.filter((job) => job.site === site.name)} /> : null}
          {tab === 'Inspections' ? <InspectionSummary records={[siteInspection]} expanded /> : null}
          {tab === 'Issues' ? <IssueQueue rows={siteIssues.length ? siteIssues : issueRows.slice(0, 2)} /> : null}
          {tab === 'Assets' ? <AssetList site={site} /> : null}
          {tab === 'Timesheets' ? <TimesheetPanel site={site} /> : null}
          {tab === 'Activity Log' ? <ActivityLog site={site} /> : null}
        </div>
      </aside>
    </div>
  );
}

function SiteOverview({ site, inspection }: { site: SiteOperation; inspection: { score: number; result: string } }) {
  return (
    <div className="ryops-detail-grid">
      {[
        ['Contract / Service Scope', site.contractScope],
        ['Assigned Supervisor', site.supervisor],
        ['Current Shift', site.shift],
        ['Staff Scheduled', `${site.staffScheduled}`],
        ['Staff Checked In', `${site.staffCheckedIn}`],
        ['Late or Absent Staff', site.attendanceNote],
        ['Tasks Completed', `${site.tasksCompleted} / ${site.tasksTotal}`],
        ['Open Issues', `${site.openIssues}`],
        ['Last Inspection Score', `${inspection.score}% · ${inspection.result}`],
        ['Assets Requiring Attention', site.assetsAttention.join(', ')],
      ].map(([label, value]) => (
        <article key={label}>
          <span>{label}</span>
          <b>{value}</b>
        </article>
      ))}
    </div>
  );
}

function AttendancePanel({ rows = attendanceRows }: { rows?: typeof attendanceRows }) {
  const counts = {
    scheduled: rows.length,
    present: rows.filter((row) => row.status === 'Present').length,
    late: rows.filter((row) => row.status === 'Late').length,
    absent: rows.filter((row) => row.status === 'No check-in').length,
    leave: rows.filter((row) => row.status === 'Approved leave').length,
  };

  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head">
        <div><h2>Attendance</h2><p>Current shift staff check-in status</p></div>
      </div>
      <div className="ryops-mini-metrics">
        <span>Scheduled <b>{counts.scheduled}</b></span>
        <span>Present <b>{counts.present}</b></span>
        <span>Late <b>{counts.late}</b></span>
        <span>Absent <b>{counts.absent}</b></span>
        <span>On Leave <b>{counts.leave}</b></span>
      </div>
      <div className="ryops-table-scroll">
        <table>
          <thead><tr><th>Employee</th><th>Role</th><th>Site</th><th>Scheduled Time</th><th>Check-in Time</th><th>Status</th><th>Supervisor Action</th></tr></thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td><b>{row.employee}</b></td>
                <td>{row.role}</td>
                <td>{row.site}</td>
                <td>{row.scheduledTime}</td>
                <td>{row.checkInTime}</td>
                <td><span className={statusClass(row.status)}>{row.status}</span></td>
                <td><button type="button">{row.status === 'No check-in' ? 'Replace Staff' : row.status === 'Late' ? 'Record Reason' : 'View History'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ScheduleTimeline({ rows = scheduleJobs }: { rows?: typeof scheduleJobs }) {
  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head">
        <div><h2>Daily Schedule</h2><p>Morning and afternoon job progress</p></div>
        <StatusIcon icon={CalendarClock} tone="blue" size="md" label="Schedule" />
      </div>
      <div className="ryops-timeline">
        {rows.length ? rows.map((job) => (
          <article key={job.id}>
            <time>{job.time}</time>
            <div>
              <b>{job.service}</b>
              <span>{job.site} · {job.team} · {job.supervisor}</span>
            </div>
            <strong>{job.progress}</strong>
            <span className={statusClass(job.status)}>{job.status}</span>
          </article>
        )) : <EmptyState title="No jobs for this site in the current view" copy="Switch to all sites to view the full daily schedule." />}
      </div>
    </section>
  );
}

function InspectionSummary({ records = inspections, expanded = false }: { records?: typeof inspections; expanded?: boolean }) {
  const [openInspection, setOpenInspection] = useState(records[0]?.id ?? '');
  const current = records.find((record) => record.id === openInspection) ?? records[0];

  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head">
        <div><h2>Inspections & Quality</h2><p>Scores, failed checkpoints and corrective actions</p></div>
        <StatusIcon icon={ClipboardCheck} tone="green" size="md" label="Inspections" />
      </div>
      <div className="ryops-inspection-list">
        {records.map((record) => (
          <button key={record.id} type="button" className={openInspection === record.id ? 'is-active' : ''} onClick={() => setOpenInspection(record.id)}>
            <b>{record.site}</b>
            <strong>{record.score}%</strong>
            <span className={statusClass(record.result)}>{record.result}</span>
          </button>
        ))}
      </div>
      {expanded && current ? (
        <div className="ryops-checklist">
          <p>{current.date} · {current.inspector} · {current.correctiveStatus}</p>
          {current.checklist.map((item) => (
            <div key={item.item}>
              <span>{item.item}</span>
              <b className={statusClass(item.status)}>{item.status}</b>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function IssueQueue({ rows = issueRows }: { rows?: typeof issueRows }) {
  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head">
        <div><h2>Issues & Complaints</h2><p>Operational queue by reference, SLA and owner</p></div>
      </div>
      <div className="ryops-table-scroll">
        <table>
          <thead><tr><th>Reference</th><th>Site</th><th>Type</th><th>Description</th><th>Priority</th><th>Assigned To</th><th>Reported</th><th>SLA</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((issue) => (
              <tr key={issue.id}>
                <td><b>{issue.reference}</b></td>
                <td>{issue.site}</td>
                <td>{issue.type}</td>
                <td>{issue.description}</td>
                <td><span className={statusClass(issue.priority)}>{issue.priority}</span></td>
                <td>{issue.assignedTo}</td>
                <td>{issue.reported}</td>
                <td>{issue.sla}</td>
                <td><span className={statusClass(issue.status)}>{issue.status}</span></td>
                <td><button type="button">Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ApprovalQueue({ approvals, onDecision }: { approvals: ApprovalRequest[]; onDecision: (id: string, status: 'Approved' | 'Rejected') => void }) {
  const pending = approvals.filter((approval) => approval.status === 'Pending');

  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head">
        <div><h2>Approval Queue</h2><p>{pending.length} requests waiting for management action</p></div>
        <StatusIcon icon={BadgeCheck} tone="amber" size="md" label="Approvals" />
      </div>
      <div className="ryops-approval-table">
        {approvals.map((approval) => (
          <article key={approval.id} className={approval.status !== 'Pending' ? 'is-decided' : ''}>
            <div><b>{approval.type}</b><span>{approval.requester} · {approval.site}</span></div>
            <strong>{approval.amountOrDuration}</strong>
            <p>{approval.supportingInfo}</p>
            <small>Submitted {approval.submitted}</small>
            <span className={statusClass(approval.status)}>{approval.status}</span>
            <div>
              <button type="button" disabled={approval.status !== 'Pending'} onClick={() => onDecision(approval.id, 'Approved')}>Approve</button>
              <button type="button" disabled={approval.status !== 'Pending'} onClick={() => onDecision(approval.id, 'Rejected')}>Reject</button>
              <button type="button">View Details</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ManagementSummary() {
  const items = [
    ['Jobs completed today', '42 / 58'],
    ['Labour hours', '1,326h'],
    ['Overtime hours', '38h'],
    ['Attendance rate', '91.9%'],
    ['Inspection pass rate', '78%'],
    ['Open complaints', '2'],
    ['Estimated daily operating cost', 'RM 18.4k demo'],
    ['Billable value', 'RM 26.7k demo'],
  ];

  return (
    <section className="ryops-panel ryops-management">
      <div className="ryops-panel-head">
        <div><h2>Management Summary</h2><p>Financial values are demo data and subject to replacement</p></div>
      </div>
      <div>
        {items.map(([label, value]) => (
          <article key={label}>
            <span>{label}</span>
            <b>{value}</b>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuickActions({ onAction }: { onAction: (action: string) => void }) {
  const actions = [
    ['Create Work Order', ClipboardPlus],
    ['Add Staff', UserPlus],
    ['Assign Replacement', UserRoundCog],
    ['Record Incident', TriangleAlert],
    ['Start Inspection', ClipboardCheck],
    ['Add Expense', Receipt],
    ['Generate Daily Report', FileText],
  ] as const;

  return (
    <section className="ryops-panel ryops-quick-actions">
      <div className="ryops-panel-head">
        <div><h2>Quick Actions</h2><p>Common supervisor and management actions</p></div>
      </div>
      <div>
        {actions.map(([label, Icon]) => (
          <button key={label} type="button" onClick={() => onAction(label)}>
            <StatusIcon icon={Icon} tone={label.includes('Incident') ? 'red' : label.includes('Inspection') || label.includes('Report') ? 'green' : 'blue'} label={label} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function QuickActionModal({ action, onClose }: { action: string | null; onClose: () => void }) {
  if (!action) return null;
  return (
    <div className="ryops-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="quick-action-title">
      <button type="button" className="ryops-drawer-scrim" onClick={onClose} aria-label="Close quick action" />
      <form className="ryops-modal" onSubmit={(event) => { event.preventDefault(); onClose(); }}>
        <div className="ryops-modal-head">
          <h2 id="quick-action-title">{action}</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <label>Site<select><option>MCC Office Tower</option><option>Retail Block A</option><option>Healthcare Wing</option><option>Education Campus</option></select></label>
        <label>Priority<select><option>Normal</option><option>High</option><option>Critical</option></select></label>
        <label>Notes<textarea placeholder="Add instruction or operational note" /></label>
        <div className="ryops-modal-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Save Demo Action</button>
        </div>
      </form>
    </div>
  );
}

function SolutionOverview({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="ryops-modal-wrap" role="dialog" aria-modal="true" aria-labelledby="solution-title">
      <button type="button" className="ryops-drawer-scrim" onClick={onClose} aria-label="Close solution overview" />
      <section className="ryops-modal ryops-solution">
        <div className="ryops-modal-head">
          <h2 id="solution-title">R-Yang Solution Overview</h2>
          <button type="button" onClick={onClose} aria-label="Close"><X /></button>
        </div>
        <div className="ryops-solution-grid">
          <article><b>System modules</b><p>Sites, attendance, scheduling, inspections, issues, maintenance, timesheets, approvals and reporting.</p></article>
          <article><b>Connected workflow</b><p>Daily check-in, work assignment, inspection, issue response, approval and management summary in one operating layer.</p></article>
          <article><b>Proposed scope</b><p>Replace manual status chasing with supervisor-ready operational views and management queues.</p></article>
          <article><b>Business value</b><p>Faster exception handling, clearer accountability, better quality records and cleaner reporting for facilities contracts.</p></article>
        </div>
        <p className="ryops-disclaimer">Demo only. Counts, names, locations, costs, inspections, statuses and workflows are sample placeholders for presentation. No fake API integration, confirmed client system, live device feed or verified financial claim is implied.</p>
      </section>
    </div>
  );
}

function AssetList({ site }: { site: SiteOperation }) {
  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head"><div><h2>Assets</h2><p>Equipment or supplies requiring attention</p></div></div>
      <div className="ryops-asset-list">
        {site.assetsAttention.map((asset) => (
          <article key={asset}>
            <StatusIcon icon={Wrench} tone="amber" label={asset} />
            <b>{asset}</b>
            <span>Service check required</span>
            <button type="button">Create Work Order</button>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimesheetPanel({ site }: { site: SiteOperation }) {
  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head"><div><h2>Timesheets</h2><p>{site.name} · current week</p></div></div>
      <div className="ryops-detail-grid">
        <article><span>Submitted hours</span><b>186h</b></article>
        <article><span>Pending approval</span><b>42h</b></article>
        <article><span>Overtime flagged</span><b>6h</b></article>
        <article><span>Missing entries</span><b>3 staff</b></article>
      </div>
    </section>
  );
}

function ActivityLog({ site }: { site: SiteOperation }) {
  return (
    <section className="ryops-panel ryops-compact-section">
      <div className="ryops-panel-head"><div><h2>Activity Log</h2><p>{site.name} operational history</p></div></div>
      <div className="ryops-timeline">
        {['Supervisor updated task progress', 'Inspection score saved', 'Late check-in reason recorded', 'Client complaint assigned'].map((event, index) => (
          <article key={event}>
            <time>{['09:24', '09:10', '08:49', '08:31'][index]}</time>
            <div><b>{event}</b><span>Demo activity entry</span></div>
            <span className="ryops-badge is-grey">Logged</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyState({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="ryops-empty">
      <CircleCheck aria-hidden="true" />
      <b>{title}</b>
      <p>{copy}</p>
    </div>
  );
}

export function RYangDemo() {
  const [siteFilter, setSiteFilter] = useState('All Sites');
  const [statusFilter, setStatusFilter] = useState<string>('All statuses');
  const [search, setSearch] = useState('');
  const [activeMetric, setActiveMetric] = useState('Late / Absent');
  const [selectedSite, setSelectedSite] = useState<SiteOperation | null>(null);
  const [detailTab, setDetailTab] = useState<DetailTab>('Overview');
  const [acknowledged, setAcknowledged] = useState<string[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(approvalRows);
  const [quickAction, setQuickAction] = useState<string | null>(null);
  const [solutionOpen, setSolutionOpen] = useState(false);

  const filteredSites = useMemo(() => {
    const value = search.trim().toLowerCase();
    return siteOperations.filter((site) => {
      const siteMatches = siteFilter === 'All Sites' || site.category === siteFilter;
      const statusMatches = statusFilter === 'All statuses' || site.status === statusFilter;
      const searchMatches = !value || `${site.name} ${site.supervisor} ${site.serviceType}`.toLowerCase().includes(value);
      if (activeMetric === 'Late / Absent') return siteMatches && statusMatches && searchMatches && site.attendanceNote !== 'Complete';
      if (activeMetric === 'Open Issues') return siteMatches && statusMatches && searchMatches && site.openIssues > 0;
      return siteMatches && statusMatches && searchMatches;
    });
  }, [activeMetric, search, siteFilter, statusFilter]);

  const openSiteByName = (siteName: string) => {
    const site = siteOperations.find((item) => item.name === siteName) ?? siteOperations[0];
    setSelectedSite(site);
    setDetailTab(siteName === 'Multiple Sites' ? 'Attendance' : 'Overview');
  };

  return (
    <AppShell onOpenOverview={() => setSolutionOpen(true)}>
      <section className="ryops-workspace" id="overview">
        <div className="ryops-controls">
          <div className="ryops-segmented" aria-label="Site category filter">
            {siteFilters.map((filter) => (
              <button key={filter} type="button" className={siteFilter === filter ? 'is-active' : ''} onClick={() => setSiteFilter(filter)}>{filter}</button>
            ))}
          </div>
          <label>
            Today
            <input type="date" defaultValue="2026-07-28" aria-label="Operations date" />
          </label>
        </div>
        <OperationsSummary activeMetric={activeMetric} onSelectMetric={setActiveMetric} />
        <div className="ryops-grid-main">
          <div className="ryops-stack">
            <AttentionQueue acknowledged={acknowledged} onAcknowledge={(id) => setAcknowledged((items) => [...items, id])} onOpenSite={openSiteByName} />
            <SiteOperationsTable
              sites={filteredSites}
              selectedStatus={statusFilter}
              onStatusChange={setStatusFilter}
              search={search}
              onSearchChange={setSearch}
              onOpenSite={(site) => { setSelectedSite(site); setDetailTab('Overview'); }}
            />
            <div className="ryops-two-column">
              <ScheduleTimeline />
              <InspectionSummary />
            </div>
            <IssueQueue />
            <ApprovalQueue
              approvals={approvals}
              onDecision={(id, status) => setApprovals((items) => items.map((item) => item.id === id ? { ...item, status } : item))}
            />
          </div>
          <aside className="ryops-side-rail">
            <QuickActions onAction={setQuickAction} />
            <ManagementSummary />
          </aside>
        </div>
      </section>
      <SiteDetailsDrawer site={selectedSite} tab={detailTab} onTabChange={setDetailTab} onClose={() => setSelectedSite(null)} />
      <QuickActionModal action={quickAction} onClose={() => setQuickAction(null)} />
      <SolutionOverview open={solutionOpen} onClose={() => setSolutionOpen(false)} />
    </AppShell>
  );
}
