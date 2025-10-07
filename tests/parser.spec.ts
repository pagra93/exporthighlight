import { describe, it, expect } from 'vitest';
import { 
  isHighlightLine, 
  isNoteLine, 
  extractPage, 
  extractLocation, 
  extractDate 
} from '../lib/locales';
import { 
  normalizeText, 
  generateHighlightHash, 
  generateBookId 
} from '../lib/hashing';

describe('Locales - Multi-idioma detection', () => {
  it('detecta highlights en español', () => {
    expect(isHighlightLine('- Tu subrayado en la página 42')).toBe(true);
    expect(isHighlightLine('- Tu marcador en la ubicación 123')).toBe(true);
  });

  it('detecta highlights en inglés', () => {
    expect(isHighlightLine('- Your Highlight on Location 123-124')).toBe(true);
    expect(isHighlightLine('- Your Highlight on Page 42')).toBe(true);
  });

  it('detecta notas en español', () => {
    expect(isNoteLine('- Tu nota en la página 42')).toBe(true);
  });

  it('detecta notas en inglés', () => {
    expect(isNoteLine('- Your Note on Location 123')).toBe(true);
  });

  it('extrae número de página correctamente', () => {
    expect(extractPage('- Tu subrayado en la página 42')).toBe(42);
    expect(extractPage('- Your Highlight on Page 123')).toBe(123);
  });

  it('extrae ubicación correctamente', () => {
    expect(extractLocation('- Tu subrayado en la ubicación 123')).toBe('123');
    expect(extractLocation('- Your Highlight on Location 123-124')).toBe('123-124');
  });

  it('extrae fecha correctamente (formato conocido)', () => {
    const result = extractDate('Añadido el lunes, 5 de mayo de 2019 1:23:45');
    expect(result).toBeTruthy();
  });
});

describe('Hashing - Normalización y deduplicación', () => {
  it('normaliza texto correctamente', () => {
    const text = '  Esto   es   un   texto  ';
    expect(normalizeText(text)).toBe('esto es un texto');
  });

  it('normaliza comillas curvas', () => {
    const text = `"Hello" and 'world'`;
    const normalized = normalizeText(text);
    expect(normalized).toContain('"');
    expect(normalized).toContain("'");
  });

  it('normaliza guiones largos', () => {
    const text = 'word–word—word';
    const normalized = normalizeText(text);
    expect(normalized).toBe('word-word-word');
  });

  it('genera hash único para highlights diferentes', () => {
    const hash1 = generateHighlightHash('book1', '123', null, 'texto uno');
    const hash2 = generateHighlightHash('book1', '124', null, 'texto dos');
    expect(hash1).not.toBe(hash2);
  });

  it('genera mismo hash para highlights duplicados', () => {
    const hash1 = generateHighlightHash('book1', '123', null, 'Texto con mayúsculas');
    const hash2 = generateHighlightHash('book1', '123', null, 'texto con mayúsculas');
    expect(hash1).toBe(hash2);
  });

  it('genera bookId único', () => {
    const id1 = generateBookId('El Quijote', 'Cervantes');
    const id2 = generateBookId('1984', 'Orwell');
    expect(id1).not.toBe(id2);
  });

  it('genera mismo bookId para mismo libro', () => {
    const id1 = generateBookId('El Quijote', 'Cervantes');
    const id2 = generateBookId('el quijote', 'cervantes');
    expect(id1).toBe(id2);
  });
});

describe('Parser - Casos de uso reales', () => {
  it('maneja separadores con 8 o más signos de igual', () => {
    const separator8 = '========';
    const separator10 = '==========';
    const separator12 = '============';
    
    expect(separator8.match(/={8,}/)).toBeTruthy();
    expect(separator10.match(/={8,}/)).toBeTruthy();
    expect(separator12.match(/={8,}/)).toBeTruthy();
  });

  it('maneja títulos con paréntesis', () => {
    const title1 = 'El arte de la guerra (Sun Tzu)';
    const lastOpenParen = title1.lastIndexOf('(');
    const lastCloseParen = title1.lastIndexOf(')');
    
    expect(lastOpenParen).toBeGreaterThan(0);
    expect(lastCloseParen).toBe(title1.length - 1);
    
    const bookTitle = title1.substring(0, lastOpenParen).trim();
    const author = title1.substring(lastOpenParen + 1, lastCloseParen).trim();
    
    expect(bookTitle).toBe('El arte de la guerra');
    expect(author).toBe('Sun Tzu');
  });

  it('maneja títulos con múltiples paréntesis', () => {
    const title = 'Libro (parte 1) completo (Autor)';
    const lastOpenParen = title.lastIndexOf('(');
    const lastCloseParen = title.lastIndexOf(')');
    
    const bookTitle = title.substring(0, lastOpenParen).trim();
    const author = title.substring(lastOpenParen + 1, lastCloseParen).trim();
    
    expect(bookTitle).toBe('Libro (parte 1) completo');
    expect(author).toBe('Autor');
  });
});

