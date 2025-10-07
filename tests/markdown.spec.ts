import { describe, it, expect } from 'vitest';
import { bookToMarkdown, getMarkdownFilename } from '../lib/markdown';
import type { Book, Highlight } from '../lib/types';

describe('Markdown Generation', () => {
  it('genera markdown básico correctamente', () => {
    const book: Book = {
      id: '1',
      title: 'Test Book',
      author: 'Test Author',
      count: 2,
    };

    const highlights: Highlight[] = [
      {
        id: '1',
        bookId: '1',
        text: 'First highlight',
        hash: 'hash1',
      },
      {
        id: '2',
        bookId: '1',
        text: 'Second highlight',
        hash: 'hash2',
      },
    ];

    const markdown = bookToMarkdown(book, highlights);

    expect(markdown).toContain('# Test Book — Test Author');
    expect(markdown).toContain('2 highlights');
    expect(markdown).toContain('First highlight');
    expect(markdown).toContain('Second highlight');
  });

  it('incluye información de página', () => {
    const book: Book = {
      id: '1',
      title: 'Test Book',
      count: 1,
    };

    const highlights: Highlight[] = [
      {
        id: '1',
        bookId: '1',
        text: 'Highlight with page',
        page: 42,
        hash: 'hash1',
      },
    ];

    const markdown = bookToMarkdown(book, highlights);

    expect(markdown).toContain('Página 42');
    expect(markdown).toContain('Highlight with page');
  });

  it('incluye notas cuando existen', () => {
    const book: Book = {
      id: '1',
      title: 'Test Book',
      count: 1,
    };

    const highlights: Highlight[] = [
      {
        id: '1',
        bookId: '1',
        text: 'Highlight text',
        note: 'This is my note',
        hash: 'hash1',
      },
    ];

    const markdown = bookToMarkdown(book, highlights);

    expect(markdown).toContain('Highlight text');
    expect(markdown).toContain('**Nota:** This is my note');
  });

  it('genera nombres de archivo seguros', () => {
    const book1: Book = {
      id: '1',
      title: 'Book/With:Bad*Characters',
      author: 'Author',
      count: 1,
    };

    const filename1 = getMarkdownFilename(book1);
    expect(filename1).not.toContain('/');
    expect(filename1).not.toContain(':');
    expect(filename1).not.toContain('*');
    expect(filename1).toContain('.md');

    const book2: Book = {
      id: '2',
      title: 'Normal Book',
      author: 'Normal Author',
      count: 1,
    };

    const filename2 = getMarkdownFilename(book2);
    expect(filename2).toBe('Normal Book - Normal Author.md');
  });

  it('maneja libros sin autor', () => {
    const book: Book = {
      id: '1',
      title: 'Book Without Author',
      count: 1,
    };

    const highlights: Highlight[] = [
      {
        id: '1',
        bookId: '1',
        text: 'Some text',
        hash: 'hash1',
      },
    ];

    const markdown = bookToMarkdown(book, highlights);
    expect(markdown).toContain('# Book Without Author');
    expect(markdown).not.toContain(' — ');
  });
});

