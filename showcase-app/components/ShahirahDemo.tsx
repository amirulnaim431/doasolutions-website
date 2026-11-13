'use client';

import { useEffect, useRef, useState } from 'react';
import './ShahirahDemo.css';

type View = 'overview' | 'orders' | 'inventory' | 'customers' | 'storefront';
const pieces = [
  { sku: 'SA-PS-101', name: 'Pleated Shawl', shade: 'Rosewood', color: '#9f6f73', stock: 84, reserved: 18, price: 49 },
  { sku: 'SA-PS-102', name: 'Pleated Shawl', shade: 'Soft Sand', color: '#c6ae95', stock: 126, reserved: 31, price: 49 },
  { sku: 'SA-BS-204', name: 'Bawal Satin', shade: 'Olive Mist', color: '#909984', stock: 43, reserved: 12, price: 39 },
  { sku: 'SA-BS-205', name: 'Bawal Satin', shade: 'Midnight', color: '#343a50', stock: 67, reserved: 9, price: 39 },
];
const seedOrders = [
  { id: 'SA-2401', name: 'Alya N.', item: 'Pleated Shawl · Rosewood', total: 98, status: 'Packing' },
  { id: 'SA-2402', name: 'Nadia R.', item: 'Bawal Satin · Olive Mist', total: 39, status: 'New' },
  { id: 'SA-2403', name: 'Mira H.', item: 'Pleated Shawl · Soft Sand', total: 147, status: 'Shipped' },
  { id: 'SA-2404', name: 'Sofea M.', item: 'Bawal Satin · Midnight', total: 78, status: 'Delivered' },
];
const money = (n:number) => `RM${n.toLocaleString('en-MY')}`;

function Count({ value, prefix = '' }: { value: number; prefix?: string }) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(value); return; }
    let frame = 0; const start = performance.now();
    const tick = (now:number) => { const t = Math.min(1, (now-start)/1150); setShown(Math.round(value*(1-Math.pow(1-t, 4)))); if(t<1) frame=requestAnimationFrame(tick); };
    frame=requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{prefix}{shown.toLocaleString('en-MY')}</>;
}

export default function ShahirahDemo() {
  const [view, setView] = useState<View>('overview');
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState('');
  const [orders, setOrders] = useState(seedOrders);
  const [notice, setNotice] = useState('');
  const [ready, setReady] = useState(false);
  const themeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { const id = requestAnimationFrame(() => setReady(true)); return () => cancelAnimationFrame(id); }, []);
  function toggleTheme() {
    const next = !dark;
    const button = themeButton.current;
    const rect = button?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : innerWidth;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, innerWidth-x), Math.max(y, innerHeight-y));
    const doc = document as Document & { startViewTransition?: (callback: () => void) => { ready: Promise<void> } };
    if (doc.startViewTransition && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const transition = doc.startViewTransition(() => setDark(next));
      transition.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] }, { duration: 680, easing: 'cubic-bezier(.2,.8,.2,1)', pseudoElement: '::view-transition-new(root)' })).catch(() => {});
    } else setDark(next);
  }
  const filteredOrders = orders.filter(o => `${o.id} ${o.name} ${o.item} ${o.status}`.toLowerCase().includes(query.toLowerCase()));
  return <div className={`sa-app ${dark ? 'sa-dark' : ''} ${ready ? 'sa-ready' : ''}`}>
    <div className="sa-shell">
      <aside className="sa-side">
        <a className="sa-back" href="/showcase/">← DOA showcase</a>
        <div className="sa-mark"><span className="sa-monogram">sa</span><div><strong>Shahirah Aina</strong><small>Hijabwear · concept demo</small></div></div>
        <p className="sa-side-label">WORKSPACE</p>
        <nav aria-label="Demo sections">{([['overview','Overview'],['orders','Orders'],['inventory','Inventory'],['customers','Customers'],['storefront','Customer portal']] as const).map(([key,label]) => <button key={key} className={view===key?'active':''} onClick={()=>setView(key)}>{label}<span>↗</span></button>)}</nav>
        <div className="sa-side-foot"><span className="sa-live-dot"/> Sample data only<br/><small>DOA Solutions presentation</small></div>
      </aside>
      <main className="sa-main">
        <header className="sa-top"><div><span className="sa-kicker">RETAIL OPERATIONS / DEMO</span><h1>{view === 'overview' ? 'A clearer view of every sale.' : view[0].toUpperCase()+view.slice(1)}</h1><p>From a new order to a packed parcel, in one place.</p></div><button ref={themeButton} className="sa-theme" onClick={toggleTheme} aria-label={`Switch to ${dark?'day':'night'} mode`}>{dark?'☀ Day mode':'☾ Night mode'}<span className="sa-toggle"><i/></span></button></header>
        <div className="sa-notice">Illustrative concept for discussion · Products, customers and figures are fictional. No checkout or live business connection.</div>
        {view==='storefront' && <Storefront />}
        {view==='overview' && <>
          <section className="sa-metrics" aria-label="Illustrative performance"><article><small>Today’s sales</small><strong><Count value={4286} prefix="RM"/></strong><span>↗ 18.4% from yesterday</span></article><article><small>Orders received</small><strong><Count value={73}/></strong><span>12 awaiting packing</span></article><article><small>Units available</small><strong><Count value={320}/></strong><span>Across 4 sample variants</span></article><article><small>Repeat customers</small><strong><Count value={38} prefix=""/>%</strong><span>Illustrative share</span></article></section>
          <div className="sa-overview-grid"><section className="sa-panel sa-chart"><div className="sa-panel-head"><div><small>SALES PULSE</small><h2>Seven-day performance</h2></div><span>RM · sample</span></div><div className="sa-bars" aria-label="Sample sales graph">{[34,48,41,64,57,76,92].map((height,i)=><div className="sa-bar-col" key={i}><span className="sa-bar-track"><i style={{height:`${height}%`,animationDelay:`${i*85}ms`}}/></span><small>{['Sat','Sun','Mon','Tue','Wed','Thu','Fri'][i]}</small></div>)}</div><p className="sa-chart-note">Bars rise to illustrative daily totals when the dashboard opens.</p></section><section className="sa-panel sa-focus"><small>FULFILMENT FOCUS</small><h2>Today’s handover</h2><p>12 parcels are queued for packing. The next step is to confirm variants, print labels, and hand them to the courier.</p><div className="sa-focus-number"><Count value={12}/> <span>to pack</span></div><button onClick={()=>setView('orders')}>Open order queue <span>↗</span></button></section></div>
          <section className="sa-panel sa-recent"><div className="sa-panel-head"><div><small>ORDER FLOW</small><h2>Recent orders</h2></div><button onClick={()=>setView('orders')}>View all ↗</button></div><OrderTable orders={orders.slice(0,3)} onAdvance={advance}/></section>
        </>}
        {view==='orders' && <section className="sa-panel"><div className="sa-panel-head"><div><small>FULFILMENT</small><h2>Order queue</h2></div><input aria-label="Search orders" placeholder="Search order or customer" value={query} onChange={e=>setQuery(e.target.value)}/></div><OrderTable orders={filteredOrders} onAdvance={advance}/>{filteredOrders.length===0 && <p className="sa-empty">No matching sample orders. Try a different search.</p>}{notice && <p className="sa-feedback" role="status">{notice}</p>}</section>}
        {view==='inventory' && <section className="sa-panel"><div className="sa-panel-head"><div><small>PRODUCT & STOCK</small><h2>Variant availability</h2></div><span>Sample catalogue</span></div><div className="sa-products">{pieces.map(p=><article key={p.sku}><div className="sa-swatch" style={{background:p.color}}><span>SA</span></div><div><small>{p.sku}</small><h3>{p.name}</h3><p>{p.shade} · {money(p.price)}</p><div className="sa-stock"><span>{p.stock} available</span><span>{p.reserved} reserved</span></div><div className="sa-stock-track"><i style={{width:`${100*p.stock/(p.stock+p.reserved)}%`}}/></div></div></article>)}</div></section>}
        {view==='customers' && <section className="sa-panel"><div className="sa-panel-head"><div><small>CUSTOMER VIEW</small><h2>Recent relationships</h2></div><span>Illustrative records</span></div><div className="sa-customers">{[['Alya N.','3 orders','Rosewood collection'],['Nadia R.','1 order','New customer'],['Mira H.','5 orders','Repeat customer'],['Sofea M.','2 orders','Satin collection']].map(([name,history,note])=><div key={name}><span className="sa-avatar">{name[0]}</span><strong>{name}</strong><span>{history}</span><small>{note}</small></div>)}</div></section>}
      </main>
    </div>
  </div>;
  function advance(id:string) { const next:Record<string,string>={New:'Packing',Packing:'Shipped',Shipped:'Delivered'}; const current=orders.find(o=>o.id===id); if(!current||!next[current.status])return; setOrders(rows=>rows.map(o=>o.id===id?{...o,status:next[o.status]}:o)); setNotice(`${id} moved to ${next[current.status]} in this browser demo.`); }
}

function OrderTable({orders,onAdvance}:{orders:typeof seedOrders;onAdvance:(id:string)=>void}) { return <div className="sa-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Item</th><th>Total</th><th>Status</th><th>Demo action</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><strong>{o.id}</strong></td><td>{o.name}</td><td>{o.item}</td><td>{money(o.total)}</td><td><span className={`sa-status sa-${o.status.toLowerCase()}`}>{o.status}</span></td><td>{o.status==='Delivered'?<span className="sa-done">Complete</span>:<button onClick={()=>onAdvance(o.id)}>Move forward →</button>}</td></tr>)}</tbody></table></div>; }

function Storefront() {
  const [selected, setSelected] = useState<(typeof pieces)[number] | null>(null);
  const [tracking, setTracking] = useState(false);
  return <div className="sa-store">
    <section className="sa-store-hero"><div><span className="sa-kicker">CUSTOMER EXPERIENCE / CONCEPT</span><h2>Everyday ease, in every shade.</h2><p>Explore a fictional hijabwear collection, view available shades, and follow an illustrative order journey.</p><button onClick={()=>document.getElementById('sa-collection')?.scrollIntoView({behavior:'smooth'})}>Browse the collection ↘</button></div><div className="sa-store-art"><div className="sa-drape sa-drape-one"/><div className="sa-drape sa-drape-two"/><span>SA / 01</span></div></section>
    <section id="sa-collection" className="sa-panel sa-store-collection"><div className="sa-panel-head"><div><small>CURATED SHADES</small><h2>The collection</h2></div><span>Illustrative products and prices</span></div><div className="sa-store-grid">{pieces.map(p=><article key={p.sku}><div className="sa-store-swatch" style={{background:p.color}}><span>SA</span></div><small>{p.sku}</small><h3>{p.name}</h3><p>{p.shade}</p><div><strong>{money(p.price)}</strong><button onClick={()=>setSelected(p)}>View details ↗</button></div></article>)}</div>{selected && <div className="sa-selected" role="status"><strong>{selected.name} · {selected.shade}</strong><span>{selected.stock} sample units available. Checkout is disabled in this concept.</span><button onClick={()=>setSelected(null)}>Close</button></div>}</section>
    <section className="sa-panel sa-track"><div><small>ORDER TRACKING</small><h2>Follow each step</h2><p>Customers can see progress from purchase to delivery in the proposed system.</p><button onClick={()=>setTracking(!tracking)}>{tracking?'Hide sample tracking':'Show sample tracking'} ↗</button></div>{tracking && <ol><li>Order received <span>Complete</span></li><li>Variants confirmed <span>Complete</span></li><li>Packing <span>In progress</span></li><li>Courier handover <span>Next</span></li></ol>}</section>
  </div>;
}
