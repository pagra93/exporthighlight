# 🎯 Consideraciones Específicas para tu Setup (Self-Hosted)

## 🏗️ Tu Infraestructura Actual

```
┌─────────────────────────────────────────────────┐
│  STACK ACTUAL                                   │
├─────────────────────────────────────────────────┤
│  Frontend:  Next.js 14 (App Router)            │
│  Auth:      Supabase Auth (self-hosted)        │
│  DB:        PostgreSQL (Supabase)              │
│  Deploy:    Coolify                             │
│  SMTP:      Banahosting (mail.exporthighlight)  │
│  Domain:    exporthighlight.com                 │
│  Supabase:  supabase.bayyana.es                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Variables de Entorno Específicas

### En Coolify (Auth Service - GoTrue)

Necesitas verificar/configurar estas variables en el servicio **auth**:

```bash
# JWT Configuration
GOTRUE_JWT_SECRET=<tu-secret-actual>
# ⚠️ IMPORTANTE: Este valor NO DEBE cambiar durante la migración
# Lo usaremos en NextAuth para firmar JWTs compatibles

# Site URL (para los emails)
GOTRUE_SITE_URL=https://exporthighlight.com

# SMTP (Banahosting)
GOTRUE_SMTP_HOST=mail.exporthighlight.com
GOTRUE_SMTP_PORT=587
GOTRUE_SMTP_USER=welcome@exporthighlight.com
GOTRUE_SMTP_PASS=<Pablo1993!>
GOTRUE_SMTP_ADMIN_EMAIL=welcome@exporthighlight.com
GOTRUE_SMTP_SENDER_NAME=ExportHighlight
```

### En tu Aplicación Next.js (.env.local)

```bash
# NextAuth
NEXTAUTH_URL=https://exporthighlight.com
NEXTAUTH_SECRET=<generar-nuevo-32-chars>

# SMTP (Banahosting - mismo que GoTrue)
SMTP_HOST=mail.exporthighlight.com
SMTP_PORT=587
SMTP_USER=noreply@exporthighlight.com
SMTP_PASS=<mismo-password-que-gotrue>
SMTP_FROM=noreply@exporthighlight.com

# Supabase (self-hosted)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=<obtener-de-coolify-o-studio>
SUPABASE_SERVICE_ROLE_KEY=<obtener-de-coolify-o-studio>
SUPABASE_JWT_SECRET=<mismo-que-gotrue-jwt-secret>
#                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#                    CRÍTICO: Debe ser IDÉNTICO
```

---

## 🔑 Cómo Obtener las Keys

### SUPABASE_JWT_SECRET (El más importante)

**Opción 1: Desde Coolify**
1. Ve a tu stack de Supabase en Coolify
2. Click en el servicio **auth** (GoTrue)
3. Pestaña **Environment Variables**
4. Busca: `JWT_SECRET` o `GOTRUE_JWT_SECRET`
5. Copia el valor COMPLETO

**Opción 2: Desde Supabase Studio**
1. Abre: `https://supabase.bayyana.es`
2. Ve a: **Settings** (si existe) o **API Docs**
3. Busca la sección de JWT
4. ⚠️ En self-hosted puede no estar visible, usa Opción 1

### SUPABASE_ANON_KEY

**En Supabase Studio:**
1. `https://supabase.bayyana.es`
2. **Settings** → **API** (o **API Docs** en self-hosted)
3. Busca: `anon key` o `public key`
4. Copia el JWT largo (empieza con `eyJ...`)

**Alternativamente en Coolify:**
1. Servicio **kong** o **meta**
2. Busca: `ANON_KEY` o `SUPABASE_ANON_KEY`

### SUPABASE_SERVICE_ROLE_KEY

**⚠️ NUNCA EXPONER AL CLIENTE**

**En Supabase Studio:**
1. Misma sección que `anon key`
2. Busca: `service_role key` o `service key`
3. Copia el JWT (más largo que anon)

**En Coolify:**
1. Servicio **kong** o **meta**
2. Busca: `SERVICE_ROLE_KEY` o `SERVICE_KEY`

---

## 🔄 Diferencias con Supabase Cloud

| Aspecto | Cloud | Self-Hosted (tu caso) |
|---------|-------|------------------------|
| **Configuración Auth** | UI Dashboard | Variables de entorno en Coolify |
| **SMTP Config** | UI Dashboard | GOTRUE_SMTP_* en auth service |
| **JWT Secret** | Auto-generado | Manual en GOTRUE_JWT_SECRET |
| **Email Templates** | UI Dashboard | ✅ Sí disponible en Studio |
| **Logs** | Dashboard integrado | Coolify logs por servicio |
| **Backups** | Automáticos | ⚠️ Manual (pg_dump) |

---

## 🚨 Riesgos Específicos de Self-Hosted

### 1. **Permisos de PostgreSQL**

En self-hosted, puede haber restricciones:

```sql
-- Verificar permisos actuales
SELECT current_user, session_user;

-- Si no eres superuser, pide ayuda para:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE SCHEMA IF NOT EXISTS next_auth;
GRANT ALL ON SCHEMA next_auth TO your_user;
```

### 2. **Schema `auth` puede estar bloqueado**

```sql
-- En self-hosted, auth.users puede no ser accesible
-- La migración lo tiene en cuenta y solo lee, no modifica
```

### 3. **Reinicio de Servicios**

Después de cambiar variables en Coolify:

```bash
# En Coolify UI:
1. Ve a tu stack de Supabase
2. Encuentra el servicio modificado (auth, kong, etc.)
3. Click en "Restart"
4. Espera ~30-60 segundos

# O desde CLI de Coolify (si tienes acceso):
coolify restart <stack-name> <service-name>
```

---

## 📊 Orden de Ejecución para Self-Hosted

```
┌─────────────────────────────────────────────────┐
│  PASO 1: Preparación en Coolify                │
├─────────────────────────────────────────────────┤
│  1. Obtener GOTRUE_JWT_SECRET                   │
│  2. Obtener anon_key y service_role_key         │
│  3. Verificar SMTP settings actuales            │
│  4. Backup de variables actuales (screenshot)   │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  PASO 2: Backup de Base de Datos               │
├─────────────────────────────────────────────────┤
│  # Desde servidor donde está PostgreSQL        │
│  docker exec <postgres-container> pg_dump ...  │
│                                                  │
│  # O desde Coolify (si tiene feature de backup)│
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  PASO 3: Ejecutar Migración SQL                │
├─────────────────────────────────────────────────┤
│  • En Supabase Studio → SQL Editor             │
│  • Ejecutar: 00_audit_pre_migration.sql        │
│  • Ejecutar: 01_migrate_to_nextauth.sql        │
│  • Ejecutar: 03_test_migration.sql             │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  PASO 4: Configurar Next.js                    │
├─────────────────────────────────────────────────┤
│  • Actualizar .env.local con keys              │
│  • Instalar dependencias NextAuth              │
│  • Configurar app/auth.ts                      │
│  • Actualizar lib/supabaseClient.ts            │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  PASO 5: Deploy y Test                         │
├─────────────────────────────────────────────────┤
│  • Deploy en staging                            │
│  • Test login/signup                            │
│  • Test RLS                                     │
│  • Monitor logs en Coolify                     │
└─────────────────────────────────────────────────┘
```

---

## 🔍 Cómo Hacer Backup en Self-Hosted

### Opción 1: Desde Coolify

```bash
# Si tienes acceso SSH al servidor de Coolify
ssh user@tu-servidor

# Encontrar el container de PostgreSQL
docker ps | grep postgres

# Hacer backup
docker exec <postgres-container-id> pg_dump -U postgres -d postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# Verificar backup
ls -lh backup_*.sql
```

### Opción 2: Desde Supabase Studio (si está disponible)

Algunos self-hosted tienen extensiones de backup. Verifica en Studio si hay opción de backup.

### Opción 3: Script automático

```bash
#!/bin/bash
# save as: backup_supabase.sh

CONTAINER=$(docker ps | grep postgres | awk '{print $1}')
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

docker exec $CONTAINER pg_dump -U postgres -d postgres > "$BACKUP_DIR/supabase_$DATE.sql"

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "supabase_*.sql" -mtime +7 -delete

echo "✓ Backup completado: supabase_$DATE.sql"
```

---

## 🧪 Tests Específicos para Self-Hosted

### Test 1: Verificar Conexión a DB

```bash
# En tu Next.js app
npm run dev

# En browser console:
fetch('/api/health')
  .then(r => r.json())
  .then(console.log)
```

### Test 2: Verificar JWT Secret es el mismo

```javascript
// En Node.js o browser console
const jwt = require('jsonwebtoken');

const payload = {
  sub: 'test-uuid',
  role: 'authenticated',
  aud: 'authenticated'
};

// Firmar con el secret de NextAuth
const token = jwt.sign(payload, process.env.SUPABASE_JWT_SECRET);

// Verificar que se puede decodificar
const decoded = jwt.verify(token, process.env.SUPABASE_JWT_SECRET);
console.log('✓ JWT válido:', decoded);
```

### Test 3: Verificar RLS con JWT

```sql
-- En Supabase Studio SQL Editor
SET request.jwt.claims = '{"sub": "uuid-de-usuario-real", "role": "authenticated"}';
SELECT * FROM public.books;
-- Debería retornar solo libros de ese usuario
```

---

## 💡 Tips para Self-Hosted

1. **Logs son tu amigo**
   - Coolify → tu servicio → Logs
   - Revisa `auth` service logs durante tests
   - Revisa `kong` service logs para errores de API

2. **Restart es barato**
   - Cambios en env vars → Restart service
   - No afecta la base de datos
   - ~30 segundos de downtime

3. **Studio es limitado en self-hosted**
   - Algunas features de Cloud no existen
   - Usa SQL Editor para todo lo avanzado
   - Consulta logs en Coolify, no en Studio

4. **Network entre servicios**
   - En Coolify, servicios se comunican por nombres
   - Verifica que `auth`, `kong`, `db` pueden comunicarse
   - Logs mostrarán errores de conexión

5. **Variables case-sensitive**
   - `GOTRUE_JWT_SECRET` ≠ `gotrue_jwt_secret`
   - Copia exacto como está en Coolify

---

## 📞 Checklist Específico para Tu Setup

```
┌─────────────────────────────────────────────────┐
│  ANTES DE MIGRAR                                │
├─────────────────────────────────────────────────┤
│  □ GOTRUE_JWT_SECRET copiado de Coolify auth   │
│  □ ANON_KEY obtenido de Studio o Coolify       │
│  □ SERVICE_ROLE_KEY obtenido (no exponer)      │
│  □ Backup de DB en self-hosted completado      │
│  □ Screenshot de variables actuales en Coolify │
│  □ SMTP Banahosting funcionando (test email)   │
│  □ Acceso a Coolify logs para debugging        │
│  □ Staging environment preparado                │
└─────────────────────────────────────────────────┘
```

---

## 🎯 Próximo Paso

1. **Ejecuta la auditoría** (`00_audit_pre_migration.sql`)
2. **Guarda los resultados** y compártelos conmigo
3. **Verifica que tienes todas las keys** (checklist arriba)
4. **Confirma que tienes backup**
5. **Me avisas y continuamos** con la migración

¿Listo para ejecutar la auditoría? 🚀
