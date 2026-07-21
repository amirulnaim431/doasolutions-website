'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
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
  },
  {
    index: '02',
    name: 'KKI',
    href: '/showcase/kki/',
    sector: 'Fabric retail / Operations',
    statement: 'Customer ordering and staff operations connected from consultation to inventory.',
    systems: ['Order tracking', 'Consultation', 'Inventory', 'Staff tools'],
    tone: 'signal-copper',
  },
  {
    index: '03',
    name: 'H&N Takaful',
    href: '/showcase/H&N/',
    sector: 'Financial services / Agency',
    statement: 'A customer and agent operating layer for clearer protection decisions.',
    systems: ['Calculator', 'Policy review', 'Agent toolkit', 'Reporting'],
    tone: 'signal-blue',
  },
  {
    index: '04',
    name: 'Lindo Clinic',
    href: '/showcase/lindo-clinic/',
    sector: 'Aesthetic clinic / Experience',
    statement: 'Three sharply different digital directions for a premium clinical brand.',
    systems: ['Pearl Atelier', 'Clinical Prestige', 'Nocturne Elite'],
    tone: 'signal-rose',
  },
  {
    index: '05',
    name: 'Inaz Mobile Spa',
    href: '/showcase/inaz-mobile-spa/',
    sector: 'Wellness / Mobile operations',
    statement: 'A booking-to-therapist workflow designed for services that travel.',
    systems: ['Customer booking', 'E-KYC', 'Therapist board', 'Nearby slots'],
    tone: 'signal-amber',
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

export function ShowcaseHub() {
  const rootRef = useRef<HTMLElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);

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
          <div className="showcase-hero__eyebrow"><p className="showcase-kicker">Selected digital systems / 01—05</p><p>SSM Registration No. 202503146827 (003736059-H)</p></div>
          <h1><span>Systems</span><span>you can</span><span><em>enter.</em></span></h1>
        </div>
        <OperationsReport enabled={motionEnabled} />
        <div className="showcase-hero__foot">
          <p>Five working concepts. Each one explores a different industry, customer journey and operating model.</p>
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
          {projects.map((project) => (
            <a className={`showcase-project ${project.tone}`} href={project.href} key={project.name}>
              <div className="showcase-project__meta"><span>{project.index}</span><span>{project.sector}</span><span>Live concept <i /></span></div>
              <div className="showcase-project__body">
                <div><h2>{project.name}</h2><p>{project.statement}</p></div>
                <div className="showcase-project__systems">{project.systems.map((system) => <span key={system}>{system}</span>)}</div>
              </div>
              <div className="showcase-project__action"><span>Open system</span><i aria-hidden="true">↗</i></div>
              <div className="showcase-project__orb" aria-hidden="true"><i /><i /><i /></div>
            </a>
          ))}
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
