import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import translationRU from '../translations/powbow-ru.json'
import translationKG from '../translations/powbow-kg.json'

// the translations
const resources = {
	ru: {
		translation: translationRU,
	},
	kg: {
		translation: translationKG,
	},
}

i18n.use(initReactI18next).init({
	resources,
	keySeparator: '.',
	lng: 'ru',
	interpolation: {
		escapeValue: false,
	},
})

export default i18n
