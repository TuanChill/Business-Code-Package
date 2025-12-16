import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../response/api-response';
import { HttpStatus } from '../constants/http-status';

/**
 * Options for ApiResponseInterceptor
 */
export interface ApiResponseInterceptorOptions {
  /** Default success message (default: 'Success') */
  defaultMessage?: string;
  /** Whether to skip wrapping if response is already ApiResponse (default: true) */
  skipIfWrapped?: boolean;
}

/**
 * Response interceptor that wraps all responses in ApiResponse format
 *
 * This interceptor automatically converts controller return values
 * to standardized ApiResponse format.
 *
 * @example
 * ```typescript
 * // In main.ts
 * import { ApiResponseInterceptor } from '@tchil/business-codes/nestjs';
 *
 * async function bootstrap() {
 *   const app = await NestFactory.create(AppModule);
 *   app.useGlobalInterceptors(new ApiResponseInterceptor());
 *   await app.listen(3000);
 * }
 *
 * // In a controller
 * @Get(':id')
 * async getUser(@Param('id') id: string) {
 *   return this.userService.findById(id);
 *   // Response: { success: true, data: {...}, message: 'Success', statusCode: 200 }
 * }
 * ```
 */
@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  constructor(private readonly options: ApiResponseInterceptorOptions = {}) {
    this.options = {
      defaultMessage: 'Success',
      skipIfWrapped: true,
      ...options,
    };
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        // Skip wrapping if response is already ApiResponse
        if (this.options.skipIfWrapped && data instanceof ApiResponse) {
          return data;
        }

        // Skip wrapping if data is null/undefined and status is 204
        const statusCode = response.statusCode;
        if (statusCode === HttpStatus.NO_CONTENT) {
          return ApiResponse.noContent() as unknown as ApiResponse<T>;
        }

        // Wrap the response
        return ApiResponse.success({
          data,
          message: this.options.defaultMessage,
          statusCode,
        });
      })
    );
  }
}

/**
 * Decorator to skip the ApiResponseInterceptor for specific routes
 *
 * @example
 * ```typescript
 * @Get('raw')
 * @SkipApiResponse()
 * getRaw() {
 *   return { raw: 'data' }; // Not wrapped in ApiResponse
 * }
 * ```
 */
import { SetMetadata } from '@nestjs/common';

export const SKIP_API_RESPONSE_KEY = 'skipApiResponse';
export const SkipApiResponse = () => SetMetadata(SKIP_API_RESPONSE_KEY, true);

/**
 * Advanced response interceptor with skip decorator support
 */
@Injectable()
export class ApiResponseInterceptorAdvanced<T> implements NestInterceptor<T, ApiResponse<T> | T> {
  constructor(private readonly options: ApiResponseInterceptorOptions = {}) {
    this.options = {
      defaultMessage: 'Success',
      skipIfWrapped: true,
      ...options,
    };
  }

  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiResponse<T> | T> {
    const response = context.switchToHttp().getResponse();

    // Check if route should skip transformation
    const reflector = context.getHandler();
    const skipTransform = Reflect.getMetadata(SKIP_API_RESPONSE_KEY, reflector);

    if (skipTransform) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        // Skip wrapping if response is already ApiResponse
        if (this.options.skipIfWrapped && data instanceof ApiResponse) {
          return data;
        }

        // Skip wrapping if data is null/undefined and status is 204
        const statusCode = response.statusCode;
        if (statusCode === HttpStatus.NO_CONTENT) {
          return ApiResponse.noContent() as unknown as ApiResponse<T>;
        }

        // Wrap the response
        return ApiResponse.success({
          data,
          message: this.options.defaultMessage,
          statusCode,
        });
      })
    );
  }
}
