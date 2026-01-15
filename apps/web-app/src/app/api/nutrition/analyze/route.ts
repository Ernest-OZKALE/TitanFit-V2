import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { text } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert nutritionist AI. 
            Analyze the following natural language description of a meal: "${text}".
            
            Return a strictly valid JSON object with the following structure:
            {
                "items": [
                    {
                        "name": "Name of the food item (e.g., 'Chicken Breast')",
                        "quantity": "Estimated quantity (e.g., '150g' or '2 slices')",
                        "calories": 100,
                        "protein": 20,
                        "carbs": 0,
                        "fat": 2
                    }
                ],
                "total": {
                    "calories": 0,
                    "protein": 0,
                    "carbs": 0,
                    "fat": 0
                }
            }
            
            Rules:
            1. Estimate portion sizes if not specified (use standard serving sizes).
            2. Be as accurate as possible with nutritional values.
            3. Return ONLY the JSON object, no markdown formatting or extra text.
            4. If the input is gibberish or not food, return an empty items array.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let jsonString = response.text();

        // Clean up markdown if Gemini wraps it
        jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

        const data = JSON.parse(jsonString);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("AI Nutrition Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze meal", details: error.message }, { status: 500 });
    }
}
