/**
 * Open Library API integration for book metadata enrichment
 * https://openlibrary.org/dev/docs/api/search
 */

export interface BookMetadata {
  isbn?: string;
  coverUrl?: string;
  author?: string;
  publishYear?: number;
  subjects?: string[];
}

const OPENLIBRARY_API = 'https://openlibrary.org';
const COVERS_API = 'https://covers.openlibrary.org/b';

/**
 * Search for book metadata using Open Library API
 */
/**
 * Limpia el título removiendo información extra como autor y origen
 */
function cleanTitle(title: string): string {
  let cleaned = title;
  
  // Remover (Z-Library), (EPUB), (PDF), etc.
  cleaned = cleaned.replace(/\s*\((Z-Library|EPUB|PDF|Kindle|Mobi)\)/gi, '');
  
  // Remover autor entre paréntesis al final: "Título (Autor)"
  cleaned = cleaned.replace(/\s*\([^)]+\)\s*$/, '');
  
  // Remover subtítulos después de : o -
  const mainTitle = cleaned.split(/[:\-–—]/)[0].trim();
  
  return mainTitle;
}

export async function searchBookMetadata(
  title: string, 
  author?: string
): Promise<BookMetadata | null> {
  try {
    // Limpiar el título primero
    const cleanedTitle = cleanTitle(title);
    
    console.log(`📖 Original: "${title}"`);
    console.log(`✨ Limpio: "${cleanedTitle}"`);
    
    // Intentar múltiples estrategias de búsqueda
    const strategies = [
      // Estrategia 1: Título limpio + Autor
      author ? { title: cleanedTitle, author } : null,
      // Estrategia 2: Solo título limpio
      { title: cleanedTitle, author: undefined },
      // Estrategia 3: Primera palabra significativa del título
      { title: cleanedTitle.split(/\s+/).slice(0, 3).join(' '), author: undefined },
    ].filter(Boolean);

    for (const strategy of strategies) {
      if (!strategy) continue;

      // Limpiar el título (mantener acentos y tildes)
      const cleanTitle = encodeURIComponent(
        strategy.title.trim().replace(/\s+/g, ' ').slice(0, 100)
      );
      const cleanAuthor = strategy.author 
        ? encodeURIComponent(strategy.author.trim().slice(0, 50))
        : '';
      
      // Construir query
      const query = cleanAuthor 
        ? `title=${cleanTitle}&author=${cleanAuthor}`
        : `title=${cleanTitle}`;
      
      console.log(`🔍 Trying: ${strategy.title}${strategy.author ? ` by ${strategy.author}` : ''}`);
      
      // Buscar en Open Library
      const searchUrl = `${OPENLIBRARY_API}/search.json?${query}&limit=3&fields=key,title,author_name,isbn,first_publish_year,subject,cover_i`;
      const response = await fetch(searchUrl);
      
      if (!response.ok) {
        console.warn(`⚠️ Search failed: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      if (!data.docs || data.docs.length === 0) {
        console.log(`📚 No results with this strategy`);
        continue;
      }
      
      // Buscar el mejor match
      const book = data.docs.find((doc: any) => doc.cover_i) || data.docs[0];
      
      // Extraer metadata
      const metadata: BookMetadata = {
        isbn: book.isbn?.[0],
        author: book.author_name?.[0] || author,
        publishYear: book.first_publish_year,
        subjects: book.subject?.slice(0, 5),
      };
      
      // Construir URL de cover
      if (book.cover_i) {
        metadata.coverUrl = `${COVERS_API}/id/${book.cover_i}-M.jpg`;
        console.log(`✅ Found cover with cover_i: ${book.cover_i}`);
      } else if (metadata.isbn) {
        metadata.coverUrl = `${COVERS_API}/isbn/${metadata.isbn}-M.jpg`;
        console.log(`✅ Found cover with ISBN: ${metadata.isbn}`);
      }
      
      // Si encontramos portada, retornar
      if (metadata.coverUrl) {
        console.log(`✅ Success:`, metadata);
        return metadata;
      }
    }
    
    console.log(`❌ No cover found for: ${title}`);
    return null;
    
  } catch (error) {
    console.error('❌ Error fetching book metadata:', error);
    return null;
  }
}

/**
 * Enrich multiple books with metadata (batch processing)
 */
export async function enrichBooksWithMetadata(
  books: Array<{ title: string; author?: string }>,
  onProgress?: (current: number, total: number) => void
): Promise<Map<string, BookMetadata>> {
  const results = new Map<string, BookMetadata>();
  
  console.log(`📚 Starting metadata enrichment for ${books.length} books...`);
  
  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const key = `${book.title}|||${book.author || ''}`;
    
    try {
      const metadata = await searchBookMetadata(book.title, book.author);
      if (metadata) {
        results.set(key, metadata);
      }
      
      // Update progress
      if (onProgress) {
        onProgress(i + 1, books.length);
      }
      
      // Rate limiting: wait 1 second between requests
      if (i < books.length - 1) {
        await sleep(1000);
      }
    } catch (error) {
      console.error(`Error enriching book ${book.title}:`, error);
      // Continue with next book
    }
  }
  
  console.log(`✅ Enriched ${results.size} out of ${books.length} books`);
  return results;
}

/**
 * Verify if a cover URL is valid
 */
export async function verifyCoverUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

