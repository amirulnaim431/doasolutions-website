export const asset = (name: string) => `/showcase/images/lean-wellness/${name}`;

export type Offer = {
  id: string;
  name: string;
  group: 'New here' | 'Credit packs' | 'Monthly' | 'Private training';
  price: string;
  quantity: string;
  validity: string;
  sharing: string;
  restrictions: string;
  detail?: string;
  question?: string;
};

export const offers: Offer[] = [
  { id:'intro', name:'Intro to Lean', group:'New here', price:'RM150', quantity:'6 credits', validity:'1 month', sharing:'Non-shareable', restrictions:'New members only; applicable for all classes.' },
  { id:'day', name:'Lean Day Pass', group:'New here', price:'RM99', quantity:'One class of choice plus full-day Booty Gym and Cold Plunge', validity:'1 day', sharing:'Sharing not stated', restrictions:'Class choice stated as Leanformer or Mat on source.' },
  { id:'leanformer', name:'Leanformer Starter (4+1)', group:'New here', price:'RM400', quantity:'5 Leanformer classes', validity:'30 days', sharing:'Non-shareable', restrictions:'Bridge pack for Leanformer.', question:'Source also displays an inconsistent RM48/credit figure; five classes are listed at RM400.' },
  { id:'starter', name:'Starter', group:'Credit packs', price:'RM550', quantity:'10 credits', validity:'2 months', sharing:'Shareable with 1 friend', restrictions:'Mat classes use 1 credit; listed equipment classes use 2.' },
  { id:'progress', name:'Progress', group:'Credit packs', price:'RM960', quantity:'20 credits', validity:'4 months', sharing:'Shareable with 1 friend', restrictions:'Mat classes use 1 credit; listed equipment classes use 2.' },
  { id:'commitment', name:'Commitment', group:'Credit packs', price:'RM2,000', quantity:'50 credits', validity:'6 months', sharing:'Shareable with up to 3 people', restrictions:'Mat classes use 1 credit; listed equipment classes use 2.' },
  { id:'topup', name:'Top-up 1 Lean Credit', group:'Credit packs', price:'RM81', quantity:'1 credit', validity:'Not stated', sharing:'Not stated', restrictions:'Top-up terms need confirmation.' },
  { id:'flex', name:'Lean Flex 16', group:'Monthly', price:'RM691/month', quantity:'16 credits refresh monthly', validity:'3-month commitment', sharing:'Not stated', restrictions:'Source states priority booking, up to 24 freezes/year, free open gym and cold plunge access for subscriptions.', question:'Freeze wording also says “up to 6 months”; confirm exact rules.' },
  { id:'mat-unlimited', name:'Unlimited – Mat', group:'Monthly', price:'RM540/month', quantity:'Unlimited Mat classes', validity:'3-month commitment', sharing:'Not stated', restrictions:'Mat formats only. Source says freeze flexibility is included; exact terms need confirmation.' },
  { id:'all-access', name:'Unlimited – All Access', group:'Monthly', price:'RM1,850/month', quantity:'Unlimited Leanformer, Infrared, Glutes and Mat', validity:'3-month commitment', sharing:'Shareable with 1 friend', restrictions:'Source says freeze flexibility is included; exact terms need confirmation.' },
  { id:'two-weeks', name:'Unlimited – All Access (2 Weeks)', group:'Monthly', price:'RM999/month as displayed', quantity:'All-access classes', validity:'Details to confirm', sharing:'Not stated', restrictions:'Source says no minimum commitment and month-to-month.', question:'“2 Weeks” title conflicts with monthly billing and comparison wording. Billing period must be confirmed.' },
  { id:'master-single', name:'Master Trainer – Single', group:'Private training', price:'RM400', quantity:'1 private session', validity:'Not stated', sharing:'Not stated', restrictions:'Advanced one-to-one guidance with a Master Trainer.' },
  { id:'master-10', name:'Master Trainer – 10 sessions', group:'Private training', price:'RM3,700', quantity:'10 private sessions', validity:'Not stated', sharing:'Not stated', restrictions:'Master Trainer. Package terms need confirmation.' },
  { id:'master-20', name:'Master Trainer – 20 sessions', group:'Private training', price:'RM6,800', quantity:'20 private sessions', validity:'Not stated', sharing:'Not stated', restrictions:'Master Trainer. Package terms need confirmation.' },
  { id:'trainer-single', name:'Private 1:1 Session', group:'Private training', price:'RM216', quantity:'1 private session', validity:'Not stated', sharing:'Not stated', restrictions:'Trainer-led one-to-one session.', question:'Single-session price is lower per session than listed 10- and 20-session packs; confirm pricing.' },
  { id:'trainer-10', name:'Private 1:1 – 10 Sessions', group:'Private training', price:'RM2,600', quantity:'10 private sessions', validity:'Not stated', sharing:'Not stated', restrictions:'Trainer-led one-to-one sessions.', question:'Compare with RM216 single-session price before making any savings claim.' },
  { id:'trainer-20', name:'Private 1:1 – 20 Sessions', group:'Private training', price:'RM4,600', quantity:'20 private sessions', validity:'Not stated', sharing:'Not stated', restrictions:'Trainer-led one-to-one sessions.', question:'Compare with RM216 single-session price before making any savings claim.' },
];

export const classes = [
  { name:'Leanformer Pro', image:'services-FOX_9453.jpg', type:'Equipment', description:'Precision-led work on LEAN’s signature machine.' },
  { name:'Mat Strength Pilates', image:'services-FOX_9392.jpg', type:'Mat', description:'Strength and control, grounded on the mat.' },
  { name:'Glute Strength Circuit', image:'services-FOX_8771.jpg', type:'Equipment', description:'A focused circuit in the studio.' },
  { name:'Barre Pilates', image:'services-FOX_0263.jpg', type:'Mat', description:'A considered blend of barre and Pilates.' },
  { name:'Ice Plunge', image:'services-FOX_9429.jpg', type:'Recovery', description:'A recovery practice alongside training.' },
];

export const team = [
  { name:'Allisha', role:'Founder and Master Trainer', disciplines:'Leanformer · Mat Pilates Strength · Barre Pilates', image:'team-allisha.jpg' },
  { name:'Ivy', role:'Senior Instructor', disciplines:'Leanformer · Mat Pilates Strength', image:'team-ivy.jpg' },
  { name:'Sam', role:'Instructor', disciplines:'Leanformer · Mat Pilates Strength', image:'team-sam.jpg' },
  { name:'Liesl', role:'Instructor', disciplines:'Leanformer · Mat Pilates Strength', image:'team-liesl.jpg' },
  { name:'Vangene', role:'Instructor', disciplines:'Barre Pilates', image:'team-vangene.jpg' },
  { name:'Nadia', role:'Instructor', disciplines:'Mat Pilates Strength', image:'team-nadia.jpg' },
  { name:'Diane', role:'Instructor', disciplines:'Leanformer', image:'team-diane.jpg' },
  { name:'Khadijah', role:'Chief Operating Officer', disciplines:'Studio operations', image:'team-khadijah.jpg' },
  { name:'Sara', role:'Chief Marketing Officer', disciplines:'Brand and community', image:'team-sara.jpg' },
  { name:'Denise', role:'Studio Manager', disciplines:'Studio experience', image:'team-denise.jpg' },
];

export const demoSessions = [
  { id:1, day:'Monday', time:'07:30', title:'Mat Strength Pilates', coach:'Ivy', type:'Mat', note:'Fictional demonstration session' },
  { id:2, day:'Monday', time:'12:15', title:'Leanformer Pro', coach:'Allisha', type:'Equipment', note:'Fictional demonstration session' },
  { id:3, day:'Tuesday', time:'08:00', title:'Barre Pilates', coach:'Vangene', type:'Mat', note:'Fictional demonstration session' },
  { id:4, day:'Tuesday', time:'18:30', title:'Glute Strength Circuit', coach:'Sam', type:'Equipment', note:'Fictional demonstration session' },
  { id:5, day:'Wednesday', time:'07:15', title:'Leanformer Pro', coach:'Diane', type:'Equipment', note:'Fictional demonstration session' },
  { id:6, day:'Wednesday', time:'17:45', title:'Mat Strength Pilates', coach:'Nadia', type:'Mat', note:'Fictional demonstration session' },
];
