'use server';

import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

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
