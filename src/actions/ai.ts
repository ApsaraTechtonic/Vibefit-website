'use server';

import clientPromise from '@/lib/mongodb';
import { getSession } from '@/lib/session';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { revalidatePath } from 'next/cache';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getDailyInsight() {
  const session = await getSession();
  if (!session) return { error: 'Not logged in' };

  if (!process.env.GEMINI_API_KEY) {
     return { insight: "Please add your GEMINI_API_KEY to your .env.local file to activate your AI fitness coach!" };
  }

  try {
    const client = await clientPromise;
    const db = client.db('vibefit');
    
    // Get logs from the past 3 days for context
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    
    const logs = await db.collection('logs').find({
      userId: session.userId,
      createdAt: { $gte: threeDaysAgo }
    }).toArray();

    if (logs.length === 0) {
       return { insight: "You haven't logged any data recently! Start tracking your water, food, and workouts to get personalized AI advice." };
    }

    // Aggregate the user data into a readable summary for Gemini
    const summary = logs.reduce((acc, log) => {
      if (log.type === 'water') acc.water += Number(log.cups) || 0;
      if (log.type === 'food') acc.meals += 1;
      if (log.type === 'workout') {
         acc.workouts += 1;
         log.exercises?.forEach((ex: any) => {
            const w = Number(ex.weight) || 0;
            const s = Number(ex.sets) || 0;
            const r = Number(ex.reps) || 0;
            acc.volume += (w * s * r);
         });
      }
      if (log.type === 'weight') acc.latestWeight = log.weight;
      return acc;
    }, { water: 0, meals: 0, workouts: 0, volume: 0, latestWeight: null });

    const prompt = `You are a highly motivating, concise AI fitness coach. 
Here is your client's data from the past 3 days:
- Water: ${summary.water} cups
- Meals Logged: ${summary.meals}
- Workouts: ${summary.workouts} (Total Volume: ${summary.volume}kg)
- Latest Weight: ${summary.latestWeight ? summary.latestWeight + 'kg' : 'Unknown'}

Write a 2-3 sentence 'Daily Insight' providing actionable advice to improve their VibeFit score and health. Be encouraging but direct. Write as if you are talking directly to them. DO NOT use hashtags.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    
    return { insight: result.response.text().trim() };
  } catch (error: any) {
    console.error('AI Insight Error:', error);
    return { insight: "Your AI coach is currently resting. Please check your API key or network connection." };
  }
}
