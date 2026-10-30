import { writable, derived } from 'svelte/store';
import en from './en.json';
import es from './es.json';

// Diccionario que junta todos los idiomas
const translations: Record<string, typeof en> = { en, es };

// Store para guardar el idioma actual (por defecto inglés)
export const locale = writable('en');

// Store derivada que devuelve los textos del idioma activo
export const t = derived(locale, ($locale) => {
  return translations[$locale] || translations['en']; 
});
