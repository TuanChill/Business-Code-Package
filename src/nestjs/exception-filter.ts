import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus as NestHttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../response/api-response';
import { HttpStatus } from '../constants/http-status';
import { BusinessCode } from '../constants/business-codes';
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
 * Global exception filter that converts all exceptions to ApiResponse format
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { ApiExceptionFilter } from '@tchil/business-codes/nestjs';
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
    const response = ctx.getResponse<Response>();

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
    const mapping: Record<number, number> = {
      [NestHttpStatus.BAD_REQUEST]: BusinessCode.INVALID_INPUT,
      [NestHttpStatus.UNAUTHORIZED]: BusinessCode.AUTH_FAILED,
      [NestHttpStatus.FORBIDDEN]: BusinessCode.PERMISSION_DENIED,
      [NestHttpStatus.NOT_FOUND]: BusinessCode.RESOURCE_NOT_FOUND,
      [NestHttpStatus.CONFLICT]: BusinessCode.RESOURCE_CONFLICT,
      [NestHttpStatus.UNPROCESSABLE_ENTITY]: BusinessCode.VALIDATION_ERROR,
      [NestHttpStatus.TOO_MANY_REQUESTS]: BusinessCode.RATE_LIMIT_EXCEEDED,
      [NestHttpStatus.INTERNAL_SERVER_ERROR]: BusinessCode.INTERNAL_ERROR,
      [NestHttpStatus.SERVICE_UNAVAILABLE]: BusinessCode.SERVICE_UNAVAILABLE,
    };

    return mapping[httpStatus] || BusinessCode.INTERNAL_ERROR;
  }
}
