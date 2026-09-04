import { requireAuth } from '../../../../../lib/auth';

function disabled() {
  return Response.json(
    { error: 'This legacy CSV template endpoint is no longer available' },
    { status: 410 }
  );
}

export const GET = requireAuth(async function GET() {
  return disabled();
});
