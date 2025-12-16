// TEAM_001: Unit tests for NestJS exception classes
import {
  BusinessException,
  ValidationException,
  AuthException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  RateLimitException,
  InternalServerException,
  BadRequestException,
  ServiceUnavailableException,
} from './exceptions';
import { BusinessCode } from '../constants/business-codes';
import { HttpStatus } from '../constants/http-status';

describe('BusinessException', () => {
  it('should create exception with business code', () => {
    const exception = new BusinessException(BusinessCode.USER_NOT_FOUND);

    expect(exception.businessCode).toBe(BusinessCode.USER_NOT_FOUND);
    expect(exception.message).toBe('User not found'); // From getBusinessCodeMessage
    expect(exception.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.name).toBe('BusinessException');
  });

  it('should create exception with custom message', () => {
    const exception = new BusinessException(
      BusinessCode.USER_NOT_FOUND,
      'Custom message'
    );

    expect(exception.message).toBe('Custom message');
  });

  it('should create exception with custom status code', () => {
    const exception = new BusinessException(
      BusinessCode.USER_NOT_FOUND,
      'User not found',
      HttpStatus.NOT_FOUND
    );

    expect(exception.statusCode).toBe(HttpStatus.NOT_FOUND);
  });

  it('should create exception with details', () => {
    const exception = new BusinessException(
      BusinessCode.VALIDATION_ERROR,
      'Validation failed',
      HttpStatus.BAD_REQUEST,
      { field: 'email', error: 'Invalid format' }
    );

    expect(exception.details).toEqual({ field: 'email', error: 'Invalid format' });
  });

  it('should extend Error', () => {
    const exception = new BusinessException(BusinessCode.INTERNAL_ERROR);

    expect(exception).toBeInstanceOf(Error);
  });
});

describe('ValidationException', () => {
  it('should create validation exception with details', () => {
    const details = { email: 'Invalid email', password: 'Too short' };
    const exception = new ValidationException(details);

    expect(exception.businessCode).toBe(BusinessCode.VALIDATION_ERROR);
    expect(exception.message).toBe('Validation failed');
    expect(exception.statusCode).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    expect(exception.details).toEqual(details);
    expect(exception.name).toBe('ValidationException');
  });

  it('should accept custom message', () => {
    const exception = new ValidationException({}, 'Custom validation error');

    expect(exception.message).toBe('Custom validation error');
  });

  it('should extend BusinessException', () => {
    const exception = new ValidationException({});

    expect(exception).toBeInstanceOf(BusinessException);
  });
});

describe('AuthException', () => {
  it('should create auth exception with default values', () => {
    const exception = new AuthException();

    expect(exception.businessCode).toBe(BusinessCode.AUTH_FAILED);
    expect(exception.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    expect(exception.name).toBe('AuthException');
  });

  it('should accept custom business code', () => {
    const exception = new AuthException(BusinessCode.TOKEN_EXPIRED);

    expect(exception.businessCode).toBe(BusinessCode.TOKEN_EXPIRED);
  });

  it('should accept custom message', () => {
    const exception = new AuthException(BusinessCode.AUTH_FAILED, 'Please login');

    expect(exception.message).toBe('Please login');
  });
});

describe('ForbiddenException', () => {
  it('should create forbidden exception with defaults', () => {
    const exception = new ForbiddenException();

    expect(exception.businessCode).toBe(BusinessCode.PERMISSION_DENIED);
    expect(exception.message).toBe('Access denied');
    expect(exception.statusCode).toBe(HttpStatus.FORBIDDEN);
    expect(exception.name).toBe('ForbiddenException');
  });

  it('should accept custom message', () => {
    const exception = new ForbiddenException('You cannot access this');

    expect(exception.message).toBe('You cannot access this');
  });
});

describe('NotFoundException', () => {
  it('should create not found exception with defaults', () => {
    const exception = new NotFoundException();

    expect(exception.businessCode).toBe(BusinessCode.RESOURCE_NOT_FOUND);
    expect(exception.message).toBe('Resource not found');
    expect(exception.statusCode).toBe(HttpStatus.NOT_FOUND);
    expect(exception.name).toBe('NotFoundException');
  });

  it('should accept custom message and business code', () => {
    const exception = new NotFoundException('User not found', BusinessCode.USER_NOT_FOUND);

    expect(exception.message).toBe('User not found');
    expect(exception.businessCode).toBe(BusinessCode.USER_NOT_FOUND);
  });
});

describe('ConflictException', () => {
  it('should create conflict exception with defaults', () => {
    const exception = new ConflictException();

    expect(exception.businessCode).toBe(BusinessCode.RESOURCE_CONFLICT);
    expect(exception.message).toBe('Resource conflict');
    expect(exception.statusCode).toBe(HttpStatus.CONFLICT);
    expect(exception.name).toBe('ConflictException');
  });

  it('should accept custom message and business code', () => {
    const exception = new ConflictException('Email exists', BusinessCode.EMAIL_ALREADY_EXISTS);

    expect(exception.message).toBe('Email exists');
    expect(exception.businessCode).toBe(BusinessCode.EMAIL_ALREADY_EXISTS);
  });
});

describe('RateLimitException', () => {
  it('should create rate limit exception with defaults', () => {
    const exception = new RateLimitException();

    expect(exception.businessCode).toBe(BusinessCode.RATE_LIMIT_EXCEEDED);
    expect(exception.message).toBe('Too many requests');
    expect(exception.statusCode).toBe(HttpStatus.TOO_MANY_REQUESTS);
    expect(exception.name).toBe('RateLimitException');
  });

  it('should accept custom message', () => {
    const exception = new RateLimitException('Please wait before retrying');

    expect(exception.message).toBe('Please wait before retrying');
  });
});

describe('InternalServerException', () => {
  it('should create internal server exception with defaults', () => {
    const exception = new InternalServerException();

    expect(exception.businessCode).toBe(BusinessCode.INTERNAL_ERROR);
    expect(exception.message).toBe('Internal server error');
    expect(exception.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(exception.name).toBe('InternalServerException');
  });

  it('should accept custom message and business code', () => {
    const exception = new InternalServerException('DB connection failed', BusinessCode.DATABASE_ERROR);

    expect(exception.message).toBe('DB connection failed');
    expect(exception.businessCode).toBe(BusinessCode.DATABASE_ERROR);
  });
});

describe('BadRequestException', () => {
  it('should create bad request exception with defaults', () => {
    const exception = new BadRequestException();

    expect(exception.businessCode).toBe(BusinessCode.INVALID_INPUT);
    expect(exception.message).toBe('Bad request');
    expect(exception.statusCode).toBe(HttpStatus.BAD_REQUEST);
    expect(exception.name).toBe('BadRequestException');
  });

  it('should accept custom message and business code', () => {
    const exception = new BadRequestException('Invalid JSON', BusinessCode.INVALID_JSON);

    expect(exception.message).toBe('Invalid JSON');
    expect(exception.businessCode).toBe(BusinessCode.INVALID_JSON);
  });
});

describe('ServiceUnavailableException', () => {
  it('should create service unavailable exception with defaults', () => {
    const exception = new ServiceUnavailableException();

    expect(exception.businessCode).toBe(BusinessCode.SERVICE_UNAVAILABLE);
    expect(exception.message).toBe('Service unavailable');
    expect(exception.statusCode).toBe(HttpStatus.SERVICE_UNAVAILABLE);
    expect(exception.name).toBe('ServiceUnavailableException');
  });

  it('should accept custom message and business code', () => {
    const exception = new ServiceUnavailableException('Maintenance mode', BusinessCode.EXTERNAL_SERVICE_ERROR);

    expect(exception.message).toBe('Maintenance mode');
    expect(exception.businessCode).toBe(BusinessCode.EXTERNAL_SERVICE_ERROR);
  });
});
