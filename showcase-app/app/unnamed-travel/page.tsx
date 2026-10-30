import type { Metadata } from 'next';
import TravelDemo from '@/components/TravelDemo';
import './travel.css';

export const metadata: Metadata = {
  title: 'Travel, Beyond the Postcard | DOA Showcase',
  description: 'An interactive Bali and Malaysia itinerary concept centered on local culture and slower travel.',
};

export default function UnnamedTravelPage() {
  return <TravelDemo />;
}
