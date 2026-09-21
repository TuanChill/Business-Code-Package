/**
 * Shared HTTP-status/BusinessCode mapping
 *
 * Single source of truth for the (HttpStatus, BusinessCode) pairing used by
 * the common error shorthands across `response/`, `nextjs/`, and `nestjs/`.
 * Default message text is intentionally NOT part of this table — it differs
 * by call site (see each consumer) and is out of scope here.
 */

import { HttpStatus } from './http-status';
import { BusinessCode } from './business-codes';

export interface ResponseMappingEntry {
  httpStatus: number;
  businessCode: number;
}

export const RESPONSE_MAPPING = {
  BAD_REQUEST: { httpStatus: HttpStatus.BAD_REQUEST, businessCode: BusinessCode.INVALID_INPUT },
  UNAUTHORIZED: { httpStatus: HttpStatus.UNAUTHORIZED, businessCode: BusinessCode.AUTH_FAILED },
  FORBIDDEN: { httpStatus: HttpStatus.FORBIDDEN, businessCode: BusinessCode.PERMISSION_DENIED },
  NOT_FOUND: { httpStatus: HttpStatus.NOT_FOUND, businessCode: BusinessCode.RESOURCE_NOT_FOUND },
  CONFLICT: { httpStatus: HttpStatus.CONFLICT, businessCode: BusinessCode.RESOURCE_CONFLICT },
  VALIDATION_ERROR: {
    httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
    businessCode: BusinessCode.VALIDATION_ERROR,
  },
  TOO_MANY_REQUESTS: {
    httpStatus: HttpStatus.TOO_MANY_REQUESTS,
    businessCode: BusinessCode.RATE_LIMIT_EXCEEDED,
  },
  INTERNAL_ERROR: {
    httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
    businessCode: BusinessCode.INTERNAL_ERROR,
  },
  SERVICE_UNAVAILABLE: {
    httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
    businessCode: BusinessCode.SERVICE_UNAVAILABLE,
  },
} as const satisfies Record<string, ResponseMappingEntry>;

export type ResponseMappingKey = keyof typeof RESPONSE_MAPPING;
