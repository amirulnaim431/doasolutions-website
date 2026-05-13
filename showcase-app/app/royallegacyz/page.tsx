import { RoyalHome } from '@/components/RoyalLegacyzSite';

export const metadata = {
  title: 'RoyalLegacyz Streetwear Store Demo | DOA Solutions',
  description:
    'RoyalLegacyz streetwear ecommerce demo with season collections, live selling schedule, gallery, and customer loyalty profile.',
  openGraph: {
    title: 'RoyalLegacyz Streetwear Store Demo',
    description:
      'A sales-focused RoyalLegacyz storefront demo for season drops, gallery proof, live shopping, and loyalty progress.',
    images: ['/showcase/images/rlz/Header.jpg'],
  },
};

export default function RoyalLegacyzPage() {
  return <RoyalHome />;
}
