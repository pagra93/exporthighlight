/**
 * Export masivo de libros a ZIP
 */

import JSZip from 'jszip';
import type { Book, Highlight } from './types';
import { bookToMarkdown, getMarkdownFilename } from './markdown';

/**
 * Exporta múltiples libros como un archivo ZIP
 */
export async function exportBooksAsZip(
  books: Book[],
  highlights: Highlight[],
  zipFilename: string = 'mis-notas-kindle.zip'
): Promise<void> {
  try {
    const zip = new JSZip();

    // Agregar un archivo README
    zip.file('README.txt', `Notas de Kindle
Exportado el ${new Date().toLocaleDateString('es-ES')}

Total de libros: ${books.length}
Total de notas: ${highlights.length}

Cada archivo .md corresponde a un libro con todas sus notas.
`);

    // Agregar cada libro como un archivo markdown
    for (const book of books) {
      const bookHighlights = highlights.filter(h => h.bookId === book.id);
      
      if (bookHighlights.length === 0) continue;

      const markdown = bookToMarkdown(book, bookHighlights);
      const filename = getMarkdownFilename(book);
      
      zip.file(filename, markdown);
    }

    // Generar el ZIP
    const blob = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Descargar el archivo
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = zipFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating ZIP:', error);
    throw new Error('Error al generar el archivo ZIP');
  }
}

/**
 * Exporta todos los libros del parseResult
 */
export async function exportAllBooks(
  books: Book[],
  highlights: Highlight[]
): Promise<void> {
  if (books.length === 0) {
    throw new Error('No hay libros para exportar');
  }

  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const filename = `kindle-notes-${timestamp}.zip`;

  await exportBooksAsZip(books, highlights, filename);
}

