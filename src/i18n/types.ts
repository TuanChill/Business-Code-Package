/**
 * I18n Type Definitions
 *
 * Types for internationalization support in business code messages.
 */

/**
 * Supported locales
 */
export type Locale = 'en' | 'vi';

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
 * Default unknown message for each locale
 */
export const DEFAULT_UNKNOWN_MESSAGE: Record<Locale, string> = {
  en: 'Unknown error',
  vi: 'Lỗi không xác định',
};
