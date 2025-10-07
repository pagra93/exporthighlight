/**
 * Robust Kindle Clippings Parser
 * Handles edge cases, special characters, multi-line highlights, and errors gracefully
 */

import { Book, Highlight, ParseResult } from '../types';
import { 
  detectKindleLanguage, 
  parseKindleDate, 
  normalizeText,
  KINDLE_FORMATS,
  KindleLanguage 
} from './formats';
import { simpleHash, generateHighlightHash } from '../hashing';

export interface ParseError {
  line: number;
  entry: string;
  error: string;
  severity: 'warning' | 'error';
  suggestion?: string;
}

export interface RobustParseResult extends ParseResult {
  errors: ParseError[];
  language: KindleLanguage;
  processedEntries: number;
  skippedEntries: number;
}

const ENTRY_SEPARATOR = '==========';

/**
 * Main robust parsing function
 */
export function parseKindleClippings(content: string): RobustParseResult {
  console.log('📖 Starting robust parse...');
  
  // Detect language
  const language = detectKindleLanguage(content);
  const format = KINDLE_FORMATS[language];
  
  console.log(`🌍 Using ${format.name} format`);
  
  // Split into entries
  const rawEntries = content.split(ENTRY_SEPARATOR).filter(e => e.trim());
  console.log(`📚 Found ${rawEntries.length} raw entries`);
  
  const books = new Map<string, Book>();
  const highlights: Highlight[] = [];
  const errors: ParseError[] = [];
  let processedEntries = 0;
  let skippedEntries = 0;
  let currentLine = 0;
  
  for (const rawEntry of rawEntries) {
    currentLine += rawEntry.split('\n').length + 1;
    
    try {
      const entry = parseEntry(rawEntry.trim(), format, language, currentLine);
      
      if (!entry) {
        skippedEntries++;
        continue;
      }
      
      processedEntries++;
      
      // Get or create book
      const bookKey = createBookKey(entry.title, entry.author);
      if (!books.has(bookKey)) {
        books.set(bookKey, {
          id: simpleHash(bookKey),
          title: entry.title,
          author: entry.author || '',
          asin: entry.asin,
        });
      }
      
      // Add highlight
      const book = books.get(bookKey)!;
      const highlightHash = generateHighlightHash(
        book.id,
        entry.location,
        entry.page,
        entry.text
      );
      highlights.push({
        id: highlightHash,
        bookId: book.id,
        text: entry.text,
        note: entry.note,
        location: entry.location,
        page: entry.page,
        addedAt: entry.addedAt,
        hash: highlightHash,
      });
      
    } catch (error) {
      errors.push({
        line: currentLine,
        entry: rawEntry.substring(0, 100) + '...',
        error: error instanceof Error ? error.message : String(error),
        severity: 'warning',
        suggestion: getSuggestionForError(error),
      });
      skippedEntries++;
    }
  }
  
  console.log(`✅ Processed: ${processedEntries}, ⚠️ Skipped: ${skippedEntries}, ❌ Errors: ${errors.length}`);
  
  return {
    books: Array.from(books.values()),
    highlights,
    stats: {
      books: books.size,
      highlights: highlights.length,
    },
    errors,
    language,
    processedEntries,
    skippedEntries,
  };
}

interface ParsedEntry {
  title: string;
  author?: string;
  asin?: string;
  text: string;
  note?: string;
  location?: string;
  page?: number;
  addedAt?: Date;
  type: 'highlight' | 'note' | 'bookmark';
}

/**
 * Parse a single entry
 */
function parseEntry(
  entry: string, 
  format: typeof KINDLE_FORMATS['en'],
  language: KindleLanguage,
  lineNumber: number
): ParsedEntry | null {
  const lines = entry.split('\n').map(l => l.trim()).filter(l => l);
  
  if (lines.length < 2) {
    throw new Error('Entry too short');
  }
  
  // Line 1: Title and author
  const titleLine = lines[0];
  const { title, author, asin } = parseTitleLine(titleLine);
  
  if (!title) {
    throw new Error('Could not extract title');
  }
  
  // Line 2: Metadata (type, location, date)
  const metadataLine = lines[1];
  const metadata = parseMetadata(metadataLine, format, language);
  
  if (!metadata) {
    throw new Error('Could not parse metadata');
  }
  
  // Remaining lines: Content
  let text = '';
  let note: string | undefined;
  
  if (metadata.type === 'highlight' || metadata.type === 'note') {
    // Everything after metadata is content
    text = lines.slice(2).join('\n').trim();
    
    // Normalize text (handle special characters, multi-line, etc.)
    text = normalizeText(text);
    
    // Handle emojis and unicode
    text = normalizeUnicode(text);
    
    if (!text) {
      throw new Error('Empty highlight text');
    }
  }
  
  return {
    title,
    author,
    asin,
    text,
    note,
    location: metadata.location,
    page: metadata.page,
    addedAt: metadata.date,
    type: metadata.type,
  };
}

/**
 * Parse title line: "Title (Author)" or "Title" or "Title — Author"
 */
function parseTitleLine(line: string): { title: string; author?: string; asin?: string } {
  const normalized = normalizeText(line);
  
  // Pattern 1: "Title (Author)"
  const pattern1 = /^(.+?)\s*\(([^)]+)\)$/;
  const match1 = normalized.match(pattern1);
  if (match1) {
    return {
      title: match1[1].trim(),
      author: match1[2].trim(),
    };
  }
  
  // Pattern 2: "Title — Author" or "Title - Author"
  const pattern2 = /^(.+?)\s+[-–—]\s+(.+)$/;
  const match2 = normalized.match(pattern2);
  if (match2) {
    return {
      title: match2[1].trim(),
      author: match2[2].trim(),
    };
  }
  
  // Pattern 3: Just title
  return {
    title: normalized,
  };
}

/**
 * Parse metadata line
 */
function parseMetadata(
  line: string, 
  format: typeof KINDLE_FORMATS['en'],
  language: KindleLanguage
): { type: 'highlight' | 'note' | 'bookmark'; location?: string; page?: number; date?: Date } | null {
  const normalized = line.toLowerCase();
  
  // Determine type
  let type: 'highlight' | 'note' | 'bookmark' = 'highlight';
  if (format.notePattern.test(normalized)) {
    type = 'note';
  } else if (format.bookmarkKeywords.some(k => normalized.includes(k))) {
    type = 'bookmark';
  }
  
  // Extract location
  const locationMatch = line.match(format.locationPattern);
  const location = locationMatch ? locationMatch[1] : undefined;
  
  // Extract page
  const pageMatch = line.match(format.pagePattern);
  const page = pageMatch ? parseInt(pageMatch[1], 10) : undefined;
  
  // Extract date
  let date: Date | undefined;
  const dateMatch = line.match(new RegExp(`(${format.dateKeywords.join('|')})\\s+(.+?)(?:\\||$)`, 'i'));
  if (dateMatch) {
    date = parseKindleDate(dateMatch[2], language) || undefined;
  }
  
  return { type, location, page, date };
}

/**
 * Normalize Unicode characters (handle emojis, special chars)
 */
function normalizeUnicode(text: string): string {
  // Keep emojis and most Unicode, just normalize whitespace
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width chars
    .replace(/\r\n/g, '\n') // Normalize line breaks
    .replace(/\r/g, '\n');
}

/**
 * Create a unique book key
 */
function createBookKey(title: string, author?: string): string {
  const normalizedTitle = title.toLowerCase().trim();
  const normalizedAuthor = author ? author.toLowerCase().trim() : '';
  return `${normalizedTitle}|||${normalizedAuthor}`;
}

/**
 * Get helpful suggestion for an error
 */
function getSuggestionForError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  
  if (message.includes('too short')) {
    return 'Esta entrada parece estar incompleta. Verifica que el archivo no esté corrupto.';
  }
  
  if (message.includes('extract title')) {
    return 'No se pudo detectar el título del libro. Verifica el formato de la primera línea.';
  }
  
  if (message.includes('parse metadata')) {
    return 'La línea de metadata no coincide con ningún formato conocido. Verifica el idioma del Kindle.';
  }
  
  if (message.includes('Empty highlight')) {
    return 'El highlight no tiene texto. Esto puede ocurrir con marcadores sin contenido.';
  }
  
  return 'Error desconocido. Por favor reporta este caso para mejorarlo.';
}

