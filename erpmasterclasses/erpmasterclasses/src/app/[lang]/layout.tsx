import '../../styles/globals.css'
import { NextAuthProvider } from "@/lib/providers"
import { Locale, i18n } from '@/app/../../i18n.config'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'


// Assuming these components are adjusted to accept `lang` as a prop
import Header from '@/app/[lang]/components/Header'
import Footer from "@/app/[lang]/components/Footer"

const inter = Inter({ subsets: ['latin'] })
  
export async function generateStaticParams() {
  return i18n.locales.map(locale => ({ lang: locale }))
}

export const metadata: Metadata = {
  title: 'Website Title',
  description: 'Website Description',
  openGraph: {
    type: 'website',
    title: 'Website Title',
    description: 'Website Description',
    url: 'https://example.com',
    images: [],
    siteName: 'Website Name',
    locale: 'en',
    ttl: 30,
  }
}



export default function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {

  return (
    <html lang={params.lang} className={`${inter.className} h-full`}>
      <body className='flex min-h-full flex-col font-exo'>
        <NextAuthProvider>
          <Header lang={params.lang} />
          <main className='flex-grow'>{children}</main>
          <Footer lang={params.lang} />
        </NextAuthProvider>
      </body>
    </html>
  )
}
