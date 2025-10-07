/**
 * Web Worker para parsear My Clippings.txt
 * Esto evita bloquear el main thread durante el procesamiento
 */

import type { Book, Highlight, ParseResult } from './types';
import { 
  isHighlightLine, 
  isNoteLine, 
  extractPage, 
  extractLocation, 
  extractDate 
} from './locales';
import { 
  normalizeText, 
  generateHighlightHash, 
  generateBookId, 
  generateId 
} from './hashing';

const SEPARATOR_PATTERN = /={8,}/; // 8 o más signos de igual
const PROGRESS_INTERVAL = 100; // Reportar progreso cada 100 bloques

/**
 * Parsea el título y autor de la primera línea del bloque
 * Formato típico: "Título (Autor)" o "Título"
 */
function parseTitleLine(line: string): { title: string; author?: string } {
  const trimmed = line.trim();
  
  // Buscar paréntesis al final
  const lastOpenParen = trimmed.lastIndexOf('(');
  const lastCloseParen = trimmed.lastIndexOf(')');
  
  // Si hay paréntesis válidos al final, extraer autor
  if (lastOpenParen > 0 && lastCloseParen === trimmed.length - 1) {
    const title = trimmed.substring(0, lastOpenParen).trim();
    const author = trimmed.substring(lastOpenParen + 1, lastCloseParen).trim();
    return { title, author };
  }
  
  // Si no hay paréntesis válidos, toda la línea es el título
  return { title: trimmed };
}

/**
 * Parsea un bloque individual de My Clippings
 */
function parseBlock(block: string): { book: { title: string; author?: string }; highlight: Omit<Highlight, 'id' | 'bookId' | 'hash'> } | null {
  const lines = block.split('\n').filter(l => l.trim());
  
  if (lines.length < 3) {
    return null; // Bloque inválido
  }
  
  // Línea 1: Título (Autor)
  const { title, author } = parseTitleLine(lines[0]);
  
  // Línea 2: Metadata (tipo, ubicación, fecha)
  const metadataLine = lines[1];
  const isNote = isNoteLine(metadataLine);
  const isHighlight = isHighlightLine(metadataLine);
  
  if (!isNote && !isHighlight) {
    return null; // No es un highlight ni una nota
  }
  
  const page = extractPage(metadataLine);
  const location = extractLocation(metadataLine);
  const addedAt = extractDate(metadataLine);
  
  // Línea 3+: Texto del highlight o nota
  const text = lines.slice(2).join('\n').trim();
  
  if (!text) {
    return null; // Sin contenido
  }
  
  return {
    book: { title, author },
    highlight: {
      text,
      note: isNote ? text : undefined,
      location: location || undefined,
      page,
      addedAt,
    },
  };
}

/**
 * Worker message handler
 */
self.onmessage = async (e: MessageEvent<{ fileContent: string }>) => {
  try {
    const { fileContent } = e.data;
    
    // Normalizar line endings y remover BOM
    let normalized = fileContent.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
    
    // Split por separador
    const blocks = normalized.split(SEPARATOR_PATTERN).filter(b => b.trim());
    
    const booksMap = new Map<string, Book>();
    const highlightsMap = new Map<string, Highlight>();
    const bookHighlightCounts = new Map<string, number>();
    
    let processedBlocks = 0;
    
    // Procesar cada bloque
    for (const block of blocks) {
      processedBlocks++;
      
      const parsed = parseBlock(block);
      if (!parsed) continue;
      
      const { book: bookInfo, highlight: highlightData } = parsed;
      
      // Generar book ID
      const bookId = generateBookId(bookInfo.title, bookInfo.author);
      
      // Agregar o actualizar libro
      if (!booksMap.has(bookId)) {
        booksMap.set(bookId, {
          id: bookId,
          title: bookInfo.title,
          author: bookInfo.author,
          count: 0,
        });
        bookHighlightCounts.set(bookId, 0);
      }
      
      // Generar hash del highlight para dedup
      const hash = generateHighlightHash(
        bookId,
        highlightData.location,
        highlightData.page,
        highlightData.text
      );
      
      // Si ya existe este hash, skip (deduplicación)
      if (highlightsMap.has(hash)) {
        continue;
      }
      
      // Crear highlight
      const highlight: Highlight = {
        id: generateId(),
        bookId,
        hash,
        ...highlightData,
      };
      
      highlightsMap.set(hash, highlight);
      
      // Incrementar contador del libro
      const currentCount = bookHighlightCounts.get(bookId) || 0;
      bookHighlightCounts.set(bookId, currentCount + 1);
      
      // Reportar progreso periódicamente
      if (processedBlocks % PROGRESS_INTERVAL === 0) {
        const progress = Math.round((processedBlocks / blocks.length) * 100);
        self.postMessage({
          type: 'progress',
          progress,
          message: `Procesados ${processedBlocks} de ${blocks.length} bloques...`,
        });
      }
    }
    
    // Actualizar counts en los libros
    booksMap.forEach((book) => {
      book.count = bookHighlightCounts.get(book.id) || 0;
    });
    
    // Filtrar libros sin highlights
    const books = Array.from(booksMap.values()).filter(b => (b.count || 0) > 0);
    const highlights = Array.from(highlightsMap.values());
    
    const result: ParseResult = {
      books,
      highlights,
      stats: {
        books: books.length,
        highlights: highlights.length,
      },
    };
    
    // Enviar resultado final
    self.postMessage({
      type: 'completed',
      result,
    });
    
  } catch (error) {
    self.postMessage({
      type: 'error',
      error: error instanceof Error ? error.message : 'Error desconocido al procesar el archivo',
    });
  }
};

export {};

