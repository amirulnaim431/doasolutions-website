'use client';

import { useState } from 'react';

const assetPath = (path: string) => `/showcase${path}`;

const fabrics = [
  {
    name: 'Dobby Chiffon Korea',
    code: 'KKI-DC-052',
    meters: '38.4m',
    reserved: '11.2m',
    location: 'Rack A2 / Roll 52',
    image: assetPath('/images/kki-fabric-dobby.png'),
  },
  {
    name: 'Premium Satin Crepe',
    code: 'KKI-SC-017',
    meters: '24.0m',
    reserved: '6.5m',
    location: 'Rack B1 / Roll 17',
    image: assetPath('/images/kki-fabric-satin.png'),
  },
  {
    name: 'Soft Premium Cotton',
    code: 'KKI-PC-068',
    meters: '52.8m',
    reserved: '18.0m',
    location: 'Display Wall / Sample 68',
    image: assetPath('/images/kki-fabric-premium.png'),
  },
];

const customerSteps = [
  { label: 'Consultation', detail: 'Design and fabric confirmed', done: true },
  { label: 'Measurement', detail: 'Measurements saved to customer profile', done: true },
  { label: 'Cutting', detail: 'Fabric allocated and cutting in progress', done: true },
  { label: 'Sewing', detail: 'Tailoring queue, estimated 2 days', done: false },
  { label: 'Ready', detail: 'Pickup / delivery notification', done: false },
];

const orders = [
  { id: 'TMP-1048', customer: 'Nur Aina', fabric: 'Dobby Chiffon Korea', status: 'Cutting', due: 'Today', progress: '62%' },
  { id: 'TMP-1049', customer: 'Farah Izzati', fabric: 'Premium Satin Crepe', status: 'Sewing', due: 'Tomorrow', progress: '78%' },
  { id: 'TMP-1050', customer: 'Amira Zulaikha', fabric: 'Soft Premium Cotton', status: 'Consultation', due: 'Friday', progress: '18%' },
  { id: 'TMP-1051', customer: 'Hana Sofea', fabric: 'Dobby Chiffon Korea', status: 'Finished', due: 'Ready', progress: '100%' },
];

const alerts = [
  'Dobby Chiffon Korea: reorder when below 20m',
  '3 tempahan waiting for cutting confirmation',
  '2 pickup reminders scheduled for tonight',
];

export default function KKIDemo() {
  const [view, setView] = useState<'customer' | 'staff'>('customer');

  return (
    <main className="min-h-screen bg-[#f7f2e8] text-[#17130d]">
      <header className="fixed inset-x-0 top-0 z-50 px-4 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-black/10 bg-white/70 px-4 py-3 shadow-[0_18px_60px_rgba(50,40,25,0.12)] backdrop-blur-xl">
          <a href="/showcase/" className="font-sans text-[0.65rem] font-black uppercase tracking-[0.28em] text-black/55">
            DEMO
          </a>
          <div className="flex items-center gap-3">
            <img src={assetPath('/images/kki-logo.jpg')} alt="KKI logo" className="h-10 w-10 rounded-full object-cover" />
            <span className="hidden font-sans text-xs font-black uppercase tracking-[0.22em] sm:block">
              Kedai Kain Import
            </span>
          </div>
          <div className="flex rounded-full border border-black/10 bg-white p-1">
            <button
              type="button"
              onClick={() => setView('customer')}
              className={`rounded-full px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] transition ${
                view === 'customer' ? 'bg-[#17130d] text-white' : 'text-black/55'
              }`}
            >
              Customer
            </button>
            <button
              type="button"
              onClick={() => setView('staff')}
              className={`rounded-full px-4 py-2 text-[0.62rem] font-black uppercase tracking-[0.16em] transition ${
                view === 'staff' ? 'bg-[#17130d] text-white' : 'text-black/55'
              }`}
            >
              Staff app
            </button>
          </div>
        </div>
      </header>

      {view === 'customer' ? <CustomerHomepage /> : <StaffDashboard />}
    </main>
  );
}

function CustomerHomepage() {
  return (
    <div className="animate-demo-in overflow-hidden">
      <section className="relative grid min-h-screen items-center px-6 pb-20 pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,159,65,0.22),transparent_32%),linear-gradient(135deg,#fffaf0,#f7f2e8_52%,#e7d6b4)]" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#a36d14]">
              Premium fabric + tempahan tracker
            </p>
            <h1 className="mt-7 font-serif text-6xl leading-[0.92] text-[#17130d] sm:text-8xl">
              Tempahan kain, tracked like a delivery.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-black/62">
              Customers can book consultations, choose kain, submit measurements, and follow
              their tailoring order from consultation to cutting, sewing, finishing, and pickup.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a className="rounded-full bg-[#17130d] px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.25em] text-white" href="#book">
                Book consultation
              </a>
              <a className="rounded-full border border-black/15 bg-white/55 px-8 py-4 text-center font-sans text-xs font-black uppercase tracking-[0.25em]" href="#tracker">
                View progress
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={assetPath('/images/kki-staff-working.png')}
              alt=""
              className="aspect-[4/5] w-full rounded-[2rem] object-cover shadow-[0_40px_100px_rgba(52,39,16,0.24)]"
            />
            <div className="absolute -bottom-8 left-6 right-6 rounded-[1.5rem] border border-white/70 bg-white/75 p-5 shadow-[0_22px_70px_rgba(30,20,8,0.16)] backdrop-blur-xl">
              <p className="font-sans text-xs font-black uppercase tracking-[0.25em] text-[#a36d14]">Live order</p>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-serif text-3xl">TMP-1048</p>
                  <p className="mt-1 text-sm text-black/55">Baju kurung custom / Cutting stage</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-black text-emerald-700">62%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tracker" className="bg-[#17130d] px-6 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#d69f41]">
              Customer progress report
            </p>
            <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">
              No more WhatsApp guessing.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/62">
              Instead of customers asking "siap belum?", the system shows a clear order timeline,
              estimated pickup, and the next action needed.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-[0_28px_90px_rgba(0,0,0,0.28)]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-black uppercase tracking-[0.24em] text-[#d69f41]">Tempahan TMP-1048</p>
                <h3 className="mt-2 font-serif text-3xl">Baju kurung custom</h3>
              </div>
              <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#17130d]">ETA 2 days</span>
            </div>
            <div className="grid gap-4">
              {customerSteps.map((step, index) => (
                <div key={step.label} className="grid grid-cols-[2rem_1fr] gap-4">
                  <div className={`mt-1 grid h-8 w-8 place-items-center rounded-full text-xs font-black ${step.done ? 'bg-[#d69f41] text-black' : 'bg-white/10 text-white/40'}`}>
                    {index + 1}
                  </div>
                  <div className="border-b border-white/10 pb-4">
                    <p className="font-sans text-sm font-black uppercase tracking-[0.16em]">{step.label}</p>
                    <p className="mt-1 text-sm text-white/55">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FabricGallery />

      <section id="book" className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <img src={assetPath('/images/kki-staff-working.png')} alt="" className="aspect-[16/12] rounded-[2rem] object-cover shadow-[0_24px_80px_rgba(48,35,12,0.16)]" />
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#a36d14]">Consultation booking</p>
            <h2 className="mt-6 font-serif text-5xl leading-tight sm:text-6xl">Book a fabric and tailoring consultation.</h2>
            <p className="mt-6 text-lg leading-8 text-black/60">
              Customers can reserve a slot, choose fabric references, upload inspiration photos,
              and let staff prepare samples before they arrive.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Pick fabric', 'Save measurement', 'Track tempahan'].map((item) => (
                <div key={item} className="rounded-2xl border border-black/10 bg-white/70 p-5 font-sans text-xs font-black uppercase tracking-[0.18em]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <KKIFooter tone="customer" />
    </div>
  );
}

function FabricGallery() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-[#a36d14]">Product catalog</p>
            <h2 className="mt-5 font-serif text-5xl sm:text-6xl">Fabric stock customers can browse.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-black/55">Sample cards, color numbers, and availability can connect directly to the staff inventory.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {fabrics.map((fabric) => (
            <article key={fabric.code} className="overflow-hidden rounded-[1.6rem] border border-black/10 bg-[#f8f4ea]">
              <img src={fabric.image} alt="" className="aspect-[4/5] w-full object-cover" />
              <div className="p-6">
                <p className="font-sans text-xs font-black uppercase tracking-[0.22em] text-black/45">{fabric.code}</p>
                <h3 className="mt-3 font-serif text-3xl">{fabric.name}</h3>
                <p className="mt-4 text-sm text-black/55">{fabric.meters} available / {fabric.location}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StaffDashboard() {
  return (
    <div className="animate-demo-in min-h-screen bg-[linear-gradient(135deg,#f7fbff,#fff7ed_48%,#eef7ff)] px-4 pb-12 pt-28 text-[#101828]">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_0.86fr] lg:items-end">
          <div>
            <p className="font-sans text-xs font-black uppercase tracking-[0.42em] text-sky-600">Laravel operations webapp</p>
            <h1 className="mt-5 font-sans text-5xl font-black tracking-[-0.05em] sm:text-7xl">
              KKI staff control room.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              A clean internal system for fabric inventory, roll locations, reserved meters,
              tempahan backlog, order status, pickup reminders, and staff task flow.
            </p>
          </div>
          <div className="rounded-[2rem] border border-white/70 bg-white/65 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.16)] backdrop-blur-xl">
            <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-slate-400">Today</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                ['27', 'Active orders'],
                ['418m', 'Fabric stock'],
                ['8', 'Ready pickup'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl bg-white/70 p-4">
                  <p className="font-sans text-3xl font-black">{value}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
          <InventoryPanel />
          <OrdersPanel />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <AlertsPanel />
          <WorkflowPanel />
        </div>
      </section>
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
        {fabrics.map((fabric) => (
          <article key={fabric.code} className="grid grid-cols-[4.5rem_1fr] gap-4 rounded-3xl border border-slate-200/70 bg-white/72 p-3">
            <img src={fabric.image} alt="" className="h-20 w-20 rounded-2xl object-cover" />
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-sans text-sm font-black">{fabric.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{fabric.code} / {fabric.location}</p>
                </div>
                <p className="font-sans text-lg font-black">{fabric.meters}</p>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-sky-500" style={{ width: fabric.name.includes('Cotton') ? '82%' : fabric.name.includes('Satin') ? '46%' : '64%' }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{fabric.reserved} reserved for confirmed tempahan</p>
            </div>
          </article>
        ))}
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
        <span className="rounded-full bg-amber-100 px-4 py-2 text-xs font-black text-amber-700">Auto reminders on</span>
      </div>
      <div className="overflow-hidden rounded-3xl border border-slate-200/70 bg-white/72">
        {orders.map((order) => (
          <div key={order.id} className="grid gap-3 border-b border-slate-100 p-4 last:border-b-0 md:grid-cols-[0.7fr_1fr_0.8fr_0.7fr] md:items-center">
            <div>
              <p className="font-sans text-sm font-black">{order.id}</p>
              <p className="text-xs text-slate-500">{order.customer}</p>
            </div>
            <p className="text-sm font-semibold text-slate-600">{order.fabric}</p>
            <span className={`w-fit rounded-full px-3 py-2 text-xs font-black ${
              order.status === 'Finished' ? 'bg-emerald-100 text-emerald-700' : order.status === 'Sewing' ? 'bg-purple-100 text-purple-700' : order.status === 'Cutting' ? 'bg-sky-100 text-sky-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {order.status}
            </span>
            <div>
              <p className="text-xs font-black text-slate-400">{order.due}</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#101828]" style={{ width: order.progress }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlertsPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/62 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
      <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-rose-600">Automation</p>
      <h2 className="mt-2 font-sans text-2xl font-black">System alerts</h2>
      <div className="mt-5 grid gap-3">
        {alerts.map((alert) => (
          <div key={alert} className="rounded-2xl bg-white/75 p-4 text-sm font-semibold text-slate-600">
            {alert}
          </div>
        ))}
      </div>
    </section>
  );
}

function WorkflowPanel() {
  return (
    <section className="rounded-[2rem] border border-white/70 bg-white/62 p-5 shadow-[0_24px_80px_rgba(66,88,120,0.14)] backdrop-blur-xl">
      <p className="font-sans text-xs font-black uppercase tracking-[0.28em] text-emerald-600">Workflow</p>
      <h2 className="mt-2 font-sans text-2xl font-black">From customer request to pickup</h2>
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {['Consult', 'Measure', 'Cutting', 'Sewing', 'Pickup'].map((step, index) => (
          <div key={step} className="rounded-3xl bg-white/75 p-4">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#101828] text-xs font-black text-white">0{index + 1}</span>
            <p className="mt-8 font-sans text-sm font-black">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
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
            <span key={item} className={`grid h-11 w-11 place-items-center rounded-full border text-xs font-black ${dark ? 'border-white/20' : 'border-black/15'}`}>
              {item}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
