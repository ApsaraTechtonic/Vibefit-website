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
  } catch {
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
  } catch {
    return { error: 'Failed to save weight.' };
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function logFood(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  const foodItem = formData.get('item') as string;
  const time = formData.get('time') as string;

  if (!foodItem || !time) return { error: 'Missing fields' };

  let calories = null;
  let insight = null;

  if (process.env.GEMINI_API_KEY) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are a nutrition AI. Estimate the calories for this food item: "${foodItem}". 
      Return ONLY a JSON object like this: {"calories": 250, "insight": "A short 5-word healthy vibe"}. 
      If unsure, estimate conservatively. No other text.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.match(/\{.*\}/s);
      if (match) {
        const data = JSON.parse(match[0]);
        calories = data.calories;
        insight = data.insight;
      }
    } catch (err) {
      console.error('AI Food Error:', err);
    }
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    await db.collection('logs').insertOne({ 
      userId: session.userId, 
      type: 'food', 
      item: foodItem, 
      time,
      calories,
      aiInsight: insight,
      createdAt: new Date()
    });

    revalidatePath('/');
    return { success: true, calories, insight };
  } catch {
    return { error: 'Failed to save.' };
  }
}

export async function logMedication(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

    const name = formData.get('name') as string;
    const dosage = formData.get('dosage') as string;
    const time = formData.get('time') as string;
    const category = formData.get('category') as string;
  
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
        category: category || 'any',
        createdAt: new Date()
      });

    revalidatePath('/');
    return { success: true };
  } catch {
    return { error: 'Failed to save.' };
  }
}
