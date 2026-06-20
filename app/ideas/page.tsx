'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getIdeas, saveIdea, updateIdeaStatus, deleteIdea } from '@/lib/supabase'
import { FiPlus, FiTrash2, FiClock, FiCheck, FiX } from 'react-icons/fi'

export default function IdeasPage() {
  const [userId, setUserId] = useState('')
  const [ideas, setIdeas] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const load = async (uid: string) => setIdeas(await getIdeas(uid))

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id); await load(user.id)
    }
    init()
  }, [])

  const add = async () => {
    if (!title.trim()) return
    await saveIdea(userId, title, desc); setTitle(''); setDesc(''); await load(userId)
  }
  const setStatus = async (id: string, status: any) => { await updateIdeaStatus(id, status); await load(userId) }
  const remove = async (id: string) => { await deleteIdea(id); await load(userId) }

  const daysLeft = (idea: any) => {
    const d = 14 - Math.floor((Date.now() - new Date(idea.date_submitted).getTime()) / 86400000)
    return d > 0 ? d : 0
  }

  const waiting = ideas.filter(i => i.status === 'waiting')
  const reviewing = ideas.filter(i => i.status === 'reviewing')
  const decided = ideas.filter(i => i.status === 'approved' || i.status === 'rejected')

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Ideas</h1>
      <p className="text-gray-500 mb-6">Toda idea espera 14 días antes de evaluarse. Evita la dispersión.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="font-bold mb-4">Nueva idea (va a la bandeja de espera)</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título de la idea"
          className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción (opcional)" rows={2}
          className="w-full border rounded-lg px-4 py-2.5 mb-4 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
        <button onClick={add} disabled={!title.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2">
          <FiPlus size={16} /> Guardar en espera
        </button>
      </div>

      {reviewing.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-orange-600 mb-3 flex items-center gap-2"><FiClock size={16} /> Listas para revisar ({reviewing.length})</h3>
          <div className="space-y-2">
            {reviewing.map(i => (
              <div key={i.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="font-medium">{i.title}</p>
                {i.description && <p className="text-sm text-gray-600 mt-1">{i.description}</p>}
                <p className="text-xs text-orange-600 mt-1">Esperó sus 14 días. ¿Sigue valiendo la pena?</p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setStatus(i.id, 'approved')} className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1"><FiCheck size={14} /> Aprobar</button>
                  <button onClick={() => setStatus(i.id, 'rejected')} className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1"><FiX size={14} /> Descartar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {waiting.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold text-gray-700 mb-3">En espera ({waiting.length})</h3>
          <div className="space-y-2">
            {waiting.map(i => (
              <div key={i.id} className="bg-white border rounded-lg p-4 flex items-start justify-between group">
                <div>
                  <p className="font-medium">{i.title}</p>
                  {i.description && <p className="text-sm text-gray-500 mt-1">{i.description}</p>}
                  <p className="text-xs text-gray-400 mt-1">Faltan {daysLeft(i)} días para revisar</p>
                </div>
                <button onClick={() => remove(i.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {decided.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-700 mb-3">Decididas</h3>
          <div className="space-y-2">
            {decided.map(i => (
              <div key={i.id} className="bg-gray-50 border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${i.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'}`}>
                    {i.status === 'approved' ? '✓ Aprobada' : '✕ Descartada'}
                  </span>
                  <p className={`font-medium ${i.status === 'rejected' ? 'line-through text-gray-400' : ''}`}>{i.title}</p>
                </div>
                <button onClick={() => remove(i.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={15} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!ideas.length && <p className="text-gray-400 text-center py-8">Sin ideas aún. Captura la primera arriba.</p>}
    </Shell>
  )
}
