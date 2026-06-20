'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Franco</h1>
          <p className="text-gray-500 mt-1 text-sm">Sistema Operativo Personal</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        <form onSubmit={login} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
              className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" required
              className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2">
            {loading ? 'Cargando…' : <>Iniciar sesión <FiArrowRight size={18} /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿No tienes cuenta? <Link href="/auth/signup" className="text-blue-600 font-medium">Crear cuenta</Link>
        </p>
      </div>
    </div>
  )
}
