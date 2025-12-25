# Next.js Integration

Complete response helpers for Next.js App Router API routes.

## Table of Contents

- [Import](#import)
- [Success Responses](#success-responses)
- [Error Responses](#error-responses)
- [Utilities](#utilities)
- [Response Options](#response-options)
- [Complete CRUD Example](#complete-crud-example)
- [TypeScript Types](#typescript-types)

---

## Import

```typescript
import {
  // Success responses
  jsonSuccess,
  jsonCreated,
  jsonNoContent,
  jsonPaginated,

  // Error responses
  jsonError,
  jsonBadRequest,
  jsonUnauthorized,
  jsonForbidden,
  jsonNotFound,
  jsonConflict,
  jsonValidationError,
  jsonTooManyRequests,
  jsonInternalError,

  // Utilities
  withErrorHandler,
  parseBody,
  parsePagination,
} from "@tchil/business-codes/nextjs";

// Types
import type { NextResponseOptions } from "@tchil/business-codes/nextjs";
```

---

## Success Responses

### `jsonSuccess<T>(data, message?, options?)`

Return a 200 OK response.

```typescript
function jsonSuccess<T>(
  data: T,
  message?: string, // Default: "Success"
  options?: NextResponseOptions
): Response;
```

**Examples:**

```typescript
// Basic
return jsonSuccess({ id: 1, name: "John" });
// → 200 { success: true, data: {...}, message: "Success", statusCode: 200 }

// With message
return jsonSuccess(users, "Users retrieved successfully");

// With headers
return jsonSuccess(data, "Success", {
  headers: { "Cache-Control": "max-age=3600" },
});
```

---

### `jsonCreated<T>(data, message?, options?)`

Return a 201 Created response.

```typescript
function jsonCreated<T>(
  data: T,
  message?: string, // Default: "Resource created successfully"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
export async function POST(request: Request) {
  const body = await request.json();
  const user = await createUser(body);

  return jsonCreated(user, "User created successfully");
  // → 201 { success: true, data: {...}, message: "User created...", statusCode: 201 }
}
```

---

### `jsonNoContent(options?)`

Return a 204 No Content response (empty body).

```typescript
function jsonNoContent(options?: NextResponseOptions): Response;
```

**Example:**

```typescript
export async function DELETE(request: Request, { params }) {
  await deleteUser(params.id);
  return jsonNoContent();
  // → 204 (empty body)
}
```

---

### `jsonPaginated<T>(data, pagination, message?, options?)`

Return a paginated response with metadata.

```typescript
function jsonPaginated<T>(
  data: T[],
  pagination: {
    page: number;
    limit: number;
    total: number;
  },
  message?: string, // Default: "Success"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
export async function GET(request: Request) {
  const { page, limit } = parsePagination(request);
  const { items, total } = await getUsers({ page, limit });

  return jsonPaginated(items, { page, limit, total }, "Users retrieved");
  // → 200 {
  //   success: true,
  //   data: [...],
  //   message: "Users retrieved",
  //   statusCode: 200,
  //   meta: {
  //     page: 1,
  //     limit: 10,
  //     total: 95,
  //     totalPages: 10,
  //     hasNextPage: true,
  //     hasPreviousPage: false
  //   }
  // }
}
```

---

## Error Responses

### `jsonError(message, statusCode?, businessCode?, details?, options?)`

Generic error response with full control.

```typescript
function jsonError(
  message: string,
  statusCode?: number, // Default: 500
  businessCode?: number, // Default: INTERNAL_ERROR (5001)
  details?: Record<string, unknown>,
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
import { HttpStatus, BusinessCode } from "@tchil/business-codes";

return jsonError(
  "Custom error message",
  HttpStatus.BAD_REQUEST,
  BusinessCode.INVALID_INPUT,
  { field: "email", reason: "Invalid format" }
);
// → 400 { success: false, message: "...", error: { code: 3002, details: {...} } }
```

---

### Shorthand Error Methods

#### `jsonBadRequest(message?, details?, options?)`

400 Bad Request with INVALID_INPUT code.

```typescript
function jsonBadRequest(
  message?: string, // Default: "Bad request"
  details?: Record<string, unknown>,
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonBadRequest("Invalid request body");
// → 400 { success: false, error: { code: 3002 } }

return jsonBadRequest("Invalid data", { missing: ["email", "name"] });
// → 400 { success: false, error: { code: 3002, details: {...} } }
```

---

#### `jsonUnauthorized(message?, businessCode?, options?)`

401 Unauthorized with AUTH_FAILED code.

```typescript
function jsonUnauthorized(
  message?: string, // Default: "Unauthorized"
  businessCode?: number, // Default: AUTH_FAILED (1001)
  options?: NextResponseOptions
): Response;
```

**Examples:**

```typescript
return jsonUnauthorized();
// → 401 { success: false, error: { code: 1001 } }

return jsonUnauthorized("Token expired", BusinessCode.TOKEN_EXPIRED);
// → 401 { success: false, error: { code: 1002 } }
```

---

#### `jsonForbidden(message?, options?)`

403 Forbidden with PERMISSION_DENIED code.

```typescript
function jsonForbidden(
  message?: string, // Default: "Forbidden"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonForbidden("You do not have permission to access this resource");
// → 403 { success: false, error: { code: 1007 } }
```

---

#### `jsonNotFound(message?, businessCode?, options?)`

404 Not Found with RESOURCE_NOT_FOUND code.

```typescript
function jsonNotFound(
  message?: string, // Default: "Not found"
  businessCode?: number, // Default: RESOURCE_NOT_FOUND (4001)
  options?: NextResponseOptions
): Response;
```

**Examples:**

```typescript
return jsonNotFound();
// → 404 { success: false, error: { code: 4001 } }

return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
// → 404 { success: false, error: { code: 2001 } }
```

---

#### `jsonConflict(message?, businessCode?, options?)`

409 Conflict with RESOURCE_CONFLICT code.

```typescript
function jsonConflict(
  message?: string, // Default: "Conflict"
  businessCode?: number, // Default: RESOURCE_CONFLICT (4008)
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonConflict("Email already exists", BusinessCode.EMAIL_ALREADY_EXISTS);
// → 409 { success: false, error: { code: 2007 } }
```

---

#### `jsonValidationError(details, message?, options?)`

422 Unprocessable Entity with VALIDATION_ERROR code.

```typescript
function jsonValidationError(
  details: Record<string, unknown>, // Required: validation errors
  message?: string, // Default: "Validation failed"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonValidationError({
  email: "Must be a valid email",
  password: "Minimum 8 characters",
  age: "Must be a positive number",
});
// → 422 { success: false, error: { code: 3001, details: {...} } }
```

---

#### `jsonTooManyRequests(message?, options?)`

429 Too Many Requests with RATE_LIMIT_EXCEEDED code.

```typescript
function jsonTooManyRequests(
  message?: string, // Default: "Too many requests"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonTooManyRequests("Rate limit exceeded. Try again in 60 seconds.");
// → 429 { success: false, error: { code: 7015 } }
```

---

#### `jsonInternalError(message?, options?)`

500 Internal Server Error with INTERNAL_ERROR code.

```typescript
function jsonInternalError(
  message?: string, // Default: "Internal server error"
  options?: NextResponseOptions
): Response;
```

**Example:**

```typescript
return jsonInternalError("Something went wrong");
// → 500 { success: false, error: { code: 5001 } }
```

---

## Utilities

### `withErrorHandler(handler)`

Wrap route handler with automatic error catching.

```typescript
function withErrorHandler(
  handler: (request: Request, context?: unknown) => Promise<Response>
): (request: Request, context?: unknown) => Promise<Response>;
```

**Example:**

```typescript
export const GET = withErrorHandler(async (request) => {
  // Any thrown error is caught and returns 500
  const data = await riskyOperation();
  return jsonSuccess(data);
});

// Equivalent to:
export async function GET(request: Request) {
  try {
    const data = await riskyOperation();
    return jsonSuccess(data);
  } catch (error) {
    console.error("API Error:", error);
    if (error instanceof Error) {
      return jsonInternalError(error.message);
    }
    return jsonInternalError("An unexpected error occurred");
  }
}
```

**With context (dynamic routes):**

```typescript
export const GET = withErrorHandler(async (request, context) => {
  const { id } = (context as { params: { id: string } }).params;
  const user = await getUser(id);
  return jsonSuccess(user);
});
```

---

### `parseBody<T>(request)`

Parse JSON body with error handling.

```typescript
async function parseBody<T>(
  request: Request
): Promise<{ data: T; error?: never } | { data?: never; error: Response }>;
```

**Example:**

```typescript
export async function POST(request: Request) {
  const body = await parseBody<CreateUserDto>(request);

  // If invalid JSON, body.error contains 400 Bad Request response
  if (body.error) {
    return body.error;
  }

  // body.data is typed as CreateUserDto
  const user = await createUser(body.data);
  return jsonCreated(user);
}
```

**Type Safety:**

```typescript
interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

const body = await parseBody<CreateUserDto>(request);
if (body.error) return body.error;

// TypeScript knows these types
const { email, password, name } = body.data;
```

---

### `parsePagination(request, options?)`

Parse pagination params from URL search params.

```typescript
function parsePagination(
  request: Request,
  options?: {
    defaultPage?: number; // Default: 1
    defaultLimit?: number; // Default: 10
    maxLimit?: number; // Default: 100
  }
): { page: number; limit: number };
```

**Examples:**

```typescript
// URL: /api/users?page=2&limit=20
const { page, limit } = parsePagination(request);
// → { page: 2, limit: 20 }

// URL: /api/users (no params)
const { page, limit } = parsePagination(request);
// → { page: 1, limit: 10 }

// Custom defaults
const pagination = parsePagination(request, {
  defaultPage: 1,
  defaultLimit: 25,
  maxLimit: 50, // limit capped at 50
});
```

**Edge Cases:**

```typescript
// URL: /api/users?page=0&limit=200
const { page, limit } = parsePagination(request, { maxLimit: 100 });
// → { page: 1, limit: 100 }
// (page clamped to minimum 1, limit clamped to maxLimit)
```

---

## Response Options

All response functions accept optional `NextResponseOptions`:

```typescript
interface NextResponseOptions {
  /** HTTP headers to include in response */
  headers?: Record<string, string> | Headers;

  /** Response status text */
  statusText?: string;
}
```

**Example:**

```typescript
return jsonSuccess(data, "Success", {
  headers: {
    "X-Custom-Header": "value",
    "Cache-Control": "no-cache, no-store",
    "X-Request-Id": requestId,
  },
  statusText: "OK",
});
```

---

## Complete CRUD Example

```typescript
// app/api/users/route.ts
import {
  jsonSuccess,
  jsonCreated,
  jsonPaginated,
  jsonValidationError,
  withErrorHandler,
  parseBody,
  parsePagination,
} from "@tchil/business-codes/nextjs";

// GET /api/users
export const GET = withErrorHandler(async (request) => {
  const { page, limit } = parsePagination(request, { defaultLimit: 20 });
  const { items, total } = await userService.findAll({ page, limit });

  return jsonPaginated(items, { page, limit, total });
});

// POST /api/users
export const POST = withErrorHandler(async (request) => {
  const body = await parseBody<CreateUserDto>(request);
  if (body.error) return body.error;

  // Validate
  const errors = await validateUser(body.data);
  if (Object.keys(errors).length > 0) {
    return jsonValidationError(errors);
  }

  const user = await userService.create(body.data);
  return jsonCreated(user, "User created successfully");
});
```

```typescript
// app/api/users/[id]/route.ts
import {
  jsonSuccess,
  jsonNotFound,
  jsonNoContent,
  withErrorHandler,
  parseBody,
} from "@tchil/business-codes/nextjs";
import { BusinessCode } from "@tchil/business-codes";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/users/:id
export const GET = withErrorHandler(async (request: Request, context) => {
  const { id } = await (context as RouteContext).params;
  const user = await userService.findById(id);

  if (!user) {
    return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
  }

  return jsonSuccess(user);
});

// PATCH /api/users/:id
export const PATCH = withErrorHandler(async (request: Request, context) => {
  const { id } = await (context as RouteContext).params;
  const body = await parseBody<UpdateUserDto>(request);
  if (body.error) return body.error;

  const user = await userService.update(id, body.data);

  if (!user) {
    return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
  }

  return jsonSuccess(user, "User updated successfully");
});

// DELETE /api/users/:id
export const DELETE = withErrorHandler(async (request: Request, context) => {
  const { id } = await (context as RouteContext).params;
  const deleted = await userService.delete(id);

  if (!deleted) {
    return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
  }

  return jsonNoContent();
});
```

---

## TypeScript Types

```typescript
import type { NextResponseOptions } from "@tchil/business-codes/nextjs";
```
