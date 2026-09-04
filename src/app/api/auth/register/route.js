function notFound() {
  return Response.json(
    { error: 'Not found' },
    { status: 404 }
  );
}

export async function POST() {
  return notFound();
}
