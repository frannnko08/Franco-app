'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getMilestones, saveMilestone, toggleMilestone, deleteMilestone } from '@/lib/supabase'
import { FiPlus, FiTrash2, FiCheck } from 'react-icons/fi'

const CATS = [
  { value: 'empresa', label: 'Empresa', color: 'bg-blue-100 text-blue-800' },
  { value: 'futbol', label: 'Fútbol', color: 'bg-green-100 text-green-800' },
  { value: 'finanzas', label: 'Finanzas', color: 'bg-purple-100 text-purple-800' },
  { value: 'personal', label: 'Personal', color: 'bg-pink-100 text-pink-800' },
]

const SUGGESTIONS = [
  { title: 'Terminar INAF', category: 'futbol' },
  { title: 'Fondo de emergencia $3-4M', category: 'finanzas' },
  { title: 'Independizarme (mudanza)', category: 'personal' },
  { title: 'Convenio previsional firmado', category: 'empresa' },
  { title: 'Deuda previsional resuelta', category: 'empresa' },
  { title: 'Deuda CMR resuelta', category: 'finanzas' },
  { title: 'Datos de venta consolidados', category: 'empresa' },
  { title: 'Primer cargo profesional en fútbol', category: 'futbol' },
]

export default function MilestonesPage() {
  const [userId, setUserId] = useState('')
  const [items, setItems] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [cat, setCat] = useState('empresa')
  const [showAdd, setShowAdd] = useState(false)

  const load = async (uid: string) => setItems(await getMilestones(uid))

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id)
      let existing = await getMilestones(user.id)
      if (existing.length === 0) {
        for (const s of SUGGESTIONS) await saveMilestone(user.id, s.title, '', s.category)
        existing = await getMilestones(user.id)
      }
      setItems(existing)
    }
    init()
  }, [])

  const add = async () => {
    if (!title.trim()) return
    await saveMilestone(userId, title, '', cat); setTitle(''); setShowAdd(false); await load(userId)
  }
  const toggle = async (id: string, achieved: boolean) => { await toggleMilestone(id, !achieved); await load(userId) }
  const remove = async (id: string) => { await deleteMilestone(id); await load(userId) }

  const achieved = items.filter(i => i.achieved).length
  const pct = items.length ? Math.round((achieved / items.length) * 100) : 0
  const catInfo = (c: string) => CATS.find(x => x.value === c) || CATS[0]

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Hitos</h1>
      <p className="text-gray-500 mb-6">Tu progreso acumulado. Lo que vas conquistando.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold">{achieved} de {items.length} completados</span>
          <span className="text-2xl font-bold text-blue-600">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {items.map(m => {
          const ci = catInfo(m.category)
          return (
            <div key={m.id} className={`bg-white rounded-lg border p-4 flex items-center gap-3 group ${m.achieved ? 'opacity-60' : ''}`}>
              <button onClick={() => toggle(m.id, m.achieved)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${m.achieved ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 hover:border-blue-500'}`}>
                {m.achieved && <FiCheck size={14} />}
              </button>
              <div className="flex-1">
                <p className={`font-medium ${m.achieved ? 'line-through text-gray-400' : ''}`}>{m.title}</p>
                {m.achieved && m.date_achieved && <p className="text-xs text-green-600">✓ {m.date_achieved}</p>}
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${ci.color}`}>{ci.label}</span>
              <button onClick={() => remove(m.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><FiTrash2 size={15} /></button>
            </div>
          )
        })}
      </div>

      {showAdd ? (
        <div className="bg-white rounded-xl border p-5">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nuevo hito…" autoFocus
            className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex flex-wrap gap-2 mb-4">
            {CATS.map(c => (
              <button key={c.value} onClick={() => setCat(c.value)}
                className={`text-sm px-3 py-1.5 rounded-full border ${cat === c.value ? c.color + ' border-transparent' : 'border-gray-200 text-gray-500'}`}>{c.label}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={add} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg">Agregar</button>
            <button onClick={() => setShowAdd(false)} className="text-gray-500 py-2 px-5">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowAdd(true)} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-500 hover:text-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 transition">
          <FiPlus size={18} /> Agregar hito
        </button>
      )}
    </Shell>
  )
}
