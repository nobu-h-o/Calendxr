import '@/styles/globals.css'
import '@/styles/themes.css' // Import our custom theme CSS
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from '@/app/components/auth-provider'
import { ThemeProvider } from '@/app/components/theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Calendxr.com',
  description: 'Your smart calendar application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem
          themes={["light", "dark", "colorful"]}
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}