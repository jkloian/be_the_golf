import { ReactNode } from 'react'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col min-h-0">
        {children}
      </main>
      <Footer />
    </div>
  )
}

