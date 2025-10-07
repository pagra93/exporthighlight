/**
 * Patrones multi-idioma para detectar elementos en My Clippings.txt
 */

export interface LocalePatterns {
  highlightIndicators: string[];
  noteIndicators: string[];
  locationKeywords: string[];
  pageKeywords: string[];
  addedOnKeywords: string[];
}

export const locales: Record<string, LocalePatterns> = {
  es: {
    highlightIndicators: ['Tu subrayado', 'Tu marcador', 'Highlight'],
    noteIndicators: ['Tu nota', 'Note'],
    locationKeywords: ['Ubicación', 'ubicación', 'Location', 'location'],
    pageKeywords: ['página', 'Página', 'page', 'Page'],
    addedOnKeywords: ['Añadido el', 'añadido el', 'Added on', 'added on'],
  },
  en: {
    highlightIndicators: ['Your Highlight', 'Your Bookmark', 'Highlight'],
    noteIndicators: ['Your Note', 'Note'],
    locationKeywords: ['Location', 'location'],
    pageKeywords: ['Page', 'page'],
    addedOnKeywords: ['Added on', 'added on'],
  },
  pt: {
    highlightIndicators: ['Seu destaque', 'Seu marcador', 'Destaque'],
    noteIndicators: ['Sua nota', 'Nota'],
    locationKeywords: ['Localização', 'localização', 'Location'],
    pageKeywords: ['Página', 'página', 'Page'],
    addedOnKeywords: ['Adicionado em', 'adicionado em'],
  },
  de: {
    highlightIndicators: ['Ihre Markierung', 'Markierung'],
    noteIndicators: ['Ihre Notiz', 'Notiz'],
    locationKeywords: ['Position', 'position'],
    pageKeywords: ['Seite', 'seite'],
    addedOnKeywords: ['Hinzugefügt am', 'hinzugefügt am'],
  },
  fr: {
    highlightIndicators: ['Votre surlignement', 'Surlignement'],
    noteIndicators: ['Votre note', 'Note'],
    locationKeywords: ['Emplacement', 'emplacement'],
    pageKeywords: ['Page', 'page'],
    addedOnKeywords: ['Ajouté le', 'ajouté le'],
  },
};

/**
 * Detecta si una línea contiene indicadores de highlight
 */
export function isHighlightLine(line: string): boolean {
  return Object.values(locales).some(locale =>
    locale.highlightIndicators.some(indicator =>
      line.includes(indicator)
    )
  );
}

/**
 * Detecta si una línea contiene indicadores de nota
 */
export function isNoteLine(line: string): boolean {
  return Object.values(locales).some(locale =>
    locale.noteIndicators.some(indicator =>
      line.includes(indicator)
    )
  );
}

/**
 * Extrae el número de página de una línea de metadata
 */
export function extractPage(line: string): number | null {
  const allPageKeywords = Object.values(locales).flatMap(l => l.pageKeywords);
  
  for (const keyword of allPageKeywords) {
    const regex = new RegExp(`${keyword}\\s+(\\d+)`, 'i');
    const match = line.match(regex);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

/**
 * Extrae la ubicación (Location) de una línea de metadata
 */
export function extractLocation(line: string): string | null {
  const allLocationKeywords = Object.values(locales).flatMap(l => l.locationKeywords);
  
  for (const keyword of allLocationKeywords) {
    // Captura rangos como "123-124" o números simples "123"
    const regex = new RegExp(`${keyword}\\s+([\\d-]+)`, 'i');
    const match = line.match(regex);
    if (match) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extrae la fecha de una línea de metadata
 */
export function extractDate(line: string): string | null {
  const allDateKeywords = Object.values(locales).flatMap(l => l.addedOnKeywords);
  
  for (const keyword of allDateKeywords) {
    const idx = line.toLowerCase().indexOf(keyword.toLowerCase());
    if (idx !== -1) {
      const dateStr = line.substring(idx + keyword.length).trim();
      // Intentar parsear la fecha
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString();
      }
      // Si no se puede parsear, devolver el string crudo
      return dateStr;
    }
  }
  
  return null;
}

