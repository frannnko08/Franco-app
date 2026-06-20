'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getReminders, saveReminder, deleteReminder } from '@/lib/supabase'
import { FiPlus, FiTrash2, FiBell } from 'react-icons/fi'

const DAYS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const PRESETS = [
  { title: 'Revisar caja de la empresa', description: '¿Se pagó el mes corriente de imposiciones?', reminder_type: 'weekly', day_of_week: 5 },
  { title: 'Revisión semanal', description: '¿Qué hice bien? ¿Qué corregir? ¿Qué aprendí?', reminder_type: 'weekly', day_of_week: 0 },
  { title: 'Actualizar indicadores', description: 'Ahorro, deudas, margen, ingreso', reminder_type: 'monthly', day_of_month: 1 },
  { title: 'Abonar al convenio previsional', description: 'Pago mensual de la deuda (desde el margen)', reminder_type: 'monthly', day_of_month: 5 },
]

export default function SettingsPage() {
  const [userId, setUserId] = useState('')
  const [reminders, setReminders] = useState<any[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [rtype, setRtype] = useState('weekly')
  const [dow, setDow] = useState(5)
  const [dom, setDom] = useState(1)
  const [notifPerm, setNotifPerm] = useState('default')

  const load = async (uid: string) => setReminders(await getReminders(uid))

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id); await load(user.id)
      if ('Notification' in window) setNotifPerm(Notification.permission)
    }
    init()
  }, [])

  const requestNotif = async () => {
    if ('Notification' in window) {
      const p = await Notification.requestPermission()
      setNotifPerm(p)
      if (p === 'granted') new Notification('Franco App', { body: '¡Notificaciones activadas! Te recordaré tus deberes.' })
    }
  }

  const add = async (preset?: any) => {
    const r = preset || { title, description: desc, reminder_type: rtype, day_of_week: rtype === 'weekly' ? dow : null, day_of_month: rtype === 'monthly' ? dom : null }
    if (!r.title?.trim()) return
    await saveReminder(userId, r); setTitle(''); setDesc(''); await load(userId)
  }
  const remove = async (id: string) => { await deleteReminder(id); await load(userId) }

  const existingTitles = reminders.map(r => r.title)
  const availablePresets = PRESETS.filter(p => !existingTitles.includes(p.title))

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Recordatorios</h1>
      <p className="text-gray-500 mb-6">Tu sistema de alerta. Para no olvidar los deberes que importan.</p>

      <div className={`rounded-xl border p-5 mb-8 ${notifPerm === 'granted' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
        <div className="flex items-start gap-3">
          <FiBell className={notifPerm === 'granted' ? 'text-green-600 mt-1' : 'text-yellow-600 mt-1'} size={20} />
          <div className="flex-1">
            <p className="font-medium">{notifPerm === 'granted' ? 'Notificaciones activadas' : 'Activa las notificaciones del navegador'}</p>
            <p className="text-sm text-gray-600 mt-1">{notifPerm === 'granted' ? 'Recibirás avisos de tus recordatorios.' : 'Para que la app pueda recordarte tus deberes en el navegador.'}</p>
            {notifPerm !== 'granted' && <button onClick={requestNotif} className="mt-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium py-2 px-4 rounded-lg">Activar notificaciones</button>}
          </div>
        </div>
      </div>

      {availablePresets.length > 0 && (
        <div className="mb-8">
          <h3 className="font-bold mb-3">Recordatorios sugeridos</h3>
          <div className="space-y-2">
            {availablePresets.map((p, i) => (
              <div key={i} className="bg-white border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.description} · {p.reminder_type === 'weekly' ? `cada ${DAYS[p.day_of_week!]}` : `día ${p.day_of_month} del mes`}</p>
                </div>
                <button onClick={() => add(p)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><FiPlus size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-bold mb-3">Tus recordatorios</h3>
        {reminders.length ? (
          <div className="space-y-2">
            {reminders.map(r => (
              <div key={r.id} className="bg-white border rounded-lg p-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <FiBell className="text-orange-500" size={16} />
                  <div>
                    <p className="font-medium text-sm">{r.title}</p>
                    <p className="text-xs text-gray-500">{r.description} · {r.reminder_type === 'weekly' ? `cada ${DAYS[r.day_of_week]}` : `día ${r.day_of_month} del mes`}</p>
                  </div>
                </div>
                <button onClick={() => remove(r.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><FiTrash2 size={15} /></button>
              </div>
            ))}
          </div>
        ) : <p className="text-gray-400 text-sm">Sin recordatorios. Agrega de los sugeridos o crea uno.</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="font-bold mb-4">Crear recordatorio personalizado</h3>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título"
          className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripción (opcional)"
          className="w-full border rounded-lg px-4 py-2.5 mb-3 outline-none focus:ring-2 focus:ring-blue-500" />
        <div className="flex gap-2 mb-3">
          <button onClick={() => setRtype('weekly')} className={`text-sm px-4 py-2 rounded-lg ${rtype === 'weekly' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Semanal</button>
          <button onClick={() => setRtype('monthly')} className={`text-sm px-4 py-2 rounded-lg ${rtype === 'monthly' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>Mensual</button>
        </div>
        {rtype === 'weekly' ? (
          <select value={dow} onChange={e => setDow(Number(e.target.value))} className="border rounded-lg px-4 py-2.5 mb-4 w-full">
            {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
          </select>
        ) : (
          <select value={dom} onChange={e => setDom(Number(e.target.value))} className="border rounded-lg px-4 py-2.5 mb-4 w-full">
            {Array.from({ length: 28 }, (_, i) => i + 1).map(d => <option key={d} value={d}>Día {d}</option>)}
          </select>
        )}
        <button onClick={() => add()} disabled={!title.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2">
          <FiPlus size={16} /> Crear
        </button>
      </div>
    </Shell>
  )
}
