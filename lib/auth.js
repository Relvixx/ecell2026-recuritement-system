import jwt from 'jsonwebtoken';
import dbConnect from './mongodb';
import Admin from '../models/Admin';

function authError(error, status) {
  return { error, status };
}

export async function authenticateToken(request) {
  if (!process.env.JWT_SECRET) {
    return authError('Authentication unavailable', 403);
  }

  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return authError('Access token required', 401);
  }

  const [scheme, token, ...extraParts] = authHeader.trim().split(/\s+/);

  if (scheme !== 'Bearer' || !token || extraParts.length > 0) {
    return authError('Bearer token required', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

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
