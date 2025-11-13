import { Analytics } from '@vercel/analytics/next'
import { Geist, Geist_Mono, Geist as V0_Font_Geist, Geist_Mono as V0_Font_Geist_Mono, Source_Serif_4 as V0_Font_Source_Serif_4 } from 'next/font/google'

import type { Metadata } from 'next'
import type React from 'react'

import { IOSNav } from '@/components/ios-nav'
import { UserProvider } from '@/contexts/user-context'
import { AuthGate } from '@/components/auth-gate'
import { Toaster } from '@/components/ui/toaster'

import './globals.css'



// Initialize fonts
const _geist = V0_Font_Geist({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700','800','900'] })
const _geistMono = V0_Font_Geist_Mono({ subsets: ['latin'], weight: ['100','200','300','400','500','600','700','800','900'] })
const _sourceSerif_4 = V0_Font_Source_Serif_4({ subsets: ['latin'], weight: ['200','300','400','500','600','700','800','900'] })

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'Multiplayer Guessing Game',
  description: 'A real-time multiplayer number guessing game',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        <UserProvider>
          <AuthGate>
            {children}
          </AuthGate>
          <IOSNav />
          <Toaster />
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
