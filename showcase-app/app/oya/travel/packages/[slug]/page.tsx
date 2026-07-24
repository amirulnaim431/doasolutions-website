import { OyaDemo } from '@/components/oya/OyaDemo';
import { travelPackages } from '@/components/oya/data/packages';

export function generateStaticParams() {
  return travelPackages.map((item) => ({ slug: item.slug }));
}

export const metadata = { title: 'OYA Package Detail Demo | DOA Solutions Showcase' };

export default async function OyaPackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OyaDemo page="packageDetail" packageSlug={slug} />;
}
