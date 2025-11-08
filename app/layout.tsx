import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ExportSettingsProvider } from '@/contexts/ExportSettingsContext';
import { ExportLimitProvider } from '@/contexts/ExportLimitContext';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Export Kindle Notes & Highlights - Free Kindle Notes Organizer',
  description: 'Export kindle notes and highlights from any book. Extract notes from My Clippings.txt including Amazon books, PDFs and EPUBs. Export to Markdown, Notion, Obsidian. Free tool.',
  keywords: [
    // English keywords (primary target)
    'export kindle notes',
    'export highlight kindle',
    'export notes books kindle',
    'kindle notes export',
    'kindle highlights export',
    'export kindle highlights to markdown',
    'my clippings txt export',
    'kindle notes organizer',
    'export kindle notes to notion',
    'export kindle notes to obsidian',
    'kindle clippings export',
    'extract kindle notes',
    // Spanish keywords (secondary)
    'exportar notas kindle',
    'exportar highlights kindle',
    'organizar notas kindle',
  ],
  authors: [{ name: 'Kindle Notes Organizer' }],
  creator: 'Kindle Notes Organizer',
  publisher: 'Kindle Notes Organizer',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://kindlenotes.com'),
  alternates: {
    canonical: '/',
    languages: {
      'es-ES': '/',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'Export Kindle Notes & Highlights - Free Kindle Notes Organizer',
    description: 'Export kindle notes and highlights from any book. Extract notes from My Clippings.txt including Amazon books, PDFs and EPUBs. Export to Markdown, Notion, Obsidian.',
    url: '/',
    siteName: 'Export Highlight - Kindle Notes Organizer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Export Kindle Notes and Highlights - Free Tool',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export Kindle Notes & Highlights - Free Tool',
    description: 'Export kindle notes and highlights from any book to Markdown, Notion, Obsidian. Free and unlimited.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || 'G-8GH0CLP0BS'} />
        <LanguageProvider>
          <ExportSettingsProvider>
            <ExportLimitProvider>
              <div className="flex flex-col min-h-screen">
                <Nav />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </ExportLimitProvider>
          </ExportSettingsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
