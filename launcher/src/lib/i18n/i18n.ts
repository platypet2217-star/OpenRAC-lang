import en from './en.json';
import es from './es.json';

const translations: Record<string, any> = { en, es };

let _locale = 'en';
let _listeners: (() => void)[] = [];

// CAMBIA "pub" POR "export" AQUÍ:
export const i18n = {
  get currentLocale() {
    return _locale;
  },
  set currentLocale(lang: string) {
    _locale = lang;
    _listeners.forEach(ctx => ctx());
  },
  get t() {
    return translations[_locale] || translations['en'];
  },
  _subscribe(cb: () => void) {
    _listeners.push(cb);
    return () => {
      _listeners = _listeners.filter(ctx => ctx !== cb);
    };
  }
};
