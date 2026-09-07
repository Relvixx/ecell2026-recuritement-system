import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';
import { adminSessionCookieOptions, ADMIN_SESSION_COOKIE, createAdminToken } from '../../../../../lib/auth';
import { validateServerEnv } from '../../../../../lib/env';
import { enforceRateLimit } from '../../../../../lib/rateLimit';
import { parseJsonRequest } from '../../../../../lib/request';

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

const LOGIN_BODY_LIMIT_BYTES = 8 * 1024;
const LOGIN_RATE_LIMIT = {
  limit: 8,
  windowMs: 15 * 60 * 1000
};

export async function POST(request) {
  try {
    try {
      validateServerEnv(['MONGODB_URI', 'JWT_SECRET']);
    } catch {
      return Response.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }

    const parseResult = await parseJsonRequest(request, LOGIN_BODY_LIMIT_BYTES);

    if (parseResult.errorResponse) {
      return Response.json(
        { error: 'Login failed' },
        { status: parseResult.errorResponse.status }
      );
    }

    const body = parseResult.body;
    const usernameOrEmail = cleanString(body?.username).toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';
    const rateLimitResponse = await enforceRateLimit(
      request,
      'admin-login',
      LOGIN_RATE_LIMIT,
      usernameOrEmail
    );

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    if (!usernameOrEmail || !password) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Find admin by username
    const admin = await Admin.findOne({
      isActive: true,
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    });

    if (!admin) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);

    if (!isPasswordValid) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = createAdminToken(admin);
    const response = NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });

    response.cookies.set(ADMIN_SESSION_COOKIE, token, adminSessionCookieOptions());

    return response;
  } catch (error) {
    console.error('Login error:', error);
      return NextResponse.json(
        { error: 'Login failed' },
        { status: 500 }
      );
  }
}
