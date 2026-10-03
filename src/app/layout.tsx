import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '@fontsource/barlow-condensed/600.css'
import '@fontsource/barlow-condensed/700.css'
import '@fontsource/barlow-condensed/800.css'
import '@fontsource-variable/public-sans'
import './globals.css'
import { FavoritesProvider } from '@/components/FavoritesProvider'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { SITE_NAME } from '@/lib/config'

const siteDescription = 'Browse sports, discover venues and events, and save the ones you like.'
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
const thumbnailImage = {
  url: '/image.png',
  width: 866,
  height: 650,
  alt: `${SITE_NAME} logo`,
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: `${SITE_NAME}: sports, venues and events`, template: `%s | ${SITE_NAME}` },
  description: siteDescription,
  openGraph: {
    title: `${SITE_NAME}: sports, venues and events`,
    description: siteDescription,
    siteName: SITE_NAME,
    type: 'website',
    images: [thumbnailImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME}: sports, venues and events`,
    description: siteDescription,
    images: [thumbnailImage],
  },
  other: {
    'telegram:title': `${SITE_NAME}: sports, venues and events`,
    'telegram:description': siteDescription,
    'telegram:image': '/image.png',
  },
}

export const viewport: Viewport = { themeColor: '#0d1117' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(() => { try { const theme = localStorage.getItem('sport-hub-theme'); if (theme === 'dark' || theme === 'light') document.documentElement.dataset.theme = theme; } catch (error) { console.error('Could not load the saved theme preference.', error); } })();",
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <FavoritesProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </FavoritesProvider>
      </body>
    </html>
  )
}
