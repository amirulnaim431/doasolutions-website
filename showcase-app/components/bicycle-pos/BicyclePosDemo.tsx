'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Activity, ArrowDownToLine, ArrowRight, Bike, Boxes, Check, ChevronDown, ClipboardList, CreditCard, History, LayoutDashboard, Menu, Minus, Moon, PackagePlus, Plus, Printer, RotateCcw, Search, ShoppingBag, SlidersHorizontal, Sun, Trash2, Wrench, X } from 'lucide-react';
import { available, customers, demoId, initialState, money, reserved, stamp, suppliers, total, type DemoState, type Job, type Line, type Product, type Sale, type Tier } from './data';
import { formatPackagePrice, hostingMaintenanceMonthly, packageFor, packages, pricingScopeNote } from './pricing';
import styles from './BicyclePosDemo.module.css';

type View = 'pos' | 'overview' | 'workshop' | 'purchasing' | 'stock' | 'sales' | 'compare';
const key = (tier: Tier) => `doa-ali-pluscycle-demo-v1-tier-${tier}`;
const labels = packages.map(item => item.name);
const categories = ['All', 'Bicycles', 'Parts', 'Accessories', 'Services'];
const jobFlow: Job['status'][] = ['Received','In Progress','Ready','Collected'];

export default function BicyclePosDemo() {
  const [tier,setTier] = useState<Tier>(1);
  const [view,setView] = useState<View>('pos');
  const [state,setState] = useState<DemoState>(initialState);
  const [hydrated,setHydrated] = useState(false);
  const [role,setRole] = useState<'Owner'|'Staff'>('Owner');
  const [theme,setTheme] = useState<'day'|'night'>('day');
  const [cart,setCart] = useState<Line[]>([]);
  const [checkoutJob,setCheckoutJob] = useState<string | null>(null);
  const [category,setCategory] = useState('All');
  const [query,setQuery] = useState('');
  const [method,setMethod] = useState('Cash');
  const [receipt,setReceipt] = useState<Sale | null>(null);
  const [notice,setNotice] = useState('');
  const [menu,setMenu] = useState(false);
  const [selectedJob,setSelectedJob] = useState<string | null>(null);
  const [jobForm,setJobForm] = useState({ customer: customers[0], bicycle: '', issue: '', work: '' });
  const [orderSupplier,setOrderSupplier] = useState(suppliers[0]);
  const [orderLines,setOrderLines] = useState<{ id: string; qty: number }[]>([]);
  const [receiptQty,setReceiptQty] = useState<Record<string,number>>({});
  const busy = useRef(false);
  const themeTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    try { const saved = localStorage.getItem(key(tier)); setState(saved ? JSON.parse(saved) as DemoState : initialState(tier)); }
    catch { setState(initialState(tier)); }
    setHydrated(true); setCart([]); setCheckoutJob(null); setReceipt(null); setSelectedJob(null);
  },[tier]);
  useEffect(() => { if (hydrated) localStorage.setItem(key(tier),JSON.stringify(state)); },[state,tier,hydrated]);
  useEffect(() => { try { if (localStorage.getItem('doa-ali-pluscycle-theme') === 'night') setTheme('night'); } catch {} },[]);
  useEffect(() => { if (!notice) return; const t=window.setTimeout(()=>setNotice(''),4200); return ()=>window.clearTimeout(t); },[notice]);
  const selected = state.jobs.find(j=>j.id===selectedJob);
  const activeJob = state.jobs.find(j=>j.id===checkoutJob);
  const filtered = useMemo(()=>state.products.filter(p=>(category==='All'||p.category===category)&&`${p.name} ${p.id}`.toLowerCase().includes(query.toLowerCase())),[state.products,category,query]);
  const currentLines = activeJob ? activeJob.lines : cart;
  const currentTotal = total(currentLines);
  const today = new Date().toDateString();
  const todaySales = state.sales.filter(s=>new Date(s.at).toDateString()===today);
  const monthSales = state.sales.filter(s=>new Date(s.at).getMonth()===new Date().getMonth()&&new Date(s.at).getFullYear()===new Date().getFullYear());
  const navigate=(next:View)=>{setView(next);setMenu(false);setNotice('');};
  const nextNum=(current:DemoState)=>current.next+1;
  const move=(current:DemoState,id:string,qty:number,reason:string): DemoState=>({ ...current, movements:[{id:demoId('MOV',current.next+current.movements.length),at:stamp(),productId:id,qty,reason,staff:`Demo ${role}`},...current.movements] });

  function addToCart(p:Product) {
    if (checkoutJob) { setNotice('Complete or leave the workshop checkout first.'); return; }
    const existing=cart.find(l=>l.id===p.id)?.qty??0;
    if (p.category!=='Services'&&existing>=available(state,p.id)){setNotice(`${p.name}: no more available stock.`);return;}
    setCart(previous=>previous.some(l=>l.id===p.id)?previous.map(l=>l.id===p.id?{...l,qty:l.qty+1}:l):[...previous,{id:p.id,name:p.name,qty:1,price:p.price,stock:p.category!=='Services'}]);
  }
  function cartQty(id:string,delta:number) {
    const item=cart.find(l=>l.id===id); if(!item)return;
    if(delta>0&&item.stock&&item.qty>=available(state,id)){setNotice('No more available stock.');return;}
    setCart(cart.map(l=>l.id===id?{...l,qty:l.qty+delta}:l).filter(l=>l.qty>0));
  }
  function checkout() {
    if(busy.current)return; busy.current=true;
    try {
      if(!currentLines.length){setNotice('Add an item before checkout.');return;}
      if(activeJob&&(activeJob.paid||activeJob.status!=='Ready')){setNotice('This job is not ready for checkout.');return;}
      const needed=currentLines.filter(l=>l.stock);
      if(needed.some(l=>l.qty>available(state,l.id,activeJob?.id))){setNotice('Stock changed. Check available quantities.');return;}
      const sale:Sale={id:demoId('APC',state.next),at:stamp(),lines:currentLines.map(l=>({...l})),total:currentTotal,method,jobId:activeJob?.id};
      let next:DemoState={...state,next:nextNum(state),sales:[sale,...state.sales],products:state.products.map(p=>({...p,stock:p.stock-(needed.find(l=>l.id===p.id)?.qty??0)})),jobs:state.jobs.map(j=>j.id===activeJob?.id?{...j,paid:true,status:'Collected'}:j)};
      needed.forEach(l=>{next=move(next,l.id,-l.qty,activeJob?`Workshop checkout ${activeJob.id}`:`Sale ${sale.id}`);});
      setState(next);setReceipt(sale);setCart([]);setCheckoutJob(null);setNotice(`${sale.id} recorded. No real payment was processed.`);
    } finally {busy.current=false;}
  }
  function adjustStock(id:string,qty:number,reason:string){
    if(!Number.isInteger(qty)||qty===0||!reason.trim()){setNotice('Enter a whole quantity and reason.');return;}
    const p=state.products.find(p=>p.id===id);if(!p||p.stock+qty<reserved(state,id)){setNotice('Adjustment would go below reserved stock.');return;}
    const changed=move({...state,products:state.products.map(p=>p.id===id?{...p,stock:p.stock+qty}:p)},id,qty,reason.trim());setState(changed);setNotice('Stock movement saved.');
  }
  function createJob(){
    if(!jobForm.bicycle.trim()||!jobForm.issue.trim()||!jobForm.work.trim()){setNotice('Add the bicycle, issue and work required.');return;}
    const job:Job={id:demoId('JOB',state.next),customer:jobForm.customer,bicycle:jobForm.bicycle.trim(),issue:jobForm.issue.trim(),work:jobForm.work.trim(),status:'Received',lines:[],paid:false};
    setState({...state,next:nextNum(state),jobs:[job,...state.jobs]});setSelectedJob(job.id);setJobForm({...jobForm,bicycle:'',issue:'',work:''});setNotice(`${job.id} created.`);
  }
  function jobStatus(job:Job,status:Job['status']){
    if(job.paid||job.status==='Cancelled'){setNotice('A closed job cannot be changed.');return;}
    if(status==='Cancelled'||jobFlow.indexOf(status)===jobFlow.indexOf(job.status)+1){setState({...state,jobs:state.jobs.map(j=>j.id===job.id?{...j,status}:j)});setNotice(status==='Cancelled'?'Job cancelled; parts released.':`Job moved to ${status}.`);}
  }
  function addJobLine(job:Job,p:Product){
    if(job.paid||job.status==='Cancelled'||job.status==='Collected')return;
    const alreadyAssigned=job.lines.find(l=>l.id===p.id)?.qty??0;
    if(p.category!=='Services'&&available(state,p.id,job.id)<=alreadyAssigned){setNotice(`${p.name}: no available stock.`);return;}
    setState({...state,jobs:state.jobs.map(j=>j.id===job.id?{...j,lines:j.lines.some(l=>l.id===p.id)?j.lines.map(l=>l.id===p.id?{...l,qty:l.qty+1}:l):[...j.lines,{id:p.id,name:p.name,qty:1,price:p.price,stock:p.category!=='Services'}]}:j)});
  }
  function removeJobLine(job:Job,id:string){if(job.paid)return;setState({...state,jobs:state.jobs.map(j=>j.id===job.id?{...j,lines:j.lines.filter(l=>l.id!==id)}:j)});}
  function createOrder(){
    if(!orderLines.length){setNotice('Add products to the purchase order.');return;}
    const lines=orderLines.filter(l=>Number.isInteger(l.qty)&&l.qty>0).map(l=>({id:l.id,qty:l.qty,received:0,cost:state.products.find(p=>p.id===l.id)?.cost??0}));
    if(!lines.length){setNotice('Enter a valid order quantity.');return;}
    setState({...state,next:nextNum(state),orders:[{id:demoId('PO',state.next),supplier:orderSupplier,lines,receipts:[]},...state.orders]});setOrderLines([]);setNotice('Purchase order created.');
  }
  function receive(orderId:string){
    if(busy.current)return;busy.current=true;
    try{
      const order=state.orders.find(o=>o.id===orderId);if(!order)return;
      const quantities=order.lines.map(l=>({id:l.id,qty:Number(receiptQty[`${order.id}-${l.id}`]??0)}));
      if(quantities.some(q=>!Number.isInteger(q.qty)||q.qty<0)||quantities.every(q=>q.qty===0)||quantities.some(q=>q.qty>(order.lines.find(l=>l.id===q.id)!.qty-order.lines.find(l=>l.id===q.id)!.received))){setNotice('Enter quantities within the remaining order balance.');return;}
      const receiptId=demoId('GRN',state.next);
      let next:DemoState={...state,next:nextNum(state),orders:state.orders.map(o=>o.id===orderId?{...o,lines:o.lines.map(l=>({...l,received:l.received+(quantities.find(q=>q.id===l.id)?.qty??0)})),receipts:[...o.receipts,receiptId]}:o),products:state.products.map(p=>({...p,stock:p.stock+(quantities.find(q=>q.id===p.id)?.qty??0)}))};
      quantities.filter(q=>q.qty>0).forEach(q=>{next=move(next,q.id,q.qty,`Receive ${receiptId} / ${orderId}`);});
      setState(next);setReceiptQty({});setNotice(`${receiptId} received; balances updated once.`);
    }finally{busy.current=false;}
  }
  function changeTier(next:Tier){setHydrated(false);setTier(next);setView('pos');}
  function changeTheme(){
    const next=theme==='day'?'night':'day';
    const save=()=>{try{localStorage.setItem('doa-ali-pluscycle-theme',next);}catch{}};
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches){setTheme(next);save();return;}
    themeTransition.current?.skipTransition();
    document.documentElement.classList.add('ali-theme-transition');
    const transition=document.startViewTransition(()=>{flushSync(()=>setTheme(next));save();});
    themeTransition.current=transition;
    const finish=()=>{if(themeTransition.current===transition){document.documentElement.classList.remove('ali-theme-transition');themeTransition.current=null;}};
    void transition.finished.then(finish,finish);
  }
  function reset(){if(!window.confirm(`Reset only the ${labels[tier-1]} demo data?`))return;localStorage.removeItem(key(tier));setState(initialState(tier));setCart([]);setCheckoutJob(null);setReceipt(null);setSelectedJob(null);setNotice(`${labels[tier-1]} reset.`);}

  const nav: {id:View;label:string;icon:typeof ShoppingBag;min:Tier}[]=[
    {id:'pos',label:'Point of Sale',icon:ShoppingBag,min:1},{id:'overview',label:'Overview',icon:LayoutDashboard,min:1},{id:'workshop',label:'Workshop',icon:Wrench,min:2},{id:'purchasing',label:'Purchasing',icon:PackagePlus,min:3},{id:'stock',label:'Stock',icon:Boxes,min:1},{id:'sales',label:'Sales history',icon:History,min:1},{id:'compare',label:'Compare packages',icon:SlidersHorizontal,min:1},
  ];
  const title:Record<View,string>={pos:'Point of Sale',overview:'Shop overview',workshop:'Workshop board',purchasing:'Purchasing',stock:'Stock control',sales:'Sales history',compare:'Choose your setup'};

  return <div className={`${styles.app} ${theme==='night'?styles.night:''}`}>
    <aside className={`${styles.sidebar} ${menu?styles.sidebarOpen:''}`}>
      <a className={styles.brand} href="/showcase/" aria-label="Back to DOA showcase"><span className={styles.brandMark}><Bike size={24}/></span><span><strong>ALI <em>PLUSCYCLE</em></strong><small>Operations concept demo</small></span></a>
      <div className={styles.sideGroup}><small>WORKSPACE</small>{nav.filter(item=>item.min<=tier).map(item=><button key={item.id} className={`${styles.navItem} ${view===item.id?styles.active:''}`} onClick={()=>navigate(item.id)}><item.icon size={19}/><span>{item.label}</span>{item.id==='workshop'&&tier>1?<b>{state.jobs.filter(j=>!j.paid&&j.status!=='Cancelled').length}</b>:null}</button>)}</div>
      <div className={styles.sideBottom}><div className={styles.demoTag}><span className={styles.liveDot}/>Demo · Fictional data<br/>No real payments</div><button className={styles.reset} onClick={reset}><RotateCcw size={16}/> Reset demo</button><a className={styles.backLink} href="/showcase/">← DOA Showcase</a></div>
    </aside>
    <div className={styles.main}>
       <header className={styles.topbar}><button className={styles.menuButton} onClick={()=>setMenu(!menu)} aria-label="Toggle menu"><Menu size={22}/></button><div className={styles.breadcrumb}>DOA SHOWCASE <span>/</span> ALI PLUSCYCLE <span>/</span> {title[view].toUpperCase()}</div><div className={styles.topActions}><button className={styles.themeToggle} aria-label={`Switch to ${theme==='day'?'night':'day'} mode`} aria-pressed={theme==='night'} onClick={changeTheme}>{theme==='day'?<Moon size={17}/>:<Sun size={17}/>}<span>{theme==='day'?'Night':'Day'} mode</span></button><span className={styles.roleNote}>Role preview</span><select aria-label="Demo role preview" value={role} onChange={e=>setRole(e.target.value as 'Owner'|'Staff')}><option>Owner</option><option>Staff</option></select><span className={styles.avatar}>{role==='Owner'?'OW':'ST'}</span></div></header>
      <div className={styles.content}>
        <div className={styles.banner}><img src="/showcase/images/ali-pluscycle-banner.png" alt="Ali PlusCycle cycling banner with mountain bicycle"/><div className={styles.bannerShade}/><div className={styles.bannerText}><span>DOA SOLUTIONS / INTERACTIVE CONCEPT</span><h1>Built for the counter.<br/>Ready for the ride.</h1><p>Jual basikal, urus servis, pantau stok — dalam satu aliran.</p></div><div className={styles.bannerNumber}>01 / 03</div></div>
         <div className={styles.pageHead}><div><div className={styles.kicker}><span/> LIVE DEMO ENVIRONMENT</div><h2>{title[view]}</h2><p>{view==='pos'?'Search, tap, check out. The counter stays moving.':view==='compare'?'Three practical levels for a growing bicycle shop.':`${labels[tier-1]} · All figures are fictional and local to this browser.`}</p></div><div className={styles.packageControl}><label htmlFor="package-select">PACKAGE VERSION</label><div><select id="package-select" value={tier} onChange={e=>changeTier(Number(e.target.value) as Tier)}>{packages.map(item=><option key={item.tier} value={item.tier}>0{item.tier} · {formatPackagePrice(item.developmentFee)} · {item.name}</option>)}</select><ChevronDown size={17}/></div></div></div>
         <div className={styles.pricingSummary}><div><span>SELECTED PACKAGE</span><strong>{packageFor(tier).name}</strong><b>{formatPackagePrice(packageFor(tier).developmentFee)} <small>one-time development fee</small></b></div><div><span>SEPARATE MONTHLY COST</span><strong>{`Hosting & basic maintenance: ${formatPackagePrice(hostingMaintenanceMonthly)}/month.`}</strong></div><p>{pricingScopeNote}</p></div>
        {notice&&<div className={styles.notice} role="status"><Check size={17}/>{notice}<button aria-label="Dismiss message" onClick={()=>setNotice('')}><X size={16}/></button></div>}
        {view==='pos'&&<div className={styles.posGrid}><section className={styles.catalog}><div className={styles.sectionHead}><div><h3>Catalogue</h3><span>{filtered.length} items available to browse</span></div><div className={styles.search}><Search size={18}/><input aria-label="Search catalogue" placeholder="Search products or SKU..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className={styles.chips}>{categories.map(c=><button key={c} className={category===c?styles.chipActive:''} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className={styles.productGrid}>{filtered.map(p=><button className={styles.product} key={p.id} onClick={()=>addToCart(p)}><span className={`${styles.productIcon} ${styles[`cat${p.category}`]}`}>{p.category==='Bicycles'?<Bike/>:p.category==='Services'?<Wrench/>:p.category==='Parts'?<SlidersHorizontal/>:<ShoppingBag/>}</span><span className={styles.productInfo}><small>{p.category} · {p.id}</small><strong>{p.name}</strong><span>{p.category==='Services'?'Service · non-stock':`${available(state,p.id)} available`}</span></span><span className={styles.productPrice}>{money(p.price)}<Plus size={16}/></span></button>)}</div></section><aside className={styles.cart}><div className={styles.cartHead}><div><span>ACTIVE ORDER</span><h3>{activeJob?activeJob.id:'New sale'}</h3></div><span className={styles.cartCount}>{currentLines.reduce((n,l)=>n+l.qty,0)} items</span></div>{activeJob&&<div className={styles.jobCartNote}>Workshop checkout · {activeJob.customer}<button onClick={()=>setCheckoutJob(null)}>Leave</button></div>}<div className={styles.cartItems}>{currentLines.length?currentLines.map(l=><div className={styles.cartLine} key={l.id}><div><strong>{l.name}</strong><small>{money(l.price)} each · {l.stock?'Stock item':'Service'}</small></div><div className={styles.lineRight}><b>{money(l.price*l.qty)}</b>{activeJob?<span>× {l.qty}</span>:<div className={styles.qty}><button aria-label={`Decrease ${l.name}`} onClick={()=>cartQty(l.id,-1)}><Minus size={14}/></button><span>{l.qty}</span><button aria-label={`Increase ${l.name}`} onClick={()=>cartQty(l.id,1)}><Plus size={14}/></button><button aria-label={`Remove ${l.name}`} onClick={()=>setCart(cart.filter(x=>x.id!==l.id))}><Trash2 size={14}/></button></div>}</div></div>):<div className={styles.empty}><ShoppingBag size={34}/><strong>Ready for the next customer</strong><span>Tap an item to start a sale.</span></div>}</div><div className={styles.cartFoot}><div className={styles.totalRow}><span>Total due</span><strong>{money(currentTotal)}</strong></div><label>Record payment method</label><div className={styles.methods}>{['Cash','Bank transfer','QR (manual)'].map(m=><button key={m} className={method===m?styles.methodActive:''} onClick={()=>setMethod(m)}>{m}</button>)}</div><button className={styles.primary} disabled={!currentLines.length} onClick={checkout}><CreditCard size={19}/> Record sale <ArrowRight size={18}/></button><small>Simulation only. No payment is collected.</small></div></aside></div>}
        {view==='overview'&&<><div className={styles.stats}><Stat label="SALES TODAY" value={money(todaySales.reduce((n,s)=>n+s.total,0))} sub={`${todaySales.length} transactions`} icon={<Activity/>}/>{role==='Owner'&&<Stat label="THIS MONTH" value={money(monthSales.reduce((n,s)=>n+s.total,0))} sub="Owner summary preview" icon={<LayoutDashboard/>}/>}<Stat label="LOW STOCK" value={String(state.products.filter(p=>p.category!=='Services'&&p.stock<=p.threshold).length)} sub="Items need attention" icon={<Boxes/>}/>{tier>1&&<Stat label="OPEN JOBS" value={String(state.jobs.filter(j=>!j.paid&&j.status!=='Cancelled').length)} sub="Across the workshop" icon={<Wrench/>}/>}</div><div className={styles.overviewGrid}><section className={styles.panel}><div className={styles.panelTitle}><h3>Start here</h3><span>Guided walkthrough</span></div><div className={styles.steps}><button onClick={()=>navigate('pos')}><b>01</b><span><strong>Make a counter sale</strong><small>Add a part and a service, then record a demo payment.</small></span><ArrowRight/></button>{tier>1&&<button onClick={()=>navigate('workshop')}><b>02</b><span><strong>Move a repair through the workshop</strong><small>Reserve parts, mark ready and send it to checkout.</small></span><ArrowRight/></button>}{tier===3&&<button onClick={()=>navigate('purchasing')}><b>03</b><span><strong>Receive a partial delivery</strong><small>Create an order and receive only what arrived.</small></span><ArrowRight/></button>}</div></section><section className={styles.panel}><div className={styles.panelTitle}><h3>Recent activity</h3><span>Browser-local data</span></div>{state.sales.length?state.sales.slice(0,5).map(s=><div className={styles.activityRow} key={s.id}><span className={styles.activityIcon}><ShoppingBag size={17}/></span><span><strong>{s.id}</strong><small>{new Date(s.at).toLocaleString('en-MY')}</small></span><b>{money(s.total)}</b></div>):<div className={styles.simpleEmpty}>No sales recorded yet. Your first checkout will appear here.</div>}</section></div></>}
        {view==='overview'&&tier===3&&<div className={styles.summaryStrip}><div><span>PURCHASE SUMMARY</span><strong>{state.orders.length} orders</strong><small>{state.orders.reduce((sum,o)=>sum+o.lines.reduce((n,l)=>n+l.received*l.cost,0),0)?`${money(state.orders.reduce((sum,o)=>sum+o.lines.reduce((n,l)=>n+l.received*l.cost,0),0))} goods received at demo cost`:'No goods received yet'}</small></div><div><span>COMMON REPAIR PART</span><strong>{(()=>{const counts=new Map<string,number>();state.jobs.forEach(j=>j.lines.filter(l=>l.stock).forEach(l=>counts.set(l.name,(counts.get(l.name)??0)+l.qty)));return [...counts.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0]??'None yet';})()}</strong><small>Based on demo job cards</small></div><div><span>WORKSHOP SUMMARY</span><strong>{state.jobs.filter(j=>j.status==='Ready').length} ready</strong><small>{state.jobs.filter(j=>!j.paid&&j.status!=='Cancelled').length} jobs still open</small></div></div>}
        {view==='workshop'&&tier>1&&<div className={styles.twoCol}><section className={styles.panel}><div className={styles.panelTitle}><h3>Repair jobs</h3><span>{state.jobs.filter(j=>!j.paid&&j.status!=='Cancelled').length} outstanding</span></div><div className={styles.jobFilters}>{jobFlow.map(s=><div key={s}><b>{state.jobs.filter(j=>j.status===s).length}</b><span>{s}</span></div>)}</div><div className={styles.jobList}>{state.jobs.map(j=><button key={j.id} className={`${styles.jobCard} ${selectedJob===j.id?styles.jobSelected:''}`} onClick={()=>setSelectedJob(j.id)}><span><small>{j.id} · {j.customer}</small><strong>{j.bicycle}</strong><em>{j.issue}</em></span><span className={styles.status}>{j.status}</span></button>)}</div></section><section className={styles.panel}>{selected?<><div className={styles.panelTitle}><h3>{selected.id}</h3><span className={styles.status}>{selected.status}</span></div><div className={styles.jobDetails}><p><b>Customer</b>{selected.customer}</p><p><b>Bicycle</b>{selected.bicycle}</p><p><b>Reported issue</b>{selected.issue}</p><p><b>Work required</b>{selected.work}</p></div><h4>Parts & labour · {money(total(selected.lines))}</h4><div className={styles.jobLines}>{selected.lines.map(l=><div key={l.id}>{l.name} × {l.qty}<strong>{money(l.qty*l.price)}</strong>{!selected.paid&&selected.status!=='Cancelled'&&<button onClick={()=>removeJobLine(selected,l.id)} aria-label={`Remove ${l.name}`}><X size={14}/></button>}</div>)}</div>{!selected.paid&&selected.status!=='Cancelled'&&<><div className={styles.inlineForm}><select aria-label="Add part or labour to job" id="job-product"><option value="">Add a part or service...</option>{state.products.filter(p=>p.category==='Parts'||p.category==='Services').map(p=><option value={p.id} key={p.id}>{p.name} · {money(p.price)}</option>)}</select><button onClick={()=>{const el=document.getElementById('job-product') as HTMLSelectElement;const p=state.products.find(p=>p.id===el.value);if(p){addJobLine(selected,p);el.value='';}}}><Plus size={17}/> Add</button></div><div className={styles.jobActions}>{selected.status!=='Ready'&&jobFlow.indexOf(selected.status)<2&&<button onClick={()=>jobStatus(selected,jobFlow[jobFlow.indexOf(selected.status)+1])}>Move to {jobFlow[jobFlow.indexOf(selected.status)+1]} <ArrowRight size={16}/></button>}{selected.status==='Ready'&&<button className={styles.primary} onClick={()=>{setCheckoutJob(selected.id);navigate('pos');}}>Send to checkout <ArrowRight size={16}/></button>}<button className={styles.ghost} onClick={()=>jobStatus(selected,'Cancelled')}>Cancel job</button></div></>}</>:<><div className={styles.panelTitle}><h3>New repair job</h3><span>Fictional customer details</span></div><div className={styles.form}><label>Customer<select value={jobForm.customer} onChange={e=>setJobForm({...jobForm,customer:e.target.value})}>{customers.map(c=><option key={c}>{c}</option>)}</select></label><label>Bicycle<input value={jobForm.bicycle} onChange={e=>setJobForm({...jobForm,bicycle:e.target.value})} placeholder="e.g. Polygon Cascade"/></label><label>Reported issue<input value={jobForm.issue} onChange={e=>setJobForm({...jobForm,issue:e.target.value})} placeholder="What did the customer notice?"/></label><label>Work required<textarea value={jobForm.work} onChange={e=>setJobForm({...jobForm,work:e.target.value})} placeholder="Planned repair or service"/></label><button className={styles.primary} onClick={createJob}><Plus size={17}/> Create job card</button></div></>}<button className={styles.textButton} onClick={()=>setSelectedJob(null)}>+ Create another job</button></section></div>}
        {view==='purchasing'&&tier===3&&<div className={styles.twoCol}><section className={styles.panel}><div className={styles.panelTitle}><h3>Purchase orders</h3><span>{state.orders.length} created in this demo</span></div>{state.orders.length?state.orders.map(o=><div className={styles.orderCard} key={o.id}><div className={styles.orderHeader}><strong>{o.id}</strong><span>{o.supplier}</span></div>{o.lines.map(l=>{const p=state.products.find(p=>p.id===l.id);return <div className={styles.orderLine} key={l.id}><span>{p?.name}</span><span>{l.received} / {l.qty} received</span><input aria-label={`Receive ${p?.name}`} type="number" min="0" max={l.qty-l.received} value={receiptQty[`${o.id}-${l.id}`]??''} disabled={l.received===l.qty} onChange={e=>setReceiptQty({...receiptQty,[`${o.id}-${l.id}`]:Number(e.target.value)})}/></div>})}<div className={styles.orderFooter}><small>{o.lines.every(l=>l.received===l.qty)?'Complete':o.lines.some(l=>l.received>0)?'Partially received':'Awaiting delivery'}</small><button disabled={o.lines.every(l=>l.received===l.qty)} onClick={()=>receive(o.id)}><ArrowDownToLine size={16}/> Receive goods</button></div></div>):<div className={styles.simpleEmpty}>No purchase orders yet. Create one to try partial receiving.</div>}</section><section className={styles.panel}><div className={styles.panelTitle}><h3>New purchase order</h3><span>Costs shown only in owner preview</span></div><div className={styles.form}><label>Supplier<select value={orderSupplier} onChange={e=>setOrderSupplier(e.target.value)}>{suppliers.map(s=><option key={s}>{s}</option>)}</select></label><label>Add stock item<select id="po-product" defaultValue=""><option value="">Choose a product...</option>{state.products.filter(p=>p.category!=='Services').map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select></label><button className={styles.secondary} onClick={()=>{const el=document.getElementById('po-product') as HTMLSelectElement;if(el.value&&!orderLines.some(l=>l.id===el.value))setOrderLines([...orderLines,{id:el.value,qty:1}]);el.value='';}}><Plus size={16}/> Add item</button>{orderLines.map(l=><div className={styles.orderEdit} key={l.id}><span>{state.products.find(p=>p.id===l.id)?.name}</span><input aria-label="Order quantity" type="number" min="1" value={l.qty} onChange={e=>setOrderLines(orderLines.map(x=>x.id===l.id?{...x,qty:Number(e.target.value)}:x))}/>{role==='Owner'&&<small>{money((state.products.find(p=>p.id===l.id)?.cost??0)*l.qty)}</small>}<button aria-label="Remove order item" onClick={()=>setOrderLines(orderLines.filter(x=>x.id!==l.id))}><X size={15}/></button></div>)}<button className={styles.primary} onClick={createOrder}><ClipboardList size={18}/> Create purchase order</button></div><div className={styles.supplierBox}><strong>Supplier directory</strong>{suppliers.map(s=><span key={s}>{s}</span>)}</div></section></div>}
        {view==='stock'&&<section className={styles.panel}><div className={styles.panelTitle}><h3>Stock balance</h3><span>Physical / reserved / available</span></div><div className={styles.tableWrap}><table><thead><tr><th>Item</th><th>Category</th><th>Physical</th><th>Reserved</th><th>Available</th><th>Status</th><th>{tier===3?'Adjustment':'Stock in'}</th></tr></thead><tbody>{state.products.filter(p=>p.category!=='Services').map(p=><tr key={p.id}><td><strong>{p.name}</strong><small>{p.id}</small></td><td>{p.category}</td><td>{p.stock}</td><td>{tier>1?reserved(state,p.id):0}</td><td>{tier>1?available(state,p.id):p.stock}</td><td><span className={p.stock<=p.threshold?styles.low:styles.good}>{p.stock<=p.threshold?'Low stock':'In stock'}</span></td><td><button className={styles.tableButton} onClick={()=>{const raw=window.prompt(tier===3?'Quantity change (+ / −)':'Stock-in quantity','1');if(raw===null)return;const qty=Number(raw);const reason=tier===3?window.prompt('Reason for adjustment','Manual stock count'): 'Manual stock-in';if(reason!==null)adjustStock(p.id,qty,reason??'');}}>{tier===3?'Adjust':'Stock in'}</button></td></tr>)}</tbody></table></div>{tier===3&&<><div className={styles.panelTitle}><h3>Stock movements</h3><span>Demo staff and reason recorded</span></div><div className={styles.movementList}>{state.movements.length?state.movements.slice(0,12).map(m=><div key={m.id}><span>{state.products.find(p=>p.id===m.productId)?.name}<small>{m.reason} · {m.staff}</small></span><strong>{m.qty>0?'+':''}{m.qty}</strong></div>):<div className={styles.simpleEmpty}>Movements will appear after sales, receiving or adjustments.</div>}</div></>}</section>}
        {view==='sales'&&<section className={styles.panel}><div className={styles.panelTitle}><h3>Transaction history</h3><span>{state.sales.length} demo sales{role==='Owner'?` · month ${money(monthSales.reduce((n,s)=>n+s.total,0))}`:''}</span></div>{state.sales.length?state.sales.map(s=><button className={styles.saleRow} key={s.id} onClick={()=>setReceipt(s)}><span className={styles.saleIcon}><ShoppingBag size={19}/></span><span><strong>{s.id}</strong><small>{new Date(s.at).toLocaleString('en-MY')} · {s.lines.map(l=>l.name).join(', ')}</small></span><em>{s.method}</em><b>{money(s.total)}</b><ArrowRight size={17}/></button>):<div className={styles.simpleEmpty}>No transactions yet. Complete a sale to populate history and summaries.</div>}</section>}
         {view==='compare'&&<div className={styles.compareGrid}>{packages.map((item,index)=><section key={item.tier} className={`${styles.compareCard} ${tier===item.tier?styles.compareActive:''}`}><span>PACKAGE 0{item.tier}</span><h3>{item.name}</h3><div className={styles.comparePrice}><strong>{formatPackagePrice(item.developmentFee)}</strong><small>one-time development fee</small></div><p>{index===0?'A fast, clear front counter.':index===1?'Connect the counter with repair jobs.':'Bring purchasing and stock movement into view.'}</p><ul>{['Product and service sales','Manual payment record','Receipts, sales and stock',...(index>0?['Job cards and status board','Parts reservation and repair checkout']:[]),...(index>1?['Purchase orders and partial receiving','Adjustments and stock movements']:[])].map(x=><li key={x}><Check size={16}/>{x}</li>)}</ul><button onClick={()=>{changeTier(item.tier);setView('overview');}}>Explore this package <ArrowRight size={16}/></button></section>)}</div>}
        <footer className={styles.footer}><span>ALI PLUSCYCLE · DOA SOLUTIONS CONCEPT</span><span>Demo · Fictional data · No real payments</span></footer>
      </div>
    </div>
    {receipt&&<div className={styles.modalBackdrop} onClick={()=>setReceipt(null)}><div className={styles.receipt} role="dialog" aria-modal="true" aria-label="Receipt preview" onClick={e=>e.stopPropagation()}><div className={styles.receiptTop}><div><Bike size={28}/><strong>ALI PLUSCYCLE</strong><small>Fictional shop · POS demo</small></div><button onClick={()=>setReceipt(null)} aria-label="Close receipt"><X size={20}/></button></div><div className={styles.receiptBody}><p><span>Transaction</span><b>{receipt.id}</b></p><p><span>Date</span><b>{new Date(receipt.at).toLocaleString('en-MY')}</b></p><p><span>Recorded as</span><b>{receipt.method}</b></p>{receipt.jobId&&<p><span>Repair job</span><b>{receipt.jobId}</b></p>}<hr/>{receipt.lines.map(l=><p key={l.id}><span>{l.name} × {l.qty}</span><b>{money(l.price*l.qty)}</b></p>)}<hr/><p className={styles.receiptTotal}><span>Total</span><b>{money(receipt.total)}</b></p><small>Demo receipt. No real payment processed. Browser print preview only.</small></div><button className={styles.primary} onClick={()=>window.print()}><Printer size={18}/> Print preview</button></div></div>}
  </div>;
}

function Stat({label,value,sub,icon}:{label:string;value:string;sub:string;icon:React.ReactNode}){return <div className={styles.stat}><div><span>{label}</span>{icon}</div><strong>{value}</strong><small>{sub}</small></div>}
