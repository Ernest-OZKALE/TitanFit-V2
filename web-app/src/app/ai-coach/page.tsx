'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Bot, User, ArrowLeft, Loader2 } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
};

export default function AICoachPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        fetchMessages();
    }, [user]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    async function fetchMessages() {
        const { data, error } = await supabase
            .from('ai_chat_messages')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: true })
            .limit(50);

        if (!error && data) {
            setMessages(data);
        }
        setInitialLoading(false);
    }

    async function sendMessage() {
        if (!input.trim() || !user) return;

        const userMessage = input.trim();
        setInput('');
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

            // Call API
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage }),
            });

            const data = await response.json();
            const aiResponse = data.message || data.fallback || "Erreur de communication avec le coach.";

            // Save AI message to DB
            const { data: aiMsg } = await supabase
                .from('ai_chat_messages')
                .insert([{ user_id: user.id, role: 'assistant', content: aiResponse }])
                .select()
                .single();

            if (aiMsg) {
                setMessages((prev) => [...prev, aiMsg]);
            } else {
                // Fallback if DB save fails but we got response
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
                content: "Désolé, une erreur est survenue. Veuillez réessayer.",
                created_at: new Date().toISOString()
            }]);
        } finally {
            setLoading(false);
        }
    }

    if (initialLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden text-gray-100 flex flex-col font-sans">
            <TitaniumBackground />
            <div className="absolute inset-0 bg-black/80 z-0 pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/dashboard')}
                            className="text-gray-400 hover:text-[#D4AF37] hover:bg-white/5"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-yellow-700 flex items-center justify-center shadow-[0_0_15px_-5px_#D4AF37]">
                                <Bot className="h-6 w-6 text-black" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white leading-tight">Titan Neural Coach</h1>
                                <p className="text-xs text-[#D4AF37] font-medium">En ligne • Elite Performance</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto relative z-10">
                <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-black/40 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-md"
                        >
                            <div className="w-16 h-16 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]/20">
                                <Bot className="h-8 w-8 text-[#D4AF37]" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Bienvenue dans l'Arène, Titan.</h2>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Je suis votre système de support neural. Posez-moi des questions sur votre nutrition, vos entraînements ou votre récupération.
                            </p>
                            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <button onClick={() => setInput("Comment optimiser ma prise de masse ?")} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors text-left">
                                    💪 Comment optimiser ma prise de masse ?
                                </button>
                                <button onClick={() => setInput("J'ai une fringale, que faire ?")} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors text-left">
                                    🍎 J'ai une fringale, que faire ?
                                </button>
                                <button onClick={() => setInput("Crée-moi un programme Full Body")} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors text-left">
                                    🏋️ Crée-moi un programme Full Body
                                </button>
                                <button onClick={() => setInput("Analyse mes macros")} className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm text-gray-300 transition-colors text-left">
                                    📊 Analyse mes macros
                                </button>
                            </div>
                        </motion.div>
                    )}

                    <AnimatePresence>
                        {messages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex items-end space-x-2 max-w-[85%] md:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>

                                    {/* Avatar */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                        ? 'bg-[#333] border border-white/20'
                                        : 'bg-[#D4AF37] shadow-[0_0_10px_-2px_#D4AF37]'
                                        }`}>
                                        {message.role === 'user' ? (
                                            <User className="h-4 w-4 text-gray-300" />
                                        ) : (
                                            <Bot className="h-4 w-4 text-black" />
                                        )}
                                    </div>

                                    {/* Bubble */}
                                    <div className={`px-5 py-3 rounded-2xl shadow-md ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-[#D4AF37] to-yellow-700 text-black font-medium rounded-br-none'
                                        : 'bg-white/10 border border-white/10 text-gray-100 rounded-bl-none backdrop-blur-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {loading && (
                        <div className="flex justify-start">
                            <div className="flex items-end space-x-2">
                                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-[0_0_10px_-2px_#D4AF37]">
                                    <Bot className="h-4 w-4 text-black" />
                                </div>
                                <div className="px-4 py-3 rounded-2xl bg-white/10 border border-white/10 rounded-bl-none">
                                    <div className="flex space-x-1.5">
                                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-100"></div>
                                        <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} className="h-4" />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-black/60 border-t border-white/10 backdrop-blur-xl sticky bottom-0 z-20 p-4">
                <div className="max-w-4xl mx-auto">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        className="relative flex items-center"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Posez votre question..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12 h-14 rounded-xl focus:border-[#D4AF37] focus:ring-[#D4AF37]/20"
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="absolute right-2 top-2 bottom-2 w-10 h-10 p-0 bg-[#D4AF37] hover:bg-[#F5C518] text-black rounded-lg transition-transform hover:scale-105"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
