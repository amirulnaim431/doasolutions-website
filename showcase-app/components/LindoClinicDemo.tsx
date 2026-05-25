'use client';

import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

type DirectionKey = 'pearl' | 'clinical' | 'nocturne';

const serviceCards = [
  {
    title: 'Skin Booster & Hydration',
    copy: 'Glow-focused protocols for tired, dry, or stressed skin.',
  },
  {
    title: 'Botox & Fillers',
    copy: 'Refinement-led facial balancing with a natural finish.',
  },
  {
    title: 'PRP & Exosome Therapy',
    copy: 'Regenerative care for skin texture, repair, and radiance.',
  },
  {
    title: 'Body Slimming & Contouring',
    copy: 'Non-surgical support for sculpting and silhouette confidence.',
  },
  {
    title: 'Facial & Skin Wellness',
    copy: 'Treatment journeys built around skin condition, goals, and comfort.',
  },
  {
    title: 'Consultation & Planning',
    copy: 'Doctor-led assessment before recommending any aesthetic pathway.',
  },
];

const values = ['Safety first', 'Holistic wellness', 'Personalized care', 'Comfort and trust'];

const directions = {
  pearl: {
    label: 'Pearl Atelier',
    short: 'Soft Luxury',
    thesis: 'Feminine, calm, warm ivory and rose-gold. Best for making Lindo feel graceful, premium, and approachable to elite women customers.',
    hero: 'A softer way to renew confidence.',
    sub: 'Your destination for aesthetic and wellness care, designed around ageless beauty, comfort, trust, and personalized treatment plans.',
    cta: 'Book a private consultation',
    accent: '#c98f82',
    shell: 'bg-[#f8f1ec] text-[#3b2622]',
    nav: 'border-[#d8b7ae] bg-[#fffaf7]/85 text-[#5b3831]',
    eyebrow: 'text-[#b6786d]',
    card: 'border-[#e2c7bf] bg-white/66',
    darkCard: 'bg-[#5c3c35] text-[#fff8f2]',
    button: 'bg-[#6b453d] text-white hover:bg-[#4d302a]',
    ghost: 'border-[#6b453d] text-[#5a3932] hover:bg-[#6b453d] hover:text-white',
    heroImage:
      'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=1400&q=85',
    treatmentImage:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1400&q=85',
    detailImage:
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85',
  },
  clinical: {
    label: 'Clinical Prestige',
    short: 'Medical Premium',
    thesis: 'Clean, doctor-led, white space with cocoa and sage details. Best for building high trust around safety, evidence, and professional care.',
    hero: 'Doctor-led aesthetics, designed around trust.',
    sub: 'A premium skin and wellness clinic experience where every treatment begins with assessment, education, and a clear plan.',
    cta: 'Start skin assessment',
    accent: '#7b8d78',
    shell: 'bg-[#fbfaf7] text-[#151515]',
    nav: 'border-[#d9d5cc] bg-white/90 text-[#24211d]',
    eyebrow: 'text-[#697763]',
    card: 'border-[#ded8cc] bg-white',
    darkCard: 'bg-[#1f241e] text-[#f7f3ea]',
    button: 'bg-[#20241f] text-white hover:bg-[#3c4538]',
    ghost: 'border-[#20241f] text-[#20241f] hover:bg-[#20241f] hover:text-white',
    heroImage:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1400&q=85',
    treatmentImage:
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1400&q=85',
    detailImage:
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=1200&q=85',
  },
  nocturne: {
    label: 'Nocturne Elite',
    short: 'Private Concierge',
    thesis: 'Dark marble, champagne, velvet rose, and cinematic spacing. Best for positioning Lindo as exclusive, discreet, and elite-client focused.',
    hero: 'Private beauty rituals for an elite clientele.',
    sub: 'A high-touch aesthetic destination for clients who want privacy, precision, and a quietly luxurious rejuvenation journey.',
    cta: 'Request concierge booking',
    accent: '#d6b16d',
    shell: 'bg-[#090706] text-[#f4eee5]',
    nav: 'border-[#6d5737] bg-[#120f0d]/88 text-[#f4eee5]',
    eyebrow: 'text-[#d6b16d]',
    card: 'border-[#40311f] bg-[#15100d]',
    darkCard: 'bg-[#f1e6d6] text-[#241712]',
    button: 'bg-[#d6b16d] text-[#130d09] hover:bg-[#f0cf88]',
    ghost: 'border-[#d6b16d] text-[#f2dfbd] hover:bg-[#d6b16d] hover:text-[#130d09]',
    heroImage:
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1400&q=85',
    treatmentImage:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
    detailImage:
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=85',
  },
} satisfies Record<DirectionKey, {
  label: string;
  short: string;
  thesis: string;
  hero: string;
  sub: string;
  cta: string;
  accent: string;
  shell: string;
  nav: string;
  eyebrow: string;
  card: string;
  darkCard: string;
  button: string;
  ghost: string;
  heroImage: string;
  treatmentImage: string;
  detailImage: string;
}>;

const directionKeys: DirectionKey[] = ['pearl', 'clinical', 'nocturne'];

function SplitLogo({ accent }: { accent: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="grid h-11 w-11 place-items-center rounded-full border"
        style={{ borderColor: accent, color: accent }}
      >
        <span className="font-serif text-2xl leading-none">L</span>
      </div>
      <div>
        <p className="font-sans text-sm font-black uppercase tracking-[0.28em]">Lindo Clinic</p>
        <p className="mt-1 font-serif text-sm opacity-70">Rejuvenating Your Age</p>
      </div>
    </div>
  );
}

function ImagePanel({
  src,
  alt,
  className = '',
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/5" />
    </div>
  );
}

export default function LindoClinicDemo() {
  const [active, setActive] = useState<DirectionKey>('pearl');
  const direction = directions[active];
  const palette = useMemo(
    () => ({
      '--lindo-accent': direction.accent,
    }) as CSSProperties,
    [direction.accent],
  );

  return (
    <main className={`min-h-screen font-sans transition-colors duration-500 ${direction.shell}`} style={palette}>
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 sm:px-8">
        <div className={`mx-auto flex max-w-7xl items-center justify-between border px-4 py-3 shadow-2xl backdrop-blur-xl ${direction.nav}`}>
          <a href="/showcase/" className="font-sans text-[0.65rem] font-black uppercase tracking-[0.38em] opacity-70">
            Demo
          </a>
          <SplitLogo accent={direction.accent} />
          <div className="flex rounded-full border border-current/15 bg-current/[0.04] p-1">
            {directionKeys.map((key, index) => (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`rounded-full px-3 py-2 text-[0.62rem] font-black uppercase tracking-[0.22em] transition sm:px-4 ${
                  active === key ? 'bg-[var(--lindo-accent)] text-white shadow-lg' : 'opacity-65 hover:opacity-100'
                }`}
              >
                <span className="hidden sm:inline">{directions[key].label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-36 sm:px-10 lg:px-16">
        <div className="absolute inset-0 opacity-55">
          <div className="absolute left-[8%] top-[18%] h-64 w-64 rounded-full bg-[var(--lindo-accent)]/15 blur-3xl" />
          <div className="absolute bottom-[8%] right-[7%] h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
          <div>
            <p className={`font-sans text-xs font-black uppercase tracking-[0.6em] ${direction.eyebrow}`}>
              {direction.short}
            </p>
            <h1 className="mt-7 max-w-4xl font-serif text-[clamp(4.2rem,12vw,10.8rem)] leading-[0.78] tracking-[-0.06em]">
              {direction.hero}
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 opacity-75 sm:text-xl">{direction.sub}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#consultation" className={`px-7 py-4 text-center text-xs font-black uppercase tracking-[0.28em] transition ${direction.button}`}>
                {direction.cta}
              </a>
              <a href="#services" className={`border px-7 py-4 text-center text-xs font-black uppercase tracking-[0.28em] transition ${direction.ghost}`}>
                Explore services
              </a>
            </div>
          </div>

          <div className="relative min-h-[34rem]">
            <ImagePanel
              src={direction.heroImage}
              alt="Premium aesthetic clinic mood"
              className="absolute right-0 top-0 h-[72%] w-[78%] rounded-t-[8rem] shadow-2xl"
            />
            <ImagePanel
              src={direction.treatmentImage}
              alt="Aesthetic treatment"
              className="absolute bottom-0 left-0 h-[54%] w-[48%] border-8 border-current/10 shadow-2xl"
            />
            <div className={`absolute bottom-10 right-8 max-w-xs border p-6 shadow-2xl backdrop-blur ${direction.card}`}>
              <p className={`font-sans text-[0.65rem] font-black uppercase tracking-[0.42em] ${direction.eyebrow}`}>
                Direction
              </p>
              <h2 className="mt-3 font-serif text-4xl leading-none">{direction.label}</h2>
              <p className="mt-4 text-sm leading-6 opacity-75">{direction.thesis}</p>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.88fr_1.12fr]">
            <div>
              <p className={`font-sans text-xs font-black uppercase tracking-[0.55em] ${direction.eyebrow}`}>
                Ageless Aesthetics Services
              </p>
              <h2 className="mt-6 font-serif text-6xl leading-[0.92] tracking-[-0.04em] sm:text-8xl">
                Beauty, wellness, and confidence in one journey.
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {serviceCards.map((service) => (
                <article key={service.title} className={`border p-6 transition duration-300 hover:-translate-y-1 ${direction.card}`}>
                  <div className="mb-8 h-px w-full bg-[var(--lindo-accent)]/45" />
                  <h3 className="font-serif text-3xl leading-none">{service.title}</h3>
                  <p className="mt-5 text-sm leading-7 opacity-70">{service.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 sm:px-10 lg:px-16">
        <div className={`mx-auto grid max-w-7xl overflow-hidden lg:grid-cols-[0.9fr_1.1fr] ${direction.darkCard}`}>
          <ImagePanel src={direction.detailImage} alt="Lindo Clinic wellness detail" className="min-h-[28rem]" />
          <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
            <p className="font-sans text-xs font-black uppercase tracking-[0.55em] opacity-70">
              The Art of Beauty & Wellness
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-[0.95] tracking-[-0.03em] sm:text-7xl">
              Designed for clients who expect discretion, comfort, and visible care.
            </h2>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {values.map((value) => (
                <div key={value} className="border border-current/20 p-4 text-sm font-bold uppercase tracking-[0.2em]">
                  {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="consultation" className="px-6 py-24 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className={`font-sans text-xs font-black uppercase tracking-[0.55em] ${direction.eyebrow}`}>
                Patient Experience
              </p>
              <h2 className="mt-6 font-serif text-6xl leading-[0.9] tracking-[-0.04em] sm:text-8xl">
                From consultation to aftercare, every step feels considered.
              </h2>
            </div>
            <div className="grid gap-4">
              {['Private consultation', 'Skin and wellness assessment', 'Personalized treatment plan', 'Treatment day', 'Progress review and aftercare'].map(
                (step, index) => (
                  <div key={step} className={`grid grid-cols-[4rem_1fr] items-center border p-5 ${direction.card}`}>
                    <span className={`font-serif text-4xl ${direction.eyebrow}`}>{String(index + 1).padStart(2, '0')}</span>
                    <p className="text-xl font-semibold">{step}</p>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 pb-10 sm:px-10 lg:px-16">
        <div className={`mx-auto flex max-w-7xl flex-col gap-8 border-t py-10 sm:flex-row sm:items-end sm:justify-between ${direction.nav}`}>
          <div>
            <SplitLogo accent={direction.accent} />
            <p className="mt-5 max-w-xl text-sm leading-7 opacity-65">
              Demo redesign concept by DOA Solutions. Copy direction references Lindo Clinic&apos;s current positioning around aesthetic and wellness care.
            </p>
          </div>
          <a href="/showcase/" className={`w-fit px-6 py-3 text-xs font-black uppercase tracking-[0.25em] ${direction.button}`}>
            Back to DEMO
          </a>
        </div>
      </footer>
    </main>
  );
}
