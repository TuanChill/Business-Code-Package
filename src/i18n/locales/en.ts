/**
 * English Messages for Business Codes
 *
 * Default English translations for all business error codes.
 */

import { MessageMap } from '../types';

export const enMessages: MessageMap = {
  // Success (0-99)
  0: 'Operation completed successfully',
  1: 'Resource created successfully',
  2: 'Resource updated successfully',
  3: 'Resource deleted successfully',
  4: 'Operation accepted for processing',
  5: 'No changes were made',

  // Auth (1xxx)
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

  // User (2xxx)
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

  // Validation (3xxx)
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

  // Resource (4xxx)
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

  // Server (5xxx)
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

  // External (6xxx)
  6001: 'Third-party API error',
  6002: 'Payment gateway error',
  6003: 'Email service error',
  6004: 'SMS service error',
  6005: 'Storage service error',
  6006: 'Search service error',
  6007: 'Notification service error',
  6008: 'Analytics service error',

  // Business (7xxx)
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
