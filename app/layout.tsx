import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PlayConnect - Find Perfect Playdates for Your Kids',
  description:
    'Connect with nearby families based on shared interests, age, and availability. Secure, privacy-first playdate coordination platform.',
  keywords: ['playdate', 'kids', 'family', 'parenting', 'children', 'activities', 'local'],
  authors: [{ name: 'PlayConnect Team' }],
  openGraph: {
    title: 'PlayConnect - Find Perfect Playdates for Your Kids',
    description:
      'Connect with nearby families based on shared interests, age, and availability.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayConnect',
    description: 'Find perfect playdates for your kids',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
