'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Minus, Plus, RotateCcw, X } from 'lucide-react';
import { asset, classes, demoSessions, offers, team, type Offer } from './content';

type Concept = 'a' | 'b';
type Page = 'home' | 'classes' | 'credits' | 'team' | 'schedule';
const pages: Page[] = ['home', 'classes', 'credits', 'team', 'schedule'];
const categories = ['New here', 'Credit packs', 'Monthly', 'Private training'] as const;

function readLocation(): { concept: Concept; page: Page } {
  if (typeof window === 'undefined') return { concept: 'a', page: 'home' };
  const query = new URLSearchParams(window.location.search);
  const page = query.get('page');
  return { concept: query.get('concept') === 'b' ? 'b' : 'a', page: pages.includes(page as Page) ? page as Page : 'home' };
}

function Photo({ name, alt, className = '', priority = false, sizes = '(max-width: 700px) 100vw, 50vw' }: { name: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  return <div className={`lean-photo ${className}`}><Image src={asset(name)} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: 'cover' }} /></div>;
}

function Heading({ kicker, title, aside }: { kicker?: string; title: string; aside?: string }) {
  return <div className="lean-heading"><div>{kicker && <p className="lean-kicker">{kicker}</p>}<h1>{title}</h1></div>{aside && <p>{aside}</p>}</div>;
}

function OfferCard({ offer, concept, onAction, selected, onCompare }: { offer: Offer; concept: Concept; onAction: (offer: Offer) => void; selected?: boolean; onCompare?: (id: string) => void }) {
  return <article className={`lean-offer ${concept === 'b' ? 'lean-offer-b' : ''}`}>
    <div className="lean-offer-top"><span>{offer.group}</span>{concept === 'b' && onCompare && <button type="button" className={`lean-compare-toggle ${selected ? 'is-selected' : ''}`} onClick={() => onCompare(offer.id)} aria-pressed={!!selected}>{selected ? <Check size={15} /> : <Plus size={15} />} Compare</button>}</div>
    <h3>{offer.name}</h3><p className="lean-offer-price">{offer.price}</p><p className="lean-offer-quantity">{offer.quantity}</p>
    <dl><div><dt>Validity</dt><dd>{offer.validity}</dd></div><div><dt>Sharing</dt><dd>{offer.sharing}</dd></div></dl>
    <p className="lean-offer-restrictions">{offer.restrictions}</p>
    {offer.question && <p className="lean-confirm-note">Details to confirm: {offer.question}</p>}
    {offer.detail && <details><summary>More terms</summary><p>{offer.detail}</p></details>}
    <button className="lean-text-action" type="button" onClick={() => onAction(offer)}>Preview purchase path <ArrowUpRight size={17} /></button>
  </article>;
}

function Credits({ concept, onAction }: { concept: Concept; onAction: (offer: Offer) => void }) {
  const [category, setCategory] = useState<(typeof categories)[number]>('Credit packs');
  const [mat, setMat] = useState('0');
  const [equipment, setEquipment] = useState('0');
  const [compared, setCompared] = useState<string[]>([]);
  const [priority, setPriority] = useState<'flexibility' | 'sharing' | 'frequency'>('flexibility');
  const valid = (x: string) => /^\d+$/.test(x) && Number(x) >= 0 && Number(x) <= 999;
  const credits = valid(mat) && valid(equipment) ? Number(mat) + 2 * Number(equipment) : null;
  const visible = offers.filter(offer => offer.group === category);
  const toggleCompare = (id: string) => setCompared(current => current.includes(id) ? current.filter(x => x !== id) : [...current.slice(-1), id]);
  const selectedOffers = compared.map(id => offers.find(x => x.id === id)).filter((x): x is Offer => !!x);
  return <main className="lean-page lean-credits-page" id="main-content">
    <section className="lean-page-intro">
      <Heading kicker={concept === 'a' ? 'The way in' : 'LEAN / ACCESS'} title={concept === 'a' ? 'Make space for movement.' : 'A way in, on your terms.'} aside="Browse LEAN’s published offers with the important conditions visible. This is a design concept; purchases are simulated." />
      <div className="lean-credit-rule"><strong>One simple rule.</strong><span>Mat class = <b>1 credit</b></span><span>Equipment class = <b>2 credits</b></span><small>Equipment classes listed by LEAN: Leanformer, Infrared / Hot, and Glutes Strength Circuit. Other service eligibility needs confirmation.</small></div>
    </section>
    {concept === 'b' && <section className="lean-guide"><div><p className="lean-kicker">Find your rhythm</p><h2>What matters most?</h2></div><div className="lean-guide-options">{(['flexibility','sharing','frequency'] as const).map(x => <button key={x} type="button" aria-pressed={priority === x} onClick={() => { setPriority(x); setCategory(x === 'frequency' ? 'Monthly' : 'Credit packs'); }}>{x === 'flexibility' ? 'Flexible visits' : x === 'sharing' ? 'Bring someone' : 'Come often'} <ArrowUpRight size={16} /></button>)}</div><p>{priority === 'frequency' ? 'Monthly subscriptions are shown below. Confirm commitment and freeze details with LEAN.' : priority === 'sharing' ? 'Shareable packs are shown below; each card states its allowance.' : 'Credit packs are shown below. Check their individual expiry and class rules.'}</p></section>}
    <section className="lean-catalogue" aria-label="LEAN offers"><div className="lean-section-heading"><div><p className="lean-kicker">Published offers</p><h2>Choose your path</h2></div><p>All displayed prices exclude 8% SST, as stated on LEAN’s site.</p></div>
      <div className="lean-tabs" role="tablist" aria-label="Offer category">{categories.map(x => <button key={x} id={`lean-tab-${x.replaceAll(' ','-')}`} role="tab" type="button" aria-selected={category === x} aria-controls="lean-offer-panel" onClick={() => { setCategory(x); setCompared([]); }}>{x}</button>)}</div>
      <div id="lean-offer-panel" role="tabpanel" aria-labelledby={`lean-tab-${category.replaceAll(' ','-')}`} className="lean-offers">{visible.map(offer => <OfferCard key={offer.id} offer={offer} concept={concept} onAction={onAction} selected={compared.includes(offer.id)} onCompare={concept === 'b' ? toggleCompare : undefined} />)}</div>
      {concept === 'b' && <div className="lean-compare-panel"><div><p className="lean-kicker">Side by side</p><h3>Compare two offers</h3><p>Select any two cards in this category. {selectedOffers.length}/2 selected.</p></div>{selectedOffers.length > 0 && <div className="lean-compare-columns">{selectedOffers.map(x => <div key={x.id}><strong>{x.name}</strong><span>{x.price}</span><span>{x.quantity}</span><span>{x.validity}</span><span>{x.sharing}</span></div>)}</div>}</div>}
    </section>
    <section className="lean-planner"><div><p className="lean-kicker">Class-mix planner</p><h2>Plan the movement.<br />Count the credits.</h2><p>This calculates credits only. It does not check class availability, eligibility, or the cheapest eligible purchase.</p></div><div className="lean-planner-tool"><label>Mat classes <input type="number" inputMode="numeric" min="0" max="999" step="1" value={mat} onChange={e => setMat(e.target.value)} /></label><span className="lean-equation">+</span><label>Equipment classes <input type="number" inputMode="numeric" min="0" max="999" step="1" value={equipment} onChange={e => setEquipment(e.target.value)} /></label><span className="lean-equation">× 2 =</span><output aria-live="polite">{credits === null ? '—' : credits}<small>credits needed</small></output><button type="button" onClick={() => { setMat('0'); setEquipment('0'); }}><RotateCcw size={16} /> Reset</button>{credits === null && <p role="alert">Enter whole numbers from 0 to 999.</p>}</div></section>
  </main>;
}

function Classes({ concept, go }: { concept: Concept; go: (page: Page) => void }) {
  const [chapter, setChapter] = useState(0);
  const chapters = [classes[0], classes[1], classes[2]];
  return <main className="lean-page lean-classes-page" id="main-content"><section className="lean-page-intro"><Heading kicker={concept === 'a' ? 'Practices' : 'LEAN / MOVEMENT'} title={concept === 'a' ? 'Move with intention.' : 'Find your kind of strong.'} aside="Explore the practices shown on LEAN’s current site. Class descriptions here are concept copy; timetable and eligibility should be confirmed with LEAN." /></section>
    {concept === 'b' ? <section className="lean-chapters"><div className="lean-chapter-copy"><p className="lean-kicker">Three chapters / one practice</p><div className="lean-chapter-index">{chapters.map((c,i) => <button key={c.name} type="button" aria-pressed={chapter === i} onClick={() => setChapter(i)}><span>0{i+1}</span> {c.name}</button>)}</div><h2>{chapters[chapter].name}</h2><p>{chapters[chapter].description}</p><button type="button" className="lean-pill" onClick={() => go('schedule')}>Explore demo schedule <ArrowUpRight size={17} /></button></div><Photo key={chapters[chapter].image} name={chapters[chapter].image} alt={`${chapters[chapter].name} at LEAN`} className="lean-chapter-image" /></section> : <section className="lean-sticky-practices"><div className="lean-sticky-image"><Photo name="packages-FOX_9781.jpg" alt="LEAN participants training in the studio" /></div><div className="lean-sticky-list">{classes.slice(0,3).map((c,i) => <article key={c.name}><span>0{i+1} / {c.type}</span><h2>{c.name}</h2><p>{c.description}</p></article>)}</div></section>}
    <section className="lean-class-grid"><div className="lean-section-heading"><div><p className="lean-kicker">Explore more</p><h2>Inside the studio</h2></div></div>{classes.map((c,i) => <article key={c.name}><Photo name={c.image} alt={`${c.name} at LEAN`} /><div><span>{String(i+1).padStart(2,'0')} / {c.type}</span><h3>{c.name}</h3><p>{c.description}</p></div></article>)}</section>
  </main>;
}

function Team({ concept, go }: { concept: Concept; go: (page: Page) => void }) {
  return <main className="lean-page lean-team-page" id="main-content"><section className="lean-page-intro"><Heading kicker={concept === 'a' ? 'People & purpose' : 'LEAN / PEOPLE'} title={concept === 'a' ? 'A studio shaped by people.' : 'The people behind the practice.'} aside="LEAN describes its approach as fitness together with recovery and nutritional practices. The names and roles below follow its public team page." /></section><section className="lean-mission"><Photo name="mission-FOX_9359.jpg" alt="LEAN studio equipment" /><div><p className="lean-kicker">Our approach</p><h2>More than a workout.</h2><p>LEAN’s published mission pairs innovative fitness with recovery and nutritional practices. This concept gives that idea room to breathe.</p><button className="lean-text-action" type="button" onClick={() => go('classes')}>Explore the practices <ArrowRight size={17} /></button></div></section><section className="lean-people"><div className="lean-section-heading"><div><p className="lean-kicker">Meet LEAN</p><h2>In good company.</h2></div></div><div className="lean-people-grid">{team.map((person,i) => <article key={person.name} className={concept === 'b' && i % 3 === 1 ? 'lean-person-offset' : ''}><Photo name={person.image} alt={`Portrait of ${person.name}`} /><div><h3>{person.name}</h3><p>{person.role}</p><small>{person.disciplines}</small></div></article>)}</div></section></main>;
}

function Schedule({ concept, openSession }: { concept: Concept; openSession: (id: number) => void }) {
  const [day, setDay] = useState('All days');
  const [type, setType] = useState('All classes');
  const filtered = demoSessions.filter(x => (day === 'All days' || x.day === day) && (type === 'All classes' || x.type === type));
  return <main className="lean-page lean-schedule-page" id="main-content"><section className="lean-page-intro"><Heading kicker={concept === 'a' ? 'A preview of booking' : 'LEAN / SCHEDULE'} title={concept === 'a' ? 'Your next session starts here.' : 'Make the time yours.'} aside="Fictional demonstration sessions only. This is not LEAN’s live timetable and shows no real availability." /></section><section className="lean-schedule"><div className="lean-schedule-head"><div><p className="lean-kicker">Demo timetable</p><h2>Explore the flow</h2></div><p>In a commissioned site, confirmed Momence code or an official booking link would handle actual reservations and payment.</p></div><div className="lean-filters"><label>Day<select value={day} onChange={e => setDay(e.target.value)}><option>All days</option><option>Monday</option><option>Tuesday</option><option>Wednesday</option></select></label><label>Class type<select value={type} onChange={e => setType(e.target.value)}><option>All classes</option><option>Mat</option><option>Equipment</option></select></label></div><div className="lean-session-list">{filtered.length ? filtered.map(x => <button key={x.id} type="button" onClick={() => openSession(x.id)}><span>{x.day}<strong>{x.time}</strong></span><span><strong>{x.title}</strong><small>with {x.coach} · {x.type}</small></span><span>View session <ArrowUpRight size={18} /></span></button>) : <div className="lean-empty">No demonstration sessions match these filters. Try another day or class type.</div>}</div><p className="lean-demo-disclaimer">Demo data · No live availability · No booking or payment is collected.</p></section></main>;
}

function HomeA({ go }: { go: (page: Page) => void }) {
  return <main className="lean-home lean-home-a" id="main-content"><section className="lean-a-hero"><div className="lean-a-hero-text"><p className="lean-kicker">A place to return to yourself</p><h1><span>Find strength.</span><span>Feel everything.</span></h1><p>Movement, recovery and a studio built around the full picture of wellness.</p><button className="lean-pill" type="button" onClick={() => go('schedule')}>Explore the schedule <ArrowUpRight size={17} /></button></div><div className="lean-a-hero-image"><Photo name="home-FOX_9375.jpg" alt="LEAN studio with rows of Pilates equipment" priority sizes="(max-width: 700px) 100vw, 84vw" /><span>Desa Sri Hartamas · Kuala Lumpur</span></div><a href="#lean-a-practices" className="lean-scroll-cue">Scroll to explore <ArrowDown size={15} /></a></section><section id="lean-a-practices" className="lean-a-practices"><div><p className="lean-kicker">The practices</p><h2>Room to move.<br />Space to grow.</h2><p>From the Leanformer to Mat Strength Pilates and recovery, discover LEAN’s published practices.</p><button className="lean-text-action" type="button" onClick={() => go('classes')}>See all classes <ArrowRight size={17} /></button></div><div className="lean-a-practice-images"><Photo name="packages-FOX_9781.jpg" alt="Participants in a LEAN training class" /><Photo name="services-FOX_0440.jpg" alt="LEAN studio entrance" /></div></section><section className="lean-a-credit-teaser"><p className="lean-kicker">LEAN Credits</p><h2>A practice that fits your rhythm.</h2><p>Mat classes use one credit. LEAN lists Leanformer, Infrared / Hot and Glutes Strength Circuit as two-credit equipment classes.</p><button className="lean-pill" type="button" onClick={() => go('credits')}>Explore credits <ArrowUpRight size={17} /></button></section><section className="lean-a-people-teaser"><Photo name="team-allisha.jpg" alt="Portrait of LEAN founder Allisha" /><div><p className="lean-kicker">The people</p><h2>Led with intention.</h2><p>Meet Allisha and the team behind the studio.</p><button className="lean-text-action" type="button" onClick={() => go('team')}>Meet the team <ArrowRight size={17} /></button></div></section></main>;
}

function HomeB({ go }: { go: (page: Page) => void }) {
  return <main className="lean-home lean-home-b" id="main-content"><section className="lean-b-hero"><div className="lean-b-hero-top"><p>LEAN 3.0 / A new energy</p><span>Movement is a way of being.</span></div><div className="lean-b-hero-title"><h1>TAKE<br /><em>UP SPACE.</em></h1><div><p>A home for strength, recovery and everything in between.</p><button className="lean-round-action" type="button" onClick={() => go('schedule')} aria-label="Explore demo schedule"><ArrowUpRight size={28} /></button></div></div><Photo name="packages-FOX_9781.jpg" alt="Women training together at LEAN" className="lean-b-hero-photo" priority sizes="(max-width: 700px) 100vw, 58vw" /><span className="lean-b-hero-caption">DESA SRI HARTAMAS · KUALA LUMPUR</span></section><section className="lean-b-statement"><p className="lean-kicker">This is your practice</p><h2>Move with focus.<br /><i>Recover with purpose.</i><br />Come back stronger.</h2><Photo name="home-FOX_9877.jpg" alt="Close detail of LEAN Pilates equipment" /></section><section className="lean-b-chapter-teaser"><div><span>01 / 03</span><h2>Discover movement<br />on your terms.</h2><button className="lean-pill" type="button" onClick={() => go('classes')}>Explore the classes <ArrowUpRight size={17} /></button></div><Photo name="services-FOX_9453.jpg" alt="LEAN Leanformer practice" /></section><section className="lean-b-credit-reset"><p>THE RESET</p><h2>Make room for what moves you.</h2><p>Clear credits, useful choices, no guessing what a class costs in credits.</p><button className="lean-pill" type="button" onClick={() => go('credits')}>Find your access <ArrowUpRight size={17} /></button></section><section className="lean-b-team-teaser"><Photo name="team-allisha.jpg" alt="Portrait of LEAN founder Allisha" /><div><p className="lean-kicker">The team</p><h2>Real people.<br />Real presence.</h2><button className="lean-text-action" type="button" onClick={() => go('team')}>Meet LEAN <ArrowRight size={17} /></button></div></section></main>;
}

export default function LeanWellness() {
  const [state, setState] = useState<{ concept: Concept; page: Page }>({ concept:'a', page:'home' });
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<{ title: string; body: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => { setState(readLocation()); setReady(true); const onPop = () => { setState(readLocation()); setMenuOpen(false); window.scrollTo(0,0); }; window.addEventListener('popstate',onPop); return () => window.removeEventListener('popstate',onPop); }, []);
  const navigate = useCallback((next: { concept?: Concept; page?: Page }) => {
    const result = { concept: next.concept || state.concept, page: next.page || state.page };
    const url = new URL(window.location.href);
    url.searchParams.set('concept', result.concept);
    url.searchParams.set('page', result.page);
    window.history.pushState({}, '', url);
    setState(result);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [state]);
  useEffect(() => { if (!ready || !rootRef.current) return; const root=rootRef.current; const observer=new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('lean-seen'); }),{threshold:.12}); root.querySelectorAll('.lean-home section, .lean-page > section').forEach(el=>observer.observe(el)); return () => observer.disconnect(); }, [ready,state]);
  useEffect(() => { const el=dialogRef.current; if (dialog && el && !el.open) { lastFocus.current=document.activeElement as HTMLElement; el.showModal(); } if (!dialog && el?.open) { el.close(); lastFocus.current?.focus(); } }, [dialog]);
  useEffect(() => { if (state.page !== 'home' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; const handler=() => { const el=rootRef.current; if (!el) return; el.style.setProperty('--lean-scroll', String(Math.min(1,window.scrollY/650))); }; handler(); window.addEventListener('scroll',handler,{passive:true}); return () => { window.removeEventListener('scroll',handler); rootRef.current?.style.removeProperty('--lean-scroll'); }; }, [state]);
  const switchConcept=(concept: Concept)=>navigate({concept});
  const showOffer=(offer: Offer)=>setDialog({title:`${offer.name} · concept purchase path`,body:`In a real LEAN site, this action would hand off to LEAN’s verified Momence purchase flow. This showcase does not charge, reserve or collect details. Published base price: ${offer.price}, excluding 8% SST. ${offer.restrictions}`});
  const showSession=(id:number)=>{const x=demoSessions.find(s=>s.id===id);if(x)setDialog({title:`${x.title} · ${x.day} ${x.time}`,body:`Fictional demonstration session with ${x.coach}. No live availability is shown. A real booking action would use LEAN’s verified Momence schedule or booking link; this showcase does not make a reservation.`});};
  return <div ref={rootRef} className={`lean-site lean-concept-${state.concept}`}>
    <a href="#main-content" className="lean-skip">Skip to content</a>
    <div className="lean-showcase-shell"><div className="lean-shell-inner"><div className="lean-shell-title"><a href="/showcase/"><ArrowLeft size={15} /> DOA Showcase</a><span>Prospective design concept · No live booking</span></div><div className="lean-switcher" aria-label="Design concept"><button type="button" aria-pressed={state.concept==='a'} onClick={()=>switchConcept('a')}>A <span>Terracotta Studio</span></button><button type="button" aria-pressed={state.concept==='b'} onClick={()=>switchConcept('b')}>B <span>LEAN 3.0</span></button></div><p className="lean-shell-explain">A refines the current feel. B explores an editorial rebrand.</p></div></div>
    <header className="lean-nav"><div className="lean-nav-inner"><button type="button" className="lean-logo-button" onClick={()=>navigate({page:'home'})} aria-label="LEAN concept home"><Image src={asset('logo.png')} alt="LEAN Wellness" width={142} height={57} priority /></button><nav aria-label="LEAN concept navigation" className={menuOpen ? 'is-open' : ''}>{pages.map(p=><button type="button" key={p} aria-current={state.page===p?'page':undefined} onClick={()=>navigate({page:p})}>{p==='credits'?'LEAN Credits':p==='team'?'About / Team':p==='schedule'?'Schedule':p==='home'?'Home':'Classes'}</button>)}</nav><button className="lean-nav-cta" type="button" onClick={()=>navigate({page:'schedule'})}>Explore schedule <ArrowUpRight size={16} /></button><button className="lean-menu-toggle" type="button" aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(x=>!x)}>{menuOpen?<X size={22}/>:<Menu size={22}/>}</button></div></header>
    {state.page==='home' ? state.concept==='a' ? <HomeA go={page=>navigate({page})}/> : <HomeB go={page=>navigate({page})}/> : state.page==='classes' ? <Classes concept={state.concept} go={page=>navigate({page})}/> : state.page==='credits' ? <Credits concept={state.concept} onAction={showOffer}/> : state.page==='team' ? <Team concept={state.concept} go={page=>navigate({page})}/> : <Schedule concept={state.concept} openSession={showSession}/>}
    <footer className="lean-footer"><div><Image src={asset('logo.png')} alt="LEAN Wellness" width={130} height={52} /><p>Two visual directions for discussion. Built as a DOA Solutions concept demo, not LEAN’s live website.</p></div><div><p>Explore</p>{pages.map(p=><button key={p} type="button" onClick={()=>navigate({page:p})}>{p==='credits'?'LEAN Credits':p}</button>)}</div><div><p>Studio information from LEAN’s public website</p><span>Matahari Building, 1 Jalan 48/70a, Desa Sri Hartamas, Level M, 50480 Malaysia</span><span>Booking remains with Momence in any commissioned implementation.</span></div></footer>
    <dialog ref={dialogRef} className="lean-dialog" onClose={()=>setDialog(null)} onClick={e=>{if(e.target===dialogRef.current)setDialog(null)}} aria-labelledby="lean-dialog-title"><button type="button" className="lean-dialog-close" aria-label="Close details" onClick={()=>setDialog(null)}><X size={20}/></button><p className="lean-kicker">Demonstration only</p><h2 id="lean-dialog-title">{dialog?.title}</h2><p>{dialog?.body}</p><button type="button" className="lean-pill" onClick={()=>setDialog(null)}>Back to concept <ArrowLeft size={16}/></button></dialog>
  </div>;
}
