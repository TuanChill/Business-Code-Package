# HTTP Status Codes

Complete reference for all HTTP status codes available in the library.

## Import

```typescript
import {
  HttpStatus,
  getHttpStatusMessage,
  isSuccessStatus,
  isClientError,
  isServerError,
  isRedirect,
} from "@tchil/business-codes";
```

---

## Status Code Reference

### 1xx Informational

| Constant              | Code | Description                         |
| --------------------- | ---- | ----------------------------------- |
| `CONTINUE`            | 100  | Server has received request headers |
| `SWITCHING_PROTOCOLS` | 101  | Server is switching protocols       |
| `PROCESSING`          | 102  | Server is processing the request    |

### 2xx Success

| Constant                        | Code | Description                     |
| ------------------------------- | ---- | ------------------------------- |
| `OK`                            | 200  | Request succeeded               |
| `CREATED`                       | 201  | Resource created successfully   |
| `ACCEPTED`                      | 202  | Request accepted for processing |
| `NON_AUTHORITATIVE_INFORMATION` | 203  | Payload has been modified       |
| `NO_CONTENT`                    | 204  | No content to return            |
| `RESET_CONTENT`                 | 205  | Reset the document view         |
| `PARTIAL_CONTENT`               | 206  | Partial resource delivered      |

### 3xx Redirection

| Constant             | Code | Description                |
| -------------------- | ---- | -------------------------- |
| `MULTIPLE_CHOICES`   | 300  | Multiple options available |
| `MOVED_PERMANENTLY`  | 301  | URL changed permanently    |
| `FOUND`              | 302  | URL changed temporarily    |
| `SEE_OTHER`          | 303  | Response at another URI    |
| `NOT_MODIFIED`       | 304  | Resource not modified      |
| `TEMPORARY_REDIRECT` | 307  | Temporary redirect         |
| `PERMANENT_REDIRECT` | 308  | Permanent redirect         |

### 4xx Client Errors

| Constant                          | Code | Description                  |
| --------------------------------- | ---- | ---------------------------- |
| `BAD_REQUEST`                     | 400  | Invalid request syntax       |
| `UNAUTHORIZED`                    | 401  | Authentication required      |
| `PAYMENT_REQUIRED`                | 402  | Payment required             |
| `FORBIDDEN`                       | 403  | No permission                |
| `NOT_FOUND`                       | 404  | Resource not found           |
| `METHOD_NOT_ALLOWED`              | 405  | Method not supported         |
| `NOT_ACCEPTABLE`                  | 406  | No acceptable content        |
| `PROXY_AUTHENTICATION_REQUIRED`   | 407  | Proxy auth required          |
| `REQUEST_TIMEOUT`                 | 408  | Request timed out            |
| `CONFLICT`                        | 409  | Request conflict             |
| `GONE`                            | 410  | Resource no longer available |
| `LENGTH_REQUIRED`                 | 411  | Content-Length required      |
| `PRECONDITION_FAILED`             | 412  | Precondition not met         |
| `PAYLOAD_TOO_LARGE`               | 413  | Request too large            |
| `URI_TOO_LONG`                    | 414  | URI too long                 |
| `UNSUPPORTED_MEDIA_TYPE`          | 415  | Media type not supported     |
| `RANGE_NOT_SATISFIABLE`           | 416  | Range not satisfiable        |
| `EXPECTATION_FAILED`              | 417  | Expectation not met          |
| `I_AM_A_TEAPOT`                   | 418  | I'm a teapot 🫖              |
| `UNPROCESSABLE_ENTITY`            | 422  | Semantic errors              |
| `LOCKED`                          | 423  | Resource locked              |
| `FAILED_DEPENDENCY`               | 424  | Dependency failed            |
| `TOO_EARLY`                       | 425  | Too early                    |
| `UPGRADE_REQUIRED`                | 426  | Upgrade required             |
| `PRECONDITION_REQUIRED`           | 428  | Precondition required        |
| `TOO_MANY_REQUESTS`               | 429  | Rate limit exceeded          |
| `REQUEST_HEADER_FIELDS_TOO_LARGE` | 431  | Headers too large            |
| `UNAVAILABLE_FOR_LEGAL_REASONS`   | 451  | Legal restriction            |

### 5xx Server Errors

| Constant                          | Code | Description                |
| --------------------------------- | ---- | -------------------------- |
| `INTERNAL_SERVER_ERROR`           | 500  | Server error               |
| `NOT_IMPLEMENTED`                 | 501  | Not implemented            |
| `BAD_GATEWAY`                     | 502  | Bad gateway                |
| `SERVICE_UNAVAILABLE`             | 503  | Service unavailable        |
| `GATEWAY_TIMEOUT`                 | 504  | Gateway timeout            |
| `HTTP_VERSION_NOT_SUPPORTED`      | 505  | HTTP version not supported |
| `VARIANT_ALSO_NEGOTIATES`         | 506  | Circular reference         |
| `INSUFFICIENT_STORAGE`            | 507  | Insufficient storage       |
| `LOOP_DETECTED`                   | 508  | Infinite loop detected     |
| `NOT_EXTENDED`                    | 510  | Extension required         |
| `NETWORK_AUTHENTICATION_REQUIRED` | 511  | Network auth required      |

---

## Helper Functions

### `getHttpStatusMessage(statusCode)`

Get human-readable message for a status code.

```typescript
getHttpStatusMessage(200); // "OK"
getHttpStatusMessage(404); // "Not Found"
getHttpStatusMessage(500); // "Internal Server Error"
getHttpStatusMessage(999); // "Unknown Status"
```

### `isSuccessStatus(statusCode)`

Check if status code is a success (2xx).

```typescript
isSuccessStatus(200); // true
isSuccessStatus(201); // true
isSuccessStatus(404); // false
```

### `isClientError(statusCode)`

Check if status code is a client error (4xx).

```typescript
isClientError(400); // true
isClientError(404); // true
isClientError(500); // false
```

### `isServerError(statusCode)`

Check if status code is a server error (5xx).

```typescript
isServerError(500); // true
isServerError(503); // true
isServerError(404); // false
```

### `isRedirect(statusCode)`

Check if status code is a redirect (3xx).

```typescript
isRedirect(301); // true
isRedirect(307); // true
isRedirect(200); // false
```

---

## Type: `HttpStatusCode`

TypeScript type for all valid HTTP status codes.

```typescript
import type { HttpStatusCode } from "@tchil/business-codes";

function handleResponse(status: HttpStatusCode) {
  // TypeScript knows status is a valid HTTP code
}
```

---

## Usage Examples

### Express

```typescript
import { HttpStatus } from "@tchil/business-codes";

app.get("/users/:id", async (req, res) => {
  const user = await findUser(req.params.id);

  if (!user) {
    return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
  }

  res.status(HttpStatus.OK).json(user);
});
```

### NestJS

```typescript
import { HttpStatus } from "@tchil/business-codes";
import { HttpException } from "@nestjs/common";

throw new HttpException("User not found", HttpStatus.NOT_FOUND);
```

### Next.js

```typescript
import { HttpStatus } from "@tchil/business-codes";

return new Response(JSON.stringify({ error: "Not found" }), {
  status: HttpStatus.NOT_FOUND,
});
```
