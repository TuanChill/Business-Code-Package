import { getBusinessCodeMessage } from '../constants/business-codes';
import { RESPONSE_MAPPING } from '../constants/response-mapping';

/**
 * Base class for business exceptions
 *
 * Use this to throw errors with business-specific error codes.
 * These exceptions are automatically handled by the ApiExceptionFilter.
 *
 * @example
 * ```typescript
 * throw new BusinessException(BusinessCode.USER_NOT_FOUND, 'User does not exist');
 * ```
 */
export class BusinessException extends Error {
  constructor(
    public readonly businessCode: number,
    message?: string,
    public readonly statusCode: number = RESPONSE_MAPPING.BAD_REQUEST.httpStatus,
    public readonly details?: Record<string, unknown>
  ) {
    super(message ?? getBusinessCodeMessage(businessCode));
    this.name = 'BusinessException';
  }
}

/**
 * Exception for validation errors
 *
 * @example
 * ```typescript
 * throw new ValidationException({
 *   email: 'Invalid email format',
 *   age: 'Must be at least 18'
 * });
 * ```
 */
export class ValidationException extends BusinessException {
  constructor(details: Record<string, unknown>, message?: string) {
    super(
      RESPONSE_MAPPING.VALIDATION_ERROR.businessCode,
      message ?? 'Validation failed',
      RESPONSE_MAPPING.VALIDATION_ERROR.httpStatus,
      details
    );
    this.name = 'ValidationException';
  }
}

/**
 * Exception for authentication errors
 *
 * @example
 * ```typescript
 * throw new AuthException(BusinessCode.TOKEN_EXPIRED, 'Your session has expired');
 * ```
 */
export class AuthException extends BusinessException {
  constructor(businessCode: number = RESPONSE_MAPPING.UNAUTHORIZED.businessCode, message?: string) {
    super(businessCode, message, RESPONSE_MAPPING.UNAUTHORIZED.httpStatus);
    this.name = 'AuthException';
  }
}

/**
 * Exception for permission/authorization errors
 *
 * @example
 * ```typescript
 * throw new ForbiddenException('You do not have permission to access this resource');
 * ```
 */
export class ForbiddenException extends BusinessException {
  constructor(message?: string) {
    super(
      RESPONSE_MAPPING.FORBIDDEN.businessCode,
      message ?? 'Access denied',
      RESPONSE_MAPPING.FORBIDDEN.httpStatus
    );
    this.name = 'ForbiddenException';
  }
}

/**
 * Exception for resource not found errors
 *
 * @example
 * ```typescript
 * throw new NotFoundException('User not found', BusinessCode.USER_NOT_FOUND);
 * ```
 */
export class NotFoundException extends BusinessException {
  constructor(message?: string, businessCode: number = RESPONSE_MAPPING.NOT_FOUND.businessCode) {
    super(businessCode, message ?? 'Resource not found', RESPONSE_MAPPING.NOT_FOUND.httpStatus);
    this.name = 'NotFoundException';
  }
}

/**
 * Exception for conflict errors (e.g., duplicate resources)
 *
 * @example
 * ```typescript
 * throw new ConflictException('Email already exists', BusinessCode.EMAIL_ALREADY_EXISTS);
 * ```
 */
export class ConflictException extends BusinessException {
  constructor(message?: string, businessCode: number = RESPONSE_MAPPING.CONFLICT.businessCode) {
    super(businessCode, message ?? 'Resource conflict', RESPONSE_MAPPING.CONFLICT.httpStatus);
    this.name = 'ConflictException';
  }
}

/**
 * Exception for rate limiting
 *
 * @example
 * ```typescript
 * throw new RateLimitException('Too many login attempts');
 * ```
 */
export class RateLimitException extends BusinessException {
  constructor(message?: string) {
    super(
      RESPONSE_MAPPING.TOO_MANY_REQUESTS.businessCode,
      message ?? 'Too many requests',
      RESPONSE_MAPPING.TOO_MANY_REQUESTS.httpStatus
    );
    this.name = 'RateLimitException';
  }
}

/**
 * Exception for internal server errors
 *
 * @example
 * ```typescript
 * throw new InternalServerException('Database connection failed', BusinessCode.DATABASE_ERROR);
 * ```
 */
export class InternalServerException extends BusinessException {
  constructor(message?: string, businessCode: number = RESPONSE_MAPPING.INTERNAL_ERROR.businessCode) {
    super(businessCode, message ?? 'Internal server error', RESPONSE_MAPPING.INTERNAL_ERROR.httpStatus);
    this.name = 'InternalServerException';
  }
}

/**
 * Exception for bad request errors
 *
 * @example
 * ```typescript
 * throw new BadRequestException('Invalid request parameters');
 * ```
 */
export class BadRequestException extends BusinessException {
  constructor(message?: string, businessCode: number = RESPONSE_MAPPING.BAD_REQUEST.businessCode) {
    super(businessCode, message ?? 'Bad request', RESPONSE_MAPPING.BAD_REQUEST.httpStatus);
    this.name = 'BadRequestException';
  }
}

/**
 * Exception for service unavailable errors
 *
 * @example
 * ```typescript
 * throw new ServiceUnavailableException('Service is under maintenance');
 * ```
 */
export class ServiceUnavailableException extends BusinessException {
  constructor(message?: string, businessCode: number = RESPONSE_MAPPING.SERVICE_UNAVAILABLE.businessCode) {
    super(businessCode, message ?? 'Service unavailable', RESPONSE_MAPPING.SERVICE_UNAVAILABLE.httpStatus);
    this.name = 'ServiceUnavailableException';
  }
}
