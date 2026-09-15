import type { Metadata } from 'next';
import './globals.css';

const title = 'Veilfall: The Ember Oath';
const description =
  'Lead your people through an impossible journey. Choose who to trust and what to risk in a complete twelve-chapter dark fantasy adventure.';
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_ORIGIN;
const trustedOrigin = configuredOrigin?.startsWith('https://')
  ? configuredOrigin
  : null;
const socialImage = trustedOrigin
  ? new URL('/art/caelan-east-gate.png', trustedOrigin).toString()
  : null;

export const metadata: Metadata = {
  title,
  description,
  applicationName: title,
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    type: 'website',
    title,
    description,
    siteName: title,
    ...(socialImage
      ? {
          images: [
            {
              url: socialImage,
              width: 1536,
              height: 864,
              alt: 'Caelan and Mara lead a diplomatic escort out of Greyhaven',
            },
          ],
        }
      : {}),
  },
  twitter: {
    card: socialImage ? 'summary_large_image' : 'summary',
    title,
    description,
    ...(socialImage ? { images: [socialImage] } : {}),
  },
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
