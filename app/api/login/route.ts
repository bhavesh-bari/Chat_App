// api/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/lib/models/User';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    await connectDB();

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    // ✅ FIX: Ensure user._id is converted to a string before signing
    // Mongoose documents have a ._id property which is an ObjectId.
    // Convert it to a string for consistency in JWT payload.
    const userIdString = user._id.toString(); 

    const token = await new SignJWT({ id: userIdString }) // Use the stringified ID
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(secret);

    // Prepare response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id, // You can keep the original ObjectId here for the response body
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        contacts: user.contacts,
      },
    });

    const isProduction = process.env.NODE_ENV === 'production';

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}