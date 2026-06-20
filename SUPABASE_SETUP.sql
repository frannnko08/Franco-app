-- ============================================
-- FRANCO APP - Setup de base de datos
-- Copia TODO esto en Supabase → SQL Editor → Run
-- ============================================

CREATE TABLE public.daily_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  action TEXT NOT NULL,
  area TEXT NOT NULL,
  type TEXT NOT NULL,
  learning TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.monthly_indicators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  month DATE NOT NULL,
  ahorro_acumulado BIGINT,
  deuda_previsional BIGINT,
  deuda_cmr BIGINT,
  margen_empresa BIGINT,
  ingreso_personal BIGINT,
  dias_sin_revisar_caja INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  achieved BOOLEAN DEFAULT FALSE,
  date_achieved DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'waiting',
  date_submitted DATE DEFAULT CURRENT_DATE,
  date_review DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category TEXT NOT NULL,
  situation TEXT,
  error_or_event TEXT,
  learning TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE public.reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  reminder_type TEXT NOT NULL,
  day_of_week INTEGER,
  day_of_month INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  last_sent TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seguridad: cada usuario ve solo sus datos
ALTER TABLE public.daily_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_actions" ON public.daily_actions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_indicators" ON public.monthly_indicators FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_milestones" ON public.milestones FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_ideas" ON public.ideas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_lessons" ON public.lessons FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own_reminders" ON public.reminders FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
