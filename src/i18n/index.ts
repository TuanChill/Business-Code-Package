/**
 * I18n Module
 *
 * Internationalization support for business code messages.
 * Supports English and Vietnamese with custom message overrides.
 *
 * @example
 * ```typescript
 * import { getLocalizedMessage, setLocale, registerMessages } from '@tchil/business-codes/i18n';
 *
 * // Set global locale
 * setLocale('vi');
 *
 * // Get message
 * getLocalizedMessage(2001); // "Không tìm thấy người dùng"
 *
 * // Override messages
 * registerMessages('vi', { 2001: 'Tài khoản không tồn tại' });
 * ```
 */

// Types
export type { Locale, MessageMap, I18nConfig } from './types';
export { DEFAULT_UNKNOWN_MESSAGE } from './types';

// Core
export {
  BusinessMessageProvider,
  messageProvider,
  getLocalizedMessage,
  setLocale,
  registerMessages,
} from './message-provider';

// Locales (for advanced usage)
export { enMessages } from './locales/en';
export { viMessages } from './locales/vi';
