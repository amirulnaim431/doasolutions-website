'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Destination = 'bali' | 'malaysia';

const journeys = {
  bali: {
    name: 'Bali', region: 'INDONESIA', title: 'A quieter side of Bali',
    summary: 'Village kitchens, makers, daily rituals and time to see beyond the familiar image.',
    image: '/showcase/images/unnamed-travel/bali-artisan.png',
    imageAlt: 'Illustrative documentary image of a Balinese artisan making palm-leaf offerings',
    note: 'An illustrative route through local life and craft. Specific hosts and locations are to be confirmed.',
    days: [
      { place: 'Village life', title: 'Begin at the table', time: 'Slow morning', body: 'Start with a shared breakfast, then follow the ordinary rhythms of a village. Learn what the food, flowers and daily preparations mean to the people making them.', detail: 'A good first day leaves room to listen, settle in and ask better questions.' },
      { place: 'Craft & tradition', title: 'Make time for the makers', time: 'Half-day studio visit', body: 'Spend time in a small workshop. Watch the process, try a craft with guidance and hear how skills are passed between generations.', detail: 'The aim is an exchange with a maker, not a quick souvenir stop.' },
      { place: 'Family kitchen', title: 'Cook, then stay awhile', time: 'Afternoon into evening', body: 'Explore seasonal ingredients and prepare a meal together. The conversation after cooking is as much a part of the experience as the recipe.', detail: 'Food becomes a way into everyday stories and local perspective.' },
      { place: 'Landscape', title: 'Take the longer way home', time: 'Open-ended morning', body: 'Move through the landscape at a gentler pace, with time for a local guide to connect the route to the lives around it.', detail: 'The itinerary finishes with space instead of a final rush.' },
    ],
  },
  malaysia: {
    name: 'Malaysia', region: 'SOUTHEAST ASIA', title: 'City stories, local tables',
    summary: 'Kuala Lumpur streets and creative spaces, then George Town food and neighbourhood life.',
    image: '/showcase/images/unnamed-travel/kl-city.png',
    imageAlt: 'Illustrative documentary image of Kuala Lumpur city life at a breakfast stall',
    note: 'Illustrative city-to-city route. Transport, access, hosts and exact timing need local verification.',
    days: [
      { place: 'Kuala Lumpur', title: 'The city before breakfast', time: 'Morning walk', body: 'Explore a neighbourhood as its shops open and breakfast stalls fill. Notice the languages, food traditions and working rhythms that make Kuala Lumpur feel lived-in.', detail: 'The city is the experience, not just a transfer point.' },
      { place: 'Kuala Lumpur', title: 'Creative city, everyday city', time: 'Afternoon to evening', body: 'Move between independent studios, public spaces and a local dinner route. Hear how different communities shape the capital today.', detail: 'A contemporary cultural lens belongs beside heritage.' },
      { place: 'Kuala Lumpur → Penang', title: 'A journey north', time: 'Travel day', body: 'Travel to Penang with a realistic pause built into the day. Arrive in George Town with time for an evening walk and a first taste of its food scene.', detail: 'Transit is planned honestly so the trip never feels overpacked.' },
      { place: 'George Town', title: 'A city told through food', time: 'Full day', body: 'Meet the neighbourhood through markets, family-run kitchens and everyday streets. Follow a local voice through the layers that make George Town distinct.', detail: 'The route stays grounded in real communities and daily life.' },
    ],
  },
} as const;

export default function TravelDemo() {
  const root = useRef<HTMLElement>(null);
  const [destination, setDestination] = useState<Destination>('bali');
  const [day, setDay] = useState(0);
  const [saved, setSaved] = useState(false);
  const journey = journeys[destination];

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.from('.td-hero-copy > *', { y: 36, opacity: 0, duration: .85, stagger: .11, ease: 'power3.out' });
    gsap.from('.td-hero-photo', { clipPath: 'inset(0 0 100% 0 round 12px)', duration: 1.2, delay: .25, ease: 'power3.inOut' });
    gsap.to('.td-hero-photo img', { yPercent: -7, ease: 'none', scrollTrigger: { trigger: '.td-hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from('.td-destinations article', { y: 55, opacity: 0, duration: .9, stagger: .14, ease: 'power3.out', scrollTrigger: { trigger: '.td-destinations', start: 'top 75%', once: true } });
  }, { scope: root });

  function chooseDestination(next: Destination) {
    setDestination(next);
    setDay(0);
    setSaved(false);
    document.getElementById('journey')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }

  return <main className="td" ref={root}>
    <div className="td-notice">INTERACTIVE CONCEPT DEMO · EXAMPLES ARE ILLUSTRATIVE</div>
    <nav className="td-nav" aria-label="Main navigation"><Link href="/" className="td-brand"><span className="td-mark" aria-hidden="true">✳</span> Elsewhere, Together <small>working name</small></Link><div className="td-nav-links"><a href="#destinations">Destinations</a><a href="#journey">The journey</a><a href="#approach">Our approach</a></div><a className="td-nav-action" href="#journey">Explore an itinerary ↗</a></nav>
    <header className="td-hero"><div className="td-hero-copy"><span className="td-kicker">PEOPLE · PLACES · A DEEPER WAY TO TRAVEL</span><h1>Go beyond<br /><em>the postcard.</em></h1><p>Thoughtful journeys shaped by the people who call a place home. Explore Bali and Malaysia through everyday culture, local knowledge and room to slow down.</p><a className="td-primary" href="#destinations">Find your place <span>↗</span></a><div className="td-hero-foot">LOCAL VOICES <span>✳</span> SLOWER DAYS <span>✳</span> REAL CONNECTION</div></div><div className="td-hero-photo"><img src="/showcase/images/unnamed-travel/bali-artisan.png" alt="Illustrative image of a Balinese artisan at work" /><div className="td-photo-note"><span>01 / BALI</span><strong>Look closer. Stay longer.</strong></div></div><div className="td-hero-side" aria-hidden="true">FOLLOW THE STORIES, NOT THE CROWDS ↓</div></header>
    <section className="td-intro" id="approach"><span>THE WAY WE SEE IT</span><p>Some of the best travel moments never make the usual list. A morning market. A maker’s hands. A conversation that changes how you see a place.</p><div className="td-intro-aside">Designed around time with people and practical routes, so curiosity has somewhere to go.</div></section>
    <section className="td-destinations" id="destinations"><div className="td-section-heading"><div><span>WHERE WE BEGIN</span><h2>Two places.<br /><em>More than one story.</em></h2></div><p>Choose a destination to preview a different rhythm of travel.</p></div><div className="td-destination-grid"><article><button type="button" onClick={() => chooseDestination('bali')} aria-label="Explore Bali itinerary"><img src="/showcase/images/unnamed-travel/bali-artisan.png" alt="Illustrative Balinese artisan scene" /><span className="td-card-overlay"><small>INDONESIA / ISLAND LIFE</small><strong>Bali</strong><span>Living traditions, craft and a slower rhythm <b>↗</b></span></span></button></article><article><button type="button" onClick={() => chooseDestination('malaysia')} aria-label="Explore Malaysia itinerary"><img src="/showcase/images/unnamed-travel/kl-city.png" alt="Illustrative Kuala Lumpur neighbourhood scene" /><span className="td-card-overlay"><small>CITIES / FOOD / COMMUNITY</small><strong>Malaysia</strong><span>Kuala Lumpur, George Town and local tables <b>↗</b></span></span></button></article></div></section>
    <section className="td-journey" id="journey"><div className="td-journey-top"><div><span>FEATURED ITINERARY / ILLUSTRATIVE</span><h2>{journey.title}</h2><p>{journey.summary}</p></div><div className="td-switch" role="group" aria-label="Choose destination"><button className={destination === 'bali' ? 'active' : ''} type="button" onClick={() => chooseDestination('bali')} aria-pressed={destination === 'bali'}>Bali</button><button className={destination === 'malaysia' ? 'active' : ''} type="button" onClick={() => chooseDestination('malaysia')} aria-pressed={destination === 'malaysia'}>Malaysia</button></div></div><div className="td-journey-body"><div className="td-timeline" role="tablist" aria-label={`${journey.name} itinerary days`}>{journey.days.map((item, index) => <button type="button" role="tab" key={`${destination}-${item.title}`} id={`day-tab-${index}`} aria-selected={day === index} aria-controls="day-panel" className={day === index ? 'active' : ''} onClick={() => setDay(index)}><small>DAY 0{index + 1} · {item.place}</small><strong>{item.title}</strong><span aria-hidden="true">↗</span></button>)}</div><div className="td-day-panel" key={`${destination}-${day}`} id="day-panel" role="tabpanel" aria-labelledby={`day-tab-${day}`}><div className="td-day-image"><img src={destination === 'malaysia' && day === 3 ? '/showcase/images/unnamed-travel/malaysia-kitchen.png' : journey.image} alt={destination === 'malaysia' && day === 3 ? 'Illustrative Malaysian family kitchen scene' : journey.imageAlt} /><span>DAY 0{day + 1} / {journey.region}</span></div><div className="td-day-content"><span>{journey.days[day].time}</span><h3>{journey.days[day].title}</h3><p>{journey.days[day].body}</p><blockquote>{journey.days[day].detail}</blockquote></div></div></div><div className="td-journey-bottom"><p>{journey.note}</p><button type="button" onClick={() => setSaved(!saved)} aria-pressed={saved}>{saved ? 'Saved to this preview ✓' : 'Save this idea ♡'}</button></div></section>
    <section className="td-close"><span>THE NEXT CHAPTER</span><h2>See a place through<br /><em>the people in it.</em></h2><p>This is an early product demo. Real routes, hosts, availability and practical details will be developed with local partners.</p><a href="#destinations">Explore the destinations ↗</a></section>
    <footer className="td-footer"><span>Elsewhere, Together <small>working name</small></span><p>Bali + Malaysia · Concept website demo</p><Link href="/">DOA Showcase ↗</Link></footer>
  </main>;
}
