'use server';

import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function logWorkout(exercises: unknown[]) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  if (!exercises || exercises.length === 0) {
    return { error: 'No exercises added.' };
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'workout', 
      exercises,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to save workout' };
  }
}
