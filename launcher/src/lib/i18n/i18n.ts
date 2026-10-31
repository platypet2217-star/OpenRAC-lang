import en from './en.json';
import es from './es.json';

const translations: Record<string, any> = { en, es };

// 1. Intentar cargar el idioma guardado previamente en el equipo.
// Si no existe ninguno guardado, usamos 'en' por defecto.
const savedLocale = typeof window !== 'undefined' ? localStorage.getItem('openrac_locale') : null;
let _locale = savedLocale && savedLocale in translations ? savedLocale : 'en';

let _listeners: (() => void)[] = [];

export const i18n = {
  get currentLocale() {
    return _locale;
  },
  set currentLocale(lang: string) {
    if (lang in translations) {
      _locale = lang;
      
      // 2. Guardar la nueva selección en el almacenamiento local del equipo
      if (typeof window !== 'undefined') {
        localStorage.setItem('openrac_locale', lang);
      }
      
      _listeners.forEach(ctx => ctx());
    }
  },
  get t() {
    const currentTranslations = translations[_locale] || translations['en'];
    
    return new Proxy(currentTranslations, {
      get(target, prop: string) {
        if (prop in target) {
          return target[prop];
        }
        if (prop in translations['en']) {
          return (translations['en'] as any)[prop];
        }
        return prop;
      }
    });
  },
  _subscribe(cb: () => void) {
    _listeners.push(cb);
    return () => {
      _listeners = _listeners.filter(ctx => ctx !== cb);
    };
  }
};
