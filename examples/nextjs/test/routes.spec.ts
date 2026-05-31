import { BusinessCode } from '@tchil/business-codes';
import { GET as getUsers, POST as postUser, resetStore } from '../src/app/api/users/route';
import { GET as getUser, DELETE as deleteUser } from '../src/app/api/users/[id]/route';
import { GET as getErrorDemo } from '../src/app/api/error-demo/route';

beforeEach(() => resetStore());

function makeRequest(url: string, init?: RequestInit): Request {
  return new Request(url, init);
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

describe('GET /users', () => {
  it('returns paginated envelope with defaults', async () => {
    const res = await getUsers(makeRequest('http://localhost/users'));
    expect(res.status).toBe(200);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const meta = body.meta as Record<string, unknown>;
    expect(meta.page).toBe(1);
    expect(meta.limit).toBe(10);
    expect(typeof meta.total).toBe('number');
    expect(typeof meta.totalPages).toBe('number');
    expect(typeof meta.hasNextPage).toBe('boolean');
  });

  it('respects ?page and ?limit query params', async () => {
    const res = await getUsers(makeRequest('http://localhost/users?page=2&limit=1'));
    const body = await parseJson(res) as Record<string, unknown>;
    const meta = body.meta as Record<string, unknown>;
    expect(meta.page).toBe(2);
    expect(meta.limit).toBe(1);
  });
});

describe('POST /users', () => {
  it('creates a user and returns 201', async () => {
    const res = await postUser(makeRequest('http://localhost/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'charlie@example.com', name: 'Charlie' }),
    }));
    expect(res.status).toBe(201);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const data = body.data as Record<string, unknown>;
    expect(data.email).toBe('charlie@example.com');
    expect(body.statusCode).toBe(201);
  });

  it('returns 400 on invalid JSON body', async () => {
    const res = await postUser(makeRequest('http://localhost/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    }));
    expect(res.status).toBe(400);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(false);
    const error = body.error as Record<string, unknown>;
    expect(error.code).toBe(BusinessCode.INVALID_INPUT);
  });
});

describe('GET /users/:id', () => {
  it('returns user on success', async () => {
    const res = await getUser(makeRequest('http://localhost/users/1'), { params: { id: '1' } });
    expect(res.status).toBe(200);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(true);
    const data = body.data as Record<string, unknown>;
    expect(data.id).toBe('1');
  });

  it('returns 404 with RESOURCE_NOT_FOUND for missing user', async () => {
    const res = await getUser(makeRequest('http://localhost/users/999'), { params: { id: '999' } });
    expect(res.status).toBe(404);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(false);
    const error = body.error as Record<string, unknown>;
    expect(error.code).toBe(BusinessCode.USER_NOT_FOUND);
  });
});

describe('DELETE /users/:id', () => {
  it('returns 204 with null body', async () => {
    const res = await deleteUser(makeRequest('http://localhost/users/1'), { params: { id: '1' } });
    expect(res.status).toBe(204);
    const body = await parseJson(res);
    expect(body).toBeNull();
  });
});

describe('GET /error-demo', () => {
  it('returns 500 envelope when handler throws', async () => {
    const res = await getErrorDemo(makeRequest('http://localhost/error-demo'));
    expect(res.status).toBe(500);
    const body = await parseJson(res) as Record<string, unknown>;
    expect(body.success).toBe(false);
    const error = body.error as Record<string, unknown>;
    expect(error.code).toBe(BusinessCode.INTERNAL_ERROR);
  });
});
