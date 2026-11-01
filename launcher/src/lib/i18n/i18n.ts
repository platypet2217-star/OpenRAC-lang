import en from './en.json';
import es from './es.json';

const translations: Record<string, any> = { en, es };

// 1. Attempt to load the previously saved language
const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('openrac_locale') : null;
let _locale = savedLocale && savedLocale in translations ? savedLocale : 'en';

let _listeners: (() => void)[] = [];

// A recursive function that performs a deep merge to support nested objects
function deepMergeWithFallback(base: any, target: any): any {
  // If the base value is not an object (it's a string, number, etc.), we use the target value if it's valid
  if (typeof base !== 'object' || base === null) {
    if (target !== undefined && target !== null && String(target).trim() !== '') {
      return target;
    }
    return base;
  }

  // If the target doesn't exist or isn't an object but the base is, we return a copy of the base
  if (typeof target !== 'object' || target === null) {
    return JSON.parse(JSON.stringify(base)); 
  }

  // If both are objects, we merge them property by property recursively
  const result: Record<string, any> = {};
  
  // Combine all unique keys from both objects
  const allKeys = new Set([...Object.keys(base), ...Object.keys(target)]);

  for (const key of allKeys) {
    if (!(key in base)) {
      // If the key only exists in the target language, we add it
      result[key] = target[key];
    } else {
      // If it exists in the base (English), we call the function recursively to merge inward
      result[key] = deepMergeWithFallback(base[key], target[key]);
    }
  }

  return result;
}

function buildTranslations(locale: string): any {
  // We blend deeply, always using English as our indestructible foundation
  return deepMergeWithFallback(translations['en'], translations[locale]);
}

// We generate the initial translation object
let _currentTranslations = buildTranslations(_locale);

export const i18n = {
  get currentLocale() {
    return _locale;
  },
  set currentLocale(lang: string) {
    if (lang in translations) {
      _locale = lang;
      
      // Perform a deep update of the active in-memory dictionary
      _currentTranslations = buildTranslations(lang);
      
      // 2. Save the new selection in the device's storage
      if (typeof window !== 'undefined') {
        localStorage.setItem('openrac_locale', lang);
      }
      
      _listeners.forEach(ctx => ctx());
    }
  },
  // We return the precalculated and cleaned static object reactively
  get t() {
    return _currentTranslations;
  },
  _subscribe(cb: () => void) {
    _listeners.push(cb);
    return () => {
      _listeners = _listeners.filter(ctx => ctx !== cb);
    };
  }
};
