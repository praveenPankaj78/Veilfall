import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veilfall: The Broken Concord',
  description: 'A travelling dark fantasy decision RPG about promises, dangerous roads, and a world coming apart.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
