import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';
import * as Updates from 'expo-updates';

import en from './en.json';
import ar from './ar.json';

const LANGUAGE_KEY = 'app_language';

const resources = {
  en: { translation: en },
  ar: { translation: ar },
};

export const initI18n = async () => {
  let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
  
  if (!savedLanguage) {
    // Detect device language. Fallback to 'en'
    const deviceLang = Localization.getLocales()[0]?.languageCode || 'en';
    savedLanguage = deviceLang === 'ar' ? 'ar' : 'en';
  }

  // Force RTL based on language
  const isRTL = savedLanguage === 'ar';
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);
    // If the RTL setting doesn't match the current engine state, we MUST reload the app.
    // However, during initialization, we rely on the caller to handle reload if needed, 
    // or we just set it so the *next* reload catches it. We usually handle reload explicitly on user toggle.
  }

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes values
      },
    });
};

export const changeLanguage = async (lng: 'en' | 'ar') => {
  await AsyncStorage.setItem(LANGUAGE_KEY, lng);
  const isRTL = lng === 'ar';
  
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
  
  await i18n.changeLanguage(lng);
  
  // Reload app to apply RTL layout changes
  await Updates.reloadAsync();
};

export default i18n;
