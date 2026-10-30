import { ShowcaseHub } from '@/components/ShowcaseHub';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  alternates: { canonical: 'https://doasolutions.com.my/showcase/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: 'https://doasolutions.com.my/showcase/',
    siteName: 'DOA Solutions',
    title: 'Business Systems & Website Demos | DOA Solutions',
    description: 'Explore interactive website, booking, POS and business system demos built for Malaysian businesses.',
  },
};

export default function ShowcasePage() {
  return <ShowcaseHub />;
}
