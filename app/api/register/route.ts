import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/lib/models/User'


export async function POST(req: NextRequest) {
  const { email, password, name, avatarUrl } = await req.json(); // avatarUrl is destructured here
  await connectDB();
  const userExists = await User.findOne({ email });
  if (userExists) return NextResponse.json({ error: 'User already exists' }, { status: 400 });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ email, password: hashedPassword, name, avatarUrl }); // Passed directly to create

  return NextResponse.json({ message: 'Registered successfully', user: newUser });
}