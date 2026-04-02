import type { Locale } from "@/i18n/config";

/** Map app locale to BCP 47 tag for Intl APIs */
export function getIntlLocale(locale: Locale): string {
  return locale === "ru" ? "ru-RU" : "en-US";
}
