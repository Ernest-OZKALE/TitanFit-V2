'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Search, Clock, User, AlertCircle, CheckCircle, Send, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Ticket {
    id: string;
    ticket_number: string;
    user_email: string;
    user_name?: string;
    subject: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Message {
    id: string;
    sender_type: string;
    message: string;
    is_internal: boolean;
    created_at: string;
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [stats, setStats] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => { fetchTickets(); }, [statusFilter]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/tickets?status=${statusFilter}`);
            const data = await res.json();
            setTickets(data.tickets || []);
            setStats(data.stats || {});
        } catch { toast.error('Erreur'); }
        finally { setLoading(false); }
    };

    const openTicket = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        const res = await fetch(`/api/admin/tickets?id=${ticket.id}`);
        const data = await res.json();
        setMessages(data.messages || []);
    };

    const updateStatus = async (ticketId: string, status: string) => {
        await fetch('/api/admin/tickets', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: ticketId, status }),
        });
        fetchTickets();
        toast.success(`Statut: ${status}`);
    };

    const getStatusColor = (s: string) => {
        const colors: Record<string, string> = {
            open: 'bg-yellow-500/20 text-yellow-400',
            in_progress: 'bg-blue-500/20 text-blue-400',
            waiting_customer: 'bg-purple-500/20 text-purple-400',
            resolved: 'bg-green-500/20 text-green-400',
            closed: 'bg-gray-500/20 text-gray-400',
        };
        return colors[s] || 'bg-gray-500/20';
    };

    const getPriorityColor = (p: string) => {
        const colors: Record<string, string> = {
            low: 'text-gray-400', medium: 'text-yellow-400', high: 'text-orange-400', urgent: 'text-red-400',
        };
        return colors[p] || '';
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <MessageSquare className="w-7 h-7 text-[#D4AF37]" />
                        Support Tickets
                    </h1>
                    <p className="text-gray-500">{tickets.length} tickets</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-5 gap-3">
                {[
                    { key: 'open', label: 'Ouverts', icon: <AlertCircle className="w-4 h-4" /> },
                    { key: 'in_progress', label: 'En cours', icon: <Clock className="w-4 h-4" /> },
                    { key: 'waiting_customer', label: 'Attente client', icon: <User className="w-4 h-4" /> },
                    { key: 'resolved', label: 'Résolus', icon: <CheckCircle className="w-4 h-4" /> },
                    { key: 'closed', label: 'Fermés', icon: <CheckCircle className="w-4 h-4" /> },
                ].map(s => (
                    <button
                        key={s.key}
                        onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}
                        className={`p-3 rounded-xl border transition-all ${statusFilter === s.key ? 'border-[#D4AF37] bg-[#D4AF37]/10' : 'border-white/10 bg-zinc-900/50 hover:border-white/20'}`}
                    >
                        <div className={getStatusColor(s.key).split(' ')[1]}>{s.icon}</div>
                        <p className="text-xl font-bold mt-1">{stats[s.key] || 0}</p>
                        <p className="text-xs text-gray-500">{s.label}</p>
                    </button>
                ))}
            </div>

            {/* Tickets List */}
            <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Chargement...</div>
                ) : tickets.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">Aucun ticket</div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {tickets.map(t => (
                            <motion.div
                                key={t.id}
                                whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                                onClick={() => openTicket(t)}
                                className="p-4 cursor-pointer"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-sm text-[#D4AF37]">{t.ticket_number}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded ${getStatusColor(t.status)}`}>{t.status}</span>
                                        <span className={`text-xs ${getPriorityColor(t.priority)}`}>●</span>
                                    </div>
                                    <span className="text-xs text-gray-500">{new Date(t.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                <p className="font-medium mt-2">{t.subject}</p>
                                <p className="text-sm text-gray-500">{t.user_email}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Ticket Detail Modal */}
            <AnimatePresence>
                {selectedTicket && (
                    <TicketDetail
                        ticket={selectedTicket}
                        messages={messages}
                        onClose={() => setSelectedTicket(null)}
                        onUpdateStatus={(s: string) => updateStatus(selectedTicket.id, s)}
                        onRefresh={() => openTicket(selectedTicket)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function TicketDetail({ ticket, messages, onClose, onUpdateStatus, onRefresh }: any) {
    const [reply, setReply] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [sending, setSending] = useState(false);

    const sendReply = async () => {
        if (!reply.trim()) return;
        setSending(true);
        try {
            await fetch('/api/admin/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'add_message', ticket_id: ticket.id, message: reply, is_internal: isInternal }),
            });
            setReply('');
            onRefresh();
            toast.success('Réponse envoyée');
        } catch { toast.error('Erreur'); }
        finally { setSending(false); }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(e?: any) => e?.stopPropagation()}>
                {/* Header */}
                <div className="p-4 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-[#D4AF37]">{ticket.ticket_number}</span>
                        <select
                            value={ticket.status}
                            onChange={e => onUpdateStatus(e.target.value)}
                            className="bg-zinc-800 border border-white/10 rounded px-2 py-1 text-sm"
                        >
                            <option value="open">Ouvert</option>
                            <option value="in_progress">En cours</option>
                            <option value="waiting_customer">Attente client</option>
                            <option value="resolved">Résolu</option>
                            <option value="closed">Fermé</option>
                        </select>
                    </div>
                    <h3 className="font-bold text-lg mt-2">{ticket.subject}</h3>
                    <p className="text-sm text-gray-500">{ticket.user_email}</p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                    {messages.map((m: Message) => (
                        <div key={m.id} className={`flex ${m.sender_type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-xl ${m.sender_type === 'agent'
                                ? m.is_internal ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-[#D4AF37]/20'
                                : 'bg-zinc-800'
                                }`}>
                                {m.is_internal && <span className="text-xs text-yellow-400 block mb-1">Note interne</span>}
                                <p className="text-sm">{m.message}</p>
                                <span className="text-xs text-gray-500 mt-1 block">{new Date(m.created_at).toLocaleString('fr-FR')}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reply */}
                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                        <label className="flex items-center gap-2 text-sm text-gray-400">
                            <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} />
                            Note interne
                        </label>
                    </div>
                    <div className="flex gap-2">
                        <textarea
                            value={reply}
                            onChange={e => setReply(e.target.value)}
                            placeholder="Votre réponse..."
                            rows={2}
                            className="flex-1 bg-zinc-800 border border-white/10 rounded-lg px-4 py-2 resize-none"
                        />
                        <Button onClick={sendReply} disabled={sending} className="bg-[#D4AF37] text-black">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}
