import { OyaMediaPlayer } from '@/components/oya/OyaMediaPlayer';

export default function OyaLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OyaMediaPlayer />
      {children}
    </>
  );
}
