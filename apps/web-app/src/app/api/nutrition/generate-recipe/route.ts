import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { ingredients } = await req.json();

        if (!ingredients || ingredients.length === 0) {
            return NextResponse.json({ error: "No ingredients provided" }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
            You are an elite bodybuilding chef. Create 2 unique, high-protein recipes using THESE ingredients: ${ingredients.join(", ")}.
            You can assume basic pantry staples (oil, salt, pepper, spices).
            
            Return a STRICT JSON array of objects (no markdown blocks). Format:
            [
                {
                    "title": "Recipe Name (Creative & Epic)",
                    "time": "Prep time (e.g. 15 min)",
                    "cals": number (approx calories),
                    "protein": number (approx protein g),
                    "match": number (percentage 0-100 based on how well it uses the inputs),
                    "desc": "Short appetizing description focussing on muscle building benefits.",
                    "tags": ["Tag1", "Tag2", "Tag3"]
                },
                ... (2 recipes total)
            ]
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean cleanupjson
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const data = JSON.parse(cleanedText);

        return NextResponse.json(data);

    } catch (error: any) {
        console.error("Recipe Gen Error:", error);
        return NextResponse.json({ error: "Failed to generate recipes", details: error.message }, { status: 500 });
    }
}
