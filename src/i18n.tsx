import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './language/es.json';

const resources = {
  es: {
    translation: es,
  },
};

const iNextUse = i18next;

iNextUse.use(initReactI18next).init({
  interpolation: { escapeValue: false },
  lng: 'es',
  resources,
  fallbackLng: 'es',
});

export default i18next;
