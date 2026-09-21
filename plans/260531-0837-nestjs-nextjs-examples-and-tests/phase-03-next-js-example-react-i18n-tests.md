---
phase: 3
title: "Next.js example + React i18n + tests"
status: pending
priority: P1
effort: "3-4h"
dependencies: [1]
---

# Phase 3: Next.js example + React i18n + tests

## Overview

Build App Router-style route handlers under `examples/nextjs/` that use the `json*` helpers, `withErrorHandler`, `parseBody`, and `parsePagination`. Add a React component that uses `BusinessMessageProvider` + `useBusinessMessage`. Test both the route handlers (node env) and the React hook/provider (jsdom env).

## Requirements

- Functional: route handlers return standard Web `Response` with the correct status code and `ApiResponse` envelope body.
- Functional: `withErrorHandler` catches thrown errors and returns a 500 envelope.
- Functional: `parseBody` returns `{ error }` on invalid JSON.
- Functional: `parsePagination` reads `?page=&limit=` from the URL with defaults and clamping.
- Functional: `BusinessMessageProvider` + `useBusinessMessage` resolve localized messages for business codes in both `en` and `vi`.
- Non-functional: no `next` package required — helpers use only the Web `Response` API.

## Architecture

```
examples/nextjs/
├── src/
│   ├── app/api/users/
│   │   └── route.ts          # GET (paginated), POST (create)
│   ├── app/api/users/[id]/
│   │   └── route.ts          # GET :id, DELETE :id
│   ├── app/api/error-demo/
│   │   └── route.ts          # withErrorHandler wrapping a throwing handler
│   └── components/
│       └── UserErrorMessage.tsx   # useBusinessMessage consumer
└── test/
    ├── routes.spec.ts         # node env — all route handler assertions
    └── i18n-react.spec.tsx    # jsdom env — BusinessMessageProvider + hook
```

Route handlers are plain async functions that accept a Web `Request` and return `Response`. Tests call them directly — no HTTP server needed.

## Related Code Files

- Create: `examples/nextjs/src/app/api/users/route.ts`
- Create: `examples/nextjs/src/app/api/users/[id]/route.ts`
- Create: `examples/nextjs/src/app/api/error-demo/route.ts`
- Create: `examples/nextjs/src/components/UserErrorMessage.tsx`
- Create: `examples/nextjs/test/routes.spec.ts`
- Create: `examples/nextjs/test/i18n-react.spec.tsx`
- Read for context: `src/nextjs/helpers.ts`, `src/i18n/react/BusinessMessageProvider.tsx`, `src/i18n/types.ts`

## Implementation Steps

1. **`app/api/users/route.ts`**
   - `GET`: call `parsePagination(request)`, return `jsonPaginated(items, { page, limit, total })`.
   - `POST`: use `parseBody<CreateUserDto>(request)`; if `body.error` return it; else return `jsonCreated(newUser)`.

2. **`app/api/users/[id]/route.ts`**
   - `GET`: find user by id; if missing return `jsonNotFound('User not found', BusinessCode.USER_NOT_FOUND)`; else `jsonSuccess(user)`.
   - `DELETE`: return `jsonNoContent()` (204, null body).

3. **`app/api/error-demo/route.ts`**
   ```ts
   export const GET = withErrorHandler(async (_req) => {
     throw new Error('Something exploded');
   });
   ```

4. **`UserErrorMessage.tsx`**: a client component that receives an `ApiResponse` prop and renders `getResponseMessage(response)` using `useBusinessMessage`. Demonstrates the hook in a real component.

5. **`test/routes.spec.ts`** (node env) — import handlers directly, call with `new Request(url, opts)`:
   - `GET /users` → 200, `body.success`, `body.meta.page/limit/total/totalPages`.
   - `GET /users` with `?page=2&limit=5` → `body.meta.page === 2`, `body.meta.limit === 5`.
   - `POST /users` valid body → 201, `body.statusCode === 201`, `body.data`.
   - `POST /users` invalid JSON → 400, `body.success === false`, `body.error.code === BusinessCode.INVALID_INPUT`.
   - `GET /users/:id` found → 200, `body.data.id`.
   - `GET /users/:id` not found → 404, `body.error.code === BusinessCode.RESOURCE_NOT_FOUND`.
   - `DELETE /users/:id` → 204, null body.
   - `GET /error-demo` → 500, `body.success === false`, `body.error.code === BusinessCode.INTERNAL_ERROR`.

6. **`test/i18n-react.spec.tsx`** (jsdom env, `@testing-library/react`):
   - Render `<BusinessMessageProvider locale="en"><TestChild /></BusinessMessageProvider>` where `TestChild` calls `useBusinessMessage()`.
   - Assert `getMessage(0)` returns the English success message.
   - Assert `getMessage(2001)` returns the English user-not-found message.
   - Re-render with `locale="vi"`, assert `getMessage(2001)` returns the Vietnamese string.
   - Assert `getResponseMessage({ success: false, error: { code: 2001 } })` returns the localized message.
   - Assert `getResponseMessage({ success: true, message: 'Done' })` returns `'Done'`.
   - Assert `useBusinessMessage()` outside provider throws the expected error.

## Success Criteria

- [ ] `npx jest examples/nextjs` passes all route handler and React i18n assertions.
- [ ] Route handlers never import from `next/server` — only `@tchil/business-codes/nextjs` and `@tchil/business-codes`.
- [ ] `DELETE` returns 204 with null body (not an empty JSON object).
- [ ] `withErrorHandler` catches thrown `Error` and returns 500 envelope.
- [ ] `BusinessMessageProvider` locale switch changes the resolved message.
- [ ] `useBusinessMessage()` outside provider throws.

## Risk Assessment

- **Risk:** jsdom doesn't have `Response`/`Request` globals needed by route handler tests. *Mitigation:* route handler tests run in the **node** project (not jsdom); only `i18n-react.spec.tsx` runs in jsdom. The multi-project config in Phase 1 separates them.
- **Risk:** `@testing-library/react` render requires `act` wrapping for state updates. *Mitigation:* use `renderHook` from `@testing-library/react` v14+ which wraps automatically.
- **Risk:** `"use client"` directive in `BusinessMessageProvider.tsx` — ts-jest transpiles it fine but the directive is a string expression, not a syntax error. No action needed.

## Security Considerations

Example only; no real data or secrets. `withErrorHandler` logs to `console.error` (existing library behavior) — acceptable in examples.

## Next Steps

Independent of Phase 2. Both verified together in Phase 4.
