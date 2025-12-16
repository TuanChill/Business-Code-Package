/**
 * @chil/business-codes
 *
 * A TypeScript library for HTTP status codes, business error codes,
 * and standardized API responses. Compatible with NestJS and Next.js.
 *
 * @packageDocumentation
 */

// Constants
export {
  HttpStatus,
  getHttpStatusMessage,
  isSuccessStatus,
  isClientError,
  isServerError,
  isRedirect,
} from './constants/http-status';
export type { HttpStatusCode } from './constants/http-status';

export {
  BusinessCode,
  getBusinessCodeMessage,
  isSuccessCode,
  isAuthError,
  isUserError,
  isValidationError,
  isResourceError,
  isSystemError,
  isExternalError,
  isBusinessLogicError,
} from './constants/business-codes';
export type { BusinessCodeValue } from './constants/business-codes';

// Response
export { ApiResponse } from './response/api-response';

// Types
export type {
  PaginationMeta,
  ErrorDetails,
  SuccessParams,
  PaginatedParams,
  ErrorParams,
  ApiResponseParams,
} from './types';
