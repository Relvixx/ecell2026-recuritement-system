function notFound() {
  return Response.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function GET() {
  return notFound();
}

export async function POST() {
  return notFound();
}
