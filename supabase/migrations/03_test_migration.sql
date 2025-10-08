-- ============================================
-- TESTS POST-MIGRACIÓN
-- ============================================
-- Ejecutar DESPUÉS de la migración para verificar que todo funciona

-- ============================================
-- TEST 1: Verificar Schema y Tablas
-- ============================================

SELECT 'TEST 1: Verificando schema next_auth...' as test;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.schemata WHERE schema_name = 'next_auth'
    ) THEN '✓ Schema next_auth existe'
    ELSE '✗ Schema next_auth NO existe'
  END as result;

SELECT 
  table_name,
  CASE 
    WHEN table_name IN ('users', 'accounts', 'sessions', 'verification_tokens')
    THEN '✓ Existe'
    ELSE '✗ Falta'
  END as status
FROM information_schema.tables
WHERE table_schema = 'next_auth'
ORDER BY table_name;

-- ============================================
-- TEST 2: Verificar Migración de Usuarios
-- ============================================

SELECT 'TEST 2: Verificando migración de usuarios...' as test;

-- Contar usuarios en ambas tablas
SELECT 
  (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) as auth_users_confirmed,
  (SELECT COUNT(*) FROM next_auth.users) as nextauth_users,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL) = 
         (SELECT COUNT(*) FROM next_auth.users)
    THEN '✓ Migración correcta'
    ELSE '✗ Discrepancia en conteo'
  END as result;

-- Verificar que todos los usuarios tienen el mismo UUID
SELECT 
  COUNT(*) as usuarios_sin_migrar
FROM auth.users au
WHERE au.email_confirmed_at IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM next_auth.users nu WHERE nu.id = au.id
  );

-- ============================================
-- TEST 3: Verificar Foreign Keys
-- ============================================

SELECT 'TEST 3: Verificando Foreign Keys...' as test;

SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_schema || '.' || ccu.table_name AS references_table,
  ccu.column_name AS references_column,
  CASE 
    WHEN ccu.table_schema = 'next_auth' AND ccu.table_name = 'users'
    THEN '✓ FK correcta'
    ELSE '✗ FK incorrecta'
  END as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('books', 'highlights')
  AND kcu.column_name = 'user_id';

-- ============================================
-- TEST 4: Verificar Políticas RLS
-- ============================================

SELECT 'TEST 4: Verificando políticas RLS...' as test;

-- Contar políticas por tabla
SELECT 
  tablename,
  COUNT(*) as policy_count,
  CASE 
    WHEN COUNT(*) = 4 THEN '✓ 4 políticas (correcto)'
    ELSE '✗ Número incorrecto de políticas'
  END as status
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights')
GROUP BY tablename;

-- Verificar que las políticas usan auth.jwt()
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN qual LIKE '%auth.jwt()%' OR with_check LIKE '%auth.jwt()%'
    THEN '✓ Usa auth.jwt()'
    ELSE '✗ No usa auth.jwt()'
  END as uses_jwt
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights')
ORDER BY tablename, policyname;

-- ============================================
-- TEST 5: Verificar RLS Habilitado
-- ============================================

SELECT 'TEST 5: Verificando que RLS está habilitado...' as test;

SELECT
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity = true THEN '✓ RLS habilitado'
    ELSE '✗ RLS NO habilitado'
  END as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights');

-- ============================================
-- TEST 6: Verificar Datos Huérfanos
-- ============================================

SELECT 'TEST 6: Verificando datos huérfanos...' as test;

-- Verificar libros sin usuario
SELECT 
  'books' as table_name,
  COUNT(*) as orphaned_records,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Sin datos huérfanos'
    ELSE '✗ Existen datos huérfanos'
  END as status
FROM public.books b
WHERE NOT EXISTS (
  SELECT 1 FROM next_auth.users u WHERE u.id = b.user_id
)

UNION ALL

-- Verificar highlights sin usuario
SELECT 
  'highlights' as table_name,
  COUNT(*) as orphaned_records,
  CASE 
    WHEN COUNT(*) = 0 THEN '✓ Sin datos huérfanos'
    ELSE '✗ Existen datos huérfanos'
  END as status
FROM public.highlights h
WHERE NOT EXISTS (
  SELECT 1 FROM next_auth.users u WHERE u.id = h.user_id
);

-- ============================================
-- TEST 7: Verificar Permisos
-- ============================================

SELECT 'TEST 7: Verificando permisos...' as test;

SELECT 
  table_schema,
  table_name,
  string_agg(privilege_type, ', ') as privileges,
  grantee
FROM information_schema.table_privileges
WHERE table_schema = 'next_auth'
  AND grantee IN ('authenticated', 'anon')
GROUP BY table_schema, table_name, grantee
ORDER BY table_name, grantee;

-- ============================================
-- TEST 8: Verificar Índices
-- ============================================

SELECT 'TEST 8: Verificando índices...' as test;

SELECT
  schemaname,
  tablename,
  indexname,
  '✓ Índice existe' as status
FROM pg_indexes
WHERE schemaname = 'next_auth'
ORDER BY tablename, indexname;

-- ============================================
-- TEST 9: Verificar Función Auxiliar
-- ============================================

SELECT 'TEST 9: Verificando función current_user_id...' as test;

SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc 
      WHERE proname = 'current_user_id' 
      AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ) THEN '✓ Función current_user_id existe'
    ELSE '✗ Función current_user_id NO existe'
  END as result;

-- ============================================
-- TEST 10: Verificar Triggers
-- ============================================

SELECT 'TEST 10: Verificando triggers updated_at...' as test;

SELECT
  event_object_schema,
  event_object_table,
  trigger_name,
  '✓ Trigger existe' as status
FROM information_schema.triggers
WHERE event_object_schema = 'next_auth'
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table;

-- ============================================
-- RESUMEN FINAL
-- ============================================

SELECT 
  '================================================' as line
UNION ALL
SELECT 'RESUMEN DE TESTS' as line
UNION ALL
SELECT '================================================' as line
UNION ALL
SELECT 
  'Total de usuarios migrados: ' || COUNT(*)::text
FROM next_auth.users
UNION ALL
SELECT 
  'Total de libros: ' || COUNT(*)::text
FROM public.books
UNION ALL
SELECT 
  'Total de highlights: ' || COUNT(*)::text
FROM public.highlights
UNION ALL
SELECT 
  'Políticas RLS: ' || COUNT(*)::text
FROM pg_policies
WHERE schemaname = 'public' AND tablename IN ('books', 'highlights')
UNION ALL
SELECT 
  'Foreign Keys: ' || COUNT(*)::text
FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY'
  AND table_schema = 'public'
  AND table_name IN ('books', 'highlights')
UNION ALL
SELECT '================================================' as line;

-- ============================================
-- TEST MANUAL: Simular JWT
-- ============================================

-- Este test requiere un JWT válido firmado con SUPABASE_JWT_SECRET
-- Ejemplo de cómo testearlo manualmente:

/*
-- 1. Obtener un usuario de prueba
SELECT id, email FROM next_auth.users LIMIT 1;

-- 2. En tu aplicación, generar un JWT con ese user_id
-- 3. Hacer una query con ese JWT:

SET request.jwt.claims = '{"sub": "uuid-del-usuario", "role": "authenticated"}';

-- 4. Verificar que RLS funciona:
SELECT * FROM public.books; -- Debería mostrar solo libros del usuario
SELECT * FROM public.highlights; -- Debería mostrar solo highlights del usuario

-- 5. Intentar acceder a datos de otro usuario (debería fallar):
INSERT INTO public.books (user_id, title) 
VALUES ('uuid-de-otro-usuario', 'Test'); -- Debería dar error RLS
*/

-- ============================================
-- NOTA FINAL
-- ============================================

SELECT 
  '================================================' as message
UNION ALL
SELECT 'Si todos los tests muestran ✓, la migración fue exitosa.' as message
UNION ALL
SELECT 'Si algún test muestra ✗, revisar la sección correspondiente.' as message
UNION ALL
SELECT 'Siguiente paso: Configurar NextAuth en la aplicación.' as message
UNION ALL
SELECT '================================================' as message;
