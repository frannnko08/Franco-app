'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  const signup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(''); setSuccess('')
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); setLoading(false); return }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    if (data.session) { router.push('/'); return }
    setSuccess('Cuenta creada. Si pide confirmación, revisa tu email. Si no, ya puedes iniciar sesión.')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Franco</h1>
          <p className="text-gray-500 mt-1 text-sm">Crear cuenta</p>
        </div>
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}
        <form onSubmit={signup} className="space-y-4">
          <div className="relative">
            <FiMail className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required
              className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-3.5 text-gray-400" size={18} />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña (mín 6)" required
              className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2">
            {loading ? 'Creando…' : <>Crear cuenta <FiArrowRight size={18} /></>}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta? <Link href="/auth/login" className="text-blue-600 font-medium">Iniciar sesión</Link>
        </p>
      </div>
    </div>
  )
}
