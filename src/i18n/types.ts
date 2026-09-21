/**
 * I18n Type Definitions
 *
 * Types for internationalization support in business code messages.
 */

/**
 * Locales with built-in message tables
 */
export type BuiltInLocale = 'en' | 'vi';

/**
 * Supported locales. `'en'`/`'vi'` autocomplete, but any locale tag is
 * accepted (e.g. for custom messages registered via `registerMessages`).
 */
export type Locale = BuiltInLocale | (string & {});

/**
 * Map of business codes to their localized messages
 */
export type MessageMap = Record<number, string>;

/**
 * Configuration for i18n message provider
 */
export interface I18nConfig {
  /** Current locale */
  locale: Locale;
  /** Fallback locale when message not found (default: 'en') */
  fallbackLocale?: Locale;
  /** Custom messages to override defaults */
  customMessages?: Partial<Record<Locale, MessageMap>>;
}

/**
 * Default unknown message for each built-in locale
 */
export const DEFAULT_UNKNOWN_MESSAGE: Record<BuiltInLocale, string> = {
  en: 'Unknown error',
  vi: 'Lỗi không xác định',
};
