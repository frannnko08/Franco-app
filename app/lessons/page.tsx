'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getLessons, saveLesson, deleteLesson } from '@/lib/supabase'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

export default function LessonsPage() {
  const [userId, setUserId] = useState('')
  const [lessons, setLessons] = useState<any[]>([])
  const [category, setCategory] = useState('Empresa')
  const [situation, setSituation] = useState('')
  const [errorEvent, setErrorEvent] = useState('')
  const [learning, setLearning] = useState('')
  const [showForm, setShowForm] = useState(false)

  const load = async (uid: string) => setLessons(await getLessons(uid))

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id); await load(user.id)
    }
    init()
  }, [])

  const add = async () => {
    if (!learning.trim()) return
    await saveLesson(userId, category, situation, errorEvent, learning)
    setSituation(''); setErrorEvent(''); setLearning(''); setShowForm(false); await load(userId)
  }
  const remove = async (id: string) => { await deleteLesson(id); await load(userId) }

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Lecciones</h1>
      <p className="text-gray-500 mb-6">Tus aprendizajes. Uno de tus activos más valiosos a largo plazo.</p>

      {showForm ? (
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <h3 className="font-bold mb-4">Nueva lección</h3>
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Categoría (ej: Empresa, Finanzas)"
            className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={situation} onChange={e => setSituation(e.target.value)} placeholder="¿Cuál era la situación?"
            className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <input value={errorEvent} onChange={e => setErrorEvent(e.target.value)} placeholder="¿Qué error o evento ocurrió?"
            className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
          <textarea value={learning} onChange={e => setLearning(e.target.value)} placeholder="¿Qué aprendiste? (lo importante)" rows={2}
            className="w-full border rounded-lg px-4 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-blue-500" />
          <div className="flex gap-2">
            <button onClick={add} disabled={!learning.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg">Guardar lección</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 py-2.5 px-5">Cancelar</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setShowForm(true)} className="w-full border-2 border-dashed border-gray-200 hover:border-blue-400 text-gray-500 hover:text-blue-600 py-3 rounded-xl flex items-center justify-center gap-2 mb-8 transition">
          <FiPlus size={18} /> Registrar lección
        </button>
      )}

      <div className="space-y-3">
        {lessons.map(l => (
          <div key={l.id} className="bg-white rounded-xl border p-5 group">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{l.category}</span>
                <span className="text-xs text-gray-400">{l.date}</span>
              </div>
              <button onClick={() => remove(l.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={15} /></button>
            </div>
            {l.situation && <p className="text-sm text-gray-600"><span className="font-medium">Situación:</span> {l.situation}</p>}
            {l.error_or_event && <p className="text-sm text-gray-600 mt-1"><span className="font-medium">Qué pasó:</span> {l.error_or_event}</p>}
            <p className="mt-2 font-medium text-blue-900 bg-blue-50 rounded-lg px-3 py-2">📌 {l.learning}</p>
          </div>
        ))}
        {!lessons.length && <p className="text-gray-400 text-center py-8">Sin lecciones aún.</p>}
      </div>
    </Shell>
  )
}
