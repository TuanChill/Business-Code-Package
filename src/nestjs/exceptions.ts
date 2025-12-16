import { BusinessCode, getBusinessCodeMessage } from '../constants/business-codes';
import { HttpStatus } from '../constants/http-status';

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
    public readonly statusCode: number = HttpStatus.BAD_REQUEST,
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
      BusinessCode.VALIDATION_ERROR,
      message ?? 'Validation failed',
      HttpStatus.UNPROCESSABLE_ENTITY,
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
  constructor(businessCode: number = BusinessCode.AUTH_FAILED, message?: string) {
    super(businessCode, message, HttpStatus.UNAUTHORIZED);
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
    super(BusinessCode.PERMISSION_DENIED, message ?? 'Access denied', HttpStatus.FORBIDDEN);
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
  constructor(message?: string, businessCode: number = BusinessCode.RESOURCE_NOT_FOUND) {
    super(businessCode, message ?? 'Resource not found', HttpStatus.NOT_FOUND);
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
  constructor(message?: string, businessCode: number = BusinessCode.RESOURCE_CONFLICT) {
    super(businessCode, message ?? 'Resource conflict', HttpStatus.CONFLICT);
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
      BusinessCode.RATE_LIMIT_EXCEEDED,
      message ?? 'Too many requests',
      HttpStatus.TOO_MANY_REQUESTS
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
  constructor(message?: string, businessCode: number = BusinessCode.INTERNAL_ERROR) {
    super(businessCode, message ?? 'Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
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
  constructor(message?: string, businessCode: number = BusinessCode.INVALID_INPUT) {
    super(businessCode, message ?? 'Bad request', HttpStatus.BAD_REQUEST);
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
  constructor(message?: string, businessCode: number = BusinessCode.SERVICE_UNAVAILABLE) {
    super(businessCode, message ?? 'Service unavailable', HttpStatus.SERVICE_UNAVAILABLE);
    this.name = 'ServiceUnavailableException';
  }
}
