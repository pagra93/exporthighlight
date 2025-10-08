# 🎯 Guía Rápida de Ejecución en Supabase Studio

## 📍 Dónde Ejecutar los Scripts

En tu instalación self-hosted de Supabase con Coolify:

1. Abre tu Supabase Studio: `https://supabase.bayyana.es` (o tu dominio)
2. Ve a la sección **SQL Editor** en el menú lateral izquierdo
3. Crea una nueva query

---

## 🔄 Orden de Ejecución

### **PASO 1: Auditoría** (OBLIGATORIO)
```
Archivo: 00_audit_pre_migration.sql
Tiempo estimado: 30 segundos
```

**Qué hace:**
- Cuenta usuarios actuales
- Verifica estructura de base de datos
- Detecta problemas antes de migrar

**Cómo ejecutar:**
1. Abre `00_audit_pre_migration.sql`
2. Copia TODO el contenido
3. Pégalo en SQL Editor
4. Click en **RUN**
5. **IMPORTANTE:** Guarda los resultados en un archivo `.txt`

**Qué esperar:**
```
✅ Total de usuarios: X
✅ Usuarios confirmados: Y
✅ Total de libros: Z
✅ Total de highlights: W
✅ Foreign Keys: 2 (books y highlights)
✅ Políticas RLS: N
```

---

### **PASO 2: Backup** (CRÍTICO)
```bash
# Desde tu servidor o Coolify
pg_dump -h localhost -U postgres -d tu_database > backup_$(date +%Y%m%d).sql
```

⚠️ **NO CONTINÚES SIN UN BACKUP**

---

### **PASO 3: Migración** (EN STAGING PRIMERO)
```
Archivo: 01_migrate_to_nextauth.sql
Tiempo estimado: 2-5 minutos
```

**Qué hace:**
- Crea schema `next_auth`
- Migra usuarios de `auth.users` → `next_auth.users`
- Actualiza Foreign Keys
- Configura RLS con `auth.jwt()`

**Cómo ejecutar:**
1. Abre `01_migrate_to_nextauth.sql`
2. Copia TODO el contenido
3. Pégalo en SQL Editor
4. **RESPIRA HONDO** 😅
5. Click en **RUN**
6. Observa los mensajes de `NOTICE`

**Qué esperar:**
```
NOTICE: Usuarios en auth.users (confirmados): X
NOTICE: Usuarios migrados a next_auth.users: X
NOTICE: Foreign Keys configuradas: 2
NOTICE: Políticas RLS: 8
✓ Migración completada exitosamente
```

**Si algo falla:**
- El script hace `ROLLBACK` automático
- No se aplicará ningún cambio
- Revisa el error y corrígelo

---

### **PASO 4: Tests** (OBLIGATORIO)
```
Archivo: 03_test_migration.sql
Tiempo estimado: 1 minuto
```

**Qué hace:**
- Verifica que la migración fue exitosa
- Comprueba RLS, FKs, políticas
- Detecta datos huérfanos

**Cómo ejecutar:**
1. Abre `03_test_migration.sql`
2. Copia TODO el contenido
3. Pégalo en SQL Editor
4. Click en **RUN**
5. **Revisa TODOS los resultados**

**Qué esperar:**
```
TEST 1: ✓ Schema next_auth existe
TEST 2: ✓ Migración correcta
TEST 3: ✓ FK correcta (2 veces)
TEST 4: ✓ 4 políticas (correcto) (2 tablas)
TEST 5: ✓ RLS habilitado (2 tablas)
TEST 6: ✓ Sin datos huérfanos (2 tablas)
TEST 7: ✓ Permisos configurados
TEST 8: ✓ Índices existen
TEST 9: ✓ Función current_user_id existe
TEST 10: ✓ Triggers existen
```

**Si algún test muestra ✗:**
- **DETENTE**
- Lee el error
- Consulta README_MIGRATION.md sección Troubleshooting
- Considera ejecutar rollback

---

### **PASO 5 (OPCIONAL): Rollback**
```
Archivo: 02_rollback_migration.sql
Tiempo estimado: 1 minuto
```

**SOLO ejecutar si:**
- Los tests fallan
- Encuentras problemas graves
- Necesitas revertir por cualquier razón

**Qué hace:**
- Restaura Foreign Keys a `auth.users`
- Restaura políticas RLS originales
- Elimina schema `next_auth`

**Cómo ejecutar:**
1. Abre `02_rollback_migration.sql`
2. Copia TODO el contenido
3. Pégalo en SQL Editor
4. Click en **RUN**

**Después del rollback:**
1. Reinicia servicios en Coolify
2. Verifica que Supabase Auth funciona
3. Investiga qué salió mal

---

## 📊 Checklist Visual

```
┌─────────────────────────────────────────────┐
│  ANTES DE EMPEZAR                           │
├─────────────────────────────────────────────┤
│  □ Backup de base de datos completado      │
│  □ Auditoría ejecutada (00_audit...)       │
│  □ Resultados de auditoría guardados       │
│  □ SUPABASE_JWT_SECRET obtenido            │
│  □ Staging preparado (NO en producción)    │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  EJECUCIÓN                                  │
├─────────────────────────────────────────────┤
│  □ 01_migrate_to_nextauth.sql ejecutado    │
│  □ Sin errores en la ejecución             │
│  □ Mensaje "✓ Migración completada"        │
│  □ 03_test_migration.sql ejecutado         │
│  □ Todos los tests muestran ✓              │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  VERIFICACIÓN                               │
├─────────────────────────────────────────────┤
│  □ Schema next_auth existe                 │
│  □ 4 tablas en next_auth                   │
│  □ Usuarios migrados = usuarios originales │
│  □ Foreign Keys apuntan a next_auth.users  │
│  □ 8 políticas RLS configuradas            │
│  □ Sin datos huérfanos                     │
└─────────────────────────────────────────────┘
```

---

## 🔍 Cómo Verificar JWT_SECRET

### En Coolify:

1. Ve a tu proyecto de Supabase
2. Busca el servicio: **auth** (o **gotrue**)
3. Click en el servicio
4. Ve a la pestaña **Environment Variables**
5. Busca: `JWT_SECRET` o `GOTRUE_JWT_SECRET`
6. Copia ese valor

### Ejemplo:
```
GOTRUE_JWT_SECRET=super-secret-jwt-key-32-chars-min
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                  Este es el valor que necesitas
```

Cópialo a tu `.env.local` como:
```
SUPABASE_JWT_SECRET=super-secret-jwt-key-32-chars-min
```

---

## ⏱️ Tiempos Estimados

| Paso | Tiempo | Crítico |
|------|--------|---------|
| Auditoría | 30 seg | ✅ Sí |
| Backup | 1-5 min | ✅ Sí |
| Migración | 2-5 min | ✅ Sí |
| Tests | 1 min | ✅ Sí |
| **TOTAL** | **5-12 min** | |

---

## 🚨 Señales de Alerta

### ⚠️ DETENTE si ves:

```sql
ERROR: permission denied
ERROR: schema next_auth already exists (y tiene datos)
ERROR: foreign key constraint violation
ERROR: role postgres does not exist
WARNING: Discrepancia en conteo de usuarios
```

### ✅ TODO BIEN si ves:

```sql
NOTICE: Usuarios migrados: X
NOTICE: ✓ Migración completada exitosamente
✓ Schema next_auth existe
✓ 4 políticas (correcto)
✓ Sin datos huérfanos
```

---

## 🎯 Siguiente Paso

Una vez que **TODOS** los tests pasen:

```
✅ FASE 1 COMPLETADA
⏭️  AVANZA A FASE 2: Configurar NextAuth
```

Me avisas y continuamos con:
1. Instalación de dependencias
2. Configuración de NextAuth
3. Integración de JWT con Supabase RLS
4. Setup de SMTP con Banahosting

---

## 💡 Tips

1. **Lee los mensajes**: Los scripts tienen mensajes `NOTICE` informativos
2. **No te apures**: Cada paso es importante
3. **Staging primero**: NUNCA en producción directamente
4. **Guarda logs**: Útil para debugging
5. **Pregunta si dudas**: Mejor prevenir que lamentar

---

## 📞 ¿Listo?

Cuando hayas ejecutado los 3 primeros pasos (auditoría, backup, migración) y todos los tests pasen, me confirmas y continuamos con la Fase 2. 🚀
