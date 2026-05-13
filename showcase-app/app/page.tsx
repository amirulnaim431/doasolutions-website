const demos = [
  {
    name: 'RoyalLegacyz',
    href: '/showcase/royallegacyz/',
    tag: 'Streetwear ecommerce website',
    modes: 'Shop / Gallery / Loyalty profile / Live selling schedule',
  },
  {
    name: 'KKI',
    href: '/showcase/kki/',
    tag: 'Fabric retail + tailoring operations',
    modes: 'Customer order tracking / Consultation booking / Staff inventory webapp',
  },
];

export default function ShowcaseHub() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050403] text-cream">
      <section className="relative grid min-h-screen place-items-center px-6 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(216,173,69,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_30%)]" />
        <div className="absolute left-6 top-6 h-12 w-12 border-l border-t border-champagne/40 sm:left-10 sm:top-10" />
        <div className="absolute bottom-6 right-6 h-12 w-12 border-b border-r border-champagne/40 sm:bottom-10 sm:right-10" />

        <div className="relative mx-auto w-full max-w-5xl">
          <p className="mb-8 text-center font-sans text-xs font-semibold uppercase tracking-[0.65em] text-champagne">
            DEMO
          </p>
          <h1 className="mx-auto max-w-4xl text-center font-serif text-5xl leading-[0.95] text-cream sm:text-7xl lg:text-8xl">
            Demo systems built to be felt before they are clicked.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-center text-base leading-8 text-mist sm:text-lg">
            Select a concept below. Some demos are brand-facing homepages, others show how
            DOA can digitize the real business workflow behind the counter.
          </p>

          <div className="mt-16 grid gap-5">
            {demos.map((demo) => (
              <a
                key={demo.name}
                href={demo.href}
                className="group relative overflow-hidden border border-champagne/25 bg-cream/[0.035] p-6 transition duration-500 hover:-translate-y-1 hover:border-champagne/70 hover:bg-champagne/[0.08] sm:p-8"
              >
                <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_70%_50%,rgba(216,173,69,0.16),transparent_55%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="font-sans text-xs uppercase tracking-[0.5em] text-champagne">
                      {demo.tag}
                    </p>
                    <h2 className="mt-4 font-serif text-4xl text-cream sm:text-6xl">{demo.name}</h2>
                  </div>
                  <div className="max-w-md text-left sm:text-right">
                    <p className="text-sm leading-7 text-mist">{demo.modes}</p>
                    <p className="mt-4 font-sans text-xs font-bold uppercase tracking-[0.35em] text-cream">
                      Open demo <span className="text-champagne">-&gt;</span>
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
