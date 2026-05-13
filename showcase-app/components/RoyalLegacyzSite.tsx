import type { ReactNode } from 'react';
import { galleryGroups, liveSchedule, loyaltyTiers, products, rlzAsset, seasons } from './royalLegacyzData';

const navItems = [
  { label: 'Home', href: '/showcase/royallegacyz/' },
  { label: 'Shop', href: '/showcase/royallegacyz/shop/' },
  { label: 'Gallery', href: '/showcase/royallegacyz/gallery/' },
  { label: 'Loyalty', href: '/showcase/royallegacyz/profile/' },
  { label: 'About', href: '/showcase/royallegacyz/about/' },
];

export function RoyalLegacyzLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-white text-black">
      <header className="sticky top-0 z-50 border-b-2 border-black bg-white/92 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a href="/showcase/" className="text-[0.62rem] font-black uppercase tracking-[0.28em] text-black/45">
            DEMO
          </a>
          <a href="/showcase/royallegacyz/" className="flex items-center gap-3">
            <img
              src={rlzAsset('MediaRL.jpg')}
              alt="RoyalLegacyz"
              className="h-9 w-9 rounded-full object-cover"
            />
            <span className="text-sm font-black uppercase tracking-[-0.04em] sm:text-base">RoyalLegacyz.</span>
          </a>
          <nav className="hidden items-center gap-5 text-[0.68rem] font-black uppercase tracking-[0.14em] text-black/65 md:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-black">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
        <nav className="mx-auto mt-4 flex max-w-7xl gap-3 overflow-x-auto pb-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-black/62 md:hidden">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 rounded-full border border-black/12 px-3 py-2">
              {item.label}
            </a>
          ))}
        </nav>
      </header>
      {children}
      <RoyalFooter />
    </main>
  );
}

export function RoyalHome() {
  return (
    <RoyalLegacyzLayout>
      <section className="relative min-h-screen overflow-hidden px-5 pb-20 pt-24 sm:px-8 lg:px-10">
        <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-black lg:block" />
        <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.45em] text-black/45">Sales conversion focused</p>
            <h1 className="mt-7 max-w-3xl text-6xl font-black uppercase leading-[0.84] tracking-[-0.065em] sm:text-8xl lg:text-[8.5rem]">
              Streetwear that moves fast.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/65">
              A black and white sales-first storefront for RoyalLegacyz: drop launches,
              season collections, live selling, gallery proof, and loyalty progress in one clean flow.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a href="/showcase/royallegacyz/shop/" className="bg-black px-8 py-4 text-center text-xs font-black uppercase tracking-[0.28em] text-white">
                Shop drop
              </a>
              <a href="/showcase/royallegacyz/gallery/" className="border-2 border-black px-8 py-4 text-center text-xs font-black uppercase tracking-[0.28em]">
                View gallery
              </a>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4 lg:pl-8">
            <img
              src={rlzAsset('Header.jpg')}
              alt="RoyalLegacyz streetwear campaign"
              className="aspect-[3/4] w-full object-cover grayscale transition duration-700 hover:grayscale-0"
            />
            <img
              src={rlzAsset('Season2-Showcaseimage_alltogether.jpg')}
              alt="RoyalLegacyz Season 2 campaign"
              className="mt-16 aspect-[3/4] w-full object-cover grayscale transition duration-700 hover:grayscale-0"
            />
          </div>
        </div>
      </section>
      <FeaturedProducts />
      <SeasonSection />
      <LiveSection />
      <LoyaltyPreview />
    </RoyalLegacyzLayout>
  );
}

export function RoyalShop() {
  return (
    <RoyalLegacyzLayout>
      <PageHero
        eyebrow="Shop"
        title="All RoyalLegacyz drops, organized by season."
        copy="Season 1 and Season 2 are out now. Pickleball Edition is a special capsule. Season 3 is prepared as a coming-soon collection."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        {['Season 1', 'Special Edition', 'Season 2'].map((season) => (
          <div key={season} className="border-t border-black/12 py-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-black/45">Collection</p>
                <h2 className="mt-2 text-4xl font-black uppercase tracking-[-0.06em] sm:text-6xl">{season}</h2>
              </div>
              <span className="rounded-full border border-black/15 px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.18em]">
                Out now
              </span>
            </div>
            <ProductGrid products={products.filter((product) => product.season === season)} />
          </div>
        ))}
        <ComingSoonCard />
      </section>
    </RoyalLegacyzLayout>
  );
}

export function RoyalGallery() {
  return (
    <RoyalLegacyzLayout>
      <PageHero
        eyebrow="Gallery"
        title="Past seasons, current drops, and campaign proof."
        copy="This page is structured for final photoshoot assets later. For now it uses the supplied IG-extracted images as a visual demo."
      />
      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10">
        {galleryGroups.map((group) => (
          <div key={group.title} className="border-t border-black/12 py-12">
            <h2 className="mb-8 text-4xl font-black uppercase tracking-[-0.06em]">{group.title}</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {group.images.map((image, index) => (
                <img
                  key={image}
                  src={rlzAsset(image)}
                  alt={`${group.title} RoyalLegacyz gallery ${index + 1}`}
                  className={`h-64 w-full object-cover grayscale transition duration-700 hover:grayscale-0 ${index % 5 === 0 ? 'md:col-span-2 md:h-[34rem]' : ''}`}
                />
              ))}
            </div>
          </div>
        ))}
      </section>
    </RoyalLegacyzLayout>
  );
}

export function RoyalAbout() {
  return (
    <RoyalLegacyzLayout>
      <PageHero
        eyebrow="About RoyalLegacyz"
        title="A streetwear label built around community, drops, and legacy."
        copy="RoyalLegacyz can use the website as the brand home for collections, live shopping schedules, loyalty progress, and campaign archives."
      />
      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-24 sm:px-8 lg:grid-cols-[0.8fr_1fr] lg:px-10">
        <img src={rlzAsset('Season2-Showcaseimage_alltogether.jpg')} alt="RoyalLegacyz team campaign" className="h-full min-h-[32rem] w-full object-cover grayscale transition duration-700 hover:grayscale-0" />
        <div className="space-y-10">
          {[
            ['Brand positioning', 'A sharper digital presence helps the label look less like a temporary drop page and more like a serious streetwear brand.'],
            ['Sales flow', 'Products are grouped by season, with live shopping schedules and direct calls to action for customers who discover the brand through social media.'],
            ['Customer retention', 'The loyalty profile gives repeat buyers a visible goal after every purchase, turning RM spent into measurable progress.'],
          ].map(([title, copy]) => (
            <article key={title} className="border-t border-black/12 pt-7">
              <h2 className="text-2xl font-black uppercase tracking-[-0.04em]">{title}</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-black/62">{copy}</p>
            </article>
          ))}
        </div>
      </section>
    </RoyalLegacyzLayout>
  );
}

export function RoyalProfile() {
  const currentPoints = 640;
  const target = loyaltyTiers[0].target;
  const progress = Math.round((currentPoints / target) * 100);

  return (
    <RoyalLegacyzLayout>
      <PageHero
        eyebrow="Customer profile"
        title="Loyalty progress customers can actually understand."
        copy="Every RM1 spent earns 1 point. When a tier is reached, that point cycle resets to 0 and the next tier goal begins."
      />
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-8 lg:grid-cols-[0.85fr_1fr] lg:px-10">
        <div className="bg-black p-6 text-white sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">Demo customer</p>
          <h2 className="mt-4 text-5xl font-black uppercase tracking-[-0.06em]">Aiman R.</h2>
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-bold text-white/50">Current cycle</p>
                <p className="mt-2 text-5xl font-black">{currentPoints}</p>
              </div>
              <p className="text-right text-sm font-black uppercase tracking-[0.18em] text-white/60">
                {progress}% to Silver
              </p>
            </div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-white/12">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-5 text-sm leading-6 text-white/62">
              Spend RM360 more to reach Silver. Perks are shown as coming soon until RoyalLegacyz confirms the privilege list.
            </p>
          </div>
        </div>
        <div className="grid gap-4">
          {loyaltyTiers.map((tier, index) => (
            <article key={tier.name} className="border border-black/12 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-black/42">Tier {index + 1}</p>
                  <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em]">{tier.name}</h3>
                </div>
                <p className="text-right text-xl font-black">{tier.target.toLocaleString()} pts</p>
              </div>
              <p className="mt-5 text-base leading-7 text-black/62">{tier.note}</p>
            </article>
          ))}
        </div>
      </section>
    </RoyalLegacyzLayout>
  );
}

function PageHero({ eyebrow, title, copy }: { eyebrow: string; title: string; copy: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
      <p className="text-xs font-black uppercase tracking-[0.45em] text-black/42">{eyebrow}</p>
      <h1 className="mt-5 max-w-5xl text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl">
        {title}
      </h1>
      <p className="mt-7 max-w-3xl text-lg leading-8 text-black/60">{copy}</p>
    </section>
  );
}

function FeaturedProducts() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-black/42">Products</p>
          <h2 className="mt-3 text-5xl font-black uppercase tracking-[-0.07em] sm:text-7xl">Shop the line</h2>
        </div>
        <a href="/showcase/royallegacyz/shop/" className="text-xs font-black uppercase tracking-[0.22em] underline underline-offset-8">
          View all products
        </a>
      </div>
      <ProductGrid products={products.slice(0, 4)} />
    </section>
  );
}

function ProductGrid({ products: visibleProducts }: { products: typeof products }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {visibleProducts.map((product) => (
        <article key={`${product.season}-${product.name}`} className="group bg-white">
          <div className="relative overflow-hidden bg-black">
            <img
              src={rlzAsset(product.image)}
              alt={`${product.name} by RoyalLegacyz`}
              className="aspect-[3/4] w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
            />
            <div className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.14em] text-black">
              {product.status}
            </div>
          </div>
          <div className="border border-t-0 border-black/10 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-black/42">{product.season}</p>
                <h3 className="mt-2 text-xl font-black uppercase tracking-[-0.04em]">{product.name}</h3>
              </div>
              <p className="text-sm font-black">{product.price}</p>
            </div>
            <p className="mt-4 text-sm leading-6 text-black/56">{product.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function SeasonSection() {
  return (
    <section className="bg-black px-5 py-20 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="text-center text-xs font-black uppercase tracking-[0.4em] text-white/42">Collections</p>
        <h2 className="mx-auto mt-4 max-w-4xl text-center text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] sm:text-7xl">
          Seasons with clear launch status.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-4">
          {seasons.map((season) => (
            <article key={season.title} className="group relative min-h-[28rem] overflow-hidden">
              <img src={rlzAsset(season.image)} alt={`${season.title} RoyalLegacyz collection`} className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-white/62">{season.status}</p>
                <h3 className="mt-2 text-3xl font-black uppercase tracking-[-0.05em]">{season.title}</h3>
                <p className="mt-4 text-sm leading-6 text-white/64">{season.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function LiveSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.35em] text-black/42">Live schedule</p>
        <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
          Built for TikTok live selling.
        </h2>
      </div>
      <div className="space-y-3">
        {liveSchedule.map((item) => (
          <article key={item.day} className="grid gap-4 border border-black/10 bg-white p-5 sm:grid-cols-[0.4fr_0.35fr_1fr] sm:items-center">
            <p className="text-2xl font-black uppercase tracking-[-0.05em]">{item.day}</p>
            <p className="text-sm font-black">{item.time}</p>
            <p className="text-sm leading-6 text-black/60">{item.focus}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function LoyaltyPreview() {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10">
      <a href="/showcase/royallegacyz/profile/" className="block bg-black p-7 text-white transition hover:-translate-y-1 sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">Loyalty program</p>
        <div className="mt-6 grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
          <h2 className="text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl">
            RM1 equals 1 point.
          </h2>
          <p className="text-lg leading-8 text-white/66">
            Customers can see their current goal, tier target, and reset cycle from their profile.
            Silver starts at 1,000 points, Gold at 1,500, and Platinum at 2,500.
          </p>
        </div>
      </a>
    </section>
  );
}

function ComingSoonCard() {
  return (
    <section className="border-t border-black/12 pt-12">
      <div className="grid gap-6 bg-black p-8 text-white lg:grid-cols-[0.8fr_1fr] lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.35em] text-white/45">Coming soon</p>
          <h2 className="mt-4 text-5xl font-black uppercase tracking-[-0.07em] sm:text-7xl">Season 3</h2>
        </div>
        <p className="text-lg leading-8 text-white/66">
          Season 3 is reserved as a launch-ready collection page. Final product images, prices,
          and drop copy can be added once the photoshoot assets are confirmed.
        </p>
      </div>
    </section>
  );
}

function RoyalFooter() {
  return (
    <footer className="border-t-2 border-black bg-white px-5 py-10 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="text-3xl font-black uppercase tracking-[-0.06em]">RoyalLegacyz.</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-black/55">
            Streetwear storefront demo by DOA Solutions. Product, gallery, loyalty, and live selling flows are ready for final brand assets.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 md:justify-end">
          {['TikTok', 'Instagram', 'Shopee', 'WhatsApp'].map((item) => (
            <span key={item} className="rounded-full border border-black/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-black/62">
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
