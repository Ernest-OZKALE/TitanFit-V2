'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Send, User, Clock, CheckCircle, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ChatSession {
    id: string;
    status: string;
    last_message_at: string;
    user?: { email: string };
    guest_name?: string;
    last_message?: { content: string };
}

interface Message {
    id: string;
    content: string;
    sender_type: 'user' | 'agent';
    created_at: string;
}

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);

    // Fetch sessions
    const fetchSessions = async () => {
        try {
            const res = await fetch(`/api/admin/chat/sessions?status=active`);
            const data = await res.json();
            setSessions(data.sessions || []);
        } catch { toast.error('Erreur chargement sessions'); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchSessions(); const i = setInterval(fetchSessions, 10000); return () => clearInterval(i); }, []);

    // Fetch messages for selected session
    useEffect(() => {
        if (!selectedSession) return;

        const fetchMessages = async () => {
            const res = await fetch(`/api/chat?session_id=${selectedSession.id}`);
            const data = await res.json();
            setMessages(data.messages || []);
            scrollToBottom();
        };

        fetchMessages();
        const i = setInterval(fetchMessages, 3000); // Polling for MVP
        return () => clearInterval(i);
    }, [selectedSession]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const sendMessage = async () => {
        if (!input.trim() || !selectedSession) return;

        const content = input;
        setInput('');

        // Optimistic
        const optimisticMsg: Message = {
            id: Date.now().toString(),
            content,
            sender_type: 'agent',
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);
        scrollToBottom();

        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    session_id: selectedSession.id,
                    sender_type: 'agent'
                })
            });
            // Refetch done by poller
        } catch { toast.error('Erreur d\'envoi'); }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex border border-white/10 rounded-xl overflow-hidden bg-zinc-900/50">
            {/* Sidebar List */}
            <div className="w-80 border-r border-white/10 flex flex-col bg-zinc-900/50">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h2 className="font-bold flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                        Conversations
                    </h2>
                    <Button variant="ghost" size="sm" onClick={fetchSessions}><RefreshCcw className="w-4 h-4" /></Button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Chargement...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm">Aucune conversation active</div>
                    ) : (
                        sessions.map(session => (
                            <button
                                key={session.id}
                                onClick={() => setSelectedSession(session)}
                                className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 transition-colors ${selectedSession?.id === session.id ? 'bg-[#D4AF37]/10 border-l-2 border-l-[#D4AF37]' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium truncate text-sm">
                                        {session.user?.email || session.guest_name || 'Invité'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {new Date(session.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-400 truncate">
                                    {session.last_message?.content || 'Nouvelle conversation'}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            {selectedSession ? (
                <div className="flex-1 flex flex-col bg-zinc-950/50">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                                <h3 className="font-bold">{selectedSession.user?.email || 'Invité'}</h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    Démarré le {new Date().toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Fermer le ticket</Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[70%]`}>
                                    <div className={`
                                        rounded-2xl px-4 py-2 text-sm
                                        ${msg.sender_type === 'agent'
                                            ? 'bg-[#D4AF37] text-black rounded-br-none'
                                            : 'bg-zinc-800 text-white rounded-bl-none'}
                                    `}>
                                        {msg.content}
                                    </div>
                                    <p className={`text-[10px] text-gray-500 mt-1 ${msg.sender_type === 'agent' ? 'text-right' : 'text-left'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-white/10 bg-zinc-900">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Répondre..."
                                className="flex-1 bg-zinc-800 border-none rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-[#D4AF37] outline-none"
                            />
                            <Button onClick={sendMessage} disabled={!input.trim()} className="bg-[#D4AF37] text-black hover:bg-[#B8860B] h-auto px-6">
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
                    <MessageSquare className="w-16 h-16 opacity-20 mb-4" />
                    <p>Sélectionnez une conversation pour commencer</p>
                </div>
            )}
        </div>
    );
}
