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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: { default: `${SITE_NAME}: sports, venues and events`, template: `%s | ${SITE_NAME}` },
  description: 'Browse sports, discover venues and events, and save the ones you like.',
  openGraph: { siteName: SITE_NAME, type: 'website' },
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
