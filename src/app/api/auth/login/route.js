import dbConnect from '../../../../../lib/mongodb';
import Admin from '../../../../../models/Admin';
import jwt from 'jsonwebtoken';

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request) {
  try {
    if (!process.env.JWT_SECRET) {
      return Response.json(
        { error: 'Login failed' },
        { status: 500 }
      );
    }

    await dbConnect();

    let body;

    try {
      body = await request.json();
    } catch {
      return Response.json(
        { error: 'Login failed' },
        { status: 400 }
      );
    }

    const usernameOrEmail = cleanString(body?.username).toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!usernameOrEmail || !password) {
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

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

    // Generate JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        username: admin.username,
        role: admin.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return Response.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
