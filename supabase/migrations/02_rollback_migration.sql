-- ============================================
-- ROLLBACK: REVERTIR MIGRACIÓN A NEXTAUTH
-- ============================================
-- Solo ejecutar si la migración falla o necesitas revertir
-- ADVERTENCIA: Esto eliminará el schema next_auth y restaurará FKs a auth.users

BEGIN;

-- ============================================
-- PASO 1: RESTAURAR FOREIGN KEYS
-- ============================================

-- Eliminar FKs que apuntan a next_auth.users
ALTER TABLE public.books 
DROP CONSTRAINT IF EXISTS books_user_id_fkey;

ALTER TABLE public.highlights 
DROP CONSTRAINT IF EXISTS highlights_user_id_fkey;

-- Restaurar FKs a auth.users
ALTER TABLE public.books
ADD CONSTRAINT books_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE public.highlights
ADD CONSTRAINT highlights_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

-- ============================================
-- PASO 2: RESTAURAR POLÍTICAS RLS ORIGINALES
-- ============================================

-- Eliminar políticas de NextAuth
DROP POLICY IF EXISTS books_select_own ON public.books;
DROP POLICY IF EXISTS books_insert_own ON public.books;
DROP POLICY IF EXISTS books_update_own ON public.books;
DROP POLICY IF EXISTS books_delete_own ON public.books;

DROP POLICY IF EXISTS highlights_select_own ON public.highlights;
DROP POLICY IF EXISTS highlights_insert_own ON public.highlights;
DROP POLICY IF EXISTS highlights_update_own ON public.highlights;
DROP POLICY IF EXISTS highlights_delete_own ON public.highlights;

-- Restaurar políticas originales (ajustar según tus políticas anteriores)
-- Nota: Estas son las políticas típicas de Supabase Auth
CREATE POLICY books_select_own ON public.books
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY books_insert_own ON public.books
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY books_update_own ON public.books
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY books_delete_own ON public.books
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY highlights_select_own ON public.highlights
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY highlights_insert_own ON public.highlights
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY highlights_update_own ON public.highlights
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY highlights_delete_own ON public.highlights
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ============================================
-- PASO 3: ELIMINAR FUNCIÓN AUXILIAR
-- ============================================

DROP FUNCTION IF EXISTS public.current_user_id();

-- ============================================
-- PASO 4: ELIMINAR SCHEMA NEXT_AUTH
-- ============================================

-- ADVERTENCIA: Esto eliminará todos los datos de next_auth
-- Solo ejecutar si estás seguro

DROP SCHEMA IF EXISTS next_auth CASCADE;

-- ============================================
-- PASO 5: VERIFICACIÓN
-- ============================================

DO $$
DECLARE
  fks_count INTEGER;
  policies_count INTEGER;
  schema_exists BOOLEAN;
BEGIN
  -- Verificar FKs
  SELECT COUNT(*) INTO fks_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name IN ('books', 'highlights')
    AND constraint_name LIKE '%_user_id_fkey';
  
  -- Verificar políticas
  SELECT COUNT(*) INTO policies_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('books', 'highlights');
  
  -- Verificar schema
  SELECT EXISTS (
    SELECT 1 FROM information_schema.schemata WHERE schema_name = 'next_auth'
  ) INTO schema_exists;
  
  RAISE NOTICE '================================================';
  RAISE NOTICE 'RESUMEN DE ROLLBACK';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Foreign Keys restauradas: %', fks_count;
  RAISE NOTICE 'Políticas RLS restauradas: %', policies_count;
  RAISE NOTICE 'Schema next_auth existe: %', schema_exists;
  RAISE NOTICE '================================================';
  
  IF fks_count = 2 AND policies_count = 8 AND NOT schema_exists THEN
    RAISE NOTICE '✓ Rollback completado exitosamente';
  ELSE
    RAISE WARNING '⚠ Verificar configuración. Algo puede estar incorrecto.';
  END IF;
END $$;

COMMIT;

-- ============================================
-- NOTA IMPORTANTE
-- ============================================
-- Después de ejecutar este rollback:
-- 1. Reiniciar servicios de Supabase en Coolify
-- 2. Verificar que auth.users funciona correctamente
-- 3. Probar login con Supabase Auth
-- 4. Verificar que RLS funciona con auth.uid()
