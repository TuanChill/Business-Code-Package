# NestJS Integration

Complete integration with NestJS framework including exception handling, response transformation, and custom exceptions.

## Table of Contents

- [Import](#import)
- [Setup](#setup)
- [ApiExceptionFilter](#apiexceptionfilter)
- [ApiResponseInterceptor](#apiresponseinterceptor)
- [Exception Classes](#exception-classes)
- [Complete Examples](#complete-examples)
- [TypeScript Types](#typescript-types)

---

## Import

```typescript
import {
  // Exception Filter
  ApiExceptionFilter,

  // Response Interceptors
  ApiResponseInterceptor,
  ApiResponseInterceptorAdvanced,
  SkipApiResponse,
  SKIP_API_RESPONSE_KEY,

  // Exception Classes
  BusinessException,
  NotFoundException,
  ValidationException,
  AuthException,
  ForbiddenException,
  ConflictException,
  RateLimitException,
  InternalServerException,
  BadRequestException,
  ServiceUnavailableException,
} from "@tchil/business-codes/nestjs";

// Types
import type {
  ApiExceptionFilterOptions,
  ApiResponseInterceptorOptions,
} from "@tchil/business-codes/nestjs";
```

---

## Setup

### Global Configuration (Recommended)

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import {
  ApiExceptionFilter,
  ApiResponseInterceptor,
} from "@tchil/business-codes/nestjs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter - converts ALL exceptions to ApiResponse format
  app.useGlobalFilters(new ApiExceptionFilter());

  // Global interceptor - wraps ALL responses in ApiResponse format
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  await app.listen(3000);
}

bootstrap();
```

### Module-level Configuration

```typescript
// app.module.ts
import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import {
  ApiExceptionFilter,
  ApiResponseInterceptor,
} from "@tchil/business-codes/nestjs";

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useValue: new ApiExceptionFilter({
        includeStack: process.env.NODE_ENV === "development",
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useValue: new ApiResponseInterceptor({
        defaultMessage: "Request successful",
      }),
    },
  ],
})
export class AppModule {}
```

---

## ApiExceptionFilter

Automatically converts all exceptions to standardized ApiResponse error format.

### Constructor

```typescript
new ApiExceptionFilter(options?: ApiExceptionFilterOptions)
```

### Options

```typescript
interface ApiExceptionFilterOptions {
  /**
   * Include stack trace in error response
   * @default false
   */
  includeStack?: boolean;

  /**
   * Custom logger function called for every error
   */
  logger?: (error: unknown, context: string) => void;
}
```

### Usage Examples

**Basic:**

```typescript
app.useGlobalFilters(new ApiExceptionFilter());
```

**With stack trace (development only):**

```typescript
app.useGlobalFilters(
  new ApiExceptionFilter({
    includeStack: process.env.NODE_ENV === "development",
  })
);
```

**With custom logger:**

```typescript
app.useGlobalFilters(
  new ApiExceptionFilter({
    logger: (error, context) => {
      console.error(`[${context}] Error:`, error);
      // Or use Winston, Pino, etc.
      this.logger.error(error, context);
    },
  })
);
```

### Exception Type Handling

| Exception Type           | Result                                                               |
| ------------------------ | -------------------------------------------------------------------- |
| `BusinessException`      | Uses business code, message, status code, and details from exception |
| `HttpException` (NestJS) | Extracts status and message, maps to business code                   |
| `Error`                  | Converts to 500 Internal Error with INTERNAL_ERROR code              |
| Unknown                  | Converts to 500 Internal Error with generic message                  |

### HTTP to Business Code Mapping

| HTTP Status | Business Code              |
| ----------- | -------------------------- |
| 400         | INVALID_INPUT (3002)       |
| 401         | AUTH_FAILED (1001)         |
| 403         | PERMISSION_DENIED (1007)   |
| 404         | RESOURCE_NOT_FOUND (4001)  |
| 409         | RESOURCE_CONFLICT (4008)   |
| 422         | VALIDATION_ERROR (3001)    |
| 429         | RATE_LIMIT_EXCEEDED (7015) |
| 500         | INTERNAL_ERROR (5001)      |
| 503         | SERVICE_UNAVAILABLE (5004) |

---

## ApiResponseInterceptor

Automatically wraps controller return values in ApiResponse format.

### Constructor

```typescript
new ApiResponseInterceptor(options?: ApiResponseInterceptorOptions)
```

### Options

```typescript
interface ApiResponseInterceptorOptions {
  /**
   * Default success message
   * @default "Success"
   */
  defaultMessage?: string;

  /**
   * Skip wrapping if response is already ApiResponse
   * @default true
   */
  skipIfWrapped?: boolean;
}
```

### Usage Examples

**Basic:**

```typescript
app.useGlobalInterceptors(new ApiResponseInterceptor());
```

**With custom message:**

```typescript
app.useGlobalInterceptors(
  new ApiResponseInterceptor({
    defaultMessage: "Request completed successfully",
  })
);
```

**Force re-wrap existing ApiResponse:**

```typescript
app.useGlobalInterceptors(
  new ApiResponseInterceptor({
    skipIfWrapped: false, // Will wrap ApiResponse again
  })
);
```

### Special Cases

- **204 No Content:** Automatically returns `ApiResponse.noContent()`
- **Already ApiResponse:** Skipped if `skipIfWrapped: true` (default)

---

## ApiResponseInterceptorAdvanced

Extended interceptor with `@SkipApiResponse()` decorator support.

```typescript
import {
  ApiResponseInterceptorAdvanced,
  SkipApiResponse,
} from "@tchil/business-codes/nestjs";

// Setup
app.useGlobalInterceptors(new ApiResponseInterceptorAdvanced());

// In controller
@Controller("files")
export class FilesController {
  @Get("download/:id")
  @SkipApiResponse() // Skip transformation for this route
  async downloadFile(@Param("id") id: string) {
    return this.streamFile(id); // Returns raw response
  }
}
```

### SkipApiResponse Decorator

```typescript
import { SkipApiResponse } from "@tchil/business-codes/nestjs";

@Get("raw")
@SkipApiResponse()
getRawData() {
  return { custom: "format" }; // Not wrapped in ApiResponse
}
```

### SKIP_API_RESPONSE_KEY

Metadata key constant for custom decorators:

```typescript
import { SKIP_API_RESPONSE_KEY } from "@tchil/business-codes/nestjs";

// Value: "skipApiResponse"
```

---

## Exception Classes

### BusinessException (Base Class)

Base class for all business exceptions.

```typescript
class BusinessException extends Error {
  constructor(
    businessCode: number,
    message?: string,
    statusCode?: number, // Default: 400
    details?: Record<string, unknown>
  );

  // Properties
  readonly businessCode: number;
  readonly statusCode: number;
  readonly details?: Record<string, unknown>;
}
```

**Example:**

```typescript
import { BusinessException } from "@tchil/business-codes/nestjs";
import { BusinessCode, HttpStatus } from "@tchil/business-codes";

throw new BusinessException(
  BusinessCode.OPERATION_NOT_ALLOWED,
  "This action is not permitted",
  HttpStatus.FORBIDDEN,
  { reason: "Account is in read-only mode" }
);
```

---

### NotFoundException

For 404 Not Found errors.

```typescript
class NotFoundException extends BusinessException {
  constructor(
    message?: string, // Default: "Resource not found"
    businessCode?: number // Default: RESOURCE_NOT_FOUND (4001)
  );
}
```

**Examples:**

```typescript
import { NotFoundException } from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

// Default
throw new NotFoundException();
// → 404 { code: 4001, message: "Resource not found" }

// Custom message
throw new NotFoundException("User not found");
// → 404 { code: 4001, message: "User not found" }

// Custom code
throw new NotFoundException("User not found", BusinessCode.USER_NOT_FOUND);
// → 404 { code: 2001, message: "User not found" }
```

---

### ValidationException

For 422 Validation errors with field details.

```typescript
class ValidationException extends BusinessException {
  constructor(
    details: Record<string, unknown>, // Required: field errors
    message?: string // Default: "Validation failed"
  );
}
```

**Examples:**

```typescript
import { ValidationException } from "@tchil/business-codes/nestjs";

throw new ValidationException({
  email: "Must be a valid email address",
  password: "Must be at least 8 characters",
  age: "Must be a positive number",
});
// → 422 { code: 3001, message: "Validation failed", details: {...} }

// Custom message
throw new ValidationException(
  { email: "Invalid email" },
  "Please fix the following errors"
);
```

---

### AuthException

For 401 Unauthorized errors.

```typescript
class AuthException extends BusinessException {
  constructor(
    businessCode?: number, // Default: AUTH_FAILED (1001)
    message?: string // Default: from business code
  );
}
```

**Examples:**

```typescript
import { AuthException } from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

// Default
throw new AuthException();
// → 401 { code: 1001, message: "Authentication failed" }

// Token expired
throw new AuthException(BusinessCode.TOKEN_EXPIRED);
// → 401 { code: 1002, message: "Access token has expired" }

// Custom message
throw new AuthException(
  BusinessCode.TOKEN_EXPIRED,
  "Your session has expired. Please log in again."
);
```

---

### ForbiddenException

For 403 Forbidden errors.

```typescript
class ForbiddenException extends BusinessException {
  constructor(
    message?: string // Default: "Access denied"
  );
}
```

**Example:**

```typescript
import { ForbiddenException } from "@tchil/business-codes/nestjs";

throw new ForbiddenException(
  "You do not have permission to access this resource"
);
// → 403 { code: 1007, message: "You do not have permission..." }
```

---

### ConflictException

For 409 Conflict errors.

```typescript
class ConflictException extends BusinessException {
  constructor(
    message?: string, // Default: "Resource conflict"
    businessCode?: number // Default: RESOURCE_CONFLICT (4008)
  );
}
```

**Examples:**

```typescript
import { ConflictException } from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

throw new ConflictException(
  "Email already exists",
  BusinessCode.EMAIL_ALREADY_EXISTS
);
// → 409 { code: 2007, message: "Email already exists" }
```

---

### BadRequestException

For 400 Bad Request errors.

```typescript
class BadRequestException extends BusinessException {
  constructor(
    message?: string, // Default: "Bad request"
    businessCode?: number // Default: INVALID_INPUT (3002)
  );
}
```

**Example:**

```typescript
import { BadRequestException } from "@tchil/business-codes/nestjs";

throw new BadRequestException("Invalid request body format");
// → 400 { code: 3002, message: "Invalid request body format" }
```

---

### RateLimitException

For 429 Too Many Requests errors.

```typescript
class RateLimitException extends BusinessException {
  constructor(
    message?: string // Default: "Too many requests"
  );
}
```

**Example:**

```typescript
import { RateLimitException } from "@tchil/business-codes/nestjs";

throw new RateLimitException(
  "Too many login attempts. Please try again in 5 minutes."
);
// → 429 { code: 7015, message: "Too many login attempts..." }
```

---

### InternalServerException

For 500 Internal Server errors.

```typescript
class InternalServerException extends BusinessException {
  constructor(
    message?: string, // Default: "Internal server error"
    businessCode?: number // Default: INTERNAL_ERROR (5001)
  );
}
```

**Examples:**

```typescript
import { InternalServerException } from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

throw new InternalServerException(
  "Database connection failed",
  BusinessCode.DATABASE_ERROR
);
// → 500 { code: 5002, message: "Database connection failed" }
```

---

### ServiceUnavailableException

For 503 Service Unavailable errors.

```typescript
class ServiceUnavailableException extends BusinessException {
  constructor(
    message?: string, // Default: "Service unavailable"
    businessCode?: number // Default: SERVICE_UNAVAILABLE (5004)
  );
}
```

**Example:**

```typescript
import { ServiceUnavailableException } from "@tchil/business-codes/nestjs";

throw new ServiceUnavailableException("Service is under maintenance");
// → 503 { code: 5004, message: "Service is under maintenance" }
```

---

## Complete Examples

### Service Layer

```typescript
// user.service.ts
import { Injectable } from "@nestjs/common";
import {
  NotFoundException,
  ValidationException,
  AuthException,
  ConflictException,
} from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async findById(id: string) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException(
        "User not found",
        BusinessCode.USER_NOT_FOUND
      );
    }

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new AuthException(BusinessCode.INVALID_CREDENTIALS);
    }

    const isValid = await user.verifyPassword(password);
    if (!isValid) {
      throw new AuthException(BusinessCode.INVALID_CREDENTIALS);
    }

    if (user.isLocked) {
      throw new AuthException(BusinessCode.ACCOUNT_LOCKED);
    }

    return this.generateToken(user);
  }

  async create(dto: CreateUserDto) {
    // Validate
    const errors = await this.validate(dto);
    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors);
    }

    // Check duplicate
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException(
        "Email already exists",
        BusinessCode.EMAIL_ALREADY_EXISTS
      );
    }

    return this.userRepo.create(dto);
  }
}
```

### Controller Layer

```typescript
// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ApiResponse } from "@tchil/business-codes";
import { UserService } from "./user.service";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    // Automatically wrapped by interceptor
    return this.userService.findById(id);
  }

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const { items, total } = await this.userService.findAll({ page, limit });

    // Use ApiResponse.paginated for pagination meta
    return ApiResponse.paginated({
      data: items,
      page,
      limit,
      total,
    });
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.userService.create(dto);

    // Use ApiResponse.created for 201 status
    return ApiResponse.created(user, "User created successfully");
  }

  @Patch(":id")
  async update(@Param("id") id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.update(id, dto);
    return ApiResponse.success({
      data: user,
      message: "User updated successfully",
    });
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    await this.userService.remove(id);
    return ApiResponse.noContent("User deleted successfully");
  }
}
```

### Response Examples

**Success (GET /users/123):**

```json
{
  "success": true,
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "message": "Success",
  "statusCode": 200
}
```

**Paginated (GET /users?page=1&limit=10):**

```json
{
  "success": true,
  "data": [
    { "id": "1", "name": "User 1" },
    { "id": "2", "name": "User 2" }
  ],
  "message": "Success",
  "statusCode": 200,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 95,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Not Found (GET /users/999):**

```json
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "error": {
    "code": 2001
  }
}
```

**Validation Error (POST /users):**

```json
{
  "success": false,
  "message": "Validation failed",
  "statusCode": 422,
  "error": {
    "code": 3001,
    "details": {
      "email": "Must be a valid email address",
      "password": "Must be at least 8 characters"
    }
  }
}
```

**Auth Error (POST /auth/login):**

```json
{
  "success": false,
  "message": "Invalid credentials",
  "statusCode": 401,
  "error": {
    "code": 2004
  }
}
```

---

## TypeScript Types

```typescript
import type {
  ApiExceptionFilterOptions,
  ApiResponseInterceptorOptions,
} from "@tchil/business-codes/nestjs";
```
