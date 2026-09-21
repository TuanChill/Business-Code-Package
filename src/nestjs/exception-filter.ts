import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { ApiResponse } from '../response/api-response';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';
import { RESPONSE_MAPPING } from '../constants/response-mapping';
import { BusinessException } from './exceptions';

/**
 * Options for ApiExceptionFilter
 */
export interface ApiExceptionFilterOptions {
  /** Whether to include stack trace in error response (default: false) */
  includeStack?: boolean;
  /** Custom logger function */
  logger?: (error: unknown, context: string) => void;
}

/**
 * Minimal structural shape this filter needs from the HTTP response object.
 *
 * Deliberately not `express.Response` — that would make `@types/express` a
 * type-level dependency of every consumer of this filter. Express's
 * `Response` satisfies this shape, so nothing changes at runtime for
 * existing Express-based consumers.
 */
interface MinimalResponse {
  status(code: number): { json(body: unknown): void };
}

/**
 * Global exception filter that converts all exceptions to ApiResponse format
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { ApiExceptionFilter } from '@tuanchill/business-codes/nestjs';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalFilters(new ApiExceptionFilter());
 *   await app.listen(3000);
 * }
 *
 * // Or in a module
 * @Module({
 *   providers: [
 *     {
 *       provide: APP_FILTER,
 *       useClass: ApiExceptionFilter,
 *     },
 *   ],
 * })
 * export class AppModule {}
 * ```
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  constructor(private readonly options: ApiExceptionFilterOptions = {}) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<MinimalResponse>();

    let apiResponse: ApiResponse<null>;

    if (exception instanceof BusinessException) {
      // Handle BusinessException
      apiResponse = ApiResponse.error({
        message: exception.message,
        code: exception.businessCode,
        statusCode: exception.statusCode,
        details: exception.details,
      });

      if (this.options.includeStack && exception.stack) {
        apiResponse.error = {
          ...apiResponse.error,
          stack: exception.stack,
        };
      }
    } else if (exception instanceof HttpException) {
      // Handle NestJS HttpException
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      let message: string;
      let details: Record<string, unknown> | undefined;

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as Record<string, unknown>;
        message = (resp.message as string) || exception.message;

        // Handle validation pipe errors
        if (Array.isArray(resp.message)) {
          message = 'Validation failed';
          details = { errors: resp.message };
        }
      } else {
        message = exception.message;
      }

      apiResponse = ApiResponse.error({
        message,
        code: this.mapHttpStatusToBusinessCode(status),
        statusCode: status,
        details,
      });
    } else if (exception instanceof Error) {
      // Handle generic Error
      apiResponse = ApiResponse.error({
        message: exception.message || 'Internal server error',
        code: BusinessCode.INTERNAL_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });

      if (this.options.includeStack && exception.stack) {
        apiResponse.error = {
          ...apiResponse.error,
          stack: exception.stack,
        };
      }
    } else {
      // Handle unknown exception
      apiResponse = ApiResponse.error({
        message: 'Internal server error',
        code: BusinessCode.INTERNAL_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    // Log the error if logger is provided
    if (this.options.logger) {
      this.options.logger(exception, 'ApiExceptionFilter');
    }

    response.status(apiResponse.statusCode || HttpStatus.INTERNAL_SERVER_ERROR).json(apiResponse);
  }

  /**
   * Map HTTP status codes to business codes
   */
  private mapHttpStatusToBusinessCode(httpStatus: number): number {
    const mapping: Record<number, number> = Object.fromEntries(
      Object.values(RESPONSE_MAPPING).map((entry) => [entry.httpStatus, entry.businessCode])
    );

    return mapping[httpStatus] || BusinessCode.INTERNAL_ERROR;
  }
}
