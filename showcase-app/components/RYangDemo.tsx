'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Boxes,
  BriefcaseBusiness,
  Building2,
  CalendarCheck,
  ChartNoAxesCombined,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  FileText,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  MapPinned,
  Menu,
  Megaphone,
  PackageSearch,
  ReceiptText,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TimerReset,
  UserRoundCheck,
  UserRoundPlus,
  UsersRound,
  WalletCards,
  Wrench,
  X,
  type LucideIcon,
} from 'lucide-react';
import styles from './RYangDemo.module.css';

type ModuleKey = 'fm' | 'hr';

type PageDefinition = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
  group: string;
  columns: string[];
  next?: string;
};

const facilitiesPages: PageDefinition[] = [
  { key: 'overview', label: 'Facilities Overview', description: 'Move from registered assets and locations into planned or requested maintenance.', icon: LayoutDashboard, group: 'Workspace', columns: [], next: 'assets' },
  { key: 'assets', label: 'Assets', description: 'Register equipment, vehicles and facilities assets before maintenance activity begins.', icon: Boxes, group: 'Master Data', columns: ['Asset', 'Category', 'Location', 'Status', 'Last updated'], next: 'facilities-areas' },
  { key: 'facilities-areas', label: 'Facilities Areas', description: 'Organise sites into maintainable buildings, floors, zones and service areas.', icon: MapPinned, group: 'Master Data', columns: ['Area', 'Parent location', 'Site', 'Status'], next: 'maintenance-teams' },
  { key: 'maintenance-teams', label: 'Maintenance Teams', description: 'Define the internal or external teams responsible for maintenance work.', icon: UsersRound, group: 'Master Data', columns: ['Team', 'Lead', 'Coverage', 'Status'], next: 'maintenance-types' },
  { key: 'maintenance-types', label: 'Maintenance Types', description: 'Classify preventive, corrective, inspection and emergency maintenance.', icon: SlidersHorizontal, group: 'Master Data', columns: ['Maintenance type', 'Category', 'Default priority', 'Status'], next: 'products' },
  { key: 'products', label: 'Products & Parts', description: 'Maintain the products, consumables and replacement parts used by each job.', icon: PackageSearch, group: 'Master Data', columns: ['Product', 'Category', 'Unit', 'Available stock'] },
  { key: 'preventive-plans', label: 'Preventive Plans', description: 'Schedule recurring maintenance by asset, site and responsible team.', icon: CalendarCheck, group: 'Maintenance Flow', columns: ['Plan', 'Asset / area', 'Team', 'Frequency', 'Next due'], next: 'maintenance-requests' },
  { key: 'meter-plans', label: 'Meter-Based Plans', description: 'Trigger maintenance from hour-meter or odometer thresholds.', icon: Gauge, group: 'Maintenance Flow', columns: ['Plan', 'Asset', 'Meter type', 'Threshold', 'Next service'] },
  { key: 'maintenance-requests', label: 'Maintenance Requests', description: 'Capture a fault or service need, assess it and route it for approval.', icon: ClipboardList, group: 'Maintenance Flow', columns: ['Request', 'Asset / area', 'Priority', 'Requested by', 'Status'], next: 'work-orders' },
  { key: 'work-orders', label: 'Work Orders', description: 'Convert approved requests or plans into assigned, traceable work.', icon: Wrench, group: 'Maintenance Flow', columns: ['Work order', 'Source', 'Assigned team', 'Due date', 'Status'], next: 'maintenance-orders' },
  { key: 'maintenance-orders', label: 'Maintenance Orders', description: 'Record execution, parts, labour, completion notes and sign-off.', icon: ClipboardCheck, group: 'Maintenance Flow', columns: ['Order', 'Work order', 'Asset', 'Started', 'Status'], next: 'reports' },
  { key: 'reports', label: 'Facilities Reports', description: 'Review maintenance requests, work orders and asset or vehicle costs.', icon: ChartNoAxesCombined, group: 'Reporting', columns: ['Report', 'Scope', 'Period', 'Format'] },
];

const hrPages: PageDefinition[] = [
  { key: 'overview', label: 'HR Overview', description: 'A clear path from organisation setup into the employee lifecycle and workforce records.', icon: LayoutDashboard, group: 'Workspace', columns: [], next: 'organisation' },
  { key: 'organisation', label: 'Organisation', description: 'Define company structure, departments, positions and reporting lines.', icon: Building2, group: 'Organisation', columns: ['Unit', 'Parent unit', 'Lead', 'Status'], next: 'employees' },
  { key: 'employees', label: 'Employees', description: 'Maintain employee profiles, roles, contact details and employment status.', icon: UsersRound, group: 'People', columns: ['Employee', 'Employee ID', 'Position', 'Department', 'Status'], next: 'contracts' },
  { key: 'contracts', label: 'Contracts & Letters', description: 'Track employment contracts and generate controlled employee letters.', icon: FileText, group: 'People', columns: ['Document', 'Employee', 'Type', 'Effective date', 'Status'], next: 'attendance' },
  { key: 'attendance', label: 'Attendance', description: 'Review attendance records and exceptions without inventing check-ins.', icon: UserRoundCheck, group: 'Workforce', columns: ['Employee', 'Date', 'Shift', 'Check-in', 'Status'], next: 'timesheets' },
  { key: 'timesheets', label: 'Timesheets', description: 'Capture employee time by project or task and route entries for approval.', icon: TimerReset, group: 'Workforce', columns: ['Timesheet', 'Employee', 'Period', 'Hours', 'Approval status'], next: 'leave' },
  { key: 'leave', label: 'Leave', description: 'Submit, review and approve leave requests against defined leave types.', icon: CalendarCheck, group: 'Workforce', columns: ['Request', 'Employee', 'Leave type', 'Dates', 'Status'] },
  { key: 'claims', label: 'Expenses & Claims', description: 'Submit supported employee expenses and track approval and payment state.', icon: WalletCards, group: 'Workforce', columns: ['Claim', 'Employee', 'Category', 'Amount', 'Status'] },
  { key: 'recruitment', label: 'Recruitment', description: 'Move approved vacancies through candidates, interviews and offers.', icon: UserRoundPlus, group: 'Talent', columns: ['Vacancy / candidate', 'Position', 'Stage', 'Owner', 'Status'], next: 'training' },
  { key: 'training', label: 'Training', description: 'Plan learning activities and retain employee participation records.', icon: GraduationCap, group: 'Talent', columns: ['Programme', 'Audience', 'Schedule', 'Owner', 'Status'] },
  { key: 'announcements', label: 'Announcements', description: 'Publish controlled internal notices to the relevant workforce audience.', icon: Megaphone, group: 'Engagement', columns: ['Announcement', 'Audience', 'Publish date', 'Status'] },
  { key: 'reports', label: 'HR Reports', description: 'Open workforce, attendance, leave, timesheet and recruitment reports.', icon: ChartNoAxesCombined, group: 'Reporting', columns: ['Report', 'Scope', 'Period', 'Format'] },
];

const moduleMeta = {
  fm: {
    name: 'Facilities Management',
    shortName: 'Facilities',
    description: 'Assets, maintenance planning, service requests, work orders and cost reporting.',
    icon: Wrench,
    pages: facilitiesPages,
    stages: [
      { label: 'Register', target: 'assets' },
      { label: 'Plan', target: 'preventive-plans' },
      { label: 'Request', target: 'maintenance-requests' },
      { label: 'Approve', target: 'work-orders' },
      { label: 'Execute', target: 'maintenance-orders' },
      { label: 'Report', target: 'reports' },
    ],
  },
  hr: {
    name: 'Human Resources',
    shortName: 'HR & Workforce',
    description: 'Organisation, employee records, attendance, timesheets, leave and talent workflows.',
    icon: UsersRound,
    pages: hrPages,
    stages: [
      { label: 'Organise', target: 'organisation' },
      { label: 'Employ', target: 'employees' },
      { label: 'Schedule', target: 'attendance' },
      { label: 'Record', target: 'timesheets' },
      { label: 'Approve', target: 'leave' },
      { label: 'Develop', target: 'training' },
    ],
  },
};

function readLocation(): { module: ModuleKey; page: string } {
  if (typeof window === 'undefined') return { module: 'fm', page: 'overview' };
  const [module, page] = window.location.hash.replace(/^#\/?/, '').split('/');
  return {
    module: module === 'hr' ? 'hr' : 'fm',
    page: page || 'overview',
  };
}

export function RYangDemo() {
  const [location, setLocation] = useState(readLocation);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const sync = () => setLocation(readLocation());
    window.addEventListener('hashchange', sync);
    if (!window.location.hash) window.history.replaceState(null, '', '#/fm/overview');
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const activeModule = moduleMeta[location.module];
  const activePage = activeModule.pages.find((page) => page.key === location.page) ?? activeModule.pages[0];
  const groups = useMemo(() => Array.from(new Set(activeModule.pages.map((page) => page.group))), [activeModule]);
  const filteredPages = activeModule.pages.filter((page) => `${page.label} ${page.description}`.toLowerCase().includes(query.toLowerCase()));

  const navigate = (module: ModuleKey, page: string) => {
    window.location.hash = `/${module}/${page}`;
    setMobileOpen(false);
    setQuery('');
  };

  return (
    <main className={styles.app}>
      <div dangerouslySetInnerHTML={{ __html: '<!-- THESIS: The showcase behaves like a real operating-system map, refusing fabricated dashboard activity. OWN-WORLD: R-Yang aubergine navigation, white audit surfaces, gold wayfinding and compact slate rules. STORY: a presenter moves from module to process to an honest empty workspace, showing exactly where each operational record belongs. FIRST VIEWPORT: fixed branded rail, utility bar, two-module context switcher and the selected workflow map. FORM: reference-led process atlas, fourth grounded structure; seed 34fa3684. -->' }} />
      <Sidebar
        module={location.module}
        page={activePage.key}
        groups={groups}
        pages={filteredPages}
        query={query}
        open={mobileOpen}
        onSearch={setQuery}
        onNavigate={navigate}
        onClose={() => setMobileOpen(false)}
      />

      <section className={styles.workspace}>
        <header className={styles.topbar}>
          <button className={styles.menuButton} type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu /></button>
          <div className={styles.breadcrumbs}>
            <span>R-YANG Operations</span>
            <strong>{activeModule.name}</strong>
          </div>
          <div className={styles.moduleSwitch} aria-label="Switch module">
            {(Object.keys(moduleMeta) as ModuleKey[]).map((key) => {
              const item = moduleMeta[key];
              const Icon = item.icon;
              return <button key={key} className={location.module === key ? styles.activeModule : ''} onClick={() => navigate(key, 'overview')} type="button"><Icon />{item.shortName}</button>;
            })}
          </div>
          <div className={styles.profile}><span>AD</span><div><b>Admin User</b><small>Demo workspace</small></div></div>
        </header>

        <div className={styles.content}>
          {activePage.key === 'overview'
            ? <ModuleOverview module={location.module} onNavigate={navigate} />
            : <ModulePage module={location.module} page={activePage} onNavigate={navigate} />}
        </div>
        <footer className={styles.footer}>Interactive structure demo · No operational or employee data is stored here</footer>
      </section>
      {mobileOpen ? <button type="button" className={styles.scrim} onClick={() => setMobileOpen(false)} aria-label="Close navigation" /> : null}
    </main>
  );
}

function Sidebar({ module, page, groups, pages, query, open, onSearch, onNavigate, onClose }: {
  module: ModuleKey;
  page: string;
  groups: string[];
  pages: PageDefinition[];
  query: string;
  open: boolean;
  onSearch: (value: string) => void;
  onNavigate: (module: ModuleKey, page: string) => void;
  onClose: () => void;
}) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`} aria-label="System navigation">
      <div className={styles.brand}>
        <img src="/showcase/images/r-yang-logo.png" alt="R-Yang" />
        <div><b>R-YANG</b><small>Operations System</small></div>
        <button type="button" onClick={onClose} aria-label="Close navigation"><X /></button>
      </div>
      <label className={styles.search}>
        <Search />
        <span className="sr-only">Filter module pages</span>
        <input value={query} onChange={(event) => onSearch(event.target.value)} placeholder="Find a workspace" />
      </label>
      <nav>
        {groups.map((group) => {
          const groupPages = pages.filter((item) => item.group === group);
          if (!groupPages.length) return null;
          return <div className={styles.navGroup} key={group}>
            <p>{group}</p>
            {groupPages.map((item) => {
              const Icon = item.icon;
              const active = item.key === page;
              return <a key={item.key} className={active ? styles.activeNav : ''} href={`#/${module}/${item.key}`} onClick={() => onNavigate(module, item.key)}>
                <Icon />
                <span>{item.label}</span>
              </a>;
            })}
          </div>;
        })}
        {pages.length === 0 ? <p className={styles.noResults}>No matching workspace</p> : null}
      </nav>
      <div className={styles.sidebarFoot}><ShieldCheck /><span><b>Structure demo</b><small>No live company data</small></span></div>
    </aside>
  );
}

function ModuleOverview({ module, onNavigate }: { module: ModuleKey; onNavigate: (module: ModuleKey, page: string) => void }) {
  const meta = moduleMeta[module];
  const Icon = meta.icon;
  const groups = Array.from(new Set(meta.pages.filter((page) => page.key !== 'overview').map((page) => page.group)));
  return <>
    <section className={styles.pageHeader}>
      <div className={styles.titleIcon}><Icon /></div>
      <div><span>MODULE OVERVIEW</span><h1>{meta.name}</h1><p>{meta.description}</p></div>
    </section>

    <section className={styles.flowPanel}>
      <div className={styles.panelHead}><div><span>PROCESS MAP</span><h2>How the module fits together</h2></div><small>Select any stage or workspace to open it</small></div>
      <div className={styles.stageTrack}>
        {meta.stages.map((stage, index) => <button type="button" key={stage.label} onClick={() => onNavigate(module, stage.target)}><span>{index + 1}</span><b>{stage.label}</b></button>)}
      </div>
    </section>

    <section className={styles.workspaceGroups}>
      {groups.map((group) => <article key={group}>
        <div className={styles.groupHeading}><div><span>{group}</span><h2>{group === 'Master Data' || group === 'Organisation' ? 'Build the foundation' : group === 'Reporting' ? 'Review and report' : 'Run the workflow'}</h2></div></div>
        <div className={styles.linkGrid}>
          {meta.pages.filter((page) => page.group === group).map((item) => {
            const PageIcon = item.icon;
            return <button type="button" key={item.key} onClick={() => onNavigate(module, item.key)}><PageIcon /><span><b>{item.label}</b><small>{item.description}</small></span><span className={styles.arrow}>→</span></button>;
          })}
        </div>
      </article>)}
    </section>
  </>;
}

function ModulePage({ module, page, onNavigate }: { module: ModuleKey; page: PageDefinition; onNavigate: (module: ModuleKey, page: string) => void }) {
  const Icon = page.icon;
  const meta = moduleMeta[module];
  return <>
    <section className={styles.pageHeader}>
      <div className={styles.titleIcon}><Icon /></div>
      <div><span>{meta.name.toUpperCase()} / {page.group.toUpperCase()}</span><h1>{page.label}</h1><p>{page.description}</p></div>
      <button type="button" className={styles.backButton} onClick={() => onNavigate(module, 'overview')}>View process map</button>
    </section>

    <section className={styles.recordPanel}>
      <div className={styles.recordToolbar}>
        <div><span>WORKSPACE</span><h2>{page.label}</h2></div>
        <div className={styles.demoLabel}><FileCheck2 />Ready for configuration</div>
      </div>
      {page.columns.length ? <div className={styles.tableWrap}>
        <table>
          <thead><tr>{page.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
          <tbody><tr><td colSpan={page.columns.length}>
            <div className={styles.emptyState}><span><Icon /></span><h3>No records yet</h3><p>This demo keeps the workspace empty. In production, authorised users would create and manage {page.label.toLowerCase()} here.</p></div>
          </td></tr></tbody>
        </table>
      </div> : null}
    </section>

    <section className={styles.nextPanel}>
      <div><ReceiptText /><span><b>Connected workflow</b><small>Records created here remain linked to the next operational step.</small></span></div>
      {page.next ? <button type="button" onClick={() => onNavigate(module, page.next!)}>Continue to {meta.pages.find((item) => item.key === page.next)?.label} →</button> : <button type="button" onClick={() => onNavigate(module, 'overview')}>Return to module overview →</button>}
    </section>
  </>;
}
