
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'Gemini API key not configured',
                fallback: "Je suis désolé, je ne peux pas me connecter à mon cerveau (Gemini API Key manquante). Veuillez configurer la clé API."
            }, { status: 500 });
        }

        const systemPrompt = `Tu es TitanFit AI, un coach d'élite en fitness et nutrition. 
        Ton ton est motivant, professionnel et concis. 
        Tu aides les utilisateurs avec des plans d'entraînement, des conseils nutritionnels et le mindset.
        Réponds toujours en français sauf si l'utilisateur parle une autre langue.
        Sois direct et utilise des points (bullets) quand c'est utile.`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${systemPrompt}\n\nUser Message: ${message}`
                    }]
                }]
            }),
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        // Gemini Response Structure parsing
        const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiMessage) {
            throw new Error('No content in response');
        }

        return NextResponse.json({ message: aiMessage });

    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({
            error: 'Failed to generate response',
            details: error.message
        }, { status: 500 });
    }
}
