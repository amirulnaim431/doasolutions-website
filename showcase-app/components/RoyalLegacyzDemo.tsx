'use client';

import { useState } from 'react';
import { assetPath, liveSchedule, lookbook, products, socials } from './demoData';

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
        <img
          src={assetPath('/images/crew-drop.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(216,173,69,0.22),transparent_30%),linear-gradient(180deg,rgba(7,4,2,0.45),#070402_88%)]" />
        <div className="absolute inset-5 border border-champagne/20" />
        <a
          href="/showcase/"
          className="absolute left-6 top-6 z-10 font-sans text-xs uppercase tracking-[0.35em] text-mist transition hover:text-champagne"
        >
          DEMO
        </a>
        <section className="relative mx-auto max-w-4xl text-center">
          <img
            src={assetPath('/images/royallegacyz-logo-mark.webp')}
            alt="RoyalLegacyz logo"
            className="mx-auto mb-8 h-28 w-28 rounded-xl object-cover shadow-royal"
          />
          <p className="font-sans text-xs uppercase tracking-[0.65em] text-champagne">Welcome</p>
          <h1 className="mt-7 font-serif text-6xl leading-none sm:text-8xl lg:text-9xl">
            Royal Legacyz
          </h1>
          <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-mist sm:text-lg">
            Three street fashion homepage directions: luxury elevation, clean sales conversion,
            and a louder interactive launch experience.
          </p>
          <button
            type="button"
            onClick={() => setEntered(true)}
            className="mt-12 border border-champagne/40 px-9 py-4 font-sans text-xs font-bold uppercase tracking-[0.32em] text-cream transition duration-500 hover:border-champagne hover:bg-champagne hover:text-ink"
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
    <div className="fixed inset-x-0 top-0 z-50 px-3 py-4 sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-cream/15 bg-ink/78 px-4 py-3 shadow-royal backdrop-blur-xl">
        <a href="/showcase/" className="font-sans text-[0.65rem] uppercase tracking-[0.28em] text-mist">
          DEMO
        </a>
        <div className="flex rounded-full border border-cream/10 bg-cream/[0.04] p-1">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-full px-3 py-2 text-[0.58rem] font-bold uppercase tracking-[0.18em] transition sm:px-5 ${
                mode === item.id ? 'bg-cream text-ink' : 'text-mist hover:text-cream'
              }`}
              title={`${item.title}: ${item.note}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BrandMark({ invert = false }: { invert?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src={assetPath('/images/royallegacyz-logo.jpg')}
        alt="RoyalLegacyz"
        className={`h-10 w-10 rounded-full object-cover ${invert ? 'invert' : ''}`}
      />
      <span className="font-sans text-xs font-black uppercase tracking-[0.28em]">RoyalLegacyz</span>
    </div>
  );
}

function LuxuryDemo() {
  return (
    <div className="animate-demo-in overflow-hidden bg-[#0a0603]">
      <section className="relative grid min-h-screen place-items-center px-6">
        <LuxuryNav />
        <img
          src={assetPath('/images/chamber-street.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,3,0.18),#0a0603_92%)]" />
        <div className="absolute inset-5 border border-champagne/20" />
        <div className="relative text-center">
          <p className="mb-8 font-sans text-xs uppercase tracking-[0.62em] text-champagne">Est. 2024</p>
          <h1 className="font-serif text-6xl leading-[0.95] tracking-[0.14em] text-cream sm:text-8xl lg:text-[8.3rem]">
            ROYAL
            <br />
            LEGACYZ
          </h1>
          <div className="mx-auto my-14 h-20 w-px bg-champagne/70" />
          <p className="font-sans text-xs uppercase tracking-[0.5em] text-mist">Define your legacy</p>
        </div>
      </section>

      <section className="bg-[#e9dfcf] px-6 py-28 text-ink sm:py-36">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-sans text-xs uppercase tracking-[0.55em] text-stone-500">Brand elevation</p>
          <h2 className="mt-10 font-serif text-4xl leading-tight sm:text-6xl">
            Where street identity meets <span className="text-[#b98628]">quiet luxury.</span>
          </h2>
          <div className="mx-auto my-10 h-px w-24 bg-champagne/50" />
          <p className="mx-auto max-w-2xl text-base leading-8 text-stone-700">
            A refined homepage direction for RoyalLegacyz: editorial spacing, premium contrast,
            and product moments that feel curated instead of crowded.
          </p>
        </div>
      </section>

      <ProductSection theme="luxury" />
      <LookbookSection />
      <LiveSection theme="luxury" />
      <RoyalFooter theme="luxury" />
    </div>
  );
}

function LuxuryNav() {
  return (
    <nav className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-7 font-sans text-xs uppercase tracking-[0.38em] text-mist sm:px-10">
      <div className="hidden gap-10 sm:flex">
        <a href="#products">Products</a>
        <a href="#live">Live</a>
      </div>
      <BrandMark />
      <div className="hidden gap-10 sm:flex">
        <a href="#lookbook">Lookbook</a>
        <a href="#footer">Social</a>
      </div>
    </nav>
  );
}

function ProductSection({ theme }: { theme: 'luxury' | 'minimal' | 'interactive' }) {
  const isMinimal = theme === 'minimal';
  const isInteractive = theme === 'interactive';

  return (
    <section
      id="products"
      className={`px-6 py-24 sm:py-32 ${
        isMinimal ? 'bg-white text-black' : isInteractive ? 'bg-[#f6ff00] text-black' : 'bg-[#0a0603] text-cream'
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p
              className={`font-sans text-xs font-black uppercase tracking-[0.45em] ${
                isMinimal ? 'text-black/50' : isInteractive ? 'text-[#ff2d95]' : 'text-champagne'
              }`}
            >
              Products
            </p>
            <h2 className={`mt-5 ${isMinimal ? 'font-sans text-5xl font-black uppercase sm:text-7xl' : 'font-serif text-5xl sm:text-6xl'}`}>
              New drop essentials
            </h2>
          </div>
          <a className="font-sans text-xs font-black uppercase tracking-[0.3em]" href="#live">
            Watch live drop -&gt;
          </a>
        </div>
        <div className={`grid gap-6 ${isInteractive ? 'md:grid-cols-4' : 'md:grid-cols-2 lg:grid-cols-4'}`}>
          {products.map((product, index) => (
            <article
              key={product.title}
              className={`group overflow-hidden ${
                isMinimal
                  ? 'border-2 border-black bg-white'
                  : isInteractive
                    ? 'rotate-[-1deg] border-4 border-black bg-white shadow-[10px_10px_0_#ff2d95] transition duration-500 hover:rotate-2 hover:shadow-[16px_16px_0_#00e5ff]'
                    : 'bg-cream/[0.035]'
              }`}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={product.src}
                  alt=""
                  className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                    isMinimal ? 'grayscale group-hover:grayscale-0' : ''
                  }`}
                />
                <span
                  className={`absolute left-4 top-4 px-4 py-2 font-sans text-[0.62rem] font-black uppercase tracking-[0.25em] ${
                    isMinimal || isInteractive ? 'bg-black text-white' : 'bg-ink text-cream'
                  }`}
                >
                  {product.label}
                </span>
              </div>
              <div className="p-5">
                <p className={`${isMinimal || isInteractive ? 'font-sans font-black uppercase' : 'font-serif'} text-2xl`}>
                  {product.title}
                </p>
                <div className="mt-4 flex items-center justify-between font-sans text-xs font-black uppercase tracking-[0.2em]">
                  <span>{product.price}</span>
                  <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                </div>
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
            A visual system for drops, fit checks, behind-the-scenes edits, and live-shopping moments.
          </p>
        </div>
        <div className="grid auto-rows-[320px] gap-8 lg:grid-cols-2">
          {lookbook.map((item) => (
            <figure key={item.label} className={`relative overflow-hidden ${item.className}`}>
              <img src={item.src} alt="" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
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

function LiveSection({ theme }: { theme: 'luxury' | 'minimal' | 'interactive' }) {
  const isMinimal = theme === 'minimal';
  const isInteractive = theme === 'interactive';

  return (
    <section
      id="live"
      className={`px-6 py-24 sm:py-32 ${
        isMinimal ? 'bg-black text-white' : isInteractive ? 'bg-[#00e5ff] text-black' : 'bg-[#0a0603] text-cream'
      }`}
    >
      <div className="mx-auto max-w-5xl text-center">
        <p
          className={`font-sans text-xs font-black uppercase tracking-[0.45em] ${
            isInteractive ? 'text-[#ff2d95]' : isMinimal ? 'text-white/55' : 'text-champagne'
          }`}
        >
          Live schedule
        </p>
        <h2 className={`${isMinimal || isInteractive ? 'font-sans font-black uppercase' : 'font-serif'} mx-auto mt-8 max-w-3xl text-5xl leading-tight sm:text-7xl`}>
          Catch the drop live on TikTok.
        </h2>
        <p className={`mx-auto mt-8 max-w-2xl text-base leading-8 ${isMinimal ? 'text-white/60' : isInteractive ? 'text-black/70' : 'text-mist'}`}>
          Product reveals, fit checks, limited-time bundles, and styling sessions built for fast decisions.
        </p>
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {liveSchedule.map((slot) => (
            <article
              key={slot.day}
              className={`p-6 text-left ${
                isMinimal
                  ? 'border border-white/20 bg-white/[0.04]'
                  : isInteractive
                    ? 'border-4 border-black bg-[#f6ff00] shadow-[8px_8px_0_#ff2d95]'
                    : 'border border-champagne/20 bg-cream/[0.035]'
              }`}
            >
              <p className={`${isMinimal || isInteractive ? 'font-sans font-black uppercase' : 'font-serif'} text-3xl`}>
                {slot.day}
              </p>
              <p className="mt-3 font-sans text-xs font-black uppercase tracking-[0.28em]">{slot.time}</p>
              <p className={`mt-6 text-sm leading-6 ${isMinimal ? 'text-white/55' : isInteractive ? 'text-black/70' : 'text-mist'}`}>{slot.note}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RoyalFooter({ theme }: { theme: 'luxury' | 'minimal' | 'interactive' }) {
  const isMinimal = theme === 'minimal';
  const isInteractive = theme === 'interactive';

  return (
    <footer
      id="footer"
      className={`px-6 py-16 ${
        isMinimal ? 'bg-white text-black' : isInteractive ? 'bg-[#ff2d95] text-black' : 'border-t border-champagne/20 bg-[#0a0603] text-cream'
      }`}
    >
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <BrandMark invert={isMinimal || isInteractive} />
          <p className={`mt-6 max-w-sm leading-7 ${isMinimal || isInteractive ? 'text-black/65' : 'text-mist'}`}>
            Streetwear demos for RoyalLegacyz: shop-ready, social-first, and built around live drops.
          </p>
          <div className="mt-8 flex gap-3">
            {socials.map((social) => (
              <span
                key={social}
                className={`grid h-11 w-11 place-items-center rounded-full border font-sans text-[0.62rem] font-black uppercase ${
                  isMinimal || isInteractive ? 'border-black text-black' : 'border-champagne/35 text-champagne'
                }`}
                title={social}
              >
                {social.slice(0, 2)}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-black uppercase tracking-[0.35em]">Shop</p>
          <div className={`mt-6 grid gap-4 text-sm ${isMinimal || isInteractive ? 'text-black/65' : 'text-mist'}`}>
            <a>New arrivals</a>
            <a>Live bundles</a>
            <a>Best sellers</a>
          </div>
        </div>
        <div>
          <p className="font-sans text-xs font-black uppercase tracking-[0.35em]">Support</p>
          <div className={`mt-6 grid gap-4 text-sm ${isMinimal || isInteractive ? 'text-black/65' : 'text-mist'}`}>
            <a>Size guide</a>
            <a>Shipping</a>
            <a>Returns</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MinimalDemo() {
  return (
    <div className="animate-demo-in bg-white text-black">
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-black lg:block" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <BrandMark invert />
            <p className="mt-12 font-sans text-xs font-black uppercase tracking-[0.45em] text-black/45">
              Sales conversion focused
            </p>
            <h1 className="mt-7 font-sans text-6xl font-black uppercase leading-[0.88] tracking-[-0.04em] sm:text-8xl">
              Streetwear that moves fast.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/65">
              A cleaner black-and-white shop direction made for quick product scanning,
              strong calls-to-action, and TikTok-to-Shopee buying flow.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="bg-black px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.28em] text-white" href="#products">
                Shop drop
              </a>
              <a className="border-2 border-black px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.28em]" href="#live">
                Live schedule
              </a>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            <img src={assetPath('/images/street-hoodie.jpg')} alt="" className="aspect-[3/4] w-full object-cover grayscale" />
            <img src={assetPath('/images/black-graphic-fit.jpg')} alt="" className="mt-16 aspect-[3/4] w-full object-cover grayscale" />
          </div>
        </div>
      </section>

      <ProductSection theme="minimal" />
      <LiveSection theme="minimal" />
      <RoyalFooter theme="minimal" />
    </div>
  );
}

function InteractiveDemo() {
  return (
    <div className="animate-demo-in overflow-hidden bg-[#f6ff00] text-black">
      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_25%,#ff2d95_0_16%,transparent_17%),radial-gradient(circle_at_80%_18%,#00e5ff_0_18%,transparent_19%)] opacity-90" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <BrandMark invert />
            <p className="mt-12 font-sans text-xs font-black uppercase tracking-[0.45em]">Interactive capability</p>
            <h1 className="mt-7 font-sans text-6xl font-black uppercase leading-[0.86] tracking-[-0.05em] sm:text-8xl">
              Drop energy on every scroll.
            </h1>
            <p className="mt-8 max-w-xl text-lg font-semibold leading-8 text-black/70">
              A louder launch-style homepage with bold colors, moving product cards,
              and social-first sections for a brand that wants attention.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {products.slice(0, 3).map((product, index) => (
              <article
                key={product.title}
                className="group relative min-h-[500px] overflow-hidden border-4 border-black bg-white shadow-[12px_12px_0_#ff2d95] transition duration-700 hover:-translate-y-4 hover:rotate-2 hover:shadow-[18px_18px_0_#00e5ff]"
                style={{ transform: `translateY(${index * 34}px) rotate(${index % 2 === 0 ? '-2deg' : '2deg'})` }}
              >
                <img src={product.src} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                <div className="absolute inset-x-0 bottom-0 bg-black p-5 text-white">
                  <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.3em] text-[#f6ff00]">{product.label}</p>
                  <h2 className="mt-2 font-sans text-2xl font-black uppercase">{product.title}</h2>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ProductSection theme="interactive" />
      <LiveSection theme="interactive" />
      <RoyalFooter theme="interactive" />
    </div>
  );
}
