/**
 * React Integration for I18n
 *
 * React Context Provider and hooks for localized business messages.
 *
 * @example
 * ```tsx
 * // Layout
 * import { BusinessMessageProvider } from '@tchil/business-codes/i18n/react';
 * <BusinessMessageProvider locale="vi">{children}</BusinessMessageProvider>
 *
 * // Component
 * import { useBusinessMessage } from '@tchil/business-codes/i18n/react';
 * const { getMessage, getResponseMessage } = useBusinessMessage();
 * ```
 */

export {
  BusinessMessageProvider,
  useBusinessMessage,
  BusinessMessageContext,
  type BusinessMessageProviderProps,
} from './BusinessMessageProvider';
