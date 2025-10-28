import type { Metadata } from 'next'
import { Inter, Prompt } from 'next/font/google'
import './globals.css'
import WalletProvider from '@/providers/WalletProvider'
import { ThemeProvider } from '@/contexts/ThemeContext'
import './suppress-wallet-errors'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const prompt = Prompt({
  variable: '--font-prompt',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PrismaFi | Transparent Prediction Markets for Social Impact',
  description:
    'Building transparent prediction markets for social impact across LATAM. Turn accountability into a public good on Solana.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0B0E13' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'PrismaFi',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${prompt.variable} antialiased`}>
        <ThemeProvider>
          <WalletProvider>{children}</WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
