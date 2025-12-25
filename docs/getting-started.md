# Getting Started

## Installation

```bash
# npm
npm install @tchil/business-codes

# yarn
yarn add @tchil/business-codes

# pnpm
pnpm add @tchil/business-codes
```

## Requirements

- Node.js >= 16.0.0
- TypeScript >= 5.0 (recommended)

### Optional Peer Dependencies

| Package           | Required for        |
| ----------------- | ------------------- |
| `@nestjs/common`  | NestJS integration  |
| `@nestjs/core`    | NestJS integration  |
| `react` >= 17.0.0 | I18n React Provider |

---

## Quick Start

### 1. Basic Usage

```typescript
import { HttpStatus, BusinessCode, ApiResponse } from "@tchil/business-codes";

// Create success response
const response = ApiResponse.success({
  data: { id: 1, name: "John Doe" },
  message: "User retrieved successfully",
});
// Output:
// {
//   success: true,
//   data: { id: 1, name: 'John Doe' },
//   message: 'User retrieved successfully',
//   statusCode: 200
// }

// Create error response
const errorResponse = ApiResponse.error({
  message: "User not found",
  code: BusinessCode.USER_NOT_FOUND,
  statusCode: HttpStatus.NOT_FOUND,
});
// Output:
// {
//   success: false,
//   message: 'User not found',
//   statusCode: 404,
//   error: { code: 2001 }
// }
```

### 2. NestJS Setup

```typescript
// main.ts
import { NestFactory } from "@nestjs/core";
import {
  ApiExceptionFilter,
  ApiResponseInterceptor,
} from "@tchil/business-codes/nestjs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global exception filter - converts all exceptions to ApiResponse
  app.useGlobalFilters(new ApiExceptionFilter());

  // Global interceptor - wraps all responses in ApiResponse
  app.useGlobalInterceptors(new ApiResponseInterceptor());

  await app.listen(3000);
}
```

### 3. Next.js Setup

```typescript
// app/api/users/route.ts
import {
  jsonSuccess,
  jsonNotFound,
  withErrorHandler,
} from "@tchil/business-codes/nextjs";
import { BusinessCode } from "@tchil/business-codes";

export const GET = withErrorHandler(async (request) => {
  const user = await findUser();

  if (!user) {
    return jsonNotFound("User not found", BusinessCode.USER_NOT_FOUND);
  }

  return jsonSuccess(user);
});
```

### 4. I18n Setup (Next.js)

```tsx
// app/layout.tsx
import { BusinessMessageProvider } from "@tchil/business-codes/i18n/react";

export default function RootLayout({ children }) {
  return (
    <BusinessMessageProvider locale="vi">{children}</BusinessMessageProvider>
  );
}

// Any component
import { useBusinessMessage } from "@tchil/business-codes/i18n/react";

function MyComponent() {
  const { getResponseMessage } = useBusinessMessage();

  // Automatically uses Vietnamese locale from provider
  toast.error(getResponseMessage(apiResponse));
}
```

---

## TypeScript Configuration

This library is written in TypeScript and provides full type definitions. No additional `@types` package is needed.

```json
// tsconfig.json (recommended settings)
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

---

## Next Steps

- [HTTP Status Codes](./http-status.md) - Learn about available status codes
- [Business Codes](./business-codes.md) - Understand error code categories
- [ApiResponse](./api-response.md) - Master the response format
