// TEAM_001: Unit tests for Next.js helper functions
import {
  jsonSuccess,
  jsonError,
  jsonCreated,
  jsonNoContent,
  jsonPaginated,
  jsonBadRequest,
  jsonUnauthorized,
  jsonForbidden,
  jsonNotFound,
  jsonConflict,
  jsonValidationError,
  jsonTooManyRequests,
  jsonInternalError,
  withErrorHandler,
  parseBody,
  parsePagination,
} from './helpers';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';

// Helper to parse JSON from Response
async function parseResponse(response: Response): Promise<any> {
  return response.json();
}

describe('jsonSuccess', () => {
  it('should create success response with data', async () => {
    const response = jsonSuccess({ id: 1, name: 'Test' });
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.OK);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: 1, name: 'Test' });
    expect(body.message).toBe('Success');
  });

  it('should accept custom message', async () => {
    const response = jsonSuccess({ id: 1 }, 'Custom success');
    const body = await parseResponse(response);

    expect(body.message).toBe('Custom success');
  });

  it('should accept response options', async () => {
    const response = jsonSuccess({ id: 1 }, 'Success', {
      headers: { 'X-Custom': 'header' },
    });

    expect(response.headers.get('X-Custom')).toBe('header');
  });
});

describe('jsonError', () => {
  it('should create error response with default values', async () => {
    const response = jsonError('Something went wrong');
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Something went wrong');
    expect(body.error.code).toBe(BusinessCode.INTERNAL_ERROR);
  });

  it('should accept custom status code and business code', async () => {
    const response = jsonError(
      'User not found',
      HttpStatus.NOT_FOUND,
      BusinessCode.USER_NOT_FOUND
    );
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(body.error.code).toBe(BusinessCode.USER_NOT_FOUND);
  });

  it('should accept error details', async () => {
    const response = jsonError(
      'Validation failed',
      HttpStatus.BAD_REQUEST,
      BusinessCode.VALIDATION_ERROR,
      { email: 'Invalid email' }
    );
    const body = await parseResponse(response);

    expect(body.error.details).toEqual({ email: 'Invalid email' });
  });
});

describe('jsonCreated', () => {
  it('should create 201 response', async () => {
    const response = jsonCreated({ id: 1 });
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.CREATED);
    expect(body.success).toBe(true);
    expect(body.data).toEqual({ id: 1 });
  });

  it('should accept custom message', async () => {
    const response = jsonCreated({ id: 1 }, 'User created');
    const body = await parseResponse(response);

    expect(body.message).toBe('User created');
  });
});

describe('jsonNoContent', () => {
  it('should create 204 response with no body', () => {
    const response = jsonNoContent();

    expect(response.status).toBe(HttpStatus.NO_CONTENT);
    expect(response.body).toBeNull();
  });
});

describe('jsonPaginated', () => {
  it('should create paginated response', async () => {
    const response = jsonPaginated(
      [{ id: 1 }, { id: 2 }],
      { page: 1, limit: 10, total: 25 }
    );
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.OK);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([{ id: 1 }, { id: 2 }]);
    expect(body.meta.page).toBe(1);
    expect(body.meta.limit).toBe(10);
    expect(body.meta.total).toBe(25);
    expect(body.meta.totalPages).toBe(3);
    expect(body.meta.hasNextPage).toBe(true);
    expect(body.meta.hasPreviousPage).toBe(false);
  });

  it('should accept custom message', async () => {
    const response = jsonPaginated([], { page: 1, limit: 10, total: 0 }, 'Users list');
    const body = await parseResponse(response);

    expect(body.message).toBe('Users list');
  });
});

describe('jsonBadRequest', () => {
  it('should create 400 response', async () => {
    const response = jsonBadRequest();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    expect(body.error.code).toBe(BusinessCode.INVALID_INPUT);
    expect(body.message).toBe('Bad request');
  });

  it('should accept custom message and details', async () => {
    const response = jsonBadRequest('Invalid input', { field: 'error' });
    const body = await parseResponse(response);

    expect(body.message).toBe('Invalid input');
    expect(body.error.details).toEqual({ field: 'error' });
  });
});

describe('jsonUnauthorized', () => {
  it('should create 401 response', async () => {
    const response = jsonUnauthorized();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    expect(body.error.code).toBe(BusinessCode.AUTH_FAILED);
    expect(body.message).toBe('Unauthorized');
  });

  it('should accept custom business code', async () => {
    const response = jsonUnauthorized('Token expired', BusinessCode.TOKEN_EXPIRED);
    const body = await parseResponse(response);

    expect(body.message).toBe('Token expired');
    expect(body.error.code).toBe(BusinessCode.TOKEN_EXPIRED);
  });
});

describe('jsonForbidden', () => {
  it('should create 403 response', async () => {
    const response = jsonForbidden();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.FORBIDDEN);
    expect(body.error.code).toBe(BusinessCode.PERMISSION_DENIED);
    expect(body.message).toBe('Forbidden');
  });
});

describe('jsonNotFound', () => {
  it('should create 404 response', async () => {
    const response = jsonNotFound();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.NOT_FOUND);
    expect(body.error.code).toBe(BusinessCode.RESOURCE_NOT_FOUND);
    expect(body.message).toBe('Not found');
  });

  it('should accept custom business code', async () => {
    const response = jsonNotFound('User not found', BusinessCode.USER_NOT_FOUND);
    const body = await parseResponse(response);

    expect(body.error.code).toBe(BusinessCode.USER_NOT_FOUND);
  });
});

describe('jsonConflict', () => {
  it('should create 409 response', async () => {
    const response = jsonConflict();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.CONFLICT);
    expect(body.error.code).toBe(BusinessCode.RESOURCE_CONFLICT);
    expect(body.message).toBe('Conflict');
  });
});

describe('jsonValidationError', () => {
  it('should create 422 response with details', async () => {
    const details = { email: 'Invalid email', name: 'Required' };
    const response = jsonValidationError(details);
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(body.error.code).toBe(BusinessCode.VALIDATION_ERROR);
    expect(body.error.details).toEqual(details);
    expect(body.message).toBe('Validation failed');
  });
});

describe('jsonTooManyRequests', () => {
  it('should create 429 response', async () => {
    const response = jsonTooManyRequests();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(body.error.code).toBe(BusinessCode.RATE_LIMIT_EXCEEDED);
    expect(body.message).toBe('Too many requests');
  });
});

describe('jsonInternalError', () => {
  it('should create 500 response', async () => {
    const response = jsonInternalError();
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.error.code).toBe(BusinessCode.INTERNAL_ERROR);
    expect(body.message).toBe('Internal server error');
  });
});

describe('withErrorHandler', () => {
  it('should call handler and return response on success', async () => {
    const handler = jest.fn().mockResolvedValue(jsonSuccess({ id: 1 }));
    const wrappedHandler = withErrorHandler(handler);
    const mockRequest = new Request('http://localhost/api/test');

    const response = await wrappedHandler(mockRequest);
    const body = await parseResponse(response);

    expect(handler).toHaveBeenCalledWith(mockRequest, undefined);
    expect(body.success).toBe(true);
  });

  it('should catch Error and return internal error response', async () => {
    const handler = jest.fn().mockRejectedValue(new Error('Test error'));
    const wrappedHandler = withErrorHandler(handler);
    const mockRequest = new Request('http://localhost/api/test');

    // Spy on console.error to suppress output during test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const response = await wrappedHandler(mockRequest);
    const body = await parseResponse(response);

    expect(response.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Test error');

    consoleSpy.mockRestore();
  });

  it('should handle non-Error exceptions', async () => {
    const handler = jest.fn().mockRejectedValue('string error');
    const wrappedHandler = withErrorHandler(handler);
    const mockRequest = new Request('http://localhost/api/test');

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const response = await wrappedHandler(mockRequest);
    const body = await parseResponse(response);

    expect(body.message).toBe('An unexpected error occurred');

    consoleSpy.mockRestore();
  });

  it('should pass context to handler', async () => {
    const handler = jest.fn().mockResolvedValue(jsonSuccess({}));
    const wrappedHandler = withErrorHandler(handler);
    const mockRequest = new Request('http://localhost/api/test');
    const context = { params: { id: '123' } };

    await wrappedHandler(mockRequest, context);

    expect(handler).toHaveBeenCalledWith(mockRequest, context);
  });
});

describe('parseBody', () => {
  it('should parse valid JSON body', async () => {
    const mockRequest = new Request('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', email: 'test@example.com' }),
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await parseBody<{ name: string; email: string }>(mockRequest);

    expect(result.data).toEqual({ name: 'Test', email: 'test@example.com' });
    expect(result.error).toBeUndefined();
  });

  it('should return error for invalid JSON', async () => {
    const mockRequest = new Request('http://localhost/api/test', {
      method: 'POST',
      body: 'invalid json',
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await parseBody(mockRequest);
    const errorBody = await parseResponse(result.error as Response);

    expect(result.data).toBeUndefined();
    expect(result.error).toBeInstanceOf(Response);
    expect((result.error as Response).status).toBe(HttpStatus.BAD_REQUEST);
    expect(errorBody.message).toBe('Invalid JSON body');
  });
});

describe('parsePagination', () => {
  it('should return default pagination values', () => {
    const mockRequest = new Request('http://localhost/api/test');
    const pagination = parsePagination(mockRequest);

    expect(pagination.page).toBe(1);
    expect(pagination.limit).toBe(10);
  });

  it('should parse page and limit from URL params', () => {
    const mockRequest = new Request('http://localhost/api/test?page=3&limit=25');
    const pagination = parsePagination(mockRequest);

    expect(pagination.page).toBe(3);
    expect(pagination.limit).toBe(25);
  });

  it('should use custom default values', () => {
    const mockRequest = new Request('http://localhost/api/test');
    const pagination = parsePagination(mockRequest, {
      defaultPage: 5,
      defaultLimit: 50,
    });

    expect(pagination.page).toBe(5);
    expect(pagination.limit).toBe(50);
  });

  it('should clamp page to minimum of 1', () => {
    const mockRequest = new Request('http://localhost/api/test?page=-5&limit=10');
    const pagination = parsePagination(mockRequest);

    expect(pagination.page).toBe(1);
  });

  it('should clamp limit to minimum of 1', () => {
    const mockRequest = new Request('http://localhost/api/test?page=1&limit=0');
    const pagination = parsePagination(mockRequest);

    expect(pagination.limit).toBe(1);
  });

  it('should clamp limit to maxLimit', () => {
    const mockRequest = new Request('http://localhost/api/test?page=1&limit=500');
    const pagination = parsePagination(mockRequest);

    expect(pagination.limit).toBe(100); // Default maxLimit
  });

  it('should use custom maxLimit', () => {
    const mockRequest = new Request('http://localhost/api/test?page=1&limit=500');
    const pagination = parsePagination(mockRequest, { maxLimit: 200 });

    expect(pagination.limit).toBe(200);
  });
});
