import { Injectable } from '@nestjs/common';
import {
  NotFoundException,
  ConflictException,
} from '@tchil/business-codes/nestjs';
import { BusinessCode } from '@tchil/business-codes';
import { User, CreateUserDto } from './user.types';

@Injectable()
export class UsersService {
  private readonly store = new Map<string, User>();
  private nextId = 1;

  constructor() {
    this.store.set('1', { id: '1', email: 'alice@example.com', name: 'Alice' });
    this.store.set('2', { id: '2', email: 'bob@example.com', name: 'Bob' });
    this.nextId = 3;
  }

  findAll(page: number, limit: number): { items: User[]; total: number } {
    const all = Array.from(this.store.values());
    const start = (page - 1) * limit;
    return { items: all.slice(start, start + limit), total: all.length };
  }

  findById(id: string): User {
    const user = this.store.get(id);
    if (!user) {
      throw new NotFoundException('User not found', BusinessCode.USER_NOT_FOUND);
    }
    return user;
  }

  create(dto: CreateUserDto): User {
    const exists = Array.from(this.store.values()).find(
      (u) => u.email === dto.email,
    );
    if (exists) {
      throw new ConflictException(
        'Email already exists',
        BusinessCode.EMAIL_ALREADY_EXISTS,
      );
    }
    const id = String(this.nextId++);
    const user: User = { id, ...dto };
    this.store.set(id, user);
    return user;
  }
}
