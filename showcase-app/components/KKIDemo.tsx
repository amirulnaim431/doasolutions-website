'use client';

import { useState } from 'react';

const assetPath = (path: string) => `/showcase${path}`;

type View = 'customer' | 'backoffice';
type CustomerTab = 'products' | 'profile' | 'tracking' | 'payments';
type OfficeTab = 'inventory' | 'colors' | 'reporting' | 'accounting' | 'payroll';

const colorMap = [
  ['KKI-001', 'Ivory Pearl', 'F-98', 'P-07', 'CN-101', 'Used for bridal lining and premium kurung'],
  ['KKI-002', 'Champagne Gold', 'G-21', 'SG-44', 'MX-09', 'Most requested raya family set color'],
  ['KKI-003', 'Dusty Rose', 'R-14', 'DR-8', 'F-302', 'Customer calls this dusty pink'],
  ['KKI-004', 'Sage Green', 'S-77', 'GR-19', 'L-58', 'Matched across cotton and chiffon'],
  ['KKI-005', 'Midnight Navy', 'N-04', 'NV-41', 'B-900', 'Office wear and men baju melayu'],
  ['KKI-006', 'Mocha Brown', 'BR-7', 'M-22', 'K-17', 'Popular for mother-daughter sets'],
  ['KKI-007', 'Ruby Maroon', 'RM-2', 'MR-11', 'R-77', 'Special order, low stock alert'],
  ['KKI-008', 'Soft Lilac', 'L-12', 'PR-66', 'V-18', 'Seasonal pastel group'],
];

const colorSwatches = ['#f2ead9', '#d9b56f', '#c98991', '#9cad92', '#111d35', '#80614d', '#7c1f28', '#c7b4db'];

const products = [
  {
    name: 'Dobby Chiffon Korea',
    code: 'KKI-DC-052',
    price: 'RM28 / meter',
    meters: 38.4,
    reserved: 11.2,
    location: 'Rack A2 / Roll 52',
    season: 'Seasonal Raya',
    image: assetPath('/images/kki-fabric-dobby.png'),
  },
  {
    name: 'Premium Satin Crepe',
    code: 'KKI-SC-017',
    price: 'RM36 / meter',
    meters: 24,
    reserved: 6.5,
    location: 'Rack B1 / Roll 17',
    season: 'Premium',
    image: assetPath('/images/kki-fabric-satin.png'),
  },
  {
    name: 'Soft Premium Cotton',
    code: 'KKI-PC-068',
    price: 'RM22 / meter',
    meters: 52.8,
    reserved: 18,
    location: 'Display Wall / Sample 68',
    season: 'Daily Wear',
    image: assetPath('/images/kki-fabric-premium.png'),
  },
];

const orders = [
  {
    id: 'TMP-1048',
    customer: 'Nur Aina',
    tier: 'Trusted spender',
    fabric: 'Dobby Chiffon Korea',
    status: 'Cutting',
    due: 'Today',
    progress: 62,
    total: 1480,
    paid: 500,
    balance: 980,
    payment: 'Installment',
  },
  {
    id: 'TMP-1049',
    customer: 'Farah Izzati',
    tier: 'Standard',
    fabric: 'Premium Satin Crepe',
    status: 'Sewing',
    due: 'Tomorrow',
    progress: 78,
    total: 620,
    paid: 620,
    balance: 0,
    payment: 'Paid full',
  },
  {
    id: 'TMP-1050',
    customer: 'Amira Zulaikha',
    tier: 'VIP',
    fabric: 'Soft Premium Cotton',
    status: 'Consultation',
    due: 'Friday',
    progress: 18,
    total: 2120,
    paid: 800,
    balance: 1320,
    payment: 'Installment',
  },
  {
    id: 'TMP-1051',
    customer: 'Hana Sofea',
    tier: 'Standard',
    fabric: 'Dobby Chiffon Korea',
    status: 'Finished',
    due: 'Ready',
    progress: 100,
    total: 390,
    paid: 390,
    balance: 0,
    payment: 'Paid full',
  },
];

const customerSteps = [
  ['Consultation', 'Design, kain, and budget confirmed', true],
  ['Measurement', 'Measurements saved into customer profile', true],
  ['Deposit', 'RM500 deposit received, balance scheduled', true],
  ['Cutting', 'Fabric allocated from Rack A2 / Roll 52', true],
  ['Sewing', 'Tailor queue, estimated 2 days', false],
  ['Ready', 'Pickup / runner delivery notification', false],
] as const;

const salesRows = [
  ['Today sales', 'RM8,420', '+18%'],
  ['Outstanding installment', 'RM2,300', '4 customers'],
  ['Reserved fabric', '35.7m', '9 tempahan'],
  ['Ready pickup', '8 orders', '3 unpaid balance'],
];

const payrollStaff = [
  {
    name: 'Nur Aisyah',
    role: 'Front Desk Executive',
    department: 'Operations',
    basic: 2800,
    allowance: 300,
    employeeKwsp: 341,
    employerKwsp: 403,
    socso: 54,
    eis: 12,
    status: 'Ready',
  },
  {
    name: 'Daniel Lim',
    role: 'Senior Developer',
    department: 'Technology',
    basic: 5200,
    allowance: 500,
    employeeKwsp: 627,
    employerKwsp: 741,
    socso: 86,
    eis: 22,
    status: 'Ready',
  },
  {
    name: 'Siti Hajar',
    role: 'Account Admin',
    department: 'Finance',
    basic: 3400,
    allowance: 250,
    employeeKwsp: 402,
    employerKwsp: 475,
    socso: 66,
    eis: 15,
    status: 'Review',
  },
  {
    name: 'Amir Hafiz',
    role: 'Sales Consultant',
    department: 'Sales',
    basic: 3000,
    allowance: 700,
    employeeKwsp: 407,
    employerKwsp: 481,
    socso: 63,
    eis: 15,
    status: 'Ready',
  },
  {
    name: 'Jason Tan',
    role: 'Support Technician',
    department: 'Support',
    basic: 2600,
    allowance: 200,
    employeeKwsp: 308,
    employerKwsp: 364,
    socso: 50,
    eis: 11,
    status: 'Missing IC',
  },
];

function currency(value: number) {
  return new Intl.NumberFormat('en-MY', { style: 'currency', currency: 'MYR', maximumFractionDigits: 0 }).format(value);
}

export default function KKIDemo() {
  const [view, setView] = useState<View>('customer');

  return (
    <main className="min-h-screen bg-[#f7f2e8] text-[#17130d]">
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-black/10 bg-white/75 px-4 py-3 shadow-[0_18px_60px_rgba(50,40,25,0.12)] backdrop-blur-xl">
          <a href="/showcase/" className="font-sans text-[0.65rem] font-black uppercase tracking-[0.28em] text-black/55">
            DEMO
          </a>
          <div className="flex items-center gap-3">
            <img src={assetPath('/images/kki-logo.jpg')} alt="KKI logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="hidden font-sans text-xs font-black uppercase tracking-[0.22em] sm:block">Kedai Kain Import</span>
          </div>
          <div className="flex rounded-full border border-black/10 bg-white p-1">
            {[
              ['customer', 'Customer View'],
              ['backoffice', 'Back Office'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setView(key as View)}
                className={`rounded-full px-3 py-2 text-[0.58rem] font-black uppercase tracking-[0.12em] transition sm:px-4 ${
                  view === key ? 'bg-[#17130d] text-white' : 'text-black/55 hover:text-black'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === 'customer' ? <CustomerView /> : <BackOfficeView />}
    </main>
  );
}

function CustomerView() {
  const [tab, setTab] = useState<CustomerTab>('products');

  return (
    <div className="animate-demo-in overflow-hidden">
      <section className="relative grid min-h-screen items-center px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,159,65,0.22),transparent_32%),linear-gradient(135deg,#fffaf0,#f7f2e8_52%,#e7d6b4)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#a36d14]">Customer-facing tempahan portal</p>
            <h1 className="mt-7 font-serif text-6xl leading-[0.92] text-[#17130d] sm:text-8xl">Kain, booking, payment, and progress in one place.</h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/62">
              Customers can browse products, see seasonal sale items, update measurement history, track live delivery, pay online, or manage approved installment balances.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button onClick={() => setTab('products')} className="rounded-full bg-[#17130d] px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.25em] text-white">
                Browse products
              </button>
              <button onClick={() => setTab('tracking')} className="rounded-full border border-black/15 bg-white/60 px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.25em]">
                Track tempahan
              </button>
            </div>
          </div>
          <div className="relative">
            <img src={assetPath('/images/kki-staff-working.png')} alt="" className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_40px_100px_rgba(52,39,16,0.24)]" />
            <div className="absolute -bottom-8 left-6 right-6 rounded-[1.5rem] border border-white/70 bg-white/78 p-5 shadow-[0_22px_70px_rgba(30,20,8,0.16)] backdrop-blur-xl">
              <p className="font-sans text-xs font-black uppercase tracking-[0.25em] text-[#a36d14]">Live delivery update</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-3xl">TMP-1048</p>
                  <p className="mt-1 text-sm text-black/55">Cutting now / Runner pickup after sewing</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">62%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <SegmentedTabs
            tabs={[
              ['products', 'Products'],
              ['profile', 'Customer Profile'],
              ['tracking', 'Live Updates'],
              ['payments', 'Payment / Installment'],
            ]}
            active={tab}
            onChange={(next) => setTab(next as CustomerTab)}
          />
          <div className="mt-8">{tab === 'products' && <CustomerProducts />}{tab === 'profile' && <CustomerProfile />}{tab === 'tracking' && <CustomerTracking />}{tab === 'payments' && <InstallmentGateway />}</div>
        </div>
      </section>

      <KKIFooter tone="customer" />
    </div>
  );
}

function CustomerProducts() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] bg-[#17130d] p-8 text-white">
        <p className="font-sans text-xs font-black uppercase tracking-[0.38em] text-[#d69f41]">Seasonal sale</p>
        <h2 className="mt-5 font-serif text-5xl leading-tight">Raya family set fabric booking.</h2>
        <p className="mt-6 text-white/62">Limited stock can be reserved with measurement slots. Staff sees reserved meters instantly in back office.</p>
        <div className="mt-8 rounded-3xl bg-white/10 p-5">
          <p className="text-sm text-white/50">Promo bundle</p>
          <p className="mt-1 font-serif text-3xl">3 family outfits + matching shawl</p>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {products.map((product) => (
          <article key={product.code} className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-[#f8f4ea]">
            <img src={product.image} alt="" className="aspect-[4/5] w-full object-cover" />
            <div className="p-5">
              <p className="font-sans text-xs font-black uppercase tracking-[0.22em] text-[#a36d14]">{product.season}</p>
              <h3 className="mt-3 font-serif text-3xl leading-none">{product.name}</h3>
              <p className="mt-4 text-sm text-black/55">{product.price} / {product.meters}m available</p>
              <button className="mt-5 w-full rounded-full bg-[#17130d] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">Reserve</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CustomerProfile() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-black/10 bg-[#f8f4ea] p-7">
        <p className="font-sans text-xs font-black uppercase tracking-[0.32em] text-[#a36d14]">Customer profile</p>
        <h2 className="mt-4 font-serif text-5xl">Nur Aina</h2>
        <div className="mt-6 grid gap-3">
          {['Trusted spender approved', 'Default size profile saved', 'Preferred color group: Dusty Rose / Ivory', 'WhatsApp delivery updates enabled'].map((item) => (
            <div key={item} className="rounded-2xl bg-white p-4 text-sm font-semibold text-black/65">{item}</div>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-7">
        <p className="font-sans text-xs font-black uppercase tracking-[0.32em] text-black/40">Transaction update / history</p>
        <div className="mt-5 grid gap-3">
          {[
            ['12 May', 'Deposit paid for TMP-1048', 'RM500'],
            ['10 May', 'Measurements updated by staff', 'Profile'],
            ['02 May', 'Purchased Premium Cotton 4.5m', 'RM99'],
            ['22 Apr', 'Completed TMP-1031', 'RM740'],
          ].map(([date, detail, amount]) => (
            <div key={`${date}-${detail}`} className="grid grid-cols-[5rem_1fr_auto] gap-4 rounded-2xl border border-black/10 p-4 text-sm">
              <span className="font-black">{date}</span>
              <span className="text-black/62">{detail}</span>
              <span className="font-black">{amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CustomerTracking() {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
      <div className="rounded-[2rem] bg-[#17130d] p-8 text-white">
        <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#d69f41]">Grab-style progress report</p>
        <h2 className="mt-6 font-serif text-5xl leading-tight">No more “siap belum?” messages.</h2>
        <p className="mt-6 text-lg leading-8 text-white/62">The customer sees the current stage, ETA, pickup balance, and next action without waiting for staff to reply.</p>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-[#f8f4ea] p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.24em] text-[#a36d14]">Tempahan TMP-1048</p>
            <h3 className="mt-2 font-serif text-3xl">Baju kurung custom</h3>
          </div>
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#17130d]">ETA 2 days</span>
        </div>
        <div className="grid gap-4">
          {customerSteps.map(([label, detail, done], index) => (
            <div key={label} className="grid grid-cols-[2rem_1fr] gap-4">
              <div className={`mt-1 grid h-8 w-8 place-items-center rounded-full text-xs font-black ${done ? 'bg-[#d69f41] text-black' : 'bg-black/10 text-black/40'}`}>{index + 1}</div>
              <div className="border-b border-black/10 pb-4">
                <p className="font-sans text-sm font-black uppercase tracking-[0.16em]">{label}</p>
                <p className="mt-1 text-sm text-black/55">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InstallmentGateway() {
  const order = orders[0];
  const paidPercent = Math.round((order.paid / order.total) * 100);

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] border border-black/10 bg-[#17130d] p-8 text-white">
        <p className="font-sans text-xs font-black uppercase tracking-[0.36em] text-[#d69f41]">Installment gateway</p>
        <h2 className="mt-5 font-serif text-5xl leading-tight">Deposit first, balance tracked properly.</h2>
        <p className="mt-6 text-white/62">
          Trusted big spenders can pay a deposit instead of full payment. The portal shows approved limit, paid amount, balance, due dates, and blocks pickup until balance is cleared.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ['Approved limit', 'RM3,000'],
            ['Deposit rule', '30% min'],
            ['Pickup rule', 'Balance first'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl bg-white/10 p-5">
              <p className="text-xs text-white/45">{label}</p>
              <p className="mt-1 font-sans text-xl font-black">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[2rem] border border-black/10 bg-white p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.3em] text-black/40">{order.id}</p>
            <h3 className="mt-2 font-serif text-4xl">{order.customer}</h3>
          </div>
          <span className="w-fit rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700">{order.payment}</span>
        </div>
        <div className="mt-8 h-3 overflow-hidden rounded-full bg-black/10">
          <div className="h-full rounded-full bg-[#d69f41]" style={{ width: `${paidPercent}%` }} />
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <MoneyTile label="Order total" value={currency(order.total)} />
          <MoneyTile label="Paid deposit" value={currency(order.paid)} />
          <MoneyTile label="Balance" value={currency(order.balance)} strong />
        </div>
        <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5">
          <p className="font-sans text-sm font-black uppercase tracking-[0.18em] text-amber-700">Next scheduled payment</p>
          <p className="mt-2 text-sm text-black/62">RM500 due before sewing starts. Final RM480 must be cleared before pickup / delivery.</p>
        </div>
      </div>
    </div>
  );
}

function MoneyTile({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`rounded-3xl p-5 ${strong ? 'bg-[#17130d] text-white' : 'bg-[#f8f4ea]'}`}>
      <p className={`text-xs ${strong ? 'text-white/50' : 'text-black/45'}`}>{label}</p>
      <p className="mt-1 font-sans text-2xl font-black">{value}</p>
    </div>
  );
}

function BackOfficeView() {
  const [tab, setTab] = useState<OfficeTab>('inventory');

  return (
    <div className="animate-demo-in min-h-screen bg-[linear-gradient(135deg,#f7fbff,#fff7ed_48%,#eef7ff)] px-4 pb-12 pt-28 text-[#101828]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_0.86fr] lg:items-end">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-sky-600">Back office operating system</p>
            <h1 className="mt-5 font-sans text-5xl font-black tracking-[-0.05em] sm:text-7xl">KKI control room.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Inventory in/out, one true internal color code, reporting, accounting, installment balances, payroll, KWSP, and order backlog in a clean Laravel-style webapp.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.16)] backdrop-blur-xl">
            <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-slate-400">Today</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[['27', 'Active orders'], ['418m', 'Fabric stock'], ['RM2.3k', 'Installments']].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/70 p-4">
                  <p className="font-sans text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SegmentedTabs
          tabs={[
            ['inventory', 'Inventory In/Out'],
            ['colors', 'Color Code'],
            ['reporting', 'Reporting'],
            ['accounting', 'Accounting'],
            ['payroll', 'Payroll / KWSP'],
          ]}
          active={tab}
          onChange={(next) => setTab(next as OfficeTab)}
        />

        <div className="mt-6">
          {tab === 'inventory' && <InventoryOperations />}
          {tab === 'colors' && <CentralizedColors />}
          {tab === 'reporting' && <Reporting />}
          {tab === 'accounting' && <Accounting />}
          {tab === 'payroll' && <Payroll />}
        </div>
      </section>
    </div>
  );
}

function InventoryOperations() {
  return (
    <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
      <InventoryPanel />
      <OrdersPanel />
    </div>
  );
}

function InventoryPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/62 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-sky-600">Inventory</p>
          <h2 className="mt-2 font-sans text-2xl font-black">Fabric roll tracking</h2>
        </div>
        <span className="rounded-full bg-sky-100 px-4 py-2 text-xs font-black text-sky-700">Live stock</span>
      </div>
      <div className="grid gap-3">
        {products.map((fabric) => {
          const availablePercent = Math.round(((fabric.meters - fabric.reserved) / fabric.meters) * 100);
          return (
            <article key={fabric.code} className="grid grid-cols-[4.5rem_1fr] gap-4 rounded-3xl border border-slate-200/70 bg-white/72 p-3">
              <img src={fabric.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-sans text-sm font-black">{fabric.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{fabric.code} / {fabric.location}</p>
                  </div>
                  <p className="font-sans text-lg font-black">{fabric.meters}m</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-500" style={{ width: `${availablePercent}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{fabric.reserved}m reserved. In/out log updates stock instantly.</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function OrdersPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/62 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-amber-600">Backlog</p>
          <h2 className="mt-2 font-sans text-2xl font-black">Current tempahan queue</h2>
        </div>
        <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700">Auto reminders</span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/72">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[0.65fr_0.9fr_0.75fr_0.8fr_0.65fr] md:items-center">
            <div>
              <p className="font-sans text-sm font-black">{order.id}</p>
              <p className="text-xs text-slate-500">{order.customer}</p>
            </div>
            <p className="text-sm font-semibold text-slate-600">{order.fabric}</p>
            <StatusPill status={order.status} />
            <div>
              <p className="text-xs text-slate-500">{order.payment} / balance {currency(order.balance)}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#101828]" style={{ width: `${order.progress}%` }} />
              </div>
            </div>
            <button className="rounded-full bg-slate-950 px-4 py-2 text-xs font-black text-white">Open</button>
          </div>
        ))}
      </div>
    </section>
  );
}

function CentralizedColors() {
  const [selected, setSelected] = useState(2);
  const selectedColor = colorMap[selected];

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <section className="rounded-[2rem] border border-white/70 bg-white/70 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
        <div className="mb-5">
          <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-emerald-600">Centralized color code</p>
          <h2 className="mt-2 font-sans text-2xl font-black">One internal color truth, even when factories use different codes.</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            Staff choose KKI&apos;s internal color code first. Supplier codes are stored as aliases, so inventory, customer orders, and reports all refer to the same color.
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[0.6fr_1fr_0.7fr_0.7fr_0.7fr] gap-3 bg-slate-50 p-4 text-xs font-black uppercase tracking-[0.12em] text-slate-400">
            <span>KKI code</span><span>Color</span><span>Factory A</span><span>Factory B</span><span>Factory C</span>
          </div>
          {colorMap.map((row, index) => (
            <button
              key={row[0]}
              type="button"
              onClick={() => setSelected(index)}
              className={`grid w-full grid-cols-[0.6fr_1fr_0.7fr_0.7fr_0.7fr] gap-3 border-t border-slate-100 p-4 text-left text-sm transition ${selected === index ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
            >
              <span className="font-black">{row[0]}</span>
              <span className="flex items-center gap-3 font-semibold"><i className="h-5 w-5 rounded-full border border-black/10" style={{ background: colorSwatches[index] }} />{row[1]}</span>
              <span>{row[2]}</span><span>{row[3]}</span><span>{row[4]}</span>
            </button>
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
        <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-emerald-600">Selected color</p>
        <div className="mt-5 aspect-video rounded-[2rem] border border-black/10" style={{ background: colorSwatches[selected] }} />
        <h3 className="mt-6 font-sans text-4xl font-black tracking-[-0.04em]">{selectedColor[1]}</h3>
        <p className="mt-2 text-sm text-slate-500">{selectedColor[0]} is the only code staff use internally.</p>
        <div className="mt-6 grid gap-3">
          {[
            ['Supplier aliases', `${selectedColor[2]}, ${selectedColor[3]}, ${selectedColor[4]}`],
            ['Inventory rule', 'Incoming stock must be matched before roll is accepted'],
            ['Staff note', selectedColor[5]],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-slate-400">{label}</p>
              <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Reporting() {
  return (
    <div className="grid gap-5 lg:grid-cols-4">
      {salesRows.map(([label, value, meta]) => (
        <div key={label} className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-4 font-sans text-4xl font-black tracking-[-0.04em]">{value}</p>
          <p className="mt-2 text-sm font-semibold text-emerald-600">{meta}</p>
        </div>
      ))}
      <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(66,88,120,0.12)] lg:col-span-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">Sales and operations insight</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {['Most profitable fabric: Satin Crepe', 'Slowest stage: Sewing queue', 'Highest demand color: Champagne Gold'].map((item) => (
            <div key={item} className="rounded-3xl bg-slate-50 p-5 text-sm font-bold text-slate-700">{item}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Accounting() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-600">Receivables</p>
        <h2 className="mt-3 text-2xl font-black">Installment balances to collect</h2>
        <div className="mt-5 grid gap-3">
          {orders.filter((order) => order.balance > 0).map((order) => (
            <div key={order.id} className="rounded-3xl bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-black">{order.customer}</p>
                  <p className="text-sm text-slate-500">{order.id} / {order.tier}</p>
                </div>
                <p className="text-xl font-black">{currency(order.balance)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-sky-600">Accounting export</p>
        <h2 className="mt-3 text-2xl font-black">Daily close summary</h2>
        <div className="mt-5 grid gap-3">
          {[
            ['Cash', 'RM2,880'],
            ['Online banking', 'RM4,120'],
            ['Card / QR', 'RM1,420'],
            ['Outstanding', 'RM2,300'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between rounded-2xl bg-slate-50 p-4 text-sm">
              <span className="font-semibold text-slate-500">{label}</span>
              <span className="font-black">{value}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Payroll() {
  const [query, setQuery] = useState('');
  const rows = payrollStaff.filter((staff) =>
    `${staff.name} ${staff.role} ${staff.department}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totals = rows.reduce(
    (summary, staff) => {
      const gross = staff.basic + staff.allowance;
      const employerCost = gross + staff.employerKwsp + staff.socso + staff.eis;

      summary.gross += gross;
      summary.employeeKwsp += staff.employeeKwsp;
      summary.employerKwsp += staff.employerKwsp;
      summary.employerCost += employerCost;
      summary.socsoEis += staff.socso + staff.eis;
      return summary;
    },
    { gross: 0, employeeKwsp: 0, employerKwsp: 0, employerCost: 0, socsoEis: 0 },
  );
  const employerAddon = totals.employerCost - totals.gross;

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Payroll Period</p>
            <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950">May 2026 Staff Payroll & KWSP Costs</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Review gross pay, statutory deductions, and total employer cost per staff before approval.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Filter', 'Export'].map((action) => (
              <button key={action} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black shadow-sm">{action}</button>
            ))}
            <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm">Approve Payroll</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PayrollMetric title="Total Gross Salary" value={currency(totals.gross)} note="Basic + fixed allowance" />
        <PayrollMetric title="Employee KWSP" value={currency(totals.employeeKwsp)} note="Deducted from staff salary" />
        <PayrollMetric title="Employer KWSP" value={currency(totals.employerKwsp)} note="Company contribution" />
        <PayrollMetric title="Total Employer Cost" value={currency(totals.employerCost)} note="Gross + company statutory" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black">Staff Cost Breakdown</h3>
              <p className="mt-1 text-sm text-slate-500">Per staff salary, KWSP, SOCSO, EIS and employer total.</p>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search staff..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 md:w-80"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Staff</th>
                  <th className="px-5 py-4">Department</th>
                  <th className="px-5 py-4 text-right">Gross</th>
                  <th className="px-5 py-4 text-right">Employee KWSP</th>
                  <th className="px-5 py-4 text-right">Employer KWSP</th>
                  <th className="px-5 py-4 text-right">SOCSO + EIS</th>
                  <th className="px-5 py-4 text-right">Employer Cost</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((staff) => {
                  const gross = staff.basic + staff.allowance;
                  const employerCost = gross + staff.employerKwsp + staff.socso + staff.eis;

                  return (
                    <tr key={staff.name} className="hover:bg-slate-50/80">
                      <td className="px-5 py-4">
                        <div className="font-black">{staff.name}</div>
                        <div className="text-xs text-slate-500">{staff.role}</div>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{staff.department}</td>
                      <td className="px-5 py-4 text-right font-semibold">{currency(gross)}</td>
                      <td className="px-5 py-4 text-right text-slate-600">{currency(staff.employeeKwsp)}</td>
                      <td className="px-5 py-4 text-right text-slate-600">{currency(staff.employerKwsp)}</td>
                      <td className="px-5 py-4 text-right text-slate-600">{currency(staff.socso + staff.eis)}</td>
                      <td className="px-5 py-4 text-right font-black">{currency(employerCost)}</td>
                      <td className="px-5 py-4"><PayrollStatus status={staff.status} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">Payroll Rule Set</h3>
                <p className="mt-1 text-sm text-slate-500">Malaysia statutory settings</p>
              </div>
              <span className="text-slate-400">v</span>
            </div>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ['Employee KWSP', '11%'],
                ['Employer KWSP', '13%'],
                ['SOCSO / EIS', 'Auto Table'],
                ['PCB', 'Optional'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between rounded-2xl bg-slate-50 p-3">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>

          <aside className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Review required</p>
            <h3 className="mt-3 font-black">Staff profile incomplete</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">1 staff profile is missing IC details. Statutory submission may be blocked until the record is completed.</p>
            <button className="mt-5 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950">Open Staff Profile</button>
          </aside>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
            <h3 className="font-black">Cost Insight</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Employer statutory contributions add <strong>{currency(employerAddon)}</strong> on top of gross payroll this month.
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-slate-950" style={{ width: `${Math.min(88, Math.round((employerAddon / totals.employerCost) * 100 * 4))}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-slate-400">
              <span>Gross salary</span>
              <span>Employer add-on cost</span>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function PayrollMetric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(66,88,120,0.1)]">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-sm font-black">RM</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live</span>
      </div>
      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.03em]">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{note}</p>
    </div>
  );
}

function PayrollStatus({ status }: { status: string }) {
  const color = status === 'Ready' ? 'bg-emerald-50 text-emerald-700' : status === 'Review' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>{status}</span>;
}

function SegmentedTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[][];
  active: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto rounded-full border border-black/10 bg-white/75 p-2 shadow-[0_18px_60px_rgba(50,40,25,0.08)] backdrop-blur-xl">
      {tabs.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`shrink-0 rounded-full px-4 py-3 text-[0.65rem] font-black uppercase tracking-[0.16em] transition ${
            active === key ? 'bg-[#17130d] text-white' : 'text-black/50 hover:bg-black/5 hover:text-black'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const color = status === 'Finished' ? 'bg-emerald-100 text-emerald-700' : status === 'Sewing' ? 'bg-purple-100 text-purple-700' : status === 'Cutting' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600';
  return <span className={`w-fit rounded-full px-3 py-2 text-xs font-black ${color}`}>{status}</span>;
}

function KKIFooter({ tone }: { tone: 'customer' | 'staff' }) {
  const dark = tone === 'customer';
  return (
    <footer className={`${dark ? 'bg-[#17130d] text-white' : 'bg-white text-[#101828]'} px-6 py-14`}>
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <img src={assetPath('/images/kki-logo.jpg')} alt="KKI logo" className="h-12 w-12 rounded-full object-cover" />
          <div>
            <p className="font-sans text-sm font-black uppercase tracking-[0.22em]">Kedai Kain Import</p>
            <p className={`mt-1 text-sm ${dark ? 'text-white/50' : 'text-slate-500'}`}>Fabric, tailoring, inventory, and tempahan operations demo.</p>
          </div>
        </div>
        <div className="flex gap-3">
          {['IG', 'TT', 'WA'].map((item) => (
            <span key={item} className={`grid h-11 w-11 place-items-center rounded-full border text-xs font-black ${dark ? 'border-white/20' : 'border-black/15'}`}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
