import type { Metadata } from 'next';
import LeanWellness from '@/components/lean-wellness/LeanWellness';
import './lean-wellness.css';

export const metadata: Metadata = {
  title: 'LEAN Wellness concepts | DOA Solutions Showcase',
  description: 'Two exploratory LEAN Wellness website concepts by DOA Solutions. Fictional schedule demonstration; no booking or payment is collected.',
};

export default function LeanWellnessPage() {
  return <LeanWellness />;
}
