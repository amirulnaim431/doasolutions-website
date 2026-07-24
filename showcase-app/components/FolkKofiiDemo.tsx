'use client';

import { useMemo, useState } from 'react';

const base = '/showcase/folk-kofii';
const imageBase = '/showcase/images/folk-kofii';

const events = [
  { type: 'Poetry', date: 'Fri 14 Aug', time: '8:30 PM', title: 'Sajak Dalam Lorong', host: 'Demo spoken word night', status: 'RSVP open' },
  { type: 'Live Band', date: 'Sat 22 Aug', time: '9:00 PM', title: 'Indie Set: After MWT', host: 'Demo acoustic/live band showcase', status: 'Few seats' },
  { type: 'Open Mic', date: 'Sat 29 Aug', time: '8:00 PM', title: 'Jalan Negara Kita Open Mic', host: 'Demo sign-up for poets, music and comedy', status: 'Artists wanted' },
  { type: 'Art', date: 'Sun 06 Sep', time: '3:00 PM', title: 'Zine Table & Print Swap', host: 'Demo community art market', status: 'Vendor call' },
];

const menu = [
  ['House White', 'Smooth milk coffee for long table talks', 'RM 12'],
  ['Black Kofii', 'Clean espresso-forward cup', 'RM 10'],
  ['Kaya Toast Set', 'Local breakfast energy with kopi', 'RM 16'],
  ['Cake Counter Pick', 'Rotating slices from the display', 'RM 14'],
];

const memories = [
  'After school lepak spots, hill roads, pasar errands and weekend mamak routes.',
  'The MWT feeling: people know the shortcuts, the old blocks and the same familiar faces.',
  'A cafe can hold more than orders. It can hold posters, poems, bands and neighbourhood stories.',
];

function FolkEventCard({ item, onRsvp }: { item: (typeof events)[number]; onRsvp: (title: string) => void }) {
  return (
    <article className="folk-event-card">
      <div><span>{item.type}</span><b>{item.date}</b><small>{item.time}</small></div>
      <h3>{item.title}</h3>
      <p>{item.host}</p>
      <button type="button" onClick={() => onRsvp(item.title)}>{item.status}</button>
    </article>
  );
}

export function FolkKofiiDemo() {
  const [filter, setFilter] = useState('All');
  const [rsvp, setRsvp] = useState('');
  const filteredEvents = useMemo(() => (filter === 'All' ? events : events.filter((event) => event.type === filter)), [filter]);
  const categories = ['All', 'Poetry', 'Live Band', 'Open Mic', 'Art'];

  return (
    <main className="folk-site">
      <header className="folk-nav">
        <a href={base} className="folk-logo" aria-label="Folk Kofii home"><span>Folk</span><b>Kofii</b></a>
        <nav aria-label="Folk Kofii demo navigation">
          <a href="#events">Events</a>
          <a href="#stage">Stage</a>
          <a href="#menu">Menu</a>
          <a href="#melawati">MWT</a>
          <a href="#pitch">Pitch</a>
        </nav>
        <a className="folk-nav-cta" href="#events">Promote an event</a>
      </header>

      <section className="folk-hero">
        <img src={`${imageBase}/folk-mural-arcade.png`} alt="Folk Kofii mural arcade exterior demo visual" />
        <div className="folk-hero-copy">
          <p>Indie coffee shop / tiny roastery / Taman Melawati</p>
          <h1>Coffee, poems, bands and the memory of MWT.</h1>
          <span>A demo website for Folk Kofii that turns the cafe into a living event board, local arts stage and digital home for the Taman Melawati crowd.</span>
          <div>
            <a href="#events">View upcoming events</a>
            <a href="#pitch">See the pitch</a>
          </div>
        </div>
        <aside className="folk-now">
          <small>Tonight at Folk</small>
          <strong>Open mic slots</strong>
          <span>Poetry / acoustic / stand-up / zine table</span>
        </aside>
      </section>

      <section className="folk-strip" aria-label="Folk Kofii concept pillars">
        {['Artsy cafe', 'Sajak & puisi stage', 'Live bands', 'Future event promos', 'MWT heritage'].map((item) => <span key={item}>{item}</span>)}
      </section>

      <section className="folk-section folk-intro">
        <div>
          <p className="folk-kicker">The idea</p>
          <h2>Make Folk the page people check before they make plans.</h2>
        </div>
        <p>This demo positions Folk Kofii as more than a cafe. It becomes a public-facing calendar for future gigs, poetry nights, art pop-ups and neighbourhood gatherings, while preserving the rough, heartfelt character of Taman Melawati.</p>
      </section>

      <section className="folk-section folk-events" id="events">
        <div className="folk-section-head">
          <p className="folk-kicker">Event engine</p>
          <h2>Upcoming at the alley.</h2>
          <span>Sample demo events only. The real site can let Folk publish dates, artist callouts, RSVP links and poster drops without relying only on Instagram stories.</span>
        </div>
        <div className="folk-filters">
          {categories.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={filter === item ? 'is-active' : ''}>{item}</button>)}
        </div>
        <div className="folk-event-grid">
          {filteredEvents.map((event) => <FolkEventCard key={event.title} item={event} onRsvp={setRsvp} />)}
        </div>
        {rsvp ? (
          <div className="folk-rsvp" role="status">
            <b>Demo RSVP preview</b>
            <span>You selected: {rsvp}. A real build can connect this to WhatsApp, Google Forms, Sayalive, email or an admin event dashboard.</span>
            <button type="button" onClick={() => setRsvp('')}>Close</button>
          </div>
        ) : null}
      </section>

      <section className="folk-stage" id="stage">
        <div>
          <p className="folk-kicker">For performers</p>
          <h2>A tiny stage deserves a serious calendar.</h2>
          <p>Poets, singer-songwriters, small bands, comedians, printmakers and local collectives can be given a clear path: check the next session, submit a slot, download a poster, share the event page.</p>
          <a href="#pitch">Build the event workflow</a>
        </div>
        <img src={`${imageBase}/folk-alley-seating.png`} alt="Outdoor alley seating and performance space demo visual" />
      </section>

      <section className="folk-section folk-gallery">
        {[
          ['folk-cafe-interior.png', 'Cafe interior'],
          ['folk-zine-wall.png', 'Zine wall'],
          ['folk-latte-gallery.png', 'Coffee table'],
          ['folk-counter-cakes.png', 'Counter and cakes'],
          ['folk-breakfast-corner.png', 'Breakfast corner'],
        ].map(([file, label]) => (
          <figure key={file}>
            <img src={`${imageBase}/${file}`} alt={`${label} Folk Kofii demo visual`} />
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </section>

      <section className="folk-section folk-menu" id="menu">
        <div className="folk-section-head">
          <p className="folk-kicker">Menu teaser</p>
          <h2>Small menu, strong ritual.</h2>
        </div>
        <div className="folk-menu-grid">
          {menu.map(([name, desc, price]) => <article key={name}><h3>{name}</h3><p>{desc}</p><b>{price}</b></article>)}
        </div>
      </section>

      <section className="folk-melawati" id="melawati">
        <div>
          <p className="folk-kicker">Taman Melawati heart</p>
          <h2>For people who call it MWT.</h2>
          <p>Taman Melawati sits at the KL/Selangor edge, close to the hills, Zoo Negara and the old neighbourhood routes people grew up with. This section is written as pitch copy, not official Folk history.</p>
        </div>
        <div className="folk-memory-list">
          {memories.map((item, index) => <article key={item}><b>0{index + 1}</b><p>{item}</p></article>)}
        </div>
      </section>

      <section className="folk-section folk-pitch" id="pitch">
        <div className="folk-section-head">
          <p className="folk-kicker">Pitch modules</p>
          <h2>What DOA can build for Folk Kofii.</h2>
        </div>
        <div className="folk-pitch-grid">
          {[
            ['Event CMS', 'Publish future shows, poetry nights, band posters, artist bios and RSVP links.'],
            ['Performer intake', 'A clean form for poets, bands, comedians and vendors to request a slot.'],
            ['WhatsApp RSVP', 'Generate pre-filled messages for reservations, group seats and stage enquiries.'],
            ['MWT archive', 'Collect stories, photos, posters and neighbourhood memories as a living local page.'],
            ['Menu and roastery drops', 'Promote seasonal coffee, beans, cakes and limited items without redesigning pages.'],
            ['Instagram bridge', 'Use the website as the stable source, then share event pages back to Instagram.'],
          ].map(([title, copyText]) => <article key={title}><h3>{title}</h3><p>{copyText}</p></article>)}
        </div>
      </section>

      <section className="folk-final">
        <p className="folk-kicker">Demo closing</p>
        <h2>Keep the Instagram energy. Give the community a permanent home.</h2>
        <div><a href="#events">Check the event board</a><a href="/showcase/">Back to DOA showcase</a></div>
        <small>Demo content only. Event dates, menu prices and programming are placeholders for presentation.</small>
      </section>
    </main>
  );
}
