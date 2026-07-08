'use client';

import { useMemo, useState, type ReactNode } from 'react';

type TabKey = 'home' | 'services' | 'booking' | 'reviews' | 'safety' | 'admin' | 'profile';
type KycStatus = 'Not submitted' | 'Submitted' | 'Under review' | 'Verified' | 'Rejected';

const navItems: { key: TabKey; label: string }[] = [
  { key: 'home', label: 'Home' },
  { key: 'services', label: 'Services' },
  { key: 'booking', label: 'Booking' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'safety', label: 'Therapist Safety' },
  { key: 'admin', label: 'Admin Board' },
  { key: 'profile', label: 'Customer Profile' },
];

const areas = [
  'Petaling Jaya',
  'Shah Alam',
  'Subang Jaya',
  'Ampang',
  'Cheras',
  'Bangi',
  'Seri Kembangan',
  'Damansara',
  'KL City Centre',
];

const services = [
  {
    category: 'Massage',
    treatments: ['Signature Inaz Massage', 'Foot Reflexology', 'Postnatal / pantang package'],
    price: 168,
    image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=85',
    copy: 'Relaxing home massage with clean linens, female therapists, and clear arrival updates.',
  },
  {
    category: 'Facial',
    treatments: ['Hydrating Facial Treatment', 'Calming Sensitive Skin Facial', 'Glow Express Facial'],
    price: 188,
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85',
    copy: 'A compact facial setup brought to your home, hotel room, office, or private care location.',
  },
  {
    category: 'Nail care',
    treatments: ['Mani Pedi', 'Add-on express mani', 'Classic Pedicure'],
    price: 98,
    image: 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=1200&q=85',
    copy: 'Neat, hygienic nail care for busy mothers, aunties, bridesmaids, and office teams.',
  },
  {
    category: 'Packages',
    treatments: ['Mother Care Recovery', 'Couple Ladies Pamper Set', 'Monthly Home Spa Plan'],
    price: 288,
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=85',
    copy: 'Bundled treatments for longer sessions, gifting, postnatal care, and family bookings.',
  },
];

const therapists = [
  {
    name: 'Farah',
    role: 'Massage therapist',
    gender: 'Female',
    skills: ['Signature massage', 'Foot reflexology', 'Pantang care'],
    areas: ['Petaling Jaya', 'Damansara'],
    availability: '10:00 AM - 7:00 PM',
    status: 'assigned',
    rating: 4.9,
    jobs: 812,
    notes: 'Very requested for postnatal and elderly care customers.',
  },
  {
    name: 'Husna',
    role: 'Facial beautician',
    gender: 'Female',
    skills: ['Hydrating facial', 'Sensitive skin', 'Glow express'],
    areas: ['KL City Centre', 'Ampang'],
    availability: '11:00 AM - 8:00 PM',
    status: 'available',
    rating: 4.8,
    jobs: 544,
    notes: 'Strong customer education, gentle with first-timers.',
  },
  {
    name: 'Fikria',
    role: 'Nail beautician',
    gender: 'Female',
    skills: ['Mani pedi', 'Express mani', 'Classic pedicure'],
    areas: ['Shah Alam', 'Subang Jaya'],
    availability: '9:30 AM - 6:30 PM',
    status: 'on the way',
    rating: 4.7,
    jobs: 438,
    notes: 'Good for office group bookings and bridal prep.',
  },
  {
    name: 'Farahin',
    role: 'All-rounder',
    gender: 'Female',
    skills: ['Massage', 'Facial', 'Nail care'],
    areas: ['Cheras', 'Seri Kembangan'],
    availability: '12:00 PM - 9:00 PM',
    status: 'arrived',
    rating: 4.9,
    jobs: 690,
    notes: 'Can handle multi-service bookings with tight timing.',
  },
  {
    name: 'Fieza',
    role: 'Massage therapist',
    gender: 'Female',
    skills: ['Signature massage', 'Foot reflexology'],
    areas: ['Bangi', 'Seri Kembangan'],
    availability: '10:30 AM - 7:30 PM',
    status: 'off day',
    rating: 4.8,
    jobs: 501,
    notes: 'Preferred for calm, quiet sessions.',
  },
];

const reviews = [
  {
    customer: 'Nadia R.',
    service: 'Signature Inaz Massage',
    area: 'Petaling Jaya',
    therapist: 'Farah',
    rating: 5,
    feedback:
      'Farah sampai awal sikit and setup very clean. Massage pressure just nice, rasa lega bahu sebab selalu carry baby.',
    suggestion: 'Maybe can add warm ginger drink option for pantang package.',
    date: '8 Jul 2026',
  },
  {
    customer: 'Puan Azlina',
    service: 'Facial Treatment',
    area: 'Ampang',
    therapist: 'Husna',
    rating: 5,
    feedback:
      'Senang sangat sebab tak payah drive keluar. Husna explain step by step, kulit rasa lembap and tak pedih.',
    suggestion: 'Bagus kalau ada reminder WhatsApp untuk aftercare.',
    date: '4 Jul 2026',
  },
  {
    customer: 'Mira S.',
    service: 'Mani Pedi',
    area: 'Shah Alam',
    therapist: 'Fikria',
    rating: 4,
    feedback:
      'Booked for my mum at home. She suka sebab therapist sabar and kemas. Payment link pun easy.',
    suggestion: 'More nude colour choices please.',
    date: '30 Jun 2026',
  },
  {
    customer: 'Cikgu Hani',
    service: 'Foot Reflexology',
    area: 'Bangi',
    therapist: 'Fieza',
    rating: 5,
    feedback:
      'Balik sekolah terus buat reflexology kat rumah. Tak crowded, tak rushing, therapist sopan.',
    suggestion: 'Would repeat if nearby promo comes to Bangi again.',
    date: '27 Jun 2026',
  },
];

const todayBookings = [
  ['10:00 AM', 'Nadia R.', 'Petaling Jaya', 'Signature Massage', 'Assigned', 'Farah'],
  ['12:30 PM', 'Puan Azlina', 'Ampang', 'Facial Treatment', 'Confirmed', 'Husna'],
  ['2:00 PM', 'Mira S.', 'Shah Alam', 'Mani Pedi', 'On The Way', 'Fikria'],
  ['5:30 PM', 'Cikgu Hani', 'Bangi', 'Foot Reflexology', 'Pending Payment', 'Fieza'],
];

const clusters = [
  {
    name: 'PJ Comfort Loop',
    areas: ['Petaling Jaya', 'Damansara', 'Subang Jaya'],
    therapist: 'Farah',
    window: '3:30 PM - 5:00 PM',
    eligible: 28,
  },
  {
    name: 'KL East Glow',
    areas: ['KL City Centre', 'Ampang', 'Cheras'],
    therapist: 'Husna',
    window: '6:00 PM - 7:30 PM',
    eligible: 19,
  },
  {
    name: 'South Care Ring',
    areas: ['Bangi', 'Seri Kembangan', 'Cheras'],
    therapist: 'Farahin',
    window: '1:00 PM - 2:30 PM',
    eligible: 16,
  },
];

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function SectionTitle({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-black uppercase tracking-[0.34em] text-[#9f674f]">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-4xl leading-[0.98] text-[#401b22] sm:text-6xl">{title}</h2>
      {copy ? <p className="mt-5 text-base leading-8 text-[#6d5550]">{copy}</p> : null}
    </div>
  );
}

function Pill({ children, tone = 'rose' }: { children: ReactNode; tone?: 'rose' | 'gold' | 'cream' }) {
  return (
    <span
      className={cx(
        'inline-flex min-h-8 items-center rounded-full border px-3 text-xs font-bold',
        tone === 'gold' && 'border-[#cba44b]/40 bg-[#f6e5ad] text-[#65490c]',
        tone === 'rose' && 'border-[#e6b7af] bg-[#fff4f1] text-[#7b303e]',
        tone === 'cream' && 'border-[#eadac1] bg-[#fffaf1] text-[#6d5550]',
      )}
    >
      {children}
    </span>
  );
}

export default function InazMobileSpaDemo() {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [category, setCategory] = useState('Massage');
  const selectedService = services.find((service) => service.category === category) ?? services[0];
  const [treatment, setTreatment] = useState(selectedService.treatments[0]);
  const [duration, setDuration] = useState('90 minutes');
  const [date, setDate] = useState('2026-07-08');
  const [time, setTime] = useState('3:30 PM');
  const [area, setArea] = useState('Petaling Jaya');
  const [gender, setGender] = useState('Female');
  const [recipient, setRecipient] = useState('For myself');
  const [therapist, setTherapist] = useState('No preference');
  const [notes, setNotes] = useState('Quiet room, medium pressure, parking available at lobby.');
  const [kycStatus, setKycStatus] = useState<KycStatus>('Under review');
  const [discount, setDiscount] = useState(10);
  const [promoArea, setPromoArea] = useState('Petaling Jaya');

  const isSameDay = date === '2026-07-08';
  const durationAdd = duration === '120 minutes' ? 70 : duration === '60 minutes' ? -35 : 0;
  const basePrice = selectedService.price + durationAdd;
  const surcharge = isSameDay ? 30 : 0;
  const promoEligible = ['Petaling Jaya', 'Damansara', 'Subang Jaya'].includes(area);
  const discountAmount = promoEligible ? Math.round((basePrice * discount) / 100) : 0;
  const total = basePrice + surcharge - discountAmount;

  const summary = useMemo(
    () => [
      { label: "Today's bookings", value: '24' },
      { label: 'Pending bookings', value: '7' },
      { label: 'Same-day bookings', value: '11' },
      { label: 'E-KYC pending', value: '5' },
      { label: 'Promo bookings', value: '9' },
      { label: 'Revenue today', value: 'RM 5,840' },
    ],
    [],
  );

  return (
    <main className="min-h-screen bg-[#fff8ef] font-sans text-[#321d1d]">
      <header className="sticky top-0 z-50 border-b border-[#ead7c7] bg-[#fff8ef]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/showcase/" className="text-xs font-black uppercase tracking-[0.32em] text-[#7b303e]">
            Demo
          </a>
          <button
            type="button"
            onClick={() => setActiveTab('home')}
            className="min-h-12 text-left"
            aria-label="Open Inaz Mobile Spa home"
          >
            <p className="font-serif text-2xl font-bold leading-none text-[#401b22]">Inaz Mobile Spa</p>
            <p className="mt-1 text-[0.68rem] font-bold uppercase tracking-[0.26em] text-[#b28a45]">
              By women for women
            </p>
          </button>
          <a
            href="https://wa.me/60123456789?text=Hi%20Inaz%20Team%2C%20I%20want%20to%20book%20home%20spa"
            className="hidden min-h-11 items-center rounded-full bg-[#6f2435] px-5 text-sm font-bold text-white shadow-lg shadow-[#6f2435]/20 transition hover:bg-[#521827] sm:inline-flex"
          >
            Chat With Inaz Team
          </a>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8" aria-label="Demo sections">
          {navItems.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setActiveTab(item.key)}
              className={cx(
                'min-h-11 shrink-0 rounded-full border px-4 text-sm font-bold transition',
                activeTab === item.key
                  ? 'border-[#6f2435] bg-[#6f2435] text-white'
                  : 'border-[#ead7c7] bg-white/70 text-[#5f4640] hover:border-[#d6a55f]',
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'home' ? (
        <>
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[#f7e6d7]" />
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1800&q=85"
              alt="Calm spa treatment setup with towels and natural products"
              className="absolute inset-0 h-full w-full object-cover opacity-28"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fff8ef] via-[#fff8ef]/88 to-[#fff8ef]/40" />
            <div className="relative mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.44em] text-[#9f674f]">KL & Selangor mobile spa</p>
                <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.92] text-[#401b22] sm:text-7xl lg:text-8xl">
                  Spa That Comes To You
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-[#654d48]">
                  Mobile massage, facial, and nail care across KL and Selangor, handled by female therapists with clean setup, clear booking flow, and comfort-first service.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setActiveTab('booking')}
                    className="min-h-12 rounded-full bg-[#6f2435] px-7 text-base font-bold text-white shadow-xl shadow-[#6f2435]/20 transition hover:bg-[#521827]"
                  >
                    Book Home Spa
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('admin')}
                    className="min-h-12 rounded-full border border-[#cba44b] bg-[#f6e5ad] px-7 text-base font-bold text-[#65490c] transition hover:bg-[#efd37e]"
                  >
                    Check Nearby Promo
                  </button>
                </div>
                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  {['No traffic', 'Female therapists', 'Home comfort'].map((item) => (
                    <div key={item} className="rounded-lg border border-[#ead7c7] bg-white/75 p-4 shadow-sm">
                      <p className="font-bold text-[#401b22]">{item}</p>
                      <p className="mt-2 text-sm leading-6 text-[#715b55]">Simple, private, and easy for families.</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-[2rem] border border-white/70 bg-white/72 p-4 shadow-2xl shadow-[#9f674f]/20 backdrop-blur">
                <img
                  src="https://images.unsplash.com/photo-1591343395082-e120087004b4?auto=format&fit=crop&w=1200&q=85"
                  alt="Home spa towels and skincare products prepared for treatment"
                  className="h-[24rem] w-full rounded-[1.5rem] object-cover"
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg bg-[#fff4f1] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#7b303e]">Same-day notice</p>
                    <p className="mt-2 text-sm leading-6 text-[#664c48]">Today bookings include a clearly shown RM30 surcharge before checkout.</p>
                  </div>
                  <div className="rounded-lg bg-[#f6e5ad] p-4">
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#65490c]">Nearby Slot Promo</p>
                    <p className="mt-2 text-sm leading-6 text-[#65490c]">Therapist already nearby in Petaling Jaya today. Enjoy 10% off.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <HomeSections setActiveTab={setActiveTab} />
        </>
      ) : null}

      {activeTab === 'services' ? <ServicesSection /> : null}

      {activeTab === 'booking' ? (
        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_24rem] lg:px-8">
          <div className="rounded-lg border border-[#ead7c7] bg-white p-5 shadow-sm sm:p-8">
            <SectionTitle
              eyebrow="Customer booking flow"
              title="A gentle booking form, not a government form."
              copy="The customer picks service, timing, location, safety details, and optional therapist preference. Same-day surcharge and nearby promo logic update instantly."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold">
                Service category
                <select
                  value={category}
                  onChange={(event) => {
                    const next = event.target.value;
                    setCategory(next);
                    setTreatment(services.find((service) => service.category === next)?.treatments[0] ?? '');
                  }}
                  className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base"
                >
                  {services.map((service) => (
                    <option key={service.category}>{service.category}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Specific treatment
                <select value={treatment} onChange={(event) => setTreatment(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  {selectedService.treatments.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Duration
                <select value={duration} onChange={(event) => setDuration(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  <option>60 minutes</option>
                  <option>90 minutes</option>
                  <option>120 minutes</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Preferred date
                <input value={date} onChange={(event) => setDate(event.target.value)} type="date" className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Preferred time
                <select value={time} onChange={(event) => setTime(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  {['10:00 AM', '12:30 PM', '3:30 PM', '5:30 PM', '8:00 PM'].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Area
                <select value={area} onChange={(event) => setArea(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  {areas.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                Location/address
                <input defaultValue="Damansara Uptown condo, lobby parking available" className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Customer gender
                <select value={gender} onChange={(event) => setGender(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  <option>Female</option>
                  <option>Male</option>
                  <option>Prefer to verify first</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Booking for
                <select value={recipient} onChange={(event) => setRecipient(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  <option>For myself</option>
                  <option>For my mother</option>
                  <option>For my wife/sister</option>
                  <option>For a friend</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold">
                Preferred therapist
                <select value={therapist} onChange={(event) => setTherapist(event.target.value)} className="min-h-12 rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 text-base">
                  <option>No preference</option>
                  {therapists.map((item) => (
                    <option key={item.name}>{item.name}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold sm:col-span-2">
                Notes/special request
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} rows={4} className="rounded-lg border border-[#dfc9bb] bg-[#fffaf5] px-4 py-3 text-base" />
              </label>
            </div>
          </div>
          <aside className="h-fit rounded-lg border border-[#ead7c7] bg-[#401b22] p-5 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.32em] text-[#f6d983]">Checkout preview</p>
            <h3 className="mt-4 font-serif text-4xl">{treatment}</h3>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4"><span>Service</span><strong>RM {basePrice}</strong></div>
              <div className="flex justify-between gap-4"><span>Same-day surcharge</span><strong>{surcharge ? `RM ${surcharge}` : 'RM 0'}</strong></div>
              <div className="flex justify-between gap-4"><span>Nearby Slot Promo</span><strong>{discountAmount ? `-RM ${discountAmount}` : 'Not eligible'}</strong></div>
              <div className="border-t border-white/20 pt-3 text-lg">
                <div className="flex justify-between gap-4"><span>Total</span><strong>RM {total}</strong></div>
              </div>
            </div>
            {isSameDay ? (
              <div className="mt-5 rounded-lg border border-[#f6d983]/50 bg-[#f6d983]/15 p-4 text-sm leading-6 text-[#fff5cf]">
                Same-Day Booking Surcharge applies because this booking is for 8 July 2026.
              </div>
            ) : null}
            {promoEligible ? (
              <div className="mt-3 rounded-lg bg-white/10 p-4 text-sm leading-6">
                Therapist already nearby in Petaling Jaya today. Book a slot today and enjoy {discount}% off with no extra travel charge.
              </div>
            ) : null}
            <button type="button" className="mt-5 min-h-12 w-full rounded-full bg-[#f6d983] px-5 font-bold text-[#401b22]">
              Confirm Demo Booking
            </button>
          </aside>
        </section>
      ) : null}

      {activeTab === 'reviews' ? <ReviewsSection /> : null}

      {activeTab === 'safety' ? (
        <SafetySection kycStatus={kycStatus} setKycStatus={setKycStatus} />
      ) : null}

      {activeTab === 'admin' ? (
        <AdminBoard
          summary={summary}
          promoArea={promoArea}
          setPromoArea={setPromoArea}
          discount={discount}
          setDiscount={setDiscount}
        />
      ) : null}

      {activeTab === 'profile' ? (
        <ProfileSection kycStatus={kycStatus} setActiveTab={setActiveTab} />
      ) : null}

      <footer className="border-t border-[#ead7c7] bg-[#401b22] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-serif text-3xl">Inaz Mobile Spa</p>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/72">
              Demo system by DOA Solutions for customer booking, staff operations, E-KYC, reviews, and geo-cluster promo workflows.
            </p>
          </div>
          <button onClick={() => setActiveTab('booking')} type="button" className="min-h-12 rounded-full bg-white px-6 font-bold text-[#401b22]">
            Book Home Spa
          </button>
        </div>
      </footer>
    </main>
  );
}

function HomeSections({ setActiveTab }: { setActiveTab: (tab: TabKey) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionTitle
          eyebrow="Popular services"
          title="Premium but friendly care for busy Malaysian women."
          copy="The customer side stays simple, while the operational layer handles therapist assignment, safety verification, and same-day pricing rules."
        />
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <article key={service.category} className="overflow-hidden rounded-lg border border-[#ead7c7] bg-white shadow-sm">
              <img src={service.image} alt={`${service.category} service`} className="h-44 w-full object-cover" />
              <div className="p-5">
                <Pill tone="cream">From RM {service.price}</Pill>
                <h3 className="mt-4 font-serif text-3xl text-[#401b22]">{service.category}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6d5550]">{service.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <button onClick={() => setActiveTab('booking')} type="button" className="rounded-lg bg-[#6f2435] p-6 text-left text-white">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#f6d983]">Booking</p>
          <p className="mt-3 font-serif text-3xl">Same-day surcharge shown before checkout.</p>
        </button>
        <button onClick={() => setActiveTab('admin')} type="button" className="rounded-lg bg-[#f6e5ad] p-6 text-left text-[#65490c]">
          <p className="text-sm font-black uppercase tracking-[0.26em]">Nearby promo</p>
          <p className="mt-3 font-serif text-3xl">Trigger cluster offers when therapists are nearby.</p>
        </button>
        <button onClick={() => setActiveTab('reviews')} type="button" className="rounded-lg border border-[#ead7c7] bg-white p-6 text-left">
          <p className="text-sm font-black uppercase tracking-[0.26em] text-[#9f674f]">Reviews</p>
          <p className="mt-3 font-serif text-3xl text-[#401b22]">Realistic Malaysian customer feedback.</p>
        </button>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Services"
        title="Massage, facial, nail care, add-ons, and packages."
        copy="Each service category is shown with pricing, treatment options, and staff skill alignment for admin assignment."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {services.map((service) => (
          <article key={service.category} className="grid overflow-hidden rounded-lg border border-[#ead7c7] bg-white shadow-sm lg:grid-cols-[15rem_1fr]">
            <img src={service.image} alt={`${service.category} spa treatment`} className="h-64 w-full object-cover lg:h-full" />
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                <Pill tone="gold">From RM {service.price}</Pill>
                <Pill tone="rose">Female staff</Pill>
              </div>
              <h3 className="mt-5 font-serif text-4xl text-[#401b22]">{service.category}</h3>
              <p className="mt-3 text-sm leading-7 text-[#6d5550]">{service.copy}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {service.treatments.map((item) => (
                  <Pill key={item} tone="cream">{item}</Pill>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Customer reviews"
        title="Feedback that sounds like real bookings, not placeholder copy."
        copy="Each review includes service, area, therapist, rating, suggestion, and date so the admin can spot repeat patterns."
      />
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {reviews.map((review) => (
          <article key={`${review.customer}-${review.date}`} className="rounded-lg border border-[#ead7c7] bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-3xl text-[#401b22]">{review.customer}</h3>
                <p className="mt-1 text-sm font-bold text-[#9f674f]">{review.service} in {review.area}</p>
              </div>
              <Pill tone="gold">{review.rating}.0 rating</Pill>
            </div>
            <p className="mt-5 text-base leading-8 text-[#4f3936]">{review.feedback}</p>
            <div className="mt-5 rounded-lg bg-[#fff4f1] p-4 text-sm leading-6 text-[#6d5550]">
              <strong className="text-[#7b303e]">Suggestion:</strong> {review.suggestion}
            </div>
            <p className="mt-4 text-sm text-[#7a625c]">Therapist: {review.therapist} · {review.date}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function SafetySection({ kycStatus, setKycStatus }: { kycStatus: KycStatus; setKycStatus: (status: KycStatus) => void }) {
  const statuses: KycStatus[] = ['Not submitted', 'Submitted', 'Under review', 'Verified', 'Rejected'];
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <SectionTitle
          eyebrow="E-KYC / gender verification"
          title="Safety verification without exposing sensitive data."
          copy="This demo shows the status flow and masked document preview only. Admin sees submitted name, gender, and approval actions, not unnecessary sensitive details."
        />
        <div className="mt-8 grid gap-3">
          {statuses.map((status, index) => (
            <button
              key={status}
              type="button"
              onClick={() => setKycStatus(status)}
              className={cx(
                'grid min-h-14 grid-cols-[3rem_1fr] items-center rounded-lg border p-3 text-left transition',
                kycStatus === status ? 'border-[#6f2435] bg-[#fff4f1]' : 'border-[#ead7c7] bg-white',
              )}
            >
              <span className="font-serif text-2xl text-[#9f674f]">{index + 1}</span>
              <span className="font-bold">{status}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-lg border border-[#ead7c7] bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#9f674f]">Admin review panel</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[#fffaf5] p-4">
            <p className="text-sm text-[#7a625c]">Submitted name</p>
            <p className="mt-1 text-lg font-bold">Nur Aina Binti Salleh</p>
          </div>
          <div className="rounded-lg bg-[#fffaf5] p-4">
            <p className="text-sm text-[#7a625c]">Declared gender</p>
            <p className="mt-1 text-lg font-bold">Female</p>
          </div>
          <div className="rounded-lg bg-[#fffaf5] p-4">
            <p className="text-sm text-[#7a625c]">Masked IC/passport preview</p>
            <p className="mt-1 text-lg font-bold">9007**-**-5***</p>
          </div>
          <div className="rounded-lg bg-[#fffaf5] p-4">
            <p className="text-sm text-[#7a625c]">Current status</p>
            <p className="mt-1 text-lg font-bold">{kycStatus}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => setKycStatus('Verified')} type="button" className="min-h-12 rounded-full bg-[#6f2435] px-6 font-bold text-white">
            Approve Verification
          </button>
          <button onClick={() => setKycStatus('Rejected')} type="button" className="min-h-12 rounded-full border border-[#6f2435] px-6 font-bold text-[#6f2435]">
            Reject
          </button>
        </div>
      </div>
    </section>
  );
}

function AdminBoard({
  summary,
  promoArea,
  setPromoArea,
  discount,
  setDiscount,
}: {
  summary: { label: string; value: string }[];
  promoArea: string;
  setPromoArea: (area: string) => void;
  discount: number;
  setDiscount: (discount: number) => void;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Booking operations board"
        title="A spa operations dashboard with the brand still in the room."
        copy="Admin can monitor today, assign staff, manage E-KYC, and trigger same-day area-cluster promos without exact live tracking."
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {summary.map((item) => (
          <div key={item.label} className="rounded-lg border border-[#ead7c7] bg-white p-5 shadow-sm">
            <p className="text-sm leading-5 text-[#7a625c]">{item.label}</p>
            <p className="mt-3 font-serif text-3xl text-[#401b22]">{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="min-w-0 rounded-lg border border-[#ead7c7] bg-white p-5 shadow-sm">
          <h3 className="font-serif text-3xl text-[#401b22]">Today&apos;s bookings</h3>
          <div className="mt-5 max-w-full overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <thead className="bg-[#fff4f1] text-[#7b303e]">
                <tr>
                  {['Time', 'Customer', 'Area', 'Service', 'Status', 'Therapist'].map((head) => (
                    <th key={head} className="px-4 py-3 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {todayBookings.map((row) => (
                  <tr key={row.join('-')} className="border-b border-[#f0ded2]">
                    {row.map((cell) => (
                      <td key={cell} className="px-4 py-4">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="rounded-lg border border-[#ead7c7] bg-[#401b22] p-5 text-white shadow-xl">
          <h3 className="font-serif text-3xl">Geo-cluster promo</h3>
          <p className="mt-3 text-sm leading-7 text-white/72">
            Create area clusters, view active therapist areas, set discount percentage and a same-day time window.
          </p>
          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-bold">
              Promo area
              <select value={promoArea} onChange={(event) => setPromoArea(event.target.value)} className="min-h-12 rounded-lg border border-white/20 bg-white px-4 text-[#321d1d]">
                {areas.map((area) => <option key={area}>{area}</option>)}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Discount percentage: {discount}%
              <input value={discount} min={5} max={25} onChange={(event) => setDiscount(Number(event.target.value))} type="range" />
            </label>
            <label className="grid gap-2 text-sm font-bold">
              Valid window
              <input defaultValue="3:30 PM - 5:00 PM" className="min-h-12 rounded-lg border border-white/20 bg-white px-4 text-[#321d1d]" />
            </label>
          </div>
          <div className="mt-5 rounded-lg bg-[#f6d983] p-4 text-[#401b22]">
            Therapist already nearby in {promoArea} today. Book a slot today and enjoy {discount}% off with no extra travel charge.
          </div>
        </div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {clusters.map((cluster) => (
          <article key={cluster.name} className="rounded-lg border border-[#ead7c7] bg-white p-5 shadow-sm">
            <Pill tone="gold">{cluster.eligible} eligible customers</Pill>
            <h3 className="mt-4 font-serif text-3xl text-[#401b22]">{cluster.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#6d5550]">{cluster.areas.join(' · ')}</p>
            <p className="mt-3 font-bold text-[#7b303e]">{cluster.therapist} available gap: {cluster.window}</p>
          </article>
        ))}
      </div>
      <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {therapists.map((person) => (
          <article key={person.name} className="rounded-lg border border-[#ead7c7] bg-white p-5 shadow-sm">
            <h3 className="font-serif text-3xl text-[#401b22]">{person.name}</h3>
            <p className="mt-1 text-sm font-bold text-[#9f674f]">{person.role}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="rose">{person.status}</Pill>
              <Pill tone="cream">{person.rating} rating</Pill>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#6d5550]">{person.areas.join(', ')}</p>
            <p className="mt-3 text-sm leading-6 text-[#6d5550]">{person.notes}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProfileSection({ kycStatus, setActiveTab }: { kycStatus: KycStatus; setActiveTab: (tab: TabKey) => void }) {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[24rem_1fr] lg:px-8">
      <aside className="rounded-lg border border-[#ead7c7] bg-white p-6 shadow-sm">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#9f674f]">Customer profile</p>
        <h2 className="mt-4 font-serif text-4xl text-[#401b22]">Nur Aina Salleh</h2>
        <p className="mt-2 text-sm leading-6 text-[#6d5550]">+60 12-345 6789 · Female</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Pill tone={kycStatus === 'Verified' ? 'gold' : 'rose'}>E-KYC: {kycStatus}</Pill>
          <Pill tone="cream">Favourite: Farah</Pill>
        </div>
        <button onClick={() => setActiveTab('safety')} type="button" className="mt-6 min-h-12 w-full rounded-full bg-[#6f2435] px-5 font-bold text-white">
          Review Verification
        </button>
      </aside>
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ['Address book', 'Damansara Uptown condo · Bangsar family home · KLCC hotel guest booking'],
          ['Upcoming bookings', '8 Jul 2026, 3:30 PM · Signature Inaz Massage · Farah'],
          ['Past bookings', 'Facial in Ampang · Mani Pedi in Shah Alam · Foot Reflexology in Bangi'],
          ['Reviews given', '4 reviews, average rating 4.8, latest suggestion: add warm drink option'],
        ].map(([title, copy]) => (
          <article key={title} className="rounded-lg border border-[#ead7c7] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-3xl text-[#401b22]">{title}</h3>
            <p className="mt-4 text-sm leading-7 text-[#6d5550]">{copy}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
