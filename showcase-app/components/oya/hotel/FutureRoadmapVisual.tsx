'use client';

import { BarChart3, CarFront, ClipboardCheck, MessageCircle, Smartphone } from 'lucide-react';

const futureLabel = 'Future Phase Preview — Not Included in Current MVP';

function FutureBadge() {
  return <span className="hmvp-future-badge">{futureLabel}</span>;
}

function FuturePreview({ title, note, icon: Icon, children }: { title: string; note: string; icon: typeof Smartphone; children: React.ReactNode }) {
  return (
    <article className="hmvp-future-card">
      <FutureBadge />
      <div className="hmvp-future-card-head">
        <span><Icon /></span>
        <div>
          <h3>{title}</h3>
          <p>{note}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function RoadmapToolbar() {
  return (
    <div className="hmvp-toolbar">
      <div>
        <h2>Future Roadmap</h2>
        <p>Preview concepts only. These screens are intentionally separated from the current hotel management MVP.</p>
      </div>
      <div className="hmvp-filter-row">
        <button type="button" className="is-active">Future previews</button>
      </div>
    </div>
  );
}

export function FutureRoadmapVisual() {
  return (
    <div className="hmvp-workspace">
      <RoadmapToolbar />
      <div className="hmvp-future-grid">
        <FuturePreview title="Customer Portal" note="A self-service guest area for confirmations, history and profile preferences." icon={Smartphone}>
          <div className="hmvp-phone-preview">
            <header><b>OYA Guest</b><span>Upcoming stay</span></header>
            <section>
              <small>Booking OYA-WEB-24031</small>
              <h4>Family Room</h4>
              <p>2 Aug to 4 Aug / 4 guests</p>
              <button type="button">Download Confirmation</button>
            </section>
            <div className="hmvp-mini-list">
              <span>Online payment <b>Preview</b></span>
              <span>Saved preferences <b>Quiet room</b></span>
              <span>Past stays <b>3 records</b></span>
            </div>
          </div>
        </FuturePreview>

        <FuturePreview title="Housekeeping and Maintenance" note="A room task board for cleaning, inspection and maintenance coordination." icon={ClipboardCheck}>
          <div className="hmvp-kanban-preview">
            {[
              ['To Clean', ['104 / Checkout clean', '112 / Linen refresh']],
              ['In Progress', ['105 / Deep clean']],
              ['Maintenance', ['108 / Aircond check']],
            ].map(([title, tasks]) => (
              <section key={title as string}>
                <b>{title as string}</b>
                {(tasks as string[]).map((task) => <span key={task}>{task}<small>Photo preview</small></span>)}
              </section>
            ))}
          </div>
        </FuturePreview>

        <FuturePreview title="KLIA and KLIA2 Shuttle Service" note="A pickup and drop-off flow for guests who need airport transfer coordination." icon={CarFront}>
          <div className="hmvp-shuttle-preview">
            <div>
              <small>Guest shuttle request</small>
              <b>KLIA2 pickup / AK 5217</b>
              <p>2 passengers / 3 luggage / Arrival 21:40</p>
            </div>
            <ol>
              {['Scheduled', 'Driver Assigned', 'Driver En Route', 'Guest Picked Up', 'Completed'].map((item, index) => <li key={item} className={index < 2 ? 'is-done' : ''}>{item}</li>)}
            </ol>
            <button type="button">Assign Driver</button>
          </div>
        </FuturePreview>

        <FuturePreview title="Automated Guest Communication" note="Template previews for booking, arrival, shuttle, checkout and review messages." icon={MessageCircle}>
          <div className="hmvp-message-preview">
            {[
              ['Booking confirmation', 'Sent when reservation is confirmed.'],
              ['Check-in reminder', 'Send one day before arrival.'],
              ['Shuttle reminder', 'Include pickup location and flight number.'],
              ['Review request', 'Send after checkout.'],
            ].map(([title, body]) => <article key={title}><MessageCircle /><div><b>{title}</b><p>{body}</p></div><span>Template</span></article>)}
          </div>
        </FuturePreview>

        <FuturePreview title="Management Intelligence" note="A management view for booking trends, occupancy, demand and pricing insight." icon={BarChart3}>
          <div className="hmvp-bi-preview">
            <div><small>Occupancy trend</small><b>78%</b><span style={{ width: '78%' }} /></div>
            <div><small>Direct booking mix</small><b>42%</b><span style={{ width: '42%' }} /></div>
            <div><small>Repeat guest trend</small><b>18%</b><span style={{ width: '18%' }} /></div>
            <section>
              {['Website', 'Walk-In', 'OTA', 'Corporate'].map((item, index) => <span key={item} style={{ height: `${44 + index * 18}px` }}><b>{item}</b></span>)}
            </section>
          </div>
        </FuturePreview>
      </div>
    </div>
  );
}
