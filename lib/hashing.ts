/**
 * Funciones de hashing y normalización para deduplicación
 */

/**
 * Normaliza texto para comparación y hashing
 * - Convierte a minúsculas
 * - Normaliza espacios en blanco
 * - Normaliza comillas y guiones
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Normalizar espacios múltiples
    .replace(/\s+/g, ' ')
    // Normalizar comillas curvas a rectas
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Normalizar guiones y dashes
    .replace(/[–—]/g, '-')
    // Remover caracteres de control
    .replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Genera un hash simple pero efectivo para deduplicación
 * No necesita ser criptográficamente seguro, solo único
 */
export function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Genera un hash único para un highlight basado en:
 * - ID del libro
 * - Ubicación o página
 * - Texto normalizado
 */
export function generateHighlightHash(
  bookId: string,
  location: string | undefined,
  page: number | null | undefined,
  text: string
): string {
  const normalized = normalizeText(text);
  const locString = location || (page ? `page-${page}` : 'no-loc');
  const combined = `${bookId}::${locString}::${normalized}`;
  return simpleHash(combined);
}

/**
 * Genera un ID único para un libro basado en título y autor
 */
export function generateBookId(title: string, author?: string): string {
  const normalized = normalizeText(`${title}::${author || 'unknown'}`);
  return simpleHash(normalized);
}

/**
 * Genera un ID único aleatorio
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

