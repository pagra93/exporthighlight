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
  title: 'Exporta Highlights de Kindle - Organiza tus notas y subrayados gratis',
  description: 'Extrae y organiza todos tus highlights de Kindle, incluyendo libros de fuentes externas. Convierte My Clippings.txt en notas organizadas y exportables a Markdown. Gratis y sin límites.',
  keywords: [
    'exportar highlights kindle',
    'organizar notas kindle', 
    'my clippings txt',
    'extraer subrayados kindle',
    'kindle notes organizer',
    'exportar notas kindle a markdown',
    'organizar biblioteca kindle',
    'herramienta kindle highlights',
    'kindle highlights gratis',
    'notas kindle notion obsidian'
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
    title: 'Exporta Highlights de Kindle - Organiza tus notas gratis',
    description: 'Extrae todos tus highlights de Kindle, incluyendo libros de fuentes externas. Gratis y sin límites.',
    url: '/',
    siteName: 'Kindle Notes Organizer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Kindle Notes Organizer - Exporta tus highlights',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Exporta Highlights de Kindle - Organiza tus notas gratis',
    description: 'Extrae todos tus highlights de Kindle, incluyendo libros de fuentes externas.',
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
