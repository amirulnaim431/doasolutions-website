'use client';

import { FormEvent, useMemo, useState } from 'react';

type View = 'customer' | 'agent' | 'backoffice';
type CustomerPanel = 'landing' | 'calculator' | 'policy' | 'bot';
type AgentPanel = 'dashboard' | 'threads' | 'performance' | 'documents' | 'bot' | 'contest';
type BackOfficePanel = 'reporting' | 'weakness';

const money = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
});

const metricCards = [
  ['Live Signals', '128', '+18%'],
  ['High Intent', '36', '12 urgent'],
  ['Engaged', '74', 'manual follow-up'],
  ['Assigned', '51', '6 agents'],
  ['Converted This Week', '9', 'RM42k est.'],
];

const socialSignals = [
  {
    signal: 'Asking about hibah coverage for young family',
    source: 'Threads',
    platform: 'Public keyword: hibah takaful',
    intent: 'High',
    score: 94,
    location: 'Shah Alam',
    time: '2m ago',
    assigned: 'Alya',
  },
  {
    signal: 'Comparing medical card contribution for parents',
    source: 'Threads',
    platform: 'Public keyword: medical card',
    intent: 'High',
    score: 88,
    location: 'Bangi',
    time: '7m ago',
    assigned: 'Farhan',
  },
  {
    signal: 'Mentions policy review before renewal',
    source: 'Facebook',
    platform: 'Public post metadata',
    intent: 'Medium',
    score: 71,
    location: 'Klang',
    time: '15m ago',
    assigned: 'Unassigned',
  },
  {
    signal: 'New parent asking about family protection',
    source: 'Threads',
    platform: 'Public keyword: family takaful',
    intent: 'Medium',
    score: 66,
    location: 'Kajang',
    time: '22m ago',
    assigned: 'Haziq',
  },
  {
    signal: 'General question about AIA plans',
    source: 'Instagram',
    platform: 'Public comment metadata',
    intent: 'Low',
    score: 48,
    location: 'Subang',
    time: '34m ago',
    assigned: 'Unassigned',
  },
];

const performanceRows = [
  ['Alya', '42', '18m', '19', '8', '19.0%'],
  ['Farhan', '38', '3h 20m', '11', '3', '7.8%'],
  ['Haziq', '31', '42m', '14', '5', '16.1%'],
  ['Nadia', '28', '24m', '13', '4', '14.2%'],
];

const weaknessRows = [
  ['Farhan', 'Slow response time', 'Average 3h 20m first reply', 'Enable auto reminder and 15-minute SLA alert'],
  ['Alya', 'High leads, lower close rate', '42 leads, 8 closed cases', 'Run objection-handling training'],
  ['Nadia', 'Missed social leads', '5 high-intent signals not saved', 'Assign daily live feed owner'],
  ['Haziq', 'Needs product training', 'Low confidence on medical card Q&A', 'Review AIA product scripts'],
];

const documents = [
  ['Product Forms', 'AIA Family Takaful Proposal Pack', 'PDF', 'Updated today'],
  ['Claim Forms', 'Medical Claim Checklist', 'PDF', '2 days ago'],
  ['Training PDFs', 'Hibah Conversation Guide', 'PDF', 'Last week'],
  ['Sales Scripts', 'Objection Handling Script', 'Doc', 'Last week'],
  ['Proposal Templates', 'Family Protection Proposal', 'Deck', 'This month'],
];

const contestAgents = [
  ['Alya', 12, 15],
  ['Haziq', 9, 15],
  ['Nadia', 7, 15],
  ['Farhan', 4, 15],
];

export default function HNTakafulDemo() {
  const [view, setView] = useState<View>('customer');
  const [customerPanel, setCustomerPanel] = useState<CustomerPanel>('landing');
  const [agentPanel, setAgentPanel] = useState<AgentPanel>('dashboard');
  const [backOfficePanel, setBackOfficePanel] = useState<BackOfficePanel>('reporting');
  const [showAuth, setShowAuth] = useState(false);

  return (
    <main className="min-h-screen bg-[#eef4ef] text-[#102018]">
      <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/85 px-4 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <a href="/showcase/" className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-emerald-900/55">
              DEMO
            </a>
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-950 text-sm font-black text-emerald-200 shadow-[0_16px_40px_rgba(2,44,34,0.18)]">
                HN
              </div>
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em]">H&N Takaful</p>
                <p className="text-xs text-emerald-950/55">Agency operating system</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 rounded-2xl border border-emerald-950/10 bg-emerald-950/5 p-1 text-[0.62rem] font-black uppercase tracking-[0.12em]">
            {(['customer', 'agent', 'backoffice'] as View[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setView(item)}
                className={`rounded-xl px-3 py-3 transition ${
                  view === item ? 'bg-emerald-950 text-white shadow-[0_12px_28px_rgba(2,44,34,0.16)]' : 'text-emerald-950/60'
                }`}
              >
                {item === 'customer' ? 'Customer View' : item === 'agent' ? 'Agent View' : 'Back Office'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {view === 'customer' && (
        <CustomerView
          panel={customerPanel}
          setPanel={setCustomerPanel}
          showAuth={() => setShowAuth(true)}
        />
      )}
      {view === 'agent' && <AgentView panel={agentPanel} setPanel={setAgentPanel} />}
      {view === 'backoffice' && <BackOfficeView panel={backOfficePanel} setPanel={setBackOfficePanel} />}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onContinue={() => {
            setShowAuth(false);
            setCustomerPanel('calculator');
          }}
        />
      )}
    </main>
  );
}

function CustomerView({
  panel,
  setPanel,
  showAuth,
}: {
  panel: CustomerPanel;
  setPanel: (panel: CustomerPanel) => void;
  showAuth: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ['landing', 'Hibah Landing'],
          ['calculator', 'Calculator'],
          ['policy', 'Policy Review'],
          ['bot', 'Product Bot'],
        ].map(([key, label]) => (
          <button key={key} type="button" onClick={() => setPanel(key as CustomerPanel)} className={pill(panel === key)}>
            {label}
          </button>
        ))}
      </div>
      {panel === 'landing' && <CustomerLanding showAuth={showAuth} setPanel={setPanel} />}
      {panel === 'calculator' && <HibahCalculator />}
      {panel === 'policy' && <PolicyReview />}
      {panel === 'bot' && <ProductBot />}
    </div>
  );
}

function CustomerLanding({ showAuth, setPanel }: { showAuth: () => void; setPanel: (panel: CustomerPanel) => void }) {
  return (
    <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="rounded-[2rem] bg-emerald-950 p-8 text-white shadow-[0_30px_90px_rgba(2,44,34,0.24)] sm:p-12">
        <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-200">Public customer funnel</p>
        <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.94] tracking-[-0.06em] sm:text-7xl">
          Know the hibah gap before the family needs it.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
          A simple lead magnet for families: calculate suggested coverage, request a free review,
          upload an existing policy, and continue with an advisor.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={showAuth} className="rounded-2xl bg-emerald-300 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-950">
            Start calculation
          </button>
          <button type="button" onClick={() => setPanel('policy')} className="rounded-2xl border border-white/18 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
            Upload policy
          </button>
        </div>
      </div>
      <div className="grid gap-4">
        {[
          ['Lead Source', 'Hibah Calculator', 'Auto-tag every signup by intent.'],
          ['Advisor Status', 'Pending Review', 'Customers know what happens next.'],
          ['Mock Compliance', 'Public + consent based', 'No real customer names or private documents.'],
        ].map(([label, value, copy]) => (
          <div key={label} className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-800/55">{label}</p>
            <h3 className="mt-3 text-3xl font-black tracking-[-0.05em]">{value}</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-950/58">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function AuthModal({ onClose, onContinue }: { onClose: () => void; onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-emerald-950/58 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Signup required</p>
            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">Save your result</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-emerald-950/10 px-3 py-1 text-sm">x</button>
        </div>
        <div className="mt-6 grid gap-3">
          <input className={inputClass} placeholder="Full name" />
          <input className={inputClass} placeholder="Phone / WhatsApp" />
          <input className={inputClass} placeholder="Email address" />
        </div>
        <button type="button" onClick={onContinue} className="mt-5 w-full rounded-2xl bg-emerald-950 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
          Continue to calculator
        </button>
      </div>
    </div>
  );
}

function HibahCalculator() {
  const [form, setForm] = useState({
    income: 6500,
    expenses: 4200,
    debts: 85000,
    dependents: 3,
    youngestAge: 6,
    spouseWorking: 'no',
    smoker: 'no',
    existing: 100000,
  });
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    const years = Math.max(25 - Number(form.youngestAge || 0), 5);
    const education = Number(form.dependents || 0) * 50000;
    const recommended = Number(form.expenses || 0) * 12 * years + Number(form.debts || 0) + education - Number(form.existing || 0);
    return Math.max(recommended, 0);
  }, [form]);

  const update = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: ['spouseWorking', 'smoker'].includes(key) ? value : Number(value) }));
  };

  return (
    <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Hibah Calculator</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Family coverage estimate</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ['income', 'Monthly income'],
            ['expenses', 'Monthly household expenses'],
            ['debts', 'Outstanding debts'],
            ['dependents', 'Number of dependents'],
            ['youngestAge', 'Youngest child age'],
            ['existing', 'Existing coverage amount'],
          ].map(([key, label]) => (
            <label key={key} className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-950/55">
              {label}
              <input className={`${inputClass} mt-2`} type="number" value={form[key as keyof typeof form]} onChange={(event) => update(key as keyof typeof form, event.target.value)} />
            </label>
          ))}
          <Select label="Spouse working?" value={form.spouseWorking} onChange={(value) => update('spouseWorking', value)} />
          <Select label="Smoker?" value={form.smoker} onChange={(value) => update('smoker', value)} />
        </div>
        <button type="button" onClick={() => setSubmitted(true)} className="mt-6 w-full rounded-2xl bg-emerald-950 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">
          Calculate hibah gap
        </button>
      </div>
      <ResultCard submitted={submitted} result={result} dependents={form.dependents} />
    </section>
  );
}

function Select({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-950/55">
      {label}
      <select className={`${inputClass} mt-2`} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </label>
  );
}

function ResultCard({ submitted, result, dependents }: { submitted: boolean; result: number; dependents: number }) {
  return (
    <div className="rounded-[2rem] border border-emerald-950/10 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Saved Lead</p>
      <h3 className="mt-3 text-3xl font-black tracking-[-0.05em]">Lead source: Hibah Calculator</h3>
      <div className="mt-8 rounded-[1.5rem] bg-emerald-950 p-6 text-white">
        <p className="text-sm text-white/60">Recommended Hibah</p>
        <p className="mt-2 text-5xl font-black tracking-[-0.06em]">{submitted ? money.format(result) : 'RM---'}</p>
        <p className="mt-4 text-sm leading-6 text-white/65">
          Formula includes household expenses until youngest child turns 25, debts, RM50,000 education buffer per child,
          then deducts existing coverage.
        </p>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <MiniStat label="Gap amount" value={submitted ? money.format(result) : 'Pending'} />
        <MiniStat label="Education buffer" value={money.format(dependents * 50000)} />
      </div>
      <button type="button" className="mt-5 w-full rounded-2xl bg-emerald-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-950">
        Request free review
      </button>
      <p className="mt-4 text-sm leading-6 text-emerald-950/58">Suggested next step: advisor reviews affordability, existing policy, and final product suitability.</p>
    </div>
  );
}

function PolicyReview() {
  const [uploaded, setUploaded] = useState(false);
  return (
    <section className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Policy Review Upload</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Mock OCR intake</h2>
        <p className="mt-4 text-sm leading-6 text-emerald-950/58">Upload a policy PDF. This demo simulates extraction only and stores the lead source as Policy Review.</p>
        <button type="button" onClick={() => setUploaded(true)} className="mt-6 w-full rounded-2xl border border-dashed border-emerald-950/25 bg-emerald-50 px-5 py-10 text-sm font-black uppercase tracking-[0.18em] text-emerald-950">
          Upload policy PDF
        </button>
        <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">Mock OCR only. No real document parsing or private data storage in this demo.</p>
      </div>
      <div className="rounded-[2rem] bg-emerald-950 p-6 text-white shadow-[0_24px_90px_rgba(2,44,34,0.22)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Pending Advisor Review</p>
        <h3 className="mt-3 text-3xl font-black tracking-[-0.05em]">{uploaded ? 'Extracted policy fields' : 'Waiting for upload'}</h3>
        <div className="mt-6 grid gap-3">
          {[
            ['Provider', 'AIA Public Takaful'],
            ['Product', 'A-Life Pelindung'],
            ['Sum Covered', 'RM100,000'],
            ['Monthly Contribution', 'RM30'],
            ['Expiry / Maturity Date', '31 Dec 2080'],
            ['Benefits', 'Accidental Death/TPD RM100,000, Additional Support RM20,000'],
            ['Lead Source', 'Policy Review'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/7 p-4">
              <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-white/45">{label}</p>
              <p className="mt-2 text-sm font-semibold text-white/90">{uploaded ? value : '---'}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductBot() {
  const [messages, setMessages] = useState([
    ['customer', 'What plan should I look at for hibah and medical card?'],
    ['bot', 'For hibah, compare contribution affordability, sum covered, nomination, and term. For medical card, compare room limit, annual limit, co-takaful, and panel hospitals. I can connect you to an advisor for suitability review.'],
  ]);

  const ask = (topic: string) => {
    setMessages((current) => [
      ...current,
      ['customer', topic],
      ['bot', 'Mock AIA product info: this is a structured education answer, not advice. Suggested next step: speak to an H&N advisor to match budget, age, occupation, health status, and family obligations.'],
    ]);
  };

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Product Bot</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">AIA mock product Q&A</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {['Medical card', 'Hibah', 'Family takaful', 'AIA plans'].map((topic) => (
            <button key={topic} type="button" onClick={() => ask(topic)} className={pill(false)}>
              {topic}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        {messages.map(([sender, copy], index) => (
          <div key={`${sender}-${index}`} className={`max-w-3xl rounded-3xl p-4 text-sm leading-6 ${sender === 'bot' ? 'bg-emerald-950 text-white' : 'ml-auto bg-emerald-100 text-emerald-950'}`}>
            {copy}
          </div>
        ))}
      </div>
      <button type="button" className="mt-6 rounded-2xl bg-emerald-300 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-emerald-950">Speak to agent</button>
    </section>
  );
}

function AgentView({ panel, setPanel }: { panel: AgentPanel; setPanel: (panel: AgentPanel) => void }) {
  const tabs: [AgentPanel, string][] = [
    ['dashboard', 'Dashboard'],
    ['threads', 'Live Threads Leads'],
    ['performance', 'Performance'],
    ['documents', 'Documents'],
    ['bot', 'WA/Telegram Bot'],
    ['contest', 'Contest'],
  ];
  return (
    <Shell
      title="Agent Toolkit"
      subtitle="RM100/month Agent Toolkit"
      tabs={tabs}
      active={panel}
      setActive={(value) => setPanel(value as AgentPanel)}
    >
      {panel === 'dashboard' && <AgentDashboard setPanel={setPanel} />}
      {panel === 'threads' && <LiveThreads />}
      {panel === 'performance' && <Performance />}
      {panel === 'documents' && <Documents />}
      {panel === 'bot' && <BotAdmin />}
      {panel === 'contest' && <Contest />}
    </Shell>
  );
}

function Shell({
  title,
  subtitle,
  tabs,
  active,
  setActive,
  children,
}: {
  title: string;
  subtitle: string;
  tabs: [string, string][];
  active: string;
  setActive: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[17rem_1fr] lg:px-8">
      <aside className="rounded-[2rem] bg-emerald-950 p-5 text-white lg:sticky lg:top-28 lg:h-fit">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">{subtitle}</p>
        <h1 className="mt-4 text-3xl font-black tracking-[-0.05em]">{title}</h1>
        <div className="mt-6 grid gap-2">
          {tabs.map(([key, label]) => (
            <button key={key} type="button" onClick={() => setActive(key)} className={`rounded-2xl px-4 py-3 text-left text-sm font-bold transition ${active === key ? 'bg-emerald-300 text-emerald-950' : 'bg-white/7 text-white/70'}`}>
              {label}
            </button>
          ))}
        </div>
      </aside>
      <div>{children}</div>
    </div>
  );
}

function AgentDashboard({ setPanel }: { setPanel: (panel: AgentPanel) => void }) {
  const cards: [AgentPanel, string, string][] = [
    ['threads', 'Live Threads Leads', 'Public social signals and intent scoring'],
    ['threads', 'Hibah Calculator Leads', 'Saved calculator submissions'],
    ['threads', 'Policy Review Leads', 'Uploaded policy review queue'],
    ['documents', 'Documents Library', 'Forms, scripts, templates'],
    ['bot', 'WhatsApp/Telegram Bot', 'Keyword-trigger document replies'],
    ['contest', 'Contest & Achievements', 'Rewards and ranking'],
    ['performance', 'Performance Tracker', 'Response, booked, closed'],
  ];
  return (
    <div className="grid gap-5">
      <Banner title="RM100/month Agent Toolkit" copy="A premium workspace for prospecting, document delivery, performance tracking, and agency coaching." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([target, title, copy]) => (
          <button key={title} type="button" onClick={() => setPanel(target)} className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-6 text-left shadow-[0_20px_70px_rgba(16,32,24,0.08)] transition hover:-translate-y-1">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-700">Agent card</p>
            <h3 className="mt-3 text-2xl font-black tracking-[-0.05em]">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-emerald-950/58">{copy}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function LiveThreads() {
  return (
    <section className="rounded-[2rem] bg-[#07110d] p-5 text-white shadow-[0_30px_90px_rgba(2,44,34,0.25)] sm:p-7">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.9)]" />
            <p className="text-xs font-black uppercase tracking-[0.35em] text-emerald-300">LIVE</p>
          </div>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Live Social Signal Feed</h2>
          <p className="mt-3 text-sm text-white/50">Updating every 15 seconds. Public keyword search metadata only.</p>
        </div>
        <div className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-xs leading-6 text-emerald-100">
          Threads Keyword Search API ready: store public post metadata, source URL, keyword, intent score, assigned agent.
        </div>
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-5">
        {metricCards.map(([label, value, hint]) => <Metric key={label} label={label} value={value} hint={hint} dark />)}
      </div>
      <div className="mt-6 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 md:grid-cols-7">
        {['Source', 'Platform', 'Keywords', 'Intent Level', 'Location', 'Real-time', 'Search'].map((filter) => (
          <div key={filter} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3 text-xs font-bold text-white/62">{filter}</div>
        ))}
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[900px] border-separate border-spacing-y-2 text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.2em] text-white/40">
            <tr>{['Signal', 'Source', 'Intent', 'Score', 'Location', 'Time', 'Assigned To', 'Actions'].map((head) => <th key={head} className="px-3 py-2">{head}</th>)}</tr>
          </thead>
          <tbody>
            {socialSignals.map((row) => (
              <tr key={row.signal} className="bg-white/[0.06]">
                <td className="rounded-l-2xl px-3 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-9 w-9 rounded-full bg-white/10" />
                    <div>
                      <p className="font-semibold text-white">{row.signal}</p>
                      <p className="text-xs text-white/42">{row.platform}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-4">{row.source}</td>
                <td className="px-3 py-4"><span className={intentClass(row.intent)}>{row.intent}</span></td>
                <td className="px-3 py-4 font-black">{row.score}</td>
                <td className="px-3 py-4">{row.location}</td>
                <td className="px-3 py-4">{row.time}</td>
                <td className="px-3 py-4">{row.assigned}</td>
                <td className="rounded-r-2xl px-3 py-4">
                  <div className="flex gap-2">
                    {['View', 'Assign', 'Save Lead'].map((action) => <button key={action} className="rounded-full border border-white/10 px-3 py-1 text-xs">{action}</button>)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
        Public signals only. Agents should engage manually and ethically.
      </p>
    </section>
  );
}

function Performance() {
  return (
    <section className="grid gap-5">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Leaderboard</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Agent performance tracker</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.18em] text-emerald-950/45">
              <tr>{['Agent', 'Leads assigned', 'Response time', 'Appointments booked', 'Policies closed', 'Conversion rate'].map((head) => <th key={head} className="border-b border-emerald-950/10 p-3">{head}</th>)}</tr>
            </thead>
            <tbody>{performanceRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="border-b border-emerald-950/8 p-3 font-semibold">{cell}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </div>
      <WeaknessCards />
    </section>
  );
}

function WeaknessCards() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {['Slow follow-up', 'Low conversion', 'Missed leads', 'Needs product training'].map((item) => (
        <div key={item} className="rounded-[1.5rem] border border-emerald-950/10 bg-white p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-600">Insight</p>
          <h3 className="mt-3 text-xl font-black tracking-[-0.04em]">{item}</h3>
          <p className="mt-3 text-sm leading-6 text-emerald-950/55">Coachable pattern detected from demo activity logs.</p>
        </div>
      ))}
    </div>
  );
}

function Documents() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Documents Library</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Upload, manage, send</h2>
        </div>
        <button className="rounded-2xl bg-emerald-950 px-5 py-3 text-sm font-black uppercase tracking-[0.18em] text-white">Upload document</button>
      </div>
      <div className="mt-6 grid gap-3">
        {documents.map(([category, name, type, updated]) => (
          <article key={name} className="grid gap-3 rounded-[1.5rem] border border-emerald-950/10 p-4 md:grid-cols-[0.7fr_1.2fr_0.4fr_0.5fr_1fr] md:items-center">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">{category}</p>
            <h3 className="text-lg font-black tracking-[-0.04em]">{name}</h3>
            <p>{type}</p>
            <p className="text-sm text-emerald-950/55">{updated}</p>
            <div className="flex flex-wrap gap-2">{['View', 'Download', 'WhatsApp', 'Telegram'].map((action) => <button key={action} className="rounded-full border border-emerald-950/10 px-3 py-2 text-xs font-bold">{action}</button>)}</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function BotAdmin() {
  return (
    <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Bot Admin</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Keyword document delivery</h2>
        <div className="mt-6 grid gap-3">
          <input className={inputClass} defaultValue="Form A" />
          <input className={inputClass} defaultValue="AIA Family Takaful Form A.pdf" />
          <button className="rounded-2xl bg-emerald-950 px-5 py-4 text-sm font-black uppercase tracking-[0.18em] text-white">Save trigger</button>
        </div>
      </div>
      <div className="rounded-[2rem] bg-emerald-950 p-6 text-white">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Mock conversation</p>
        <div className="mt-6 grid gap-3">
          <div className="ml-auto rounded-3xl bg-emerald-300 p-4 text-sm font-semibold text-emerald-950">Form A</div>
          <div className="max-w-md rounded-3xl bg-white/10 p-4 text-sm leading-6">Here is Form A PDF. <span className="font-black text-emerald-200">[Download]</span></div>
          <p className="text-sm text-white/45">Mock only. No real WhatsApp or Telegram integration connected.</p>
        </div>
      </div>
    </section>
  );
}

function Contest() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Contest & Achievements</p>
      <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Close 15 cases this quarter and win 3D2N Bali Trip</h2>
      <div className="mt-6 grid gap-4">
        {contestAgents.map(([agent, current, target]) => (
          <div key={agent} className="rounded-[1.5rem] border border-emerald-950/10 p-4">
            <div className="flex justify-between text-sm font-black"><span>{agent}</span><span>{current}/{target}</span></div>
            <div className="mt-3 h-3 rounded-full bg-emerald-950/8"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${(Number(current) / Number(target)) * 100}%` }} /></div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {['Gold Closer', 'Fast Responder', 'Policy Builder'].map((badge) => <MiniStat key={badge} label="Badge" value={badge} />)}
      </div>
    </section>
  );
}

function BackOfficeView({ panel, setPanel }: { panel: BackOfficePanel; setPanel: (panel: BackOfficePanel) => void }) {
  return (
    <Shell
      title="Back Office"
      subtitle="Agency command center"
      tabs={[
        ['reporting', 'Reporting Dashboard'],
        ['weakness', 'Weakness Monitoring'],
      ]}
      active={panel}
      setActive={(value) => setPanel(value as BackOfficePanel)}
    >
      {panel === 'reporting' ? <Reporting /> : <WeaknessMonitoring />}
    </Shell>
  );
}

function Reporting() {
  const cards = [
    ['Daily leads', '72', '+14'],
    ['Daily appointments', '18', '62% show rate'],
    ['Daily policy reviews', '11', '4 urgent'],
    ['Conversion rate', '13.8%', '+2.1%'],
    ['Source performance', 'Hibah leads #1', '44% of total'],
    ['Weakness monitoring', '4 alerts', '2 high priority'],
  ];
  return (
    <section className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">{cards.map(([label, value, hint]) => <Metric key={label} label={label} value={value} hint={hint} />)}</div>
      <div className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Agent performance</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Daily command view</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-5">
          {['Hibah Calculator', 'Policy Review', 'Threads Signals', 'Bot Q&A', 'Referrals'].map((source, index) => (
            <div key={source} className="rounded-2xl border border-emerald-950/10 p-4">
              <p className="text-xs font-bold text-emerald-950/50">{source}</p>
              <div className="mt-4 h-28 rounded-xl bg-emerald-950/5 p-2">
                <div className="mt-auto rounded-lg bg-emerald-500" style={{ height: `${35 + index * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WeaknessMonitoring() {
  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-[0_20px_70px_rgba(16,32,24,0.08)]">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-700">Agent Weakness Monitoring</p>
      <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">Coach with evidence</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-emerald-950/45">
            <tr>{['Agent', 'Weakness', 'Evidence', 'Suggested action'].map((head) => <th key={head} className="border-b border-emerald-950/10 p-3">{head}</th>)}</tr>
          </thead>
          <tbody>{weaknessRows.map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell} className="border-b border-emerald-950/8 p-3">{cell}</td>)}</tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

function Metric({ label, value, hint, dark = false }: { label: string; value: string; hint: string; dark?: boolean }) {
  return (
    <div className={`rounded-[1.5rem] p-5 ${dark ? 'border border-white/10 bg-white/[0.06]' : 'border border-emerald-950/10 bg-white shadow-[0_20px_70px_rgba(16,32,24,0.08)]'}`}>
      <p className={`text-xs font-black uppercase tracking-[0.18em] ${dark ? 'text-white/42' : 'text-emerald-950/45'}`}>{label}</p>
      <p className="mt-3 text-3xl font-black tracking-[-0.05em]">{value}</p>
      <p className={`mt-2 text-sm ${dark ? 'text-white/42' : 'text-emerald-950/55'}`}>{hint}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-emerald-950/10 bg-white p-4">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-emerald-950/42">{label}</p>
      <p className="mt-2 text-lg font-black tracking-[-0.04em] text-emerald-950">{value}</p>
    </div>
  );
}

function Banner({ title, copy }: { title: string; copy: string }) {
  return (
    <div className="rounded-[2rem] bg-emerald-950 p-6 text-white shadow-[0_24px_90px_rgba(2,44,34,0.22)]">
      <p className="text-xs font-black uppercase tracking-[0.28em] text-emerald-200">Subscription</p>
      <h2 className="mt-3 text-4xl font-black tracking-[-0.06em]">{title}</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/62">{copy}</p>
    </div>
  );
}

function pill(active: boolean) {
  return `rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition ${
    active ? 'border-emerald-950 bg-emerald-950 text-white' : 'border-emerald-950/10 bg-white text-emerald-950/58'
  }`;
}

function intentClass(intent: string) {
  const color = intent === 'High' ? 'bg-emerald-300 text-emerald-950' : intent === 'Medium' ? 'bg-amber-200 text-amber-950' : 'bg-white/10 text-white/60';
  return `rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.12em] ${color}`;
}

const inputClass = 'w-full rounded-2xl border border-emerald-950/10 bg-white px-4 py-3 text-sm outline-none ring-emerald-400/30 focus:ring-4';
