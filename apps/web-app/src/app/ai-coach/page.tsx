'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { EspritTitanSidebar } from '@/components/ai-coach/EspritTitanSidebar';
import { EspritTitanChat } from '@/components/ai-coach/EspritTitanChat';
import './esprit-titan.css';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
};

// Métriques de santé simulées (à connecter avec les vraies données plus tard)
const getHealthMetrics = () => {
    return {
        pouls: Math.floor(Math.random() * 20) + 55, // 55-75 bpm au repos
        vfc: Math.floor(Math.random() * 40) + 100, // 100-140 ms
        forme: Math.floor(Math.random() * 15) + 85, // 85-100%
    };
};

export default function EspritTitanPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [healthMetrics, setHealthMetrics] = useState(getHealthMetrics());
    const [activeTab, setActiveTab] = useState('performances');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchMessages();

        // Rafraîchir les métriques de santé toutes les 30 secondes
        const interval = setInterval(() => {
            setHealthMetrics(getHealthMetrics());
        }, 30000);

        return () => clearInterval(interval);
    }, [user]);

    async function fetchMessages() {
        try {
            const { data, error } = await supabase
                .from('ai_chat_messages')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: true })
                .limit(50);

            if (!error && data) {
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setInitialLoading(false);
        }
    }

    async function handleSendMessage(userMessage: string) {
        if (!userMessage.trim() || !user) return;

        setLoading(true);

        // Optimistic UI update
        const tempId = Date.now().toString();
        const optimisticUserMsg: Message = {
            id: tempId,
            role: 'user',
            content: userMessage,
            created_at: new Date().toISOString()
        };
        setMessages((prev) => [...prev, optimisticUserMsg]);

        try {
            // Save user message to DB
            await supabase
                .from('ai_chat_messages')
                .insert([{ user_id: user.id, role: 'user', content: userMessage }]);

            // Build context-aware prompt
            const contextInfo = {
                name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Athlete',
                healthMetrics,
                activeTab,
                time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
            };

            // Call API
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    context: contextInfo
                }),
            });

            const data = await response.json();
            const aiResponse = data.message || data.fallback || "Je suis là pour t'aider. Reformule ta question.";

            // Save AI message to DB
            const { data: aiMsg } = await supabase
                .from('ai_chat_messages')
                .insert([{ user_id: user.id, role: 'assistant', content: aiResponse }])
                .select()
                .single();

            if (aiMsg) {
                setMessages((prev) => [...prev, aiMsg]);
            } else {
                setMessages((prev) => [...prev, {
                    id: Date.now().toString(),
                    role: 'assistant',
                    content: aiResponse,
                    created_at: new Date().toISOString()
                }]);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "Une erreur est survenue. Ton potentiel reste intact, réessaie.",
                created_at: new Date().toISOString()
            }]);
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <div className="esprit-container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Loader2
                    className="w-12 h-12 animate-spin"
                    style={{ color: 'var(--esprit-gold)' }}
                />
            </div>
        );
    }

    return (
        <div className="esprit-container">
            <EspritTitanSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                healthMetrics={healthMetrics}
            />
            <EspritTitanChat
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={loading}
            />
        </div>
    );
}
