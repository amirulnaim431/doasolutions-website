export type Tier = 1 | 2 | 3;
export type Product = { id: string; name: string; category: 'Bicycles' | 'Parts' | 'Accessories' | 'Services'; price: number; cost: number; stock: number; threshold: number };
export type Line = { id: string; name: string; qty: number; price: number; stock: boolean };
export type Sale = { id: string; at: string; lines: Line[]; total: number; method: string; jobId?: string };
export type Job = { id: string; customer: string; bicycle: string; issue: string; work: string; status: 'Received' | 'In Progress' | 'Ready' | 'Collected' | 'Cancelled'; lines: Line[]; paid: boolean };
export type Order = { id: string; supplier: string; lines: { id: string; qty: number; received: number; cost: number }[]; receipts: string[] };
export type Movement = { id: string; at: string; productId: string; qty: number; reason: string; staff: string };
export type DemoState = { products: Product[]; sales: Sale[]; jobs: Job[]; orders: Order[]; movements: Movement[]; next: number };

export const customers = ['Aina Rahman', 'Daniel Lee', 'Farid Ismail', 'Mei Tan', 'Hafiz Omar', 'Siti Nabila', 'Jason Lim', 'Priya Nair'];
export const suppliers = ['Velocity Cycle Supply', 'Kuala Parts Trading', 'Blue Ridge Distribution'];
export const money = (cents: number) => `RM ${(cents / 100).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const total = (lines: Line[]) => lines.reduce((sum, line) => sum + line.price * line.qty, 0);
export const stamp = () => new Date().toISOString();
export const demoId = (prefix: string, n: number) => `${prefix}-${String(n).padStart(4, '0')}`;

const seedProducts: Product[] = [
  ['B01','Trail 27.5 MTB','Bicycles',189900,128000,5,2],['B02','City Commuter 700C','Bicycles',149900,95000,4,2],['B03','Junior 20-inch','Bicycles',69900,42000,6,2],['B04','Gravel Explorer','Bicycles',279900,190000,2,1],
  ['P01','Inner Tube 27.5','Parts',2800,1200,18,5],['P02','Brake Pad Set','Parts',4500,2200,12,4],['P03','KMC Chain 9-Speed','Parts',7800,4300,8,3],['P04','Gear Cable','Parts',1800,700,14,4],['P05','Tyre 700x35C','Parts',9500,5400,5,2],['P06','Disc Rotor 160mm','Parts',8900,4800,3,2],['P07','Pedal Pair','Parts',6900,3500,7,2],['P08','Chain Lube','Parts',3200,1500,10,3],
  ['A01','LED Light Set','Accessories',7900,3900,9,3],['A02','Bottle Cage','Accessories',2900,1200,12,4],['A03','Helmet Urban','Accessories',13900,7500,4,2],['A04','Mini Pump','Accessories',6500,3100,6,2],['A05','Bike Lock','Accessories',9900,4900,5,2],['A06','Cycling Gloves','Accessories',5900,2700,8,2],
  ['S01','Puncture Repair Labour','Services',2500,0,0,0],['S02','Brake Service Labour','Services',4500,0,0,0],['S03','Chain Replacement Labour','Services',3500,0,0,0],['S04','Full Bicycle Tune-Up','Services',12000,0,0,0],
].map(([id,name,category,price,cost,stock,threshold]) => ({ id: String(id), name: String(name), category: category as Product['category'], price: Number(price), cost: Number(cost), stock: Number(stock), threshold: Number(threshold) }));

export function initialState(tier: Tier = 1): DemoState {
  const job = (id: string, customer: string, bicycle: string, issue: string, work: string, status: Job['status'], lines: Line[], paid = false): Job => ({ id, customer, bicycle, issue, work, status, lines, paid });
  return {
    products: seedProducts.map(p => ({ ...p })), sales: [], orders: [], movements: [], next: 1001,
    jobs: tier === 1 ? [] : [
      job('JOB-001','Aina Rahman','Polygon Cascade','Rear tyre flat','Replace inner tube','Received',[{ id:'P01', name:'Inner Tube 27.5', qty:1, price:2800, stock:true },{ id:'S01', name:'Puncture Repair Labour', qty:1, price:2500, stock:false }]),
      job('JOB-002','Daniel Lee','Trek FX','Brakes squeal','Clean and tune brakes','In Progress',[{ id:'P02', name:'Brake Pad Set', qty:1, price:4500, stock:true },{ id:'S02', name:'Brake Service Labour', qty:1, price:4500, stock:false }]),
      job('JOB-003','Farid Ismail','Giant Talon','Chain skips','Replace chain and adjust','Ready',[{ id:'P03', name:'KMC Chain 9-Speed', qty:1, price:7800, stock:true },{ id:'S03', name:'Chain Replacement Labour', qty:1, price:3500, stock:false }]),
      job('JOB-004','Mei Tan','Merida Crossway','General service','Full tune-up','Received',[{ id:'S04', name:'Full Bicycle Tune-Up', qty:1, price:12000, stock:false }]),
      job('JOB-005','Hafiz Omar','Polygon Path','Gear shifting slow','Replace cable','In Progress',[{ id:'P04', name:'Gear Cable', qty:1, price:1800, stock:true },{ id:'S04', name:'Full Bicycle Tune-Up', qty:1, price:12000, stock:false }]),
      job('JOB-006','Siti Nabila','Liv Tempt','Brake feels soft','Brake service','Ready',[{ id:'S02', name:'Brake Service Labour', qty:1, price:4500, stock:false }]),
    ],
  };
}

export function reserved(state: DemoState, id: string, exceptJob?: string) {
  return state.jobs.filter(j => j.id !== exceptJob && !j.paid && j.status !== 'Cancelled' && j.status !== 'Collected').reduce((sum,j) => sum + j.lines.filter(l => l.id === id && l.stock).reduce((n,l) => n + l.qty,0),0);
}
export function available(state: DemoState, id: string, exceptJob?: string) {
  return (state.products.find(p => p.id === id)?.stock ?? 0) - reserved(state,id,exceptJob);
}
