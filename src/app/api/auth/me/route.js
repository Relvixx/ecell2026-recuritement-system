import { requireAuth } from '../../../../../lib/auth';

export const GET = requireAuth(async function GET(request) {
  return Response.json({ admin: request.user });
});
