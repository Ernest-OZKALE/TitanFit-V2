'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

interface Message {
    id: string;
    content: string;
    sender_type: 'user' | 'agent';
    created_at: string;
}

export function ChatWidget() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Poll for new messages (Removed for AI Coach Version)
    // We handle the response directly after the POST request.

    // Load session from local storage on mount
    useEffect(() => {
        const storedSession = localStorage.getItem('titan_chat_session');
        if (storedSession) setSessionId(storedSession);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const content = input;
        setInput('');
        setLoading(true);

        // Optimistic update
        const optimisticMsg: Message = {
            id: Date.now().toString(),
            content,
            sender_type: 'user',
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        // Slight delay for UI
        setTimeout(scrollToBottom, 100);

        // Get dynamic context
        let userGoal = 'General Fitness';
        try {
            const settings = localStorage.getItem('titanfit_settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                if (parsed.goals?.daily_protein > 150) userGoal = 'Muscle Gain';
                else if (parsed.goals?.daily_calories < 2000) userGoal = 'Fat Loss';
            }
        } catch (e) { /* ignore */ }

        try {
            const res = await fetch('/api/ai-coach/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: content,
                    context: {
                        name: user?.user_metadata?.username || user?.email?.split('@')[0] || 'Athlete',
                        goal: userGoal,
                        level: 'Intermediate'
                    }
                })
            });
            const data = await res.json();

            if (data.reply) {
                const aiMsg: Message = {
                    id: (Date.now() + 1).toString(),
                    content: data.reply,
                    sender_type: 'agent',
                    created_at: new Date().toISOString()
                };
                setMessages(prev => [...prev, aiMsg]);
                setTimeout(scrollToBottom, 100);
            }
        } catch (e) {
            toast.error('Erreur de connexion au coach');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-black/90 border border-white/10 rounded-2xl w-[350px] h-[500px] shadow-2xl flex flex-col overflow-hidden mb-4 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-zinc-900 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#D4AF37] flex items-center justify-center text-black">
                                    <Bot className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold">TitanBot</h3>
                                    <p className="text-xs text-green-400 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                        En ligne
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                                <Minimize2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <p className="text-sm">Bonjour ! 👋</p>
                                    <p className="text-sm mt-1">Comment puis-je vous aider aujourd'hui ?</p>
                                </div>
                            )}
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.sender_type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`
                                        max-w-[80%] rounded-2xl px-4 py-2 text-sm
                                        ${msg.sender_type === 'user'
                                            ? 'bg-[#D4AF37] text-black self-end rounded-br-none'
                                            : 'bg-zinc-800 text-white self-start rounded-bl-none'}
                                    `}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10 bg-zinc-900 flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Écrivez votre message..."
                                className="flex-1 bg-zinc-800 border-none rounded-full px-4 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none"
                            />
                            <Button size="icon" onClick={sendMessage} disabled={!input.trim()} className="rounded-full bg-[#D4AF37] text-black hover:bg-[#B8860B] w-10 h-10">
                                <Send className="w-4 h-4 ml-0.5" />
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-[#D4AF37] text-black shadow-lg flex items-center justify-center hover:bg-[#B8860B] transition-colors"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
            </motion.button>
        </div>
    );
}
