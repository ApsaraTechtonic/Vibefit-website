'use server';

import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function logWater(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const cups = parseInt(formData.get('cups') as string);
  const time = formData.get('time') as string;

  if (!cups || !time) return { error: 'Missing fields' };

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'water', 
      cups, 
      time,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save.' };
  }
}

export async function logWeight(weight: number) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'weight', 
      weight,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save weight.' };
  }
}

export async function logFood(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const foodItem = formData.get('item') as string;
  const time = formData.get('time') as string;

  if (!foodItem || !time) return { error: 'Missing fields' };

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'food', 
      item: foodItem, 
      time,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save.' };
  }
}

export async function logMedication(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const name = formData.get('name') as string;
  const dosage = formData.get('dosage') as string;
  const time = formData.get('time') as string;

  if (!name || !dosage || !time) return { error: 'Missing fields' };

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'medication', 
      name, 
      dosage,
      time,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to save.' };
  }
}
