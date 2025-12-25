/**
 * Business Message Provider
 *
 * Core class for managing internationalized business code messages
 * with support for custom message overrides.
 */

import { Locale, MessageMap, I18nConfig, DEFAULT_UNKNOWN_MESSAGE } from './types';
import { enMessages } from './locales/en';
import { viMessages } from './locales/vi';

/**
 * Built-in messages for all supported locales
 */
const builtInMessages: Record<Locale, MessageMap> = {
  en: enMessages,
  vi: viMessages,
};

/**
 * Business Message Provider Class
 *
 * Manages localized messages for business codes with support for:
 * - Multiple locales (en, vi)
 * - Fallback locale
 * - Custom message overrides
 *
 * @example
 * ```typescript
 * const provider = new BusinessMessageProvider({ locale: 'vi' });
 * provider.getMessage(2001); // "Không tìm thấy người dùng"
 *
 * // Override a message
 * provider.registerMessages('vi', { 2001: 'Tài khoản không tồn tại' });
 * provider.getMessage(2001); // "Tài khoản không tồn tại"
 * ```
 */
export class BusinessMessageProvider {
  private locale: Locale;
  private fallbackLocale: Locale;
  private customMessages: Map<Locale, MessageMap>;

  constructor(config?: Partial<I18nConfig>) {
    this.locale = config?.locale ?? 'en';
    this.fallbackLocale = config?.fallbackLocale ?? 'en';
    this.customMessages = new Map();

    // Initialize with any provided custom messages
    if (config?.customMessages) {
      Object.entries(config.customMessages).forEach(([locale, messages]) => {
        if (messages) {
          this.customMessages.set(locale as Locale, messages);
        }
      });
    }
  }

  /**
   * Set the current locale
   */
  setLocale(locale: Locale): void {
    this.locale = locale;
  }

  /**
   * Get the current locale
   */
  getLocale(): Locale {
    return this.locale;
  }

  /**
   * Register custom messages for a locale
   * Custom messages override built-in messages
   */
  registerMessages(locale: Locale, messages: MessageMap): void {
    const existing = this.customMessages.get(locale) ?? {};
    this.customMessages.set(locale, { ...existing, ...messages });
  }

  /**
   * Get message for a business code
   */
  getMessage(code: number, locale?: Locale): string {
    const targetLocale = locale ?? this.locale;

    // 1. Check custom messages first
    const customMessage = this.customMessages.get(targetLocale)?.[code];
    if (customMessage) {
      return customMessage;
    }

    // 2. Check built-in messages
    const builtInMessage = builtInMessages[targetLocale]?.[code];
    if (builtInMessage) {
      return builtInMessage;
    }

    // 3. Fallback to fallback locale (if different)
    if (targetLocale !== this.fallbackLocale) {
      const fallbackCustom = this.customMessages.get(this.fallbackLocale)?.[code];
      if (fallbackCustom) {
        return fallbackCustom;
      }

      const fallbackBuiltIn = builtInMessages[this.fallbackLocale]?.[code];
      if (fallbackBuiltIn) {
        return fallbackBuiltIn;
      }
    }

    // 4. Return unknown message
    return DEFAULT_UNKNOWN_MESSAGE[targetLocale] ?? DEFAULT_UNKNOWN_MESSAGE.en;
  }

  /**
   * Check if a message exists for a code
   */
  hasMessage(code: number, locale?: Locale): boolean {
    const targetLocale = locale ?? this.locale;
    return (
      this.customMessages.get(targetLocale)?.[code] !== undefined ||
      builtInMessages[targetLocale]?.[code] !== undefined
    );
  }
}

/**
 * Default singleton instance
 */
export const messageProvider = new BusinessMessageProvider();

/**
 * Get localized message for a business code
 *
 * @param code - Business code
 * @param locale - Optional locale override
 */
export function getLocalizedMessage(code: number, locale?: Locale): string {
  return messageProvider.getMessage(code, locale);
}

/**
 * Set the global locale
 */
export function setLocale(locale: Locale): void {
  messageProvider.setLocale(locale);
}

/**
 * Register custom messages globally
 */
export function registerMessages(locale: Locale, messages: MessageMap): void {
  messageProvider.registerMessages(locale, messages);
}
