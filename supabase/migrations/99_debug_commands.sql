-- ============================================
-- COMANDOS ÚTILES PARA DEBUGGING
-- ============================================
-- Colección de queries útiles para diagnosticar problemas
-- NO ejecutar todo a la vez, usar según necesidad

-- ============================================
-- 1. VERIFICAR ESTADO ACTUAL
-- ============================================

-- Ver usuarios en ambas tablas
SELECT 'auth.users' as source, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'next_auth.users' as source, COUNT(*) as count FROM next_auth.users;

-- Ver usuarios específicos
SELECT 
  au.id,
  au.email as auth_email,
  nu.email as nextauth_email,
  au.email_confirmed_at,
  nu.email_verified,
  CASE 
    WHEN nu.id IS NULL THEN '❌ No migrado'
    ELSE '✅ Migrado'
  END as status
FROM auth.users au
LEFT JOIN next_auth.users nu ON au.id = nu.id
ORDER BY au.created_at DESC
LIMIT 20;

-- ============================================
-- 2. VERIFICAR RLS
-- ============================================

-- Ver todas las políticas de una tabla
SELECT 
  policyname,
  cmd as operation,
  qual as using_clause,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
  AND tablename = 'books'
ORDER BY policyname;

-- Ver si RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '✅ Habilitado'
    ELSE '❌ Deshabilitado'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights');

-- ============================================
-- 3. SIMULAR JWT PARA TESTEAR RLS
-- ============================================

-- Setear un JWT simulado (reemplazar UUID)
SET request.jwt.claims = '{"sub": "tu-user-uuid-aqui", "role": "authenticated"}';

-- Testear query
SELECT * FROM public.books;
-- Debería mostrar solo libros de ese usuario

-- Resetear JWT
RESET request.jwt.claims;

-- ============================================
-- 4. VERIFICAR FOREIGN KEYS
-- ============================================

-- Ver todas las FKs de books y highlights
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name AS references,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('books', 'highlights');

-- ============================================
-- 5. BUSCAR DATOS HUÉRFANOS
-- ============================================

-- Libros sin usuario
SELECT 
  b.id,
  b.user_id,
  b.title,
  'No existe en next_auth.users' as issue
FROM public.books b
WHERE NOT EXISTS (
  SELECT 1 FROM next_auth.users u WHERE u.id = b.user_id
)
LIMIT 10;

-- Highlights sin usuario
SELECT 
  h.id,
  h.user_id,
  h.content,
  'No existe en next_auth.users' as issue
FROM public.highlights h
WHERE NOT EXISTS (
  SELECT 1 FROM next_auth.users u WHERE u.id = h.user_id
)
LIMIT 10;

-- ============================================
-- 6. VERIFICAR PERMISOS
-- ============================================

-- Permisos en schema next_auth
SELECT 
  grantee,
  string_agg(privilege_type, ', ') as privileges
FROM information_schema.schema_privileges
WHERE schema_name = 'next_auth'
GROUP BY grantee;

-- Permisos en tablas de next_auth
SELECT 
  table_name,
  grantee,
  string_agg(privilege_type, ', ') as privileges
FROM information_schema.table_privileges
WHERE table_schema = 'next_auth'
GROUP BY table_name, grantee
ORDER BY table_name, grantee;

-- ============================================
-- 7. VER SESIONES ACTIVAS (NextAuth)
-- ============================================

-- Sesiones válidas
SELECT 
  s.id,
  s.user_id,
  u.email,
  s.expires,
  CASE 
    WHEN s.expires > NOW() THEN '✅ Válida'
    ELSE '❌ Expirada'
  END as status,
  s.created_at
FROM next_auth.sessions s
JOIN next_auth.users u ON s.user_id = u.id
ORDER BY s.created_at DESC
LIMIT 20;

-- ============================================
-- 8. VER TOKENS DE VERIFICACIÓN
-- ============================================

-- Tokens pendientes
SELECT 
  identifier,
  expires,
  CASE 
    WHEN expires > NOW() THEN '✅ Válido'
    ELSE '❌ Expirado'
  END as status,
  created_at
FROM next_auth.verification_tokens
ORDER BY created_at DESC
LIMIT 20;

-- ============================================
-- 9. ESTADÍSTICAS GENERALES
-- ============================================

-- Resumen de usuarios y datos
SELECT 
  (SELECT COUNT(*) FROM next_auth.users) as total_users,
  (SELECT COUNT(*) FROM next_auth.sessions WHERE expires > NOW()) as active_sessions,
  (SELECT COUNT(*) FROM public.books) as total_books,
  (SELECT COUNT(*) FROM public.highlights) as total_highlights,
  (SELECT COUNT(DISTINCT user_id) FROM public.books) as users_with_books,
  (SELECT COUNT(DISTINCT user_id) FROM public.highlights) as users_with_highlights;

-- ============================================
-- 10. VERIFICAR TRIGGERS
-- ============================================

-- Ver triggers de updated_at
SELECT
  event_object_schema,
  event_object_table,
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================
-- 11. TESTEAR FUNCIÓN current_user_id()
-- ============================================

-- Sin JWT (debería retornar NULL)
SELECT public.current_user_id();

-- Con JWT simulado
SET request.jwt.claims = '{"sub": "tu-user-uuid-aqui", "role": "authenticated"}';
SELECT public.current_user_id();
RESET request.jwt.claims;

-- ============================================
-- 12. LOGS Y AUDITORÍA
-- ============================================

-- Ver últimos cambios en tablas (si pg_stat_user_tables está habilitado)
SELECT
  schemaname,
  relname as table_name,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  last_vacuum,
  last_autovacuum
FROM pg_stat_user_tables
WHERE schemaname IN ('public', 'next_auth')
ORDER BY schemaname, relname;

-- ============================================
-- 13. VERIFICAR ÍNDICES
-- ============================================

-- Ver índices en next_auth
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'next_auth'
ORDER BY tablename, indexname;

-- Ver índices en public (books, highlights)
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights')
ORDER BY tablename, indexname;

-- ============================================
-- 14. PERFORMANCE
-- ============================================

-- Queries lentas en tablas de next_auth (requiere pg_stat_statements)
-- SELECT 
--   query,
--   calls,
--   total_time,
--   mean_time,
--   max_time
-- FROM pg_stat_statements
-- WHERE query LIKE '%next_auth%'
-- ORDER BY mean_time DESC
-- LIMIT 10;

-- Tamaño de tablas
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname IN ('public', 'next_auth')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================
-- 15. LIMPIAR DATOS EXPIRADOS (Mantenimiento)
-- ============================================

-- Ver tokens expirados
SELECT COUNT(*) as expired_tokens
FROM next_auth.verification_tokens
WHERE expires < NOW();

-- Eliminar tokens expirados (CUIDADO: solo ejecutar si estás seguro)
-- DELETE FROM next_auth.verification_tokens WHERE expires < NOW();

-- Ver sesiones expiradas
SELECT COUNT(*) as expired_sessions
FROM next_auth.sessions
WHERE expires < NOW();

-- Eliminar sesiones expiradas (CUIDADO: solo ejecutar si estás seguro)
-- DELETE FROM next_auth.sessions WHERE expires < NOW();

-- ============================================
-- 16. COMPARAR ANTES/DESPUÉS
-- ============================================

-- Comparar conteos antes y después de migración
-- (ejecutar antes de migrar y guardar resultados)
SELECT 
  'Usuarios en auth.users' as metric,
  COUNT(*) as count
FROM auth.users
WHERE email_confirmed_at IS NOT NULL

UNION ALL

SELECT 
  'Usuarios en next_auth.users' as metric,
  COUNT(*) as count
FROM next_auth.users

UNION ALL

SELECT 
  'Libros total' as metric,
  COUNT(*) as count
FROM public.books

UNION ALL

SELECT 
  'Highlights total' as metric,
  COUNT(*) as count
FROM public.highlights;

-- ============================================
-- 17. HELPERS DE DEBUGGING
-- ============================================

-- Función para ver claims del JWT actual
CREATE OR REPLACE FUNCTION public.debug_jwt_claims()
RETURNS json
LANGUAGE sql
STABLE
AS $$
  SELECT current_setting('request.jwt.claims', true)::json;
$$;

-- Uso:
-- SELECT public.debug_jwt_claims();

-- ============================================
-- 18. VERIFICAR SCHEMA COMPLETO
-- ============================================

-- Ver todas las tablas en next_auth
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_schema = 'next_auth' AND c.table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'next_auth'
ORDER BY table_name;

-- Ver columnas de cada tabla
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'next_auth'
ORDER BY table_name, ordinal_position;

-- ============================================
-- NOTA FINAL
-- ============================================
-- Estos comandos son para debugging y monitoreo
-- No ejecutar todos a la vez
-- Usar según necesidad específica
-- Algunos requieren permisos de superuser
