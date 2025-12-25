# @tchil/business-codes

A TypeScript library for HTTP status codes, business error codes, and standardized API responses. Compatible with **NestJS** and **Next.js**.

## ✨ Features

- 📦 **HTTP Status Codes** - All standard HTTP status codes with helper functions
- 🔢 **Business Error Codes** - Organized error codes for authentication, validation, resources, etc.
- 📋 **ApiResponse Class** - Standardized response format with pagination support
- 🦅 **NestJS Integration** - Exception filter, response interceptor, and custom exceptions
- ⚡ **Next.js Integration** - Response helpers for App Router API routes
- 🌍 **I18n Support** - Localized messages (English/Vietnamese) with custom override
- 🔷 **TypeScript First** - Full type safety and IntelliSense support
- 📦 **Dual Package** - Supports both ESM and CommonJS

## 📥 Installation

```bash
npm install @tchil/business-codes
# or
yarn add @tchil/business-codes
# or
pnpm add @tchil/business-codes
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { HttpStatus, BusinessCode, ApiResponse } from "@tchil/business-codes";

// Success response
const success = ApiResponse.success({
  data: { id: 1, name: "John" },
  message: "User retrieved successfully",
});

// Error response
const error = ApiResponse.error({
  message: "User not found",
  code: BusinessCode.USER_NOT_FOUND,
  statusCode: HttpStatus.NOT_FOUND,
});

// Paginated response
const paginated = ApiResponse.paginated({
  data: users,
  page: 1,
  limit: 10,
  total: 100,
});
```

---

## 📚 NestJS Usage

### Setup Global Filter & Interceptor

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import {
  ApiExceptionFilter,
  ApiResponseInterceptor,
} from "@tchil/business-codes/nestjs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Automatically convert exceptions to ApiResponse format
  app.useGlobalFilters(new ApiExceptionFilter());

  // Automatically wrap responses in ApiResponse format
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  await app.listen(3000);
}
```

### Throwing Exceptions

```typescript
// user.service.ts
import {
  BusinessException,
  NotFoundException,
  ValidationException,
  AuthException,
} from "@tchil/business-codes/nestjs";
import { BusinessCode } from "@tchil/business-codes";

@Injectable()
export class UserService {
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
    if (!user || !user.verifyPassword(password)) {
      throw new AuthException(
        BusinessCode.INVALID_CREDENTIALS,
        "Invalid email or password"
      );
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const errors = await this.validate(dto);
    if (Object.keys(errors).length > 0) {
      throw new ValidationException(errors, "Validation failed");
    }
    return this.userRepo.create(dto);
  }
}
```

### Controller Example

```typescript
// user.controller.ts
import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { ApiResponse } from "@tchil/business-codes";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  async findOne(@Param("id") id: string) {
    // With interceptor, this is automatically wrapped
    return this.userService.findById(id);
  }

  @Get()
  async findAll(@Query("page") page = 1, @Query("limit") limit = 10) {
    const { items, total } = await this.userService.findAll({ page, limit });

    // Return paginated response directly
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
    return ApiResponse.created(user, "User created successfully");
  }
}
```

---

## ⚡ Next.js Usage

### App Router API Routes

```typescript
// app/api/users/route.ts
import {
  jsonSuccess,
  jsonError,
  jsonCreated,
  jsonPaginated,
  jsonNotFound,
  withErrorHandler,
  parseBody,
  parsePagination,
} from "@tchil/business-codes/nextjs";
import { BusinessCode, HttpStatus } from "@tchil/business-codes";

// GET /api/users
export const GET = withErrorHandler(async (request) => {
  const { page, limit } = parsePagination(request);
  const { items, total } = await getUsers({ page, limit });

  return jsonPaginated(items, { page, limit, total });
});

// POST /api/users
export const POST = withErrorHandler(async (request) => {
  const body = await parseBody<CreateUserDto>(request);
  if (body.error) return body.error;

  const user = await createUser(body.data);
  return jsonCreated(user, "User created successfully");
});
```

```typescript
// app/api/users/[id]/route.ts
import { jsonSuccess, jsonNotFound } from "@tchil/business-codes/nextjs";
import { BusinessCode } from "@tchil/business-codes";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserById(params.id);

  if (!user) {
    return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
  }

  return jsonSuccess(user);
}
```

---

## 🌍 I18n (Internationalization)

Localized error messages with English and Vietnamese support, plus custom override capability.

### Setup Provider (One-time in Layout)

```tsx
// app/layout.tsx
import { BusinessMessageProvider } from "@tchil/business-codes/i18n/react";

export default function RootLayout({ children }) {
  const locale = "vi"; // or get from cookies/headers

  return (
    <BusinessMessageProvider locale={locale}>
      {children}
    </BusinessMessageProvider>
  );
}
```

### Use in Components

```tsx
// Any component - no need to pass locale!
import { useBusinessMessage } from "@tchil/business-codes/i18n/react";

function MyComponent() {
  const { getMessage, getResponseMessage } = useBusinessMessage();

  const handleApiError = (response) => {
    // Automatically uses configured locale
    toast.error(getResponseMessage(response));
    // Vietnamese: "Không tìm thấy người dùng"
    // English: "User not found"
  };

  // Or get message by code directly
  const message = getMessage(2001); // BusinessCode.USER_NOT_FOUND
}
```

### Custom Message Override

```tsx
<BusinessMessageProvider
  locale="vi"
  customMessages={{
    2001: "Tài khoản không tồn tại", // Override default Vietnamese
  }}
>
  {children}
</BusinessMessageProvider>
```

### Direct Usage (Without React)

```typescript
import {
  getLocalizedMessage,
  setLocale,
  registerMessages,
} from "@tchil/business-codes/i18n";

// Set global locale
setLocale("vi");

// Get localized message
getLocalizedMessage(2001); // "Không tìm thấy người dùng"
getLocalizedMessage(2001, "en"); // "User not found"

// Register custom messages
registerMessages("vi", {
  2001: "Người dùng không tồn tại",
});
```

---

## 📖 API Reference

### HTTP Status Codes

```typescript
import {
  HttpStatus,
  getHttpStatusMessage,
  isSuccessStatus,
} from "@tchil/business-codes";

HttpStatus.OK; // 200
HttpStatus.CREATED; // 201
HttpStatus.BAD_REQUEST; // 400
HttpStatus.UNAUTHORIZED; // 401
HttpStatus.FORBIDDEN; // 403
HttpStatus.NOT_FOUND; // 404
HttpStatus.INTERNAL_SERVER_ERROR; // 500

getHttpStatusMessage(404); // 'Not Found'
isSuccessStatus(200); // true
isClientError(404); // true
isServerError(500); // true
```

### Business Codes

```typescript
import { BusinessCode, getBusinessCodeMessage } from "@tchil/business-codes";

// Success (0-99)
BusinessCode.SUCCESS; // 0

// Auth errors (1xxx)
BusinessCode.AUTH_FAILED; // 1001
BusinessCode.TOKEN_EXPIRED; // 1002
BusinessCode.TOKEN_INVALID; // 1003

// User errors (2xxx)
BusinessCode.USER_NOT_FOUND; // 2001
BusinessCode.USER_ALREADY_EXISTS; // 2002

// Validation errors (3xxx)
BusinessCode.VALIDATION_ERROR; // 3001
BusinessCode.INVALID_INPUT; // 3002

// Resource errors (4xxx)
BusinessCode.RESOURCE_NOT_FOUND; // 4001

// Server errors (5xxx)
BusinessCode.INTERNAL_ERROR; // 5001
BusinessCode.DATABASE_ERROR; // 5002

// Business logic errors (7xxx)
BusinessCode.INSUFFICIENT_BALANCE; // 7002
BusinessCode.OUT_OF_STOCK; // 7006

getBusinessCodeMessage(BusinessCode.USER_NOT_FOUND); // 'User not found'
```

### ApiResponse Class

```typescript
import { ApiResponse } from '@tchil/business-codes';

// Factory methods
ApiResponse.success({ data, message?, statusCode?, meta? })
ApiResponse.error({ message?, code?, details?, statusCode? })
ApiResponse.paginated({ data, page, limit, total, message? })
ApiResponse.created(data, message?)
ApiResponse.noContent(message?)

// Shorthand error methods
ApiResponse.badRequest(message?, details?)
ApiResponse.unauthorized(message?, code?)
ApiResponse.forbidden(message?)
ApiResponse.notFound(message?, code?)
ApiResponse.conflict(message?, code?)
ApiResponse.validationError(details, message?)
ApiResponse.tooManyRequests(message?)
ApiResponse.internalError(message?)
```

### Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Success",
  "statusCode": 200
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "message": "Success",
  "statusCode": 200,
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}

// Error Response
{
  "success": false,
  "message": "User not found",
  "statusCode": 404,
  "error": {
    "code": 2001,
    "details": { ... }
  }
}
```

---

## 🔧 Advanced Configuration

### NestJS Exception Filter Options

```typescript
app.useGlobalFilters(
  new ApiExceptionFilter({
    includeStack: process.env.NODE_ENV === "development",
    logger: (error, context) => console.error(`[${context}]`, error),
  })
);
```

### NestJS Skip Interceptor

```typescript
import { SkipApiResponse } from '@tchil/business-codes/nestjs';

@Get('raw')
@SkipApiResponse()
getRawData() {
  return { raw: 'data' }; // Not wrapped in ApiResponse
}
```

---

## 📄 License

MIT
