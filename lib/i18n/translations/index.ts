import { Language, Translation } from '../types';
import { es } from './es';
import { en } from './en';

export const translations: Record<Language, Translation> = {
  es,
  en,
  fr: en, // TODO: Add French translation
  de: en, // TODO: Add German translation
  it: en, // TODO: Add Italian translation
  pt: es, // Portuguese similar to Spanish for now
};

export const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
];

