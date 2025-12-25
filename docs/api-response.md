# ApiResponse Class

Standardized response format for all API responses.

## Import

```typescript
import { ApiResponse } from "@tchil/business-codes";
```

---

## Response Structure

### Success Response

```typescript
{
  success: true,
  data: T,
  message: string,
  statusCode: number,
  meta?: PaginationMeta
}
```

### Error Response

```typescript
{
  success: false,
  message: string,
  statusCode: number,
  error: {
    code: number,       // Business code
    details?: object    // Additional error details
  }
}
```

### Paginated Response

```typescript
{
  success: true,
  data: T[],
  message: string,
  statusCode: number,
  meta: {
    page: number,
    limit: number,
    total: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

---

## Factory Methods

### `ApiResponse.success(params)`

Create a success response.

```typescript
interface SuccessParams<T> {
  data?: T;
  message?: string; // Default: "Success"
  statusCode?: number; // Default: 200
  meta?: PaginationMeta;
}
```

**Examples:**

```typescript
// Simple success
ApiResponse.success({ data: { id: 1, name: "John" } });
// {
//   success: true,
//   data: { id: 1, name: 'John' },
//   message: 'Success',
//   statusCode: 200
// }

// With custom message
ApiResponse.success({
  data: user,
  message: "User retrieved successfully",
});
```

---

### `ApiResponse.error(params)`

Create an error response.

```typescript
interface ErrorParams {
  message?: string; // Default: "Error"
  code?: number; // Default: INTERNAL_ERROR (5001)
  statusCode?: number; // Default: 500
  details?: Record<string, unknown>; // Validation errors, etc.
}
```

**Examples:**

```typescript
// Simple error
ApiResponse.error({ message: "Something went wrong" });

// With business code
ApiResponse.error({
  message: "User not found",
  code: BusinessCode.USER_NOT_FOUND,
  statusCode: HttpStatus.NOT_FOUND,
});

// With validation details
ApiResponse.error({
  message: "Validation failed",
  code: BusinessCode.VALIDATION_ERROR,
  details: {
    email: "Invalid email format",
    age: "Must be a positive number",
  },
});
```

---

### `ApiResponse.paginated(params)`

Create a paginated response with metadata.

```typescript
interface PaginatedParams<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  message?: string;
  statusCode?: number;
}
```

**Example:**

```typescript
const result = await userService.findAll({ page: 2, limit: 10 });

ApiResponse.paginated({
  data: result.items,
  page: 2,
  limit: 10,
  total: 95,
});
// {
//   success: true,
//   data: [...],
//   message: 'Success',
//   statusCode: 200,
//   meta: {
//     page: 2,
//     limit: 10,
//     total: 95,
//     totalPages: 10,
//     hasNextPage: true,
//     hasPreviousPage: true
//   }
// }
```

---

### `ApiResponse.created(data, message?)`

Shorthand for 201 Created response.

```typescript
ApiResponse.created(newUser, "User created successfully");
// {
//   success: true,
//   data: { ... },
//   message: 'User created successfully',
//   statusCode: 201
// }
```

---

### `ApiResponse.noContent(message?)`

Shorthand for 204 No Content response.

```typescript
ApiResponse.noContent("Resource deleted");
// {
//   success: true,
//   message: 'Resource deleted',
//   statusCode: 204
// }
```

---

## Shorthand Error Methods

| Method                               | HTTP Code | Business Code       |
| ------------------------------------ | --------- | ------------------- |
| `badRequest(message?, details?)`     | 400       | INVALID_INPUT       |
| `unauthorized(message?, code?)`      | 401       | AUTH_FAILED         |
| `forbidden(message?)`                | 403       | PERMISSION_DENIED   |
| `notFound(message?, code?)`          | 404       | RESOURCE_NOT_FOUND  |
| `conflict(message?, code?)`          | 409       | RESOURCE_CONFLICT   |
| `validationError(details, message?)` | 422       | VALIDATION_ERROR    |
| `tooManyRequests(message?)`          | 429       | RATE_LIMIT_EXCEEDED |
| `internalError(message?)`            | 500       | INTERNAL_ERROR      |

**Examples:**

```typescript
// 400 Bad Request
ApiResponse.badRequest("Invalid request body");

// 401 Unauthorized
ApiResponse.unauthorized("Please log in", BusinessCode.TOKEN_EXPIRED);

// 403 Forbidden
ApiResponse.forbidden("You do not have permission");

// 404 Not Found
ApiResponse.notFound("User not found", BusinessCode.USER_NOT_FOUND);

// 409 Conflict
ApiResponse.conflict("Email already exists", BusinessCode.EMAIL_ALREADY_EXISTS);

// 422 Validation Error
ApiResponse.validationError({
  email: "Required field",
  password: "Must be at least 8 characters",
});

// 429 Too Many Requests
ApiResponse.tooManyRequests("Please wait before trying again");

// 500 Internal Error
ApiResponse.internalError("An unexpected error occurred");
```

---

## Instance Methods

### `toJSON()`

Convert response to plain object for serialization.

```typescript
const response = ApiResponse.success({ data: user });
const json = response.toJSON();
// Returns plain object without class methods
```

---

## TypeScript Types

```typescript
import type {
  PaginationMeta,
  ErrorDetails,
  SuccessParams,
  PaginatedParams,
  ErrorParams,
  ApiResponseParams,
} from "@tchil/business-codes";
```
