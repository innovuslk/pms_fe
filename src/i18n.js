import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enTranslation from "./languages/en.json";
import cnTranslation from "./languages/chinese.json";
import snTranslation from "./languages/sinhala.json"

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: enTranslation.translation
            },
            zh:{
                translation: cnTranslation.translation
            },
            sn:{
                translation: snTranslation.translation
            }
        },
        debug:false,
        fallbackLng: "en",
        detection: {
            order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag", "path", "subdomain"],
            caches: ["cookie"]
        },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;