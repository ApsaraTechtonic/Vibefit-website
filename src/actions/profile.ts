'use server';

import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

export async function updatePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return { error: 'Invalid input. New password must be 6+ chars.' };
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });
    if (!user) return { error: 'User not found.' };

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return { error: 'Current password is incorrect.' };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { password: hashedPassword } }
    );

    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to update password.' };
  }
}

export async function updateProfilePicture(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const file = formData.get('picture') as File | null;
  if (!file || file.size === 0) {
    return { error: 'No picture selected.' };
  }

  try {
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const avatar = `data:${file.type};base64,${base64}`;

    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('users').updateOne(
      { _id: new ObjectId(session.userId) },
      { $set: { avatar } }
    );

    revalidatePath('/profile');
    return { success: true };
  } catch (err: any) {
    return { error: 'Failed to update profile picture.' };
  }
}
