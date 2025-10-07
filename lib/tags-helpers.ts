import { supabase } from './supabaseClient';
import type { Tag, HighlightTag, Highlight, Book } from './types';

// ============================================
// FUNCIONES CRUD PARA TAGS
// ============================================

/**
 * Obtener todas las etiquetas del usuario con conteo de highlights
 */
export async function getUserTags(): Promise<Tag[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { data: tags, error } = await supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching user tags:', error);
    throw new Error('Could not fetch tags');
  }

  // Obtener el conteo de highlights por cada tag (solo los que realmente existen y pertenecen al usuario)
  const tagsWithCount = await Promise.all(
    tags.map(async (tag) => {
      // Obtener IDs de highlights desde highlight_tags
      const { data: highlightTags, error: htError } = await supabase
        .from('highlight_tags')
        .select('highlight_id')
        .eq('tag_id', tag.id);

      if (htError) {
        console.error(`Error fetching highlight_tags for tag ${tag.id}:`, htError);
        return {
          ...tag,
          highlight_count: 0
        };
      }

      if (!highlightTags || highlightTags.length === 0) {
        return {
          ...tag,
          highlight_count: 0
        };
      }

      // Contar cuántos de esos highlights realmente existen y pertenecen al usuario
      const highlightIds = highlightTags.map(ht => ht.highlight_id);
      const { count, error: countError } = await supabase
        .from('highlights')
        .select('*', { count: 'exact', head: true })
        .in('id', highlightIds)
        .eq('user_id', user.id);

      if (countError) {
        console.error(`Error counting highlights for tag ${tag.id}:`, countError);
      }

      return {
        ...tag,
        highlight_count: count || 0
      };
    })
  );

  return tagsWithCount as Tag[];
}

/**
 * Crear una nueva etiqueta
 */
export async function createTag(name: string): Promise<Tag> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Validar longitud del nombre
  const trimmedName = name.trim();
  if (trimmedName.length === 0 || trimmedName.length > 50) {
    throw new Error('Tag name must be between 1 and 50 characters');
  }

  // Verificar si ya existe
  const { data: existing } = await supabase
    .from('tags')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', trimmedName)
    .single();

  if (existing) {
    throw new Error(`Tag "${trimmedName}" already exists`);
  }

  const { data, error } = await supabase
    .from('tags')
    .insert({ user_id: user.id, name: trimmedName })
    .select()
    .single();

  if (error) {
    console.error('Error creating tag:', error);
    throw new Error('Could not create tag');
  }

  return data as Tag;
}

/**
 * Actualizar el nombre de una etiqueta
 */
export async function updateTag(tagId: string, newName: string): Promise<Tag> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Validar longitud del nombre
  const trimmedName = newName.trim();
  if (trimmedName.length === 0 || trimmedName.length > 50) {
    throw new Error('Tag name must be between 1 and 50 characters');
  }

  // Verificar si ya existe otra tag con ese nombre
  const { data: existing } = await supabase
    .from('tags')
    .select('id')
    .eq('user_id', user.id)
    .eq('name', trimmedName)
    .neq('id', tagId)
    .single();

  if (existing) {
    throw new Error(`Tag "${trimmedName}" already exists`);
  }

  const { data, error } = await supabase
    .from('tags')
    .update({ name: trimmedName })
    .eq('id', tagId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating tag:', error);
    throw new Error('Could not update tag');
  }

  return data as Tag;
}

/**
 * Eliminar una etiqueta (y todas sus relaciones)
 */
export async function deleteTag(tagId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error deleting tag:', error);
    throw new Error('Could not delete tag');
  }
}

// ============================================
// FUNCIONES PARA HIGHLIGHT_TAGS (Relaciones)
// ============================================

/**
 * Obtener todas las etiquetas de un highlight
 */
export async function getHighlightTags(highlightId: string): Promise<Tag[]> {
  const { data, error } = await supabase
    .from('highlight_tags')
    .select(`
      tags (
        id,
        user_id,
        name,
        created_at
      )
    `)
    .eq('highlight_id', highlightId);

  if (error) {
    console.error(`Error fetching tags for highlight ${highlightId}:`, error);
    throw new Error('Could not fetch highlight tags');
  }

  return data.map((item: any) => item.tags) as Tag[];
}

/**
 * Añadir una etiqueta a un highlight
 * Máximo 10 etiquetas por highlight
 */
export async function addTagToHighlight(highlightId: string, tagId: string): Promise<HighlightTag> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Verificar límite de 10 etiquetas
  const currentTags = await getHighlightTags(highlightId);
  if (currentTags.length >= 10) {
    throw new Error('Maximum 10 tags per highlight reached');
  }

  // Verificar que la etiqueta pertenece al usuario
  const { data: tag } = await supabase
    .from('tags')
    .select('id')
    .eq('id', tagId)
    .eq('user_id', user.id)
    .single();

  if (!tag) {
    throw new Error('Tag not found or does not belong to user');
  }

  // Verificar que el highlight pertenece al usuario
  const { data: highlight } = await supabase
    .from('highlights')
    .select('id')
    .eq('id', highlightId)
    .eq('user_id', user.id)
    .single();

  if (!highlight) {
    throw new Error('Highlight not found or does not belong to user');
  }

  const { data, error } = await supabase
    .from('highlight_tags')
    .insert({ highlight_id: highlightId, tag_id: tagId })
    .select()
    .single();

  if (error) {
    // Si es error de duplicado, ignorar
    if (error.code === '23505') {
      throw new Error('Tag already added to this highlight');
    }
    console.error('Error adding tag to highlight:', error);
    throw new Error('Could not add tag to highlight');
  }

  return data as HighlightTag;
}

/**
 * Quitar una etiqueta de un highlight
 */
export async function removeTagFromHighlight(highlightId: string, tagId: string): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Verificar que el highlight pertenece al usuario
  const { data: highlight } = await supabase
    .from('highlights')
    .select('id')
    .eq('id', highlightId)
    .eq('user_id', user.id)
    .single();

  if (!highlight) {
    throw new Error('Highlight not found or does not belong to user');
  }

  const { error } = await supabase
    .from('highlight_tags')
    .delete()
    .eq('highlight_id', highlightId)
    .eq('tag_id', tagId);

  if (error) {
    console.error('Error removing tag from highlight:', error);
    throw new Error('Could not remove tag from highlight');
  }
}

/**
 * Actualizar todas las etiquetas de un highlight de una vez
 * (Útil para componentes que manejan múltiples tags)
 */
export async function setHighlightTags(highlightId: string, tagIds: string[]): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // Validar máximo de 10 etiquetas
  if (tagIds.length > 10) {
    throw new Error('Maximum 10 tags per highlight');
  }

  // Verificar que el highlight pertenece al usuario
  const { data: highlight } = await supabase
    .from('highlights')
    .select('id')
    .eq('id', highlightId)
    .eq('user_id', user.id)
    .single();

  if (!highlight) {
    throw new Error('Highlight not found or does not belong to user');
  }

  // 1. Eliminar todas las etiquetas actuales
  await supabase
    .from('highlight_tags')
    .delete()
    .eq('highlight_id', highlightId);

  // 2. Insertar las nuevas (si hay)
  if (tagIds.length > 0) {
    const inserts = tagIds.map(tagId => ({
      highlight_id: highlightId,
      tag_id: tagId
    }));

    const { error } = await supabase
      .from('highlight_tags')
      .insert(inserts);

    if (error) {
      console.error('Error setting highlight tags:', error);
      throw new Error('Could not set highlight tags');
    }
  }
}

// ============================================
// FUNCIONES DE BÚSQUEDA Y FILTRADO
// ============================================

/**
 * Obtener todos los highlights de una etiqueta específica
 */
export async function getHighlightsByTag(tagId: string): Promise<Highlight[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // 1. Obtener IDs de highlights desde highlight_tags
  const { data: highlightTags, error: tagsError } = await supabase
    .from('highlight_tags')
    .select('highlight_id')
    .eq('tag_id', tagId)
    .order('created_at', { ascending: false });

  if (tagsError) {
    console.error(`Error fetching highlight_tags for tag ${tagId}:`, tagsError);
    throw new Error('Could not fetch highlights for tag');
  }

  if (!highlightTags || highlightTags.length === 0) {
    return [];
  }

  // 2. Obtener highlights usando los IDs
  const highlightIds = highlightTags.map(ht => ht.highlight_id);
  
  const { data: highlights, error: highlightsError } = await supabase
    .from('highlights')
    .select('*')
    .in('id', highlightIds)
    .eq('user_id', user.id);

  if (highlightsError) {
    console.error(`Error fetching highlights:`, highlightsError);
    throw new Error('Could not fetch highlights');
  }

  // Mapear snake_case a camelCase
  return highlights.map((h: any) => ({
    id: h.id,
    bookId: h.book_id,  // ← Mapeo de snake_case a camelCase
    text: h.text,
    note: h.note,
    location: h.location,
    page: h.page,
    addedAt: h.added_at || h.addedAt,
    hash: h.hash,
  })) as Highlight[];
}

/**
 * Obtener highlights de una etiqueta agrupados por libro
 * (Para exportación)
 */
export async function getHighlightsByTagGroupedByBook(tagId: string): Promise<{
  book: Book;
  highlights: Highlight[];
}[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  // 1. Obtener todos los highlights de la etiqueta
  const highlights = await getHighlightsByTag(tagId);

  // Si no hay highlights, retornar array vacío
  if (highlights.length === 0) {
    return [];
  }

  // 2. Obtener los libros únicos (filtrar undefined/null)
  const bookIds = [...new Set(
    highlights
      .map(h => h.bookId)
      .filter(id => id !== undefined && id !== null)
  )];

  // Si no hay bookIds válidos, retornar array vacío
  if (bookIds.length === 0) {
    console.warn('No valid book IDs found for highlights');
    return [];
  }

  // 3. Fetch books
  const { data: books, error } = await supabase
    .from('books')
    .select('*')
    .in('id', bookIds)
    .eq('user_id', user.id);

  if (error) {
    console.error('Error fetching books:', error);
    throw new Error('Could not fetch books');
  }

  if (!books || books.length === 0) {
    return [];
  }

  // 4. Agrupar highlights por libro
  const grouped = books.map(book => ({
    book: book as Book,
    highlights: highlights.filter(h => h.bookId === book.id)
  }));

  return grouped;
}

/**
 * Buscar etiquetas por nombre (para autocompletado)
 * Si query está vacío, devuelve todas las etiquetas
 */
export async function searchTags(query: string): Promise<Tag[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');

  let queryBuilder = supabase
    .from('tags')
    .select('*')
    .eq('user_id', user.id);

  // Solo aplicar filtro de búsqueda si hay query
  if (query.trim().length > 0) {
    queryBuilder = queryBuilder.ilike('name', `%${query}%`);
  }

  const { data: tags, error } = await queryBuilder
    .order('name', { ascending: true })
    .limit(20);

  if (error) {
    console.error('Error searching tags:', error);
    throw new Error('Could not search tags');
  }

  // Obtener el conteo de highlights por cada tag (solo los que realmente existen y pertenecen al usuario)
  const tagsWithCount = await Promise.all(
    tags.map(async (tag) => {
      // Obtener IDs de highlights desde highlight_tags
      const { data: highlightTags, error: htError } = await supabase
        .from('highlight_tags')
        .select('highlight_id')
        .eq('tag_id', tag.id);

      if (htError) {
        console.error(`Error fetching highlight_tags for tag ${tag.id}:`, htError);
        return {
          ...tag,
          highlight_count: 0
        };
      }

      if (!highlightTags || highlightTags.length === 0) {
        return {
          ...tag,
          highlight_count: 0
        };
      }

      // Contar cuántos de esos highlights realmente existen y pertenecen al usuario
      const highlightIds = highlightTags.map(ht => ht.highlight_id);
      const { count, error: countError } = await supabase
        .from('highlights')
        .select('*', { count: 'exact', head: true })
        .in('id', highlightIds)
        .eq('user_id', user.id);

      if (countError) {
        console.error(`Error counting highlights for tag ${tag.id}:`, countError);
      }

      return {
        ...tag,
        highlight_count: count || 0
      };
    })
  );

  return tagsWithCount as Tag[];
}

