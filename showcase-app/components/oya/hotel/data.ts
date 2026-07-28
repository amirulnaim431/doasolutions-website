export type RoomTypeName = 'Standard Queen' | 'Deluxe King' | 'Twin Room' | 'Family Room';
export type RoomStatus = 'Available' | 'Reserved' | 'Occupied' | 'Cleaning Required' | 'Cleaning In Progress' | 'Ready' | 'Maintenance' | 'Out of Service' | 'Do Not Disturb';
export type BookingSource = 'OYA Website' | 'Walk-In' | 'Phone Call' | 'WhatsApp' | 'OYO' | 'Agoda' | 'Booking.com' | 'Travel Agent' | 'Corporate' | 'Other';
export type BookingStatus = 'Enquiry' | 'Pending' | 'Confirmed' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'No Show';
export type PaymentStatus = 'Unpaid' | 'Partially Paid' | 'Paid' | 'Refunded';

export interface HotelRoom {
  number: string;
  type: RoomTypeName;
  capacity: number;
  baseRate: number;
  status: RoomStatus;
  cleaningStatus: 'Ready' | 'Needs Cleaning' | 'In Progress' | 'Inspected';
  facilities: string[];
  notes: string;
  active: boolean;
}

export interface GuestProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationality: string;
  maskedId: string;
  totalStays: number;
  lastStay: string;
  upcomingBooking?: string;
  totalValue: number;
  outstanding: number;
  status: 'Repeat Guest' | 'First Stay' | 'Corporate Guest' | 'Attention';
  preferences: string[];
  notes: string;
  incidents: string[];
  sourcesUsed: BookingSource[];
}

export interface Reservation {
  id: string;
  reference: string;
  guestId: string;
  guestName: string;
  room?: string;
  roomType: RoomTypeName;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  source: BookingSource;
  otaReference?: string;
  platformRate?: number;
  payableToHotel?: number;
  collectionMethod?: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  roomCharge: number;
  deposit: number;
  discount: number;
  extraCharge: number;
  total: number;
  amountPaid: number;
  outstanding: number;
  paymentMethod: 'Cash' | 'Card' | 'Bank Transfer' | 'QR' | 'Pay at Check-Out';
  arrivalTime: string;
  notes: string;
  activity: string[];
}

export const roomsSeed: HotelRoom[] = [
  { number: '101', type: 'Standard Queen', capacity: 2, baseRate: 168, status: 'Occupied', cleaningStatus: 'Ready', facilities: ['Queen bed', 'Wi-Fi', 'Air conditioning'], notes: 'Quiet room request noted.', active: true },
  { number: '102', type: 'Standard Queen', capacity: 2, baseRate: 168, status: 'Available', cleaningStatus: 'Ready', facilities: ['Queen bed', 'Desk', 'Private bathroom'], notes: '', active: true },
  { number: '103', type: 'Twin Room', capacity: 2, baseRate: 188, status: 'Reserved', cleaningStatus: 'Ready', facilities: ['Twin beds', 'Wi-Fi', 'Prayer mat'], notes: 'Arrival expected 16:30.', active: true },
  { number: '104', type: 'Deluxe King', capacity: 2, baseRate: 228, status: 'Cleaning Required', cleaningStatus: 'Needs Cleaning', facilities: ['King bed', 'Sofa', 'Mini fridge'], notes: 'Checkout completed, housekeeping pending.', active: true },
  { number: '105', type: 'Family Room', capacity: 4, baseRate: 288, status: 'Occupied', cleaningStatus: 'Ready', facilities: ['Queen + twin beds', 'Family layout', 'Extra pillows'], notes: 'Outstanding balance before checkout.', active: true },
  { number: '106', type: 'Standard Queen', capacity: 2, baseRate: 168, status: 'Ready', cleaningStatus: 'Inspected', facilities: ['Queen bed', 'Wi-Fi', 'Air conditioning'], notes: '', active: true },
  { number: '107', type: 'Twin Room', capacity: 2, baseRate: 188, status: 'Cleaning In Progress', cleaningStatus: 'In Progress', facilities: ['Twin beds', 'Desk', 'Private bathroom'], notes: 'Housekeeping started 10:12.', active: true },
  { number: '108', type: 'Deluxe King', capacity: 2, baseRate: 228, status: 'Occupied', cleaningStatus: 'Ready', facilities: ['King bed', 'Sofa', 'Mini fridge'], notes: 'My Stay demo guest room.', active: true },
  { number: '109', type: 'Standard Queen', capacity: 2, baseRate: 168, status: 'Available', cleaningStatus: 'Ready', facilities: ['Queen bed', 'Wi-Fi', 'Private bathroom'], notes: '', active: true },
  { number: '110', type: 'Family Room', capacity: 4, baseRate: 288, status: 'Reserved', cleaningStatus: 'Ready', facilities: ['Family layout', 'Extra bedding', 'Desk'], notes: 'Corporate guest arriving late.', active: true },
  { number: '111', type: 'Twin Room', capacity: 2, baseRate: 188, status: 'Out of Service', cleaningStatus: 'Ready', facilities: ['Twin beds', 'Wi-Fi', 'Private bathroom'], notes: 'Demo inactive room for admin control.', active: false },
  { number: '112', type: 'Deluxe King', capacity: 2, baseRate: 228, status: 'Occupied', cleaningStatus: 'Ready', facilities: ['King bed', 'Sofa', 'Mini fridge'], notes: '', active: true },
];

export const guestsSeed: GuestProfile[] = [
  { id: 'g01', name: 'Aina Rahman', phone: '+60 12-410 0192', email: 'aina.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-2190', totalStays: 3, lastStay: '2026-06-18', upcomingBooking: 'OYA-240728-001', totalValue: 1260, outstanding: 0, status: 'Repeat Guest', preferences: ['Late arrival', 'Quiet room'], notes: 'Prefers WhatsApp updates.', incidents: [], sourcesUsed: ['OYA Website', 'WhatsApp'] },
  { id: 'g02', name: 'Daniel Wong', phone: '+60 16-220 4431', email: 'daniel.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-7712', totalStays: 1, lastStay: '2026-07-02', totalValue: 456, outstanding: 0, status: 'First Stay', preferences: ['Card payment'], notes: '', incidents: [], sourcesUsed: ['Walk-In'] },
  { id: 'g03', name: 'Nurul Izzati', phone: '+60 13-880 6144', email: 'nurul.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-4088', totalStays: 2, lastStay: '2026-05-21', upcomingBooking: 'OYA-240728-003', totalValue: 880, outstanding: 80, status: 'Attention', preferences: ['Ground floor if possible'], notes: 'Collect remaining balance before checkout.', incidents: ['Late checkout warning in prior stay'], sourcesUsed: ['Phone Call', 'OYA Website'] },
  { id: 'g04', name: 'Muhammad Amir', phone: '+60 17-440 8872', email: 'amir.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-1882', totalStays: 4, lastStay: '2026-07-10', totalValue: 1780, outstanding: 0, status: 'Repeat Guest', preferences: ['Twin room'], notes: '', incidents: [], sourcesUsed: ['Booking.com', 'Walk-In'] },
  { id: 'g05', name: 'Sarah Lee', phone: '+60 11-310 9033', email: 'sarah.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-5621', totalStays: 1, lastStay: '2026-07-19', upcomingBooking: 'OYA-240728-005', totalValue: 620, outstanding: 120, status: 'Attention', preferences: ['Invoice needed'], notes: 'Corporate traveller.', incidents: [], sourcesUsed: ['Corporate'] },
  { id: 'g06', name: 'Hiro Tanaka', phone: '+81 80-0000-1928', email: 'hiro.demo@example.com', nationality: 'Japan', maskedId: 'JP****901', totalStays: 1, lastStay: '2026-06-30', totalValue: 680, outstanding: 0, status: 'First Stay', preferences: ['Airport drop-off future phase interest'], notes: '', incidents: [], sourcesUsed: ['Agoda'] },
  { id: 'g07', name: 'Siti Mariam', phone: '+60 18-700 4410', email: 'siti.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-3309', totalStays: 5, lastStay: '2026-07-03', totalValue: 2350, outstanding: 0, status: 'Repeat Guest', preferences: ['Family room'], notes: 'Travels with children.', incidents: [], sourcesUsed: ['WhatsApp', 'Travel Agent'] },
  { id: 'g08', name: 'Raj Kumar', phone: '+60 12-991 6002', email: 'raj.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-8890', totalStays: 1, lastStay: '2026-04-14', totalValue: 336, outstanding: 0, status: 'First Stay', preferences: [], notes: '', incidents: [], sourcesUsed: ['OYO'] },
  { id: 'g09', name: 'Fatimah Zahra', phone: '+60 19-010 4422', email: 'fatimah.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-7192', totalStays: 2, lastStay: '2026-07-01', totalValue: 960, outstanding: 0, status: 'Repeat Guest', preferences: ['Extra towel'], notes: '', incidents: [], sourcesUsed: ['Travel Agent'] },
  { id: 'g10', name: 'Emily Carter', phone: '+44 7700 900123', email: 'emily.demo@example.com', nationality: 'United Kingdom', maskedId: 'UK****441', totalStays: 1, lastStay: '2026-07-14', totalValue: 740, outstanding: 0, status: 'First Stay', preferences: ['Email confirmation'], notes: '', incidents: [], sourcesUsed: ['Booking.com'] },
  { id: 'g11', name: 'Ahmad Firdaus', phone: '+60 14-388 2911', email: 'firdaus.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-4820', totalStays: 1, lastStay: '2026-07-15', totalValue: 336, outstanding: 0, status: 'First Stay', preferences: [], notes: '', incidents: [], sourcesUsed: ['Phone Call'] },
  { id: 'g12', name: 'Priya Nair', phone: '+60 16-418 6620', email: 'priya.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-9120', totalStays: 2, lastStay: '2026-06-25', totalValue: 960, outstanding: 0, status: 'Repeat Guest', preferences: ['QR payment'], notes: '', incidents: [], sourcesUsed: ['OYA Website'] },
  { id: 'g13', name: 'Chen Wei', phone: '+65 8123 4422', email: 'chen.demo@example.com', nationality: 'Singapore', maskedId: 'SG****228', totalStays: 1, lastStay: '2026-07-21', totalValue: 456, outstanding: 0, status: 'First Stay', preferences: [], notes: '', incidents: [], sourcesUsed: ['Agoda'] },
  { id: 'g14', name: 'Zulhilmi Omar', phone: '+60 13-500 7110', email: 'zul.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-1018', totalStays: 1, lastStay: '2026-07-22', totalValue: 576, outstanding: 0, status: 'Corporate Guest', preferences: ['Company invoice'], notes: '', incidents: [], sourcesUsed: ['Corporate'] },
  { id: 'g15', name: 'Layla Hassan', phone: '+971 50 000 1844', email: 'layla.demo@example.com', nationality: 'United Arab Emirates', maskedId: 'AE****184', totalStays: 1, lastStay: '2026-07-09', totalValue: 680, outstanding: 0, status: 'First Stay', preferences: ['Family room'], notes: '', incidents: [], sourcesUsed: ['Booking.com'] },
  { id: 'g16', name: 'John Tan', phone: '+60 12-555 0108', email: 'john.tan.demo@example.com', nationality: 'Malaysia', maskedId: '****-**-0108', totalStays: 2, lastStay: '2026-07-28', upcomingBooking: 'OYA-240728-108', totalValue: 456, outstanding: 80, status: 'Repeat Guest', preferences: ['Digital room requests'], notes: 'My Stay demo guest.', incidents: [], sourcesUsed: ['OYA Website'] },
];

export const reservationsSeed: Reservation[] = [
  { id: 'r01', reference: 'OYA-240728-001', guestId: 'g01', guestName: 'Aina Rahman', room: '101', roomType: 'Standard Queen', checkIn: '2026-07-27', checkOut: '2026-07-29', nights: 2, adults: 2, children: 0, source: 'OYA Website', status: 'Checked In', paymentStatus: 'Paid', roomCharge: 336, deposit: 50, discount: 0, extraCharge: 0, total: 336, amountPaid: 336, outstanding: 0, paymentMethod: 'QR', arrivalTime: '14:20', notes: 'Direct website booking demo.', activity: ['Booking created', 'Room assigned', 'Payment recorded', 'Guest checked in'] },
  { id: 'r02', reference: 'OYA-240728-002', guestId: 'g02', guestName: 'Daniel Wong', room: '104', roomType: 'Deluxe King', checkIn: '2026-07-27', checkOut: '2026-07-28', nights: 1, adults: 1, children: 0, source: 'Walk-In', status: 'Checked Out', paymentStatus: 'Paid', roomCharge: 228, deposit: 0, discount: 0, extraCharge: 20, total: 248, amountPaid: 248, outstanding: 0, paymentMethod: 'Card', arrivalTime: '18:40', notes: 'Checked out today.', activity: ['Booking created', 'Guest checked in', 'Extra charge added', 'Guest checked out'] },
  { id: 'r03', reference: 'OYA-240728-003', guestId: 'g03', guestName: 'Nurul Izzati', room: '105', roomType: 'Family Room', checkIn: '2026-07-27', checkOut: '2026-07-28', nights: 1, adults: 2, children: 2, source: 'Phone Call', status: 'Checked In', paymentStatus: 'Partially Paid', roomCharge: 288, deposit: 50, discount: 0, extraCharge: 0, total: 288, amountPaid: 208, outstanding: 80, paymentMethod: 'Cash', arrivalTime: '15:05', notes: 'Outstanding balance before checkout.', activity: ['Booking created', 'Room assigned', 'Deposit recorded', 'Guest checked in'] },
  { id: 'r04', reference: 'OYA-240728-004', guestId: 'g04', guestName: 'Muhammad Amir', room: '103', roomType: 'Twin Room', checkIn: '2026-07-28', checkOut: '2026-07-29', nights: 1, adults: 2, children: 0, source: 'WhatsApp', status: 'Confirmed', paymentStatus: 'Unpaid', roomCharge: 188, deposit: 0, discount: 0, extraCharge: 0, total: 188, amountPaid: 0, outstanding: 188, paymentMethod: 'Pay at Check-Out', arrivalTime: '16:30', notes: 'Arrival today.', activity: ['Booking created', 'Room assigned'] },
  { id: 'r05', reference: 'OYA-240728-005', guestId: 'g05', guestName: 'Sarah Lee', room: '110', roomType: 'Family Room', checkIn: '2026-07-28', checkOut: '2026-07-30', nights: 2, adults: 2, children: 1, source: 'Corporate', status: 'Confirmed', paymentStatus: 'Partially Paid', roomCharge: 576, deposit: 150, discount: 0, extraCharge: 0, total: 576, amountPaid: 456, outstanding: 120, paymentMethod: 'Bank Transfer', arrivalTime: '21:00', notes: 'Corporate booking demo.', activity: ['Booking created', 'Payment recorded', 'Room assigned'] },
  { id: 'r06', reference: 'OYA-240728-006', guestId: 'g06', guestName: 'Hiro Tanaka', room: '112', roomType: 'Deluxe King', checkIn: '2026-07-26', checkOut: '2026-07-29', nights: 3, adults: 1, children: 0, source: 'Agoda', otaReference: 'AGD-DEMO-9214', platformRate: 720, payableToHotel: 684, collectionMethod: 'Collect at property', status: 'Checked In', paymentStatus: 'Paid', roomCharge: 684, deposit: 0, discount: 0, extraCharge: 0, total: 684, amountPaid: 684, outstanding: 0, paymentMethod: 'Card', arrivalTime: '22:10', notes: 'Manually entered OTA demo record.', activity: ['OTA booking manually entered', 'Room assigned', 'Guest checked in'] },
  { id: 'r07', reference: 'OYA-240728-007', guestId: 'g07', guestName: 'Siti Mariam', roomType: 'Family Room', checkIn: '2026-07-28', checkOut: '2026-07-29', nights: 1, adults: 2, children: 2, source: 'Travel Agent', status: 'Confirmed', paymentStatus: 'Unpaid', roomCharge: 288, deposit: 0, discount: 0, extraCharge: 0, total: 288, amountPaid: 0, outstanding: 288, paymentMethod: 'Pay at Check-Out', arrivalTime: '19:15', notes: 'Unassigned reservation demo.', activity: ['Booking created', 'Awaiting room assignment'] },
  { id: 'r08', reference: 'OYA-240728-008', guestId: 'g08', guestName: 'Raj Kumar', roomType: 'Standard Queen', checkIn: '2026-07-29', checkOut: '2026-07-30', nights: 1, adults: 1, children: 0, source: 'OYO', otaReference: 'OYO-DEMO-4810', platformRate: 178, payableToHotel: 165, collectionMethod: 'Platform collects guest payment', status: 'Confirmed', paymentStatus: 'Paid', roomCharge: 165, deposit: 0, discount: 0, extraCharge: 0, total: 165, amountPaid: 165, outstanding: 0, paymentMethod: 'Bank Transfer', arrivalTime: '15:00', notes: 'Manual OTA record. OYA is not OYO.', activity: ['OTA booking manually entered'] },
  { id: 'r09', reference: 'OYA-240728-009', guestId: 'g09', guestName: 'Fatimah Zahra', roomType: 'Twin Room', checkIn: '2026-07-29', checkOut: '2026-07-31', nights: 2, adults: 2, children: 0, source: 'Travel Agent', status: 'Pending', paymentStatus: 'Unpaid', roomCharge: 376, deposit: 0, discount: 0, extraCharge: 0, total: 376, amountPaid: 0, outstanding: 376, paymentMethod: 'Bank Transfer', arrivalTime: '14:00', notes: 'Awaiting confirmation.', activity: ['Booking created'] },
  { id: 'r10', reference: 'OYA-240728-010', guestId: 'g10', guestName: 'Emily Carter', roomType: 'Deluxe King', checkIn: '2026-07-30', checkOut: '2026-08-01', nights: 2, adults: 1, children: 0, source: 'Booking.com', otaReference: 'BDC-DEMO-3401', platformRate: 480, payableToHotel: 450, collectionMethod: 'Collect at property', status: 'Confirmed', paymentStatus: 'Unpaid', roomCharge: 450, deposit: 0, discount: 0, extraCharge: 0, total: 450, amountPaid: 0, outstanding: 450, paymentMethod: 'Pay at Check-Out', arrivalTime: '17:40', notes: 'Manual OTA record.', activity: ['OTA booking manually entered'] },
  { id: 'r11', reference: 'OYA-240728-011', guestId: 'g11', guestName: 'Ahmad Firdaus', room: '102', roomType: 'Standard Queen', checkIn: '2026-07-31', checkOut: '2026-08-01', nights: 1, adults: 1, children: 0, source: 'Phone Call', status: 'Confirmed', paymentStatus: 'Partially Paid', roomCharge: 168, deposit: 50, discount: 0, extraCharge: 0, total: 168, amountPaid: 50, outstanding: 118, paymentMethod: 'Cash', arrivalTime: '13:30', notes: '', activity: ['Booking created', 'Room assigned', 'Deposit recorded'] },
  { id: 'r12', reference: 'OYA-240728-012', guestId: 'g12', guestName: 'Priya Nair', room: '109', roomType: 'Standard Queen', checkIn: '2026-08-01', checkOut: '2026-08-03', nights: 2, adults: 2, children: 0, source: 'OYA Website', status: 'Confirmed', paymentStatus: 'Paid', roomCharge: 336, deposit: 0, discount: 0, extraCharge: 0, total: 336, amountPaid: 336, outstanding: 0, paymentMethod: 'QR', arrivalTime: '16:00', notes: 'Direct booking demo.', activity: ['Booking created', 'Payment recorded', 'Room assigned'] },
  { id: 'r13', reference: 'OYA-240728-013', guestId: 'g13', guestName: 'Chen Wei', roomType: 'Deluxe King', checkIn: '2026-08-02', checkOut: '2026-08-04', nights: 2, adults: 2, children: 0, source: 'Agoda', otaReference: 'AGD-DEMO-4912', platformRate: 470, payableToHotel: 440, collectionMethod: 'Platform virtual card placeholder', status: 'Confirmed', paymentStatus: 'Paid', roomCharge: 440, deposit: 0, discount: 0, extraCharge: 0, total: 440, amountPaid: 440, outstanding: 0, paymentMethod: 'Card', arrivalTime: '20:00', notes: 'Manual OTA record.', activity: ['OTA booking manually entered'] },
  { id: 'r14', reference: 'OYA-240728-014', guestId: 'g14', guestName: 'Zulhilmi Omar', roomType: 'Family Room', checkIn: '2026-08-03', checkOut: '2026-08-05', nights: 2, adults: 3, children: 1, source: 'Corporate', status: 'Pending', paymentStatus: 'Unpaid', roomCharge: 576, deposit: 0, discount: 0, extraCharge: 0, total: 576, amountPaid: 0, outstanding: 576, paymentMethod: 'Bank Transfer', arrivalTime: '18:00', notes: 'Company approval pending.', activity: ['Booking created'] },
  { id: 'r15', reference: 'OYA-240728-015', guestId: 'g15', guestName: 'Layla Hassan', roomType: 'Family Room', checkIn: '2026-08-04', checkOut: '2026-08-06', nights: 2, adults: 2, children: 2, source: 'Booking.com', otaReference: 'BDC-DEMO-7710', platformRate: 610, payableToHotel: 580, collectionMethod: 'Collect at property', status: 'Confirmed', paymentStatus: 'Unpaid', roomCharge: 580, deposit: 0, discount: 0, extraCharge: 0, total: 580, amountPaid: 0, outstanding: 580, paymentMethod: 'Pay at Check-Out', arrivalTime: '22:00', notes: 'Manual OTA record.', activity: ['OTA booking manually entered'] },
  { id: 'r16', reference: 'OYA-240728-016', guestId: 'g02', guestName: 'Daniel Wong', roomType: 'Twin Room', checkIn: '2026-08-05', checkOut: '2026-08-06', nights: 1, adults: 2, children: 0, source: 'Walk-In', status: 'Enquiry', paymentStatus: 'Unpaid', roomCharge: 188, deposit: 0, discount: 0, extraCharge: 0, total: 188, amountPaid: 0, outstanding: 188, paymentMethod: 'Cash', arrivalTime: '12:00', notes: 'Demo enquiry.', activity: ['Enquiry created'] },
  { id: 'r17', reference: 'OYA-240728-017', guestId: 'g04', guestName: 'Muhammad Amir', roomType: 'Standard Queen', checkIn: '2026-08-06', checkOut: '2026-08-07', nights: 1, adults: 1, children: 0, source: 'WhatsApp', status: 'Cancelled', paymentStatus: 'Refunded', roomCharge: 168, deposit: 0, discount: 0, extraCharge: 0, total: 168, amountPaid: 0, outstanding: 0, paymentMethod: 'QR', arrivalTime: '14:00', notes: 'Cancelled demo booking.', activity: ['Booking created', 'Booking cancelled'] },
  { id: 'r18', reference: 'OYA-240728-018', guestId: 'g05', guestName: 'Sarah Lee', roomType: 'Deluxe King', checkIn: '2026-08-07', checkOut: '2026-08-09', nights: 2, adults: 1, children: 0, source: 'Other', status: 'No Show', paymentStatus: 'Unpaid', roomCharge: 456, deposit: 0, discount: 0, extraCharge: 0, total: 456, amountPaid: 0, outstanding: 456, paymentMethod: 'Pay at Check-Out', arrivalTime: '23:30', notes: 'No-show sample.', activity: ['Booking created', 'Marked no show'] },
  { id: 'r19', reference: 'OYA-240728-019', guestId: 'g07', guestName: 'Siti Mariam', roomType: 'Family Room', checkIn: '2026-08-08', checkOut: '2026-08-10', nights: 2, adults: 2, children: 2, source: 'OYA Website', status: 'Confirmed', paymentStatus: 'Partially Paid', roomCharge: 576, deposit: 100, discount: 0, extraCharge: 0, total: 576, amountPaid: 100, outstanding: 476, paymentMethod: 'Bank Transfer', arrivalTime: '15:30', notes: 'Repeat guest.', activity: ['Booking created', 'Deposit recorded'] },
  { id: 'r20', reference: 'OYA-240728-020', guestId: 'g09', guestName: 'Fatimah Zahra', roomType: 'Twin Room', checkIn: '2026-08-10', checkOut: '2026-08-12', nights: 2, adults: 2, children: 0, source: 'Travel Agent', status: 'Confirmed', paymentStatus: 'Paid', roomCharge: 376, deposit: 0, discount: 0, extraCharge: 0, total: 376, amountPaid: 376, outstanding: 0, paymentMethod: 'Bank Transfer', arrivalTime: '14:30', notes: '', activity: ['Booking created', 'Payment recorded'] },
  { id: 'r21', reference: 'OYA-240728-108', guestId: 'g16', guestName: 'John Tan', room: '108', roomType: 'Deluxe King', checkIn: '2026-07-28', checkOut: '2026-07-29', nights: 1, adults: 1, children: 0, source: 'OYA Website', status: 'Checked In', paymentStatus: 'Partially Paid', roomCharge: 228, deposit: 50, discount: 0, extraCharge: 0, total: 228, amountPaid: 148, outstanding: 80, paymentMethod: 'QR', arrivalTime: '09:35', notes: 'Active My Stay demo booking.', activity: ['Booking created', 'Secure My Stay link sent', 'Room assigned', 'Guest checked in'] },
];

export const sourceOptions: BookingSource[] = ['OYA Website', 'Phone Call', 'WhatsApp', 'Walk-In', 'OYO', 'Agoda', 'Booking.com', 'Travel Agent', 'Corporate', 'Other'];
export const roomTypeOptions: RoomTypeName[] = ['Standard Queen', 'Deluxe King', 'Twin Room', 'Family Room'];
