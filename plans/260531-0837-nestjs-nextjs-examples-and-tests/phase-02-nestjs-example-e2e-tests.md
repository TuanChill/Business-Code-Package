---
phase: 2
title: "NestJS example + e2e tests"
status: pending
priority: P1
effort: "3-4h"
dependencies: [1]
---

# Phase 2: NestJS example + e2e tests

## Overview

Build a small but realistic NestJS app under `examples/nestjs/` (a Users feature) wired with `ApiResponseInterceptor`, `ApiExceptionFilter`, and the typed exceptions. Then prove it works with real HTTP e2e tests via `@nestjs/testing` + `supertest`.

## Requirements

- Functional: controller returns plain objects; interceptor wraps them into the `ApiResponse` envelope automatically.
- Functional: thrown `BusinessException` subclasses are converted by `ApiExceptionFilter` into the error envelope with the correct `statusCode` + `error.code`.
- Functional: `@SkipApiResponse()` + `ApiResponseInterceptorAdvanced` leaves a raw route unwrapped.
- Functional: NestJS `ValidationPipe` array errors are mapped into `{ error: { details: { errors: [...] } } }`.

## Architecture

```
examples/nestjs/
├── src/
│   ├── users/
│   │   ├── user.types.ts          # User interface, CreateUserDto
│   │   ├── users.service.ts       # in-memory store; throws NotFoundException/ConflictException
│   │   ├── users.controller.ts    # GET list (paginated), GET :id, POST, GET raw (@SkipApiResponse)
│   │   └── users.module.ts
│   ├── app.module.ts              # registers APP_INTERCEPTOR + APP_FILTER globally
│   └── main.ts                    # bootstrap (documented, not used by tests)
└── test/
    └── users.e2e-spec.ts
```

Wiring (the thing being demonstrated):

```ts
// app.module.ts
providers: [
  { provide: APP_INTERCEPTOR, useFactory: () => new ApiResponseInterceptorAdvanced() },
  { provide: APP_FILTER, useFactory: () => new ApiExceptionFilter() },
]
```

Use `ApiResponseInterceptorAdvanced` (not the basic one) so `@SkipApiResponse()` is honored — the basic `ApiResponseInterceptor` ignores the decorator.

## Related Code Files

- Create: `examples/nestjs/src/users/user.types.ts`
- Create: `examples/nestjs/src/users/users.service.ts`
- Create: `examples/nestjs/src/users/users.controller.ts`
- Create: `examples/nestjs/src/users/users.module.ts`
- Create: `examples/nestjs/src/app.module.ts`
- Create: `examples/nestjs/src/main.ts`
- Create: `examples/nestjs/test/users.e2e-spec.ts`
- Read for context: `src/nestjs/index.ts`, `src/nestjs/interceptor.ts`, `src/nestjs/exception-filter.ts`, `src/nestjs/exceptions.ts`, `src/response/api-response.ts`

## Implementation Steps

1. `user.types.ts`: `interface User { id: string; email: string; name: string }`, `interface CreateUserDto`. Keep DTO plain (validation behavior is demonstrated via a separate route using Nest's built-in `ValidationPipe`, or by documenting it — avoid adding `class-validator` unless trivially available; prefer a manual-throw `ValidationException` route to stay dependency-light).
2. `users.service.ts`: in-memory `Map`. `findById` throws `NotFoundException('User not found', BusinessCode.USER_NOT_FOUND)`. `create` throws `ConflictException('Email already exists', BusinessCode.EMAIL_ALREADY_EXISTS)` on dupe. `findAll(page, limit)` returns `{ items, total }`.
3. `users.controller.ts`:
   - `GET /users` → returns `ApiResponse.paginated(...)` directly (demonstrates `skipIfWrapped`).
   - `GET /users/:id` → returns the plain `User` (interceptor wraps → `success:true, statusCode:200`).
   - `POST /users` → `@HttpCode(201)`, returns created user (wrapped as 201).
   - `GET /users/raw/:id` → `@SkipApiResponse()`, returns plain object unwrapped.
   - `GET /users/boom` → throws `new ValidationException({ email: 'Invalid email' })` to exercise the filter's 422 path.
4. `app.module.ts` + `main.ts` per Architecture. `main.ts` imports `reflect-metadata` at top.
5. `users.e2e-spec.ts` using `Test.createTestingModule({ imports: [AppModule] }).compile()` → `app.init()`; `supertest(app.getHttpServer())`. Assertions:
   - `GET /users/:id` (exists) → 200, `body.success === true`, `body.data.id`, `body.message === 'Success'`.
   - `GET /users/:id` (missing) → 404, `body.success === false`, `body.error.code === BusinessCode.USER_NOT_FOUND`.
   - `GET /users` → 200, `body.meta.total/totalPages/hasNextPage` present.
   - `POST /users` (new) → 201, `body.statusCode === 201`; (dupe) → 409, `body.error.code === EMAIL_ALREADY_EXISTS`.
   - `GET /users/raw/:id` → 200, body is the **raw** object (no `success` key).
   - `GET /users/boom` → 422, `body.error.code === VALIDATION_ERROR`, `body.error.details.email`.
   - `afterAll(() => app.close())`.

## Success Criteria

- [ ] `npx jest examples/nestjs` passes all e2e cases above.
- [ ] Success responses carry the wrapped envelope; the `@SkipApiResponse()` route does not.
- [ ] Every thrown typed exception maps to the documented `statusCode` + `error.code`.
- [ ] No import from `examples/` leaks into `src/` (grep check).

## Risk Assessment

- **Risk:** `reflect-metadata` not imported → decorator metadata missing. *Mitigation:* import it once in the e2e spec setup (or `main.ts`); ts-jest respects `emitDecoratorMetadata` from root tsconfig.
- **Risk:** `ApiResponseInterceptorAdvanced` uses `Reflect.getMetadata` on the handler — confirm `@SkipApiResponse()` (a `SetMetadata`) is read correctly through the global interceptor. *Mitigation:* test asserts the raw route explicitly; if metadata isn't found through `APP_INTERCEPTOR`, fall back to applying the interceptor at controller level with `@UseInterceptors`.
- **Risk:** supertest version types. *Mitigation:* pinned in Phase 1.

## Security Considerations

- Example only; in-memory data, no secrets. `includeStack` left at default `false` so the filter never leaks stack traces — note this in the example comment.

## Next Steps

Independent of Phase 3; both consume the Phase 1 harness. Verified together in Phase 4.
