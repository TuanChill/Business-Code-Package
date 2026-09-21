// TEAM_001: Unit tests for the shared HTTP-status/BusinessCode mapping table
import { RESPONSE_MAPPING } from './response-mapping';
import { HttpStatus } from './http-status';
import { BusinessCode } from './business-codes';

describe('RESPONSE_MAPPING', () => {
  it('maps BAD_REQUEST to HttpStatus.BAD_REQUEST / BusinessCode.INVALID_INPUT', () => {
    expect(RESPONSE_MAPPING.BAD_REQUEST).toEqual({
      httpStatus: HttpStatus.BAD_REQUEST,
      businessCode: BusinessCode.INVALID_INPUT,
    });
  });

  it('maps UNAUTHORIZED to HttpStatus.UNAUTHORIZED / BusinessCode.AUTH_FAILED', () => {
    expect(RESPONSE_MAPPING.UNAUTHORIZED).toEqual({
      httpStatus: HttpStatus.UNAUTHORIZED,
      businessCode: BusinessCode.AUTH_FAILED,
    });
  });

  it('maps FORBIDDEN to HttpStatus.FORBIDDEN / BusinessCode.PERMISSION_DENIED', () => {
    expect(RESPONSE_MAPPING.FORBIDDEN).toEqual({
      httpStatus: HttpStatus.FORBIDDEN,
      businessCode: BusinessCode.PERMISSION_DENIED,
    });
  });

  it('maps NOT_FOUND to HttpStatus.NOT_FOUND / BusinessCode.RESOURCE_NOT_FOUND', () => {
    expect(RESPONSE_MAPPING.NOT_FOUND).toEqual({
      httpStatus: HttpStatus.NOT_FOUND,
      businessCode: BusinessCode.RESOURCE_NOT_FOUND,
    });
  });

  it('maps CONFLICT to HttpStatus.CONFLICT / BusinessCode.RESOURCE_CONFLICT', () => {
    expect(RESPONSE_MAPPING.CONFLICT).toEqual({
      httpStatus: HttpStatus.CONFLICT,
      businessCode: BusinessCode.RESOURCE_CONFLICT,
    });
  });

  it('maps VALIDATION_ERROR to HttpStatus.UNPROCESSABLE_ENTITY / BusinessCode.VALIDATION_ERROR', () => {
    expect(RESPONSE_MAPPING.VALIDATION_ERROR).toEqual({
      httpStatus: HttpStatus.UNPROCESSABLE_ENTITY,
      businessCode: BusinessCode.VALIDATION_ERROR,
    });
  });

  it('maps TOO_MANY_REQUESTS to HttpStatus.TOO_MANY_REQUESTS / BusinessCode.RATE_LIMIT_EXCEEDED', () => {
    expect(RESPONSE_MAPPING.TOO_MANY_REQUESTS).toEqual({
      httpStatus: HttpStatus.TOO_MANY_REQUESTS,
      businessCode: BusinessCode.RATE_LIMIT_EXCEEDED,
    });
  });

  it('maps INTERNAL_ERROR to HttpStatus.INTERNAL_SERVER_ERROR / BusinessCode.INTERNAL_ERROR', () => {
    expect(RESPONSE_MAPPING.INTERNAL_ERROR).toEqual({
      httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      businessCode: BusinessCode.INTERNAL_ERROR,
    });
  });

  it('maps SERVICE_UNAVAILABLE to HttpStatus.SERVICE_UNAVAILABLE / BusinessCode.SERVICE_UNAVAILABLE', () => {
    expect(RESPONSE_MAPPING.SERVICE_UNAVAILABLE).toEqual({
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
      businessCode: BusinessCode.SERVICE_UNAVAILABLE,
    });
  });

  it('has exactly 9 entries', () => {
    expect(Object.keys(RESPONSE_MAPPING)).toHaveLength(9);
  });
});
