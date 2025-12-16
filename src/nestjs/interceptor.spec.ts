// TEAM_001: Unit tests for NestJS ApiResponseInterceptor
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, lastValueFrom } from 'rxjs';
import { ApiResponseInterceptor, ApiResponseInterceptorAdvanced, SKIP_API_RESPONSE_KEY } from './interceptor';
import { ApiResponse } from '../response/api-response';
import { HttpStatus } from '../constants/http-status';

// Mock response object
const mockResponse = {
  statusCode: 200,
};

// Mock ExecutionContext
const mockGetResponse = jest.fn().mockReturnValue(mockResponse);
const mockSwitchToHttp = jest.fn().mockReturnValue({
  getResponse: mockGetResponse,
});
const mockGetHandler = jest.fn().mockReturnValue({});
const mockExecutionContext: ExecutionContext = {
  switchToHttp: mockSwitchToHttp,
  getHandler: mockGetHandler,
  getClass: jest.fn(),
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getType: jest.fn(),
};

describe('ApiResponseInterceptor', () => {
  let interceptor: ApiResponseInterceptor<unknown>;

  beforeEach(() => {
    interceptor = new ApiResponseInterceptor();
    jest.clearAllMocks();
    mockResponse.statusCode = 200;
  });

  describe('intercept', () => {
    it('should wrap plain data in ApiResponse', async () => {
      const data = { id: 1, name: 'Test' };
      const mockCallHandler: CallHandler = {
        handle: () => of(data),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result).toBeInstanceOf(ApiResponse);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(data);
      expect(result.message).toBe('Success');
    });

    it('should skip wrapping if response is already ApiResponse', async () => {
      const apiResponse = ApiResponse.success({ data: { id: 1 } });
      const mockCallHandler: CallHandler = {
        handle: () => of(apiResponse),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result).toBe(apiResponse);
    });

    it('should handle 204 No Content status', async () => {
      mockResponse.statusCode = HttpStatus.NO_CONTENT;
      const mockCallHandler: CallHandler = {
        handle: () => of(null),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(result.message).toBe('No content');
    });

    it('should use custom defaultMessage when provided', async () => {
      interceptor = new ApiResponseInterceptor({ defaultMessage: 'Custom message' });
      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result.message).toBe('Custom message');
    });

    it('should not skip wrapping when skipIfWrapped is false', async () => {
      interceptor = new ApiResponseInterceptor({ skipIfWrapped: false });
      const apiResponse = ApiResponse.success({ data: { id: 1 } });
      const mockCallHandler: CallHandler = {
        handle: () => of(apiResponse),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      // When skipIfWrapped is false, it should wrap even ApiResponse
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(ApiResponse);
    });

    it('should use response statusCode', async () => {
      mockResponse.statusCode = HttpStatus.CREATED;
      const mockCallHandler: CallHandler = {
        handle: () => of({ id: 1 }),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result.statusCode).toBe(HttpStatus.CREATED);
    });
  });
});

describe('ApiResponseInterceptorAdvanced', () => {
  let interceptor: ApiResponseInterceptorAdvanced<unknown>;

  beforeEach(() => {
    interceptor = new ApiResponseInterceptorAdvanced();
    jest.clearAllMocks();
    mockResponse.statusCode = 200;
  });

  describe('intercept', () => {
    it('should wrap plain data in ApiResponse', async () => {
      const data = { id: 1, name: 'Test' };
      const mockCallHandler: CallHandler = {
        handle: () => of(data),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result).toBeInstanceOf(ApiResponse);
    });

    it('should skip transformation when SkipApiResponse decorator is used', async () => {
      // Mock the metadata to indicate skip
      jest.spyOn(Reflect, 'getMetadata').mockReturnValue(true);
      
      const data = { raw: 'data' };
      const mockCallHandler: CallHandler = {
        handle: () => of(data),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect(result).toEqual(data);
      expect(result).not.toBeInstanceOf(ApiResponse);

      jest.restoreAllMocks();
    });

    it('should handle 204 No Content status', async () => {
      mockResponse.statusCode = HttpStatus.NO_CONTENT;
      const mockCallHandler: CallHandler = {
        handle: () => of(null),
      };

      const result = await lastValueFrom(interceptor.intercept(mockExecutionContext, mockCallHandler));

      expect((result as ApiResponse<unknown>).statusCode).toBe(HttpStatus.NO_CONTENT);
    });
  });
});

describe('SKIP_API_RESPONSE_KEY', () => {
  it('should be a string constant', () => {
    expect(typeof SKIP_API_RESPONSE_KEY).toBe('string');
    expect(SKIP_API_RESPONSE_KEY).toBe('skipApiResponse');
  });
});
