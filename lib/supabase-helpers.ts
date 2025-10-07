/**
 * Helpers para interactuar con Supabase
 */

import { supabase } from './supabaseClient';
import type { Book, Highlight, ParseResult } from './types';
import { generateHighlightHash } from './hashing';

export interface SaveStats {
  newBooks: number;
  existingBooks: number;
  newHighlights: number;
  duplicateHighlights: number;
  totalProcessed: number;
}

/**
 * Guarda los libros y highlights en la cuenta del usuario con detección inteligente de duplicados
 */
export async function saveToAccount(parseResult: ParseResult): Promise<SaveStats> {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  const stats: SaveStats = {
    newBooks: 0,
    existingBooks: 0,
    newHighlights: 0,
    duplicateHighlights: 0,
    totalProcessed: 0,
  };

  try {
    console.log('📚 Starting smart sync...');
    
    // Obtener todos los hashes existentes del usuario (para detección rápida de duplicados)
    const { data: existingHashes } = await supabase
      .from('highlights')
      .select('hash, id')
      .eq('user_id', user.id);
    
    const existingHashSet = new Set(existingHashes?.map(h => h.hash) || []);
    console.log(`🔍 Found ${existingHashSet.size} existing highlights`);

    // Insertar libros (con upsert por título + autor)
    for (const book of parseResult.books) {
      // Verificar si el libro ya existe para este usuario
      const { data: existingBooks } = await supabase
        .from('books')
        .select('id')
        .eq('user_id', user.id)
        .eq('title', book.title)
        .eq('author', book.author || null)
        .limit(1);

      let bookId: string;

      if (existingBooks && existingBooks.length > 0) {
        // Libro ya existe, usar su ID
        bookId = existingBooks[0].id;
        stats.existingBooks++;
        console.log(`📖 Found existing book: ${book.title}`);
      } else {
        // Insertar nuevo libro
        const { data: newBook, error: bookError } = await supabase
          .from('books')
          .insert({
            user_id: user.id,
            title: book.title,
            author: book.author,
            asin: book.asin,
            cover_url: book.coverUrl,
          })
          .select('id')
          .single();

        if (bookError) throw bookError;
        bookId = newBook.id;
        stats.newBooks++;
        console.log(`✨ Created new book: ${book.title}`);
      }

      // Filtrar highlights: solo insertar los nuevos
      const bookHighlights = parseResult.highlights
        .filter(h => h.bookId === book.id)
        .map(h => {
          // Asegurar que el hash existe, si no, generarlo
          const hash = h.hash || generateHighlightHash(
            book.id,
            h.location,
            h.page,
            h.text
          );
          
          return {
            user_id: user.id,
            book_id: bookId,
            text: h.text,
            note: h.note,
            location: h.location,
            page: h.page,
            added_at: h.addedAt,
            hash: hash,
            isNew: !existingHashSet.has(hash),
          };
        });

      stats.totalProcessed += bookHighlights.length;

      // Separar nuevos de duplicados
      const newHighlights = bookHighlights.filter(h => h.isNew);
      const duplicates = bookHighlights.filter(h => !h.isNew);
      
      stats.newHighlights += newHighlights.length;
      stats.duplicateHighlights += duplicates.length;

      console.log(`  ✅ ${newHighlights.length} new highlights, ⏭️ ${duplicates.length} duplicates`);

      // Usar UPSERT para manejar duplicados automáticamente
      if (bookHighlights.length > 0) {
        const highlightsToUpsert = bookHighlights.map(h => ({
          user_id: h.user_id,
          book_id: h.book_id,
          text: h.text,
          note: h.note,
          location: h.location,
          page: h.page,
          added_at: h.added_at,
          hash: h.hash,
        }));

        const { error: highlightsError } = await supabase
          .from('highlights')
          .upsert(highlightsToUpsert, {
            onConflict: 'user_id,hash',
            ignoreDuplicates: true, // Ignorar duplicados silenciosamente
          });

        if (highlightsError) {
          console.error('Error upserting highlights:', highlightsError);
          throw highlightsError;
        }
        
        console.log(`  ✅ Upserted ${highlightsToUpsert.length} highlights (${newHighlights.length} new, ${duplicates.length} existing)`);
      }
    }

    console.log('✅ Smart sync completed:', stats);
    return stats;
  } catch (error) {
    console.error('❌ Error saving to account:', error);
    throw new Error('Error al guardar en tu cuenta');
  }
}

/**
 * Obtiene la biblioteca del usuario desde Supabase
 */
export async function getLibrary(): Promise<{ books: Book[]; highlights: Highlight[] }> {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    // Obtener libros
    const { data: booksData, error: booksError } = await supabase
      .from('books')
      .select('id, title, author, asin, cover_url')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (booksError) throw booksError;

    // Obtener highlights
    const { data: highlightsData, error: highlightsError } = await supabase
      .from('highlights')
      .select('*')
      .eq('user_id', user.id);

    if (highlightsError) throw highlightsError;

    // Contar highlights por libro
    const highlightCounts = highlightsData.reduce((acc, h) => {
      acc[h.book_id] = (acc[h.book_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Mapear a formato Book
    const books: Book[] = booksData.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      asin: b.asin,
      coverUrl: b.cover_url,
      count: highlightCounts[b.id] || 0,
    }));

    // Mapear a formato Highlight
    const highlights: Highlight[] = highlightsData.map(h => ({
      id: h.id,
      bookId: h.book_id,
      text: h.text,
      note: h.note,
      location: h.location,
      page: h.page,
      addedAt: h.added_at,
      hash: h.hash,
    }));

    return { books, highlights };
  } catch (error) {
    console.error('Error loading library:', error);
    throw new Error('Error al cargar tu biblioteca');
  }
}

/**
 * Borra un libro y todos sus highlights
 */
export async function deleteBook(bookId: string): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    throw new Error('Usuario no autenticado');
  }

  try {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', bookId)
      .eq('user_id', user.id); // Asegurar que solo borra sus propios libros

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting book:', error);
    throw new Error('Error al borrar el libro');
  }
}

/**
 * Obtiene los contadores globales
 */
export async function getCounters(): Promise<{ books: number; highlights: number }> {
  try {
    const { data, error } = await supabase
      .from('counters')
      .select('total_books, total_highlights')
      .eq('id', 1)
      .single();

    if (error) throw error;

    return {
      books: data.total_books || 0,
      highlights: data.total_highlights || 0,
    };
  } catch (error) {
    console.error('Error loading counters:', error);
    return { books: 0, highlights: 0 };
  }
}

/**
 * Incrementa los contadores globales (llamado después de export)
 */
export async function incrementCounters(booksCount: number, highlightsCount: number): Promise<void> {
  try {
    const { error } = await supabase.rpc('increment_counters', {
      books_count: booksCount,
      highlights_count: highlightsCount,
    });

    if (error) {
      console.error('Error incrementing counters:', error);
      // No lanzar error, es solo para métricas
    }
  } catch (error) {
    console.error('Error incrementing counters:', error);
    // No lanzar error, es solo para métricas
  }
}

