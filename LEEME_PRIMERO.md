# Franco App — Cómo arrancar (3 pasos, ~15 min)

Esta vez está TODO listo. Solo necesitas conectar tu Supabase.

---

## PASO 1 — Crear las tablas en Supabase (5 min)

1. Entra a **supabase.com** → abre tu proyecto (o crea uno nuevo: "New Project").
2. Menú izquierdo → **SQL Editor** → **New query**.
3. Abre el archivo **`SUPABASE_SETUP.sql`** de esta carpeta, copia TODO, pégalo y dale **Run**.
4. Debe decir "Success". Listo, ya tienes las tablas.

---

## PASO 2 — Conectar tus credenciales (2 min)

1. En Supabase: **Project Settings** (engranaje) → **API**.
2. Copia **Project URL** y **anon public key**.
3. En esta carpeta, renombra el archivo **`.env.local.example`** a **`.env.local`**.
4. Ábrelo y pega tus valores:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
```

---

## PASO 3 — Instalar y correr (5 min)

Abre la terminal EN esta carpeta y corre:

```bash
npm install
npm run dev
```

Abre **http://localhost:3000** en tu navegador.

1. Click "Crear cuenta" → registra tu email y contraseña.
2. ¡Listo! Ya estás dentro.

---

## (Opcional) Subir a internet con Vercel

1. Sube esta carpeta a un repo de GitHub.
2. En **vercel.com** → New Project → importa el repo.
3. En "Environment Variables" agrega las mismas dos del `.env.local`.
4. Deploy. Tendrás una URL pública para usar desde el teléfono.

---

## Qué incluye (TODO funcional)

- **Dashboard**: pregunta central + últimas acciones + recordatorios + progreso de hitos
- **Acciones**: registro diario (área + tipo + aprendizaje), filtros
- **Indicadores**: los 5 números clave, con comparación mes a mes e historial
- **Hitos**: lista con checkboxes y barra de progreso (viene con hitos sugeridos)
- **Ideas**: bandeja de espera de 14 días (anti-dispersión)
- **Lecciones**: registro de aprendizajes
- **Recordatorios**: con notificaciones del navegador + recordatorios sugeridos

---

## Notas

- Sobre las notificaciones: funcionan mientras la pestaña esté abierta en el navegador (activa el permiso en la página de Recordatorios). Para notificaciones tipo push aunque la app esté cerrada, se necesita un paso extra que podemos hacer después.
- Si Supabase pide "confirmar email" al registrarte y no quieres ese paso: en Supabase → Authentication → Providers → Email → desactiva "Confirm email".

¿Algo no funciona? Mándame el mensaje de error exacto y lo resolvemos.
