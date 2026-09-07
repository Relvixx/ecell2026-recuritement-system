import { NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, adminSessionCookieOptions } from '../../../../../lib/auth';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });

  response.cookies.set(ADMIN_SESSION_COOKIE, '', {
    ...adminSessionCookieOptions(),
    maxAge: 0
  });

  return response;
}
