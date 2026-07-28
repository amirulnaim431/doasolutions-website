'use client';

import { type Dispatch, type SetStateAction, useMemo, useState } from 'react';
import {
  BadgeCheck,
  BedDouble,
  Bell,
  Building2,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  DoorOpen,
  FileBarChart,
  History,
  Home,
  Hotel,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  MessageCircle,
  Phone,
  Search,
  Settings,
  Sparkles,
  UserRound,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import {
  guestsSeed,
  reservationsSeed,
  roomsSeed,
  roomTypeOptions,
  sourceOptions,
  type BookingSource,
  type BookingStatus,
  type GuestProfile,
  type HotelRoom,
  type PaymentStatus,
  type Reservation,
  type RoomStatus,
  type RoomTypeName,
} from './data';
import { FutureRoadmapVisual as FutureRoadmap } from './FutureRoadmapVisual';
import { HousekeepingQueue, MyStay, type GuestRequest, type GuestRequestStatus } from './MyStay';

type View = 'entry' | 'guest' | 'my-stay' | 'frontdesk' | 'rooms' | 'reservations' | 'guests' | 'housekeeping' | 'room-admin' | 'reports' | 'future';
type BoardMode = 'board' | 'calendar';
type FlowMode = 'walkin' | 'reservation' | 'checkin' | 'checkout' | null;

const today = '2026-07-28';
const otaSources: BookingSource[] = ['OYO', 'Agoda', 'Booking.com'];

function money(value: number) {
  return `RM ${value.toLocaleString('en-MY')}`;
}

function daysBetween(start: string, end: string) {
  return Math.max(1, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86400000));
}

function tone(value: string) {
  if (['Available', 'Ready', 'Paid', 'Checked Out', 'Completed', 'Confirmed'].includes(value)) return 'good';
  if (['Reserved', 'Partially Paid', 'Pending', 'Cleaning In Progress', 'Enquiry', 'Do Not Disturb', 'Accepted', 'In Progress'].includes(value)) return 'warn';
  if (['Occupied', 'Checked In'].includes(value)) return 'active';
  if (['Maintenance', 'Out of Service', 'Cleaning Required', 'Unpaid', 'Cancelled', 'No Show'].includes(value)) return 'bad';
  return 'neutral';
}

function Badge({ children, value }: { children: React.ReactNode; value: string }) {
  return <span className={`hmvp-badge is-${tone(value)}`}>{children}</span>;
}

function Metric({ label, value, icon: Icon, alert = false }: { label: string; value: string | number; icon: typeof Hotel; alert?: boolean }) {
  return (
    <article className={`hmvp-metric ${alert ? 'is-alert' : ''}`}>
      <span><Icon /></span>
      <div><small>{label}</small><b>{value}</b></div>
    </article>
  );
}

const blankGuest = {
  fullName: '',
  mobile: '',
  email: '',
  nationality: 'Malaysia',
  idRef: '',
  guestCount: '1',
  vehicle: '',
  notes: '',
};

const guestRequestsSeed: GuestRequest[] = [
  { id: 'gr01', room: '108', guestName: 'John Tan', task: 'Clean My Room', category: 'Housekeeping', detail: 'Estimated housekeeping visit: 2:00 PM - 4:00 PM', priority: 'High', requestedTime: '10:42 AM', assignedStaff: 'Aisyah', status: 'Pending' },
  { id: 'gr02', room: '105', guestName: 'Nurul Izzati', task: 'Need Towels', category: 'Housekeeping', detail: '2 fresh towels requested', priority: 'Normal', requestedTime: '11:18 AM', assignedStaff: 'Farah', status: 'Accepted' },
  { id: 'gr03', room: '110', guestName: 'Sarah Lee', task: 'Do Not Disturb Enabled', category: 'Reception', detail: 'Room status changed from My Stay', priority: 'Normal', requestedTime: '11:25 AM', assignedStaff: 'Front Desk', status: 'Pending' },
  { id: 'gr04', room: '109', guestName: 'Demo Guest', task: 'Maintenance Request', category: 'Maintenance', detail: 'Air Conditioning', priority: 'Urgent', requestedTime: '11:34 AM', assignedStaff: 'Maintenance Team', status: 'Pending' },
];

export function OyaHotelMvp() {
  const [view, setView] = useState<View>('entry');
  const [rooms, setRooms] = useState<HotelRoom[]>(roomsSeed);
  const [reservations, setReservations] = useState<Reservation[]>(reservationsSeed);
  const [guests, setGuests] = useState<GuestProfile[]>(guestsSeed);
  const [roomFilter, setRoomFilter] = useState<'All' | 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance'>('All');
  const [boardMode, setBoardMode] = useState<BoardMode>('board');
  const [selectedBooking, setSelectedBooking] = useState<Reservation | null>(null);
  const [selectedGuest, setSelectedGuest] = useState<GuestProfile | null>(null);
  const [flow, setFlow] = useState<FlowMode>(null);
  const [notice, setNotice] = useState('Interactive demonstration using fictional sample data.');
  const [guestRequests, setGuestRequests] = useState<GuestRequest[]>(guestRequestsSeed);
  const [myStayDnd, setMyStayDnd] = useState(false);

  const todayArrivals = reservations.filter((item) => item.checkIn === today && ['Confirmed', 'Pending'].includes(item.status));
  const todayDepartures = reservations.filter((item) => item.checkOut === today && item.status === 'Checked In');
  const unassigned = reservations.filter((item) => !item.room && !['Cancelled', 'Checked Out'].includes(item.status));
  const outstanding = reservations.filter((item) => item.outstanding > 0 && !['Cancelled', 'Checked Out'].includes(item.status));
  const counts = {
    occupied: rooms.filter((room) => room.status === 'Occupied').length,
    available: rooms.filter((room) => ['Available', 'Ready'].includes(room.status)).length,
    reserved: rooms.filter((room) => room.status === 'Reserved').length,
    cleaning: rooms.filter((room) => room.status.includes('Cleaning')).length,
    maintenance: rooms.filter((room) => ['Maintenance', 'Out of Service'].includes(room.status)).length,
  };

  function addBooking(source: BookingSource, checkInNow: boolean, payload?: Partial<Reservation>) {
    const roomType = payload?.roomType ?? 'Standard Queen';
    const room = payload?.room ?? rooms.find((item) => ['Available', 'Ready'].includes(item.status) && item.type === roomType)?.number;
    const guestId = `g${String(guests.length + 1).padStart(2, '0')}`;
    const guestName = payload?.guestName ?? 'Demo Walk-In Guest';
    const checkIn = payload?.checkIn ?? today;
    const checkOut = payload?.checkOut ?? '2026-07-29';
    const nights = daysBetween(checkIn, checkOut);
    const roomCharge = payload?.roomCharge ?? (rooms.find((item) => item.type === roomType)?.baseRate ?? 168) * nights;
    const amountPaid = payload?.amountPaid ?? (checkInNow ? roomCharge : 0);
    const booking: Reservation = {
      id: `r${String(reservations.length + 1).padStart(2, '0')}`,
      reference: `OYA-DEMO-${24000 + reservations.length + 1}`,
      guestId,
      guestName,
      room,
      roomType,
      checkIn,
      checkOut,
      nights,
      adults: payload?.adults ?? 1,
      children: payload?.children ?? 0,
      source,
      otaReference: payload?.otaReference,
      platformRate: payload?.platformRate,
      payableToHotel: payload?.payableToHotel,
      collectionMethod: payload?.collectionMethod,
      status: checkInNow ? 'Checked In' : 'Confirmed',
      paymentStatus: amountPaid >= roomCharge ? 'Paid' : amountPaid > 0 ? 'Partially Paid' : 'Unpaid',
      roomCharge,
      deposit: payload?.deposit ?? 0,
      discount: payload?.discount ?? 0,
      extraCharge: payload?.extraCharge ?? 0,
      total: roomCharge,
      amountPaid,
      outstanding: Math.max(0, roomCharge - amountPaid),
      paymentMethod: payload?.paymentMethod ?? 'Cash',
      arrivalTime: payload?.arrivalTime ?? 'Now',
      notes: payload?.notes ?? 'Created in interactive MVP demo.',
      activity: ['Booking created', room ? 'Room assigned' : 'Awaiting room assignment', amountPaid ? 'Payment recorded' : 'Payment pending', checkInNow ? 'Guest checked in' : 'Reservation confirmed'].filter(Boolean),
    };
    setReservations((items) => [booking, ...items]);
    setGuests((items) => [{
      id: guestId,
      name: guestName,
      phone: payload?.notes?.includes('website') ? '+60 demo website' : '+60 demo guest',
      email: 'guest.demo@example.com',
      nationality: 'Malaysia',
      maskedId: '****-**-DEMO',
      totalStays: checkInNow ? 1 : 0,
      lastStay: checkInNow ? today : '-',
      upcomingBooking: booking.reference,
      totalValue: roomCharge,
      outstanding: booking.outstanding,
      status: 'First Stay',
      preferences: [],
      notes: 'Created from MVP demo flow.',
      incidents: [],
      sourcesUsed: [source],
    }, ...items]);
    if (room) {
      setRooms((items) => items.map((item) => item.number === room ? { ...item, status: checkInNow ? 'Occupied' : 'Reserved', cleaningStatus: 'Ready' } : item));
    }
    setSelectedBooking(booking);
    setNotice(`${booking.reference} created from ${source}${checkInNow ? ' and checked in.' : '.'}`);
  }

  function updateReservation(id: string, patch: Partial<Reservation>) {
    setReservations((items) => items.map((item) => item.id === id ? { ...item, ...patch, activity: [...item.activity, patch.status ? `Status changed to ${patch.status}` : 'Record updated'] } : item));
  }

  function checkIn(item: Reservation) {
    if (!item.room) {
      setNotice('Assign a room before check-in.');
      return;
    }
    const room = rooms.find((candidate) => candidate.number === item.room);
    if (room && ['Cleaning Required', 'Cleaning In Progress', 'Maintenance', 'Out of Service'].includes(room.status)) {
      setNotice(`Warning: Room ${room.number} is not ready. Resolve room status before check-in.`);
      return;
    }
    updateReservation(item.id, { status: 'Checked In' });
    setRooms((items) => items.map((roomItem) => roomItem.number === item.room ? { ...roomItem, status: 'Occupied' } : roomItem));
    setNotice(`${item.guestName} checked in to room ${item.room}.`);
  }

  function checkOut(item: Reservation, extra = 0, paid = item.outstanding + extra) {
    const total = item.total + extra;
    const amountPaid = item.amountPaid + paid;
    updateReservation(item.id, {
      status: 'Checked Out',
      extraCharge: item.extraCharge + extra,
      total,
      amountPaid,
      outstanding: Math.max(0, total - amountPaid),
      paymentStatus: amountPaid >= total ? 'Paid' : 'Partially Paid',
    });
    if (item.room) setRooms((items) => items.map((room) => room.number === item.room ? { ...room, status: 'Cleaning Required', cleaningStatus: 'Needs Cleaning' } : room));
    setNotice(`${item.guestName} checked out. Room ${item.room ?? '-'} marked Cleaning Required.`);
  }

  function addGuestRequest(request: Omit<GuestRequest, 'id' | 'requestedTime' | 'status' | 'notification'>) {
    const created: GuestRequest = {
      ...request,
      id: `gr${String(guestRequests.length + 1).padStart(2, '0')}`,
      requestedTime: new Date().toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' }),
      status: 'Pending',
    };
    setGuestRequests((items) => [created, ...items]);
    setNotice(`My Stay request received from room ${created.room}: ${created.task}.`);
  }

  function toggleMyStayDnd(enabled: boolean) {
    setMyStayDnd(enabled);
    setRooms((items) => items.map((room) => room.number === '108' ? { ...room, status: enabled ? 'Do Not Disturb' : 'Occupied' } : room));
    addGuestRequest({
      room: '108',
      guestName: 'John Tan',
      task: enabled ? 'Do Not Disturb Enabled' : 'Do Not Disturb Disabled',
      category: 'Reception',
      detail: enabled ? 'Guest enabled Do Not Disturb from My Stay.' : 'Guest disabled Do Not Disturb from My Stay.',
      priority: 'Normal',
      assignedStaff: 'Front Desk',
    });
  }

  function updateGuestRequestStatus(id: string, status: GuestRequestStatus) {
    setGuestRequests((items) => items.map((item) => item.id === id ? {
      ...item,
      status,
      notification: status === 'Completed' && item.task === 'Clean My Room' ? 'Your room has been cleaned. Thank you for staying with OYA.' : item.notification,
    } : item));
  }

  return (
    <main className="hmvp">
      <div dangerouslySetInnerHTML={{ __html: '<!-- THESIS: OYA hotel MVP is demonstrated as usable front-desk software, not a proposal page. OWN-WORLD: calm hospitality operations shell, ivory surfaces, navy/gold identity, semantic room-status color, compact tables. STORY: management sees 12-room operations, creates bookings, checks guests in/out, records payments and separates future phases. FIRST VIEWPORT: entry choice between Guest Website and Hotel Operations System with fictional-data note. FORM: operate-mode MVP simulator with local seeded data and no live OTA/payment integration. -->' }} />
      {view === 'entry' ? <EntryPage setView={setView} /> : (
        <div className="hmvp-shell">
          <aside className="hmvp-sidebar">
            <div className="hmvp-brand"><b>OYA</b><span>Hotel MVP Demo</span></div>
            {[
              ['frontdesk', 'Front Desk', LayoutDashboard],
              ['rooms', 'Room Board', BedDouble],
              ['reservations', 'Reservations', CalendarDays],
              ['my-stay', 'My Stay', Home],
              ['guests', 'Guests', UserRound],
              ['housekeeping', 'Housekeeping Queue', ListChecks],
              ['room-admin', 'Room Management', Settings],
              ['reports', 'Reports', FileBarChart],
              ['guest', 'Guest Website', DoorOpen],
              ['future', 'Future Roadmap', Sparkles],
            ].map(([key, label, Icon]) => (
              <button key={key as string} className={view === key ? 'is-active' : ''} onClick={() => setView(key as View)} type="button"><Icon />{label as string}</button>
            ))}
          </aside>
          <section className="hmvp-main">
            <header className="hmvp-topbar">
              <div><h1>{view === 'guest' ? 'Guest Website Preview' : view === 'my-stay' ? 'My Stay' : view === 'future' ? 'Future Roadmap' : 'Hotel Operations System'}</h1><p>{notice}</p></div>
              <button type="button" onClick={() => setView('entry')}>Demo Entry</button>
            </header>
            {view === 'guest' && <GuestWebsite onBook={(payload) => { addBooking('OYA Website', false, payload); setView('frontdesk'); }} />}
            {view === 'my-stay' && <MyStay requests={guestRequests} dndEnabled={myStayDnd} onCreateRequest={addGuestRequest} onToggleDnd={toggleMyStayDnd} />}
            {view === 'frontdesk' && <FrontDesk counts={counts} arrivals={todayArrivals} departures={todayDepartures} recent={reservations.slice(0, 9)} outstanding={outstanding} unassigned={unassigned} guestRequests={guestRequests} setFlow={setFlow} setView={setView} setSelectedBooking={setSelectedBooking} checkIn={checkIn} checkOut={checkOut} />}
            {view === 'rooms' && <RoomBoard rooms={rooms} setRooms={setRooms} reservations={reservations} updateReservation={updateReservation} filter={roomFilter} setFilter={setRoomFilter} mode={boardMode} setMode={setBoardMode} checkIn={checkIn} checkOut={checkOut} setSelectedBooking={setSelectedBooking} setFlow={setFlow} />}
            {view === 'reservations' && <ReservationsPage reservations={reservations} setSelectedBooking={setSelectedBooking} checkIn={checkIn} checkOut={checkOut} setFlow={setFlow} />}
            {view === 'guests' && <GuestsPage guests={guests} reservations={reservations} selected={selectedGuest} setSelected={setSelectedGuest} />}
            {view === 'housekeeping' && <HousekeepingQueue requests={guestRequests} onStatusChange={updateGuestRequestStatus} />}
            {view === 'room-admin' && <RoomAdmin rooms={rooms} setRooms={setRooms} />}
            {view === 'reports' && <Reports reservations={reservations} rooms={rooms} />}
            {view === 'future' && <FutureRoadmap />}
          </section>
        </div>
      )}
      {selectedBooking ? <BookingDrawer booking={selectedBooking} guest={guests.find((item) => item.id === selectedBooking.guestId)} onClose={() => setSelectedBooking(null)} onRecordPayment={(amount) => { updateReservation(selectedBooking.id, { amountPaid: selectedBooking.amountPaid + amount, outstanding: Math.max(0, selectedBooking.outstanding - amount), paymentStatus: selectedBooking.outstanding - amount <= 0 ? 'Paid' : 'Partially Paid' }); setSelectedBooking(null); }} onCheckIn={() => { checkIn(selectedBooking); setSelectedBooking(null); }} onCheckOut={() => { checkOut(selectedBooking); setSelectedBooking(null); }} /> : null}
      {flow ? <BookingFlow mode={flow} rooms={rooms} onClose={() => setFlow(null)} onConfirm={(source, checkInNow, payload) => { addBooking(source, checkInNow, payload); setFlow(null); }} /> : null}
    </main>
  );
}

function EntryPage({ setView }: { setView: (view: View) => void }) {
  return (
    <section className="hmvp-entry">
      <div>
        <b>OYA</b>
        <h1>Interactive Hotel Management MVP Demo</h1>
        <p>Explore how front desk staff and management can run rooms, reservations, check-ins, check-outs, payments, guests and reports for a 12-room property.</p>
        <small>Interactive demonstration using fictional sample data. OYA is the hotel prospect; OYO is shown only as a third-party booking source option.</small>
      </div>
      <div className="hmvp-entry-actions">
        <button type="button" onClick={() => setView('guest')}><DoorOpen /> <span><b>Guest Website</b><small>Preview rooms, check availability and submit a direct booking.</small></span></button>
        <button type="button" onClick={() => setView('frontdesk')}><Hotel /> <span><b>Hotel Operations System</b><small>Open the front desk and management dashboard.</small></span></button>
      </div>
    </section>
  );
}

function FrontDesk({ counts, arrivals, departures, recent, outstanding, unassigned, guestRequests, setFlow, setView, setSelectedBooking, checkIn, checkOut }: {
  counts: { occupied: number; available: number; reserved: number; cleaning: number; maintenance: number };
  arrivals: Reservation[]; departures: Reservation[]; recent: Reservation[]; outstanding: Reservation[]; unassigned: Reservation[];
  guestRequests: GuestRequest[];
  setFlow: (flow: FlowMode) => void; setView: (view: View) => void; setSelectedBooking: (booking: Reservation) => void; checkIn: (booking: Reservation) => void; checkOut: (booking: Reservation) => void;
}) {
  return (
    <div className="hmvp-workspace">
      <div className="hmvp-actions">
        {['New Walk-In', 'New Reservation', 'Check In Guest', 'Check Out Guest', 'Search Guest', 'View Room Board'].map((label) => (
          <button key={label} type="button" onClick={() => label === 'New Walk-In' ? setFlow('walkin') : label === 'New Reservation' ? setFlow('reservation') : label === 'View Room Board' ? setView('rooms') : label === 'Search Guest' ? setView('guests') : setFlow(label.includes('Out') ? 'checkout' : 'checkin')}>{label}</button>
        ))}
      </div>
      <div className="hmvp-metrics">
        <Metric label="Occupied Rooms" value={counts.occupied} icon={BedDouble} />
        <Metric label="Available Rooms" value={counts.available} icon={DoorOpen} />
        <Metric label="Reserved Rooms" value={counts.reserved} icon={CalendarDays} />
        <Metric label="Rooms Requiring Cleaning" value={counts.cleaning} icon={Sparkles} alert={counts.cleaning > 0} />
        <Metric label="Under Maintenance" value={counts.maintenance} icon={Wrench} alert={counts.maintenance > 0} />
        <Metric label="Today Arrivals" value={arrivals.length} icon={LogIn} />
        <Metric label="Today Departures" value={departures.length} icon={LogOut} />
        <Metric label="Outstanding Payments" value={outstanding.length} icon={CreditCard} alert={outstanding.length > 0} />
        <Metric label="Unassigned Bookings" value={unassigned.length} icon={Bell} alert={unassigned.length > 0} />
      </div>
      <section className="hmvp-grid">
        <Panel title="Today's Arrivals"><MiniTable rows={arrivals} empty="No more arrivals today." columns={['Guest', 'Room', 'Arrival', 'Source', 'Payment', '']} render={(item) => [item.guestName, item.room ?? 'Unassigned', item.arrivalTime, item.source, <Badge key="p" value={item.paymentStatus}>{item.paymentStatus}</Badge>, <button key="a" onClick={() => checkIn(item)}>Check In</button>]} /></Panel>
        <Panel title="Today's Departures"><MiniTable rows={departures} empty="No scheduled departures." columns={['Guest', 'Room', 'Outstanding', '']} render={(item) => [item.guestName, item.room ?? '-', money(item.outstanding), <button key="d" onClick={() => checkOut(item)}>Check Out</button>]} /></Panel>
      </section>
      <Panel title="Guest Requests">
        <div className="hmvp-guest-request-grid">
          {guestRequests.slice(0, 6).map((item) => (
            <article key={item.id} className={`hmvp-guest-request is-${tone(item.status)}`}>
              <div><b>Room {item.room}</b><Badge value={item.status}>{item.status}</Badge></div>
              <h3>{item.task}</h3>
              <p>{item.detail}</p>
              <small>Requested {item.requestedTime} · {item.assignedStaff}</small>
            </article>
          ))}
        </div>
      </Panel>
      <section className="hmvp-grid">
        <Panel title="Recent Bookings"><MiniTable rows={recent} columns={['Reference', 'Guest', 'Source', 'Status', 'Payment', '']} render={(item) => [item.reference, item.guestName, item.source, <Badge key="s" value={item.status}>{item.status}</Badge>, <Badge key="p" value={item.paymentStatus}>{item.paymentStatus}</Badge>, <button key="v" onClick={() => setSelectedBooking(item)}>View</button>]} /></Panel>
        <Panel title="Attention Required"><div className="hmvp-alert-list">{['Room 104 awaiting cleaning', 'Guest arriving for room 103; verify readiness', 'Room 105 has outstanding payment', 'Travel Agent booking needs room assignment', 'Room 108 maintenance issue open'].map((item) => <article key={item}><Badge value={item.includes('outstanding') || item.includes('maintenance') ? 'Unpaid' : 'Pending'}>Action</Badge><b>{item}</b><button type="button">Review</button></article>)}</div></Panel>
      </section>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="hmvp-panel"><h2>{title}</h2>{children}</section>;
}

function MiniTable<T>({ rows, columns, render, empty }: { rows: T[]; columns: string[]; render: (row: T) => React.ReactNode[]; empty?: string }) {
  if (!rows.length) return <div className="hmvp-empty">{empty ?? 'No records found.'}</div>;
  return <div className="hmvp-table"><table><thead><tr>{columns.map((col) => <th key={col}>{col}</th>)}</tr></thead><tbody>{rows.map((row, index) => <tr key={index}>{render(row).map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table></div>;
}

const roomStatuses: RoomStatus[] = ['Available', 'Reserved', 'Occupied', 'Cleaning Required', 'Cleaning In Progress', 'Ready', 'Maintenance', 'Out of Service', 'Do Not Disturb'];

function RoomBoard({ rooms, setRooms, reservations, updateReservation, filter, setFilter, mode, setMode, checkIn, checkOut, setSelectedBooking, setFlow }: {
  rooms: HotelRoom[];
  setRooms: Dispatch<SetStateAction<HotelRoom[]>>;
  reservations: Reservation[];
  updateReservation: (id: string, patch: Partial<Reservation>) => void;
  filter: string;
  setFilter: (filter: 'All' | 'Available' | 'Reserved' | 'Occupied' | 'Cleaning' | 'Maintenance') => void;
  mode: BoardMode;
  setMode: (mode: BoardMode) => void;
  checkIn: (booking: Reservation) => void;
  checkOut: (booking: Reservation) => void;
  setSelectedBooking: (booking: Reservation) => void;
  setFlow: (flow: FlowMode) => void;
}) {
  const [selectedRoom, setSelectedRoom] = useState<string>('101');
  const filtered = rooms.filter((room) => filter === 'All' || room.status === filter || (filter === 'Cleaning' && room.status.includes('Cleaning')) || (filter === 'Maintenance' && ['Maintenance', 'Out of Service'].includes(room.status)));
  const dates = ['2026-07-28', '2026-07-29', '2026-07-30', '2026-07-31', '2026-08-01', '2026-08-02'];
  const selected = rooms.find((room) => room.number === selectedRoom) ?? filtered[0] ?? rooms[0];
  const assignedBooking = selected ? reservations.find((item) => item.room === selected.number && !['Checked Out', 'Cancelled', 'No Show'].includes(item.status)) : undefined;
  const waitingSameType = selected ? reservations.find((item) => !item.room && item.roomType === selected.type && ['Confirmed', 'Pending', 'Enquiry'].includes(item.status)) : undefined;

  function currentReservation(roomNumber: string) {
    return reservations.find((item) => item.room === roomNumber && item.status === 'Checked In')
      ?? reservations.find((item) => item.room === roomNumber && ['Confirmed', 'Pending'].includes(item.status));
  }

  function nextBooking(room: HotelRoom) {
    return reservations
      .filter((item) => item.room === room.number && item.checkIn > today && !['Checked Out', 'Cancelled', 'No Show'].includes(item.status))
      .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0]
      ?? reservations
        .filter((item) => !item.room && item.roomType === room.type && item.checkIn >= today && !['Checked Out', 'Cancelled', 'No Show'].includes(item.status))
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn))[0];
  }

  function setRoomStatus(roomNumber: string, status: RoomStatus) {
    const cleaningStatus: HotelRoom['cleaningStatus'] =
      status === 'Cleaning Required' ? 'Needs Cleaning' :
        status === 'Cleaning In Progress' ? 'In Progress' :
          ['Ready', 'Available', 'Reserved', 'Occupied'].includes(status) ? 'Ready' : 'Inspected';
    setRooms((items) => items.map((room) => room.number === roomNumber ? { ...room, status, cleaningStatus } : room));
  }

  function releaseRoom(room: HotelRoom) {
    const reservation = currentReservation(room.number);
    if (reservation && reservation.status !== 'Checked In') {
      updateReservation(reservation.id, { room: undefined, status: reservation.status === 'Confirmed' ? 'Pending' : reservation.status });
    }
    setRoomStatus(room.number, 'Available');
  }

  function assignWaiting(room: HotelRoom) {
    const reservation = reservations.find((item) => !item.room && item.roomType === room.type && ['Confirmed', 'Pending', 'Enquiry'].includes(item.status));
    if (!reservation) return;
    updateReservation(reservation.id, { room: room.number, status: 'Confirmed' });
    setRoomStatus(room.number, 'Reserved');
  }

  return (
    <div className="hmvp-workspace">
      <Toolbar title="All 12 Rooms Availability Board" filters={['All', 'Available', 'Reserved', 'Occupied', 'Cleaning', 'Maintenance']} active={filter} setActive={setFilter} right={<div className="hmvp-toggle"><button className={mode === 'board' ? 'is-active' : ''} onClick={() => setMode('board')}>Room Board View</button><button className={mode === 'calendar' ? 'is-active' : ''} onClick={() => setMode('calendar')}>Calendar View</button></div>} />
      {mode === 'board' ? (
        <div className="hmvp-room-control-layout">
          <section className="hmvp-room-board-panel" aria-label="Room status board">
            <div className="hmvp-room-board-head"><span>Room</span><span>Type</span><span>Guest / Booking</span><span>Dates</span><span>Clean</span><span>Status</span><span>Controls</span></div>
            {filtered.map((room) => {
              const current = currentReservation(room.number);
              const next = nextBooking(room);
              return (
                <button key={room.number} type="button" className={`hmvp-room-row is-${tone(room.status)} ${selected?.number === room.number ? 'is-selected' : ''}`} onClick={() => setSelectedRoom(room.number)}>
                  <b>{room.number}</b>
                  <span>{room.type}</span>
                  <span><strong>{current?.guestName ?? 'No current guest'}</strong><small>{current?.reference ?? `Next: ${next?.reference ?? 'None listed'}`}</small></span>
                  <span><strong>{current ? `${current.checkIn} -> ${current.checkOut}` : '-'}</strong><small>{next ? `${next.checkIn} arrival` : 'Open allocation'}</small></span>
                  <span>{room.cleaningStatus}</span>
                  <Badge value={room.status}>{room.status}</Badge>
                  <span className="hmvp-room-row-controls">{current?.outstanding ? <small className="hmvp-pay-dot">{money(current.outstanding)} due</small> : null}<small>Select</small></span>
                </button>
              );
            })}
          </section>

          {selected ? (
            <aside className="hmvp-room-control-panel">
              <div className="hmvp-room-control-title">
                <span>Room {selected.number}</span>
                <Badge value={selected.status}>{selected.status}</Badge>
              </div>
              <h3>{selected.type}</h3>
              <dl className="hmvp-room-facts">
                <div><dt>Current guest</dt><dd>{assignedBooking?.guestName ?? 'None'}</dd></div>
                <div><dt>Booking ref</dt><dd>{assignedBooking?.reference ?? '-'}</dd></div>
                <div><dt>Stay dates</dt><dd>{assignedBooking ? `${assignedBooking.checkIn} to ${assignedBooking.checkOut}` : '-'}</dd></div>
                <div><dt>Payment</dt><dd>{assignedBooking ? `${assignedBooking.paymentStatus}${assignedBooking.outstanding ? ` / ${money(assignedBooking.outstanding)} due` : ''}` : '-'}</dd></div>
                <div><dt>Cleaning</dt><dd>{selected.cleaningStatus}</dd></div>
                <div><dt>Internal note</dt><dd>{selected.notes || 'No note'}</dd></div>
              </dl>
              <label className="hmvp-control-label">Change room status<select value={selected.status} onChange={(event) => setRoomStatus(selected.number, event.target.value as RoomStatus)}>{roomStatuses.map((status) => <option key={status}>{status}</option>)}</select></label>
              <div className="hmvp-control-buttons">
                <button type="button" onClick={() => setRoomStatus(selected.number, 'Cleaning In Progress')}>Start Cleaning</button>
                <button type="button" onClick={() => setRoomStatus(selected.number, 'Ready')}>Mark Ready</button>
                <button type="button" onClick={() => setRoomStatus(selected.number, 'Maintenance')}>Maintenance</button>
                <button type="button" onClick={() => releaseRoom(selected)}>Release Room</button>
              </div>
              <div className="hmvp-control-actions">
                {waitingSameType ? <button type="button" onClick={() => assignWaiting(selected)}>Assign {waitingSameType.reference}</button> : <button type="button" onClick={() => setFlow('reservation')}>Create Reservation</button>}
                {assignedBooking ? <button type="button" onClick={() => setSelectedBooking(assignedBooking)}>Open Booking</button> : null}
                {assignedBooking && assignedBooking.status !== 'Checked In' ? <button type="button" onClick={() => checkIn(assignedBooking)}>Check In</button> : null}
                {assignedBooking && assignedBooking.status === 'Checked In' ? <button type="button" onClick={() => checkOut(assignedBooking)}>Check Out</button> : null}
              </div>
            </aside>
          ) : null}
        </div>
      ) : <div className="hmvp-calendar"><div className="hmvp-calendar-head"><span>Room</span>{dates.map((date) => <span key={date}>{date.slice(5)}</span>)}</div>{rooms.map((room) => <div className="hmvp-calendar-row" key={room.number}><b>{room.number}</b>{dates.map((date) => { const booking = reservations.find((item) => item.room === room.number && item.checkIn <= date && item.checkOut > date && !['Cancelled', 'No Show'].includes(item.status)); return <span key={date} className={booking ? 'is-booked' : room.status === 'Maintenance' ? 'is-blocked' : ''}>{booking ? booking.guestName.split(' ')[0] : room.status === 'Maintenance' ? 'Maint.' : 'Open'}</span>; })}</div>)}</div>}
    </div>
  );
}

function Toolbar({ title, filters, active, setActive, right }: { title: string; filters: string[]; active: string; setActive: (value: any) => void; right?: React.ReactNode }) {
  return <div className="hmvp-toolbar"><div><h2>{title}</h2><p>Fictional MVP demo data · Current MVP</p></div><div className="hmvp-tabs">{filters.map((item) => <button key={item} className={active === item ? 'is-active' : ''} onClick={() => setActive(item)}>{item}</button>)}</div>{right}</div>;
}

function ReservationsPage({ reservations, setSelectedBooking, checkIn, checkOut, setFlow }: { reservations: Reservation[]; setSelectedBooking: (booking: Reservation) => void; checkIn: (booking: Reservation) => void; checkOut: (booking: Reservation) => void; setFlow: (flow: FlowMode) => void }) {
  const [source, setSource] = useState('All');
  const [status, setStatus] = useState('All');
  const [payment, setPayment] = useState('All');
  const filtered = reservations.filter((item) => (source === 'All' || item.source === source) && (status === 'All' || item.status === status) && (payment === 'All' || item.paymentStatus === payment));
  return (
    <div className="hmvp-workspace">
      <Toolbar title="Reservation Management" filters={['All', 'OYA Website', 'Walk-In', 'Phone Call', 'WhatsApp', 'OYO', 'Agoda', 'Booking.com', 'Travel Agent', 'Corporate']} active={source} setActive={setSource} right={<button onClick={() => setFlow('reservation')}>New Reservation</button>} />
      <div className="hmvp-filterline"><select value={status} onChange={(e) => setStatus(e.target.value)}><option>All</option>{['Enquiry', 'Pending', 'Confirmed', 'Checked In', 'Checked Out', 'Cancelled', 'No Show'].map((item) => <option key={item}>{item}</option>)}</select><select value={payment} onChange={(e) => setPayment(e.target.value)}><option>All</option>{['Unpaid', 'Partially Paid', 'Paid', 'Refunded'].map((item) => <option key={item}>{item}</option>)}</select><input type="date" defaultValue={today} /><input type="date" defaultValue="2026-08-12" /></div>
      <MiniTable rows={filtered} columns={['Booking reference', 'Guest name', 'Room', 'Room type', 'Check-in', 'Check-out', 'Nights', 'Source', 'Status', 'Payment', 'Total', 'Outstanding', 'Actions']} render={(item) => [item.reference, item.guestName, item.room ?? 'Unassigned', item.roomType, item.checkIn, item.checkOut, item.nights, item.source, <Badge key="s" value={item.status}>{item.status}</Badge>, <Badge key="p" value={item.paymentStatus}>{item.paymentStatus}</Badge>, money(item.total), money(item.outstanding), <div key="a" className="hmvp-row-actions"><button onClick={() => setSelectedBooking(item)}>View</button><button onClick={() => setSelectedBooking(item)}>Edit</button><button onClick={() => checkIn(item)}>Check In</button><button onClick={() => checkOut(item)}>Check Out</button></div>]} />
    </div>
  );
}

function GuestsPage({ guests, reservations, selected, setSelected }: { guests: GuestProfile[]; reservations: Reservation[]; selected: GuestProfile | null; setSelected: (guest: GuestProfile | null) => void }) {
  return (
    <div className="hmvp-workspace">
      <Toolbar title="Guest Database" filters={['All guests']} active="All guests" setActive={() => undefined} />
      <MiniTable rows={guests} columns={['Guest name', 'Phone', 'Nationality', 'Total stays', 'Last stay', 'Upcoming booking', 'Total booking value', 'Outstanding', 'Status', '']} render={(guest) => [guest.name, guest.phone, guest.nationality, guest.totalStays, guest.lastStay, guest.upcomingBooking ?? '-', money(guest.totalValue), money(guest.outstanding), <Badge key="s" value={guest.status === 'Attention' ? 'Unpaid' : 'Paid'}>{guest.status}</Badge>, <button key="v" onClick={() => setSelected(guest)}>Profile</button>]} />
      {selected ? <section className="hmvp-drawer-card"><button onClick={() => setSelected(null)}><X /></button><h2>{selected.name}</h2><p>{selected.phone} · {selected.email} · {selected.nationality} · {selected.maskedId}</p><div className="hmvp-profile-grid"><article><b>Preferences</b><span>{selected.preferences.join(', ') || 'None recorded'}</span></article><article><b>Notes</b><span>{selected.notes || '-'}</span></article><article><b>Complaints or incidents</b><span>{selected.incidents.join(', ') || 'None'}</span></article><article><b>Booking sources used</b><span>{selected.sourcesUsed.join(', ')}</span></article></div><MiniTable rows={reservations.filter((item) => item.guestId === selected.id)} columns={['Reference', 'Room', 'Dates', 'Status', 'Payment']} render={(item) => [item.reference, item.room ?? '-', `${item.checkIn} to ${item.checkOut}`, item.status, item.paymentStatus]} /></section> : null}
    </div>
  );
}

function RoomAdmin({ rooms, setRooms }: { rooms: HotelRoom[]; setRooms: (rooms: HotelRoom[]) => void }) {
  return (
    <div className="hmvp-workspace">
      <Toolbar title="Room Management" filters={roomTypeOptions} active="Standard Queen" setActive={() => undefined} />
      <MiniTable rows={rooms} columns={['Room', 'Type', 'Capacity', 'Demo room charge', 'Facilities', 'Status', 'Internal notes', 'Active', 'Action']} render={(room) => [room.number, room.type, room.capacity, money(room.baseRate), room.facilities.join(', '), <select key="s" value={room.status} onChange={(e) => setRooms(rooms.map((item) => item.number === room.number ? { ...item, status: e.target.value as RoomStatus } : item))}>{['Available', 'Reserved', 'Occupied', 'Cleaning Required', 'Cleaning In Progress', 'Ready', 'Maintenance', 'Out of Service'].map((item) => <option key={item}>{item}</option>)}</select>, room.notes || '-', room.active ? 'Active' : 'Inactive', <button key="a">Save</button>]} />
      <div className="hmvp-roomtype-grid">{roomTypeOptions.map((type) => <article key={type}><div className="hmvp-room-visual">{type}</div><h3>{type}</h3><p>Editable room type page with capacity, description, facilities, sample visual area and demo room charge field.</p><label>Editable demo room charge<input defaultValue={rooms.find((room) => room.type === type)?.baseRate ?? 0} /></label></article>)}</div>
    </div>
  );
}

function Reports({ reservations, rooms }: { reservations: Reservation[]; rooms: HotelRoom[] }) {
  const active = reservations.filter((item) => !['Cancelled', 'No Show'].includes(item.status));
  const direct = reservations.filter((item) => item.source === 'OYA Website').length;
  const ota = reservations.filter((item) => otaSources.includes(item.source)).length;
  return (
    <div className="hmvp-workspace">
      <Toolbar title="Dashboard & Reports" filters={['Daily Booking Report', 'Daily Revenue Report', 'Occupancy Report', 'Booking Source Report', 'Payment Method Report', 'Outstanding Payment Report', 'Guest History Report']} active="Daily Booking Report" setActive={() => undefined} />
      <div className="hmvp-metrics">
        <Metric label="Revenue today" value={money(reservations.filter((item) => item.checkIn === today || item.checkOut === today).reduce((sum, item) => sum + item.amountPaid, 0))} icon={CreditCard} />
        <Metric label="Revenue this month" value={money(reservations.reduce((sum, item) => sum + item.amountPaid, 0))} icon={FileBarChart} />
        <Metric label="Occupancy rate" value={`${Math.round((rooms.filter((room) => room.status === 'Occupied').length / rooms.length) * 100)}%`} icon={BedDouble} />
        <Metric label="Average room charge" value={money(Math.round(active.reduce((sum, item) => sum + item.roomCharge, 0) / Math.max(1, active.length)))} icon={Hotel} />
        <Metric label="Bookings" value={reservations.length} icon={CalendarDays} />
        <Metric label="Direct bookings" value={direct} icon={DoorOpen} />
        <Metric label="Walk-ins" value={reservations.filter((item) => item.source === 'Walk-In').length} icon={Users} />
        <Metric label="OTA bookings" value={ota} icon={Building2} />
        <Metric label="Outstanding payments" value={reservations.filter((item) => item.outstanding > 0).length} icon={Bell} />
      </div>
      <Panel title="Simple management reports"><MiniTable rows={sourceOptions.map((source) => ({ source, count: reservations.filter((item) => item.source === source).length, outstanding: reservations.filter((item) => item.source === source).reduce((sum, item) => sum + item.outstanding, 0) }))} columns={['Booking source', 'Bookings', 'Outstanding']} render={(row) => [row.source, row.count, money(row.outstanding)]} /></Panel>
    </div>
  );
}

function GuestWebsite({ onBook }: { onBook: (payload: Partial<Reservation>) => void }) {
  const [roomType, setRoomType] = useState<RoomTypeName>('Standard Queen');
  const [name, setName] = useState('');
  return (
    <div className="hmvp-public">
      <section><h1>OYA Hotel</h1><p>A public-facing website preview for guests to explore rooms, facilities, location, contact information and submit a direct booking.</p><button onClick={() => document.getElementById('hmvp-book-now')?.scrollIntoView({ behavior: 'smooth' })}>Book Now</button><a href="https://wa.me/60000000000">WhatsApp</a></section>
      <div className="hmvp-public-grid">{roomTypeOptions.map((type) => <article key={type}><div className="hmvp-room-visual">{type}</div><h3>{type}</h3><p>Sample room details, facilities and availability for the MVP demo.</p></article>)}</div>
      <section className="hmvp-panel"><h2>Facilities, Location & Contact</h2><p>Wi-Fi, air conditioning, private bathroom, family-friendly rooms, front desk support, convenient access for travellers. Contact placeholders are fictional demo content.</p></section>
      <form id="hmvp-book-now" className="hmvp-book-form" onSubmit={(e) => { e.preventDefault(); onBook({ guestName: name || 'Website Demo Guest', roomType, checkIn: '2026-08-03', checkOut: '2026-08-04', notes: 'Created from public website preview.' }); }}>
        <h2>Direct Booking Request</h2><label>Name<input value={name} onChange={(e) => setName(e.target.value)} required /></label><label>Room type<select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomTypeName)}>{roomTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label><label>Check-in<input type="date" defaultValue="2026-08-03" /></label><label>Check-out<input type="date" defaultValue="2026-08-04" /></label><button>Submit Direct Booking</button>
      </form>
    </div>
  );
}

function BookingDrawer({ booking, guest, onClose, onRecordPayment, onCheckIn, onCheckOut }: { booking: Reservation; guest?: GuestProfile; onClose: () => void; onRecordPayment: (amount: number) => void; onCheckIn: () => void; onCheckOut: () => void }) {
  return <div className="hmvp-modal"><section className="hmvp-booking-detail"><button onClick={onClose}><X /></button><h2>{booking.reference}</h2><div className="hmvp-profile-grid"><article><b>Guest Details</b><span>{booking.guestName} · {guest?.phone ?? '-'} · {guest?.email ?? '-'} · {guest?.nationality ?? '-'} · {guest?.maskedId ?? 'masked demo ID'}</span></article><article><b>Stay Details</b><span>Room {booking.room ?? 'Unassigned'} · {booking.roomType} · {booking.checkIn} to {booking.checkOut} · {booking.source}{booking.otaReference ? ` · OTA ref ${booking.otaReference}` : ''}</span></article><article><b>Payment Details</b><span>Room charge {money(booking.roomCharge)} · Extras {money(booking.extraCharge)} · Deposit {money(booking.deposit)} · Total {money(booking.total)} · Paid {money(booking.amountPaid)} · Outstanding {money(booking.outstanding)}</span></article></div><h3>Payment history</h3><p>{booking.amountPaid ? `${money(booking.amountPaid)} recorded via ${booking.paymentMethod}` : 'No payment recorded yet.'}</p><h3>Activity Timeline</h3><ol>{booking.activity.map((item) => <li key={item}>{item}</li>)}</ol><div className="hmvp-actions"><button onClick={() => onRecordPayment(booking.outstanding || 50)}>Record Payment</button><button onClick={onCheckIn}>Check In</button><button onClick={onCheckOut}>Check Out</button><button onClick={onClose}>Add Note</button></div></section></div>;
}

function BookingFlow({ mode, rooms, onClose, onConfirm }: { mode: Exclude<FlowMode, null>; rooms: HotelRoom[]; onClose: () => void; onConfirm: (source: BookingSource, checkInNow: boolean, payload: Partial<Reservation>) => void }) {
  const [step, setStep] = useState(1);
  const [source, setSource] = useState<BookingSource>(mode === 'walkin' ? 'Walk-In' : 'Phone Call');
  const [roomType, setRoomType] = useState<RoomTypeName>('Standard Queen');
  const [room, setRoom] = useState('');
  const [guest, setGuest] = useState(blankGuest);
  const [paid, setPaid] = useState('0');
  const matching = rooms.filter((item) => ['Available', 'Ready'].includes(item.status) && item.type === roomType);
  const selected = rooms.find((item) => item.number === room) ?? matching[0];
  const roomCharge = (selected?.baseRate ?? 168) * 1;
  const amountPaid = Number(paid || 0);
  if (mode === 'checkin' || mode === 'checkout') return <div className="hmvp-modal"><section className="hmvp-flow"><button onClick={onClose}><X /></button><h2>{mode === 'checkin' ? 'Check In Guest' : 'Check Out Guest'}</h2><p>Select a booking from the dashboard or reservation list to complete the full guest-specific workflow. This quick action opens the operational path without changing records.</p><button onClick={onClose}>Close</button></section></div>;
  return (
    <div className="hmvp-modal">
      <section className="hmvp-flow">
        <button onClick={onClose}><X /></button>
        <h2>{mode === 'walkin' ? 'Interactive Walk-In Booking' : 'New Reservation'}</h2>
        <div className="hmvp-steps">{[1, 2, 3, 4, 5].map((item) => <button key={item} className={step === item ? 'is-active' : ''} onClick={() => setStep(item)}>Step {item}</button>)}</div>
        {step === 1 && <div className="hmvp-form-grid"><label>Check-in date<input type="date" defaultValue={today} /></label><label>Check-out date<input type="date" defaultValue="2026-07-29" /></label><label>Adults<input type="number" defaultValue={1} /></label><label>Children<input type="number" defaultValue={0} /></label><label>Room type<select value={roomType} onChange={(e) => setRoomType(e.target.value as RoomTypeName)}>{roomTypeOptions.map((type) => <option key={type}>{type}</option>)}</select></label>{mode === 'reservation' ? <label>Booking source<select value={source} onChange={(e) => setSource(e.target.value as BookingSource)}>{sourceOptions.map((item) => <option key={item}>{item}</option>)}</select></label> : null}</div>}
        {step === 2 && <div className="hmvp-room-grid">{matching.length ? matching.map((item) => <button key={item.number} type="button" className={`hmvp-room ${room === item.number ? 'is-selected' : ''}`} onClick={() => setRoom(item.number)}><b>{item.number}</b><h3>{item.type}</h3><p>{money(item.baseRate)} demo room charge · Capacity {item.capacity}</p><Badge value="Available">Available</Badge></button>) : <div className="hmvp-empty">No matching rooms. Change room type or dates.</div>}</div>}
        {step === 3 && <div className="hmvp-form-grid">{Object.entries({ fullName: 'Full name', mobile: 'Mobile number', email: 'Email', nationality: 'Nationality', idRef: 'ID or passport reference', guestCount: 'Number of guests', vehicle: 'Vehicle number', notes: 'Notes' }).map(([key, label]) => <label key={key}>{label}<input value={(guest as any)[key]} onChange={(e) => setGuest({ ...guest, [key]: e.target.value })} /></label>)}</div>}
        {step === 4 && <div className="hmvp-form-grid"><label>Room charge<input value={roomCharge} readOnly /></label><label>Deposit<input defaultValue={0} /></label><label>Discount<input defaultValue={0} /></label><label>Extra charge<input defaultValue={0} /></label><label>Total amount<input value={roomCharge} readOnly /></label><label>Amount paid<input value={paid} onChange={(e) => setPaid(e.target.value)} /></label><label>Outstanding balance<input value={Math.max(0, roomCharge - amountPaid)} readOnly /></label><label>Payment method<select><option>Cash</option><option>Card</option><option>Bank Transfer</option><option>QR</option><option>Pay at Check-Out</option></select></label>{otaSources.includes(source) ? <><label>OTA booking reference<input placeholder={`${source}-DEMO-0000`} /></label><label>Platform rate<input placeholder="Manual demo field" /></label><label>Amount payable to hotel<input placeholder="Manual demo field" /></label><label>Payment collection method<input placeholder="Manual entry only" /></label></> : null}</div>}
        {step === 5 && <div className="hmvp-confirm"><CheckCircle2 /><h3>Confirm demo booking</h3><p>{guest.fullName || 'Guest name pending'} · Room {room || selected?.number || 'auto assign'} · {source}. OTA records are manually entered demo records unless a future integration is enabled.</p></div>}
        <div className="hmvp-actions"><button onClick={() => setStep(Math.max(1, step - 1))}>Back</button>{step < 5 ? <button onClick={() => setStep(step + 1)}>Next</button> : <><button onClick={() => onConfirm(source, false, { guestName: guest.fullName || 'Demo Guest', room: room || selected?.number, roomType, roomCharge, amountPaid, notes: guest.notes })}>Confirm Reservation</button><button onClick={() => onConfirm(source, true, { guestName: guest.fullName || 'Demo Guest', room: room || selected?.number, roomType, roomCharge, amountPaid: amountPaid || roomCharge, notes: guest.notes })}>Confirm and Check In Now</button></>}</div>
      </section>
    </div>
  );
}

function LegacyFutureRoadmap() {
  const previews = [
    ['Customer Portal', ['Upcoming booking', 'Booking history', 'Download confirmation', 'Online payment', 'Guest profile', 'Saved preferences', 'Promotions']],
    ['KLIA and KLIA2 Shuttle Service', ['Add airport pickup or drop-off', 'KLIA or KLIA2', 'Flight number', 'Passenger and luggage count', 'Assigned driver and vehicle', 'Scheduled to completed status board']],
    ['Automated Guest Communication', ['Booking confirmation', 'Check-in reminder', 'Shuttle reminder', 'Checkout reminder', 'Review request']],
    ['Management Intelligence', ['Booking source trends', 'Occupancy trends', 'Revenue trends', 'Repeat guest trends', 'Pricing insight', 'Demand forecast']],
  ];
  return <div className="hmvp-workspace"><Toolbar title="Future Roadmap" filters={['Future previews']} active="Future previews" setActive={() => undefined} /><div className="hmvp-future-grid">{previews.map(([title, items]) => <article key={title as string}><Badge value="Pending">Future Phase Preview — Not Included in Current MVP</Badge><h3>{title as string}</h3>{(items as string[]).map((item) => <p key={item}>{item}</p>)}</article>)}</div></div>;
}
