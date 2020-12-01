import i18n from "i18next";
import { initReactI18next  } from "react-i18next";


import translationRU from '../translations/powbow-ru.json';
import translationEN from '../translations/powbow-en.json';


// the translations
const resources = {
    ru: {
        translation: translationRU,
    },
    en: {
        translation: translationEN,
    }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    keySeparator: '.',
    lng: 'ru',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;