/**
 * Multi-language Kindle format definitions
 * Supports ES, EN, FR, DE, IT, PT
 */

export type KindleLanguage = 'es' | 'en' | 'fr' | 'de' | 'it' | 'pt';

export interface KindleFormat {
  code: KindleLanguage;
  name: string;
  
  // Patterns for detecting this format
  highlightKeywords: string[];
  noteKeywords: string[];
  bookmarkKeywords: string[];
  
  // Regex patterns for parsing
  highlightPattern: RegExp;
  notePattern: RegExp;
  locationPattern: RegExp;
  pagePattern: RegExp;
  
  // Date parsing
  dateKeywords: string[];
  monthNames: string[];
  weekdayNames: string[];
  
  // Separators
  metadataSeparator: string;
}

export const KINDLE_FORMATS: Record<KindleLanguage, KindleFormat> = {
  es: {
    code: 'es',
    name: 'Español',
    highlightKeywords: ['subrayado', 'resaltado', 'destacado'],
    noteKeywords: ['nota'],
    bookmarkKeywords: ['marcador'],
    highlightPattern: /(subrayado|resaltado|destacado)/i,
    notePattern: /nota/i,
    locationPattern: /(?:ubicación|posición)\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /página\s+(\d+)/i,
    dateKeywords: ['añadido el', 'agregado el'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    weekdayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    metadataSeparator: '|',
  },
  
  en: {
    code: 'en',
    name: 'English',
    highlightKeywords: ['highlight', 'note', 'bookmark'],
    noteKeywords: ['note'],
    bookmarkKeywords: ['bookmark'],
    highlightPattern: /highlight/i,
    notePattern: /note/i,
    locationPattern: /location\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /page\s+(\d+)/i,
    dateKeywords: ['added on'],
    monthNames: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
    weekdayNames: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    metadataSeparator: '|',
  },
  
  fr: {
    code: 'fr',
    name: 'Français',
    highlightKeywords: ['surlignement', 'surligné'],
    noteKeywords: ['note'],
    bookmarkKeywords: ['signet'],
    highlightPattern: /surlign/i,
    notePattern: /note/i,
    locationPattern: /(?:emplacement|position)\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /page\s+(\d+)/i,
    dateKeywords: ['ajouté le'],
    monthNames: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
    weekdayNames: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    metadataSeparator: '|',
  },
  
  de: {
    code: 'de',
    name: 'Deutsch',
    highlightKeywords: ['markierung'],
    noteKeywords: ['notiz'],
    bookmarkKeywords: ['lesezeichen'],
    highlightPattern: /markierung/i,
    notePattern: /notiz/i,
    locationPattern: /position\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /seite\s+(\d+)/i,
    dateKeywords: ['hinzugefügt am'],
    monthNames: ['januar', 'februar', 'märz', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'dezember'],
    weekdayNames: ['sonntag', 'montag', 'dienstag', 'mittwoch', 'donnerstag', 'freitag', 'samstag'],
    metadataSeparator: '|',
  },
  
  it: {
    code: 'it',
    name: 'Italiano',
    highlightKeywords: ['evidenziatore', 'evidenziazione'],
    noteKeywords: ['nota'],
    bookmarkKeywords: ['segnalibro'],
    highlightPattern: /evidenzia/i,
    notePattern: /nota/i,
    locationPattern: /posizione\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /pagina\s+(\d+)/i,
    dateKeywords: ['aggiunto'],
    monthNames: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
    weekdayNames: ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'],
    metadataSeparator: '|',
  },
  
  pt: {
    code: 'pt',
    name: 'Português',
    highlightKeywords: ['destaque'],
    noteKeywords: ['nota'],
    bookmarkKeywords: ['marcador'],
    highlightPattern: /destaque/i,
    notePattern: /nota/i,
    locationPattern: /(?:localização|posição)\s+(\d+[-–]\d+|\d+)/i,
    pagePattern: /página\s+(\d+)/i,
    dateKeywords: ['adicionado em'],
    monthNames: ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'],
    weekdayNames: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    metadataSeparator: '|',
  },
};

/**
 * Auto-detect Kindle language from file content
 */
export function detectKindleLanguage(content: string): KindleLanguage {
  const sample = content.substring(0, 5000).toLowerCase();
  
  const scores: Record<KindleLanguage, number> = {
    es: 0,
    en: 0,
    fr: 0,
    de: 0,
    it: 0,
    pt: 0,
  };
  
  // Score based on keyword frequency
  Object.entries(KINDLE_FORMATS).forEach(([lang, format]) => {
    format.highlightKeywords.forEach(keyword => {
      const matches = (sample.match(new RegExp(keyword, 'gi')) || []).length;
      scores[lang as KindleLanguage] += matches * 3;
    });
    
    format.noteKeywords.forEach(keyword => {
      const matches = (sample.match(new RegExp(keyword, 'gi')) || []).length;
      scores[lang as KindleLanguage] += matches * 2;
    });
    
    format.dateKeywords.forEach(keyword => {
      const matches = (sample.match(new RegExp(keyword, 'gi')) || []).length;
      scores[lang as KindleLanguage] += matches * 5;
    });
  });
  
  // Return language with highest score
  let maxScore = 0;
  let detectedLang: KindleLanguage = 'en'; // Default fallback
  
  Object.entries(scores).forEach(([lang, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang as KindleLanguage;
    }
  });
  
  console.log('🌍 Language detection scores:', scores);
  console.log('✅ Detected language:', detectedLang);
  
  return detectedLang;
}

/**
 * Parse date string using Intl.DateTimeFormat (robust, native)
 */
export function parseKindleDate(dateStr: string, language: KindleLanguage): Date | null {
  if (!dateStr) return null;
  
  const format = KINDLE_FORMATS[language];
  const cleanDateStr = dateStr.trim().toLowerCase();
  
  // Remove weekday names
  let withoutWeekday = cleanDateStr;
  format.weekdayNames.forEach(day => {
    withoutWeekday = withoutWeekday.replace(new RegExp(`\\b${day}\\b,?\\s*`, 'gi'), '');
  });
  
  // Remove date keywords
  format.dateKeywords.forEach(keyword => {
    withoutWeekday = withoutWeekday.replace(new RegExp(`\\b${keyword}\\b\\s*`, 'gi'), '');
  });
  
  // Try to extract day, month, year
  const monthIndex = format.monthNames.findIndex(month => 
    withoutWeekday.includes(month.toLowerCase())
  );
  
  if (monthIndex === -1) return null;
  
  // Extract numbers (day and year)
  const numbers = withoutWeekday.match(/\d+/g);
  if (!numbers || numbers.length < 2) return null;
  
  const day = parseInt(numbers[0], 10);
  const year = parseInt(numbers[numbers.length - 1], 10);
  const month = monthIndex;
  
  // Create date
  try {
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

/**
 * Normalize text - handle special characters, quotes, etc.
 */
export function normalizeText(text: string): string {
  return text
    // Normalize quotes
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    // Normalize dashes
    .replace(/[\u2013\u2014]/g, '-')
    // Normalize ellipsis
    .replace(/…/g, '...')
    // Trim whitespace
    .trim()
    // Remove multiple spaces
    .replace(/\s+/g, ' ');
}

