import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { image } = await req.json(); // Expect base64 string

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Remove header if present (data:image/jpeg;base64,)
        const base64Data = image.split(",")[1] || image;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an expert nutritionist AI. Analyze this food image.
            Return a STRICT JSON object (no markdown, no backticks) with these fields:
            {
                "name": "Short descriptive name of the food",
                "cals": number (approximate calories),
                "macros": { 
                    "p": number (protein g), 
                    "c": number (carbs g), 
                    "f": number (fat g) 
                },
                "confidence": number (0-100 score of how sure you are),
                "insight": "One short witty sentence about this meal's nutritional value for a bodybuilder."
            }
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean cleanupjson
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanedText);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Vision Error:", error);
        return NextResponse.json({ error: "Failed to analyze image", details: error.message }, { status: 500 });
    }
}
