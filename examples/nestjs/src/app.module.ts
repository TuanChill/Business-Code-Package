import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ApiExceptionFilter,
  ApiResponseInterceptorAdvanced,
} from '@tchil/business-codes/nestjs';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => new ApiResponseInterceptorAdvanced(),
    },
    {
      provide: APP_FILTER,
      useFactory: () => new ApiExceptionFilter(),
    },
  ],
})
export class AppModule {}
