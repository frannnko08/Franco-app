'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Shell from '@/components/Shell'
import { getCurrentUser, getDailyActions, getMilestones, getReminders } from '@/lib/supabase'
import { areaInfo, typeInfo } from '@/lib/constants'
import { FiArrowRight, FiBell, FiPlus } from 'react-icons/fi'

export default function Dashboard() {
  const [actions, setActions] = useState<any[]>([])
  const [reminders, setReminders] = useState<any[]>([])
  const [milestones, setMilestones] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const user = await getCurrentUser()
      if (!user) return
      const [a, r, m] = await Promise.all([
        getDailyActions(user.id, 30), getReminders(user.id), getMilestones(user.id),
      ])
      setActions(a.slice(0, 3)); setReminders(r); setMilestones(m); setLoading(false)
    }
    load()
  }, [])

  const achieved = milestones.filter(m => m.achieved).length

  return (
    <Shell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl p-8 mb-8 shadow-lg">
        <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">Pregunta Central</p>
        <h2 className="text-2xl font-bold leading-snug mb-3">¿Esta decisión me acerca o me aleja del Franco de 2036?</h2>
        <p className="text-blue-100 text-sm">Libertad financiera · empresa profesionalizada · carrera activa en el fútbol · tiempo para vivir.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Últimas acciones</h3>
            <Link href="/actions" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">Ver todas <FiArrowRight size={14} /></Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm">Cargando…</p> : actions.length ? (
            <div className="space-y-3">
              {actions.map(a => {
                const ai = areaInfo(a.area), ti = typeInfo(a.type)
                return (
                  <div key={a.id} className="border-l-4 border-blue-500 pl-3 py-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-medium text-sm">{a.action}</p>
                      <span className="text-base">{ti.icon}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${ai.color}`}>{ai.label}</span>
                      <span className="text-xs text-gray-400">{a.date}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : <p className="text-gray-400 text-sm">Sin acciones aún.</p>}
          <Link href="/actions" className="mt-5 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition">
            <FiPlus size={16} /> Registrar acción de hoy
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-lg">Recordatorios</h3>
            <Link href="/settings" className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">Editar <FiArrowRight size={14} /></Link>
          </div>
          {loading ? <p className="text-gray-400 text-sm">Cargando…</p> : reminders.length ? (
            <div className="space-y-2">
              {reminders.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiBell className="text-orange-500 mt-0.5 flex-shrink-0" size={16} />
                  <div><p className="font-medium text-sm">{r.title}</p>{r.description && <p className="text-xs text-gray-500">{r.description}</p>}</div>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-400 text-sm">Sin recordatorios. Configúralos en ajustes.</p>}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-lg">Progreso de hitos</h3>
          <Link href="/milestones" className="text-blue-600 hover:text-blue-800 text-sm">Ver hitos</Link>
        </div>
        <p className="text-3xl font-bold text-blue-600">{achieved}<span className="text-lg text-gray-400"> / {milestones.length || 0} completados</span></p>
      </div>
    </Shell>
  )
}
