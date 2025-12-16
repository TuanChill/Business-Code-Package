import type {
  ApiResponseParams,
  SuccessParams,
  ErrorParams,
  PaginatedParams,
  PaginationMeta,
  ErrorDetails,
} from '../types';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';

/**
 * Standardized API Response class
 *
 * Provides a consistent structure for all API responses across your application.
 * Works with both NestJS and Next.js.
 *
 * @example
 * ```typescript
 * // Success response
 * ApiResponse.success({ data: user, message: 'User retrieved successfully' });
 *
 * // Error response
 * ApiResponse.error({ message: 'User not found', code: BusinessCode.USER_NOT_FOUND, statusCode: 404 });
 *
 * // Paginated response
 * ApiResponse.paginated({ data: users, page: 1, limit: 10, total: 100 });
 * ```
 */
export class ApiResponse<T = unknown> {
  /** Whether the operation was successful */
  success: boolean;

  /** Response data (for success responses) */
  data?: T;

  /** Response message */
  message?: string;

  /** HTTP status code */
  statusCode?: number;

  /** Pagination or additional metadata */
  meta?: PaginationMeta;

  /** Error details (for error responses) */
  error?: ErrorDetails;

  constructor(params: ApiResponseParams<T>) {
    this.success = params.success;
    this.data = params.data;
    this.message = params.message;
    this.statusCode = params.statusCode;
    this.meta = params.meta;
    this.error = params.error;
  }

  /**
   * Create a success response
   *
   * @param params - Success response parameters
   * @returns ApiResponse instance with success=true
   *
   * @example
   * ```typescript
   * // Simple success
   * ApiResponse.success({ data: { id: 1, name: 'John' } });
   *
   * // With message
   * ApiResponse.success({ data: user, message: 'User created successfully', statusCode: 201 });
   * ```
   */
  static success<T>(params: SuccessParams<T> = {}): ApiResponse<T> {
    return new ApiResponse<T>({
      success: true,
      data: params.data,
      message: params.message ?? 'Success',
      statusCode: params.statusCode ?? HttpStatus.OK,
      meta: params.meta,
    });
  }

  /**
   * Create an error response
   *
   * @param params - Error response parameters
   * @returns ApiResponse instance with success=false
   *
   * @example
   * ```typescript
   * // Simple error
   * ApiResponse.error({ message: 'Something went wrong' });
   *
   * // With business code
   * ApiResponse.error({
   *   message: 'User not found',
   *   code: BusinessCode.USER_NOT_FOUND,
   *   statusCode: HttpStatus.NOT_FOUND
   * });
   *
   * // With validation details
   * ApiResponse.error({
   *   message: 'Validation failed',
   *   code: BusinessCode.VALIDATION_ERROR,
   *   details: { email: 'Invalid email format', age: 'Must be a number' }
   * });
   * ```
   */
  static error(params: ErrorParams = {}): ApiResponse<null> {
    return new ApiResponse<null>({
      success: false,
      message: params.message ?? 'Error',
      statusCode: params.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR,
      error: {
        code: params.code ?? BusinessCode.INTERNAL_ERROR,
        details: params.details,
      },
    });
  }

  /**
   * Create a paginated success response
   *
   * @param params - Paginated response parameters
   * @returns ApiResponse instance with pagination metadata
   *
   * @example
   * ```typescript
   * const users = await userService.findAll({ page: 1, limit: 10 });
   * return ApiResponse.paginated({
   *   data: users.items,
   *   page: 1,
   *   limit: 10,
   *   total: users.total
   * });
   * ```
   */
  static paginated<T>(params: PaginatedParams<T>): ApiResponse<T[]> {
    const totalPages = Math.ceil(params.total / params.limit);

    return new ApiResponse<T[]>({
      success: true,
      data: params.data,
      message: params.message ?? 'Success',
      statusCode: params.statusCode ?? HttpStatus.OK,
      meta: {
        page: params.page,
        limit: params.limit,
        total: params.total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
        ...params.meta,
      },
    });
  }

  /**
   * Create a "created" success response (HTTP 201)
   *
   * @param data - The created resource
   * @param message - Optional success message
   * @returns ApiResponse instance with statusCode 201
   */
  static created<T>(data: T, message?: string): ApiResponse<T> {
    return ApiResponse.success({
      data,
      message: message ?? 'Resource created successfully',
      statusCode: HttpStatus.CREATED,
    });
  }

  /**
   * Create a "no content" success response (HTTP 204)
   *
   * @param message - Optional success message
   * @returns ApiResponse instance with statusCode 204 and no data
   */
  static noContent(message?: string): ApiResponse<null> {
    return new ApiResponse<null>({
      success: true,
      message: message ?? 'No content',
      statusCode: HttpStatus.NO_CONTENT,
    });
  }

  /**
   * Create a "bad request" error response (HTTP 400)
   *
   * @param message - Error message
   * @param details - Optional error details
   * @returns ApiResponse error instance with statusCode 400
   */
  static badRequest(message?: string, details?: Record<string, unknown>): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Bad request',
      code: BusinessCode.INVALID_INPUT,
      statusCode: HttpStatus.BAD_REQUEST,
      details,
    });
  }

  /**
   * Create an "unauthorized" error response (HTTP 401)
   *
   * @param message - Error message
   * @param code - Optional business code (defaults to AUTH_FAILED)
   * @returns ApiResponse error instance with statusCode 401
   */
  static unauthorized(message?: string, code?: number): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Unauthorized',
      code: code ?? BusinessCode.AUTH_FAILED,
      statusCode: HttpStatus.UNAUTHORIZED,
    });
  }

  /**
   * Create a "forbidden" error response (HTTP 403)
   *
   * @param message - Error message
   * @returns ApiResponse error instance with statusCode 403
   */
  static forbidden(message?: string): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Forbidden',
      code: BusinessCode.PERMISSION_DENIED,
      statusCode: HttpStatus.FORBIDDEN,
    });
  }

  /**
   * Create a "not found" error response (HTTP 404)
   *
   * @param message - Error message
   * @param code - Optional business code (defaults to RESOURCE_NOT_FOUND)
   * @returns ApiResponse error instance with statusCode 404
   */
  static notFound(message?: string, code?: number): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Not found',
      code: code ?? BusinessCode.RESOURCE_NOT_FOUND,
      statusCode: HttpStatus.NOT_FOUND,
    });
  }

  /**
   * Create a "conflict" error response (HTTP 409)
   *
   * @param message - Error message
   * @param code - Optional business code (defaults to RESOURCE_CONFLICT)
   * @returns ApiResponse error instance with statusCode 409
   */
  static conflict(message?: string, code?: number): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Conflict',
      code: code ?? BusinessCode.RESOURCE_CONFLICT,
      statusCode: HttpStatus.CONFLICT,
    });
  }

  /**
   * Create a "validation error" response (HTTP 422)
   *
   * @param details - Validation error details
   * @param message - Optional error message
   * @returns ApiResponse error instance with statusCode 422
   */
  static validationError(details: Record<string, unknown>, message?: string): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Validation failed',
      code: BusinessCode.VALIDATION_ERROR,
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      details,
    });
  }

  /**
   * Create a "too many requests" error response (HTTP 429)
   *
   * @param message - Error message
   * @returns ApiResponse error instance with statusCode 429
   */
  static tooManyRequests(message?: string): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Too many requests',
      code: BusinessCode.RATE_LIMIT_EXCEEDED,
      statusCode: HttpStatus.TOO_MANY_REQUESTS,
    });
  }

  /**
   * Create an "internal server error" response (HTTP 500)
   *
   * @param message - Error message
   * @returns ApiResponse error instance with statusCode 500
   */
  static internalError(message?: string): ApiResponse<null> {
    return ApiResponse.error({
      message: message ?? 'Internal server error',
      code: BusinessCode.INTERNAL_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  /**
   * Convert response to plain object (useful for serialization)
   */
  toJSON(): ApiResponseParams<T> {
    const json: ApiResponseParams<T> = {
      success: this.success,
    };

    if (this.data !== undefined) json.data = this.data;
    if (this.message !== undefined) json.message = this.message;
    if (this.statusCode !== undefined) json.statusCode = this.statusCode;
    if (this.meta !== undefined) json.meta = this.meta;
    if (this.error !== undefined) json.error = this.error;

    return json;
  }
}
