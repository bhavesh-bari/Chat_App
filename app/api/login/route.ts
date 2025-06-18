// api/login/route.ts (or wherever your login POST handler is)
import { NextRequest, NextResponse } from 'next/server'

import { SignJWT } from 'jose'; 
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    await connectDB()

    const user = await User.findOne({ email })
    if (!user)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    // Create token using jose
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

    const token = await new SignJWT({ id: user._id })
      .setProtectedHeader({ alg: 'HS256' }) 
      .setIssuedAt()
      .setExpirationTime('1d') 
      .sign(secret);

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        contacts: user.contacts,

      },
    })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}