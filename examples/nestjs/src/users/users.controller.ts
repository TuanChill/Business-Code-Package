import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiResponse, BusinessCode } from '@tchil/business-codes';
import {
  SkipApiResponse,
  ValidationException,
} from '@tchil/business-codes/nestjs';
import { UsersService } from './users.service';
import type { CreateUserDto } from './user.types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): ApiResponse<unknown> {
    const { items, total } = this.usersService.findAll(
      Number(page),
      Number(limit),
    );
    return ApiResponse.paginated({
      data: items,
      page: Number(page),
      limit: Number(limit),
      total,
    });
  }

  @Get('boom')
  getBoom(): never {
    throw new ValidationException({ email: 'Invalid email' });
  }

  @Get('raw/:id')
  @SkipApiResponse()
  getRaw(@Param('id') id: string): unknown {
    return this.usersService.findById(id);
  }

  @Get(':id')
  getOne(@Param('id') id: string): unknown {
    return this.usersService.findById(id);
  }

  @Post()
  @HttpCode(201)
  create(@Body() dto: CreateUserDto): unknown {
    return this.usersService.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string): void {
    this.usersService.findById(id);
  }
}
