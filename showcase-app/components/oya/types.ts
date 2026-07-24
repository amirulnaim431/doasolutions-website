export type Language = 'en' | 'bm';

export type PackageCategory =
  | 'Malaysia'
  | 'Indonesia'
  | 'International'
  | 'Islands'
  | 'Umrah'
  | 'Hajj Enquiry'
  | 'Private Group';

export interface DepartureDate {
  date: string;
  seatsRemaining?: number;
  note?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  details: string;
}

export interface TravelPackage {
  id: string;
  slug: string;
  title: string;
  category: PackageCategory;
  destination: string;
  duration: string;
  summary: string;
  description: string;
  startingPrice?: number;
  priceType: 'from' | 'contact';
  featured: boolean;
  departureDates: DepartureDate[];
  itinerary: ItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  accommodation: string;
  transport: string;
  tags: string[];
  image: string;
  gallery: string[];
  seatsRemaining?: number;
  enquiryOnly?: boolean;
  isDemo: true;
}

export interface RoomType {
  id: string;
  slug: string;
  name: string;
  summary: string;
  capacity: number;
  bedType: string;
  roomSize: string;
  amenities: string[];
  demoNightlyRate: number;
  quantity: number;
  gallery: string[];
  policies: string[];
  isDemo: true;
}

export interface Testimonial {
  id: string;
  type: string;
  name: string;
  title: string;
  body: string;
  isDemo: true;
}

export interface Faq {
  question: string;
  answer: string;
}
