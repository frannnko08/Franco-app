'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FiHome, FiCheckSquare, FiBarChart2, FiAward, FiZap, FiBook, FiBell, FiLogOut, FiMenu, FiX } from 'react-icons/fi'

const NAV = [
  { icon: FiHome, label: 'Dashboard', href: '/' },
  { icon: FiCheckSquare, label: 'Acciones', href: '/actions' },
  { icon: FiBarChart2, label: 'Indicadores', href: '/indicators' },
  { icon: FiAward, label: 'Hitos', href: '/milestones' },
  { icon: FiZap, label: 'Ideas', href: '/ideas' },
  { icon: FiBook, label: 'Lecciones', href: '/lessons' },
  { icon: FiBell, label: 'Recordatorios', href: '/settings' },
]

export default function Shell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      setUser(user); setLoading(false)
    }
    check()
  }, [router])

  const logout = async () => { await supabase.auth.signOut(); router.push('/auth/login') }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">Cargando…</div>

  return (
    <div className="flex h-screen">
      <button onClick={() => setOpen(!open)} className="fixed top-4 left-4 z-50 md:hidden p-2 bg-white rounded-lg shadow">
        {open ? <FiX size={22} /> : <FiMenu size={22} />}
      </button>

      <nav className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white z-40 flex flex-col transition-transform md:relative md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold">Franco</h1>
          <p className="text-gray-400 text-xs mt-1">Sistema Operativo Personal</p>
        </div>
        <div className="px-4 flex-1 space-y-1">
          {NAV.map(item => {
            const active = pathname === item.href
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${active ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-300'}`}>
                <item.icon size={18} /><span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </div>
        <div className="p-4 border-t border-gray-800">
          <p className="text-xs text-gray-500 truncate mb-3 px-2">{user?.email}</p>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition">
            <FiLogOut size={16} /> Cerrar sesión
          </button>
        </div>
      </nav>

      {open && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setOpen(false)} />}

      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8 pt-16 md:pt-8">{children}</div>
      </main>
    </div>
  )
}
