/**
 * Generadores de Markdown para exportación
 */

import type { Book, Highlight } from './types';
import { sanitizeFilename, formatDate } from './utils';

/**
 * Convierte un libro y sus highlights a formato Markdown
 */
export function bookToMarkdown(book: Book, highlights: Highlight[]): string {
  const header = `# ${book.title}${book.author ? ` — ${book.author}` : ''}\n\n`;
  const count = `**${highlights.length} highlight${highlights.length !== 1 ? 's' : ''}**\n\n`;
  const separator = '---\n\n';
  
  const body = highlights.map((h, i) => {
    let meta = '';
    
    if (h.page) {
      meta = `Página ${h.page}`;
    } else if (h.location) {
      meta = `Ubicación ${h.location}`;
    }
    
    if (h.addedAt) {
      const date = formatDate(h.addedAt instanceof Date ? h.addedAt.toISOString() : h.addedAt);
      meta += meta ? ` • ${date}` : date;
    }
    
    const metaLine = meta ? `**${meta}**\n\n` : '';
    const quote = `> ${h.text.trim()}\n\n`;
    const note = h.note ? `**Nota:** ${h.note.trim()}\n\n` : '';
    
    return `## ${i + 1}\n\n${metaLine}${quote}${note}${separator}`;
  }).join('');
  
  return header + count + separator + body;
}

/**
 * Genera un nombre de archivo seguro para el export
 */
export function getMarkdownFilename(book: Book): string {
  const base = book.author 
    ? `${book.title} - ${book.author}` 
    : book.title;
  return `${sanitizeFilename(base)}.md`;
}

/**
 * Descarga un string como archivo
 */
export function downloadMarkdown(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exporta un libro a Markdown
 */
export function exportBookAsMarkdown(book: Book, highlights: Highlight[]): void {
  const markdown = bookToMarkdown(book, highlights);
  const filename = getMarkdownFilename(book);
  downloadMarkdown(markdown, filename);
}

