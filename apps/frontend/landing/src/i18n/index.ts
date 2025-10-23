import i18n from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import BrowserLanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .use(BrowserLanguageDetector)
  .use(
    resourcesToBackend((language: string) => import(`../../locales/${language}.json`)),
  )
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en'],
  });

export default i18n;
