/**
 * Parser directo sin Web Worker (para compatibilidad con Next.js 14)
 * Soporta múltiples formatos de My Clippings.txt
 */

import type { Book, Highlight, ParseResult } from './types';
import { 
  normalizeText, 
  generateHighlightHash, 
  generateBookId, 
  generateId 
} from './hashing';

const SEPARATOR_PATTERN = /={8,}/; // 8 o más signos de igual

/**
 * Parsea el título y autor de la primera línea del bloque
 * Soporta dos formatos:
 * 1. "Título (Autor)" - formato clásico
 * 2. "Autor - Título (info)" - formato kindle español
 */
function parseTitleLine(line: string): { title: string; author?: string } {
  const trimmed = line.trim();
  
  // Formato 2: "Autor - Título (info)"
  // Ejemplo: "Covey, Stephen R. - Los 7 hábitos de la gente altamente ef… (rsotillo)"
  if (trimmed.includes(' - ')) {
    const dashIndex = trimmed.indexOf(' - ');
    const potentialAuthor = trimmed.substring(0, dashIndex).trim();
    const rest = trimmed.substring(dashIndex + 3).trim();
    
    // Remover el paréntesis final si existe
    const lastOpenParen = rest.lastIndexOf('(');
    const lastCloseParen = rest.lastIndexOf(')');
    
    let title = rest;
    if (lastOpenParen > 0 && lastCloseParen === rest.length - 1) {
      title = rest.substring(0, lastOpenParen).trim();
    }
    
    return {
      title: title,
      author: potentialAuthor,
    };
  }
  
  // Formato 1: "Título (Autor)" - formato clásico
  const lastOpenParen = trimmed.lastIndexOf('(');
  const lastCloseParen = trimmed.lastIndexOf(')');
  
  if (lastOpenParen > 0 && lastCloseParen === trimmed.length - 1) {
    const title = trimmed.substring(0, lastOpenParen).trim();
    const author = trimmed.substring(lastOpenParen + 1, lastCloseParen).trim();
    return { title, author };
  }
  
  return { title: trimmed };
}

/**
 * Extrae el número de página de una línea de metadata
 */
function extractPage(line: string): number | null {
  // Buscar "página X" o "page X"
  const pageMatch = line.match(/página\s+(\d+)|page\s+(\d+)/i);
  if (pageMatch) {
    return parseInt(pageMatch[1] || pageMatch[2], 10);
  }
  return null;
}

/**
 * Extrae la ubicación/posición de una línea de metadata
 */
function extractLocation(line: string): string | null {
  // Buscar "posición X" o "location X" o "ubicación X"
  const locationMatch = line.match(/(?:posición|location|ubicación)\s+([\d-]+)/i);
  if (locationMatch) {
    return locationMatch[1];
  }
  return null;
}

/**
 * Extrae la fecha de una línea de metadata
 */
function extractDate(line: string): string | null {
  // Buscar después de "Añadido el" o "Added on"
  const dateMatch = line.match(/(?:Añadido el|Added on)\s+(.+?)(?:\s*\||\s*$)/i);
  if (dateMatch) {
    const dateStr = dateMatch[1].trim();
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
    } catch (e) {
      // Si no se puede parsear, devolver string original
    }
    return dateStr;
  }
  return null;
}

/**
 * Detecta si es un highlight o nota
 */
function isHighlightOrNote(line: string): { isHighlight: boolean; isNote: boolean } {
  const lowerLine = line.toLowerCase();
  const isNote = lowerLine.includes('nota') || lowerLine.includes('note');
  const isHighlight = lowerLine.includes('subrayado') || lowerLine.includes('highlight') || 
                      lowerLine.includes('marcador') || lowerLine.includes('bookmark');
  
  return { isHighlight, isNote };
}

/**
 * Parsea un bloque individual
 */
function parseBlock(block: string): { book: { title: string; author?: string }; highlight: Omit<Highlight, 'id' | 'bookId' | 'hash'> } | null {
  const lines = block.split('\n').filter(l => l.trim());
  
  if (lines.length < 2) {
    return null;
  }
  
  // Línea 1: Título y autor
  const { title, author } = parseTitleLine(lines[0]);
  
  // Línea 2: Metadata
  const metadataLine = lines[1];
  const { isHighlight, isNote } = isHighlightOrNote(metadataLine);
  
  if (!isNote && !isHighlight) {
    return null;
  }
  
  const page = extractPage(metadataLine);
  const location = extractLocation(metadataLine);
  const addedAt = extractDate(metadataLine);
  
  // Líneas 3+: Texto (puede haber línea en blanco después de metadata)
  const textLines = lines.slice(2).filter(l => l.trim());
  const text = textLines.join('\n').trim();
  
  if (!text) {
    return null;
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
 * Parsea el archivo completo directamente
 */
export async function parseFileDirect(fileContent: string): Promise<ParseResult> {
  console.log('🔍 Iniciando parseFileDirect...');
  
  // Normalizar
  let normalized = fileContent.replace(/\r\n/g, '\n').replace(/^\uFEFF/, '');
  console.log('📏 Contenido normalizado, longitud:', normalized.length);
  
  // Split por separador
  const blocks = normalized.split(SEPARATOR_PATTERN).filter(b => b.trim());
  console.log('📦 Bloques encontrados:', blocks.length);
  
  if (blocks.length === 0) {
    console.error('❌ No se encontraron bloques');
    throw new Error('No se encontraron bloques en el archivo');
  }
  
  // Mostrar primer bloque como ejemplo
  console.log('📝 Primer bloque ejemplo:', blocks[0].substring(0, 200));
  
  const booksMap = new Map<string, Book>();
  const highlightsMap = new Map<string, Highlight>();
  const bookHighlightCounts = new Map<string, number>();
  
  let parsedCount = 0;
  let skippedCount = 0;
  
  for (const block of blocks) {
    const parsed = parseBlock(block);
    
    if (!parsed) {
      skippedCount++;
      continue;
    }
    
    parsedCount++;
    
    const { book: bookInfo, highlight: highlightData } = parsed;
    const bookId = generateBookId(bookInfo.title, bookInfo.author);
    
    if (!booksMap.has(bookId)) {
      booksMap.set(bookId, {
        id: bookId,
        title: bookInfo.title,
        author: bookInfo.author,
        count: 0,
      });
      bookHighlightCounts.set(bookId, 0);
    }
    
    const hash = generateHighlightHash(
      bookId,
      highlightData.location,
      highlightData.page,
      highlightData.text
    );
    
    if (highlightsMap.has(hash)) {
      continue;
    }
    
    const highlight: Highlight = {
      id: generateId(),
      bookId,
      hash,
      ...highlightData,
    };
    
    highlightsMap.set(hash, highlight);
    
    const currentCount = bookHighlightCounts.get(bookId) || 0;
    bookHighlightCounts.set(bookId, currentCount + 1);
  }
  
  console.log('✅ Bloques parseados:', parsedCount);
  console.log('⚠️ Bloques omitidos:', skippedCount);
  
  booksMap.forEach((book) => {
    book.count = bookHighlightCounts.get(book.id) || 0;
  });
  
  const books = Array.from(booksMap.values()).filter(b => (b.count || 0) > 0);
  const highlights = Array.from(highlightsMap.values());
  
  console.log('📚 Libros finales:', books.length);
  console.log('📝 Highlights finales:', highlights.length);
  
  if (books.length > 0) {
    console.log('📖 Primeros libros:', books.slice(0, 3).map(b => `${b.title} (${b.count})`));
  }
  
  return {
    books,
    highlights,
    stats: {
      books: books.length,
      highlights: highlights.length,
    },
  };
}
