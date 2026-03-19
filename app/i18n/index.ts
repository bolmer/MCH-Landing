import { translations, type Locale, type Translations } from "./translations";

export type { Locale, Translations };
export { translations };

/** Get translations for a given locale (server-side helper) */
export function getTranslations(locale: Locale): Translations {
	return translations[locale];
}

/** Validate and normalize a locale string */
export function normalizeLocale(value: string | undefined): Locale {
	if (value === "es" || value === "en") return value;
	return "en";
}
