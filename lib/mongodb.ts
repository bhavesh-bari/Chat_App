import mongoose from 'mongoose'
import User from './models/User'
import { Contact } from './models/Contact'
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env.local")

let cached = (global as any).mongoose

if (!cached) {
  cached = {
    conn: null,
    promise: null,
  }
  ;(global as any).mongoose = cached
}

export async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((mongoose) => mongoose)
  }

  cached.conn = await cached.promise
  return cached.conn
}
