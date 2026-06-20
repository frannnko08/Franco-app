'use client'

import { useEffect, useState } from 'react'
import Shell from '@/components/Shell'
import { getCurrentUser, getMonthlyIndicators, saveMonthlyIndicators } from '@/lib/supabase'
import { formatCLP } from '@/lib/constants'
import { FiSave, FiTrendingUp, FiTrendingDown } from 'react-icons/fi'

const FIELDS = [
  { key: 'ahorro_acumulado', label: 'Ahorro acumulado', goodUp: true },
  { key: 'deuda_previsional', label: 'Deuda previsional (empresa)', goodUp: false },
  { key: 'deuda_cmr', label: 'Deuda CMR (personal)', goodUp: false },
  { key: 'margen_empresa', label: 'Margen empresa / mes', goodUp: true },
  { key: 'ingreso_personal', label: 'Ingreso personal / mes', goodUp: true },
]

export default function IndicatorsPage() {
  const [userId, setUserId] = useState('')
  const [history, setHistory] = useState<any[]>([])
  const [values, setValues] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [savedMsg, setSavedMsg] = useState(false)
  const month = new Date().toISOString().slice(0, 7) + '-01'

  const load = async (uid: string) => {
    const data = await getMonthlyIndicators(uid)
    setHistory(data)
    const current = data.find((d: any) => d.month?.startsWith(month.slice(0, 7)))
    if (current) setValues(current)
  }

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUser(); if (!user) return
      setUserId(user.id); await load(user.id)
    }
    init()
  }, [])

  const save = async () => {
    setSaving(true)
    const clean: any = {}
    FIELDS.forEach(f => { clean[f.key] = values[f.key] ? parseInt(String(values[f.key]).replace(/\D/g, '')) : null })
    await saveMonthlyIndicators(userId, month, clean)
    await load(userId); setSaving(false); setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const prev = history.filter((h: any) => !h.month?.startsWith(month.slice(0, 7)))[0]

  return (
    <Shell>
      <h1 className="text-3xl font-bold mb-2">Indicadores</h1>
      <p className="text-gray-500 mb-8">Los 5 números que importan. Actualízalos cada mes.</p>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="font-bold mb-5">Este mes ({new Date().toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })})</h3>
        <div className="space-y-4">
          {FIELDS.map(f => (
            <div key={f.key} className="flex items-center gap-4">
              <label className="flex-1 text-sm font-medium text-gray-700">{f.label}</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400 text-sm">$</span>
                <input value={values[f.key] ? Number(String(values[f.key]).replace(/\D/g, '')).toLocaleString('es-CL') : ''}
                  onChange={e => setValues({ ...values, [f.key]: e.target.value })}
                  placeholder="0" className="w-44 border rounded-lg pl-7 pr-3 py-2 text-right outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving} className="mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-medium py-2.5 px-6 rounded-lg flex items-center gap-2 transition">
          <FiSave size={16} /> {saving ? 'Guardando…' : savedMsg ? '✓ Guardado' : 'Guardar mes'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {FIELDS.map(f => {
          const cur = values[f.key] ? Number(String(values[f.key]).replace(/\D/g, '')) : null
          const old = prev?.[f.key]
          const diff = cur !== null && old != null ? cur - old : null
          const good = diff !== null ? (f.goodUp ? diff >= 0 : diff <= 0) : null
          return (
            <div key={f.key} className="bg-white rounded-xl border p-5">
              <p className="text-xs text-gray-500 mb-1">{f.label}</p>
              <p className="text-2xl font-bold">{formatCLP(cur)}</p>
              {diff !== null && diff !== 0 && (
                <p className={`text-xs flex items-center gap-1 mt-1 ${good ? 'text-green-600' : 'text-red-500'}`}>
                  {diff > 0 ? <FiTrendingUp size={12} /> : <FiTrendingDown size={12} />}
                  {formatCLP(Math.abs(diff))} vs mes anterior
                </p>
              )}
            </div>
          )
        })}
      </div>

      {history.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border p-6 overflow-x-auto">
          <h3 className="font-bold mb-4">Historial</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-left text-gray-500 border-b">
              <th className="py-2 pr-4">Mes</th>
              {FIELDS.map(f => <th key={f.key} className="py-2 px-2 text-right">{f.label.split(' ')[0]}</th>)}
            </tr></thead>
            <tbody>
              {history.map((h: any) => (
                <tr key={h.id} className="border-b last:border-0">
                  <td className="py-2 pr-4 font-medium">{h.month?.slice(0, 7)}</td>
                  {FIELDS.map(f => <td key={f.key} className="py-2 px-2 text-right text-gray-600">{formatCLP(h[f.key])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Shell>
  )
}
