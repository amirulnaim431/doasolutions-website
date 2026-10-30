import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://doasolutions.com.my'),
  title: 'Business Systems & Website Demos | DOA Solutions',
  description: 'Explore interactive website, booking, POS and business system demos by DOA Solutions in Kuala Lumpur, Malaysia. All demos use fictional sample data.',
  robots: { index: false, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
