// TEAM_001: Unit tests for HTTP status codes constants and utilities
import {
  HttpStatus,
  getHttpStatusMessage,
  isSuccessStatus,
  isClientError,
  isServerError,
  isRedirect,
} from './http-status';

describe('HttpStatus', () => {
  describe('constants', () => {
    it('should have correct 1xx informational status codes', () => {
      expect(HttpStatus.CONTINUE).toBe(100);
      expect(HttpStatus.SWITCHING_PROTOCOLS).toBe(101);
      expect(HttpStatus.PROCESSING).toBe(102);
    });

    it('should have correct 2xx success status codes', () => {
      expect(HttpStatus.OK).toBe(200);
      expect(HttpStatus.CREATED).toBe(201);
      expect(HttpStatus.ACCEPTED).toBe(202);
      expect(HttpStatus.NON_AUTHORITATIVE_INFORMATION).toBe(203);
      expect(HttpStatus.NO_CONTENT).toBe(204);
      expect(HttpStatus.RESET_CONTENT).toBe(205);
      expect(HttpStatus.PARTIAL_CONTENT).toBe(206);
    });

    it('should have correct 3xx redirection status codes', () => {
      expect(HttpStatus.MULTIPLE_CHOICES).toBe(300);
      expect(HttpStatus.MOVED_PERMANENTLY).toBe(301);
      expect(HttpStatus.FOUND).toBe(302);
      expect(HttpStatus.SEE_OTHER).toBe(303);
      expect(HttpStatus.NOT_MODIFIED).toBe(304);
      expect(HttpStatus.TEMPORARY_REDIRECT).toBe(307);
      expect(HttpStatus.PERMANENT_REDIRECT).toBe(308);
    });

    it('should have correct 4xx client error status codes', () => {
      expect(HttpStatus.BAD_REQUEST).toBe(400);
      expect(HttpStatus.UNAUTHORIZED).toBe(401);
      expect(HttpStatus.PAYMENT_REQUIRED).toBe(402);
      expect(HttpStatus.FORBIDDEN).toBe(403);
      expect(HttpStatus.NOT_FOUND).toBe(404);
      expect(HttpStatus.METHOD_NOT_ALLOWED).toBe(405);
      expect(HttpStatus.NOT_ACCEPTABLE).toBe(406);
      expect(HttpStatus.PROXY_AUTHENTICATION_REQUIRED).toBe(407);
      expect(HttpStatus.REQUEST_TIMEOUT).toBe(408);
      expect(HttpStatus.CONFLICT).toBe(409);
      expect(HttpStatus.GONE).toBe(410);
      expect(HttpStatus.LENGTH_REQUIRED).toBe(411);
      expect(HttpStatus.PRECONDITION_FAILED).toBe(412);
      expect(HttpStatus.PAYLOAD_TOO_LARGE).toBe(413);
      expect(HttpStatus.URI_TOO_LONG).toBe(414);
      expect(HttpStatus.UNSUPPORTED_MEDIA_TYPE).toBe(415);
      expect(HttpStatus.RANGE_NOT_SATISFIABLE).toBe(416);
      expect(HttpStatus.EXPECTATION_FAILED).toBe(417);
      expect(HttpStatus.I_AM_A_TEAPOT).toBe(418);
      expect(HttpStatus.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HttpStatus.LOCKED).toBe(423);
      expect(HttpStatus.FAILED_DEPENDENCY).toBe(424);
      expect(HttpStatus.TOO_EARLY).toBe(425);
      expect(HttpStatus.UPGRADE_REQUIRED).toBe(426);
      expect(HttpStatus.PRECONDITION_REQUIRED).toBe(428);
      expect(HttpStatus.TOO_MANY_REQUESTS).toBe(429);
      expect(HttpStatus.REQUEST_HEADER_FIELDS_TOO_LARGE).toBe(431);
      expect(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS).toBe(451);
    });

    it('should have correct 5xx server error status codes', () => {
      expect(HttpStatus.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatus.NOT_IMPLEMENTED).toBe(501);
      expect(HttpStatus.BAD_GATEWAY).toBe(502);
      expect(HttpStatus.SERVICE_UNAVAILABLE).toBe(503);
      expect(HttpStatus.GATEWAY_TIMEOUT).toBe(504);
      expect(HttpStatus.HTTP_VERSION_NOT_SUPPORTED).toBe(505);
      expect(HttpStatus.VARIANT_ALSO_NEGOTIATES).toBe(506);
      expect(HttpStatus.INSUFFICIENT_STORAGE).toBe(507);
      expect(HttpStatus.LOOP_DETECTED).toBe(508);
      expect(HttpStatus.NOT_EXTENDED).toBe(510);
      expect(HttpStatus.NETWORK_AUTHENTICATION_REQUIRED).toBe(511);
    });
  });
});

describe('getHttpStatusMessage', () => {
  it('should return correct message for 2xx status codes', () => {
    expect(getHttpStatusMessage(200)).toBe('OK');
    expect(getHttpStatusMessage(201)).toBe('Created');
    expect(getHttpStatusMessage(204)).toBe('No Content');
  });

  it('should return correct message for 4xx status codes', () => {
    expect(getHttpStatusMessage(400)).toBe('Bad Request');
    expect(getHttpStatusMessage(401)).toBe('Unauthorized');
    expect(getHttpStatusMessage(403)).toBe('Forbidden');
    expect(getHttpStatusMessage(404)).toBe('Not Found');
    expect(getHttpStatusMessage(409)).toBe('Conflict');
    expect(getHttpStatusMessage(422)).toBe('Unprocessable Entity');
    expect(getHttpStatusMessage(429)).toBe('Too Many Requests');
  });

  it('should return correct message for 5xx status codes', () => {
    expect(getHttpStatusMessage(500)).toBe('Internal Server Error');
    expect(getHttpStatusMessage(502)).toBe('Bad Gateway');
    expect(getHttpStatusMessage(503)).toBe('Service Unavailable');
  });

  it('should return "Unknown Status" for unknown status codes', () => {
    expect(getHttpStatusMessage(999)).toBe('Unknown Status');
    expect(getHttpStatusMessage(0)).toBe('Unknown Status');
    expect(getHttpStatusMessage(-1)).toBe('Unknown Status');
  });
});

describe('isSuccessStatus', () => {
  it('should return true for 2xx status codes', () => {
    expect(isSuccessStatus(200)).toBe(true);
    expect(isSuccessStatus(201)).toBe(true);
    expect(isSuccessStatus(204)).toBe(true);
    expect(isSuccessStatus(299)).toBe(true);
  });

  it('should return false for non-2xx status codes', () => {
    expect(isSuccessStatus(199)).toBe(false);
    expect(isSuccessStatus(300)).toBe(false);
    expect(isSuccessStatus(400)).toBe(false);
    expect(isSuccessStatus(500)).toBe(false);
  });
});

describe('isClientError', () => {
  it('should return true for 4xx status codes', () => {
    expect(isClientError(400)).toBe(true);
    expect(isClientError(401)).toBe(true);
    expect(isClientError(404)).toBe(true);
    expect(isClientError(499)).toBe(true);
  });

  it('should return false for non-4xx status codes', () => {
    expect(isClientError(399)).toBe(false);
    expect(isClientError(500)).toBe(false);
    expect(isClientError(200)).toBe(false);
  });
});

describe('isServerError', () => {
  it('should return true for 5xx status codes', () => {
    expect(isServerError(500)).toBe(true);
    expect(isServerError(502)).toBe(true);
    expect(isServerError(503)).toBe(true);
    expect(isServerError(599)).toBe(true);
  });

  it('should return false for non-5xx status codes', () => {
    expect(isServerError(499)).toBe(false);
    expect(isServerError(600)).toBe(false);
    expect(isServerError(400)).toBe(false);
  });
});

describe('isRedirect', () => {
  it('should return true for 3xx status codes', () => {
    expect(isRedirect(300)).toBe(true);
    expect(isRedirect(301)).toBe(true);
    expect(isRedirect(302)).toBe(true);
    expect(isRedirect(399)).toBe(true);
  });

  it('should return false for non-3xx status codes', () => {
    expect(isRedirect(299)).toBe(false);
    expect(isRedirect(400)).toBe(false);
    expect(isRedirect(200)).toBe(false);
  });
});
