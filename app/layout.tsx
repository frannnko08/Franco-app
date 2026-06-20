import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Franco · Sistema Operativo Personal',
  description: 'El puente entre el Franco de hoy y el Franco de 2036',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900">{children}</body>
    </html>
  )
}
