// TEAM_001: Unit tests for business error codes constants and utilities
import {
  BusinessCode,
  getBusinessCodeMessage,
  isSuccessCode,
  isAuthError,
  isUserError,
  isValidationError,
  isResourceError,
  isSystemError,
  isExternalError,
  isBusinessLogicError,
} from './business-codes';

describe('BusinessCode', () => {
  describe('success codes (0-99)', () => {
    it('should have correct success codes', () => {
      expect(BusinessCode.SUCCESS).toBe(0);
      expect(BusinessCode.CREATED).toBe(1);
      expect(BusinessCode.UPDATED).toBe(2);
      expect(BusinessCode.DELETED).toBe(3);
      expect(BusinessCode.ACCEPTED).toBe(4);
      expect(BusinessCode.NO_CHANGE).toBe(5);
    });
  });

  describe('authentication codes (1xxx)', () => {
    it('should have correct auth error codes', () => {
      expect(BusinessCode.AUTH_FAILED).toBe(1001);
      expect(BusinessCode.TOKEN_EXPIRED).toBe(1002);
      expect(BusinessCode.TOKEN_INVALID).toBe(1003);
      expect(BusinessCode.TOKEN_MISSING).toBe(1004);
      expect(BusinessCode.REFRESH_TOKEN_EXPIRED).toBe(1005);
      expect(BusinessCode.REFRESH_TOKEN_INVALID).toBe(1006);
      expect(BusinessCode.PERMISSION_DENIED).toBe(1007);
      expect(BusinessCode.ACCOUNT_LOCKED).toBe(1008);
      expect(BusinessCode.ACCOUNT_NOT_VERIFIED).toBe(1009);
      expect(BusinessCode.SESSION_EXPIRED).toBe(1010);
      expect(BusinessCode.INVALID_API_KEY).toBe(1011);
      expect(BusinessCode.AUTH_RATE_LIMITED).toBe(1012);
      expect(BusinessCode.TWO_FACTOR_REQUIRED).toBe(1013);
      expect(BusinessCode.TWO_FACTOR_FAILED).toBe(1014);
      expect(BusinessCode.OAUTH_FAILED).toBe(1015);
      expect(BusinessCode.OAUTH_PROVIDER_ERROR).toBe(1016);
    });
  });

  describe('user error codes (2xxx)', () => {
    it('should have correct user error codes', () => {
      expect(BusinessCode.USER_NOT_FOUND).toBe(2001);
      expect(BusinessCode.USER_ALREADY_EXISTS).toBe(2002);
      expect(BusinessCode.USER_INACTIVE).toBe(2003);
      expect(BusinessCode.INVALID_CREDENTIALS).toBe(2004);
      expect(BusinessCode.USER_SUSPENDED).toBe(2005);
      expect(BusinessCode.USER_DELETED).toBe(2006);
      expect(BusinessCode.EMAIL_ALREADY_EXISTS).toBe(2007);
      expect(BusinessCode.USERNAME_ALREADY_EXISTS).toBe(2008);
      expect(BusinessCode.PHONE_ALREADY_EXISTS).toBe(2009);
      expect(BusinessCode.INVALID_EMAIL).toBe(2010);
      expect(BusinessCode.WEAK_PASSWORD).toBe(2011);
      expect(BusinessCode.PASSWORD_MISMATCH).toBe(2012);
      expect(BusinessCode.INCORRECT_OLD_PASSWORD).toBe(2013);
      expect(BusinessCode.PROFILE_INCOMPLETE).toBe(2014);
    });
  });

  describe('validation error codes (3xxx)', () => {
    it('should have correct validation error codes', () => {
      expect(BusinessCode.VALIDATION_ERROR).toBe(3001);
      expect(BusinessCode.INVALID_INPUT).toBe(3002);
      expect(BusinessCode.MISSING_REQUIRED_FIELD).toBe(3003);
      expect(BusinessCode.VALUE_OUT_OF_RANGE).toBe(3004);
      expect(BusinessCode.INVALID_FORMAT).toBe(3005);
      expect(BusinessCode.FIELD_TOO_LONG).toBe(3006);
      expect(BusinessCode.FIELD_TOO_SHORT).toBe(3007);
      expect(BusinessCode.INVALID_DATE_FORMAT).toBe(3008);
      expect(BusinessCode.DATE_IN_PAST).toBe(3009);
      expect(BusinessCode.DATE_IN_FUTURE).toBe(3010);
      expect(BusinessCode.INVALID_FILE_TYPE).toBe(3011);
      expect(BusinessCode.FILE_TOO_LARGE).toBe(3012);
      expect(BusinessCode.INVALID_JSON).toBe(3013);
      expect(BusinessCode.INVALID_UUID).toBe(3014);
      expect(BusinessCode.INVALID_PHONE_NUMBER).toBe(3015);
      expect(BusinessCode.DUPLICATE_ENTRY).toBe(3016);
    });
  });

  describe('resource error codes (4xxx)', () => {
    it('should have correct resource error codes', () => {
      expect(BusinessCode.RESOURCE_NOT_FOUND).toBe(4001);
      expect(BusinessCode.RESOURCE_ALREADY_EXISTS).toBe(4002);
      expect(BusinessCode.RESOURCE_LOCKED).toBe(4003);
      expect(BusinessCode.RESOURCE_DELETED).toBe(4004);
      expect(BusinessCode.RESOURCE_EXPIRED).toBe(4005);
      expect(BusinessCode.RESOURCE_LIMIT_REACHED).toBe(4006);
      expect(BusinessCode.RESOURCE_UNAVAILABLE).toBe(4007);
      expect(BusinessCode.RESOURCE_CONFLICT).toBe(4008);
      expect(BusinessCode.VERSION_MISMATCH).toBe(4009);
      expect(BusinessCode.HAS_DEPENDENCIES).toBe(4010);
    });
  });

  describe('system error codes (5xxx)', () => {
    it('should have correct system error codes', () => {
      expect(BusinessCode.INTERNAL_ERROR).toBe(5001);
      expect(BusinessCode.DATABASE_ERROR).toBe(5002);
      expect(BusinessCode.EXTERNAL_SERVICE_ERROR).toBe(5003);
      expect(BusinessCode.SERVICE_UNAVAILABLE).toBe(5004);
      expect(BusinessCode.CONFIG_ERROR).toBe(5005);
      expect(BusinessCode.CACHE_ERROR).toBe(5006);
      expect(BusinessCode.FILE_SYSTEM_ERROR).toBe(5007);
      expect(BusinessCode.MEMORY_LIMIT_EXCEEDED).toBe(5008);
      expect(BusinessCode.TIMEOUT_ERROR).toBe(5009);
      expect(BusinessCode.QUEUE_ERROR).toBe(5010);
    });
  });

  describe('external service error codes (6xxx)', () => {
    it('should have correct external service error codes', () => {
      expect(BusinessCode.THIRD_PARTY_API_ERROR).toBe(6001);
      expect(BusinessCode.PAYMENT_GATEWAY_ERROR).toBe(6002);
      expect(BusinessCode.EMAIL_SERVICE_ERROR).toBe(6003);
      expect(BusinessCode.SMS_SERVICE_ERROR).toBe(6004);
      expect(BusinessCode.STORAGE_SERVICE_ERROR).toBe(6005);
      expect(BusinessCode.SEARCH_SERVICE_ERROR).toBe(6006);
      expect(BusinessCode.NOTIFICATION_SERVICE_ERROR).toBe(6007);
      expect(BusinessCode.ANALYTICS_SERVICE_ERROR).toBe(6008);
    });
  });

  describe('business logic error codes (7xxx)', () => {
    it('should have correct business logic error codes', () => {
      expect(BusinessCode.OPERATION_NOT_ALLOWED).toBe(7001);
      expect(BusinessCode.INSUFFICIENT_BALANCE).toBe(7002);
      expect(BusinessCode.TRANSACTION_FAILED).toBe(7003);
      expect(BusinessCode.ORDER_CANNOT_CANCEL).toBe(7004);
      expect(BusinessCode.ORDER_CANNOT_MODIFY).toBe(7005);
      expect(BusinessCode.OUT_OF_STOCK).toBe(7006);
      expect(BusinessCode.COUPON_INVALID).toBe(7007);
      expect(BusinessCode.COUPON_EXPIRED).toBe(7008);
      expect(BusinessCode.MINIMUM_ORDER_NOT_MET).toBe(7009);
      expect(BusinessCode.MAX_QUANTITY_EXCEEDED).toBe(7010);
      expect(BusinessCode.SUBSCRIPTION_REQUIRED).toBe(7011);
      expect(BusinessCode.SUBSCRIPTION_EXPIRED).toBe(7012);
      expect(BusinessCode.FEATURE_NOT_AVAILABLE).toBe(7013);
      expect(BusinessCode.QUOTA_EXCEEDED).toBe(7014);
      expect(BusinessCode.RATE_LIMIT_EXCEEDED).toBe(7015);
    });
  });
});

describe('getBusinessCodeMessage', () => {
  it('should return correct message for success codes', () => {
    expect(getBusinessCodeMessage(0)).toBe('Operation completed successfully');
    expect(getBusinessCodeMessage(1)).toBe('Resource created successfully');
  });

  it('should return correct message for auth error codes', () => {
    expect(getBusinessCodeMessage(1001)).toBe('Authentication failed');
    expect(getBusinessCodeMessage(1002)).toBe('Access token has expired');
  });

  it('should return correct message for user error codes', () => {
    expect(getBusinessCodeMessage(2001)).toBe('User not found');
    expect(getBusinessCodeMessage(2004)).toBe('Invalid credentials');
  });

  it('should return correct message for validation error codes', () => {
    expect(getBusinessCodeMessage(3001)).toBe('Validation error');
    expect(getBusinessCodeMessage(3002)).toBe('Invalid input');
  });

  it('should return correct message for resource error codes', () => {
    expect(getBusinessCodeMessage(4001)).toBe('Resource not found');
    expect(getBusinessCodeMessage(4008)).toBe('Resource conflict');
  });

  it('should return correct message for system error codes', () => {
    expect(getBusinessCodeMessage(5001)).toBe('Internal server error');
    expect(getBusinessCodeMessage(5002)).toBe('Database error');
  });

  it('should return "Unknown error" for unknown codes', () => {
    expect(getBusinessCodeMessage(9999)).toBe('Unknown error');
    expect(getBusinessCodeMessage(-1)).toBe('Unknown error');
  });
});

describe('isSuccessCode', () => {
  it('should return true for success codes (0-99)', () => {
    expect(isSuccessCode(0)).toBe(true);
    expect(isSuccessCode(5)).toBe(true);
    expect(isSuccessCode(99)).toBe(true);
  });

  it('should return false for non-success codes', () => {
    expect(isSuccessCode(-1)).toBe(false);
    expect(isSuccessCode(100)).toBe(false);
    expect(isSuccessCode(1001)).toBe(false);
  });
});

describe('isAuthError', () => {
  it('should return true for auth error codes (1000-1999)', () => {
    expect(isAuthError(1000)).toBe(true);
    expect(isAuthError(1001)).toBe(true);
    expect(isAuthError(1999)).toBe(true);
  });

  it('should return false for non-auth error codes', () => {
    expect(isAuthError(999)).toBe(false);
    expect(isAuthError(2000)).toBe(false);
    expect(isAuthError(0)).toBe(false);
  });
});

describe('isUserError', () => {
  it('should return true for user error codes (2000-2999)', () => {
    expect(isUserError(2000)).toBe(true);
    expect(isUserError(2001)).toBe(true);
    expect(isUserError(2999)).toBe(true);
  });

  it('should return false for non-user error codes', () => {
    expect(isUserError(1999)).toBe(false);
    expect(isUserError(3000)).toBe(false);
  });
});

describe('isValidationError', () => {
  it('should return true for validation error codes (3000-3999)', () => {
    expect(isValidationError(3000)).toBe(true);
    expect(isValidationError(3001)).toBe(true);
    expect(isValidationError(3999)).toBe(true);
  });

  it('should return false for non-validation error codes', () => {
    expect(isValidationError(2999)).toBe(false);
    expect(isValidationError(4000)).toBe(false);
  });
});

describe('isResourceError', () => {
  it('should return true for resource error codes (4000-4999)', () => {
    expect(isResourceError(4000)).toBe(true);
    expect(isResourceError(4001)).toBe(true);
    expect(isResourceError(4999)).toBe(true);
  });

  it('should return false for non-resource error codes', () => {
    expect(isResourceError(3999)).toBe(false);
    expect(isResourceError(5000)).toBe(false);
  });
});

describe('isSystemError', () => {
  it('should return true for system error codes (5000-5999)', () => {
    expect(isSystemError(5000)).toBe(true);
    expect(isSystemError(5001)).toBe(true);
    expect(isSystemError(5999)).toBe(true);
  });

  it('should return false for non-system error codes', () => {
    expect(isSystemError(4999)).toBe(false);
    expect(isSystemError(6000)).toBe(false);
  });
});

describe('isExternalError', () => {
  it('should return true for external error codes (6000-6999)', () => {
    expect(isExternalError(6000)).toBe(true);
    expect(isExternalError(6001)).toBe(true);
    expect(isExternalError(6999)).toBe(true);
  });

  it('should return false for non-external error codes', () => {
    expect(isExternalError(5999)).toBe(false);
    expect(isExternalError(7000)).toBe(false);
  });
});

describe('isBusinessLogicError', () => {
  it('should return true for business logic error codes (7000-7999)', () => {
    expect(isBusinessLogicError(7000)).toBe(true);
    expect(isBusinessLogicError(7001)).toBe(true);
    expect(isBusinessLogicError(7999)).toBe(true);
  });

  it('should return false for non-business logic error codes', () => {
    expect(isBusinessLogicError(6999)).toBe(false);
    expect(isBusinessLogicError(8000)).toBe(false);
  });
});
