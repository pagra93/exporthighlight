-- Esquema de base de datos para Supabase
-- FASE 2: Auth + Persistencia + Export masivo

-- ============================================
-- TABLA: books
-- Almacena los libros procesados de cada usuario
-- ============================================

CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  author TEXT,
  asin TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS books_user_id_idx ON public.books(user_id);
CREATE INDEX IF NOT EXISTS books_title_idx ON public.books(title);

-- ============================================
-- TABLA: highlights
-- Almacena los highlights/notas de cada libro
-- ============================================

CREATE TABLE IF NOT EXISTS public.highlights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  note TEXT,
  location TEXT,
  page INT,
  added_at TIMESTAMPTZ,
  hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Constraint: Un highlight es único por usuario y hash
  CONSTRAINT unique_user_highlight UNIQUE(user_id, hash)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS highlights_user_id_idx ON public.highlights(user_id);
CREATE INDEX IF NOT EXISTS highlights_book_id_idx ON public.highlights(book_id);
CREATE INDEX IF NOT EXISTS highlights_hash_idx ON public.highlights(hash);

-- ============================================
-- TABLA: counters
-- Almacena contadores globales para el landing
-- ============================================

CREATE TABLE IF NOT EXISTS public.counters (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  total_books BIGINT DEFAULT 0,
  total_highlights BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar registro inicial
INSERT INTO public.counters (total_books, total_highlights) 
VALUES (0, 0)
ON CONFLICT DO NOTHING;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.counters ENABLE ROW LEVEL SECURITY;

-- Políticas para books
CREATE POLICY "Users can view their own books"
  ON public.books FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own books"
  ON public.books FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own books"
  ON public.books FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own books"
  ON public.books FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para highlights
CREATE POLICY "Users can view their own highlights"
  ON public.highlights FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own highlights"
  ON public.highlights FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own highlights"
  ON public.highlights FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own highlights"
  ON public.highlights FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para counters (solo lectura para todos)
CREATE POLICY "Anyone can view counters"
  ON public.counters FOR SELECT
  TO PUBLIC
  USING (true);

-- Solo admins pueden actualizar counters (o usar una función)
CREATE POLICY "Service role can update counters"
  ON public.counters FOR UPDATE
  USING (auth.role() = 'service_role');

-- ============================================
-- FUNCIONES
-- ============================================

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para books
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FUNCIÓN: increment_counters
-- Incrementa los contadores globales (llamada desde backend)
-- ============================================

CREATE OR REPLACE FUNCTION increment_counters(books_count INT, highlights_count INT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.counters
  SET 
    total_books = total_books + books_count,
    total_highlights = total_highlights + highlights_count,
    updated_at = NOW()
  WHERE id = 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dar permisos de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION increment_counters(INT, INT) TO authenticated;

-- ============================================
-- COMENTARIOS
-- ============================================

COMMENT ON TABLE public.books IS 'Libros procesados de cada usuario';
COMMENT ON TABLE public.highlights IS 'Highlights y notas extraídos de los libros';
COMMENT ON TABLE public.counters IS 'Contadores globales para mostrar en el landing';
COMMENT ON FUNCTION increment_counters(INT, INT) IS 'Incrementa los contadores globales cuando un usuario exporta';

