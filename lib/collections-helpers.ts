import { supabase } from './supabaseClient';
import type { Collection, CollectionBook } from './types';

/**
 * Obtiene todas las colecciones del usuario con contador de libros
 */
export async function getUserCollections(): Promise<Collection[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('collections')
    .select(`
      *,
      collection_books(count)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching collections:', error);
    throw new Error('Error al cargar colecciones');
  }

  // Mapear para añadir book_count
  return (data || []).map((col: any) => ({
    ...col,
    book_count: col.collection_books?.[0]?.count || 0,
  }));
}

/**
 * Crea una nueva colección
 */
export async function createCollection(
  name: string,
  description?: string,
  color: string = '#3B82F6',
  icon: string = '📚'
): Promise<Collection> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('collections')
    .insert({
      user_id: user.id,
      name,
      description,
      color,
      icon,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating collection:', error);
    throw new Error('Error al crear colección');
  }

  return { ...data, book_count: 0 };
}

/**
 * Actualiza una colección
 */
export async function updateCollection(
  collectionId: string,
  updates: Partial<Pick<Collection, 'name' | 'description' | 'color' | 'icon'>>
): Promise<Collection> {
  const { data, error } = await supabase
    .from('collections')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', collectionId)
    .select()
    .single();

  if (error) {
    console.error('Error updating collection:', error);
    throw new Error('Error al actualizar colección');
  }

  return data;
}

/**
 * Elimina una colección
 */
export async function deleteCollection(collectionId: string): Promise<void> {
  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', collectionId);

  if (error) {
    console.error('Error deleting collection:', error);
    throw new Error('Error al eliminar colección');
  }
}

/**
 * Añade un libro a una colección
 */
export async function addBookToCollection(
  collectionId: string,
  bookId: string
): Promise<CollectionBook> {
  const { data, error } = await supabase
    .from('collection_books')
    .insert({
      collection_id: collectionId,
      book_id: bookId,
    })
    .select()
    .single();

  if (error) {
    // Si es error de duplicado, es ok
    if (error.code === '23505') {
      throw new Error('El libro ya está en esta colección');
    }
    console.error('Error adding book to collection:', error);
    throw new Error('Error al añadir libro a colección');
  }

  return data;
}

/**
 * Elimina un libro de una colección
 */
export async function removeBookFromCollection(
  collectionId: string,
  bookId: string
): Promise<void> {
  const { error } = await supabase
    .from('collection_books')
    .delete()
    .eq('collection_id', collectionId)
    .eq('book_id', bookId);

  if (error) {
    console.error('Error removing book from collection:', error);
    throw new Error('Error al eliminar libro de colección');
  }
}

/**
 * Obtiene todos los libros de una colección
 */
export async function getCollectionBooks(collectionId: string) {
  const { data, error } = await supabase
    .from('collection_books')
    .select(`
      *,
      books (
        *,
        highlights (count)
      )
    `)
    .eq('collection_id', collectionId)
    .order('added_at', { ascending: false });

  if (error) {
    console.error('Error fetching collection books:', error);
    throw new Error('Error al cargar libros de la colección');
  }

  // Mapear para estructura más limpia
  return (data || []).map((item: any) => ({
    ...item.books,
    count: item.books.highlights?.[0]?.count || 0,
    added_to_collection_at: item.added_at,
  }));
}

/**
 * Obtiene las colecciones que contienen un libro específico
 */
export async function getBookCollections(bookId: string): Promise<Collection[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Usuario no autenticado');
  }

  const { data, error } = await supabase
    .from('collection_books')
    .select(`
      collections (*)
    `)
    .eq('book_id', bookId);

  if (error) {
    console.error('Error fetching book collections:', error);
    throw new Error('Error al cargar colecciones del libro');
  }

  return (data || []).map((item: any) => item.collections).filter(Boolean);
}

