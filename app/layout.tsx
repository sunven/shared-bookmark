import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { SWRProvider } from './swr-provider'
import { NavUser } from '@/components/nav-user'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'shared-bookmark',
  description: 'shared-bookmark',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-muted z-10">
          <div>sb</div>
          <SessionProvider session={session}>
            <NavUser />
          </SessionProvider>
        </header>
        <main className="mt-20">
          <SWRProvider>{children}</SWRProvider>
        </main>
        <Toaster />
      </body>
    </html>
  )
}
