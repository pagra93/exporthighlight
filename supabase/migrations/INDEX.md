# 📚 Índice de Migración - Supabase Auth → NextAuth

## 🎯 Propósito de este Directorio

Este directorio contiene todos los archivos necesarios para migrar tu aplicación de **Supabase Auth** a **NextAuth** manteniendo:
- ✅ RLS intacto
- ✅ Mismos UUIDs de usuarios
- ✅ Datos históricos preservados
- ✅ Seguridad garantizada

---

## 📋 Orden de Lectura Recomendado

### 🚀 **Para empezar RÁPIDO:**
```
1. EXECUTIVE_SUMMARY.md     ← Leer primero (5 min)
2. QUICK_START.md            ← Guía paso a paso (10 min)
3. SELF_HOSTED_GUIDE.md      ← Específico para tu setup (10 min)
```

### 📖 **Para entender TODO:**
```
4. README_MIGRATION.md       ← Guía completa (20 min)
```

---

## 🗂️ Estructura de Archivos

### 📊 **Scripts SQL** (ejecutar en orden)
| # | Archivo | Propósito | Cuándo ejecutar |
|---|---------|-----------|-----------------|
| 00 | `00_audit_pre_migration.sql` | Auditoría previa | ANTES de migrar |
| 01 | `01_migrate_to_nextauth.sql` | Migración principal | Después de auditoría |
| 02 | `02_rollback_migration.sql` | Revertir cambios | SOLO si falla |
| 03 | `03_test_migration.sql` | Verificar migración | Después de migrar |
| 99 | `99_debug_commands.sql` | Comandos útiles | Según necesidad |

### 📖 **Documentación**
| Archivo | Propósito | Audiencia |
|---------|-----------|-----------|
| `INDEX.md` | Este archivo - índice general | Todos |
| `EXECUTIVE_SUMMARY.md` | Resumen ejecutivo y TL;DR | Tech Lead / PM |
| `QUICK_START.md` | Guía rápida de ejecución | Desarrolladores |
| `SELF_HOSTED_GUIDE.md` | Específico para self-hosted | DevOps / SysAdmin |
| `README_MIGRATION.md` | Documentación completa | Todos (referencia) |

---

## 🎯 Flujo de Trabajo

```
┌─────────────────────────────────────────────────┐
│  FASE 0: PREPARACIÓN (30 min)                   │
├─────────────────────────────────────────────────┤
│  □ Leer documentación                           │
│  □ Obtener GOTRUE_JWT_SECRET de Coolify        │
│  □ Obtener anon_key y service_role_key         │
│  □ Hacer backup de base de datos               │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  FASE 1: MIGRACIÓN SQL (15 min)                │
├─────────────────────────────────────────────────┤
│  □ Ejecutar 00_audit_pre_migration.sql         │
│  □ Guardar resultados                           │
│  □ Ejecutar 01_migrate_to_nextauth.sql         │
│  □ Ejecutar 03_test_migration.sql              │
│  □ Verificar que todos los tests pasan ✓       │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  FASE 2: NEXTAUTH CONFIG (45 min)              │
├─────────────────────────────────────────────────┤
│  □ Instalar dependencias                        │
│  □ Configurar app/auth.ts                      │
│  □ Actualizar lib/supabaseClient.ts            │
│  □ Refactorizar AuthModal                      │
└─────────────────────────────────────────────────┘
          ↓
┌─────────────────────────────────────────────────┐
│  FASE 3: TESTING & DEPLOY (30 min)             │
├─────────────────────────────────────────────────┤
│  □ Tests de RLS                                 │
│  □ Tests de autenticación                       │
│  □ Deploy a staging                             │
│  □ Deploy a producción                          │
└─────────────────────────────────────────────────┘
```

**Tiempo total estimado: ~2 horas** (en staging, luego ~30 min en producción)

---

## 🚀 Quick Links

### Para diferentes roles:

#### 👨‍💻 **Desarrollador Frontend**
→ Lee: `QUICK_START.md` + `EXECUTIVE_SUMMARY.md`

#### 🛠️ **DevOps / SysAdmin**
→ Lee: `SELF_HOSTED_GUIDE.md` + `README_MIGRATION.md`

#### 👔 **Tech Lead / PM**
→ Lee: `EXECUTIVE_SUMMARY.md` (suficiente)

#### 🆘 **Tengo problemas / errores**
→ Ve a: `README_MIGRATION.md` → sección **Troubleshooting**  
→ O ejecuta queries de: `99_debug_commands.sql`

---

## 📞 Checklist Pre-Migración

Antes de ejecutar CUALQUIER script, verifica:

```
□ Tienes backup de base de datos
□ Estás en STAGING (no producción)
□ Tienes GOTRUE_JWT_SECRET de Coolify
□ Tienes acceso a Supabase Studio
□ Tienes acceso a logs de Coolify
□ Has leído al menos QUICK_START.md y SELF_HOSTED_GUIDE.md
```

**Si todos están ✅, puedes continuar con seguridad.**

---

## 🎯 Qué Cambios Esperar

### Base de Datos:
- ✅ Nuevo schema: `next_auth`
- ✅ 4 nuevas tablas: `users`, `accounts`, `sessions`, `verification_tokens`
- ✅ Foreign Keys actualizadas
- ✅ Políticas RLS actualizadas
- ✅ Usuarios migrados con mismos UUIDs

### Código (FASE 2):
- ✅ NextAuth instalado y configurado
- ✅ JWT compatible con Supabase RLS
- ✅ SMTP con Banahosting
- ✅ AuthModal refactorizado
- ✅ Sin dependencias de Supabase Auth

### Experiencia de Usuario:
- ✅ Login por email (magic link)
- ✅ Password reset funcional
- ✅ Sesiones persistentes
- ✅ Misma UX, mejor DX

---

## 🔧 Herramientas Necesarias

### Durante FASE 1 (SQL):
- ✅ Supabase Studio (`https://supabase.bayyana.es`)
- ✅ Coolify (`https://coolify...` tu dominio)
- ✅ Acceso a servidor para backup (opcional pero recomendado)

### Durante FASE 2 (Código):
- ✅ Editor de código (VSCode, Cursor, etc.)
- ✅ Node.js 18+ y npm/pnpm
- ✅ Git para versionado

---

## 🚨 Rollback Plan

Si algo sale mal en FASE 1:

```sql
-- Opción 1: Rollback automático del script
-- (el script usa BEGIN/COMMIT, si falla hace ROLLBACK automático)

-- Opción 2: Rollback manual
-- Ejecutar: 02_rollback_migration.sql

-- Opción 3: Restaurar backup
psql ... < backup.sql
```

---

## 📊 Métricas de Éxito

Al finalizar la migración, deberías ver:

```
✅ Schema next_auth existe
✅ 4 tablas creadas en next_auth
✅ Usuarios migrados = usuarios originales
✅ 2 Foreign Keys actualizadas
✅ 8 políticas RLS configuradas (4 por tabla)
✅ RLS habilitado en books y highlights
✅ 0 datos huérfanos
✅ Tests de RLS pasan
✅ Login funciona
✅ Emails se envían
```

---

## 🆘 Soporte y Debugging

### Si encuentras problemas:

1. **Consulta**: `README_MIGRATION.md` → sección Troubleshooting
2. **Ejecuta**: Queries relevantes de `99_debug_commands.sql`
3. **Revisa**: Logs en Coolify (servicio `auth`)
4. **Verifica**: Variables de entorno en `.env.local` y Coolify

### Problemas comunes:

| Problema | Solución |
|----------|----------|
| "permission denied" | Verificar permisos de postgres role |
| "JWT inválido" | Verificar SUPABASE_JWT_SECRET coincide con GOTRUE_JWT_SECRET |
| "FK violation" | Ejecutar query de datos huérfanos en `99_debug_commands.sql` |
| "RLS no funciona" | Verificar políticas con queries de debug |

---

## 📚 Archivos de Referencia

### Scripts SQL (Orden de ejecución):
```
00_audit_pre_migration.sql  → Ejecutar PRIMERO
01_migrate_to_nextauth.sql  → Ejecutar SEGUNDO
03_test_migration.sql       → Ejecutar TERCERO
02_rollback_migration.sql   → SOLO si falla
99_debug_commands.sql       → Según necesidad
```

### Documentación (Orden de lectura):
```
EXECUTIVE_SUMMARY.md        → Para entender qué, por qué, cómo
QUICK_START.md              → Para ejecutar rápido
SELF_HOSTED_GUIDE.md        → Para setup específico
README_MIGRATION.md         → Para referencia completa
INDEX.md                    → Este archivo (índice)
```

---

## 🎯 Estado Actual

```
✅ FASE 0.1: Auditoría y preparación → Scripts creados
✅ FASE 1: Migración SQL → Scripts creados y documentados
⏳ FASE 2: NextAuth config → Pendiente (después de ejecutar SQL)
⏳ FASE 3: Testing & Deploy → Pendiente
```

---

## 📞 Próxima Acción

**Lee estos archivos en orden:**
1. `EXECUTIVE_SUMMARY.md` (5 min)
2. `QUICK_START.md` (10 min)
3. `SELF_HOSTED_GUIDE.md` (10 min)

**Luego ejecuta:**
1. Backup de base de datos
2. `00_audit_pre_migration.sql`
3. `01_migrate_to_nextauth.sql`
4. `03_test_migration.sql`

**Finalmente:**
→ Confirma que todos los tests pasan ✓  
→ Avisa para continuar con FASE 2

---

## 🙏 Créditos

- **Estrategia**: Migración segura y reversible
- **Enfoque**: RLS intacto, datos preservados
- **Stack**: NextAuth + Supabase DB + Coolify
- **Objetivo**: Eliminar dependencia de Supabase Auth, mantener seguridad

---

## 📜 Licencia

Este código de migración es parte del proyecto ExportHighlight.

---

**¿Listo para empezar?** 🚀

→ Abre `EXECUTIVE_SUMMARY.md` y comienza tu viaje.
