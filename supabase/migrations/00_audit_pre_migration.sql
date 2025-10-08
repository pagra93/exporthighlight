-- ============================================
-- FASE 0.1: AUDITORÍA PREVIA A LA MIGRACIÓN
-- ============================================
-- Ejecutar ANTES de cualquier cambio para conocer el estado actual
-- Guarda los resultados para comparar después

-- 1. Contar usuarios en auth.users (Supabase Auth)
SELECT 
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NOT NULL) as confirmed_users,
  COUNT(*) FILTER (WHERE email_confirmed_at IS NULL) as unconfirmed_users
FROM auth.users;

-- 2. Contar libros y highlights
SELECT 
  (SELECT COUNT(*) FROM public.books) as total_books,
  (SELECT COUNT(*) FROM public.highlights) as total_highlights;

-- 3. Verificar usuarios con datos
SELECT 
  COUNT(DISTINCT user_id) as users_with_books
FROM public.books;

SELECT 
  COUNT(DISTINCT user_id) as users_with_highlights
FROM public.highlights;

-- 4. Verificar estructura actual de FKs
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN ('books', 'highlights');

-- 5. Verificar políticas RLS actuales
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights')
ORDER BY tablename, policyname;

-- 6. Verificar si RLS está habilitado
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('books', 'highlights');

-- 7. Verificar si el schema next_auth ya existe
SELECT schema_name
FROM information_schema.schemata
WHERE schema_name = 'next_auth';

-- 8. Verificar datos huérfanos (si existen)
SELECT 
  'books' as table_name,
  COUNT(*) as orphaned_records
FROM public.books b
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = b.user_id
)
UNION ALL
SELECT 
  'highlights' as table_name,
  COUNT(*) as orphaned_records
FROM public.highlights h
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users u WHERE u.id = h.user_id
);

-- ============================================
-- RESULTADOS ESPERADOS:
-- ============================================
-- Guarda estos resultados en un archivo antes de continuar
-- Te ayudarán a verificar que la migración fue exitosa
