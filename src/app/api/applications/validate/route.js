import { requireAuth } from '../../../../../lib/auth';

function disabled() {
  return Response.json(
    { error: 'This legacy CSV validation endpoint is no longer available' },
    { status: 410 }
  );
}

export const POST = requireAuth(async function POST() {
  return disabled();
});
