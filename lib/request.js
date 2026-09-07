export function rejectLargeRequest(request, maxBytes) {
  const contentLength = request.headers.get('content-length');

  if (!contentLength) {
    return null;
  }

  const size = Number(contentLength);

  if (Number.isFinite(size) && size > maxBytes) {
    return Response.json(
      { error: 'Request payload is too large' },
      { status: 413 }
    );
  }

  return null;
}

export async function parseJsonRequest(request, maxBytes) {
  const sizeError = rejectLargeRequest(request, maxBytes);

  if (sizeError) {
    return { errorResponse: sizeError };
  }

  try {
    return { body: await request.json() };
  } catch {
    return {
      errorResponse: Response.json(
        { error: 'Invalid JSON payload' },
        { status: 400 }
      )
    };
  }
}
