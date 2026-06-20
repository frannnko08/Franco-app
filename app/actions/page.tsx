'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getDailyActions, saveDailyAction, deleteDailyAction } from '@/lib/supabase'
import { AREAS, ACTION_TYPES, areaInfo, typeInfo } from '@/lib/constants'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export default function ActionsPage() {
  const [actions, setActions] = useState<any[]>([])
  const [userId, setUserId] = useState('')
  const [action, setAction] = useState('')
  const [area, setArea] = useState('empresa')
  const [type, setType] = useState('construir')
  const [learning, setLearning] = useState('')
  const [filter, setFilter] = useState('all')
  const [saving, setSaving] = useState(false)

  const load = async (uid: string) => setActions(await getDailyActions(uid, 60))

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id); await load(user.id)
    }
    init()
  }, [])

  const submit = async () => {
    if (!action.trim()) return
    setSaving(true)
    await saveDailyAction(userId, action, area as any, type as any, learning)
    setAction(''); setLearning(''); await load(userId); setSaving(false)
  }

  const remove = async (id: string) => { await deleteDailyAction(id); await load(userId) }

  const filtered = filter === 'all' ? actions : actions.filter(a => a.area === filter)
  const counts = AREAS.map(a => ({ ...a, count: actions.filter(x => x.area === a.value).length }))

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Acciones</h1>
      <p className="text-gray-500 mb-8">Registra lo que hiciste. Máximo lo importante, no todo.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="font-bold mb-4">Registrar acción de hoy</h3>
        <input value={action} onChange={e => setAction(e.target.value)} placeholder="¿Qué hiciste hoy?"
          className="w-full border rounded-lg px-4 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Área</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {AREAS.map(a => (
                <button key={a.value} onClick={() => setArea(a.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${area === a.value ? a.color + ' border-transparent font-medium' : 'border-gray-200 text-gray-500'}`}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Tipo</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ACTION_TYPES.map(t => (
                <button key={t.value} onClick={() => setType(t.value)}
                  className={`text-sm px-3 py-1.5 rounded-full border transition ${type === t.value ? 'bg-gray-900 text-white border-transparent' : 'border-gray-200 text-gray-500'}`}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <textarea value={learning} onChange={e => setLearning(e.target.value)} placeholder="¿Qué aprendiste? (opcional)"
          className="w-full border rounded-lg px-4 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-blue-500 text-sm" rows={2} />
        <button onClick={submit} disabled={saving || !action.trim()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition">
          <FiPlus size={16} /> {saving ? 'Guardando…' : 'Guardar'}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setFilter('all')} className={`text-sm px-3 py-1.5 rounded-full ${filter === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'}`}>Todas ({actions.length})</button>
        {counts.map(a => (
          <button key={a.value} onClick={() => setFilter(a.value)} className={`text-sm px-3 py-1.5 rounded-full ${filter === a.value ? a.color : 'bg-gray-100 text-gray-600'}`}>{a.label} ({a.count})</button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map(a => {
          const ai = areaInfo(a.area), ti = typeInfo(a.type)
          return (
            <div key={a.id} className="bg-white rounded-lg border p-4 flex items-start justify-between gap-3 group">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{ti.icon}</span>
                  <p className="font-medium">{a.action}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${ai.color}`}>{ai.label}</span>
                  <span className="text-xs text-gray-400">{a.date}</span>
                </div>
                {a.learning && <p className="text-sm text-gray-600 mt-2 italic">📌 {a.learning}</p>}
              </div>
              <button onClick={() => remove(a.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"><FiTrash2 size={16} /></button>
            </div>
          )
        })}
        {!filtered.length && <p className="text-gray-400 text-center py-8">Sin acciones en esta categoría.</p>}
      </div>
    </Shell>
  )
}
