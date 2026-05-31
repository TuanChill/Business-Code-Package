import { BusinessCode } from '@tchil/business-codes';
import { jsonSuccess, jsonNotFound, jsonNoContent } from '@tchil/business-codes/nextjs';

interface User {
  id: string;
  email: string;
  name: string;
}

const store = new Map<string, User>([
  ['1', { id: '1', email: 'alice@example.com', name: 'Alice' }],
  ['2', { id: '2', email: 'bob@example.com', name: 'Bob' }],
]);

export async function GET(
  _request: Request,
  context: { params: { id: string } },
): Promise<Response> {
  const user = store.get(context.params.id);
  if (!user) return jsonNotFound('User not found', BusinessCode.USER_NOT_FOUND);
  return jsonSuccess(user);
}

export async function DELETE(
  _request: Request,
  context: { params: { id: string } },
): Promise<Response> {
  store.delete(context.params.id);
  return jsonNoContent();
}
