import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../locales/en.json";
import hi from "../../locales/hi.json";
import bn from "../../locales/bn.json";
import mr from "../../locales/mr.json";
import ta from "../../locales/ta.json";
import te from "../../locales/te.json";
import kn from "../../locales/kn.json";
import guj from "../../locales/guj.json";

export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "guj", label: "ગુજરાતી" },
] as const;

export const resources = {
  en: { translation: en },
  hi: { translation: hi },
  bn: { translation: bn },
  mr: { translation: mr },
  ta: { translation: ta },
  te: { translation: te },
  kn: { translation: kn },
  guj: { translation: guj },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnNull: false,
});

export default i18n;
