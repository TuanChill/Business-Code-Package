/**
 * Business Error Codes
 *
 * Custom error codes for business logic. These codes provide more specific
 * information about what went wrong beyond HTTP status codes.
 *
 * Code Ranges:
 * - 0-99: Success codes
 * - 1xxx: Authentication & Authorization errors
 * - 2xxx: User-related errors
 * - 3xxx: Validation errors
 * - 4xxx: Resource errors
 * - 5xxx: Server/System errors
 * - 6xxx: External service errors
 * - 7xxx: Business logic errors
 *
 * @example
 * ```typescript
 * import { BusinessCode, getBusinessCodeMessage } from '@tchil/business-codes';
 *
 * throw new BusinessException(BusinessCode.USER_NOT_FOUND, 'User does not exist');
 * ```
 */
export const BusinessCode = {
  // ==========================================
  // Success Codes (0-99)
  // ==========================================
  /** Operation completed successfully */
  SUCCESS: 0,
  /** Resource created successfully */
  CREATED: 1,
  /** Resource updated successfully */
  UPDATED: 2,
  /** Resource deleted successfully */
  DELETED: 3,
  /** Operation accepted for processing */
  ACCEPTED: 4,
  /** No changes were made */
  NO_CHANGE: 5,

  // ==========================================
  // Authentication & Authorization Errors (1xxx)
  // ==========================================
  /** Authentication failed */
  AUTH_FAILED: 1001,
  /** Access token has expired */
  TOKEN_EXPIRED: 1002,
  /** Access token is invalid */
  TOKEN_INVALID: 1003,
  /** Access token is missing */
  TOKEN_MISSING: 1004,
  /** Refresh token has expired */
  REFRESH_TOKEN_EXPIRED: 1005,
  /** Refresh token is invalid */
  REFRESH_TOKEN_INVALID: 1006,
  /** Insufficient permissions for this action */
  PERMISSION_DENIED: 1007,
  /** Account is locked */
  ACCOUNT_LOCKED: 1008,
  /** Account is not verified */
  ACCOUNT_NOT_VERIFIED: 1009,
  /** Session has expired */
  SESSION_EXPIRED: 1010,
  /** Invalid API key */
  INVALID_API_KEY: 1011,
  /** Rate limit exceeded for authentication */
  AUTH_RATE_LIMITED: 1012,
  /** Two-factor authentication required */
  TWO_FACTOR_REQUIRED: 1013,
  /** Two-factor authentication failed */
  TWO_FACTOR_FAILED: 1014,
  /** OAuth authentication failed */
  OAUTH_FAILED: 1015,
  /** OAuth provider error */
  OAUTH_PROVIDER_ERROR: 1016,

  // ==========================================
  // User Errors (2xxx)
  // ==========================================
  /** User not found */
  USER_NOT_FOUND: 2001,
  /** User already exists */
  USER_ALREADY_EXISTS: 2002,
  /** User account is inactive */
  USER_INACTIVE: 2003,
  /** Invalid credentials provided */
  INVALID_CREDENTIALS: 2004,
  /** User account is suspended */
  USER_SUSPENDED: 2005,
  /** User account is deleted */
  USER_DELETED: 2006,
  /** Email already in use */
  EMAIL_ALREADY_EXISTS: 2007,
  /** Username already in use */
  USERNAME_ALREADY_EXISTS: 2008,
  /** Phone number already in use */
  PHONE_ALREADY_EXISTS: 2009,
  /** Invalid email format */
  INVALID_EMAIL: 2010,
  /** Password too weak */
  WEAK_PASSWORD: 2011,
  /** Password mismatch */
  PASSWORD_MISMATCH: 2012,
  /** Old password is incorrect */
  INCORRECT_OLD_PASSWORD: 2013,
  /** Profile not complete */
  PROFILE_INCOMPLETE: 2014,

  // ==========================================
  // Validation Errors (3xxx)
  // ==========================================
  /** General validation error */
  VALIDATION_ERROR: 3001,
  /** Invalid input provided */
  INVALID_INPUT: 3002,
  /** Required field is missing */
  MISSING_REQUIRED_FIELD: 3003,
  /** Field value is out of range */
  VALUE_OUT_OF_RANGE: 3004,
  /** Invalid format */
  INVALID_FORMAT: 3005,
  /** Field is too long */
  FIELD_TOO_LONG: 3006,
  /** Field is too short */
  FIELD_TOO_SHORT: 3007,
  /** Invalid date format */
  INVALID_DATE_FORMAT: 3008,
  /** Date is in the past */
  DATE_IN_PAST: 3009,
  /** Date is in the future */
  DATE_IN_FUTURE: 3010,
  /** Invalid file type */
  INVALID_FILE_TYPE: 3011,
  /** File size too large */
  FILE_TOO_LARGE: 3012,
  /** Invalid JSON format */
  INVALID_JSON: 3013,
  /** Invalid UUID format */
  INVALID_UUID: 3014,
  /** Invalid phone number format */
  INVALID_PHONE_NUMBER: 3015,
  /** Duplicate entry */
  DUPLICATE_ENTRY: 3016,

  // ==========================================
  // Resource Errors (4xxx)
  // ==========================================
  /** Resource not found */
  RESOURCE_NOT_FOUND: 4001,
  /** Resource already exists */
  RESOURCE_ALREADY_EXISTS: 4002,
  /** Resource is locked */
  RESOURCE_LOCKED: 4003,
  /** Resource has been deleted */
  RESOURCE_DELETED: 4004,
  /** Resource is expired */
  RESOURCE_EXPIRED: 4005,
  /** Resource limit reached */
  RESOURCE_LIMIT_REACHED: 4006,
  /** Resource is not available */
  RESOURCE_UNAVAILABLE: 4007,
  /** Resource conflict */
  RESOURCE_CONFLICT: 4008,
  /** Resource version mismatch */
  VERSION_MISMATCH: 4009,
  /** Cannot delete resource with dependencies */
  HAS_DEPENDENCIES: 4010,

  // ==========================================
  // Server/System Errors (5xxx)
  // ==========================================
  /** Internal server error */
  INTERNAL_ERROR: 5001,
  /** Database error */
  DATABASE_ERROR: 5002,
  /** External service error */
  EXTERNAL_SERVICE_ERROR: 5003,
  /** Service temporarily unavailable */
  SERVICE_UNAVAILABLE: 5004,
  /** Configuration error */
  CONFIG_ERROR: 5005,
  /** Cache error */
  CACHE_ERROR: 5006,
  /** File system error */
  FILE_SYSTEM_ERROR: 5007,
  /** Memory limit exceeded */
  MEMORY_LIMIT_EXCEEDED: 5008,
  /** Timeout error */
  TIMEOUT_ERROR: 5009,
  /** Queue error */
  QUEUE_ERROR: 5010,

  // ==========================================
  // External Service Errors (6xxx)
  // ==========================================
  /** Third-party API error */
  THIRD_PARTY_API_ERROR: 6001,
  /** Payment gateway error */
  PAYMENT_GATEWAY_ERROR: 6002,
  /** Email service error */
  EMAIL_SERVICE_ERROR: 6003,
  /** SMS service error */
  SMS_SERVICE_ERROR: 6004,
  /** Storage service error */
  STORAGE_SERVICE_ERROR: 6005,
  /** Search service error */
  SEARCH_SERVICE_ERROR: 6006,
  /** Notification service error */
  NOTIFICATION_SERVICE_ERROR: 6007,
  /** Analytics service error */
  ANALYTICS_SERVICE_ERROR: 6008,

  // ==========================================
  // Business Logic Errors (7xxx)
  // ==========================================
  /** Operation not allowed */
  OPERATION_NOT_ALLOWED: 7001,
  /** Insufficient balance */
  INSUFFICIENT_BALANCE: 7002,
  /** Transaction failed */
  TRANSACTION_FAILED: 7003,
  /** Order cannot be cancelled */
  ORDER_CANNOT_CANCEL: 7004,
  /** Order cannot be modified */
  ORDER_CANNOT_MODIFY: 7005,
  /** Item out of stock */
  OUT_OF_STOCK: 7006,
  /** Coupon invalid */
  COUPON_INVALID: 7007,
  /** Coupon expired */
  COUPON_EXPIRED: 7008,
  /** Minimum order not met */
  MINIMUM_ORDER_NOT_MET: 7009,
  /** Maximum quantity exceeded */
  MAX_QUANTITY_EXCEEDED: 7010,
  /** Subscription required */
  SUBSCRIPTION_REQUIRED: 7011,
  /** Subscription expired */
  SUBSCRIPTION_EXPIRED: 7012,
  /** Feature not available */
  FEATURE_NOT_AVAILABLE: 7013,
  /** Quota exceeded */
  QUOTA_EXCEEDED: 7014,
  /** Rate limit exceeded */
  RATE_LIMIT_EXCEEDED: 7015,
} as const;

/**
 * Type representing all valid business code values
 */
export type BusinessCodeValue = (typeof BusinessCode)[keyof typeof BusinessCode];

/**
 * Default messages for business codes
 */
const businessCodeMessages: Record<number, string> = {
  // Success
  0: 'Operation completed successfully',
  1: 'Resource created successfully',
  2: 'Resource updated successfully',
  3: 'Resource deleted successfully',
  4: 'Operation accepted for processing',
  5: 'No changes were made',

  // Auth
  1001: 'Authentication failed',
  1002: 'Access token has expired',
  1003: 'Access token is invalid',
  1004: 'Access token is missing',
  1005: 'Refresh token has expired',
  1006: 'Refresh token is invalid',
  1007: 'Insufficient permissions',
  1008: 'Account is locked',
  1009: 'Account is not verified',
  1010: 'Session has expired',
  1011: 'Invalid API key',
  1012: 'Too many authentication attempts',
  1013: 'Two-factor authentication required',
  1014: 'Two-factor authentication failed',
  1015: 'OAuth authentication failed',
  1016: 'OAuth provider error',

  // User
  2001: 'User not found',
  2002: 'User already exists',
  2003: 'User account is inactive',
  2004: 'Invalid credentials',
  2005: 'User account is suspended',
  2006: 'User account is deleted',
  2007: 'Email already in use',
  2008: 'Username already in use',
  2009: 'Phone number already in use',
  2010: 'Invalid email format',
  2011: 'Password is too weak',
  2012: 'Passwords do not match',
  2013: 'Old password is incorrect',
  2014: 'Profile is incomplete',

  // Validation
  3001: 'Validation error',
  3002: 'Invalid input',
  3003: 'Required field is missing',
  3004: 'Value is out of range',
  3005: 'Invalid format',
  3006: 'Field is too long',
  3007: 'Field is too short',
  3008: 'Invalid date format',
  3009: 'Date cannot be in the past',
  3010: 'Date cannot be in the future',
  3011: 'Invalid file type',
  3012: 'File size is too large',
  3013: 'Invalid JSON format',
  3014: 'Invalid UUID format',
  3015: 'Invalid phone number format',
  3016: 'Duplicate entry',

  // Resource
  4001: 'Resource not found',
  4002: 'Resource already exists',
  4003: 'Resource is locked',
  4004: 'Resource has been deleted',
  4005: 'Resource has expired',
  4006: 'Resource limit reached',
  4007: 'Resource is not available',
  4008: 'Resource conflict',
  4009: 'Version mismatch',
  4010: 'Cannot delete resource with dependencies',

  // Server
  5001: 'Internal server error',
  5002: 'Database error',
  5003: 'External service error',
  5004: 'Service temporarily unavailable',
  5005: 'Configuration error',
  5006: 'Cache error',
  5007: 'File system error',
  5008: 'Memory limit exceeded',
  5009: 'Operation timed out',
  5010: 'Queue error',

  // External
  6001: 'Third-party API error',
  6002: 'Payment gateway error',
  6003: 'Email service error',
  6004: 'SMS service error',
  6005: 'Storage service error',
  6006: 'Search service error',
  6007: 'Notification service error',
  6008: 'Analytics service error',

  // Business
  7001: 'Operation not allowed',
  7002: 'Insufficient balance',
  7003: 'Transaction failed',
  7004: 'Order cannot be cancelled',
  7005: 'Order cannot be modified',
  7006: 'Item out of stock',
  7007: 'Coupon is invalid',
  7008: 'Coupon has expired',
  7009: 'Minimum order not met',
  7010: 'Maximum quantity exceeded',
  7011: 'Subscription required',
  7012: 'Subscription has expired',
  7013: 'Feature not available',
  7014: 'Quota exceeded',
  7015: 'Rate limit exceeded',
};

/**
 * Get the default message for a business code
 *
 * @param code - The business code
 * @returns The default message for the code
 *
 * @example
 * ```typescript
 * getBusinessCodeMessage(BusinessCode.USER_NOT_FOUND); // 'User not found'
 * ```
 */
export function getBusinessCodeMessage(code: number): string {
  return businessCodeMessages[code] || 'Unknown error';
}

/**
 * Check if a business code indicates success
 */
export function isSuccessCode(code: number): boolean {
  return code >= 0 && code < 100;
}

/**
 * Check if a business code indicates an authentication error
 */
export function isAuthError(code: number): boolean {
  return code >= 1000 && code < 2000;
}

/**
 * Check if a business code indicates a user error
 */
export function isUserError(code: number): boolean {
  return code >= 2000 && code < 3000;
}

/**
 * Check if a business code indicates a validation error
 */
export function isValidationError(code: number): boolean {
  return code >= 3000 && code < 4000;
}

/**
 * Check if a business code indicates a resource error
 */
export function isResourceError(code: number): boolean {
  return code >= 4000 && code < 5000;
}

/**
 * Check if a business code indicates a server error
 */
export function isSystemError(code: number): boolean {
  return code >= 5000 && code < 6000;
}

/**
 * Check if a business code indicates an external service error
 */
export function isExternalError(code: number): boolean {
  return code >= 6000 && code < 7000;
}

/**
 * Check if a business code indicates a business logic error
 */
export function isBusinessLogicError(code: number): boolean {
  return code >= 7000 && code < 8000;
}
