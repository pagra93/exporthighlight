import { describe, it, expect } from 'vitest';
import { parseKindleClippings } from '../lib/parser/robust-parser';
import { detectKindleLanguage, parseKindleDate, normalizeText } from '../lib/parser/formats';

describe('Robust Parser - Multi-language detection', () => {
  it('detecta idioma español', () => {
    const content = `
El arte de la guerra (Sun Tzu)
- Tu subrayado en la ubicación 123-124 | Añadido el lunes, 5 de mayo de 2019 1:23:45

Si conoces a tu enemigo y te conoces a ti mismo...
==========
    `.trim();
    
    const lang = detectKindleLanguage(content);
    expect(lang).toBe('es');
  });

  it('detecta idioma inglés', () => {
    const content = `
The Art of War (Sun Tzu)
- Your Highlight on Location 123-124 | Added on Monday, May 5, 2019 1:23:45 PM

If you know the enemy and know yourself...
==========
    `.trim();
    
    const lang = detectKindleLanguage(content);
    expect(lang).toBe('en');
  });

  it('detecta idioma francés', () => {
    const content = `
L'art de la guerre (Sun Tzu)
- Votre surlignement à l'emplacement 123 | Ajouté le lundi 5 mai 2019 13:23:45

Si tu connais ton ennemi et toi-même...
==========
    `.trim();
    
    const lang = detectKindleLanguage(content);
    expect(lang).toBe('fr');
  });

  it('usa inglés como fallback si no detecta idioma', () => {
    const content = '...';
    const lang = detectKindleLanguage(content);
    expect(lang).toBe('en');
  });
});

describe('Robust Parser - Date parsing', () => {
  it('parsea fechas en español', () => {
    const dateStr = 'lunes, 5 de mayo de 2019';
    const date = parseKindleDate(dateStr, 'es');
    
    expect(date).toBeTruthy();
    expect(date?.getFullYear()).toBe(2019);
    expect(date?.getMonth()).toBe(4); // Mayo = 4 (0-indexed)
    expect(date?.getDate()).toBe(5);
  });

  it('parsea fechas en inglés', () => {
    const dateStr = 'Monday, May 5, 2019';
    const date = parseKindleDate(dateStr, 'en');
    
    expect(date).toBeTruthy();
    expect(date?.getFullYear()).toBe(2019);
    expect(date?.getMonth()).toBe(4);
    expect(date?.getDate()).toBe(5);
  });

  it('retorna null para fechas inválidas', () => {
    const date = parseKindleDate('invalid date', 'es');
    expect(date).toBeNull();
  });

  it('retorna null para fechas vacías', () => {
    const date = parseKindleDate('', 'es');
    expect(date).toBeNull();
  });
});

describe('Robust Parser - Text normalization', () => {
  it('normaliza comillas curvas', () => {
    const text = '"Hello" and "World"';
    const normalized = normalizeText(text);
    expect(normalized).toBe('"Hello" and "World"');
  });

  it('normaliza apóstrofes', () => {
    const text = `It's a beautiful day`;
    const normalized = normalizeText(text);
    expect(normalized).toBe(`It's a beautiful day`);
  });

  it('normaliza guiones largos', () => {
    const text = 'word–word—word';
    const normalized = normalizeText(text);
    expect(normalized).toBe('word-word-word');
  });

  it('normaliza ellipsis', () => {
    const text = 'Hello… World';
    const normalized = normalizeText(text);
    expect(normalized).toBe('Hello... World');
  });

  it('elimina múltiples espacios', () => {
    const text = 'Hello    World   !';
    const normalized = normalizeText(text);
    expect(normalized).toBe('Hello World !');
  });

  it('trim whitespace', () => {
    const text = '  Hello World  ';
    const normalized = normalizeText(text);
    expect(normalized).toBe('Hello World');
  });
});

describe('Robust Parser - Full parsing', () => {
  it('parsea archivo simple en español', () => {
    const content = `
El arte de la guerra (Sun Tzu)
- Tu subrayado en la ubicación 123-124 | Añadido el lunes, 5 de mayo de 2019 1:23:45

Si conoces a tu enemigo y te conoces a ti mismo, no debes temer el resultado de cien batallas.
==========
El arte de la guerra (Sun Tzu)
- Tu subrayado en la ubicación 234-235 | Añadido el martes, 6 de mayo de 2019 2:30:00

La guerra es el arte del engaño.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(1);
    expect(result.highlights).toHaveLength(2);
    expect(result.stats.books).toBe(1);
    expect(result.stats.highlights).toBe(2);
    expect(result.language).toBe('es');
    expect(result.books[0].title).toBe('El arte de la guerra');
    expect(result.books[0].author).toBe('Sun Tzu');
  });

  it('parsea archivo simple en inglés', () => {
    const content = `
The Art of War (Sun Tzu)
- Your Highlight on Location 123-124 | Added on Monday, May 5, 2019 1:23:45 PM

If you know the enemy and know yourself, you need not fear the result of a hundred battles.
==========
The Art of War (Sun Tzu)
- Your Highlight on Location 234-235 | Added on Tuesday, May 6, 2019 2:30:00 PM

All warfare is based on deception.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(1);
    expect(result.highlights).toHaveLength(2);
    expect(result.language).toBe('en');
  });

  it('maneja múltiples libros', () => {
    const content = `
Book One (Author One)
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

Highlight from book one.
==========
Book Two (Author Two)
- Your Highlight on Location 200 | Added on Tuesday, May 6, 2019 2:30:00 PM

Highlight from book two.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(2);
    expect(result.highlights).toHaveLength(2);
    expect(result.books[0].title).toBe('Book One');
    expect(result.books[1].title).toBe('Book Two');
  });

  it('maneja highlights multi-línea', () => {
    const content = `
Book Title (Author Name)
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

This is a very long highlight
that spans multiple lines
and should be preserved correctly.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.highlights).toHaveLength(1);
    expect(result.highlights[0].text).toContain('multiple lines');
    expect(result.highlights[0].text).toContain('preserved correctly');
  });

  it('maneja caracteres especiales y emojis', () => {
    const content = `
Book Title (Author)
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

Hello 👋 world! This has special chars: áéíóú, ñ, ü & symbols: @#$%.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.highlights).toHaveLength(1);
    expect(result.highlights[0].text).toContain('👋');
    expect(result.highlights[0].text).toContain('áéíóú');
  });

  it('ignora entradas incompletas y reporta errores', () => {
    const content = `
Book Title (Author)
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

Valid highlight.
==========
Book Title (Author)
==========
Book Title (Author)
- Your Highlight on Location 200 | Added on Tuesday, May 6, 2019 2:30:00 PM

Another valid highlight.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    // Debería tener 2 highlights válidos
    expect(result.highlights).toHaveLength(2);
    // Y 1 error (la entrada incompleta)
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.skippedEntries).toBeGreaterThan(0);
  });
});

describe('Robust Parser - Edge cases', () => {
  it('maneja archivo vacío', () => {
    const content = '';
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(0);
    expect(result.highlights).toHaveLength(0);
  });

  it('maneja archivo sin separadores', () => {
    const content = 'Just some random text';
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(0);
    expect(result.highlights).toHaveLength(0);
  });

  it('maneja títulos sin autor', () => {
    const content = `
Book Without Author
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

Some highlight.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(1);
    expect(result.books[0].title).toBe('Book Without Author');
    expect(result.books[0].author).toBe('');
  });

  it('agrupa highlights del mismo libro correctamente', () => {
    const content = `
Same Book (Author)
- Your Highlight on Location 100 | Added on Monday, May 5, 2019 1:23:45 PM

First highlight.
==========
Same Book (Author)
- Your Highlight on Location 200 | Added on Tuesday, May 6, 2019 2:30:00 PM

Second highlight.
==========
Same Book (Author)
- Your Highlight on Location 300 | Added on Wednesday, May 7, 2019 3:45:00 PM

Third highlight.
==========
    `.trim();
    
    const result = parseKindleClippings(content);
    
    expect(result.books).toHaveLength(1);
    expect(result.highlights).toHaveLength(3);
    expect(result.highlights.every(h => h.bookId === result.books[0].id)).toBe(true);
  });
});

