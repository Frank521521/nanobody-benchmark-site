import type { Metadata } from 'next';
import './globals.css';

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const socialImage = new URL(`${basePath}/og.png`, siteOrigin).toString();
const canonicalUrl = new URL(`${basePath}/`, siteOrigin).toString();

export const metadata: Metadata = {
  title: 'Demo Preview | Nanobody Design Benchmark',
  description: 'Interface preview with fictional values for a future target-aware nanobody model benchmark. Not citable.',
  metadataBase: new URL(siteOrigin),
  alternates: { canonical: canonicalUrl },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  openGraph: {
    title: 'Demo Preview | Nanobody Design Benchmark',
    description: 'Framework preview with fictional values. Not a released benchmark result.',
    type: 'website',
    url: canonicalUrl,
    images: [{ url: socialImage, width: 1200, height: 630, alt: 'Nanobody Design Benchmark demo preview' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo Preview | Nanobody Design Benchmark',
    description: 'Framework preview with fictional values. Not a released benchmark result.',
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
