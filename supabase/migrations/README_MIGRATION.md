# 🔄 Migración de Supabase Auth a NextAuth

## 📋 Tabla de Contenidos
- [Prerrequisitos](#prerrequisitos)
- [Fase 0.1: Auditoría](#fase-01-auditoría)
- [Fase 1: Migración SQL](#fase-1-migración-sql)
- [Fase 2: Configurar NextAuth](#fase-2-configurar-nextauth)
- [Fase 3: Actualizar Cliente Supabase](#fase-3-actualizar-cliente-supabase)
- [Rollback](#rollback)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Prerrequisitos

### 1. Backup de Base de Datos
```bash
# Desde Coolify o tu servidor
pg_dump -h localhost -U postgres tu_database > backup_pre_migration.sql
```

### 2. Variables de Entorno Necesarias

Necesitas obtener de tu instalación de Supabase (Coolify):

```bash
# En Coolify → tu stack de Supabase → servicio auth (GoTrue)
# Busca estas variables:

GOTRUE_JWT_SECRET=<este-es-el-valor-que-necesitas>
# Este es el SUPABASE_JWT_SECRET que usarás en NextAuth
```

### 3. Ambiente de Staging

⚠️ **NUNCA ejecutes la migración directamente en producción**

1. Crea una base de datos de staging
2. Restaura el backup en staging
3. Ejecuta toda la migración en staging primero
4. Verifica que todo funciona
5. Solo entonces ejecuta en producción

---

## 🔍 Fase 0.1: Auditoría

### Paso 1: Ejecutar Auditoría Previa

```sql
-- En tu cliente SQL (psql, pgAdmin, o Supabase Studio)
-- Ejecutar: supabase/migrations/00_audit_pre_migration.sql
```

### Paso 2: Guardar Resultados

Guarda los resultados en un archivo para comparar después:

```bash
psql -h tu-host -U postgres -d tu-database -f supabase/migrations/00_audit_pre_migration.sql > audit_results.txt
```

### Paso 3: Verificar Resultados

Verifica:
- ✅ Cantidad de usuarios confirmados
- ✅ Cantidad de libros y highlights
- ✅ Foreign Keys actuales
- ✅ Políticas RLS existentes
- ✅ Si hay datos huérfanos

---

## 🚀 Fase 1: Migración SQL

### Paso 1: Revisar el Script

Lee cuidadosamente: `supabase/migrations/01_migrate_to_nextauth.sql`

Este script:
1. ✅ Crea schema `next_auth`
2. ✅ Crea tablas del adapter
3. ✅ Migra usuarios de `auth.users` a `next_auth.users`
4. ✅ Actualiza Foreign Keys
5. ✅ Configura políticas RLS con `auth.jwt()`
6. ✅ Configura permisos

### Paso 2: Ejecutar Migración

```bash
# En staging primero
psql -h tu-host -U postgres -d tu-database -f supabase/migrations/01_migrate_to_nextauth.sql
```

### Paso 3: Verificar Migración

```bash
# Ejecutar tests
psql -h tu-host -U postgres -d tu-database -f supabase/migrations/03_test_migration.sql > test_results.txt
```

### Paso 4: Revisar Resultados

Todos los tests deben mostrar ✓:
- ✓ Schema next_auth existe
- ✓ 4 tablas creadas
- ✓ Usuarios migrados correctamente
- ✓ Foreign Keys actualizadas
- ✓ 8 políticas RLS configuradas (4 por tabla)
- ✓ RLS habilitado
- ✓ Sin datos huérfanos

---

## 🔧 Fase 2: Configurar NextAuth

### Paso 1: Instalar Dependencias

```bash
npm install next-auth @auth/supabase-adapter jsonwebtoken nodemailer
npm install -D @types/jsonwebtoken @types/nodemailer
```

### Paso 2: Configurar Variables de Entorno

Crea/actualiza `.env.local`:

```bash
# NextAuth
NEXTAUTH_URL=https://exporthighlight.com
NEXTAUTH_SECRET=<generar-con-openssl-rand-base64-32>

# SMTP (Banahosting ya configurado)
SMTP_HOST=mail.exporthighlight.com
SMTP_PORT=587
SMTP_USER=noreply@exporthighlight.com
SMTP_PASS=<password-del-email>
SMTP_FROM=noreply@exporthighlight.com

# Supabase (self-hosted)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.bayyana.es
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<tu-service-role-key>
SUPABASE_JWT_SECRET=<obtener-de-gotrue-jwt-secret-en-coolify>
```

### Paso 3: Obtener SUPABASE_JWT_SECRET

En Coolify:
1. Ve a tu stack de Supabase
2. Entra al servicio **auth** (GoTrue)
3. Busca la variable: `GOTRUE_JWT_SECRET` o `JWT_SECRET`
4. Copia ese valor a `SUPABASE_JWT_SECRET`

### Paso 4: Crear Configuración de NextAuth

Los archivos de NextAuth se crearán en la Fase 2 (próximo paso después de verificar que SQL funciona).

---

## 🧪 Tests de Verificación

### Test 1: Verificar RLS

```sql
-- Como usuario A, intentar acceder a datos de usuario B
-- Debería fallar

SET request.jwt.claims = '{"sub": "uuid-usuario-A", "role": "authenticated"}';
SELECT * FROM public.books WHERE user_id = 'uuid-usuario-B';
-- Debería retornar 0 filas
```

### Test 2: Verificar FKs

```sql
-- Intentar insertar libro con user_id inexistente
-- Debería fallar

INSERT INTO public.books (user_id, title, author)
VALUES ('00000000-0000-0000-0000-000000000000', 'Test', 'Test');
-- ERROR: violates foreign key constraint
```

### Test 3: Verificar Migración de Usuarios

```sql
-- Todos los usuarios deberían estar en ambas tablas con el mismo UUID
SELECT 
  au.id as auth_id,
  nu.id as nextauth_id,
  au.email,
  au.email_confirmed_at,
  nu.email_verified
FROM auth.users au
JOIN next_auth.users nu ON au.id = nu.id
WHERE au.email_confirmed_at IS NOT NULL;
```

---

## 🔙 Rollback

Si algo sale mal:

```bash
# Ejecutar script de rollback
psql -h tu-host -U postgres -d tu-database -f supabase/migrations/02_rollback_migration.sql
```

Esto:
1. Restaura Foreign Keys a `auth.users`
2. Restaura políticas RLS originales
3. Elimina schema `next_auth`

Después del rollback:
1. Reiniciar servicios de Supabase en Coolify
2. Verificar que auth.users funciona
3. Probar login con Supabase Auth

---

## 🚨 Troubleshooting

### Error: "role postgres does not exist"

```sql
-- Conectar como superusuario y crear role
CREATE ROLE postgres WITH SUPERUSER LOGIN;
```

### Error: "permission denied for schema next_auth"

```sql
-- Dar permisos al role actual
GRANT ALL ON SCHEMA next_auth TO CURRENT_USER;
GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO CURRENT_USER;
```

### Error: "foreign key constraint violation"

```sql
-- Verificar que no hay datos huérfanos
SELECT 'books' as table_name, COUNT(*) 
FROM public.books b
WHERE NOT EXISTS (SELECT 1 FROM next_auth.users u WHERE u.id = b.user_id)
UNION ALL
SELECT 'highlights', COUNT(*) 
FROM public.highlights h
WHERE NOT EXISTS (SELECT 1 FROM next_auth.users u WHERE u.id = h.user_id);

-- Si hay datos huérfanos, eliminarlos o migrar el usuario faltante
```

### Error: "users_email_key already exists"

```sql
-- Verificar duplicados en next_auth.users
SELECT email, COUNT(*) 
FROM next_auth.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Eliminar duplicados manualmente
DELETE FROM next_auth.users 
WHERE id NOT IN (
  SELECT MIN(id) FROM next_auth.users GROUP BY email
);
```

---

## 📊 Checklist de Migración

### Pre-Migración
- [ ] Backup de base de datos completo
- [ ] Auditoría ejecutada y resultados guardados
- [ ] Variables de entorno documentadas
- [ ] SUPABASE_JWT_SECRET obtenido de Coolify
- [ ] Staging preparado

### Durante Migración
- [ ] Script 01_migrate_to_nextauth.sql ejecutado sin errores
- [ ] Tests (03_test_migration.sql) ejecutados
- [ ] Todos los tests muestran ✓
- [ ] Usuarios migrados correctamente
- [ ] Foreign Keys actualizadas
- [ ] RLS configurado

### Post-Migración
- [ ] NextAuth configurado (Fase 2)
- [ ] Cliente Supabase actualizado (Fase 3)
- [ ] Tests manuales de login funcionando
- [ ] Tests de RLS passing
- [ ] No hay errores en logs

---

## 📞 Siguiente Paso

Una vez que la Fase 1 (SQL) esté completa y todos los tests pasen:

✅ **Confirma que estás listo para Fase 2**

Te ayudaré a:
1. Configurar NextAuth con el adapter de Supabase
2. Configurar JWT compatible con Supabase RLS
3. Integrar SMTP de Banahosting
4. Actualizar cliente Supabase para usar tokens de NextAuth

---

## 🛟 Ayuda

Si encuentras algún problema:
1. Verifica los resultados de los tests
2. Revisa los logs de Postgres
3. Consulta la sección de Troubleshooting
4. Si todo falla, ejecuta rollback

**Recuerda:** Siempre prueba en staging primero.
