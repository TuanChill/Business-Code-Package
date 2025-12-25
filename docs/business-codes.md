# Business Codes

Custom business error codes for specific error handling beyond HTTP status codes.

## Import

```typescript
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
} from "@tchil/business-codes";
```

---

## Code Ranges

| Range | Category       | Description                 |
| ----- | -------------- | --------------------------- |
| 0-99  | Success        | Successful operations       |
| 1xxx  | Authentication | Auth & authorization errors |
| 2xxx  | User           | User-related errors         |
| 3xxx  | Validation     | Input validation errors     |
| 4xxx  | Resource       | Resource state errors       |
| 5xxx  | System         | Server/system errors        |
| 6xxx  | External       | Third-party service errors  |
| 7xxx  | Business       | Business logic errors       |

---

## Success Codes (0-99)

| Constant    | Code | Message                           |
| ----------- | ---- | --------------------------------- |
| `SUCCESS`   | 0    | Operation completed successfully  |
| `CREATED`   | 1    | Resource created successfully     |
| `UPDATED`   | 2    | Resource updated successfully     |
| `DELETED`   | 3    | Resource deleted successfully     |
| `ACCEPTED`  | 4    | Operation accepted for processing |
| `NO_CHANGE` | 5    | No changes were made              |

---

## Authentication Errors (1xxx)

| Constant                | Code | Message                   |
| ----------------------- | ---- | ------------------------- |
| `AUTH_FAILED`           | 1001 | Authentication failed     |
| `TOKEN_EXPIRED`         | 1002 | Access token has expired  |
| `TOKEN_INVALID`         | 1003 | Access token is invalid   |
| `TOKEN_MISSING`         | 1004 | Access token is missing   |
| `REFRESH_TOKEN_EXPIRED` | 1005 | Refresh token has expired |
| `REFRESH_TOKEN_INVALID` | 1006 | Refresh token is invalid  |
| `PERMISSION_DENIED`     | 1007 | Insufficient permissions  |
| `ACCOUNT_LOCKED`        | 1008 | Account is locked         |
| `ACCOUNT_NOT_VERIFIED`  | 1009 | Account is not verified   |
| `SESSION_EXPIRED`       | 1010 | Session has expired       |
| `INVALID_API_KEY`       | 1011 | Invalid API key           |
| `AUTH_RATE_LIMITED`     | 1012 | Too many auth attempts    |
| `TWO_FACTOR_REQUIRED`   | 1013 | 2FA required              |
| `TWO_FACTOR_FAILED`     | 1014 | 2FA failed                |
| `OAUTH_FAILED`          | 1015 | OAuth failed              |
| `OAUTH_PROVIDER_ERROR`  | 1016 | OAuth provider error      |

---

## User Errors (2xxx)

| Constant                  | Code | Message                   |
| ------------------------- | ---- | ------------------------- |
| `USER_NOT_FOUND`          | 2001 | User not found            |
| `USER_ALREADY_EXISTS`     | 2002 | User already exists       |
| `USER_INACTIVE`           | 2003 | User account is inactive  |
| `INVALID_CREDENTIALS`     | 2004 | Invalid credentials       |
| `USER_SUSPENDED`          | 2005 | User account is suspended |
| `USER_DELETED`            | 2006 | User account is deleted   |
| `EMAIL_ALREADY_EXISTS`    | 2007 | Email already in use      |
| `USERNAME_ALREADY_EXISTS` | 2008 | Username already in use   |
| `PHONE_ALREADY_EXISTS`    | 2009 | Phone already in use      |
| `INVALID_EMAIL`           | 2010 | Invalid email format      |
| `WEAK_PASSWORD`           | 2011 | Password is too weak      |
| `PASSWORD_MISMATCH`       | 2012 | Passwords do not match    |
| `INCORRECT_OLD_PASSWORD`  | 2013 | Old password is incorrect |
| `PROFILE_INCOMPLETE`      | 2014 | Profile is incomplete     |

---

## Validation Errors (3xxx)

| Constant                 | Code | Message                      |
| ------------------------ | ---- | ---------------------------- |
| `VALIDATION_ERROR`       | 3001 | Validation error             |
| `INVALID_INPUT`          | 3002 | Invalid input                |
| `MISSING_REQUIRED_FIELD` | 3003 | Required field is missing    |
| `VALUE_OUT_OF_RANGE`     | 3004 | Value is out of range        |
| `INVALID_FORMAT`         | 3005 | Invalid format               |
| `FIELD_TOO_LONG`         | 3006 | Field is too long            |
| `FIELD_TOO_SHORT`        | 3007 | Field is too short           |
| `INVALID_DATE_FORMAT`    | 3008 | Invalid date format          |
| `DATE_IN_PAST`           | 3009 | Date cannot be in the past   |
| `DATE_IN_FUTURE`         | 3010 | Date cannot be in the future |
| `INVALID_FILE_TYPE`      | 3011 | Invalid file type            |
| `FILE_TOO_LARGE`         | 3012 | File size is too large       |
| `INVALID_JSON`           | 3013 | Invalid JSON format          |
| `INVALID_UUID`           | 3014 | Invalid UUID format          |
| `INVALID_PHONE_NUMBER`   | 3015 | Invalid phone number format  |
| `DUPLICATE_ENTRY`        | 3016 | Duplicate entry              |

---

## Resource Errors (4xxx)

| Constant                  | Code | Message                          |
| ------------------------- | ---- | -------------------------------- |
| `RESOURCE_NOT_FOUND`      | 4001 | Resource not found               |
| `RESOURCE_ALREADY_EXISTS` | 4002 | Resource already exists          |
| `RESOURCE_LOCKED`         | 4003 | Resource is locked               |
| `RESOURCE_DELETED`        | 4004 | Resource has been deleted        |
| `RESOURCE_EXPIRED`        | 4005 | Resource has expired             |
| `RESOURCE_LIMIT_REACHED`  | 4006 | Resource limit reached           |
| `RESOURCE_UNAVAILABLE`    | 4007 | Resource is not available        |
| `RESOURCE_CONFLICT`       | 4008 | Resource conflict                |
| `VERSION_MISMATCH`        | 4009 | Version mismatch                 |
| `HAS_DEPENDENCIES`        | 4010 | Cannot delete - has dependencies |

---

## System Errors (5xxx)

| Constant                 | Code | Message                         |
| ------------------------ | ---- | ------------------------------- |
| `INTERNAL_ERROR`         | 5001 | Internal server error           |
| `DATABASE_ERROR`         | 5002 | Database error                  |
| `EXTERNAL_SERVICE_ERROR` | 5003 | External service error          |
| `SERVICE_UNAVAILABLE`    | 5004 | Service temporarily unavailable |
| `CONFIG_ERROR`           | 5005 | Configuration error             |
| `CACHE_ERROR`            | 5006 | Cache error                     |
| `FILE_SYSTEM_ERROR`      | 5007 | File system error               |
| `MEMORY_LIMIT_EXCEEDED`  | 5008 | Memory limit exceeded           |
| `TIMEOUT_ERROR`          | 5009 | Operation timed out             |
| `QUEUE_ERROR`            | 5010 | Queue error                     |

---

## External Service Errors (6xxx)

| Constant                     | Code | Message                    |
| ---------------------------- | ---- | -------------------------- |
| `THIRD_PARTY_API_ERROR`      | 6001 | Third-party API error      |
| `PAYMENT_GATEWAY_ERROR`      | 6002 | Payment gateway error      |
| `EMAIL_SERVICE_ERROR`        | 6003 | Email service error        |
| `SMS_SERVICE_ERROR`          | 6004 | SMS service error          |
| `STORAGE_SERVICE_ERROR`      | 6005 | Storage service error      |
| `SEARCH_SERVICE_ERROR`       | 6006 | Search service error       |
| `NOTIFICATION_SERVICE_ERROR` | 6007 | Notification service error |
| `ANALYTICS_SERVICE_ERROR`    | 6008 | Analytics service error    |

---

## Business Logic Errors (7xxx)

| Constant                | Code | Message                   |
| ----------------------- | ---- | ------------------------- |
| `OPERATION_NOT_ALLOWED` | 7001 | Operation not allowed     |
| `INSUFFICIENT_BALANCE`  | 7002 | Insufficient balance      |
| `TRANSACTION_FAILED`    | 7003 | Transaction failed        |
| `ORDER_CANNOT_CANCEL`   | 7004 | Order cannot be cancelled |
| `ORDER_CANNOT_MODIFY`   | 7005 | Order cannot be modified  |
| `OUT_OF_STOCK`          | 7006 | Item out of stock         |
| `COUPON_INVALID`        | 7007 | Coupon is invalid         |
| `COUPON_EXPIRED`        | 7008 | Coupon has expired        |
| `MINIMUM_ORDER_NOT_MET` | 7009 | Minimum order not met     |
| `MAX_QUANTITY_EXCEEDED` | 7010 | Maximum quantity exceeded |
| `SUBSCRIPTION_REQUIRED` | 7011 | Subscription required     |
| `SUBSCRIPTION_EXPIRED`  | 7012 | Subscription has expired  |
| `FEATURE_NOT_AVAILABLE` | 7013 | Feature not available     |
| `QUOTA_EXCEEDED`        | 7014 | Quota exceeded            |
| `RATE_LIMIT_EXCEEDED`   | 7015 | Rate limit exceeded       |

---

## Helper Functions

### `getBusinessCodeMessage(code)`

Get default message for a business code.

```typescript
getBusinessCodeMessage(2001); // "User not found"
getBusinessCodeMessage(1002); // "Access token has expired"
getBusinessCodeMessage(9999); // "Unknown error"
```

### Category Checkers

```typescript
isSuccessCode(0); // true (0-99)
isAuthError(1001); // true (1000-1999)
isUserError(2001); // true (2000-2999)
isValidationError(3001); // true (3000-3999)
isResourceError(4001); // true (4000-4999)
isSystemError(5001); // true (5000-5999)
isExternalError(6001); // true (6000-6999)
isBusinessLogicError(7001); // true (7000-7999)
```

---

## Usage Examples

### Error Handling by Category

```typescript
import {
  isAuthError,
  isValidationError,
  BusinessCode,
} from "@tchil/business-codes";

function handleError(code: number) {
  if (isAuthError(code)) {
    // Redirect to login
    router.push("/login");
  } else if (isValidationError(code)) {
    // Show form errors
    showFormErrors();
  }
}
```

### Mapping Codes to HTTP Status

```typescript
import { BusinessCode, HttpStatus } from "@tchil/business-codes";

const codeToStatus: Record<number, number> = {
  [BusinessCode.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [BusinessCode.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [BusinessCode.VALIDATION_ERROR]: HttpStatus.UNPROCESSABLE_ENTITY,
  [BusinessCode.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
  [BusinessCode.INTERNAL_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};
```
