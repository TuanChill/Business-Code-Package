"use client";

/**
 * React Provider for Business Messages
 *
 * Provides localized business messages throughout your React/Next.js app.
 * Configure once in layout, use anywhere with useBusinessMessage hook.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { BusinessMessageProvider } from '@tchil/business-codes/i18n/react';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <BusinessMessageProvider locale="vi">
 *       {children}
 *     </BusinessMessageProvider>
 *   );
 * }
 *
 * // Any component
 * import { useBusinessMessage } from '@tchil/business-codes/i18n/react';
 *
 * function MyComponent() {
 *   const { getMessage, getResponseMessage } = useBusinessMessage();
 *   toast.error(getResponseMessage(apiResponse));
 * }
 * ```
 */

import { createContext, useContext, useMemo, ReactNode } from "react";
import { Locale, MessageMap } from "../types";
import { BusinessMessageProvider as MessageProviderClass } from "../message-provider";

/**
 * API Response interface (matches library's ApiResponse)
 */
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code?: number;
    details?: Record<string, unknown>;
  };
}

/**
 * Context value interface
 */
interface BusinessMessageContextValue {
  /** Current locale */
  locale: Locale;
  /** Get message by business code */
  getMessage: (code: number) => string;
  /** Get message from API response */
  getResponseMessage: <T>(response: ApiResponse<T>) => string;
  /** Get error message from any error */
  getErrorMessage: (error: unknown) => string;
}

/**
 * React Context
 */
const BusinessMessageContext =
  createContext<BusinessMessageContextValue | null>(null);

/**
 * Provider Props
 */
export interface BusinessMessageProviderProps {
  /** Current locale */
  locale: Locale;
  /** Custom message overrides */
  customMessages?: MessageMap;
  /** Fallback locale */
  fallbackLocale?: Locale;
  /** Children */
  children: ReactNode;
}

/**
 * Business Message Provider Component
 *
 * Wrap your app with this provider to enable localized business messages.
 */
export function BusinessMessageProvider({
  locale,
  customMessages,
  fallbackLocale = "en",
  children,
}: BusinessMessageProviderProps) {
  const contextValue = useMemo<BusinessMessageContextValue>(() => {
    const provider = new MessageProviderClass({
      locale,
      fallbackLocale,
      customMessages: customMessages ? { [locale]: customMessages } : undefined,
    });

    return {
      locale,

      getMessage: (code: number) => provider.getMessage(code),

      getResponseMessage: <T,>(response: ApiResponse<T>) => {
        // If success, return success message
        if (response.success) {
          return response.message ?? provider.getMessage(0);
        }

        // If error with code, get localized message
        if (response.error?.code !== undefined) {
          return provider.getMessage(response.error.code);
        }

        // Fallback to response message or generic error
        return response.message ?? provider.getMessage(5001);
      },

      getErrorMessage: (error: unknown) => {
        if (error instanceof Error) {
          return error.message;
        }
        if (typeof error === "string") {
          return error;
        }
        return provider.getMessage(5001);
      },
    };
  }, [locale, customMessages, fallbackLocale]);

  return (
    <BusinessMessageContext.Provider value={contextValue}>
      {children}
    </BusinessMessageContext.Provider>
  );
}

/**
 * Hook to access business messages
 *
 * Must be used within a BusinessMessageProvider
 */
export function useBusinessMessage(): BusinessMessageContextValue {
  const context = useContext(BusinessMessageContext);

  if (!context) {
    throw new Error(
      "useBusinessMessage must be used within a BusinessMessageProvider. " +
        'Wrap your app with <BusinessMessageProvider locale="...">.'
    );
  }

  return context;
}

/**
 * Export context for advanced usage
 */
export { BusinessMessageContext };
