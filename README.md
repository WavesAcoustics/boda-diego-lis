# Diego & Lis

Landing page editorial de boda con RSVP, mesa de regalos, pagos con MercadoPago Checkout Pro, Supabase DB/Auth y dashboard privado para administración.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase DB + Auth + RLS
- MercadoPago Checkout Pro
- Vercel

## Instalación

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

Validación local:

```bash
npm run lint
npm run build
```

## Variables de entorno

Copia `.env.example` a `.env.local`:

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
MERCADOPAGO_ACCESS_TOKEN=your_mercadopago_access_token
MERCADOPAGO_WEBHOOK_SECRET=optional_webhook_secret
```

Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` ni `MERCADOPAGO_ACCESS_TOKEN` en el cliente.
No subas `.env.local` a GitHub; ya está protegido en `.gitignore`.

Sin `.env.local`, el home muestra regalos demo y un aviso de configuración en desarrollo. RSVP, checkout, admin y webhooks necesitan variables reales.

## Supabase

1. Crea un proyecto en Supabase.
2. En SQL Editor ejecuta `supabase/schema.sql`.
3. Ejecuta `supabase/seed.sql` para cargar regalos demo.
4. Crea un usuario admin en Supabase Auth.
5. Agrega ese usuario a `admin_users`:

```sql
insert into public.admin_users (user_id, email)
select id, email
from auth.users
where email = 'admin@example.com';
```

El sitio público puede leer categorías y regalos activos. RSVP entra por API backend. Las tablas privadas solo son visibles para usuarios en `admin_users`.

## Cómo probar RSVP

1. Configura Supabase y ejecuta schema + seed.
2. Reinicia `npm run dev`.
3. Abre `http://localhost:3000/#rsvp`.
4. Envía nombre y confirmación individual.
5. Verifica la fila en `public.guests`.

Si falla, la UI muestra el error real devuelto por Supabase o la variable faltante.

## Cómo probar regalos

1. Confirma que `public.gifts` tenga regalos activos del seed.
2. Abre `http://localhost:3000/#regalos`.
3. Elige un regalo monetario y agrega monto + mensaje.
4. La API valida `gift_id` contra Supabase y crea una contribución `pending`.
5. Después redirige a Checkout Pro. En local usa `sandbox_init_point` cuando MercadoPago lo devuelve.

## MercadoPago

1. Crea una aplicación en MercadoPago Developers.
2. Copia el Access Token en `MERCADOPAGO_ACCESS_TOKEN`.
3. Configura el webhook:

```txt
https://tu-dominio.com/api/webhooks/mercadopago
```

Eventos recomendados: `payment`.

Si defines `MERCADOPAGO_WEBHOOK_SECRET`, configura la URL con secreto:

```txt
https://tu-dominio.com/api/webhooks/mercadopago?secret=tu_secreto
```

El flujo es:

1. El invitado elige regalo y monto.
2. `/api/checkout` valida el regalo y crea una contribución `pending`.
3. Se crea una preferencia Checkout Pro y se redirige a MercadoPago.
4. El webhook consulta el `payment_id` directamente en MercadoPago.
5. Solo si el pago es `approved` y el monto coincide, se marca la contribución como aprobada y se suma al regalo.
6. `payment_events.mp_payment_id` evita duplicados.

Un pago nunca se marca como `approved` desde el cliente ni desde el regreso visual de MercadoPago; solo el webhook lo cambia tras consultar el `payment_id`.

## Cómo probar admin

1. Crea un usuario en Supabase Auth.
2. Inserta ese usuario en `public.admin_users`.
3. Abre `http://localhost:3000/admin/login`.
4. Inicia sesión.
5. Revisa RSVPs, aportaciones, regalos, CRUD y export CSV.

## Admin

Ruta privada:

```txt
/admin
```

Incluye:

- Login con Supabase Auth
- RSVPs
- Aportaciones y mensajes
- Total recaudado
- Regalos completados
- Crear, editar y desactivar regalos
- Exportar CSV desde `/api/admin/export`

## Mapas

Datos temporales en la UI:

- Fecha: 12 de septiembre de 2026
- Misa: `https://maps.app.goo.gl/jSJNTVuCUEWbD18v9`
- Recepción: `https://maps.app.goo.gl/LVjtXEgLdXY7HBGZ9`

Los links cortos de Google Maps funcionan como botones externos. Para embeber mapas exactos se necesita una URL de Google Maps Embed, dirección completa o Place ID de cada sede.

## Deploy en Vercel

1. Antes de subir, corre `npm run lint` y `npm run build`.
2. Sube el repo a GitHub.
3. Importa el proyecto en Vercel desde GitHub.
4. En Vercel, agrega todas las variables de entorno de `.env.example`.
5. Verifica que `NEXT_PUBLIC_SITE_URL` sea el dominio final, por ejemplo `https://tudominio.com`.
6. En Supabase, confirma que el schema y los seeds estén aplicados.
7. En MercadoPago, actualiza la URL del webhook al dominio de Vercel:

```txt
https://tu-dominio.com/api/webhooks/mercadopago
```

8. Haz redeploy en Vercel.
9. Ejecuta un pago de prueba y revisa `payment_events` en Supabase.

## GitHub

No subas secretos. Antes del primer commit revisa que `.env.local` no aparezca en `git status`.

Primer commit recomendado:

```bash
git init
git add .
git status
git commit -m "Initial wedding landing"
```

Conectar con GitHub:

```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

## Dominio propio

1. En Vercel entra a Project Settings > Domains.
2. Agrega tu dominio.
3. Configura los DNS que indique Vercel.
4. Cambia `NEXT_PUBLIC_SITE_URL` al dominio propio.
5. Redeploy.

## Notas de producción

- Activa credenciales productivas de MercadoPago solo cuando terminen las pruebas.
- Revisa que RLS esté activo después de correr el esquema.
- Mantén el dashboard limitado a usuarios insertados en `admin_users`.
- Personaliza fecha, dirección, copy e imagen editorial en los componentes de `components/`.
