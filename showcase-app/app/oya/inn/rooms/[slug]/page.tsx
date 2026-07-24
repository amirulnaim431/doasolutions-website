import { OyaDemo } from '@/components/oya/OyaDemo';
import { roomTypes } from '@/components/oya/data/rooms';

export function generateStaticParams() {
  return roomTypes.map((item) => ({ slug: item.slug }));
}

export const metadata = { title: 'OYA Inn Room Detail Demo | DOA Solutions Showcase' };

export default async function OyaRoomDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <OyaDemo page="roomDetail" roomSlug={slug} />;
}
