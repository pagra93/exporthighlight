-- ============================================
-- FASE 1: MIGRACIÓN A NEXTAUTH
-- ============================================
-- Este script migra de Supabase Auth a NextAuth manteniendo RLS intacto
-- Ejecutar después de revisar los resultados de 00_audit_pre_migration.sql

-- ============================================
-- PASO 1: BACKUP Y PREPARACIÓN
-- ============================================

-- IMPORTANTE: Antes de ejecutar este script:
-- 1. Hacer backup completo de la base de datos
-- 2. Ejecutar 00_audit_pre_migration.sql y guardar resultados
-- 3. Verificar que tienes acceso de superusuario o postgres role
-- 4. Ejecutar en entorno de staging primero

BEGIN;

-- ============================================
-- PASO 2: CREAR SCHEMA NEXT_AUTH
-- ============================================

-- Crear schema si no existe
CREATE SCHEMA IF NOT EXISTS next_auth;

-- Dar permisos necesarios
GRANT USAGE ON SCHEMA next_auth TO postgres;
GRANT ALL ON ALL TABLES IN SCHEMA next_auth TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA next_auth TO postgres;

-- Permitir que anon y authenticated accedan (necesario para el adapter)
GRANT USAGE ON SCHEMA next_auth TO anon;
GRANT USAGE ON SCHEMA next_auth TO authenticated;

-- ============================================
-- PASO 3: CREAR TABLAS DEL ADAPTER
-- ============================================

-- Tabla de usuarios (fuente única de verdad)
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de cuentas (providers)
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Tabla de sesiones
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de tokens de verificación
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (identifier, token)
);

-- Índices para optimizar queries
CREATE INDEX IF NOT EXISTS accounts_user_id_idx ON next_auth.accounts(user_id);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON next_auth.sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_session_token_idx ON next_auth.sessions(session_token);

-- ============================================
-- PASO 4: MIGRAR USUARIOS EXISTENTES
-- ============================================

-- Migrar usuarios de auth.users a next_auth.users
-- Solo usuarios confirmados para evitar spam
INSERT INTO next_auth.users (id, email, email_verified, created_at, updated_at)
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
FROM auth.users
WHERE email_confirmed_at IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Verificar migración
DO $$
DECLARE
  auth_count INTEGER;
  nextauth_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO auth_count FROM auth.users WHERE email_confirmed_at IS NOT NULL;
  SELECT COUNT(*) INTO nextauth_count FROM next_auth.users;
  
  RAISE NOTICE 'Usuarios en auth.users (confirmados): %', auth_count;
  RAISE NOTICE 'Usuarios migrados a next_auth.users: %', nextauth_count;
  
  IF auth_count != nextauth_count THEN
    RAISE WARNING 'Discrepancia en conteo de usuarios. Verificar migración.';
  END IF;
END $$;

-- ============================================
-- PASO 5: ACTUALIZAR FOREIGN KEYS
-- ============================================

-- Eliminar FKs existentes de books
ALTER TABLE public.books 
DROP CONSTRAINT IF EXISTS books_user_id_fkey;

-- Eliminar FKs existentes de highlights
ALTER TABLE public.highlights 
DROP CONSTRAINT IF EXISTS highlights_user_id_fkey;

-- Crear nuevas FKs apuntando a next_auth.users
ALTER TABLE public.books
ADD CONSTRAINT books_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES next_auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE public.highlights
ADD CONSTRAINT highlights_user_id_fkey
FOREIGN KEY (user_id) 
REFERENCES next_auth.users(id) 
ON DELETE CASCADE;

-- Verificar FKs
DO $$
DECLARE
  fk_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO fk_count
  FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY'
    AND table_schema = 'public'
    AND table_name IN ('books', 'highlights')
    AND constraint_name LIKE '%_user_id_fkey';
  
  RAISE NOTICE 'Foreign Keys configuradas: %', fk_count;
  
  IF fk_count != 2 THEN
    RAISE WARNING 'Deberían existir 2 FKs (books y highlights). Verificar.';
  END IF;
END $$;

-- ============================================
-- PASO 6: CONFIGURAR RLS
-- ============================================

-- Habilitar RLS en las tablas
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores
DROP POLICY IF EXISTS books_select_own ON public.books;
DROP POLICY IF EXISTS books_insert_own ON public.books;
DROP POLICY IF EXISTS books_update_own ON public.books;
DROP POLICY IF EXISTS books_delete_own ON public.books;
DROP POLICY IF EXISTS books_mutate_own ON public.books;

DROP POLICY IF EXISTS highlights_select_own ON public.highlights;
DROP POLICY IF EXISTS highlights_insert_own ON public.highlights;
DROP POLICY IF EXISTS highlights_update_own ON public.highlights;
DROP POLICY IF EXISTS highlights_delete_own ON public.highlights;
DROP POLICY IF EXISTS hl_select_own ON public.highlights;
DROP POLICY IF EXISTS hl_mutate_own ON public.highlights;

-- Crear políticas RLS para BOOKS
-- La clave es usar auth.jwt()->>'sub' que contendrá el UUID del usuario de NextAuth

CREATE POLICY books_select_own ON public.books
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY books_insert_own ON public.books
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY books_update_own ON public.books
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text)
WITH CHECK (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY books_delete_own ON public.books
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text);

-- Crear políticas RLS para HIGHLIGHTS

CREATE POLICY highlights_select_own ON public.highlights
FOR SELECT
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY highlights_insert_own ON public.highlights
FOR INSERT
TO authenticated
WITH CHECK (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY highlights_update_own ON public.highlights
FOR UPDATE
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text)
WITH CHECK (auth.jwt()->>'sub' = user_id::text);

CREATE POLICY highlights_delete_own ON public.highlights
FOR DELETE
TO authenticated
USING (auth.jwt()->>'sub' = user_id::text);

-- Verificar políticas
DO $$
DECLARE
  policy_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
    AND tablename IN ('books', 'highlights');
  
  RAISE NOTICE 'Políticas RLS configuradas: %', policy_count;
  
  IF policy_count != 8 THEN
    RAISE WARNING 'Deberían existir 8 políticas (4 por tabla). Verificar.';
  END IF;
END $$;

-- ============================================
-- PASO 7: PERMISOS PARA TABLAS NEXT_AUTH
-- ============================================

-- Dar permisos necesarios al role authenticated
GRANT SELECT, INSERT, UPDATE, DELETE ON next_auth.users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON next_auth.accounts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON next_auth.sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON next_auth.verification_tokens TO authenticated;

-- Dar permisos a anon para insertar usuarios (registro)
GRANT SELECT, INSERT ON next_auth.users TO anon;
GRANT INSERT ON next_auth.verification_tokens TO anon;

-- ============================================
-- PASO 8: FUNCIÓN AUXILIAR PARA DEBUG
-- ============================================

-- Función para verificar el JWT actual (útil para debugging)
CREATE OR REPLACE FUNCTION public.current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::uuid;
$$;

-- ============================================
-- PASO 9: TRIGGERS PARA UPDATED_AT
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION next_auth.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a todas las tablas
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON next_auth.users
  FOR EACH ROW
  EXECUTE FUNCTION next_auth.update_updated_at();

CREATE TRIGGER accounts_updated_at
  BEFORE UPDATE ON next_auth.accounts
  FOR EACH ROW
  EXECUTE FUNCTION next_auth.update_updated_at();

CREATE TRIGGER sessions_updated_at
  BEFORE UPDATE ON next_auth.sessions
  FOR EACH ROW
  EXECUTE FUNCTION next_auth.update_updated_at();

-- ============================================
-- PASO 10: VERIFICACIÓN FINAL
-- ============================================

-- Resumen de la migración
DO $$
DECLARE
  users_count INTEGER;
  books_count INTEGER;
  highlights_count INTEGER;
  policies_count INTEGER;
  fks_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO users_count FROM next_auth.users;
  SELECT COUNT(*) INTO books_count FROM public.books;
  SELECT COUNT(*) INTO highlights_count FROM public.highlights;
  SELECT COUNT(*) INTO policies_count FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('books', 'highlights');
  SELECT COUNT(*) INTO fks_count FROM information_schema.table_constraints WHERE constraint_type = 'FOREIGN KEY' AND table_schema = 'public' AND table_name IN ('books', 'highlights');
  
  RAISE NOTICE '================================================';
  RAISE NOTICE 'RESUMEN DE MIGRACIÓN';
  RAISE NOTICE '================================================';
  RAISE NOTICE 'Usuarios migrados: %', users_count;
  RAISE NOTICE 'Libros existentes: %', books_count;
  RAISE NOTICE 'Highlights existentes: %', highlights_count;
  RAISE NOTICE 'Políticas RLS: %', policies_count;
  RAISE NOTICE 'Foreign Keys: %', fks_count;
  RAISE NOTICE '================================================';
  
  IF policies_count = 8 AND fks_count = 2 THEN
    RAISE NOTICE '✓ Migración completada exitosamente';
  ELSE
    RAISE WARNING '⚠ Verificar configuración. Algo puede estar incorrecto.';
  END IF;
END $$;

COMMIT;

-- ============================================
-- ROLLBACK (Solo si algo sale mal)
-- ============================================
-- Si necesitas revertir, ejecuta:
-- ROLLBACK;
-- Y luego ejecuta 02_rollback_migration.sql
