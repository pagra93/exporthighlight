# ✅ Checklist de Migración - Supabase Auth → NextAuth

Marca cada casilla cuando completes el paso. Copia este archivo a `CHECKLIST_PROGRESS.md` y edítalo localmente.

---

## 📋 FASE 0: PREPARACIÓN

### 📖 Lectura de Documentación
- [ ] Leído `EXECUTIVE_SUMMARY.md` (5 min)
- [ ] Leído `QUICK_START.md` (10 min)
- [ ] Leído `SELF_HOSTED_GUIDE.md` (10 min)
- [ ] (Opcional) Leído `README_MIGRATION.md` (20 min)

### 🔑 Obtener Credenciales

#### En Coolify:
- [ ] Acceder a Coolify: `https://_______________`
- [ ] Ir a stack de Supabase
- [ ] Entrar al servicio **auth** (GoTrue)
- [ ] Copiar `GOTRUE_JWT_SECRET`: `________________________________`
- [ ] Screenshot de variables guardado: `□ Sí`

#### En Supabase Studio:
- [ ] Acceder a Studio: `https://supabase.bayyana.es`
- [ ] Ir a Settings → API (o API Docs)
- [ ] Copiar `ANON_KEY`: `________________________________`
- [ ] Copiar `SERVICE_ROLE_KEY`: `________________________________`

### 💾 Backup

#### Opción 1: Manual
```bash
# Comando utilizado:
docker exec <container> pg_dump -U postgres -d postgres > backup_YYYYMMDD.sql

# Archivo generado: _______________________________
# Tamaño del backup: ____________ MB
# Fecha del backup: ____________
```
- [ ] Backup completado
- [ ] Backup verificado (archivo no vacío)
- [ ] Backup guardado en lugar seguro

#### Opción 2: Desde Coolify
- [ ] Backup ejecutado desde Coolify UI
- [ ] Backup descargado localmente

### 🎯 Preparación del Entorno
- [ ] Staging preparado (NO producción)
- [ ] Acceso a logs de Coolify verificado
- [ ] Editor SQL listo (Supabase Studio)
- [ ] Terminal/SSH disponible (si necesario)

---

## 📊 FASE 1: MIGRACIÓN SQL

### Paso 1: Auditoría Previa
- [ ] Archivo `00_audit_pre_migration.sql` abierto en Studio
- [ ] Script ejecutado completamente
- [ ] Resultados guardados en: `audit_results_YYYYMMDD.txt`

#### Resultados de la Auditoría:
```
Total usuarios: __________
Usuarios confirmados: __________
Total libros: __________
Total highlights: __________
Foreign Keys detectadas: __________
Políticas RLS detectadas: __________
Datos huérfanos: __________
```
- [ ] Resultados revisados y son correctos

### Paso 2: Ejecutar Migración
- [ ] Archivo `01_migrate_to_nextauth.sql` abierto en Studio
- [ ] Script ejecutado completamente
- [ ] Sin errores en la ejecución
- [ ] Mensaje visto: "✓ Migración completada exitosamente"

#### Logs de la Migración:
```
NOTICE: Usuarios en auth.users (confirmados): __________
NOTICE: Usuarios migrados a next_auth.users: __________
NOTICE: Foreign Keys configuradas: __________
NOTICE: Políticas RLS: __________
```
- [ ] Conteos coinciden (auth.users ≈ next_auth.users)

### Paso 3: Verificar Migración
- [ ] Archivo `03_test_migration.sql` abierto en Studio
- [ ] Script ejecutado completamente
- [ ] Resultados de tests guardados en: `test_results_YYYYMMDD.txt`

#### Resultados de Tests:
- [ ] TEST 1: ✓ Schema next_auth existe
- [ ] TEST 2: ✓ Migración correcta
- [ ] TEST 3: ✓ FK correcta (2 tablas)
- [ ] TEST 4: ✓ 4 políticas por tabla (2 tablas)
- [ ] TEST 5: ✓ RLS habilitado (2 tablas)
- [ ] TEST 6: ✓ Sin datos huérfanos (2 tablas)
- [ ] TEST 7: ✓ Permisos configurados
- [ ] TEST 8: ✓ Índices existen
- [ ] TEST 9: ✓ Función current_user_id existe
- [ ] TEST 10: ✓ Triggers existen

### Paso 4: Verificación Manual
- [ ] Usuarios en `next_auth.users` verificados manualmente
- [ ] Foreign Keys verificadas:
  - [ ] `books.user_id` → `next_auth.users.id`
  - [ ] `highlights.user_id` → `next_auth.users.id`
- [ ] Políticas RLS verificadas:
  - [ ] 4 políticas en `books` (SELECT, INSERT, UPDATE, DELETE)
  - [ ] 4 políticas en `highlights` (SELECT, INSERT, UPDATE, DELETE)

### Paso 5: Documentar Resultados
```
Fecha de migración: ____________
Hora de inicio: ____________
Hora de fin: ____________
Duración total: ____________
Entorno: □ Staging  □ Producción
Resultado: □ Éxito  □ Con errores  □ Fallido
```

---

## 🔧 FASE 2: CONFIGURAR NEXTAUTH

### Paso 1: Instalar Dependencias
```bash
npm install next-auth @auth/supabase-adapter jsonwebtoken nodemailer
npm install -D @types/jsonwebtoken @types/nodemailer
```
- [ ] Dependencias instaladas
- [ ] `package.json` actualizado

### Paso 2: Configurar Variables de Entorno
- [ ] Archivo `.env.local` creado/actualizado
- [ ] Variables agregadas:

```bash
# NextAuth
NEXTAUTH_URL=https://exporthighlight.com
NEXTAUTH_SECRET=________________________________  # generado
□ Agregada

# SMTP (Banahosting)
SMTP_HOST=mail.exporthighlight.com
SMTP_PORT=587
SMTP_USER=noreply@exporthighlight.com
SMTP_PASS=________________________________
SMTP_FROM=noreply@exporthighlight.com
□ Agregadas

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=________________________________
SUPABASE_SERVICE_ROLE_KEY=________________________________
SUPABASE_JWT_SECRET=________________________________  # mismo que GOTRUE_JWT_SECRET
□ Agregadas
```

- [ ] `NEXTAUTH_SECRET` generado con: `openssl rand -base64 32`
- [ ] `SUPABASE_JWT_SECRET` es IDÉNTICO a `GOTRUE_JWT_SECRET`

### Paso 3: Crear Configuración de NextAuth
- [ ] Archivo `app/auth.ts` creado
- [ ] Configuración del adapter implementada
- [ ] Callbacks de JWT configurados
- [ ] JWT compatible con Supabase (sub, role, aud, iss, iat, exp)
- [ ] Email provider configurado con SMTP

### Paso 4: Crear Route Handler
- [ ] Archivo `app/api/auth/[...nextauth]/route.ts` creado
- [ ] Exporta `GET` y `POST` correctamente

### Paso 5: Actualizar Cliente Supabase
- [ ] `lib/supabaseClient.ts` actualizado
- [ ] Factory `makeSupabaseClient(accessToken)` creado
- [ ] Realtime auth configurado

### Paso 6: Actualizar Server Client
- [ ] `lib/supabaseServer.ts` creado/actualizado
- [ ] Solo usa `SERVICE_ROLE_KEY` en servidor
- [ ] Nunca expone `SERVICE_ROLE_KEY` al cliente

---

## 🎨 FASE 3: REFACTORIZAR CÓDIGO

### Componentes de Auth
- [ ] `components/AuthModal.tsx` actualizado
  - [ ] Usa `signIn("email")` de NextAuth
  - [ ] Removidas referencias a `supabase.auth`
  - [ ] Password reset usa NextAuth
  - [ ] Signup usa NextAuth

### Hooks
- [ ] `hooks/use-auth.ts` actualizado
  - [ ] Usa `useSession` de NextAuth
  - [ ] Remueve `supabase.auth.getUser()`
  - [ ] Devuelve user de sesión NextAuth

### Helpers
- [ ] `lib/supabase-helpers.ts` actualizado
  - [ ] Recibe `userId` explícito
  - [ ] No usa `auth.uid()`
- [ ] `lib/collections-helpers.ts` actualizado
- [ ] `lib/tags-helpers.ts` actualizado

### Layout y Nav
- [ ] `app/layout.tsx` actualizado
  - [ ] `SessionProvider` de NextAuth agregado
- [ ] `components/Nav.tsx` actualizado
  - [ ] Usa `useSession` de NextAuth
  - [ ] `signOut` de NextAuth

### Otros Componentes
- [ ] `components/ExportLimitModal.tsx` verificado
- [ ] Búsqueda de referencias a `supabase.auth`: `□ 0 encontradas`
- [ ] Búsqueda de referencias a `auth.uid()`: `□ 0 encontradas`

---

## 🧪 FASE 4: TESTING

### Tests de Autenticación
- [ ] Test: Signup con email
  - [ ] Email llega correctamente
  - [ ] Link de verificación funciona
  - [ ] Usuario creado en `next_auth.users`
- [ ] Test: Login con email (magic link)
  - [ ] Email llega
  - [ ] Link funciona
  - [ ] Sesión creada
- [ ] Test: Password reset
  - [ ] Email llega
  - [ ] Link funciona
  - [ ] Password actualizado

### Tests de RLS
- [ ] Test: Usuario A solo ve sus libros
- [ ] Test: Usuario A no puede ver libros de Usuario B
- [ ] Test: Usuario A puede crear libro propio
- [ ] Test: Usuario A no puede crear libro de Usuario B
- [ ] Test: Usuario A puede editar libro propio
- [ ] Test: Usuario A no puede editar libro de Usuario B
- [ ] Test: Usuario A puede eliminar libro propio
- [ ] Test: Usuario A no puede eliminar libro de Usuario B
- [ ] (Repetir para highlights)

### Tests de Sesiones
- [ ] Test: Sesión persiste después de reload
- [ ] Test: Sesión expira correctamente
- [ ] Test: Logout funciona
- [ ] Test: Token se renueva automáticamente

### Tests de Integración
- [ ] Test: Upload de clippings funciona
- [ ] Test: Export a Markdown funciona
- [ ] Test: Export a ZIP funciona
- [ ] Test: Colecciones funcionan
- [ ] Test: Tags funcionan
- [ ] Test: Búsqueda funciona
- [ ] Test: i18n funciona

### Tests de Performance
- [ ] Test: Tiempo de login < 2s
- [ ] Test: Queries de libros < 500ms
- [ ] Test: Queries de highlights < 500ms
- [ ] Test: Export < 5s (para dataset típico)

---

## 🚀 FASE 5: DEPLOY

### Pre-Deploy
- [ ] Todos los tests pasan en staging
- [ ] Logs sin errores críticos
- [ ] Variables de entorno verificadas
- [ ] Backup de producción realizado

### Deploy a Staging
- [ ] Código pusheado a rama staging
- [ ] Deploy exitoso
- [ ] Health check pasa
- [ ] Tests de smoke en staging

### Deploy a Producción
- [ ] Código pusheado a rama main
- [ ] Deploy exitoso
- [ ] Health check pasa
- [ ] Tests de smoke en producción
- [ ] Monitoreo activo por 1 hora

### Post-Deploy
- [ ] Usuarios pueden hacer login
- [ ] Usuarios pueden hacer signup
- [ ] Emails llegan correctamente
- [ ] RLS funciona correctamente
- [ ] No hay errores en logs
- [ ] Performance OK

---

## 📊 MÉTRICAS FINALES

### Métricas de Migración
```
Usuarios migrados: __________ / __________
Libros preservados: __________ / __________
Highlights preservados: __________ / __________
Tiempo total de migración: __________
Downtime: __________
Errores encontrados: __________
Errores resueltos: __________
```

### Métricas de Éxito
- [ ] 100% de usuarios migrados
- [ ] 100% de datos preservados
- [ ] RLS funcional para todos los usuarios
- [ ] Autenticación funcional
- [ ] Emails enviados correctamente
- [ ] Performance igual o mejor
- [ ] Sin errores en logs

---

## 🎉 COMPLETADO

```
┌─────────────────────────────────────────────────┐
│  MIGRACIÓN COMPLETADA                           │
├─────────────────────────────────────────────────┤
│  Fecha: ____________                            │
│  Duración total: ____________                   │
│  Resultado: □ Éxito  □ Con issues              │
│  Issues pendientes: ____________                │
└─────────────────────────────────────────────────┘
```

### Celebración 🎉
- [ ] PR de migración mergeado
- [ ] Documentación actualizada
- [ ] Team notificado
- [ ] Retrospectiva agendada
- [ ] ¡Tómate un café! ☕

---

## 🔧 TROUBLESHOOTING LOG

Si encuentras problemas, documéntalos aquí:

### Problema 1:
```
Descripción: _________________________________
Fecha: ____________
Solución: _________________________________
```

### Problema 2:
```
Descripción: _________________________________
Fecha: ____________
Solución: _________________________________
```

### Problema 3:
```
Descripción: _________________________________
Fecha: ____________
Solución: _________________________________
```

---

## 📞 CONTACTO Y SOPORTE

Si necesitas ayuda:
- [ ] Consultar `README_MIGRATION.md` → Troubleshooting
- [ ] Ejecutar queries de `99_debug_commands.sql`
- [ ] Revisar logs en Coolify
- [ ] Consultar con el equipo

---

**Guarda este archivo como `CHECKLIST_PROGRESS.md` y ve marcando tu progreso.** ✅
