import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export async function POST(req: Request) {
    try {
        const { message, context } = await req.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // 1. Tenter OLLAMA (Local ou Distant) d'abord
        const ollamaUrl = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434';

        try {
            // On tente une connexion (timeout 2s)
            const ollamaController = new AbortController();
            const timeoutId = setTimeout(() => ollamaController.abort(), 2000);

            const ollamaCheck = await fetch(`${ollamaUrl}/api/tags`, {
                method: 'GET',
                signal: ollamaController.signal
            }).catch(() => null);

            clearTimeout(timeoutId);

            if (ollamaCheck?.ok) {
                console.log(`✅ OLLAMA détecté sur ${ollamaUrl}. Utilisation du cerveau privé.`);

                const ollamaResponse = await fetch(`${ollamaUrl}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model: "mistral",
                        messages: [
                            { role: "system", content: "Tu es un coach sportif expert. Réponds en français. Sois bref et direct." },
                            { role: "user", content: message }
                        ],
                        stream: false
                    })
                });

                const ollamaData = await ollamaResponse.json();
                if (ollamaData.message?.content) {
                    return NextResponse.json({ message: ollamaData.message.content });
                }
            }
        } catch (e) {
            console.log(`Ollama (sur ${ollamaUrl}) non détecté, passage au Cloud.`);
        }

        // 2. Fallback sur GEMINI (Cloud) si Ollama n'est pas là
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let contextString = "";
        if (context) {
            const { healthMetrics, activeTab, time } = context;
            contextString = `[CONTEXTE] Heure: ${time || 'N/A'}, Pouls: ${healthMetrics?.pouls || '?'}bpm, VFC: ${healthMetrics?.vfc || '?'}ms`;
        }

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `Tu es un coach sportif expert. Réponds en français. Adapte au cycle menstruel/fatigue si mentionné. Contexte: ${contextString}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Compris. Je suis prêt." }],
                },
            ],
            // Désactivation TOTALE de la sécurité pour éviter les faux positifs sur 'corps/règles'
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json({ message: text });

    } catch (error: any) {
        console.error('Final AI Error:', error);
        return NextResponse.json({
            error: 'AI Generation Failed',
            details: error.message,
            fallback: "Je suis temporairement indisponible."
        }, { status: 500 });
    }
}
