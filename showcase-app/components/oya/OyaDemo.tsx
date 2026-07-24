'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { companyInfo, amenities, faqs, gallery, testimonials } from './data/content';
import { travelPackages } from './data/packages';
import { roomAvailability, roomTypes } from './data/rooms';
import { copy } from './data/translations';
import type { Language, PackageCategory, RoomType, TravelPackage } from './types';

type PageKind =
  | 'home'
  | 'travel'
  | 'packages'
  | 'packageDetail'
  | 'umrahHajj'
  | 'inn'
  | 'rooms'
  | 'roomDetail'
  | 'plan'
  | 'summary'
  | 'about'
  | 'contact';

const base = '/oya';
const categories: Array<'All' | PackageCategory> = ['All', 'Malaysia', 'Indonesia', 'International', 'Islands', 'Umrah', 'Hajj Enquiry', 'Private Group'];
const months = ['Any month', 'Aug 2026', 'Sep 2026', 'Oct 2026', 'Dec 2026', 'Jan 2027', 'Feb 2027'];
const heroModes = {
  holiday: {
    label: 'Holiday',
    copy: 'Curated Malaysian, island, Indonesia, international and private group holidays.',
    href: `${base}/travel/packages`,
  },
  spiritual: {
    label: 'Umrah & Hajj',
    copy: 'Preparation-led spiritual journeys with consultation, documentation guidance and group care.',
    href: `${base}/umrah-hajj`,
  },
  stay: {
    label: 'Stay Near KLIA',
    copy: 'Comfortable OYA Inn stays for transit guests, early flights, families and travel groups.',
    href: `${base}/inn`,
  },
};

function money(value?: number) {
  return value ? `RM ${value.toLocaleString('en-MY')}` : 'Contact Us';
}

function estimateNights(checkIn: string, checkOut: string) {
  const start = new Date(checkIn).getTime();
  const end = new Date(checkOut).getTime();
  return Math.max(1, Math.round((end - start) / 86400000) || 1);
}

function cls(...items: Array<string | false | undefined>) {
  return items.filter(Boolean).join(' ');
}

function OyaLogo() {
  return (
    <Link href={base} className="oya-logo" aria-label="OYA home">
      <span>OYA</span>
      <small>Travel & Inn</small>
    </Link>
  );
}

function SectionHead({ eyebrow, title, copyText, tone = 'light' }: { eyebrow: string; title: string; copyText?: string; tone?: 'light' | 'dark' }) {
  return (
    <div className={cls('oya-section-head', tone === 'dark' && 'oya-section-head--dark')}>
      <p>{eyebrow}</p>
      <h2>{title}</h2>
      {copyText ? <span>{copyText}</span> : null}
    </div>
  );
}

function DemoLabel() {
  return <span className="oya-demo-label">Demo package</span>;
}

function OyaMediaPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [status, setStatus] = useState('Ready');

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      await audio.play();
      setIsPlaying(true);
      setStatus('Playing');
    } catch {
      setStatus('Tap play to start');
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setStatus('Stopped');
  };

  if (isClosed) return null;

  return (
    <aside className={cls('oya-media-player', isMinimized && 'is-minimized')} aria-label="OYA demo music player">
      <audio
        ref={audioRef}
        src="/showcase/audio/oasis-stand-by-me-demo.mp3"
        preload="metadata"
        onEnded={() => {
          setIsPlaying(false);
          setStatus('Finished');
        }}
      />
      <div className="oya-media-titlebar">
        <span>OYA Media Player</span>
        <div>
          <button type="button" onClick={() => setIsMinimized(!isMinimized)} aria-label={isMinimized ? 'Restore media player' : 'Minimize media player'}>
            {isMinimized ? '□' : '_'}
          </button>
          <button type="button" onClick={() => { stop(); setIsClosed(true); }} aria-label="Close media player">x</button>
        </div>
      </div>
      <div className="oya-media-body">
        <div className="oya-media-display">
          <span className={isPlaying ? 'is-live' : ''} />
          <div>
            <small>Now Playing</small>
            <p><b>oasis - standby me.mp3</b><b>oasis - standby me.mp3</b></p>
          </div>
        </div>
        <div className="oya-media-controls">
          <button type="button" onClick={play} disabled={isPlaying} aria-label="Play Stand By Me">Play</button>
          <button type="button" onClick={stop} aria-label="Stop playback">Stop</button>
          <span>{status}</span>
        </div>
      </div>
    </aside>
  );
}

function PackageCard({ item, compact = false, onFavourite }: { item: TravelPackage; compact?: boolean; onFavourite?: (title: string) => void }) {
  return (
    <article className={cls('oya-card oya-package-card', compact && 'oya-package-card--compact')}>
      <div className="oya-image">
        <img src={item.image} alt={`${item.title} sample travel visual`} />
        <DemoLabel />
        <button type="button" className="oya-fav" onClick={() => onFavourite?.(item.title)} aria-label={`Favourite ${item.title}`}>
          Star
        </button>
      </div>
      <div className="oya-card-body">
        <div className="oya-card-meta">
          <span>{item.category}</span>
          <span>{item.destination}</span>
        </div>
        <h3>{item.title}</h3>
        <p>{item.summary}</p>
        <div className="oya-spec-row">
          <span>{item.duration}</span>
          <span>{item.departureDates[0]?.date ?? 'Flexible'}</span>
          <span>{item.enquiryOnly ? 'Enquiry only' : `${item.seatsRemaining ?? 0} seats`}</span>
        </div>
        <div className="oya-price-row">
          <strong>{item.priceType === 'contact' ? 'Contact Us' : `From ${money(item.startingPrice)}`}</strong>
          <Link href={`${base}/travel/packages/${item.slug}`}>View Package</Link>
        </div>
      </div>
    </article>
  );
}

function RoomCard({ room }: { room: RoomType }) {
  return (
    <article className="oya-card oya-room-card">
      <img src={room.gallery[0]} alt={`${room.name} sample room visual`} />
      <div className="oya-card-body">
        <span className="oya-demo-label">Demo room</span>
        <h3>{room.name}</h3>
        <p>{room.summary}</p>
        <div className="oya-spec-row">
          <span>{room.capacity} guests</span>
          <span>{room.bedType}</span>
        </div>
        <p className="oya-amenity-list">{room.amenities.slice(0, 4).join(' / ')}</p>
        <div className="oya-price-row">
          <strong>From RM {room.demoNightlyRate}/night</strong>
          <Link href={`${base}/inn/rooms/${room.slug}`}>Room details</Link>
        </div>
      </div>
    </article>
  );
}

function Layout({ page, children }: { page: PageKind; children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = copy[language];
  const nav = [
    [t.home, base],
    [t.packages, `${base}/travel/packages`],
    [t.umrah, `${base}/umrah-hajj`],
    [t.inn, `${base}/inn`],
    [t.plan, `${base}/plan-your-trip`],
    [t.about, `${base}/about`],
    [t.contact, `${base}/contact`],
  ];
  return (
    <main className="oya-site">
      <a className="oya-skip" href="#oya-main">Skip to content</a>
      <OyaMediaPlayer />
      <header className="oya-header">
        <OyaLogo />
        <nav className="oya-nav" aria-label="OYA navigation">
          {nav.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="oya-header-actions">
          <div className="oya-lang" aria-label="Language selector">
            <button type="button" onClick={() => setLanguage('bm')} className={language === 'bm' ? 'is-active' : ''}>BM</button>
            <button type="button" onClick={() => setLanguage('en')} className={language === 'en' ? 'is-active' : ''}>EN</button>
          </div>
          <Link className="oya-btn oya-btn--gold" href={`${base}/plan-your-trip`}>{t.enquire}</Link>
          <button type="button" className="oya-menu-button" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-controls="oya-mobile-menu">
            Menu
          </button>
        </div>
        {mobileOpen ? (
          <div id="oya-mobile-menu" className="oya-mobile-menu">
            {nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>)}
          </div>
        ) : null}
      </header>
      <div className="oya-division-switch" aria-label="OYA divisions">
        <Link className={page === 'inn' || page === 'rooms' || page === 'roomDetail' ? 'is-active' : ''} href={`${base}/travel`}>OYA Travel</Link>
        <Link className={page === 'inn' || page === 'rooms' || page === 'roomDetail' ? 'is-active' : ''} href={`${base}/inn`}>OYA Inn</Link>
      </div>
      <div id="oya-main">{children}</div>
      <Link className="oya-sticky-cta" href={`${base}/plan-your-trip`}>{t.enquire}</Link>
      <Footer />
    </main>
  );
}

function Footer() {
  return (
    <footer className="oya-footer">
      <div>
        <OyaLogo />
        <p>Your Journey. Your Stay. One OYA.</p>
        <small>MOTAC Licence: {companyInfo.motacLicence}</small>
      </div>
      <div>
        <h3>OYA Travel</h3>
        <Link href={`${base}/travel/packages`}>Packages</Link>
        <Link href={`${base}/umrah-hajj`}>Umrah & Hajj</Link>
        <Link href={`${base}/plan-your-trip`}>Private groups</Link>
      </div>
      <div>
        <h3>OYA Inn</h3>
        <Link href={`${base}/inn`}>KLIA stay</Link>
        <Link href={`${base}/inn/rooms`}>Rooms</Link>
        <Link href={`${base}/contact`}>Reservation enquiry</Link>
      </div>
      <div>
        <h3>Contact</h3>
        <span>{companyInfo.whatsapp}</span>
        <span>{companyInfo.email}</span>
        <Link href={`${base}/contact`}>Privacy / Terms / Booking conditions</Link>
        <small>This is a demo website. Prices, dates, hotels, flights, rooms and testimonials are sample content only.</small>
      </div>
    </footer>
  );
}

function Finder() {
  const [service, setService] = useState('Holiday');
  const [query, setQuery] = useState('');
  const [month, setMonth] = useState('Any month');
  const [travellers, setTravellers] = useState('2 Adults');
  const [result, setResult] = useState<TravelPackage[] | null>(null);
  const matches = () => {
    const next = travelPackages.filter((item) => {
      const serviceMatch = service === 'Holiday' ? !['Umrah', 'Hajj Enquiry'].includes(item.category) : service === 'Umrah & Hajj' ? ['Umrah', 'Hajj Enquiry'].includes(item.category) : true;
      const queryMatch = !query || `${item.title} ${item.destination} ${item.category}`.toLowerCase().includes(query.toLowerCase());
      const monthMatch = month === 'Any month' || item.departureDates.some((date) => date.date.includes(month.split(' ')[0]));
      return serviceMatch && queryMatch && monthMatch;
    });
    setResult(next);
  };
  return (
    <section className="oya-finder">
      <h2>Find Your Journey</h2>
      <div className="oya-form-grid">
        <label>Service type<select value={service} onChange={(e) => setService(e.target.value)}><option>Holiday</option><option>Umrah & Hajj</option><option>OYA Inn</option><option>Travel + Inn</option></select></label>
        <label>Destination or package<input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Bali, Redang, Umrah" /></label>
        <label>Preferred month<select value={month} onChange={(e) => setMonth(e.target.value)}>{months.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label>Number of travellers<select value={travellers} onChange={(e) => setTravellers(e.target.value)}><option>1 Adult</option><option>2 Adults</option><option>Family 4</option><option>Group 10+</option></select></label>
        <label>Departure location<select><option>Kuala Lumpur (KUL)</option><option>Penang</option><option>Johor Bahru</option><option>Custom</option></select></label>
        <button type="button" onClick={matches}>Search</button>
      </div>
      {result ? (
        <div className="oya-results" aria-live="polite">
          <strong>{result.length ? `${result.length} demo match(es) for ${travellers}` : 'No demo packages matched.'}</strong>
          {result.slice(0, 3).map((item) => <Link key={item.slug} href={`${base}/travel/packages/${item.slug}`}>{item.title} - {item.duration}</Link>)}
        </div>
      ) : null}
    </section>
  );
}

function HomePage() {
  const [mode, setMode] = useState<keyof typeof heroModes>('holiday');
  const [toast, setToast] = useState('');
  const hero = heroModes[mode];
  return (
    <Layout page="home">
      <section className="oya-hero">
        <img src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1800&q=85" alt="Sample OYA journey visual combining travel and spiritual preparation" />
        <div className="oya-hero-overlay" />
        <div className="oya-hero-content">
          <p>OYA Travel + OYA Inn</p>
          <h1>{copy.en.heroTitle}</h1>
          <span>{copy.en.heroCopy}</span>
          <div className="oya-hero-actions">
            <Link className="oya-btn oya-btn--gold" href={hero.href}>Explore Packages</Link>
            <Link className="oya-btn oya-btn--ghost" href={`${base}/inn`}>Book OYA Inn</Link>
          </div>
          <div className="oya-mode-tabs">
            {(Object.keys(heroModes) as Array<keyof typeof heroModes>).map((key) => (
              <button key={key} type="button" onClick={() => setMode(key)} className={mode === key ? 'is-active' : ''}>
                {heroModes[key].label}
              </button>
            ))}
          </div>
          <p className="oya-mode-copy">{hero.copy}</p>
        </div>
      </section>
      <Finder />
      <section className="oya-section">
        <SectionHead eyebrow="One parent brand" title="OYA takes care of the journey and the stay." copyText="Travel planning, spiritual preparation and KLIA accommodation are presented as one connected customer experience." />
        <div className="oya-gateways">
          <Link href={`${base}/travel`} className="oya-gateway oya-gateway--travel">
            <span>OYA Travel</span>
            <h3>Curated journeys across Malaysia and beyond.</h3>
            <b>Explore Travel</b>
          </Link>
          <Link href={`${base}/inn`} className="oya-gateway oya-gateway--inn">
            <span>OYA Inn</span>
            <h3>Comfort and convenience near KLIA.</h3>
            <b>View Rooms</b>
          </Link>
        </div>
      </section>
      <section className="oya-section">
        <SectionHead eyebrow="Featured journeys" title="Balanced travel, spiritual and private group options." />
        <div className="oya-grid oya-grid--3">
          {travelPackages.filter((item) => item.featured).slice(0, 6).map((item) => <PackageCard key={item.slug} item={item} onFavourite={(title) => { setToast(`${title} added to demo favourites.`); setTimeout(() => setToast(''), 2500); }} />)}
        </div>
      </section>
      <SpiritualSection />
      <InnPreview />
      <ConnectedTimeline />
      <TrustSection />
      <TestimonialsGallery />
      <FinalCta />
      {toast ? <div className="oya-toast" role="status">{toast}</div> : null}
    </Layout>
  );
}

function SpiritualSection() {
  return (
    <section className="oya-section oya-section--green">
      <SectionHead tone="dark" eyebrow="Umrah & Hajj" title="A meaningful journey, prepared with care." copyText="Umrah packages and Hajj interest are handled through consultation, readiness, documentation and group support." />
      <div className="oya-feature-list">
        {['Umrah packages', 'Hajj travel enquiry', 'Pre-departure guidance', 'Course or briefing information', 'Documentation checklist', 'Group leader/mutawwif placeholder', 'Accommodation and transport overview', 'Family and elderly traveller support'].map((item) => <span key={item}>{item}</span>)}
      </div>
      <Link className="oya-btn oya-btn--gold" href={`${base}/umrah-hajj`}>Speak to Our Team</Link>
    </section>
  );
}

function InnPreview() {
  return (
    <section className="oya-section oya-section--cream">
      <SectionHead eyebrow="OYA Inn" title="Rest closer to your journey." copyText="A practical accommodation choice near KLIA for transit passengers, early departures, late arrivals, families, pilgrims and longer stays where applicable." />
      <div className="oya-grid oya-grid--4">
        {roomTypes.map((room) => <RoomCard key={room.slug} room={room} />)}
      </div>
    </section>
  );
}

function ConnectedTimeline() {
  const steps = ['Choose your journey', 'Speak with an OYA travel consultant', 'Confirm documents and arrangements', 'Stay at OYA Inn if needed', 'Depart with confidence', 'Receive continued travel support'];
  return (
    <section className="oya-section">
      <SectionHead eyebrow="Connected OYA experience" title="From first enquiry to departure support." />
      <div className="oya-timeline">
        {steps.map((step, index) => <div key={step}><b>{index + 1}</b><span>{step}</span></div>)}
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="oya-section oya-trust">
      {['Licensed travel operator', 'Personal consultation', 'Group coordination', 'Travel and stay in one place', 'Support before departure', 'Carefully arranged itineraries'].map((item) => <div key={item}>{item}</div>)}
    </section>
  );
}

function TestimonialsGallery() {
  return (
    <section className="oya-section">
      <SectionHead eyebrow="Sample testimonials" title="Demo feedback across OYA Travel and OYA Inn." />
      <div className="oya-grid oya-grid--4">{testimonials.map((item) => <article className="oya-testimonial" key={item.id}><span>{item.type}</span><h3>{item.title}</h3><p>{item.body}</p><small>{item.name} - demo content</small></article>)}</div>
      <SectionHead eyebrow="OYA Moments" title="Gallery placeholders, not Instagram embeds." />
      <div className="oya-gallery">{gallery.map((item) => <figure key={item.title}><img src={item.image} alt={`${item.title} sample OYA moment`} /><figcaption>{item.title}</figcaption></figure>)}</div>
      <div className="oya-social-row">
        <Link href={`${base}/contact`}>{companyInfo.travelHandle}</Link>
        <Link href={`${base}/contact`}>{companyInfo.innHandle}</Link>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="oya-final">
      <h2>Where will OYA take you next?</h2>
      <div><Link className="oya-btn oya-btn--gold" href={`${base}/plan-your-trip`}>Plan My Journey</Link><Link className="oya-btn oya-btn--ghost" href={`${base}/contact`}>Chat on WhatsApp</Link></div>
    </section>
  );
}

function PackageListing() {
  const [category, setCategory] = useState<'All' | PackageCategory>('All');
  const [destination, setDestination] = useState('');
  const [month, setMonth] = useState('Any month');
  const [budget, setBudget] = useState('Any budget');
  const [style, setStyle] = useState('Any style');
  const [sort, setSort] = useState('recommended');
  const [toast, setToast] = useState('');
  const filtered = useMemo(() => {
    const result = travelPackages.filter((item) => {
      const cat = category === 'All' || item.category === category || item.tags.includes(category);
      const dest = !destination || `${item.destination} ${item.title}`.toLowerCase().includes(destination.toLowerCase());
      const mon = month === 'Any month' || item.departureDates.some((date) => date.date.includes(month.split(' ')[0]));
      const bud = budget === 'Any budget' || (budget === 'Under RM 1,500' ? (item.startingPrice ?? 999999) < 1500 : (item.startingPrice ?? 0) >= 1500);
      const sty = style === 'Any style' || item.tags.join(' ').toLowerCase().includes(style.toLowerCase());
      return cat && dest && mon && bud && sty;
    });
    return [...result].sort((a, b) => sort === 'price' ? (a.startingPrice ?? 999999) - (b.startingPrice ?? 999999) : sort === 'duration' ? a.duration.localeCompare(b.duration) : Number(b.featured) - Number(a.featured));
  }, [category, destination, month, budget, style, sort]);
  return (
    <Layout page="packages">
      <PageHero title="Journeys for every kind of traveller." copyText="Filter balanced demo packages across Malaysia, Indonesia, islands, Umrah, Hajj interest and private groups." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" />
      <section className="oya-section">
        <div className="oya-filter-bar">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={category === item ? 'is-active' : ''}>{item}</button>)}</div>
        <div className="oya-form-grid oya-filter-form">
          <label>Destination<input value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Search destination" /></label>
          <label>Month<select value={month} onChange={(e) => setMonth(e.target.value)}>{months.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label>Duration<select><option>Any duration</option><option>3D2N</option><option>4D3N</option><option>12D10N</option></select></label>
          <label>Budget<select value={budget} onChange={(e) => setBudget(e.target.value)}><option>Any budget</option><option>Under RM 1,500</option><option>RM 1,500 and above</option></select></label>
          <label>Travel style<select value={style} onChange={(e) => setStyle(e.target.value)}><option>Any style</option><option>Family</option><option>Island</option><option>Spiritual</option><option>Private Group</option></select></label>
          <label>Departure location<select><option>Kuala Lumpur</option><option>Penang</option><option>Johor Bahru</option></select></label>
          <label>Sort by<select value={sort} onChange={(e) => setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price">Price</option><option value="duration">Duration</option></select></label>
        </div>
        {filtered.length ? <div className="oya-grid oya-grid--3">{filtered.map((item) => <PackageCard key={item.slug} item={item} onFavourite={(title) => { setToast(`${title} added to demo favourites.`); setTimeout(() => setToast(''), 2500); }} />)}</div> : <EmptyState />}
      </section>
      {toast ? <div className="oya-toast" role="status">{toast}</div> : null}
    </Layout>
  );
}

function PageHero({ title, copyText, image, green = false }: { title: string; copyText: string; image: string; green?: boolean }) {
  return (
    <section className={cls('oya-page-hero', green && 'oya-page-hero--green')}>
      <img src={image} alt={`${title} sample hero visual`} />
      <div><p>OYA demo</p><h1>{title}</h1><span>{copyText}</span></div>
    </section>
  );
}

function EmptyState() {
  return <div className="oya-empty"><h3>No demo results found.</h3><p>Try a different category, month or budget. This empty state is intentional for the demo.</p></div>;
}

function PackageDetail({ item }: { item?: TravelPackage }) {
  const pkg = item ?? travelPackages[0];
  const [openDay, setOpenDay] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [extras, setExtras] = useState({ pre: false, post: false, transfer: false, insurance: false, upgrade: false });
  const extrasTotal = (extras.pre ? 180 : 0) + (extras.post ? 180 : 0) + (extras.transfer ? 90 : 0) + (extras.insurance ? 120 : 0) + (extras.upgrade ? 450 : 0);
  const travellerTotal = (pkg.startingPrice ?? 0) * adults + (pkg.startingPrice ? Math.round(pkg.startingPrice * 0.65) * children : 0);
  const total = pkg.priceType === 'contact' ? 0 : travellerTotal + extrasTotal;
  return (
    <Layout page="packageDetail">
      <section className="oya-detail-hero">
        <img src={pkg.image} alt={`${pkg.title} sample package visual`} />
        <div>
          <span>{pkg.category}</span>
          <h1>{pkg.title}</h1>
          <p>{pkg.description}</p>
          <div className="oya-spec-row"><b>{pkg.destination}</b><b>{pkg.duration}</b><b>{pkg.enquiryOnly ? 'Subject to confirmation' : `${pkg.seatsRemaining ?? 0} seats remaining`}</b></div>
          <div className="oya-hero-actions"><Link className="oya-btn oya-btn--gold" href={`${base}/plan-your-trip`}>Enquire Now</Link><Link className="oya-btn oya-btn--ghost" href={`${base}/contact`}>WhatsApp Us</Link></div>
        </div>
      </section>
      <section className="oya-section oya-detail-grid">
        <div>
          <SectionHead eyebrow="Overview" title={`${pkg.duration} in ${pkg.destination}`} copyText={pkg.summary} />
          <div className="oya-tabs">
            {['Overview', 'Itinerary', 'Inclusions', 'Exclusions', 'Accommodation', 'Transport', 'Important notes', 'FAQ'].map((item) => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`}>{item}</a>)}
          </div>
          <div id="itinerary" className="oya-accordion">
            {pkg.itinerary.map((day) => (
              <button key={day.day} type="button" onClick={() => setOpenDay(openDay === day.day ? 0 : day.day)} className={openDay === day.day ? 'is-active' : ''}>
                <b>Day {day.day}: {day.title}</b>
                {openDay === day.day ? <span>{day.details}</span> : null}
              </button>
            ))}
          </div>
          <InfoBlocks pkg={pkg} />
        </div>
        <aside className="oya-estimator">
          <h2>Build Your Trip</h2>
          <label>Adults<input type="number" min={1} value={adults} onChange={(e) => setAdults(Number(e.target.value))} /></label>
          <label>Children<input type="number" min={0} value={children} onChange={(e) => setChildren(Number(e.target.value))} /></label>
          <label>Infants<input type="number" min={0} value={infants} onChange={(e) => setInfants(Number(e.target.value))} /></label>
          {Object.entries({ pre: 'OYA Inn pre-departure stay', post: 'OYA Inn post-arrival stay', transfer: 'Airport transfer', insurance: 'Travel insurance enquiry', upgrade: 'Private room upgrade' }).map(([key, label]) => (
            <label key={key} className="oya-check"><input type="checkbox" checked={extras[key as keyof typeof extras]} onChange={(e) => setExtras({ ...extras, [key]: e.target.checked })} />{label}</label>
          ))}
          <strong>{pkg.priceType === 'contact' ? 'Contact for estimate' : `Estimated ${money(total)}`}</strong>
          <small>{adults} adults, {children} children, {infants} infants. Subject to confirmation.</small>
          <Link className="oya-btn oya-btn--gold" href={`${base}/plan-your-trip`}>Enquire This Trip</Link>
        </aside>
      </section>
    </Layout>
  );
}

function InfoBlocks({ pkg }: { pkg: TravelPackage }) {
  const blocks = [
    ['Inclusions', pkg.inclusions],
    ['Exclusions', pkg.exclusions],
    ['Accommodation', [pkg.accommodation]],
    ['Flight/transport information', [pkg.transport]],
    ['Important notes', ['All prices, dates, seats, hotels and flight details are sample demo content.', 'Final package details are subject to confirmation by OYA.']],
  ];
  if (pkg.category === 'Umrah') blocks.push(['Umrah readiness notes', ['Religious briefing/course placeholder', 'Documentation preparation', 'Ziarah overview', 'Group guidance', 'Neutral readiness notes only']]);
  return <div className="oya-info-blocks">{blocks.map(([title, list]) => <article key={title as string}><h3>{title as string}</h3>{(list as string[]).map((item) => <p key={item}>{item}</p>)}</article>)}</div>;
}

function UmrahHajjPage() {
  const [checklist, setChecklist] = useState(false);
  return (
    <Layout page="umrahHajj">
      <PageHero green title="Journey to the Holy Land with preparation, guidance and care." copyText="From first consultation to briefing and optional OYA Inn stay, this page keeps Hajj interest subject to confirmation." image="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1800&q=85" />
      <section className="oya-section">
        <div className="oya-hero-actions"><Link className="oya-btn oya-btn--gold" href={`${base}/travel/packages?category=Umrah`}>Explore Umrah Packages</Link><Link className="oya-btn oya-btn--ghost" href={`${base}/plan-your-trip`}>Register Hajj Interest</Link><Link className="oya-btn oya-btn--ghost" href={`${base}/contact`}>Speak to an OYA Consultant</Link></div>
        <ConnectedTimeline />
        <div className="oya-grid oya-grid--2">
          <article className="oya-card oya-card-body"><h3>Required-document checklist</h3><p>Passport validity, vaccination/readiness notes, identification documents, photos and package forms. Exact requirements must be confirmed by OYA.</p><button type="button" onClick={() => setChecklist(true)}>Generate demo checklist</button></article>
          <article className="oya-card oya-card-body"><h3>Course and briefing schedule</h3><p>Sample pre-departure briefing dates with group coordination and family traveller support.</p><Link href={`${base}/plan-your-trip`}>Request Consultation</Link></article>
        </div>
        {checklist ? <pre className="oya-print">OYA DEMO CHECKLIST\n- Passport copy\n- Contact details\n- Health/readiness notes\n- Package form\n- Optional OYA Inn stay\n\nDemo only. Confirm official requirements with OYA.</pre> : null}
        <PackageListingInline category="Umrah" />
        <FaqSection />
      </section>
    </Layout>
  );
}

function PackageListingInline({ category }: { category: PackageCategory }) {
  return <div className="oya-grid oya-grid--3">{travelPackages.filter((item) => item.category === category || (category === 'Umrah' && item.category === 'Hajj Enquiry')).map((item) => <PackageCard key={item.slug} item={item} compact />)}</div>;
}

function InnPage() {
  const [checkIn, setCheckIn] = useState('2026-08-14');
  const [checkOut, setCheckOut] = useState('2026-08-15');
  const [guests, setGuests] = useState(2);
  const [rooms, setRooms] = useState(1);
  const [availability, setAvailability] = useState('');
  return (
    <Layout page="inn">
      <PageHero title="Comfort, moments from your next journey." copyText="A practical and welcoming stay near KLIA for transit passengers, families, groups and travellers preparing for departure." image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1800&q=85" />
      <section className="oya-finder">
        <h2>Check OYA Inn Availability</h2>
        <div className="oya-form-grid">
          <label>Check-in<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label>
          <label>Check-out<input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label>
          <label>Guests<input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></label>
          <label>Rooms<input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} /></label>
          <button type="button" onClick={() => setAvailability(`${roomAvailability.reduce((sum, item) => sum + item.available, 0)} demo rooms available for ${guests} guests and ${rooms} room(s).`)}>Check availability</button>
        </div>
        {availability ? <div className="oya-results">{availability}</div> : null}
      </section>
      <InnPreview />
      <section className="oya-section"><SectionHead eyebrow="Why stay at OYA Inn" title="Near KLIA, connected to the wider OYA journey." /><div className="oya-feature-list">{amenities.map((item) => <span key={item}>{item}</span>)}</div><TestimonialsGallery /><FaqSection /></section>
    </Layout>
  );
}

function RoomsPage() {
  return <Layout page="rooms"><PageHero title="Our Rooms" copyText="Choose the room that fits your journey." image="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1800&q=85" /><section className="oya-section"><div className="oya-grid oya-grid--2">{roomTypes.map((room) => <RoomCard key={room.slug} room={room} />)}</div></section></Layout>;
}

function RoomDetail({ room }: { room?: RoomType }) {
  const activeRoom = room ?? roomTypes[0];
  const [checkIn, setCheckIn] = useState('2026-08-14');
  const [checkOut, setCheckOut] = useState('2026-08-15');
  const [guests, setGuests] = useState(activeRoom.capacity);
  const [roomCount, setRoomCount] = useState(1);
  const nights = estimateNights(checkIn, checkOut);
  const total = activeRoom.demoNightlyRate * nights * roomCount;
  return (
    <Layout page="roomDetail">
      <section className="oya-detail-hero">
        <img src={activeRoom.gallery[0]} alt={`${activeRoom.name} sample room`} />
        <div><span>OYA Inn demo room</span><h1>{activeRoom.name}</h1><p>{activeRoom.summary}</p><div className="oya-spec-row"><b>{activeRoom.capacity} guests</b><b>{activeRoom.bedType}</b><b>{activeRoom.roomSize}</b></div></div>
      </section>
      <section className="oya-section oya-detail-grid">
        <div><div className="oya-gallery">{activeRoom.gallery.map((image) => <figure key={image}><img src={image} alt={`${activeRoom.name} gallery sample`} /><figcaption>{activeRoom.name}</figcaption></figure>)}</div><InfoRoom room={activeRoom} /></div>
        <aside className="oya-estimator"><h2>Check Availability</h2><label>Check-in<input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} /></label><label>Check-out<input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} /></label><label>Guests<input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} /></label><label>Rooms<input type="number" min={1} value={roomCount} onChange={(e) => setRoomCount(Number(e.target.value))} /></label><strong>Estimated RM {total}</strong><small>{nights} night(s), {guests} guest(s). Subject to confirmation.</small><Link className="oya-btn oya-btn--gold" href={`${base}/booking-summary`}>Reserve / Enquire</Link></aside>
      </section>
    </Layout>
  );
}

function InfoRoom({ room }: { room: RoomType }) {
  return <div className="oya-info-blocks"><article><h3>Amenities</h3>{room.amenities.map((item) => <p key={item}>{item}</p>)}</article><article><h3>Policies</h3>{room.policies.map((item) => <p key={item}>{item}</p>)}</article></div>;
}

function PlanPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState('');
  const [form, setForm] = useState({ service: 'Holiday', destination: 'Redang Island Escape', dates: 'Aug 2026', travellers: '2', departure: 'Kuala Lumpur', budget: 'RM 2,000 - RM 5,000', group: 'Group', assistance: '', needInn: 'Before departure', room: 'Standard Queen', nights: '1', name: '', phone: '', email: '', method: 'WhatsApp', notes: '', consent: false });
  const ref = 'OYA-DEMO-24001';
  const set = (key: keyof typeof form, value: string | boolean) => setForm({ ...form, [key]: value });
  const next = () => {
    if (step === 4 && (!form.name || !form.phone || !form.email || !form.consent)) {
      setErrors('Name, phone, email and consent are required for this demo review.');
      return;
    }
    setErrors('');
    setStep(Math.min(5, step + 1));
  };
  if (submitted) return <Layout page="plan"><section className="oya-section oya-success"><h1>Your Enquiry Has Been Received.</h1><p>Reference: {ref}. This is a demo success screen. No backend transmission occurred.</p><pre>{`Hi OYA, I would like to enquire.\nReference: ${ref}\nService: ${form.service}\nDestination: ${form.destination}\nTravellers: ${form.travellers}\nNeed OYA Inn: ${form.needInn}`}</pre><Link className="oya-btn oya-btn--gold" href={`${base}/booking-summary`}>View Booking Summary</Link></section></Layout>;
  return (
    <Layout page="plan">
      <section className="oya-section oya-plan">
        <SectionHead eyebrow="Plan Your Trip" title="What can we help you plan?" />
        <div className="oya-progress">{[1, 2, 3, 4, 5].map((item) => <button key={item} type="button" onClick={() => setStep(item)} className={step === item ? 'is-active' : ''}>{item}</button>)}</div>
        {step === 1 && <div className="oya-choice-grid">{['Holiday', 'Umrah', 'Hajj enquiry', 'OYA Inn', 'Travel + Inn'].map((item) => <button key={item} type="button" onClick={() => set('service', item)} className={form.service === item ? 'is-active' : ''}>{item}</button>)}</div>}
        {step === 2 && <div className="oya-form-grid"><label>Destination<input value={form.destination} onChange={(e) => set('destination', e.target.value)} /></label><label>Preferred dates<input value={form.dates} onChange={(e) => set('dates', e.target.value)} /></label><label>Travellers<input type="number" value={form.travellers} onChange={(e) => set('travellers', e.target.value)} /></label><label>Departure city<input value={form.departure} onChange={(e) => set('departure', e.target.value)} /></label><label>Budget range<input value={form.budget} onChange={(e) => set('budget', e.target.value)} /></label><label>Private or group<select value={form.group} onChange={(e) => set('group', e.target.value)}><option>Group</option><option>Private</option></select></label><label>Special assistance<textarea value={form.assistance} onChange={(e) => set('assistance', e.target.value)} /></label></div>}
        {step === 3 && <div className="oya-form-grid"><label>Need OYA Inn?<select value={form.needInn} onChange={(e) => set('needInn', e.target.value)}><option>No</option><option>Before departure</option><option>After arrival</option><option>Both</option></select></label><label>Room type<select value={form.room} onChange={(e) => set('room', e.target.value)}>{roomTypes.map((room) => <option key={room.slug}>{room.name}</option>)}</select></label><label>Number of nights<input type="number" min={0} value={form.nights} onChange={(e) => set('nights', e.target.value)} /></label></div>}
        {step === 4 && <div className="oya-form-grid"><label>Full name<input value={form.name} onChange={(e) => set('name', e.target.value)} /></label><label>Phone<input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></label><label>Email<input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label><label>Preferred contact method<select value={form.method} onChange={(e) => set('method', e.target.value)}><option>WhatsApp</option><option>Email</option><option>Phone call</option></select></label><label>Additional notes<textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} /></label><label className="oya-check"><input type="checkbox" checked={Boolean(form.consent)} onChange={(e) => set('consent', e.target.checked)} />I agree to be contacted for this demo enquiry.</label></div>}
        {step === 5 && <SummaryCard refCode={ref} form={form} />}
        {errors ? <p className="oya-error" role="alert">{errors}</p> : null}
        <div className="oya-plan-actions"><button type="button" onClick={() => setStep(Math.max(1, step - 1))}>Back</button>{step < 5 ? <button type="button" onClick={next}>Next</button> : <button type="button" onClick={() => setSubmitted(true)}>Submit Enquiry</button>}</div>
      </section>
    </Layout>
  );
}

function SummaryCard({ refCode, form }: { refCode: string; form: Record<string, string | boolean> }) {
  return <article className="oya-summary-card"><h2>Review Your Enquiry</h2><p>Reference: {refCode}</p>{Object.entries(form).filter(([key]) => key !== 'consent').map(([key, value]) => <div key={key}><span>{key}</span><b>{String(value) || '-'}</b></div>)}<small>Estimated and subject to confirmation. Demo only.</small></article>;
}

function BookingSummaryPage() {
  return (
    <Layout page="summary">
      <section className="oya-section oya-summary-page">
        <SectionHead eyebrow="Booking Summary" title="Estimated enquiry summary." copyText="Nothing is paid or confirmed. This page shows the consultant follow-up workflow." />
        <SummaryCard refCode="OYA-DEMO-24001" form={{ package: 'Umrah Musim Sejuk', travellers: '2 adults', departure: '20 Dec 2026', inn: 'OYA Inn pre-departure stay', addons: 'Airport transfer, insurance enquiry', total: 'Estimated RM 14,340', status: 'Payment status placeholder', consultant: 'Assigned consultant placeholder' }} />
        <div className="oya-timeline">{['Enquiry received', 'OYA consultant contacts traveller', 'Availability confirmed', 'Documents/payment arranged', 'Booking finalised'].map((item, index) => <div key={item}><b>{index + 1}</b><span>{item}</span></div>)}</div>
        <button type="button" onClick={() => window.print()} className="oya-btn oya-btn--gold">Print Summary</button>
      </section>
    </Layout>
  );
}

function AboutPage() {
  return (
    <Layout page="about">
      <PageHero title="About OYA" copyText="A connected journey-and-hospitality brand for travel planning, spiritual preparation and comfortable KLIA stays." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" />
      <section className="oya-section"><SectionHead eyebrow="Who OYA is" title="One brand for discovery, preparation and comfort." copyText="OYA Travel and OYA Inn belong together because many travellers need both careful journey planning and dependable accommodation near departure or arrival." /><div className="oya-gateways"><div className="oya-gateway oya-gateway--travel"><span>OYA Travel</span><h3>Domestic, international, Indonesia, islands, Umrah and customised groups.</h3></div><div className="oya-gateway oya-gateway--inn"><span>OYA Inn</span><h3>Short transit stays, overnight stays before early flights and family rooms near KLIA.</h3></div></div><div className="oya-feature-list">{['Care', 'Trust', 'Preparation', 'Comfort', 'Discovery'].map((item) => <span key={item}>{item}</span>)}</div><p className="oya-disclaimer">No founding dates, staff names or company history are invented in this demo. MOTAC Licence: {companyInfo.motacLicence}</p></section>
    </Layout>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <Layout page="contact">
      <PageHero title="We're Here to Help" copyText="Choose general enquiry, travel consultation, Umrah enquiry, Hajj interest, OYA Inn reservation, group/private trip or corporate enquiry." image="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1800&q=85" />
      <section className="oya-section oya-detail-grid">
        <div className="oya-contact-cards">{['OYA Travel', 'OYA Inn', 'WhatsApp', 'Email', 'Social media'].map((item) => <article key={item}><h3>{item}</h3><p>Placeholder contact information pending official confirmation.</p></article>)}</div>
        <form className="oya-estimator" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
          <h2>Send Enquiry</h2>
          <label>Name<input required /></label><label>Phone<input required type="tel" /></label><label>Email<input required type="email" /></label><label>Enquiry type<select><option>General enquiry</option><option>Travel consultation</option><option>Umrah enquiry</option><option>Hajj interest</option><option>OYA Inn reservation</option><option>Group/private trip</option><option>Corporate enquiry</option></select></label><label>Preferred contact method<select><option>WhatsApp</option><option>Email</option><option>Phone</option></select></label><label>Message<textarea required /></label><button type="submit" className="oya-btn oya-btn--gold">Send Enquiry</button>{sent ? <p className="oya-results">Demo form received locally. No backend transmission occurred.</p> : null}
        </form>
      </section>
    </Layout>
  );
}

function FaqSection() {
  return <div className="oya-info-blocks">{faqs.map((faq) => <article key={faq.question}><h3>{faq.question}</h3><p>{faq.answer}</p></article>)}</div>;
}

function TravelPage() {
  return <Layout page="travel"><PageHero title="Travel Boldly. Stay Comfortably." copyText="OYA Travel covers domestic Malaysian holidays, international holidays, Indonesia packages, islands, nature, Umrah, Hajj-related enquiries and private groups." image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85" /><Finder /><section className="oya-section"><PackageListingInline category="Indonesia" /><FinalCta /></section></Layout>;
}

export function OyaDemo({ page, packageSlug, roomSlug }: { page: PageKind; packageSlug?: string; roomSlug?: string }) {
  const pkg = travelPackages.find((item) => item.slug === packageSlug);
  const room = roomTypes.find((item) => item.slug === roomSlug);
  if (page === 'home') return <HomePage />;
  if (page === 'travel') return <TravelPage />;
  if (page === 'packages') return <PackageListing />;
  if (page === 'packageDetail') return <PackageDetail item={pkg} />;
  if (page === 'umrahHajj') return <UmrahHajjPage />;
  if (page === 'inn') return <InnPage />;
  if (page === 'rooms') return <RoomsPage />;
  if (page === 'roomDetail') return <RoomDetail room={room} />;
  if (page === 'plan') return <PlanPage />;
  if (page === 'summary') return <BookingSummaryPage />;
  if (page === 'about') return <AboutPage />;
  return <ContactPage />;
}
