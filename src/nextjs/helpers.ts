/**
 * Next.js Response Helpers
 *
 * Utility functions for creating standardized API responses in Next.js App Router.
 * These helpers work with both the App Router (Next.js 13+) and can be adapted for Pages Router.
 *
 * @example
 * ```typescript
 * import { jsonSuccess, jsonError } from '@tchil/business-codes/nextjs';
 *
 * export async function GET() {
 *   const users = await getUsers();
 *   return jsonSuccess(users);
 * }
 *
 * export async function POST(request: Request) {
 *   try {
 *     const body = await request.json();
 *     const user = await createUser(body);
 *     return jsonCreated(user, 'User created successfully');
 *   } catch (error) {
 *     return jsonError('Failed to create user', HttpStatus.BAD_REQUEST, BusinessCode.INVALID_INPUT);
 *   }
 * }
 * ```
 */

import { ApiResponse } from '../response/api-response';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';

/**
 * Response options for Next.js
 */
export interface NextResponseOptions {
  /** HTTP headers to include in response */
  headers?: Record<string, string> | Headers;
  /** Response status text */
  statusText?: string;
}

/**
 * Create a JSON success response
 *
 * @param data - Response data
 * @param message - Success message
 * @param options - Additional response options
 * @returns Response object with ApiResponse body
 */
export function jsonSuccess<T>(
  data: T,
  message?: string,
  options?: NextResponseOptions
): Response {
  const apiResponse = ApiResponse.success({
    data,
    message: message ?? 'Success',
    statusCode: HttpStatus.OK,
  });

  return Response.json(apiResponse, {
    status: HttpStatus.OK,
    ...options,
  });
}

/**
 * Create a JSON error response
 *
 * @param message - Error message
 * @param statusCode - HTTP status code (default: 500)
 * @param businessCode - Business error code (default: INTERNAL_ERROR)
 * @param details - Additional error details
 * @param options - Additional response options
 * @returns Response object with ApiResponse error body
 */
export function jsonError(
  message: string,
  statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  businessCode: number = BusinessCode.INTERNAL_ERROR,
  details?: Record<string, unknown>,
  options?: NextResponseOptions
): Response {
  const apiResponse = ApiResponse.error({
    message,
    code: businessCode,
    statusCode,
    details,
  });

  return Response.json(apiResponse, {
    status: statusCode,
    ...options,
  });
}

/**
 * Create a JSON created response (HTTP 201)
 *
 * @param data - Created resource data
 * @param message - Success message
 * @param options - Additional response options
 */
export function jsonCreated<T>(
  data: T,
  message?: string,
  options?: NextResponseOptions
): Response {
  const apiResponse = ApiResponse.created(data, message);

  return Response.json(apiResponse, {
    status: HttpStatus.CREATED,
    ...options,
  });
}

/**
 * Create a JSON no content response (HTTP 204)
 *
 * @param options - Additional response options
 */
export function jsonNoContent(options?: NextResponseOptions): Response {
  return new Response(null, {
    status: HttpStatus.NO_CONTENT,
    ...options,
  });
}

/**
 * Create a paginated JSON response
 *
 * @param data - Array of items
 * @param pagination - Pagination metadata
 * @param message - Success message
 * @param options - Additional response options
 */
export function jsonPaginated<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number },
  message?: string,
  options?: NextResponseOptions
): Response {
  const apiResponse = ApiResponse.paginated({
    data,
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    message,
  });

  return Response.json(apiResponse, {
    status: HttpStatus.OK,
    ...options,
  });
}

/**
 * Create a bad request response (HTTP 400)
 */
export function jsonBadRequest(
  message: string = 'Bad request',
  details?: Record<string, unknown>,
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.BAD_REQUEST, BusinessCode.INVALID_INPUT, details, options);
}

/**
 * Create an unauthorized response (HTTP 401)
 */
export function jsonUnauthorized(
  message: string = 'Unauthorized',
  businessCode: number = BusinessCode.AUTH_FAILED,
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.UNAUTHORIZED, businessCode, undefined, options);
}

/**
 * Create a forbidden response (HTTP 403)
 */
export function jsonForbidden(
  message: string = 'Forbidden',
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.FORBIDDEN, BusinessCode.PERMISSION_DENIED, undefined, options);
}

/**
 * Create a not found response (HTTP 404)
 */
export function jsonNotFound(
  message: string = 'Not found',
  businessCode: number = BusinessCode.RESOURCE_NOT_FOUND,
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.NOT_FOUND, businessCode, undefined, options);
}

/**
 * Create a conflict response (HTTP 409)
 */
export function jsonConflict(
  message: string = 'Conflict',
  businessCode: number = BusinessCode.RESOURCE_CONFLICT,
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.CONFLICT, businessCode, undefined, options);
}

/**
 * Create a validation error response (HTTP 422)
 */
export function jsonValidationError(
  details: Record<string, unknown>,
  message: string = 'Validation failed',
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.UNPROCESSABLE_ENTITY, BusinessCode.VALIDATION_ERROR, details, options);
}

/**
 * Create a too many requests response (HTTP 429)
 */
export function jsonTooManyRequests(
  message: string = 'Too many requests',
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.TOO_MANY_REQUESTS, BusinessCode.RATE_LIMIT_EXCEEDED, undefined, options);
}

/**
 * Create an internal server error response (HTTP 500)
 */
export function jsonInternalError(
  message: string = 'Internal server error',
  options?: NextResponseOptions
): Response {
  return jsonError(message, HttpStatus.INTERNAL_SERVER_ERROR, BusinessCode.INTERNAL_ERROR, undefined, options);
}

/**
 * Wrapper function to handle async route handlers with error catching
 *
 * @example
 * ```typescript
 * export const GET = withErrorHandler(async (request) => {
 *   const users = await getUsers();
 *   return jsonSuccess(users);
 * });
 * ```
 */
export function withErrorHandler(
  handler: (request: Request, context?: unknown) => Promise<Response>
): (request: Request, context?: unknown) => Promise<Response> {
  return async (request: Request, context?: unknown): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof Error) {
        return jsonInternalError(error.message);
      }

      return jsonInternalError('An unexpected error occurred');
    }
  };
}

/**
 * Parse and validate request body with error handling
 *
 * @example
 * ```typescript
 * export async function POST(request: Request) {
 *   const body = await parseBody<CreateUserDto>(request);
 *   if (body.error) {
 *     return body.error;
 *   }
 *   // body.data is typed as CreateUserDto
 * }
 * ```
 */
export async function parseBody<T>(
  request: Request
): Promise<{ data: T; error?: never } | { data?: never; error: Response }> {
  try {
    const data = await request.json() as T;
    return { data };
  } catch {
    return {
      error: jsonBadRequest('Invalid JSON body'),
    };
  }
}

/**
 * Parse URL search params to pagination object
 *
 * @example
 * ```typescript
 * export async function GET(request: Request) {
 *   const pagination = parsePagination(request, { defaultLimit: 20 });
 *   // { page: 1, limit: 20 }
 * }
 * ```
 */
export function parsePagination(
  request: Request,
  options?: { defaultPage?: number; defaultLimit?: number; maxLimit?: number }
): { page: number; limit: number } {
  const url = new URL(request.url);
  const defaultPage = options?.defaultPage ?? 1;
  const defaultLimit = options?.defaultLimit ?? 10;
  const maxLimit = options?.maxLimit ?? 100;

  const page = Math.max(1, parseInt(url.searchParams.get('page') || String(defaultPage), 10));
  const limit = Math.min(
    maxLimit,
    Math.max(1, parseInt(url.searchParams.get('limit') || String(defaultLimit), 10))
  );

  return { page, limit };
}
