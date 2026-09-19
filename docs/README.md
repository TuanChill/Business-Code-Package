# @tuanchill/business-codes Documentation

Comprehensive documentation for the TypeScript library providing HTTP status codes, business error codes, and standardized API responses.

## 📚 Table of Contents

| Document                                | Description                                   |
| --------------------------------------- | --------------------------------------------- |
| [Getting Started](./getting-started.md) | Installation, setup, and quick start guide    |
| [HTTP Status Codes](./http-status.md)   | All HTTP status codes and helper functions    |
| [Business Codes](./business-codes.md)   | Business error codes by category              |
| [ApiResponse](./api-response.md)        | Standardized response format class            |
| [NestJS Integration](./nestjs.md)       | Exception filter, interceptor, and exceptions |
| [Next.js Integration](./nextjs.md)      | Response helpers for App Router               |
| [I18n Support](./i18n.md)               | Internationalization with React Provider      |

## 🎯 Overview

This library provides a complete solution for handling API responses and error codes in TypeScript applications:

```
@tuanchill/business-codes
├── Core
│   ├── HttpStatus        - HTTP status codes (200, 404, 500, etc.)
│   ├── BusinessCode      - Business error codes (1001, 2001, etc.)
│   └── ApiResponse       - Standardized response format
├── Integrations
│   ├── /nestjs           - NestJS-specific utilities
│   └── /nextjs           - Next.js-specific utilities
└── I18n
    ├── /i18n             - Core i18n functions
    └── /i18n/react       - React Provider & hooks
```

## 📦 Package Exports

```typescript
// Main exports
import { HttpStatus, BusinessCode, ApiResponse } from "@tuanchill/business-codes";

// NestJS integration
import {
  ApiExceptionFilter,
  BusinessException,
} from "@tuanchill/business-codes/nestjs";

// Next.js integration
import { jsonSuccess, jsonError } from "@tuanchill/business-codes/nextjs";

// I18n
import { getLocalizedMessage, setLocale } from "@tuanchill/business-codes/i18n";
import {
  BusinessMessageProvider,
  useBusinessMessage,
} from "@tuanchill/business-codes/i18n/react";
```
