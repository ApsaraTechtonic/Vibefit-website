'use server';

import bcrypt from 'bcryptjs';
import clientPromise from '@/lib/mongodb';
import { createSession, logout } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function signUp(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  if (!email || !password || password.length < 6) {
    return { error: 'Invalid email or password must be 6+ chars.' };
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return { error: 'User already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    let pictureBase64 = null;
    const file = formData.get('picture') as File | null;
    if (file && file.size > 0) {
      // Limit profile picture to 2MB to stay well within MongoDB's 16MB document limit
      if (file.size > 2 * 1024 * 1024) {
        return { error: 'Profile picture must be under 2MB. Please choose a smaller image.' };
      }
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      pictureBase64 = `data:${file.type};base64,${base64}`;
    }

    const name = formData.get('name') as string || email.split('@')[0];
    
    const result = await db.collection('users').insertOne({
      email,
      name,
      avatar: pictureBase64,
      password: hashedPassword,
      createdAt: new Date(),
    });

    await createSession(result.insertedId.toString());
  } catch (err: any) {
    console.error('SignUp Error:', err);
    return { error: err?.message || 'Something went wrong. Please try again.' };
  }
  
  return { success: true };
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return { error: 'Invalid credentials.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: 'Invalid credentials.' };
    }

    await createSession(user._id.toString());
  } catch (err: any) {
    console.error('Auth Error:', err);
    return { error: err.message || 'Something went wrong.' };
  }

  return { success: true };
}

export async function signOut() {
  await logout();
  redirect('/auth');
}
