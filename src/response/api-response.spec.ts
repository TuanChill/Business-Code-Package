// TEAM_001: Unit tests for ApiResponse class
import { ApiResponse } from './api-response';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';

describe('ApiResponse', () => {
  describe('constructor', () => {
    it('should create instance with all parameters', () => {
      const response = new ApiResponse({
        success: true,
        data: { id: 1 },
        message: 'Test message',
        statusCode: 200,
        meta: { page: 1 },
        error: { code: 5001 },
      });

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: 1 });
      expect(response.message).toBe('Test message');
      expect(response.statusCode).toBe(200);
      expect(response.meta).toEqual({ page: 1 });
      expect(response.error).toEqual({ code: 5001 });
    });
  });

  describe('success', () => {
    it('should create success response with data', () => {
      const response = ApiResponse.success({ data: { id: 1, name: 'Test' } });

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: 1, name: 'Test' });
      expect(response.message).toBe('Success');
      expect(response.statusCode).toBe(HttpStatus.OK);
    });

    it('should create success response with custom message', () => {
      const response = ApiResponse.success({
        data: null,
        message: 'Custom success message',
      });

      expect(response.message).toBe('Custom success message');
    });

    it('should create success response with custom status code', () => {
      const response = ApiResponse.success({
        data: null,
        statusCode: HttpStatus.ACCEPTED,
      });

      expect(response.statusCode).toBe(HttpStatus.ACCEPTED);
    });

    it('should create success response with meta', () => {
      const response = ApiResponse.success({
        data: null,
        meta: { page: 1, limit: 10 },
      });

      expect(response.meta).toEqual({ page: 1, limit: 10 });
    });

    it('should create empty success response when no params provided', () => {
      const response = ApiResponse.success();

      expect(response.success).toBe(true);
      expect(response.data).toBeUndefined();
      expect(response.message).toBe('Success');
      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('error', () => {
    it('should create error response with message', () => {
      const response = ApiResponse.error({ message: 'Something went wrong' });

      expect(response.success).toBe(false);
      expect(response.message).toBe('Something went wrong');
      expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.error?.code).toBe(BusinessCode.INTERNAL_ERROR);
    });

    it('should create error response with business code', () => {
      const response = ApiResponse.error({
        message: 'User not found',
        code: BusinessCode.USER_NOT_FOUND,
        statusCode: HttpStatus.NOT_FOUND,
      });

      expect(response.error?.code).toBe(BusinessCode.USER_NOT_FOUND);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it('should create error response with details', () => {
      const response = ApiResponse.error({
        message: 'Validation failed',
        details: { email: 'Invalid email format' },
      });

      expect(response.error?.details).toEqual({ email: 'Invalid email format' });
    });

    it('should use default message when not provided', () => {
      const response = ApiResponse.error({});

      expect(response.message).toBe('Error');
    });
  });

  describe('paginated', () => {
    it('should create paginated response with correct metadata', () => {
      const response = ApiResponse.paginated({
        data: [{ id: 1 }, { id: 2 }],
        page: 1,
        limit: 10,
        total: 25,
      });

      expect(response.success).toBe(true);
      expect(response.data).toEqual([{ id: 1 }, { id: 2 }]);
      expect(response.meta?.page).toBe(1);
      expect(response.meta?.limit).toBe(10);
      expect(response.meta?.total).toBe(25);
      expect(response.meta?.totalPages).toBe(3);
      expect(response.meta?.hasNextPage).toBe(true);
      expect(response.meta?.hasPreviousPage).toBe(false);
    });

    it('should calculate hasNextPage correctly', () => {
      const response = ApiResponse.paginated({
        data: [],
        page: 3,
        limit: 10,
        total: 25,
      });

      expect(response.meta?.hasNextPage).toBe(false);
      expect(response.meta?.hasPreviousPage).toBe(true);
    });

    it('should handle single page', () => {
      const response = ApiResponse.paginated({
        data: [],
        page: 1,
        limit: 10,
        total: 5,
      });

      expect(response.meta?.totalPages).toBe(1);
      expect(response.meta?.hasNextPage).toBe(false);
      expect(response.meta?.hasPreviousPage).toBe(false);
    });

    it('should accept custom message and statusCode', () => {
      const response = ApiResponse.paginated({
        data: [],
        page: 1,
        limit: 10,
        total: 0,
        message: 'Users retrieved',
        statusCode: HttpStatus.OK,
      });

      expect(response.message).toBe('Users retrieved');
      expect(response.statusCode).toBe(HttpStatus.OK);
    });
  });

  describe('created', () => {
    it('should create response with 201 status', () => {
      const response = ApiResponse.created({ id: 1, name: 'New Resource' });

      expect(response.success).toBe(true);
      expect(response.data).toEqual({ id: 1, name: 'New Resource' });
      expect(response.statusCode).toBe(HttpStatus.CREATED);
      expect(response.message).toBe('Resource created successfully');
    });

    it('should accept custom message', () => {
      const response = ApiResponse.created({ id: 1 }, 'User created');

      expect(response.message).toBe('User created');
    });
  });

  describe('noContent', () => {
    it('should create response with 204 status', () => {
      const response = ApiResponse.noContent();

      expect(response.success).toBe(true);
      expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);
      expect(response.message).toBe('No content');
    });

    it('should accept custom message', () => {
      const response = ApiResponse.noContent('Resource deleted');

      expect(response.message).toBe('Resource deleted');
    });
  });

  describe('badRequest', () => {
    it('should create 400 response', () => {
      const response = ApiResponse.badRequest();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.error?.code).toBe(BusinessCode.INVALID_INPUT);
      expect(response.message).toBe('Bad request');
    });

    it('should accept custom message and details', () => {
      const response = ApiResponse.badRequest('Invalid parameters', { field: 'error' });

      expect(response.message).toBe('Invalid parameters');
      expect(response.error?.details).toEqual({ field: 'error' });
    });
  });

  describe('unauthorized', () => {
    it('should create 401 response', () => {
      const response = ApiResponse.unauthorized();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
      expect(response.error?.code).toBe(BusinessCode.AUTH_FAILED);
      expect(response.message).toBe('Unauthorized');
    });

    it('should accept custom business code', () => {
      const response = ApiResponse.unauthorized('Token expired', BusinessCode.TOKEN_EXPIRED);

      expect(response.message).toBe('Token expired');
      expect(response.error?.code).toBe(BusinessCode.TOKEN_EXPIRED);
    });
  });

  describe('forbidden', () => {
    it('should create 403 response', () => {
      const response = ApiResponse.forbidden();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.error?.code).toBe(BusinessCode.PERMISSION_DENIED);
      expect(response.message).toBe('Forbidden');
    });
  });

  describe('notFound', () => {
    it('should create 404 response', () => {
      const response = ApiResponse.notFound();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(response.error?.code).toBe(BusinessCode.RESOURCE_NOT_FOUND);
      expect(response.message).toBe('Not found');
    });

    it('should accept custom business code', () => {
      const response = ApiResponse.notFound('User not found', BusinessCode.USER_NOT_FOUND);

      expect(response.message).toBe('User not found');
      expect(response.error?.code).toBe(BusinessCode.USER_NOT_FOUND);
    });
  });

  describe('conflict', () => {
    it('should create 409 response', () => {
      const response = ApiResponse.conflict();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.CONFLICT);
      expect(response.error?.code).toBe(BusinessCode.RESOURCE_CONFLICT);
      expect(response.message).toBe('Conflict');
    });
  });

  describe('validationError', () => {
    it('should create 422 response with details', () => {
      const details = { email: 'Invalid email', name: 'Required' };
      const response = ApiResponse.validationError(details);

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.error?.code).toBe(BusinessCode.VALIDATION_ERROR);
      expect(response.error?.details).toEqual(details);
      expect(response.message).toBe('Validation failed');
    });
  });

  describe('tooManyRequests', () => {
    it('should create 429 response', () => {
      const response = ApiResponse.tooManyRequests();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
      expect(response.error?.code).toBe(BusinessCode.RATE_LIMIT_EXCEEDED);
      expect(response.message).toBe('Too many requests');
    });
  });

  describe('internalError', () => {
    it('should create 500 response', () => {
      const response = ApiResponse.internalError();

      expect(response.success).toBe(false);
      expect(response.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.error?.code).toBe(BusinessCode.INTERNAL_ERROR);
      expect(response.message).toBe('Internal server error');
    });
  });

  describe('toJSON', () => {
    it('should serialize success response correctly', () => {
      const response = ApiResponse.success({ data: { id: 1 }, message: 'OK' });
      const json = response.toJSON();

      expect(json.success).toBe(true);
      expect(json.data).toEqual({ id: 1 });
      expect(json.message).toBe('OK');
      expect(json.statusCode).toBe(200);
    });

    it('should serialize error response correctly', () => {
      const response = ApiResponse.error({
        message: 'Error',
        code: BusinessCode.INTERNAL_ERROR,
      });
      const json = response.toJSON();

      expect(json.success).toBe(false);
      expect(json.message).toBe('Error');
      expect(json.error?.code).toBe(BusinessCode.INTERNAL_ERROR);
    });

    it('should not include undefined properties', () => {
      const response = ApiResponse.success();
      const json = response.toJSON();

      expect(json).not.toHaveProperty('data');
      expect(json).not.toHaveProperty('meta');
      expect(json).not.toHaveProperty('error');
    });
  });
});
