'use client';

import { useState } from 'react';
import { assetPath, conversionBenefits, interactiveMoments, lookbook, products } from './demoData';

const modes = [
  { id: 'luxury', label: 'Demo 1', title: 'Luxury', note: 'Brand elevation' },
  { id: 'minimal', label: 'Demo 2', title: 'Minimalistic', note: 'Sales conversion' },
  { id: 'interactive', label: 'Demo 3', title: 'Interactive', note: 'Technical capability' },
] as const;

type Mode = (typeof modes)[number]['id'];

export default function RoyalLegacyzDemo() {
  const [entered, setEntered] = useState(false);
  const [mode, setMode] = useState<Mode>('luxury');

  if (!entered) {
    return (
      <main className="relative grid min-h-screen place-items-center overflow-hidden bg-ink px-6 text-cream">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(216,173,69,0.18),transparent_30%),radial-gradient(circle_at_50%_105%,rgba(239,232,216,0.08),transparent_38%)]" />
        <div className="absolute inset-5 border border-champagne/20" />
        <a
          href="/showcase/"
          className="absolute left-6 top-6 z-10 font-sans text-xs uppercase tracking-[0.35em] text-mist transition hover:text-champagne"
        >
          DEMO
        </a>
        <section className="relative mx-auto max-w-4xl text-center">
          <img
            src={assetPath('/images/royallegacyz-logo.jpg')}
            alt=""
            className="mx-auto mb-9 h-16 w-16 rounded-full object-cover opacity-80"
          />
          <p className="font-sans text-xs uppercase tracking-[0.65em] text-champagne">Welcome</p>
          <h1 className="mt-7 font-serif text-6xl leading-none sm:text-8xl lg:text-9xl">
            Royal Legacyz
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-mist sm:text-lg">
            Three homepage directions for a fashion brand that wants to feel premium,
            credible, and ready to sell.
          </p>
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="mt-12 border border-champagne/40 px-9 py-4 font-sans text-xs font-bold uppercase tracking-[0.38em] text-cream transition duration-500 hover:border-champagne hover:bg-champagne hover:text-ink"
          >
            Enter RoyalLegacyz
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-ink text-cream">
      <DemoChrome mode={mode} setMode={setMode} />
      {mode === 'luxury' && <LuxuryDemo />}
      {mode === 'minimal' && <MinimalDemo />}
      {mode === 'interactive' && <InteractiveDemo />}
    </main>
  );
}

function DemoChrome({
  mode,
  setMode,
}: {
  mode: Mode;
  setMode: (mode: Mode) => void;
}) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 px-4 py-4 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-champagne/25 bg-ink/75 px-4 py-3 shadow-royal backdrop-blur-xl">
        <a href="/showcase/" className="font-sans text-[0.65rem] uppercase tracking-[0.32em] text-mist">
          DEMO
        </a>
        <div className="flex rounded-full border border-cream/10 bg-cream/[0.04] p-1">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-full px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.24em] transition sm:px-5 ${
                mode === item.id ? 'bg-cream text-ink' : 'text-mist hover:text-cream'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoyalNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-7 font-sans text-xs uppercase tracking-[0.45em] text-mist sm:px-10">
      <div className="hidden gap-10 sm:flex">
        <a href="#collection">Collection</a>
        <a href="#lookbook">Lookbook</a>
      </div>
      <span className="text-champagne">Est. 2024</span>
      <div className="hidden gap-10 sm:flex">
        <a href="#live">TikTok Live</a>
        <a href="#shop">Shop</a>
      </div>
    </nav>
  );
}

function LuxuryDemo() {
  return (
    <div className="animate-demo-in overflow-hidden bg-ink">
      <section className="relative grid min-h-screen place-items-center px-6">
        <RoyalNav />
        <div className="absolute inset-5 border border-champagne/20" />
        <div className="text-center">
          <h1 className="font-serif text-7xl leading-[0.95] tracking-[0.16em] text-cream sm:text-8xl lg:text-[8.8rem]">
            ROYAL
            <br />
            LEGACY
          </h1>
          <div className="mx-auto my-16 h-24 w-px bg-champagne/70" />
          <p className="font-sans text-xs uppercase tracking-[0.6em] text-mist">Define your legacy</p>
        </div>
        <p className="absolute bottom-10 left-1/2 -translate-x-1/2 font-sans text-[0.65rem] uppercase tracking-[0.45em] text-mist">
          Scroll
        </p>
      </section>

      <section className="bg-cream px-6 py-28 text-ink sm:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-sans text-xs uppercase tracking-[0.55em] text-stone-500">Our philosophy</p>
          <h2 className="mt-10 font-serif text-4xl leading-tight sm:text-6xl">
            Where timeless elegance meets <span className="text-champagne">modern confidence.</span>
          </h2>
          <div className="mx-auto my-10 h-px w-24 bg-champagne/50" />
          <p className="mx-auto max-w-2xl text-base leading-8 text-stone-700">
            Royal Legacy crafts garments for those who understand that true luxury lies in the details.
            Each piece is designed to become a statement of your personal legacy.
          </p>
          <a className="mt-12 inline-flex border border-ink/25 px-8 py-4 font-sans text-xs font-bold uppercase tracking-[0.35em]" href="#shop">
            Shop on Shopee →
          </a>
        </div>
      </section>

      <FeaturedCollection />
      <LookbookSection />
      <LiveSection />
      <RoyalFooter />
    </div>
  );
}

function FeaturedCollection() {
  return (
    <section id="collection" className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex items-end justify-between gap-8">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.55em] text-champagne">New arrivals</p>
            <h2 className="mt-6 font-serif text-5xl sm:text-6xl">Featured Collection</h2>
          </div>
          <a href="#shop" className="hidden font-sans text-xs uppercase tracking-[0.4em] text-mist sm:block">
            View all →
          </a>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {products.map((product) => (
            <article key={product.title} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                <img src={product.src} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-5 top-5 bg-ink px-4 py-2 font-sans text-[0.62rem] font-bold uppercase tracking-[0.32em]">
                  {product.label}
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between font-serif text-2xl">
                <h3>{product.title}</h3>
                <span className="text-mist">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LookbookSection() {
  return (
    <section id="lookbook" className="bg-coal px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 grid gap-10 md:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.55em] text-champagne">Editorial</p>
            <h2 className="mt-5 font-serif text-5xl sm:text-6xl">The Lookbook</h2>
          </div>
          <p className="max-w-lg text-base leading-8 text-mist">
            A visual journey through our latest collections, captured in moments of effortless sophistication.
          </p>
        </div>
        <div className="grid auto-rows-[320px] gap-8 lg:grid-cols-2">
          {lookbook.map((item) => (
            <figure key={item.label} className={`relative overflow-hidden ${item.className}`}>
              <img src={item.src} alt="" className="h-full w-full object-cover" />
              <figcaption className="absolute bottom-6 left-6 bg-ink px-5 py-3 font-sans text-[0.65rem] font-bold uppercase tracking-[0.35em]">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveSection() {
  return (
    <section id="live" className="px-6 py-24 text-center sm:py-32">
      <p className="font-sans text-xs uppercase tracking-[0.5em] text-champagne">● Live shopping</p>
      <h2 className="mx-auto mt-8 max-w-2xl font-serif text-5xl leading-tight sm:text-6xl">
        Join Us Live on <span className="text-champagne">TikTok</span>
      </h2>
      <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-mist">
        Experience exclusive drops, behind-the-scenes content, and real-time styling sessions.
      </p>
      <a className="mt-12 inline-flex bg-cream px-10 py-5 font-sans text-xs font-bold uppercase tracking-[0.35em] text-ink" href="#shop">
        Follow @RoyalLegacy →
      </a>
      <div className="mx-auto mt-20 grid max-w-2xl grid-cols-3 divide-x divide-champagne/20 border-t border-champagne/20 pt-10">
        {['Friday 8 PM MYT', 'Saturday 3 PM MYT', 'Sunday 8 PM MYT'].map((day) => (
          <p key={day} className="font-serif text-2xl">{day}</p>
        ))}
      </div>
    </section>
  );
}

function RoyalFooter() {
  return (
    <footer id="shop" className="border-t border-champagne/20 px-6 py-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <h2 className="font-serif text-4xl">Royal Legacy</h2>
          <p className="mt-5 max-w-sm leading-7 text-mist">
            Crafting timeless pieces for those who dare to define their own legacy.
          </p>
        </div>
        {['Shop', 'About', 'Support'].map((title) => (
          <div key={title}>
            <p className="font-sans text-xs uppercase tracking-[0.45em] text-champagne">{title}</p>
            <div className="mt-6 grid gap-4 text-sm text-mist">
              <a>New Arrivals</a>
              <a>Collections</a>
              <a>Contact</a>
            </div>
          </div>
        ))}
      </div>
    </footer>
  );
}

function MinimalDemo() {
  return (
    <div className="animate-demo-in bg-[#f3eee3] text-ink">
      <section className="grid min-h-screen items-center px-6 pb-20 pt-32">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.45em] text-champagne">RoyalLegacyz / Sales Demo</p>
            <h1 className="mt-8 font-serif text-6xl leading-none sm:text-8xl">Turn attention into orders.</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-stone-700">
              A clean commerce-first homepage that pushes shoppers toward Shopee, TikTok Live,
              and the pieces most likely to convert.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="bg-ink px-8 py-4 text-center font-sans text-xs font-bold uppercase tracking-[0.32em] text-cream" href="#minimal-products">
                Shop new arrivals
              </a>
              <a className="border border-ink/20 px-8 py-4 text-center font-sans text-xs font-bold uppercase tracking-[0.32em]" href="#live">
                TikTok schedule
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.slice(0, 2).map((product) => (
              <img key={product.title} src={product.src} alt="" className="aspect-[3/4] w-full object-cover" />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-ink/10 bg-white/45 px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-4">
          {conversionBenefits.map((benefit) => (
            <div key={benefit} className="border border-ink/10 bg-white/50 p-5 font-sans text-xs font-bold uppercase tracking-[0.22em]">
              {benefit}
            </div>
          ))}
        </div>
      </section>

      <section id="minimal-products" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between">
            <h2 className="font-serif text-5xl">Best sellers</h2>
            <a className="font-sans text-xs font-bold uppercase tracking-[0.35em]">View all →</a>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <article key={product.title} className="bg-white p-4 shadow-[0_18px_70px_rgba(0,0,0,0.08)]">
                <img src={product.src} alt="" className="aspect-[4/5] w-full object-cover" />
                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="font-serif text-2xl">{product.title}</p>
                    <p className="mt-1 text-sm text-stone-500">{product.label}</p>
                  </div>
                  <button className="bg-ink px-5 py-3 font-sans text-[0.65rem] font-bold uppercase tracking-[0.25em] text-cream">
                    Shop
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function InteractiveDemo() {
  return (
    <div className="animate-demo-in overflow-hidden bg-ink text-cream">
      <section className="relative min-h-screen px-6 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(216,173,69,0.16),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="font-sans text-xs uppercase tracking-[0.5em] text-champagne">Interactive capability</p>
            <h1 className="mt-8 font-serif text-6xl leading-none sm:text-8xl">A homepage that reacts like a launch.</h1>
            <p className="mt-8 text-lg leading-8 text-mist">
              Motion, hover states, product storytelling, and live-shopping moments built to show technical polish.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {products.map((product, index) => (
              <article
                key={product.title}
                className="group relative min-h-[520px] overflow-hidden border border-champagne/20 bg-cream/[0.04] transition duration-700 hover:-translate-y-4 hover:border-champagne/70"
                style={{ transform: `translateY(${index * 34}px)` }}
              >
                <img src={product.src} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-110 group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/70 to-transparent p-6">
                  <p className="font-sans text-[0.62rem] uppercase tracking-[0.35em] text-champagne">{product.label}</p>
                  <h2 className="mt-3 font-serif text-3xl">{product.title}</h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 md:grid-cols-4">
            {interactiveMoments.map((moment, index) => (
              <div
                key={moment}
                className="interactive-tile min-h-56 border border-champagne/20 bg-champagne/[0.04] p-6"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <span className="font-sans text-xs text-champagne">0{index + 1}</span>
                <p className="mt-20 font-serif text-3xl">{moment}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
