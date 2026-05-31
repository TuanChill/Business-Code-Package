import { withErrorHandler, jsonSuccess } from '@tchil/business-codes/nextjs';

export const GET = withErrorHandler(async (_req: Request): Promise<Response> => {
  throw new Error('Something exploded');
  return jsonSuccess(null); // unreachable — satisfies return type
});
