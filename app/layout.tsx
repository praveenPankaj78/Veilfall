import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Veilfall: The Crown Below',
  description: 'A story driven dark fantasy decision RPG.',
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
