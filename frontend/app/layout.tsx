import type { Metadata } from 'next'
import '@/styles/globals.css'
import { AuthProvider } from './components/auth-provider';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="no-scrollbar">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics/>
      </body>
    </html>
  )
}
