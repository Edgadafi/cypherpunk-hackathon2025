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
  title: 'PrismaFi | Your own Prediction Markets on Solana',
  description:
    'Generate your prediction market in 3 steps. Put your price for truth. 95% privacy with on-chain resolution and only 0.5% fees.',
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
