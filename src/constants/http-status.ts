/**
 * HTTP Status Codes
 *
 * Standard HTTP response status codes as defined by RFC 7231 and RFC 6585.
 * Use these constants instead of magic numbers for better code readability.
 *
 * @example
 * ```typescript
 * import { HttpStatus } from '@tchil/business-codes';
 *
 * res.status(HttpStatus.OK).json({ message: 'Success' });
 * ```
 */
export const HttpStatus = {
  // ==========================================
  // 1xx Informational
  // ==========================================
  /** 100 - The server has received the request headers */
  CONTINUE: 100,
  /** 101 - The requester has asked the server to switch protocols */
  SWITCHING_PROTOCOLS: 101,
  /** 102 - The server is processing the request (WebDAV) */
  PROCESSING: 102,

  // ==========================================
  // 2xx Success
  // ==========================================
  /** 200 - The request has succeeded */
  OK: 200,
  /** 201 - The request has been fulfilled and a new resource has been created */
  CREATED: 201,
  /** 202 - The request has been accepted for processing, but processing has not been completed */
  ACCEPTED: 202,
  /** 203 - The request was successful but the enclosed payload has been modified */
  NON_AUTHORITATIVE_INFORMATION: 203,
  /** 204 - The server successfully processed the request and is not returning any content */
  NO_CONTENT: 204,
  /** 205 - The server successfully processed the request and is not returning any content */
  RESET_CONTENT: 205,
  /** 206 - The server is delivering only part of the resource due to a range header */
  PARTIAL_CONTENT: 206,

  // ==========================================
  // 3xx Redirection
  // ==========================================
  /** 300 - Indicates multiple options for the resource */
  MULTIPLE_CHOICES: 300,
  /** 301 - The URL of the requested resource has been changed permanently */
  MOVED_PERMANENTLY: 301,
  /** 302 - The URI of the requested resource has been changed temporarily */
  FOUND: 302,
  /** 303 - The response to the request can be found under another URI */
  SEE_OTHER: 303,
  /** 304 - The resource has not been modified since the version specified by the request headers */
  NOT_MODIFIED: 304,
  /** 307 - The request should be repeated with another URI but future requests should use the original URI */
  TEMPORARY_REDIRECT: 307,
  /** 308 - The request and all future requests should be repeated using another URI */
  PERMANENT_REDIRECT: 308,

  // ==========================================
  // 4xx Client Errors
  // ==========================================
  /** 400 - The server cannot process the request due to a client error */
  BAD_REQUEST: 400,
  /** 401 - Authentication is required and has failed or has not been provided */
  UNAUTHORIZED: 401,
  /** 402 - Reserved for future use (Digital cash/micropayment) */
  PAYMENT_REQUIRED: 402,
  /** 403 - The client does not have permission to access the requested resource */
  FORBIDDEN: 403,
  /** 404 - The requested resource could not be found */
  NOT_FOUND: 404,
  /** 405 - The request method is not supported for the requested resource */
  METHOD_NOT_ALLOWED: 405,
  /** 406 - The requested resource cannot generate content acceptable according to Accept headers */
  NOT_ACCEPTABLE: 406,
  /** 407 - The client must first authenticate itself with the proxy */
  PROXY_AUTHENTICATION_REQUIRED: 407,
  /** 408 - The server timed out waiting for the request */
  REQUEST_TIMEOUT: 408,
  /** 409 - The request could not be processed because of conflict in the current state */
  CONFLICT: 409,
  /** 410 - The requested resource is no longer available and will not be available again */
  GONE: 410,
  /** 411 - The request did not specify the length of its content */
  LENGTH_REQUIRED: 411,
  /** 412 - The server does not meet one of the preconditions specified in the request */
  PRECONDITION_FAILED: 412,
  /** 413 - The request is larger than the server is willing or able to process */
  PAYLOAD_TOO_LARGE: 413,
  /** 414 - The URI provided was too long for the server to process */
  URI_TOO_LONG: 414,
  /** 415 - The request entity has a media type which the server does not support */
  UNSUPPORTED_MEDIA_TYPE: 415,
  /** 416 - The client has asked for a portion of the file that the server cannot supply */
  RANGE_NOT_SATISFIABLE: 416,
  /** 417 - The server cannot meet the requirements of the Expect request-header field */
  EXPECTATION_FAILED: 417,
  /** 418 - I'm a teapot (RFC 2324) */
  I_AM_A_TEAPOT: 418,
  /** 422 - The request was well-formed but unable to be followed due to semantic errors */
  UNPROCESSABLE_ENTITY: 422,
  /** 423 - The resource that is being accessed is locked */
  LOCKED: 423,
  /** 424 - The request failed because it depended on another request that failed */
  FAILED_DEPENDENCY: 424,
  /** 425 - The server is unwilling to risk processing a request that might be replayed */
  TOO_EARLY: 425,
  /** 426 - The client should switch to a different protocol */
  UPGRADE_REQUIRED: 426,
  /** 428 - The origin server requires the request to be conditional */
  PRECONDITION_REQUIRED: 428,
  /** 429 - The user has sent too many requests in a given amount of time */
  TOO_MANY_REQUESTS: 429,
  /** 431 - The server is unwilling to process the request because headers are too large */
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  /** 451 - The resource is unavailable for legal reasons */
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,

  // ==========================================
  // 5xx Server Errors
  // ==========================================
  /** 500 - A generic error message when an unexpected condition was encountered */
  INTERNAL_SERVER_ERROR: 500,
  /** 501 - The server does not recognize the request method or lacks the ability to fulfill it */
  NOT_IMPLEMENTED: 501,
  /** 502 - The server received an invalid response from the upstream server */
  BAD_GATEWAY: 502,
  /** 503 - The server is currently unavailable (overloaded or down for maintenance) */
  SERVICE_UNAVAILABLE: 503,
  /** 504 - The gateway did not receive a timely response from the upstream server */
  GATEWAY_TIMEOUT: 504,
  /** 505 - The server does not support the HTTP protocol version used in the request */
  HTTP_VERSION_NOT_SUPPORTED: 505,
  /** 506 - Transparent content negotiation for the request results in a circular reference */
  VARIANT_ALSO_NEGOTIATES: 506,
  /** 507 - The server is unable to store the representation needed to complete the request */
  INSUFFICIENT_STORAGE: 507,
  /** 508 - The server detected an infinite loop while processing the request */
  LOOP_DETECTED: 508,
  /** 510 - Further extensions to the request are required for the server to fulfill it */
  NOT_EXTENDED: 510,
  /** 511 - The client needs to authenticate to gain network access */
  NETWORK_AUTHENTICATION_REQUIRED: 511,
} as const;

/**
 * Type representing all valid HTTP status code values
 */
export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

/**
 * Get HTTP status message by status code
 *
 * @param statusCode - The HTTP status code
 * @returns The human-readable status message
 *
 * @example
 * ```typescript
 * getHttpStatusMessage(200); // 'OK'
 * getHttpStatusMessage(404); // 'Not Found'
 * ```
 */
export function getHttpStatusMessage(statusCode: number): string {
  const messages: Record<number, string> = {
    100: 'Continue',
    101: 'Switching Protocols',
    102: 'Processing',
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    307: 'Temporary Redirect',
    308: 'Permanent Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Payload Too Large',
    414: 'URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Range Not Satisfiable',
    417: 'Expectation Failed',
    418: "I'm a Teapot",
    422: 'Unprocessable Entity',
    423: 'Locked',
    424: 'Failed Dependency',
    425: 'Too Early',
    426: 'Upgrade Required',
    428: 'Precondition Required',
    429: 'Too Many Requests',
    431: 'Request Header Fields Too Large',
    451: 'Unavailable For Legal Reasons',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported',
    506: 'Variant Also Negotiates',
    507: 'Insufficient Storage',
    508: 'Loop Detected',
    510: 'Not Extended',
    511: 'Network Authentication Required',
  };

  return messages[statusCode] || 'Unknown Status';
}

/**
 * Check if a status code indicates success (2xx)
 */
export function isSuccessStatus(statusCode: number): boolean {
  return statusCode >= 200 && statusCode < 300;
}

/**
 * Check if a status code indicates a client error (4xx)
 */
export function isClientError(statusCode: number): boolean {
  return statusCode >= 400 && statusCode < 500;
}

/**
 * Check if a status code indicates a server error (5xx)
 */
export function isServerError(statusCode: number): boolean {
  return statusCode >= 500 && statusCode < 600;
}

/**
 * Check if a status code indicates a redirect (3xx)
 */
export function isRedirect(statusCode: number): boolean {
  return statusCode >= 300 && statusCode < 400;
}
