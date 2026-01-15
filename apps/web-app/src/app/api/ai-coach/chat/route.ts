import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        if (!message) {
            return NextResponse.json({ error: "No message provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const systemPrompt = `
            You are Titan Coach, an elite AI fitness and nutrition expert.
            Your tone is motivating, professional, severe but fair (like a strict but caring coach).
            
            User Context:
            - Name: ${context?.name || 'Athlete'}
            - Goal: ${context?.goal || 'General Fitness'}
            - Level: ${context?.level || 'Intermediate'}

            Rules:
            1. Keep answers concise and actionable (max 3-4 sentences unless asked for a plan).
            2. Use emojis sparingly but effectively (🔥, 💪).
            3. Focus on science-backed advice for bodybuilding and performance.
            4. If asked about medical issues, disclaim you are an AI.
        `;

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Who are you?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "I am Titan Coach. Detailed to forge your physique into its ultimate form. What is our mission today?" }],
                },
            ],
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(`${systemPrompt}\n\nUser Question: ${message}`);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });

    } catch (error: any) {
        console.error("AI Coach Error:", error);
        return NextResponse.json({ error: "Failed to process message", details: error.message }, { status: 500 });
    }
}
