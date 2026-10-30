'use client';

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Activity, BarChart3, CalendarDays, CheckCircle2, Plus, RotateCcw, UserRound } from 'lucide-react';

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
    image: '/showcase/images/rlz/Season2-Showcaseimage_alltogether.jpg',
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
    image: '/showcase/images/kki-staff-working.png',
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
    image: '/showcase/images/showcase-cards/takaful.jpg',
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
    image: '/showcase/images/showcase-cards/lindo.jpg',
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
    image: '/showcase/images/showcase-cards/inaz.jpg',
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
    image: '/showcase/images/showcase-cards/oya.jpg',
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
    image: '/showcase/images/folk-kofii/folk-cafe-interior.png',
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
    image: '/showcase/images/showcase-cards/r-yang.jpg',
  },
  {
    index: '09',
    name: 'Koperasi',
    href: '/showcase/koperasi/',
    sector: 'Cooperative / Member services',
    statement: 'An accessible member portal designed to make everyday cooperative services clear and easy.',
    systems: ['Member dashboard', 'Financing', 'Documents', 'Guided support'],
    tone: 'signal-green',
    preview: 'opsSuite',
    image: '/showcase/images/showcase-cards/koperasi.jpg',
  },
  {
    index: '10',
    name: 'AskPeguam',
    href: '/showcase/askpeguam/',
    sector: 'Legal services / Guided intake',
    statement: 'A paid AI conversation concept with clear scope and a separately quoted lawyer handoff.',
    systems: ['Service scope', 'Payment preview', 'AI chat', 'Lawyer handoff'],
    tone: 'signal-blue',
    preview: 'legalIntake',
    image: '/showcase/images/showcase-cards/askpeguam.jpg',
  },
  {
    index: '11',
    name: 'Ali PlusCycle',
    href: '/showcase/bicycle-pos/',
    sector: 'Bicycle retail / POS concept',
    statement: 'A three-package counter, workshop and purchasing concept for a bicycle shop.',
    systems: ['Point of sale', 'Workshop', 'Purchasing', 'Stock'],
    tone: 'signal-blue',
    preview: 'inventory',
    image: '/showcase/images/ali-pluscycle-banner.png',
  },
  {
    index: '12',
    name: 'LEAN Wellness',
    href: '/showcase/lean-wellness/',
    sector: 'Wellness / Website concepts',
    statement: 'Two interactive directions for LEAN: a refined studio refresh and an editorial LEAN 3.0 redesign.',
    systems: ['Terracotta Studio', 'LEAN 3.0', 'Credits', 'Schedule demo'],
    tone: 'signal-rose',
    preview: 'schedule',
    image: '/showcase/images/lean-wellness/packages-FOX_9781.jpg',
  },
  {
    index: '13',
    name: 'Unnamed travel project',
    href: '/showcase/unnamed-travel/',
    sector: 'Travel / Local culture',
    statement: 'An interactive Bali and Malaysia itinerary concept shaped around local knowledge, city life and slower discovery.',
    systems: ['Bali', 'Malaysia', 'City stories', 'Itinerary preview'],
    tone: 'signal-green',
    preview: 'travelStay',
    image: '/showcase/images/unnamed-travel/kl-city.png',
  },
  {
    index: '14',
    name: 'Fara Invitations',
    href: '/showcase/fara/',
    sector: 'Wedding stationery / Commerce concept',
    statement: 'A provisional invitation experience connecting design selection, personalisation, digital RSVP and a fictional order workflow.',
    systems: ['Invitation catalogue', 'Personalisation', 'Digital RSVP', 'Order demo'],
    tone: 'signal-green',
    preview: 'commerce',
    image: '/showcase/images/showcase-cards/fara-invitations.webp',
  },
].reverse();

const reportPhases = ['Syncing inputs', 'Reconciling records', 'Building report', 'Report issued'];

function OperationsReport({ enabled }: { enabled: boolean }) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const report = reportRef.current;
    if (!report || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '120px' });
    observer.observe(report);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || !visible || document.hidden) return;
    const phaseTimer = window.setInterval(() => setPhase((current) => (current + 1) % reportPhases.length), 2100);
    const metricTimer = window.setInterval(() => setPulse((current) => current + 1), 1450);
    return () => {
      window.clearInterval(phaseTimer);
      window.clearInterval(metricTimer);
    };
  }, [enabled, visible]);

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
    <div className="showcase-ops-report" aria-hidden="true" ref={reportRef}>
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

const sampleBookings = [
  { guest: 'Taylor Morgan', service: 'Initial consultation', time: '10:00 AM', source: 'Website' },
  { guest: 'Aisha Rahman', service: 'System discovery', time: '11:30 AM', source: 'Phone' },
  { guest: 'Daniel Wong', service: 'Workflow review', time: '2:00 PM', source: 'Referral' },
];

function PlayableControlRoom() {
  const [bookingCount, setBookingCount] = useState(0);
  const currentBooking = sampleBookings[Math.max(0, bookingCount - 1)];
  const addBooking = () => setBookingCount((current) => Math.min(sampleBookings.length, current + 1));
  const reset = () => setBookingCount(0);

  return (
    <section className="showcase-playground" aria-labelledby="showcase-playground-title">
      <div className="showcase-playground__head">
        <div><p className="showcase-kicker">Interactive demo — sample data</p><h2 id="showcase-playground-title">Play a booking through the control room.</h2></div>
        <div className="showcase-playground__actions">
          <button type="button" onClick={addBooking} disabled={bookingCount >= sampleBookings.length}><Plus size={17} /> Add sample booking</button>
          <button type="button" onClick={reset} disabled={bookingCount === 0}><RotateCcw size={16} /> Reset</button>
        </div>
      </div>
      <p className="showcase-playground__intro">Each click updates the same fictional booking across the calendar, customer record, activity feed and report. Nothing is sent or saved.</p>

      <div className={`showcase-control-room${bookingCount ? ' has-sample' : ''}`}>
        <div className="showcase-control-room__topline"><span><i /> DOA sample operations</span><span>Local demo state / No production write</span></div>
        <div className="showcase-control-room__metrics">
          <div><span><CalendarDays size={17} />Bookings today</span><strong>{12 + bookingCount}</strong><small>{bookingCount ? `+${bookingCount} sample` : 'Ready'}</small></div>
          <div><span><UserRound size={17} />Customer records</span><strong>{842 + bookingCount}</strong><small>Synchronised</small></div>
          <div><span><Activity size={17} />Workflow status</span><strong>{bookingCount ? 'Updated' : 'Idle'}</strong><small>{bookingCount ? 'All modules current' : 'Awaiting input'}</small></div>
          <div><span><BarChart3 size={17} />Reported value</span><strong>RM {(1240 + bookingCount * 180).toLocaleString()}</strong><small>Fictional total</small></div>
        </div>

        <div className="showcase-control-room__workspace">
          <article className="showcase-demo-panel showcase-demo-calendar">
            <header><div><CalendarDays size={18} /><span>Calendar</span></div><b>April 2026</b></header>
            <div className="showcase-demo-calendar__week" aria-label="Sample week">
              {[14, 15, 16, 17, 18].map((day) => <span className={day === 15 ? 'is-today' : ''} key={day}><small>{['MON','TUE','WED','THU','FRI'][day - 14]}</small><b>{day}</b></span>)}
            </div>
            <div className="showcase-demo-calendar__slots">
              <p><time>09:00</time><span>Team meeting</span></p>
              {bookingCount > 0 && <p className="is-new" key={`calendar-${bookingCount}`}><time>{currentBooking.time.replace(' AM','').replace(' PM','')}</time><span><b>{currentBooking.guest}</b>{currentBooking.service}</span></p>}
              <p><time>15:30</time><span>Client review</span></p>
            </div>
          </article>

          <article className="showcase-demo-panel showcase-demo-customer">
            <header><div><UserRound size={18} /><span>Customer record</span></div><b>{bookingCount ? 'Updated' : 'Waiting'}</b></header>
            <div className="showcase-demo-customer__profile" key={`customer-${bookingCount}`}>
              <span>{bookingCount ? currentBooking.guest.split(' ').map((part) => part[0]).join('') : 'TM'}</span>
              <div><strong>{bookingCount ? currentBooking.guest : 'Taylor Morgan'}</strong><small>Fictional customer</small></div>
            </div>
            <dl><div><dt>Service</dt><dd>{bookingCount ? currentBooking.service : 'Initial consultation'}</dd></div><div><dt>Source</dt><dd>{bookingCount ? currentBooking.source : 'Website'}</dd></div><div><dt>Status</dt><dd className={bookingCount ? 'is-confirmed' : ''}>{bookingCount ? 'Confirmed' : 'Ready'}</dd></div></dl>
          </article>

          <article className="showcase-demo-panel showcase-demo-activity">
            <header><div><Activity size={18} /><span>Activity feed</span></div><b>Live</b></header>
            <ol>
              {bookingCount > 0 && <li className="is-new" key={`activity-${bookingCount}`}><CheckCircle2 size={15} /><span><strong>{currentBooking.guest} added</strong><small>Calendar, customer and report updated · now</small></span></li>}
              <li><CheckCircle2 size={15} /><span><strong>Report prepared</strong><small>Weekly management summary · 08:42</small></span></li>
              <li><CheckCircle2 size={15} /><span><strong>Customer record reconciled</strong><small>Duplicate check passed · 08:31</small></span></li>
            </ol>
          </article>

          <article className="showcase-demo-panel showcase-demo-report">
            <header><div><BarChart3 size={18} /><span>Weekly report</span></div><b>{12 + bookingCount} bookings</b></header>
            <div className="showcase-demo-report__bars" aria-label={`Fictional report showing ${12 + bookingCount} bookings`}>
              {[32, 48, 65, 53, 78, 62, 88 + bookingCount * 3].map((height, index) => <i key={index} style={{ '--bar-height': `${height}%` } as CSSProperties} />)}
            </div>
            <div className="showcase-demo-report__foot"><span>Utilisation <b>{92 + bookingCount}%</b></span><span>Sample revenue <b>RM {(1240 + bookingCount * 180).toLocaleString()}</b></span></div>
          </article>
        </div>
        <p className="showcase-control-room__status" role="status" aria-live="polite">{bookingCount ? `${currentBooking.guest}'s sample booking updated across four modules.` : 'Ready to add a fictional sample booking.'}</p>
      </div>
    </section>
  );
}

export function ShowcaseHub() {
  const rootRef = useRef<HTMLElement>(null);
  const archiveRef = useRef<HTMLElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [archiveIndex, setArchiveIndex] = useState(0);
  const [heldProject, setHeldProject] = useState<number | null>(null);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const activeProject = heldProject ?? archiveIndex;

  useEffect(() => {
    const archive = archiveRef.current;
    if (!archive || !('IntersectionObserver' in window)) {
      setArchiveVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => setArchiveVisible(entry.isIntersecting), { rootMargin: '180px' });
    observer.observe(archive);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!motionEnabled || !archiveVisible || document.hidden) return;
    const cycleTimer = window.setInterval(() => setArchiveIndex((current) => (current + 1) % projects.length), 3800);
    return () => {
      window.clearInterval(cycleTimer);
    };
  }, [motionEnabled, archiveVisible]);

  const moveProjectLight = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType === 'touch') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    const x = localX / rect.width - .5;
    const y = localY / rect.height - .5;
    event.currentTarget.style.setProperty('--pointer-x', `${localX}px`);
    event.currentTarget.style.setProperty('--pointer-y', `${localY}px`);
    event.currentTarget.style.setProperty('--tilt-x', `${-y * 5}deg`);
    event.currentTarget.style.setProperty('--tilt-y', `${x * 7}deg`);
  };

  const resetProjectLight = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
    setHeldProject(null);
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
          <div className="showcase-hero__eyebrow"><p className="showcase-kicker">Selected digital systems / 01-{String(projects.length).padStart(2, '0')}</p><p>SSM Registration No. 202503146827 (003736059-H)</p></div>
          <h1><span>Systems</span><span>you can</span><span><em>enter.</em></span></h1>
        </div>
        <OperationsReport enabled={motionEnabled} />
        <div className="showcase-hero__foot">
          <p>{projects.length} interactive concepts. Each one explores a different industry, customer journey and operating model.</p>
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

      <PlayableControlRoom />

      <section className="showcase-index" id="showcase-projects" ref={archiveRef}>
        <header><p className="showcase-kicker">The archive / Newest first</p><p>Websites are the visible layer.<br />The workflow behind them is the real product.</p></header>
        <p className="showcase-index__hint">Showing three projects at a time <span aria-hidden="true">↓</span> Scroll inside the archive for more.</p>
        <div className="showcase-projects" tabIndex={0} role="region" aria-label="Project archive, newest first">
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
              onPointerMove={moveProjectLight}
              onPointerLeave={resetProjectLight}
            >
              <span className="showcase-project__signal" aria-hidden="true" />
              <div className="showcase-project__meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.sector}</span><span>Live concept <i /></span></div>
              <div className="showcase-project__image"><img src={project.image} alt={`${project.name} project preview`} loading={index < 3 ? 'eager' : 'lazy'} /></div>
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
