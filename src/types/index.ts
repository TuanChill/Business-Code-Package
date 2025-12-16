/**
 * TypeScript type definitions for the status-codes library
 */

/**
 * Pagination metadata for list responses
 */
export interface PaginationMeta {
  /** Current page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Total number of items */
  total?: number;
  /** Total number of pages */
  totalPages?: number;
  /** Whether there is a next page */
  hasNextPage?: boolean;
  /** Whether there is a previous page */
  hasPreviousPage?: boolean;
  /** Additional custom metadata */
  [key: string]: unknown;
}

/**
 * Error details for error responses
 */
export interface ErrorDetails {
  /** Business error code */
  code?: number;
  /** Field-specific error details */
  details?: Record<string, unknown>;
  /** Stack trace (only in development) */
  stack?: string;
}

/**
 * Parameters for creating a success response
 */
export interface SuccessParams<T> {
  /** Response data */
  data?: T;
  /** Success message */
  message?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Pagination or additional metadata */
  meta?: PaginationMeta;
}

/**
 * Parameters for creating a paginated response
 */
export interface PaginatedParams<T> {
  /** Array of items */
  data: T[];
  /** Success message */
  message?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Current page number */
  page: number;
  /** Items per page */
  limit: number;
  /** Total number of items */
  total: number;
  /** Additional metadata */
  meta?: Omit<PaginationMeta, 'page' | 'limit' | 'total'>;
}

/**
 * Parameters for creating an error response
 */
export interface ErrorParams {
  /** Error message */
  message?: string;
  /** Business error code */
  code?: number;
  /** Field-specific error details */
  details?: Record<string, unknown>;
  /** HTTP status code */
  statusCode?: number;
}

/**
 * Full parameters for ApiResponse constructor
 */
export interface ApiResponseParams<T> {
  /** Whether the operation was successful */
  success: boolean;
  /** Response data */
  data?: T;
  /** Response message */
  message?: string;
  /** HTTP status code */
  statusCode?: number;
  /** Pagination or additional metadata */
  meta?: PaginationMeta;
  /** Error details */
  error?: ErrorDetails;
}
