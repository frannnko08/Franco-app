import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Area = 'empresa' | 'futbol' | 'finanzas' | 'sistemas' | 'vida'
export type ActionType = 'mantener' | 'mejorar' | 'construir'
export type IdeaStatus = 'waiting' | 'reviewing' | 'approved' | 'rejected'

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// ---------- ACCIONES ----------
export const getDailyActions = async (userId: string, days = 30) => {
  const since = new Date(Date.now() - days * 86400000).toISOString().split('T')[0]
  const { data, error } = await supabase
    .from('daily_actions').select('*')
    .eq('user_id', userId).gte('date', since)
    .order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export const saveDailyAction = async (userId: string, action: string, area: Area, type: ActionType, learning?: string) => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('daily_actions')
    .insert([{ user_id: userId, date: today, action, area, type, learning: learning || null }]).select()
  if (error) throw error
  return data[0]
}

export const deleteDailyAction = async (id: string) => {
  const { error } = await supabase.from('daily_actions').delete().eq('id', id)
  if (error) throw error
}

// ---------- INDICADORES ----------
export const getMonthlyIndicators = async (userId: string) => {
  const { data, error } = await supabase.from('monthly_indicators')
    .select('*').eq('user_id', userId).order('month', { ascending: false }).limit(12)
  if (error) throw error
  return data || []
}

export const saveMonthlyIndicators = async (userId: string, month: string, indicators: any) => {
  const { data: existing } = await supabase.from('monthly_indicators')
    .select('id').eq('user_id', userId).eq('month', month).maybeSingle()
  if (existing) {
    const { data, error } = await supabase.from('monthly_indicators')
      .update(indicators).eq('id', existing.id).select()
    if (error) throw error
    return data[0]
  }
  const { data, error } = await supabase.from('monthly_indicators')
    .insert([{ user_id: userId, month, ...indicators }]).select()
  if (error) throw error
  return data[0]
}

// ---------- HITOS ----------
export const getMilestones = async (userId: string) => {
  const { data, error } = await supabase.from('milestones')
    .select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const saveMilestone = async (userId: string, title: string, description: string, category: string) => {
  const { data, error } = await supabase.from('milestones')
    .insert([{ user_id: userId, title, description, category }]).select()
  if (error) throw error
  return data[0]
}

export const toggleMilestone = async (id: string, achieved: boolean) => {
  const { data, error } = await supabase.from('milestones')
    .update({ achieved, date_achieved: achieved ? new Date().toISOString().split('T')[0] : null })
    .eq('id', id).select()
  if (error) throw error
  return data[0]
}

export const deleteMilestone = async (id: string) => {
  const { error } = await supabase.from('milestones').delete().eq('id', id)
  if (error) throw error
}

// ---------- IDEAS ----------
export const getIdeas = async (userId: string) => {
  const { data, error } = await supabase.from('ideas')
    .select('*').eq('user_id', userId).order('date_submitted', { ascending: false })
  if (error) throw error
  return (data || []).map((idea: any) => {
    const daysWaiting = Math.floor((Date.now() - new Date(idea.date_submitted).getTime()) / 86400000)
    if (idea.status === 'waiting' && daysWaiting >= 14) return { ...idea, status: 'reviewing', _autoReview: true }
    return idea
  })
}

export const saveIdea = async (userId: string, title: string, description: string) => {
  const { data, error } = await supabase.from('ideas')
    .insert([{ user_id: userId, title, description, status: 'waiting', date_submitted: new Date().toISOString().split('T')[0] }]).select()
  if (error) throw error
  return data[0]
}

export const updateIdeaStatus = async (id: string, status: IdeaStatus) => {
  const { data, error } = await supabase.from('ideas')
    .update({ status, date_review: new Date().toISOString().split('T')[0] }).eq('id', id).select()
  if (error) throw error
  return data[0]
}

export const deleteIdea = async (id: string) => {
  const { error } = await supabase.from('ideas').delete().eq('id', id)
  if (error) throw error
}

// ---------- LECCIONES ----------
export const getLessons = async (userId: string) => {
  const { data, error } = await supabase.from('lessons')
    .select('*').eq('user_id', userId).order('date', { ascending: false })
  if (error) throw error
  return data || []
}

export const saveLesson = async (userId: string, category: string, situation: string, errorOrEvent: string, learning: string) => {
  const today = new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('lessons')
    .insert([{ user_id: userId, date: today, category, situation, error_or_event: errorOrEvent, learning }]).select()
  if (error) throw error
  return data[0]
}

export const deleteLesson = async (id: string) => {
  const { error } = await supabase.from('lessons').delete().eq('id', id)
  if (error) throw error
}

// ---------- RECORDATORIOS ----------
export const getReminders = async (userId: string) => {
  const { data, error } = await supabase.from('reminders')
    .select('*').eq('user_id', userId).eq('is_active', true).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export const saveReminder = async (userId: string, reminder: any) => {
  const { data, error } = await supabase.from('reminders')
    .insert([{ user_id: userId, ...reminder }]).select()
  if (error) throw error
  return data[0]
}

export const deleteReminder = async (id: string) => {
  const { error } = await supabase.from('reminders').delete().eq('id', id)
  if (error) throw error
}
