'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

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

const colorStock = ['2,840m', '4,820m', '1,240m', '620m', '3,760m', '920m', '1,870m', '410m'];
const colorActiveOrders = [8, 19, 14, 5, 11, 4, 9, 3];
const colorRisk = ['Low', 'Low', 'Verify', 'Low Stock', 'Low', 'Duplicate Risk', 'Low', 'Low Stock'];

const supplierMapping = [
  ['Factory A', 'R-14', '99%', 'Exact Match', '12 Jun 2026'],
  ['Factory B', 'DR-8', '96%', 'Exact Match', '08 Jun 2026'],
  ['Factory C', 'F-302', '84%', 'Manual Verify', '02 Jun 2026'],
  ['Karachi Textile', 'D-Rose-17', '91%', 'Close Match', '28 May 2026'],
];

const similarColors = [
  ['Muted Pink', 'KKI-031', '92%', '#c8949b'],
  ['Rose Nude', 'KKI-018', '87%', '#c99b94'],
  ['Blush Pink', 'KKI-012', '81%', '#d6a0a9'],
];

const colorUsageRows = [
  ['Kurung Moden', 'Satin Crepe', '420m', '38 orders'],
  ['Baju Melayu', 'Italian Silk', '180m', '12 orders'],
  ['Corporate Uniform', 'Cotton Blend', '260m', '21 orders'],
];

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

const reportingKpis = [
  ['Today Sales', 'RM8,420', '+18% vs yesterday', 'green'],
  ['Outstanding Installment', 'RM2,300', '4 customers', 'amber'],
  ['Reserved Fabric', '35.7m', '9 tempahan', 'blue'],
  ['Ready Pickup', '8 orders', '3 unpaid balance', 'purple'],
  ['Tailor Capacity', '72%', '28/39 active jobs', 'orange'],
  ['Monthly Profit Est.', 'RM62,450', '+12% vs last month', 'green'],
];

const productionPipeline = [
  ['Cutting', '18 orders', 'Avg delay 0.5 day', 'blue'],
  ['Sewing', '26 orders', 'Avg delay 2.1 days', 'red'],
  ['QC', '12 orders', 'Avg delay 1.0 day', 'purple'],
  ['Ready Pickup', '8 orders', 'Ready', 'green'],
];

const tailorPerformance = [
  ['Team A (Shahbaz)', '8', '6', '2', '3.2 days', '85%'],
  ['Team B (Imran)', '7', '4', '3', '4.5 days', '68%'],
  ['Team C (Rizwan)', '6', '6', '0', '2.1 days', '95%'],
  ['Team D (Naveed)', '5', '3', '2', '4.8 days', '60%'],
  ['Team E (Safdar)', '4', '4', '0', '2.3 days', '92%'],
];

const fabricInsights = [
  ['Top Selling Fabric', 'Satin Crepe', '12,430m'],
  ['Fastest Moving Color', 'Champagne Gold', '4,820m'],
  ['Highest Margin Fabric', 'Italian Silk', 'RM42.60/m'],
  ['Low Stock Alert', '8 fabrics', 'View'],
  ['Dead Stock > 90 days', '6 fabrics', '8,750m'],
];

const reportingFinancials = [
  ['Cash Collected Today', 'RM5,260', '+23% vs yesterday'],
  ['Unpaid Pickups', 'RM14,850', '11 orders'],
  ['Installment Overdue', 'RM7,380', '5 customers'],
  ['Supplier Payable', 'RM38,450', '12 bills'],
  ['Shipping / Customs Due', 'RM6,780', '2 shipments'],
  ['Factory Expenses MTD', 'RM18,620', 'Utilities, accommodation'],
  ['Tailor Salary MTD', 'RM28,950', '39 tailors'],
  ['Accommodation Cost MTD', 'RM6,300', 'Factory living quarters'],
  ['Advances to Tailors', 'RM4,250', '6 tailors'],
];

const installmentAging = [
  ['Current (0-30 days)', 'RM8,320', '6', '36%'],
  ['31-60 days', 'RM5,480', '3', '24%'],
  ['61-90 days', 'RM3,250', '2', '14%'],
  ['> 90 days', 'RM8,630', '4', '26%'],
];

const importShipments = [
  ['KKI-IMP-0625-01', 'In Transit', '12 Jun 2026', 'RM48,650'],
  ['KKI-IMP-0625-02', 'Arrived Port', '8 Jun 2026', 'RM62,430'],
  ['KKI-IMP-0625-03', 'Customs Clearance', '10 Jun 2026', 'RM36,800'],
  ['KKI-IMP-0625-04', 'Booked', '20 Jun 2026', 'RM51,200'],
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

const accountingEntries = [
  { date: '28 May 2026', ref: 'INV-0528-001', party: 'Butik Seri Anggun', type: 'Sales', category: 'Kain Cotton Roll', qty: '18 rolls', amount: 12600, status: 'Paid' },
  { date: '27 May 2026', ref: 'BILL-IMP-8841', party: 'Karachi Textile Supplier', type: 'Import Cost', category: 'Fabric Shipment', qty: '42 rolls', amount: -18600, status: 'Pending' },
  { date: '27 May 2026', ref: 'LAB-0527', party: 'Tailor Team A', type: 'Labour', category: 'Sewing Wages', qty: '96 pcs', amount: -2880, status: 'Paid' },
  { date: '26 May 2026', ref: 'FAC-0526', party: 'Factory House', type: 'Factory Cost', category: 'Tailor Accommodation', qty: '8 workers', amount: -3200, status: 'Paid' },
  { date: '25 May 2026', ref: 'BILL-SHIP-221', party: 'Forwarding Agent', type: 'Import Cost', category: 'Shipping & Clearance', qty: '1 container', amount: -7300, status: 'Review' },
  { date: '24 May 2026', ref: 'INV-0524-006', party: 'Kedai Kain Melati', type: 'Sales', category: 'Custom Sewing Order', qty: '64 pcs', amount: 8960, status: 'Overdue' },
  { date: '23 May 2026', ref: 'UTIL-0523', party: 'TNB / Air Selangor', type: 'Factory Cost', category: 'Utilities', qty: 'Monthly', amount: -1450, status: 'Paid' },
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
  const [query, setQuery] = useState('');
  const selectedColor = colorMap[selected];
  const filteredColors = colorMap
    .map((row, index) => ({ row, index }))
    .filter(({ row, index }) => `${row.join(' ')} ${colorRisk[index]} ${colorStock[index]}`.toLowerCase().includes(query.toLowerCase()));
  const riskTone = colorRisk[selected] === 'Low' ? 'green' : colorRisk[selected] === 'Verify' ? 'amber' : 'red';

  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-emerald-600">Centralized color code</p>
            <h2 className="mt-2 font-sans text-3xl font-black tracking-[-0.04em]">One internal color truth, even when factories use different codes.</h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
              Staff choose KKI&apos;s internal color first. Supplier color codes are stored as aliases, so stock-in, customer orders, sewing, and reports all refer to the same master color.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 shadow-sm">Import Supplier Codes</button>
            <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm">Add Master Color</button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[390px_1fr_360px]">
        <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
          <div className="border-b border-slate-100 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800">Master Color Library</h3>
                <p className="mt-1 text-xs text-slate-500">Search by KKI code, name or supplier alias.</p>
              </div>
              <button className="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-black text-slate-600">Filter</button>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Dusty Rose, DR-8, KKI-003..."
              className="mt-4 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium outline-none focus:border-slate-400"
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {['Active', 'Verify', 'Low Stock', 'Duplicate Risk'].map((item) => (
                <ColorBadge key={item} tone={item === 'Active' ? 'blue' : item === 'Verify' ? 'amber' : 'red'}>{item}</ColorBadge>
              ))}
            </div>
          </div>

          <div className="max-h-[720px] overflow-y-auto p-3">
            {filteredColors.map(({ row, index }) => (
              <button
                key={row[0]}
                type="button"
                onClick={() => setSelected(index)}
                className={`mb-2 flex w-full items-center gap-3 rounded-3xl p-4 text-left transition ${selected === index ? 'bg-emerald-50 ring-1 ring-emerald-200' : 'hover:bg-slate-50'}`}
              >
                <span className="h-12 w-12 shrink-0 rounded-2xl border border-black/10 shadow-inner" style={{ background: colorSwatches[index] }} />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm font-black">{row[1]}</span>
                    <ColorBadge tone={colorRisk[index] === 'Low' ? 'green' : colorRisk[index] === 'Verify' ? 'amber' : 'red'}>{colorRisk[index]}</ColorBadge>
                  </span>
                  <span className="mt-1 block text-xs font-bold text-slate-500">{row[0]} / {row[2]}, {row[3]}, {row[4]}</span>
                  <span className="mt-2 block text-xs text-slate-500">{colorStock[index]} stock / {colorActiveOrders[index]} active orders</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="space-y-5">
          <section className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/78 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
            <div className="grid lg:grid-cols-[1fr_320px]">
              <div className="p-6">
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <ColorBadge tone="green">Internal Master Color</ColorBadge>
                      <ColorBadge tone={riskTone}>{colorRisk[selected]}</ColorBadge>
                    </div>
                    <h3 className="mt-4 text-5xl font-black tracking-[-0.05em] text-slate-950">{selectedColor[1]}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      <span className="font-black text-slate-700">{selectedColor[0]}</span> is the only color code staff should use for stock-in, tempahan, sewing jobs, and reports.
                    </p>
                  </div>
                  <button className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-black shadow-sm">Edit Color Rule</button>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-4">
                  {[
                    ['Current Stock', colorStock[selected]],
                    ['Active Orders', `${colorActiveOrders[selected]}`],
                    ['Suppliers', '4 linked'],
                    ['30D Usage', '860m'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
                      <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-l border-slate-100 bg-slate-50 p-5">
                <div className="relative h-full min-h-[280px] overflow-hidden rounded-[28px] border border-black/10 shadow-inner" style={{ background: colorSwatches[selected] }}>
                  <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,.45), transparent 35%, rgba(0,0,0,.14))' }} />
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-white/80 px-4 py-3 backdrop-blur">
                    <p className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Fabric preview</p>
                    <p className="mt-1 text-sm font-black">Light / dark tone simulation</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-5 lg:grid-cols-2">
            <ColorPanel title="Supplier Mapping Intelligence" action="Auto Match">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="text-xs uppercase tracking-[0.14em] text-slate-400">
                    <tr>
                      {['Supplier', 'Alias Code', 'Confidence', 'Status', 'Last Used'].map((head) => (
                        <th key={head} className="py-3 font-black">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {supplierMapping.map(([supplier, code, confidence, status, lastUsed]) => (
                      <tr key={supplier}>
                        <td className="py-3 font-bold">{supplier}</td>
                        <td className="py-3 font-mono font-black">{code}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-20 rounded-full bg-slate-100">
                              <span className={`block h-2 rounded-full ${parseInt(confidence, 10) >= 95 ? 'bg-emerald-500' : parseInt(confidence, 10) >= 90 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: confidence }} />
                            </span>
                            <span className="text-xs font-black">{confidence}</span>
                          </div>
                        </td>
                        <td className="py-3"><ColorBadge tone={status === 'Manual Verify' ? 'amber' : 'green'}>{status}</ColorBadge></td>
                        <td className="py-3 text-slate-500">{lastUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ColorPanel>

            <ColorPanel title="Similar Color Detection" action="Prevent Mistakes">
              <div className="space-y-3">
                {similarColors.map(([name, code, match, hex]) => (
                  <div key={code} className="flex items-center justify-between rounded-3xl border border-slate-100 bg-slate-50 p-4">
                    <div className="flex items-center gap-3">
                      <span className="h-11 w-11 rounded-2xl border border-black/10" style={{ background: hex }} />
                      <span>
                        <span className="block font-black">{name}</span>
                        <span className="block text-xs font-bold text-slate-500">{code}</span>
                      </span>
                    </div>
                    <span className="text-right">
                      <span className="block text-sm font-black text-amber-600">{match} similar</span>
                      <span className="block text-xs text-slate-500">check before replacing</span>
                    </span>
                  </div>
                ))}
              </div>
            </ColorPanel>
          </section>
        </div>

        <div className="space-y-5">
          <ColorPanel title="Incoming Roll Verification" action="Scan">
            <div className="rounded-3xl bg-slate-950 p-5 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Scanned supplier code</p>
              <p className="mt-2 font-mono text-3xl font-black">DR-8</p>
              <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-slate-400">
                <span className="h-px bg-white/10" />
                <span className="text-xs font-black">MATCHES TO</span>
                <span className="h-px bg-white/10" />
              </div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Suggested internal color</p>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-12 w-12 rounded-2xl border border-white/20" style={{ background: colorSwatches[selected] }} />
                <span>
                  <span className="block text-xl font-black">{selectedColor[1]}</span>
                  <span className="block text-sm text-slate-400">{selectedColor[0]}</span>
                </span>
              </div>
              <div className="mt-5 rounded-2xl bg-white/10 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold">Match confidence</span>
                  <span className="text-lg font-black text-emerald-300">96%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[96%] rounded-full bg-emerald-400" />
                </div>
              </div>
              <button className="mt-5 w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-black text-slate-950">Accept Stock-In Match</button>
            </div>
          </ColorPanel>

          <ColorPanel title="Usage Impact">
            <div className="space-y-3">
              {colorUsageRows.map(([product, fabric, meter, orderCount]) => (
                <div key={product} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-black">{product}</p>
                      <p className="mt-1 text-xs font-bold text-slate-500">{fabric}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-black">{meter}</p>
                      <p className="text-xs text-slate-500">{orderCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ColorPanel>

          <ColorPanel title="Inventory Rule">
            <div className="rounded-3xl bg-amber-50 p-5">
              <p className="text-sm leading-6 text-amber-900">Incoming stock must be matched to a KKI master color before the roll can be accepted into inventory.</p>
              <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm font-bold text-amber-900">
                Block stock-in when confidence is below 85% unless supervisor approves.
              </div>
            </div>
          </ColorPanel>
        </div>
      </section>
    </div>
  );
}

function ColorPanel({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/78 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-sm font-black uppercase tracking-[0.14em] text-slate-800">{title}</h3>
        {action ? <ColorBadge tone={action === 'Prevent Mistakes' ? 'amber' : 'blue'}>{action}</ColorBadge> : null}
      </div>
      {children}
    </section>
  );
}

function ColorBadge({ children, tone = 'slate' }: { children: ReactNode; tone?: string }) {
  const tones: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700',
    green: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    red: 'bg-rose-50 text-rose-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone] ?? tones.slate}`}>{children}</span>;
}

function Reporting() {
  return (
    <div className="space-y-5">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Reporting Period / Today</p>
            <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950">KKI Operations Reporting Dashboard</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              A live operating view for sales, tempahan progress, fabric movement, installment exposure, import cost, and tailor capacity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Daily', 'Weekly', 'Monthly'].map((label, index) => (
              <button
                key={label}
                className={`rounded-2xl px-5 py-3 text-sm font-black shadow-sm ${index === 0 ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {reportingKpis.map(([label, value, sub, tone]) => (
          <ReportingKpi key={label} label={label} value={value} sub={sub} tone={tone} />
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <ReportingCard title="Production Pipeline" action="View All Orders">
          <div className="grid gap-3 md:grid-cols-4">
            {productionPipeline.map(([stage, count, delay, tone]) => (
              <div key={stage} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{stage}</p>
                  <ToneDot tone={tone} />
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">{count}</p>
                <p className={`mt-1 text-xs font-bold ${tone === 'red' ? 'text-rose-600' : 'text-slate-500'}`}>{delay}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className={`h-full rounded-full ${tone === 'red' ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: stage === 'Sewing' ? '86%' : stage === 'Cutting' ? '62%' : stage === 'QC' ? '48%' : '36%' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-3xl bg-amber-50 p-4 text-sm font-semibold text-amber-800">
            Sewing is the current bottleneck. Recommend shifting 4 cutting-ready orders to Team C and sending pickup reminders for ready but unpaid orders.
          </div>
        </ReportingCard>

        <ReportingCard title="Tailor Performance" action="View Tailors">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.14em] text-slate-400">
                <tr>
                  {['Team', 'Assigned', 'Completed', 'Delayed', 'Avg Time', 'Efficiency'].map((head) => (
                    <th key={head} className="px-4 py-3 font-black">{head}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tailorPerformance.map(([team, assigned, completed, delayed, avg, efficiency]) => (
                  <tr key={team} className="border-t border-slate-100">
                    <td className="px-4 py-4 font-black text-slate-950">{team}</td>
                    <td className="px-4 py-4">{assigned}</td>
                    <td className="px-4 py-4 text-emerald-600">{completed}</td>
                    <td className={`px-4 py-4 font-bold ${Number(delayed) > 1 ? 'text-rose-600' : 'text-slate-500'}`}>{delayed}</td>
                    <td className="px-4 py-4">{avg}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-10 font-black">{efficiency}</span>
                        <span className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                          <span className="block h-full rounded-full bg-slate-950" style={{ width: efficiency }} />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportingCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <ReportingCard title="Fabric Insights" action="Open Inventory">
          <div className="grid gap-3">
            {fabricInsights.map(([label, value, meta]) => (
              <div key={label} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
                  <p className="mt-1 text-xl font-black text-slate-950">{value}</p>
                </div>
                <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-slate-600 shadow-sm">{meta}</span>
              </div>
            ))}
          </div>
        </ReportingCard>

        <ReportingCard title="Financial Overview" action="Export">
          <div className="grid gap-3 md:grid-cols-3">
            {reportingFinancials.map(([label, value, meta]) => (
              <div key={label} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-400">{label}</p>
                <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-slate-950">{value}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">{meta}</p>
              </div>
            ))}
          </div>
        </ReportingCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_0.85fr]">
        <ReportingCard title="Key Trends" action="Compare Month">
          <div className="rounded-3xl bg-slate-950 p-5 text-white">
            <div className="flex flex-wrap gap-2">
              {['Sales', 'Installment Outstanding', 'Inventory Turnover', 'Tailor Delay'].map((label, index) => (
                <span key={label} className={`rounded-full px-3 py-1 text-xs font-black ${index === 0 ? 'bg-white text-slate-950' : 'bg-white/10 text-white/70'}`}>{label}</span>
              ))}
            </div>
            <svg viewBox="0 0 640 220" className="mt-6 h-56 w-full">
              <path d="M30 170 C120 90 180 130 240 85 S370 60 430 105 S535 190 610 70" fill="none" stroke="#34d399" strokeWidth="8" strokeLinecap="round" />
              <path d="M30 185 C130 180 175 155 250 160 S390 120 460 145 S560 155 610 120" fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
              <path d="M30 40 H610 M30 100 H610 M30 160 H610" stroke="rgba(255,255,255,0.08)" />
            </svg>
            <div className="grid gap-3 text-xs font-bold text-white/70 md:grid-cols-4">
              <span>Sales trending up</span>
              <span>Installments need chasing</span>
              <span>Champagne stock moving fast</span>
              <span>Sewing delay rising</span>
            </div>
          </div>
        </ReportingCard>

        <ReportingCard title="Installment Aging" action="Send Reminders">
          <div className="space-y-3">
            {installmentAging.map(([bucket, amount, customers, percent]) => (
              <div key={bucket} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-950">{bucket}</p>
                    <p className="text-xs font-semibold text-slate-500">{customers} customers with unpaid tempahan balance</p>
                  </div>
                  <p className="text-xl font-black">{amount}</p>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
                  <div className="h-full rounded-full bg-rose-500" style={{ width: percent }} />
                </div>
              </div>
            ))}
          </div>
        </ReportingCard>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <ReportingCard title="Import & Shipping" action="Open Shipments">
          <div className="space-y-3">
            {importShipments.map(([ref, status, eta, cost]) => (
              <div key={ref} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-black">{ref}</p>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{status}</span>
                </div>
                <div className="mt-3 flex justify-between text-sm text-slate-500">
                  <span>ETA {eta}</span>
                  <span className="font-black text-slate-950">{cost}</span>
                </div>
              </div>
            ))}
          </div>
        </ReportingCard>

        <ReportingCard title="Factory Living & Utilities">
          <div className="space-y-3">
            {[
              ['Accommodation', 'RM6,300', '8 workers'],
              ['Utilities', 'RM1,450', 'Electricity and water'],
              ['Meals / Support', 'RM3,120', 'Monthly allowance'],
              ['Transport', 'RM3,080', 'Pickup and delivery support'],
            ].map(([label, value, note]) => (
              <div key={label} className="flex items-center justify-between rounded-3xl bg-slate-50 p-4">
                <div>
                  <p className="font-black">{label}</p>
                  <p className="text-xs font-semibold text-slate-500">{note}</p>
                </div>
                <p className="text-lg font-black">{value}</p>
              </div>
            ))}
            <div className="rounded-3xl bg-slate-950 p-4 text-white">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-white/50">Total factory living cost</p>
              <p className="mt-2 text-3xl font-black">{currency(13950)}</p>
            </div>
          </div>
        </ReportingCard>

        <ReportingCard title="Alerts & Reminders">
          <div className="space-y-3">
            {[
              ['Payment', '5 installment customers overdue. Send WhatsApp reminder today.'],
              ['Inventory', 'Champagne Gold under reorder threshold after 9 reservations.'],
              ['Production', 'Team B sewing queue has 3 delayed jobs. Reassign 2 orders.'],
              ['Pickup', '3 ready pickup orders still have unpaid balance.'],
            ].map(([label, note]) => (
              <div key={label} className="rounded-3xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-amber-700">{label}</p>
                <p className="mt-1 text-sm font-semibold text-amber-900">{note}</p>
              </div>
            ))}
          </div>
        </ReportingCard>
      </section>
    </div>
  );
}

function ReportingKpi({ label, value, sub, tone }: { label: string; value: string; sub: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <ToneDot tone={tone} />
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-500">{label}</div>
          <div className="mt-2 text-2xl font-black tracking-[-0.03em] text-slate-950">{value}</div>
          <div className={`mt-1 text-xs font-bold ${tone === 'red' || tone === 'amber' ? 'text-amber-600' : 'text-emerald-600'}`}>{sub}</div>
        </div>
      </div>
      <MiniSparkline tone={tone} />
    </div>
  );
}

function ReportingCard({ title, action, children }: { title: string; action?: string; children: ReactNode }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-xl font-black tracking-[-0.03em] text-slate-950">{title}</h3>
        {action ? <button className="rounded-full bg-slate-100 px-4 py-2 text-xs font-black text-slate-600">{action}</button> : null}
      </div>
      {children}
    </div>
  );
}

function ToneDot({ tone }: { tone: string }) {
  const colors: Record<string, string> = {
    green: 'border-emerald-200 bg-emerald-50',
    amber: 'border-amber-200 bg-amber-50',
    blue: 'border-sky-200 bg-sky-50',
    purple: 'border-violet-200 bg-violet-50',
    orange: 'border-orange-200 bg-orange-50',
    red: 'border-rose-200 bg-rose-50',
  };

  return <span className={`block h-11 w-11 shrink-0 rounded-2xl border ${colors[tone] ?? colors.green}`} />;
}

function MiniSparkline({ tone }: { tone: string }) {
  const stroke = tone === 'amber' || tone === 'orange' ? '#f59e0b' : tone === 'red' ? '#f43f5e' : '#10b981';

  return (
    <svg viewBox="0 0 180 42" className="mt-4 h-10 w-full">
      <path d="M4 30 C30 16 48 24 70 14 S116 24 136 10 S160 16 176 8" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
      <path d="M4 36 H176" stroke="rgba(15,23,42,0.08)" />
    </svg>
  );
}

function Accounting() {
  const [query, setQuery] = useState('');
  const rows = accountingEntries.filter((entry) =>
    `${entry.ref} ${entry.party} ${entry.type} ${entry.category}`.toLowerCase().includes(query.toLowerCase()),
  );
  const totals = rows.reduce(
    (summary, entry) => {
      if (entry.amount > 0) summary.sales += entry.amount;
      if (entry.type === 'Import Cost') summary.importCost += Math.abs(entry.amount);
      if (entry.type === 'Labour') summary.labour += Math.abs(entry.amount);
      if (entry.type === 'Factory Cost') summary.factory += Math.abs(entry.amount);
      if (entry.status === 'Overdue') summary.overdue += entry.amount;
      return summary;
    },
    { sales: 0, importCost: 0, labour: 0, factory: 0, overdue: 0 },
  );
  const net = totals.sales - totals.importCost - totals.labour - totals.factory;
  const installmentOutstanding = orders.reduce((sum, order) => sum + order.balance, 0);
  const installmentOrders = orders.filter((order) => order.balance > 0);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-500">Accounting Period / May 2026</p>
            <h2 className="mt-1 text-3xl font-black tracking-[-0.04em] text-slate-950">Fabric Import, Sewing & Factory Cost Dashboard</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">Monitor sales, supplier bills, landed cost, tailor wages, accommodation and factory overheads.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Filter', 'Export'].map((action) => (
              <button key={action} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black shadow-sm">{action}</button>
            ))}
            <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm">New Entry</button>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AccountingMetric title="Fabric Sales" value={currency(totals.sales)} note="Rolls, meters and customer orders" />
        <AccountingMetric title="Import & Clearance" value={currency(totals.importCost)} note="Supplier, shipping, customs, forwarding" />
        <AccountingMetric title="Sewing Labour" value={currency(totals.labour)} note="Tukang jahit wages and piece-rate work" />
        <AccountingMetric title="Factory Living Cost" value={currency(totals.factory)} note="Accommodation, utilities and worker support" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-black">Accounting Ledger</h3>
              <p className="mt-1 text-sm text-slate-500">Sales, import bills, sewing wages and factory living expenses.</p>
            </div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search invoice, supplier, category..."
              className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-slate-400 md:w-80"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Reference</th>
                  <th className="px-5 py-4">Party</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Qty</th>
                  <th className="px-5 py-4 text-right">Amount</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.map((entry) => (
                  <tr key={entry.ref} className="hover:bg-slate-50/80">
                    <td className="px-5 py-4 text-slate-600">{entry.date}</td>
                    <td className="px-5 py-4 font-black">{entry.ref}</td>
                    <td className="px-5 py-4">{entry.party}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.type}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.category}</td>
                    <td className="px-5 py-4 text-slate-600">{entry.qty}</td>
                    <td className={`px-5 py-4 text-right font-black ${entry.amount < 0 ? 'text-rose-600' : 'text-emerald-700'}`}>{currency(entry.amount)}</td>
                    <td className="px-5 py-4"><AccountingStatus status={entry.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-black">Net Position</h3>
                <p className="mt-1 text-sm text-slate-500">Current filtered period</p>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live</span>
            </div>
            <p className={`mt-5 text-4xl font-black tracking-[-0.05em] ${net >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>{currency(net)}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">After import, sewing labour and factory worker cost.</p>
          </aside>

          <aside className="rounded-[2rem] border border-amber-200 bg-amber-50 p-5 shadow-[0_24px_80px_rgba(180,110,20,0.12)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Installment receivables</p>
            <h3 className="mt-3 font-black">Trusted customer balances</h3>
            <p className="mt-2 text-sm leading-6 text-amber-900/70">
              Outstanding balances from approved deposit-first customers must be collected before pickup or delivery.
            </p>
            <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-amber-900">{currency(installmentOutstanding)}</p>
            <div className="mt-4 space-y-2">
              {installmentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-2xl bg-white/70 p-3 text-sm">
                  <span>
                    <strong>{order.customer}</strong>
                    <span className="ml-2 text-amber-900/55">{order.id}</span>
                  </span>
                  <strong>{currency(order.balance)}</strong>
                </div>
              ))}
            </div>
          </aside>

          <aside className="rounded-[2rem] bg-slate-950 p-5 text-white shadow-[0_24px_80px_rgba(2,6,23,0.2)]">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">Cash flow alert</p>
            <h3 className="mt-3 font-black">Overdue invoice affects supplier settlement</h3>
            <p className="mt-3 text-sm leading-6 text-slate-300">Customer invoice collection impacts cash available for fabric supplier settlement and worker costs.</p>
            <div className="mt-4 rounded-2xl bg-white/10 p-4">
              <p className="text-xs text-slate-400">Overdue amount</p>
              <p className="mt-1 text-2xl font-black">{currency(totals.overdue)}</p>
            </div>
          </aside>

          <aside className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_24px_80px_rgba(66,88,120,0.12)]">
            <h3 className="font-black">Cost Buckets</h3>
            <div className="mt-5 space-y-3 text-sm">
              {[
                ['Import', totals.importCost],
                ['Sewing', totals.labour],
                ['Workers', totals.factory],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                  <span className="font-semibold text-slate-600">{label}</span>
                  <strong>{currency(value as number)}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function AccountingMetric({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_55px_rgba(66,88,120,0.1)]">
      <div className="flex items-center justify-between">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-sm font-black">KKI</span>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">Live</span>
      </div>
      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-2xl font-black tracking-[-0.03em]">{value}</p>
      <p className="mt-2 text-xs leading-5 text-slate-400">{note}</p>
    </div>
  );
}

function AccountingStatus({ status }: { status: string }) {
  const color = status === 'Paid' ? 'bg-emerald-50 text-emerald-700' : status === 'Pending' ? 'bg-amber-50 text-amber-700' : status === 'Review' ? 'bg-blue-50 text-blue-700' : 'bg-rose-50 text-rose-700';
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${color}`}>{status}</span>;
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
