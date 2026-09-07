import { createHash } from 'crypto';

const buckets = global.__ecellRateLimitBuckets || new Map();

if (!global.__ecellRateLimitBuckets) {
  global.__ecellRateLimitBuckets = buckets;
}

// Lightweight process-local protection only. This helps local and single
// instance runtime abuse, but counters are not shared across serverless
// instances or deployments.

function nowMs() {
  return Date.now();
}

function cleanKeyPart(value) {
  return String(value || 'unknown').slice(0, 160);
}

function hashKeyPart(value) {
  return createHash('sha256')
    .update(cleanKeyPart(value))
    .digest('hex')
    .slice(0, 32);
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get('x-forwarded-for');

  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

export function rateLimitKey(request, scope, discriminator = '') {
  return `ecell2026:rate-limit:${scope}:${hashKeyPart(getClientIp(request))}:${hashKeyPart(discriminator)}`;
}

export function applyEphemeralRateLimit(key, { limit, windowMs }) {
  const startedAt = nowMs();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= startedAt) {
    buckets.set(key, {
      count: 1,
      resetAt: startedAt + windowMs
    });

    return {
      allowed: true,
      remaining: Math.max(limit - 1, 0),
      resetAt: startedAt + windowMs
    };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: bucket.resetAt
    };
  }

  bucket.count += 1;

  return {
    allowed: true,
    remaining: Math.max(limit - bucket.count, 0),
    resetAt: bucket.resetAt
  };
}

export function rateLimitResponse(result) {
  const retryAfter = Math.max(Math.ceil((result.resetAt - nowMs()) / 1000), 1);

  return Response.json(
    { error: 'Too many requests. Please try again later.' },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfter),
        'X-RateLimit-Remaining': '0'
      }
    }
  );
}

export function enforceRateLimit(request, scope, options, discriminator = '') {
  const key = rateLimitKey(request, scope, discriminator);
  const result = applyEphemeralRateLimit(key, options);

  if (!result.allowed) {
    return rateLimitResponse(result);
  }

  return null;
}
