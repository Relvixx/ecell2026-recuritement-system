import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';
import Admin from '../models/Admin';
import { getRequiredServerEnv } from './env';

export const ADMIN_SESSION_COOKIE = 'ecell_admin_session';
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

function authError(error, status) {
  return { error, status };
}

function getCookieToken(request) {
  if (request.cookies?.get) {
    return request.cookies.get(ADMIN_SESSION_COOKIE)?.value || '';
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const sessionCookie = cookies.find((cookie) => cookie.startsWith(`${ADMIN_SESSION_COOKIE}=`));

  return sessionCookie ? decodeURIComponent(sessionCookie.split('=').slice(1).join('=')) : '';
}

export function createAdminToken(admin) {
  const jwtSecret = getRequiredServerEnv('JWT_SECRET');

  return jwt.sign(
    {
      adminId: admin._id.toString(),
      username: admin.username,
      role: admin.role
    },
    jwtSecret,
    { expiresIn: ADMIN_SESSION_MAX_AGE_SECONDS }
  );
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
    path: '/'
  };
}

export async function authenticateToken(request) {
  let jwtSecret;

  try {
    jwtSecret = getRequiredServerEnv('JWT_SECRET');
  } catch {
    return authError('Authentication unavailable', 403);
  }

  const cookieToken = getCookieToken(request);
  const token = cookieToken;

  if (!token) {
    return authError('Access token required', 401);
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded?.adminId) {
      return authError('Invalid or expired token', 403);
    }

    await dbConnect();

    const admin = await Admin.findOne({
      _id: decoded.adminId,
      isActive: true
    }).select('_id username email role isActive');

    if (!admin) {
      return authError('Invalid or expired token', 403);
    }

    return {
      user: {
        adminId: admin._id.toString(),
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    };
  } catch (error) {
    return authError('Invalid or expired token', 403);
  }
}

export function requireAuth(handler) {
  return async (request, context) => {
    const auth = await authenticateToken(request);
    
    if (auth.error) {
      return Response.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    // Add user to request context
    request.user = auth.user;
    
    return handler(request, context);
  };
}
