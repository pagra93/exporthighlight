-- ============================================
-- SCHEMA PARA SISTEMA DE ETIQUETAS
-- ============================================

-- 1. Tabla de etiquetas (simplificada, sin color/emoji)
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name varchar(50) NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Constraints
  CONSTRAINT unique_user_tag UNIQUE (user_id, name),
  CONSTRAINT name_not_empty CHECK (length(trim(name)) > 0)
);

-- 2. Tabla de relación highlight-tag (muchos a muchos)
CREATE TABLE IF NOT EXISTS highlight_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  highlight_id uuid NOT NULL REFERENCES highlights(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  
  -- Evitar duplicados
  CONSTRAINT unique_highlight_tag UNIQUE (highlight_id, tag_id)
);

-- 3. Índices para performance
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_highlight_tags_highlight_id ON highlight_tags(highlight_id);
CREATE INDEX IF NOT EXISTS idx_highlight_tags_tag_id ON highlight_tags(tag_id);

-- 4. Row Level Security (RLS)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight_tags ENABLE ROW LEVEL SECURITY;

-- Políticas para tags
DROP POLICY IF EXISTS "Users can view their own tags" ON tags;
CREATE POLICY "Users can view their own tags"
  ON tags FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own tags" ON tags;
CREATE POLICY "Users can create their own tags"
  ON tags FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own tags" ON tags;
CREATE POLICY "Users can update their own tags"
  ON tags FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own tags" ON tags;
CREATE POLICY "Users can delete their own tags"
  ON tags FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas para highlight_tags
DROP POLICY IF EXISTS "Users can view their own highlight_tags" ON highlight_tags;
CREATE POLICY "Users can view their own highlight_tags"
  ON highlight_tags FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM highlights
      WHERE highlights.id = highlight_tags.highlight_id
      AND highlights.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create their own highlight_tags" ON highlight_tags;
CREATE POLICY "Users can create their own highlight_tags"
  ON highlight_tags FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM highlights
      WHERE highlights.id = highlight_tags.highlight_id
      AND highlights.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete their own highlight_tags" ON highlight_tags;
CREATE POLICY "Users can delete their own highlight_tags"
  ON highlight_tags FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM highlights
      WHERE highlights.id = highlight_tags.highlight_id
      AND highlights.user_id = auth.uid()
    )
  );

-- 5. Función para contar highlights por tag (útil para el sidebar)
CREATE OR REPLACE FUNCTION get_tag_highlight_count(tag_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM highlight_tags
  WHERE tag_id = tag_uuid;
$$;

-- 6. Vista para facilitar queries (opcional pero útil)
CREATE OR REPLACE VIEW tags_with_counts AS
SELECT 
  t.*,
  COUNT(ht.id) as highlight_count
FROM tags t
LEFT JOIN highlight_tags ht ON t.id = ht.tag_id
GROUP BY t.id, t.user_id, t.name, t.created_at;

COMMENT ON VIEW tags_with_counts IS 'Vista que incluye el conteo de highlights por tag';

