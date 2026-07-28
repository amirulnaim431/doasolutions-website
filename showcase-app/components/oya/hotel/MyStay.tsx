'use client';

import { useMemo, useState } from 'react';
import {
  Ban,
  BedDouble,
  Bell,
  CalendarClock,
  CarTaxiFront,
  Check,
  ClipboardList,
  Copy,
  Droplets,
  Home,
  LifeBuoy,
  MessageCircle,
  MoreHorizontal,
  QrCode,
  ReceiptText,
  Send,
  Settings,
  ShowerHead,
  Sparkles,
  Star,
  Wrench,
  Wifi,
} from 'lucide-react';

export type GuestRequestStatus = 'Pending' | 'Accepted' | 'In Progress' | 'Completed';
export type GuestRequestPriority = 'Normal' | 'High' | 'Urgent';

export interface GuestRequest {
  id: string;
  room: string;
  guestName: string;
  task: string;
  category: 'Housekeeping' | 'Maintenance' | 'Reception' | 'Shuttle' | 'Booking';
  detail: string;
  priority: GuestRequestPriority;
  requestedTime: string;
  assignedStaff: string;
  status: GuestRequestStatus;
  notification?: string;
}

interface MyStayProps {
  requests: GuestRequest[];
  dndEnabled: boolean;
  onCreateRequest: (request: Omit<GuestRequest, 'id' | 'requestedTime' | 'status' | 'notification'>) => void;
  onToggleDnd: (enabled: boolean) => void;
}

interface HousekeepingQueueProps {
  requests: GuestRequest[];
  onStatusChange: (id: string, status: GuestRequestStatus) => void;
}

const toiletries = ['Soap', 'Shampoo', 'Toothbrush', 'Comb'];
const issueCategories = ['Air Conditioning', 'Water Heater', 'Television', 'Internet', 'Lighting', 'Other'];

export function MyStay({ requests, dndEnabled, onCreateRequest, onToggleDnd }: MyStayProps) {
  const [activePanel, setActivePanel] = useState('home');
  const [toast, setToast] = useState('');
  const [wifiQr, setWifiQr] = useState(false);
  const [towels, setTowels] = useState(2);
  const [water, setWater] = useState(2);
  const [selectedToiletries, setSelectedToiletries] = useState<string[]>(['Toothbrush']);
  const [issue, setIssue] = useState('Air Conditioning');
  const [issueNotes, setIssueNotes] = useState('');
  const [chat, setChat] = useState([
    { from: 'guest', text: 'Hi, may I ask for nearest food options?' },
    { from: 'reception', text: 'Good morning John. We can share nearby options at the front desk. Would you prefer local food or cafe?' },
  ]);
  const [chatDraft, setChatDraft] = useState('');
  const [shuttleDone, setShuttleDone] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const latestNotification = requests.find((item) => item.room === '108' && item.notification)?.notification;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2600);
  }

  function create(task: string, category: GuestRequest['category'], detail: string, priority: GuestRequestPriority = 'Normal') {
    onCreateRequest({ room: '108', guestName: 'John Tan', task, category, detail, priority, assignedStaff: category === 'Maintenance' ? 'Maintenance Team' : 'Aisyah' });
    notify(`${task} requested successfully.`);
  }

  function requestCleaning() {
    create('Clean My Room', 'Housekeeping', 'Estimated housekeeping visit: 2:00 PM - 4:00 PM', 'High');
    setActivePanel('cleaning');
  }

  function sendChat() {
    if (!chatDraft.trim()) return;
    setChat((items) => [...items, { from: 'guest', text: chatDraft.trim() }, { from: 'reception', text: 'Thanks John. Reception has received this demo message and will respond shortly.' }]);
    setChatDraft('');
  }

  return (
    <div className="mystay-stage">
      <div className="mystay-context">
        <span className="mystay-live-badge">My Stay</span>
        <h2>No login. Just scan and use.</h2>
        <p>Guests access My Stay by scanning the unique QR code inside their room, or through a secure WhatsApp/SMS link sent after check-in. The link identifies the active booking without registration or password entry.</p>
        <div className="mystay-proof">
          <span><QrCode /> Room QR identifies booking</span>
          <span><MessageCircle /> Secure WhatsApp/SMS link</span>
          <span><Bell /> Requests appear in operations</span>
        </div>
      </div>

      <section className="mystay-phone" aria-label="My Stay mobile guest app">
        <div className="mystay-phone-top"><b>OYA</b><span>Room 108</span></div>
        <header className="mystay-hero">
          <span>Welcome Back,</span>
          <h1>John Tan</h1>
          <div><b>Room 108</b><small>Check-out<br />29 Jul 2026, 12:00 PM</small></div>
        </header>
        <div className="mystay-greeting"><b>Good Morning 👋</b><span>How can we help you today?</span></div>
        {latestNotification ? <div className="mystay-notification"><Check />{latestNotification}</div> : null}

        {activePanel === 'home' && (
          <div className="mystay-actions">
            <Action icon={Wifi} title="Connect to WiFi" onClick={() => setActivePanel('wifi')} />
            <Action icon={BedDouble} title="Clean My Room" onClick={requestCleaning} />
            <Action icon={Ban} title="Do Not Disturb" active={dndEnabled} onClick={() => { onToggleDnd(!dndEnabled); notify(!dndEnabled ? 'Do Not Disturb enabled.' : 'Do Not Disturb disabled.'); }} />
            <Action icon={ShowerHead} title="Fresh Towels" onClick={() => setActivePanel('towels')} />
            <Action icon={Droplets} title="Drinking Water" onClick={() => setActivePanel('water')} />
            <Action icon={Sparkles} title="Prayer Mat" onClick={() => create('Request Prayer Mat', 'Housekeeping', 'Prayer mat requested for Room 108')} />
            <Action icon={ClipboardList} title="Toiletries" onClick={() => setActivePanel('toiletries')} />
            <Action icon={Wrench} title="Report an Issue" onClick={() => setActivePanel('issue')} />
            <Action icon={MessageCircle} title="Chat Reception" onClick={() => setActivePanel('chat')} />
            <Action icon={CarTaxiFront} title="Airport Shuttle" onClick={() => setActivePanel('shuttle')} />
            <Action icon={CalendarClock} title="Late Check-out" onClick={() => setActivePanel('late')} />
            <Action icon={ReceiptText} title="Booking Summary" onClick={() => setActivePanel('summary')} />
            <Action icon={Star} title="Leave Feedback" onClick={() => setActivePanel('feedback')} />
          </div>
        )}

        {activePanel === 'wifi' && <Panel title="Connect to WiFi" back={() => setActivePanel('home')}><Info label="SSID" value="OYA_GUEST" /><Info label="Password" value="••••••••" /><div className="mystay-panel-actions"><button onClick={() => notify('WiFi password copied.') }><Copy />Copy Password</button><button onClick={() => setWifiQr(!wifiQr)}><QrCode />Show QR Code</button></div>{wifiQr ? <div className="mystay-qr">OYA<br />WIFI QR</div> : null}</Panel>}
        {activePanel === 'cleaning' && <Panel title="Cleaning requested successfully." back={() => setActivePanel('home')}><div className="mystay-success"><Check /><b>Estimated housekeeping visit:</b><span>2:00 PM - 4:00 PM</span><small>This request is now visible in Front Desk and Housekeeping Queue.</small></div></Panel>}
        {activePanel === 'towels' && <Panel title="Request Fresh Towels" back={() => setActivePanel('home')}><Segment values={[1, 2, 3]} value={towels} setValue={setTowels} /><button className="mystay-submit" onClick={() => create('Need Towels', 'Housekeeping', `${towels} fresh towel(s) requested`)}>Submit</button></Panel>}
        {activePanel === 'water' && <Panel title="Request Drinking Water" back={() => setActivePanel('home')}><Stepper value={water} setValue={setWater} /><button className="mystay-submit" onClick={() => create('Request Drinking Water', 'Housekeeping', `${water} bottle(s) requested`)}>Submit</button></Panel>}
        {activePanel === 'toiletries' && <Panel title="Request Toiletries" back={() => setActivePanel('home')}><div className="mystay-options">{toiletries.map((item) => <button key={item} className={selectedToiletries.includes(item) ? 'is-selected' : ''} onClick={() => setSelectedToiletries((items) => items.includes(item) ? items.filter((value) => value !== item) : [...items, item])}>{item}</button>)}</div><button className="mystay-submit" onClick={() => create('Request Toiletries', 'Housekeeping', selectedToiletries.join(', ') || 'Toiletries requested')}>Submit</button></Panel>}
        {activePanel === 'issue' && <Panel title="Report an Issue" back={() => setActivePanel('home')}><select value={issue} onChange={(event) => setIssue(event.target.value)}>{issueCategories.map((item) => <option key={item}>{item}</option>)}</select><textarea value={issueNotes} onChange={(event) => setIssueNotes(event.target.value)} placeholder="Add a short note for the team" /><button className="mystay-submit" onClick={() => create('Maintenance Request', 'Maintenance', `${issue}${issueNotes ? ` - ${issueNotes}` : ''}`, 'Urgent')}>Submit Issue</button></Panel>}
        {activePanel === 'chat' && <Panel title="Chat Reception" back={() => setActivePanel('home')}><div className="mystay-chat">{chat.map((item, index) => <p key={index} className={item.from === 'guest' ? 'is-guest' : ''}>{item.text}</p>)}</div><div className="mystay-chatbox"><input value={chatDraft} onChange={(event) => setChatDraft(event.target.value)} placeholder="Type a message" /><button onClick={sendChat}><Send /></button></div><small>Concept preview conversation using demo responses.</small></Panel>}
        {activePanel === 'shuttle' && <Panel title="Airport Shuttle" back={() => setActivePanel('home')}><ShuttleForm done={shuttleDone} submit={() => { setShuttleDone(true); create('Airport Shuttle Request', 'Shuttle', 'Drop-off to KLIA2, flight AK720, 2 passengers, 2 luggage', 'High'); }} /></Panel>}
        {activePanel === 'late' && <Panel title="Late Check-out Request" back={() => setActivePanel('home')}><div className="mystay-options">{['1 Hour', '2 Hours', '3 Hours'].map((item) => <button key={item} onClick={() => create('Late Check-out Request', 'Booking', `${item} late checkout requested. Reception approval required.`, 'Normal')}>{item}</button>)}</div><small>Reception approval required.</small></Panel>}
        {activePanel === 'summary' && <Panel title="Booking Summary" back={() => setActivePanel('home')}><Info label="Room" value="108 - Deluxe King" /><Info label="Stay Dates" value="28 Jul 2026 to 29 Jul 2026" /><Info label="Payment Status" value="Partially Paid" /><Info label="Outstanding Balance" value="RM 80" /><Info label="Booking Reference" value="OYA-240728-108" /></Panel>}
        {activePanel === 'feedback' && <Panel title="Leave Feedback" back={() => setActivePanel('home')}><div className="mystay-stars">★★★★★</div><textarea placeholder="Tell us how your stay is going" /><button className="mystay-submit" onClick={() => { setFeedbackSent(true); notify('Thank you for your feedback.'); }}>Submit Feedback</button>{feedbackSent ? <b className="mystay-thanks">Thank you for your feedback.</b> : null}</Panel>}

        <nav className="mystay-bottom-nav">
          {[[Home, 'Home'], [ReceiptText, 'My Booking'], [ClipboardList, 'Requests'], [LifeBuoy, 'Support'], [MoreHorizontal, 'More']].map(([Icon, label]) => <button key={label as string} onClick={() => setActivePanel(label === 'Home' ? 'home' : label === 'My Booking' ? 'summary' : label === 'Requests' ? 'requests' : label === 'Support' ? 'chat' : 'wifi')}><Icon />{label as string}</button>)}
        </nav>
        {activePanel === 'requests' ? <div className="mystay-sheet"><button onClick={() => setActivePanel('home')}>Close</button><h3>My Requests</h3>{requests.filter((item) => item.room === '108').map((item) => <article key={item.id}><b>{item.task}</b><span>{item.status}</span><small>{item.detail}</small></article>)}</div> : null}
      </section>
      {toast ? <div className="mystay-toast" role="status">{toast}</div> : null}
    </div>
  );
}

function Action({ icon: Icon, title, onClick, active = false }: { icon: typeof Wifi; title: string; onClick: () => void; active?: boolean }) {
  return <button type="button" className={`mystay-action ${active ? 'is-active' : ''}`} onClick={onClick}><Icon /><span>{title}</span></button>;
}

function Panel({ title, children, back }: { title: string; children: React.ReactNode; back: () => void }) {
  return <div className="mystay-panel"><button type="button" onClick={back}>Back</button><h2>{title}</h2>{children}</div>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="mystay-info"><span>{label}</span><b>{value}</b></div>;
}

function Segment({ values, value, setValue }: { values: number[]; value: number; setValue: (value: number) => void }) {
  return <div className="mystay-segment">{values.map((item) => <button key={item} className={item === value ? 'is-selected' : ''} onClick={() => setValue(item)}>{item}</button>)}</div>;
}

function Stepper({ value, setValue }: { value: number; setValue: (value: number) => void }) {
  return <div className="mystay-stepper"><button onClick={() => setValue(Math.max(1, value - 1))}>-</button><b>{value}</b><button onClick={() => setValue(value + 1)}>+</button></div>;
}

function ShuttleForm({ done, submit }: { done: boolean; submit: () => void }) {
  if (done) return <div className="mystay-success"><CarTaxiFront /><b>Shuttle request received.</b><span>Drop-off to KLIA2 is scheduled for demo review.</span></div>;
  return (
    <div className="mystay-shuttle-form">
      <select><option>Airport Drop-off</option><option>Airport Pickup</option></select>
      <select><option>KLIA2</option><option>KLIA</option></select>
      <input placeholder="Flight Number" defaultValue="AK720" />
      <input type="time" defaultValue="08:30" />
      <input type="number" min={1} defaultValue={2} aria-label="Passenger Count" />
      <input type="number" min={0} defaultValue={2} aria-label="Luggage Count" />
      <input placeholder="Pickup Location" defaultValue="OYA Inn lobby" />
      <button className="mystay-submit" onClick={submit}>Submit Shuttle Request</button>
    </div>
  );
}

export function HousekeepingQueue({ requests, onStatusChange }: HousekeepingQueueProps) {
  const queue = useMemo(() => requests.filter((item) => ['Housekeeping', 'Maintenance'].includes(item.category)), [requests]);
  return (
    <div className="hmvp-workspace">
      <section className="hmvp-panel">
        <h2>Housekeeping Queue</h2>
        <p className="hmvp-muted-line">Guest requests from My Stay appear here as working tasks for hotel staff.</p>
        <div className="hkq-list">
          {queue.map((item) => (
            <article key={item.id} className={`hkq-card is-${item.priority.toLowerCase()}`}>
              <div><b>Room {item.room}</b><span>{item.task}</span></div>
              <dl>
                <div><dt>Priority</dt><dd>{item.priority}</dd></div>
                <div><dt>Requested</dt><dd>{item.requestedTime}</dd></div>
                <div><dt>Assigned Staff</dt><dd>{item.assignedStaff}</dd></div>
                <div><dt>Detail</dt><dd>{item.detail}</dd></div>
              </dl>
              <label>Status<select value={item.status} onChange={(event) => onStatusChange(item.id, event.target.value as GuestRequestStatus)}>{['Pending', 'Accepted', 'In Progress', 'Completed'].map((status) => <option key={status}>{status}</option>)}</select></label>
              {item.notification ? <p><Bell />{item.notification}</p> : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
