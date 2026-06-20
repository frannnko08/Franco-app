export const AREAS = [
  { value: 'empresa', label: 'Empresa', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  { value: 'futbol', label: 'Fútbol', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  { value: 'finanzas', label: 'Finanzas', color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-500' },
  { value: 'sistemas', label: 'Sistemas', color: 'bg-orange-100 text-orange-800', dot: 'bg-orange-500' },
  { value: 'vida', label: 'Vida Personal', color: 'bg-pink-100 text-pink-800', dot: 'bg-pink-500' },
]

export const ACTION_TYPES = [
  { value: 'mantener', label: 'Mantener', icon: '🔄' },
  { value: 'construir', label: 'Construir', icon: '🏗️' },
  { value: 'mejorar', label: 'Mejorar', icon: '⬆️' },
]

export const areaInfo = (area: string) => AREAS.find(a => a.value === area) || AREAS[0]
export const typeInfo = (type: string) => ACTION_TYPES.find(t => t.value === type) || ACTION_TYPES[0]

export const formatCLP = (n: number | null | undefined) => {
  if (n === null || n === undefined || isNaN(n)) return '—'
  return '$' + n.toLocaleString('es-CL')
}
