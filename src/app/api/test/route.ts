import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { createSession } from '@/lib/session';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    // Test DB read
    const existingUser = await db.collection('users').findOne({ email: 'diagnose@test.com' });
    
    // Test bcrypt
    const hashedPassword = await bcrypt.hash('secretpassword', 10);
    
    // Test DB write
    const result = await db.collection('users').insertOne({ 
      email: 'diagnose@test.com', 
      password: hashedPassword 
    });
    
    // Test session
    await createSession(result.insertedId.toString());
    
    return NextResponse.json({ success: true, state: 'All systems go' });
  } catch (err: any) {
    return NextResponse.json({ 
      error: String(err), 
      message: err.message,
      stack: err.stack 
    });
  }
}
