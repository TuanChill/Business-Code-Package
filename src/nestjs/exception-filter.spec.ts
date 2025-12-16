// TEAM_001: Unit tests for NestJS ApiExceptionFilter
import { ArgumentsHost, HttpException, HttpStatus as NestHttpStatus } from '@nestjs/common';
import { ApiExceptionFilter } from './exception-filter';
import { BusinessException, ValidationException } from './exceptions';
import { BusinessCode } from '../constants/business-codes';
import { HttpStatus } from '../constants/http-status';

// Mock Response object
const mockJson = jest.fn();
const mockStatus = jest.fn().mockReturnValue({ json: mockJson });
const mockResponse = {
  status: mockStatus,
};

// Mock ArgumentsHost
const mockGetResponse = jest.fn().mockReturnValue(mockResponse);
const mockSwitchToHttp = jest.fn().mockReturnValue({
  getResponse: mockGetResponse,
});
const mockHost: ArgumentsHost = {
  switchToHttp: mockSwitchToHttp,
  getArgs: jest.fn(),
  getArgByIndex: jest.fn(),
  switchToRpc: jest.fn(),
  switchToWs: jest.fn(),
  getType: jest.fn(),
};

describe('ApiExceptionFilter', () => {
  let filter: ApiExceptionFilter;

  beforeEach(() => {
    filter = new ApiExceptionFilter();
    jest.clearAllMocks();
  });

  describe('handling BusinessException', () => {
    it('should handle BusinessException with correct response format', () => {
      const exception = new BusinessException(
        BusinessCode.USER_NOT_FOUND,
        'User not found',
        HttpStatus.NOT_FOUND
      );

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'User not found',
          error: expect.objectContaining({
            code: BusinessCode.USER_NOT_FOUND,
          }),
        })
      );
    });

    it('should handle BusinessException with details', () => {
      const exception = new BusinessException(
        BusinessCode.VALIDATION_ERROR,
        'Validation failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
        { email: 'Invalid' }
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            details: { email: 'Invalid' },
          }),
        })
      );
    });

    it('should include stack trace when includeStack option is true', () => {
      const filterWithStack = new ApiExceptionFilter({ includeStack: true });
      const exception = new BusinessException(BusinessCode.INTERNAL_ERROR);

      filterWithStack.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            stack: expect.any(String),
          }),
        })
      );
    });
  });

  describe('handling NestJS HttpException', () => {
    it('should handle HttpException with string response', () => {
      const exception = new HttpException('Not found', NestHttpStatus.NOT_FOUND);

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(NestHttpStatus.NOT_FOUND);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Not found',
        })
      );
    });

    it('should handle HttpException with object response', () => {
      const exception = new HttpException(
        { message: 'Bad request error', statusCode: 400 },
        NestHttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Bad request error',
        })
      );
    });

    it('should handle validation pipe errors with array of messages', () => {
      const exception = new HttpException(
        { message: ['email must be valid', 'name is required'] },
        NestHttpStatus.BAD_REQUEST
      );

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Validation failed',
          error: expect.objectContaining({
            details: { errors: ['email must be valid', 'name is required'] },
          }),
        })
      );
    });

    it('should map HTTP status to correct business code', () => {
      const exception = new HttpException('Unauthorized', NestHttpStatus.UNAUTHORIZED);

      filter.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            code: BusinessCode.AUTH_FAILED,
          }),
        })
      );
    });
  });

  describe('handling generic Error', () => {
    it('should handle generic Error', () => {
      const exception = new Error('Something went wrong');

      filter.catch(exception, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Something went wrong',
          error: expect.objectContaining({
            code: BusinessCode.INTERNAL_ERROR,
          }),
        })
      );
    });

    it('should include stack trace for Error when option is true', () => {
      const filterWithStack = new ApiExceptionFilter({ includeStack: true });
      const exception = new Error('Error with stack');

      filterWithStack.catch(exception, mockHost);

      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            stack: expect.any(String),
          }),
        })
      );
    });
  });

  describe('handling unknown exception', () => {
    it('should handle unknown exception type', () => {
      filter.catch('Unknown error', mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Internal server error',
        })
      );
    });

    it('should handle null/undefined', () => {
      filter.catch(null, mockHost);

      expect(mockStatus).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    });
  });

  describe('logger option', () => {
    it('should call logger when provided', () => {
      const mockLogger = jest.fn();
      const filterWithLogger = new ApiExceptionFilter({ logger: mockLogger });
      const exception = new Error('Test error');

      filterWithLogger.catch(exception, mockHost);

      expect(mockLogger).toHaveBeenCalledWith(exception, 'ApiExceptionFilter');
    });
  });
});
