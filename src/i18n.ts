import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import {ru} from "./lang-config/ru";
import {en} from "./lang-config/en";
import {pl} from "./lang-config/pl";


i18n
  .use(initReactI18next)
  .init({
    resources: {
      ...ru,
      ...en,
      ...pl,
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'b', 'strong', 'i'],
      useSuspense: true,
    }
  });

export default i18n;
