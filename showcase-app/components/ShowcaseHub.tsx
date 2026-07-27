'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const projects = [
  {
    index: '01',
    name: 'RoyalLegacyz',
    href: '/showcase/royallegacyz/',
    sector: 'Streetwear / Commerce',
    statement: 'A sales-first digital flagship built around drops, loyalty and live shopping.',
    systems: ['Storefront', 'Gallery', 'Loyalty', 'Live schedule'],
    tone: 'signal-violet',
    preview: 'commerce',
  },
  {
    index: '02',
    name: 'KKI',
    href: '/showcase/kki/',
    sector: 'Fabric retail / Operations',
    statement: 'Customer ordering and staff operations connected from consultation to inventory.',
    systems: ['Order tracking', 'Consultation', 'Inventory', 'Staff tools'],
    tone: 'signal-copper',
    preview: 'inventory',
  },
  {
    index: '03',
    name: 'H&N Takaful',
    href: '/showcase/H&N/',
    sector: 'Financial services / Agency',
    statement: 'A customer and agent operating layer for clearer protection decisions.',
    systems: ['Calculator', 'Policy review', 'Agent toolkit', 'Reporting'],
    tone: 'signal-blue',
    preview: 'coverage',
  },
  {
    index: '04',
    name: 'Lindo Clinic',
    href: '/showcase/lindo-clinic/',
    sector: 'Aesthetic clinic / Experience',
    statement: 'Three sharply different digital directions for a premium clinical brand.',
    systems: ['Pearl Atelier', 'Clinical Prestige', 'Nocturne Elite'],
    tone: 'signal-rose',
    preview: 'schedule',
  },
  {
    index: '05',
    name: 'Inaz Mobile Spa',
    href: '/showcase/inaz-mobile-spa/',
    sector: 'Wellness / Mobile operations',
    statement: 'A booking-to-therapist workflow designed for services that travel.',
    systems: ['Customer booking', 'E-KYC', 'Therapist board', 'Nearby slots'],
    tone: 'signal-amber',
    preview: 'dispatch',
  },
  {
    index: '06',
    name: 'OYA',
    href: '/showcase/oya/',
    sector: 'Travel / Hospitality',
    statement: 'A unified travel and airport-stay demo built around one parent OYA brand.',
    systems: ['Travel packages', 'Umrah & Hajj', 'OYA Inn', 'Enquiry flow'],
    tone: 'signal-amber',
    preview: 'travelStay',
  },
  {
    index: '07',
    name: 'Folk Kofii',
    href: '/showcase/folk-kofii/',
    sector: 'Cafe / Arts events',
    statement: 'An artsy Taman Melawati cafe demo built around coffee, stage nights and community memory.',
    systems: ['Event calendar', 'Artist intake', 'MWT archive', 'RSVP flow'],
    tone: 'signal-green',
    preview: 'indieCafe',
  },
  {
    index: '08',
    name: 'R-Yang',
    href: '/showcase/r-yang/',
    sector: 'Facilities / Workforce ops',
    statement: 'A facilities, workforce and service-order cockpit shaped from real system screenshots.',
    systems: ['Site teams', 'Quality review', 'Timesheets', 'Maintenance'],
    tone: 'signal-blue',
    preview: 'opsSuite',
  },
];

const reportPhases = ['Syncing inputs', 'Reconciling records', 'Building report', 'Report issued'];

function OperationsReport({ enabled }: { enabled: boolean }) {
  const [phase, setPhase] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    const phaseTimer = window.setInterval(() => setPhase((current) => (current + 1) % reportPhases.length), 2100);
    const metricTimer = window.setInterval(() => setPulse((current) => current + 1), 1450);
    return () => {
      window.clearInterval(phaseTimer);
      window.clearInterval(metricTimer);
    };
  }, [enabled]);

  const metrics = [
    { label: 'Active jobs', value: String(128 + (pulse % 4)), delta: '+12.4%' },
    { label: 'Revenue tracked', value: `RM ${(84.2 + (pulse % 5) * 0.3).toFixed(1)}K`, delta: '+8.7%' },
    { label: 'Tasks automated', value: (2416 + (pulse % 7) * 8).toLocaleString(), delta: '+31' },
    { label: 'System health', value: `${(99.4 + (pulse % 3) * 0.1).toFixed(1)}%`, delta: 'Stable' },
  ];
  const activity = [
    ['Booking received', 'Customer flow', 'Now'],
    ['Payment reconciled', 'Finance', '08s'],
    ['Weekly report prepared', 'Reporting', '21s'],
  ];

  return (
    <div className="showcase-ops-report" aria-hidden="true">
      <div className="showcase-ops-report__top">
        <span><i /> DOA operating intelligence</span>
        <span>LIVE / KL-01</span>
      </div>
      <div className="showcase-ops-report__metrics">
        {metrics.map((metric) => (
          <div className="showcase-ops-metric" key={metric.label}>
            <span>{metric.label}</span>
            <strong key={metric.value}>{metric.value}</strong>
            <small>{metric.delta}</small>
          </div>
        ))}
      </div>
      <div className="showcase-ops-report__body">
        <div className="showcase-ops-chart">
          <div className="showcase-ops-chart__head"><span>Operational throughput</span><span>Last 30 days</span></div>
          <svg viewBox="0 0 420 146" preserveAspectRatio="none">
            <defs><linearGradient id="opsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#51e49b" stopOpacity=".34" /><stop offset="1" stopColor="#51e49b" stopOpacity="0" /></linearGradient></defs>
            <path className="showcase-ops-chart__area" d="M0 124 C35 120 45 93 78 99 S128 120 158 80 S206 93 237 61 S286 82 320 42 S371 58 420 18 L420 146 L0 146 Z" />
            <path className="showcase-ops-chart__line" d="M0 124 C35 120 45 93 78 99 S128 120 158 80 S206 93 237 61 S286 82 320 42 S371 58 420 18" />
          </svg>
          <div className="showcase-ops-chart__scanner" />
          <div className="showcase-ops-chart__axis"><span>W1</span><span>W2</span><span>W3</span><span>W4</span></div>
        </div>
        <div className="showcase-ops-modules">
          <span>Connected modules</span>
          <div><i className="is-live" />Sales <b>128</b></div>
          <div><i className="is-live" />Customers <b>842</b></div>
          <div><i />Workforce <b>24</b></div>
          <div><i className="is-live" />Reporting <b>06</b></div>
        </div>
      </div>
      <div className="showcase-ops-report__foot">
        <div className="showcase-ops-activity">
          {activity.map(([event, module, time], index) => (
            <div key={event} style={{ '--activity-delay': `${index * 0.7}s` } as CSSProperties}><i /><span><b>{event}</b><small>{module}</small></span><em>{time}</em></div>
          ))}
        </div>
        <div className={`showcase-report-cycle is-phase-${phase}`}>
          <div><img src="/showcase/doa-logo-mark-transparent.png" alt="" /><span>{reportPhases[phase]}</span></div>
          <div className="showcase-report-cycle__track"><i /></div>
          <small>{phase === 3 ? 'PDF / READY' : `PROCESS 0${phase + 1}/04`}</small>
        </div>
      </div>
      <div className="showcase-ops-report__scan" />
    </div>
  );
}

function ProjectInstrument({ type, active, tick }: { type: string; active: boolean; tick: number }) {
  const runningClass = active ? ' is-running' : '';
  if (type === 'commerce') {
    const bars = [.38, .58, .43, .78, .62, .9, .72, 1];
    return (
      <div className={`showcase-instrument showcase-instrument--commerce${runningClass}`} aria-hidden="true">
        <header><span>Live order flow</span><strong>{128 + (tick % 7)}</strong></header>
        <div className="showcase-commerce-bars">{bars.map((scale, index) => <i key={index} style={{ '--bar-scale': scale, '--bar-delay': `${index * 70}ms` } as CSSProperties} />)}</div>
        <footer><span>Drop 03</span><span className="is-positive">+12.4%</span></footer>
      </div>
    );
  }

  if (type === 'inventory') {
    return (
      <div className={`showcase-instrument showcase-instrument--inventory${runningClass}`} aria-hidden="true">
        <header><span>Inventory matrix</span><strong>{342 - (tick % 5)}</strong></header>
        <div className="showcase-inventory-grid">{Array.from({ length: 15 }, (_, index) => <i className={(index + tick) % 7 === 0 ? 'is-moving' : ''} key={index}><span /></i>)}</div>
        <footer><span>12 SKUs synced</span><span>98.6%</span></footer>
      </div>
    );
  }

  if (type === 'coverage') {
    const score = 82 + (tick % 4);
    return (
      <div className={`showcase-instrument showcase-instrument--coverage${runningClass}`} aria-hidden="true">
        <header><span>Coverage analysis</span><strong>{score}%</strong></header>
        <svg viewBox="0 0 160 92"><path className="coverage-track" d="M20 78 A60 60 0 0 1 140 78" /><path className="coverage-value" d="M20 78 A60 60 0 0 1 140 78" /><line x1="80" y1="78" x2="126" y2="42" /><circle cx="80" cy="78" r="4" /></svg>
        <footer><span>Risk mapped</span><span className="is-positive">Protected</span></footer>
      </div>
    );
  }

  if (type === 'schedule') {
    return (
      <div className={`showcase-instrument showcase-instrument--schedule${runningClass}`} aria-hidden="true">
        <header><span>Appointment board</span><strong>{6 + (tick % 3)} slots</strong></header>
        <div className="showcase-schedule-grid">{Array.from({ length: 15 }, (_, index) => <i className={(index + tick) % 4 === 0 || index === 7 ? 'is-booked' : ''} key={index}><span>{9 + index}:00</span></i>)}</div>
        <footer><span>Today / KL</span><span>Next 14:30</span></footer>
      </div>
    );
  }

  if (type === 'travelStay') {
    return (
      <div className={`showcase-instrument showcase-instrument--travel${runningClass}`} aria-hidden="true">
        <header><span>Journey + stay</span><strong>{3 + (tick % 2)} trips</strong></header>
        <div className="showcase-travel-map">
          <i className="is-home">KUL</i>
          <svg viewBox="0 0 180 74">
            <path d="M18 55 C48 18 86 20 112 45 S150 64 164 19" />
            <circle cx="18" cy="55" r="4" />
            <circle cx="112" cy="45" r="4" />
            <circle cx="164" cy="19" r="4" />
          </svg>
          <i className="is-bed">Inn</i>
        </div>
        <div className="showcase-travel-tags"><span>Umrah</span><span>Island</span><span>KLIA stay</span></div>
        <footer><span>Travel desk</span><span className="is-positive">Ready</span></footer>
      </div>
    );
  }

  if (type === 'indieCafe') {
    return (
      <div className={`showcase-instrument showcase-instrument--cafe${runningClass}`} aria-hidden="true">
        <header><span>Alley board</span><strong>MWT</strong></header>
        <div className="showcase-cafe-stickers">
          <i>OPEN MIC</i>
          <i>SAJAK</i>
          <i>ZINE</i>
          <i>INDIE SET</i>
          <i>KOFII</i>
        </div>
        <footer><span>Poster wall</span><span className="is-positive">Fri 8PM</span></footer>
      </div>
    );
  }

  if (type === 'opsSuite') {
    const modules = ['HR', 'TM', 'TS', 'FM'];
    return (
      <div className={`showcase-instrument showcase-instrument--ops-suite${runningClass}`} aria-hidden="true">
        <header><span>Ops command</span><strong>{8 + (tick % 4)} queues</strong></header>
        <div className="showcase-ops-suite-board">
          {modules.map((module, index) => (
            <i key={module} className={(index + tick) % 3 === 0 ? 'is-live' : ''}>
              <b>{module}</b>
              <span>{index + 2}</span>
            </i>
          ))}
        </div>
        <div className="showcase-ops-suite-lines"><span /><span /><span /></div>
        <footer><span>Approvals mapped</span><span className="is-positive">Ready</span></footer>
      </div>
    );
  }

  return (
    <div className={`showcase-instrument showcase-instrument--dispatch${runningClass}`} aria-hidden="true">
      <header><span>Mobile dispatch</span><strong>{4 + (tick % 3)} nearby</strong></header>
      <svg viewBox="0 0 180 96">
        <path className="dispatch-grid" d="M8 22H172M8 48H172M8 74H172M38 8V88M82 8V88M128 8V88" />
        <path className="dispatch-route" d="M18 76 C48 64 45 31 78 37 S116 78 160 20" />
        <circle cx="18" cy="76" r="4" /><circle className="dispatch-runner" cx="78" cy="37" r="4" /><circle cx="160" cy="20" r="4" />
      </svg>
      <footer><span>Route optimised</span><span className="is-positive">18 min</span></footer>
    </div>
  );
}

export function ShowcaseHub() {
  const rootRef = useRef<HTMLElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [archiveIndex, setArchiveIndex] = useState(0);
  const [heldProject, setHeldProject] = useState<number | null>(null);
  const [archiveTick, setArchiveTick] = useState(0);
  const activeProject = heldProject ?? archiveIndex;

  useEffect(() => {
    if (!motionEnabled) return;
    const cycleTimer = window.setInterval(() => setArchiveIndex((current) => (current + 1) % projects.length), 3800);
    const dataTimer = window.setInterval(() => setArchiveTick((current) => current + 1), 1550);
    return () => {
      window.clearInterval(cycleTimer);
      window.clearInterval(dataTimer);
    };
  }, [motionEnabled]);

  const moveProjectLight = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`);
  };

  useGSAP(() => {
    const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
    intro
      .fromTo('.showcase-nav', { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.45 })
      .fromTo('.showcase-hero .showcase-kicker', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45 }, '-=.2')
      .fromTo('.showcase-hero h1 span', { opacity: 0, yPercent: 110, rotate: 2 }, { opacity: 1, yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.09 }, '-=.2')
      .fromTo('.showcase-ops-report', { opacity: 0, scale: .9, x: 50, rotateY: -7 }, { opacity: 1, scale: 1, x: 0, rotateY: 0, duration: 1.05 }, '-=.8')
      .fromTo('.showcase-hero__foot', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.5 }, '-=.35');

    gsap.fromTo('.showcase-project', {
      opacity: 0, y: 42, scale: .965,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: .72,
      stagger: .09,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.showcase-projects', start: 'top 84%', once: true },
    });

    gsap.to('.showcase-ops-report', {
      yPercent: 10,
      rotateZ: 1.2,
      ease: 'none',
      scrollTrigger: { trigger: '.showcase-hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: rootRef });

  return (
    <main className={`showcase-hub ${motionEnabled ? 'is-motion-enabled' : 'is-motion-reduced'}`} ref={rootRef}>
      <a className="showcase-skip" href="#showcase-projects">Skip to projects</a>
      <nav className="showcase-nav" aria-label="Showcase navigation">
        <a className="showcase-brand" href="/"><span><img src="/showcase/doa-logo-mark-transparent.png" alt="" /></span> DOA SOLUTIONS</a>
        <p>Interactive systems archive <i /> 2026</p>
        <div><a href="/about-us/">About DOA</a><a className="showcase-nav__cta" href="mailto:doasolutions@outlook.com">Start a build ↗</a></div>
      </nav>

      <section className="showcase-hero">
        <div className="showcase-hero__type">
          <div className="showcase-hero__eyebrow"><p className="showcase-kicker">Selected digital systems / 01-08</p><p>SSM Registration No. 202503146827 (003736059-H)</p></div>
          <h1><span>Systems</span><span>you can</span><span><em>enter.</em></span></h1>
        </div>
        <OperationsReport enabled={motionEnabled} />
        <div className="showcase-hero__foot">
          <p>Eight working concepts. Each one explores a different industry, customer journey and operating model.</p>
          <div className="showcase-hero__controls">
            <button
              className="showcase-motion-toggle"
              type="button"
              aria-pressed={motionEnabled}
              onClick={() => setMotionEnabled((current) => !current)}
              title="Toggle motion"
            >
              <i aria-hidden="true" /> {motionEnabled ? 'Motion on' : 'Enable motion'}
            </button>
            <span>Explore <i aria-hidden="true">↓</i></span>
          </div>
        </div>
      </section>

      <section className="showcase-index" id="showcase-projects">
        <header><p className="showcase-kicker">The archive</p><p>Websites are the visible layer.<br />The workflow behind them is the real product.</p></header>
        <div className="showcase-projects">
          {projects.map((project, index) => {
            const isActive = index === activeProject;
            return (
            <a
              className={`showcase-project ${project.tone}${isActive ? ' is-active' : ''}`}
              href={project.href}
              key={project.name}
              onFocus={() => setHeldProject(index)}
              onBlur={() => setHeldProject(null)}
              onMouseEnter={() => setHeldProject(index)}
              onMouseLeave={() => setHeldProject(null)}
              onPointerMove={moveProjectLight}
            >
              <span className="showcase-project__signal" aria-hidden="true" />
              <div className="showcase-project__meta"><span>{project.index}</span><span>{project.sector}</span><span>Live concept <i /></span></div>
              <ProjectInstrument type={project.preview} active={isActive} tick={isActive ? archiveTick : 0} />
              <div className="showcase-project__body">
                <div><h2>{project.name}</h2><p>{project.statement}</p></div>
                <div className="showcase-project__systems">{project.systems.map((system) => <span key={system}>{system}</span>)}</div>
              </div>
              <div className="showcase-project__action"><span>Open system</span><i aria-hidden="true">↗</i></div>
            </a>
          );})}
        </div>
      </section>

      <section className="showcase-close">
        <p className="showcase-kicker">Beyond the demo</p>
        <h2>A concept becomes valuable when it fits the real operation.</h2>
        <div><p>DOA Solutions maps the workflow, designs the control layer, builds the modules and supports the team after launch.</p><a href="mailto:doasolutions@outlook.com">Build your system <span>↗</span></a></div>
      </section>
    </main>
  );
}
