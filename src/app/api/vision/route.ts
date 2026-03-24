import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { imageBase64, scanType } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: 'Gemini API Key is missing in .env.local' }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = scanType === 'scale' 
      ? 'You are a strict data extraction AI. Look at this image of a weighing scale. Extract ONLY the numeric weight displayed. Do not write any text, words, or symbols. Just the number itself (e.g. 75.5).'
      : scanType === 'food'
      ? 'You are a nutrition AI. Estimate the main food item and its total calories. Return EXACTLY in this format: Food Name | 450'
      : 'You are a fitness AI. Identify this gym equipment and suggest ONE primary exercise. Return EXACTLY the exercise name.';

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
            data: imageBase64.split(',')[1], // Remove the data URI prefix
            mimeType: imageBase64.split(';')[0].split(':')[1] || "image/jpeg"
        }
      }
    ]);

    const responseText = result.response.text();

    return NextResponse.json({ success: true, result: responseText.trim() });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json({ error: error.message || 'AI processing failed' }, { status: 500 });
  }
}
