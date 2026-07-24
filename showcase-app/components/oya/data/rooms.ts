import type { RoomType } from '../types';

const roomImage = 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1400&q=85';
const twinImage = 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85';
const familyImage = 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85';

export const roomTypes: RoomType[] = [
  {
    id: 'room-standard-queen',
    slug: 'standard-queen',
    name: 'Standard Queen',
    summary: 'Practical queen room for short transit stays and early departures.',
    capacity: 2,
    bedType: '1 Queen bed',
    roomSize: 'Size placeholder pending official room details',
    amenities: ['Wi-Fi', 'Air conditioning', 'Private bathroom', 'Comfortable bedding', 'Housekeeping'],
    demoNightlyRate: 180,
    quantity: 6,
    gallery: [roomImage, twinImage],
    policies: ['Demo rate only', 'Check-in and check-out time placeholder', 'No payment is collected in this demo'],
    isDemo: true,
  },
  {
    id: 'room-twin-comfort',
    slug: 'twin-comfort',
    name: 'Twin Comfort',
    summary: 'Twin bed setup for friends, siblings or pilgrims travelling together.',
    capacity: 2,
    bedType: '2 Single beds',
    roomSize: 'Size placeholder pending official room details',
    amenities: ['Wi-Fi', 'Air conditioning', 'Private bathroom', 'Prayer-friendly essentials', 'Housekeeping'],
    demoNightlyRate: 200,
    quantity: 5,
    gallery: [twinImage, roomImage],
    policies: ['Demo availability only', 'Subject to confirmation by OYA Inn'],
    isDemo: true,
  },
  {
    id: 'room-family',
    slug: 'family-room',
    name: 'Family Room',
    summary: 'Warmer room option for families, group transit stays and pre-departure rest.',
    capacity: 4,
    bedType: '1 Queen bed + 2 Single beds',
    roomSize: 'Size placeholder pending official room details',
    amenities: ['Wi-Fi', 'Air conditioning', 'Family-friendly options', 'Private bathroom', 'Comfortable bedding'],
    demoNightlyRate: 280,
    quantity: 4,
    gallery: [familyImage, roomImage],
    policies: ['Demo room details', 'Extra bedding subject to confirmation'],
    isDemo: true,
  },
  {
    id: 'room-extended',
    slug: 'extended-stay-room',
    name: 'Extended Stay Room',
    summary: 'For longer stays where applicable, subject to room availability and consultation.',
    capacity: 3,
    bedType: 'Flexible bedding placeholder',
    roomSize: 'Size placeholder pending official room details',
    amenities: ['Wi-Fi', 'Air conditioning', 'Longer-stay enquiry', 'Private bathroom', 'Housekeeping'],
    demoNightlyRate: 330,
    quantity: 2,
    gallery: [roomImage, familyImage],
    policies: ['Longer-stay terms subject to confirmation', 'Demo nightly rate only'],
    isDemo: true,
  },
];

export const roomAvailability = [
  { date: '2026-08-14', roomSlug: 'standard-queen', available: 4 },
  { date: '2026-08-14', roomSlug: 'twin-comfort', available: 3 },
  { date: '2026-08-14', roomSlug: 'family-room', available: 2 },
  { date: '2026-08-14', roomSlug: 'extended-stay-room', available: 1 },
];

export function getRoomBySlug(slug: string) {
  return roomTypes.find((item) => item.slug === slug);
}
