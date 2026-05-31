import { BusinessCode } from '@tchil/business-codes';
import {
  jsonSuccess,
  jsonCreated,
  jsonNotFound,
  jsonPaginated,
  parseBody,
  parsePagination,
} from '@tchil/business-codes/nextjs';

interface User {
  id: string;
  email: string;
  name: string;
}

interface CreateUserDto {
  email: string;
  name: string;
}

const store = new Map<string, User>([
  ['1', { id: '1', email: 'alice@example.com', name: 'Alice' }],
  ['2', { id: '2', email: 'bob@example.com', name: 'Bob' }],
]);
let nextId = 3;

export async function GET(request: Request): Promise<Response> {
  const { page, limit } = parsePagination(request, { defaultLimit: 10 });
  const all = Array.from(store.values());
  const items = all.slice((page - 1) * limit, page * limit);
  return jsonPaginated(items, { page, limit, total: all.length });
}

export async function POST(request: Request): Promise<Response> {
  const body = await parseBody<CreateUserDto>(request);
  if (body.error) return body.error;

  const id = String(nextId++);
  const user: User = { id, ...body.data };
  store.set(id, user);
  return jsonCreated(user);
}

export function getUserById(id: string): Response | User {
  const user = store.get(id);
  if (!user) return jsonNotFound('User not found', BusinessCode.USER_NOT_FOUND);
  return user;
}

export function getStore(): Map<string, User> {
  return store;
}

export function resetStore(): void {
  store.clear();
  store.set('1', { id: '1', email: 'alice@example.com', name: 'Alice' });
  store.set('2', { id: '2', email: 'bob@example.com', name: 'Bob' });
  nextId = 3;
}
