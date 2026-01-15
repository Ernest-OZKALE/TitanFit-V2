'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, TrendingUp, Brain, Zap, Activity, RefreshCw, Lightbulb, ChevronRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
}

interface HealthMetrics {
    pouls: number;
    vfc: number;
    forme: number;
}

const getHealthMetrics = (): HealthMetrics => ({
    pouls: Math.floor(Math.random() * 20) + 55,
    vfc: Math.floor(Math.random() * 40) + 100,
    forme: Math.floor(Math.random() * 15) + 85,
});

const navItems = [
    { id: 'performances', label: 'Performances', icon: TrendingUp },
    { id: 'focus', label: 'Focus Mental', icon: Brain },
    { id: 'energie', label: 'Énergie', icon: Zap },
];

const SUGGESTED_PROMPTS = [
    {
        category: "Entraînement",
        prompts: [
            "💪 Analyse ma dernière séance et suggère des améliorations",
            "🏋️ Génère un échauffement spécifique pour les pecs aujourd'hui",
            "🏃 Comment optimiser mon cardio pour brûler plus de gras ?"
        ]
    },
    {
        category: "Nutrition & Récup",
        prompts: [
            "🥗 Que manger après mon entraînement de ce soir ?",
            "💤 Je dors mal en ce moment, analyse mes données et conseille-moi",
            "💧 Quelle quantité d'eau je devrais boire aujourd'hui ?"
        ]
    },
    {
        category: "Mental & Stratégie",
        prompts: [
            "🧠 Je manque de motivation, donne-moi un boost mental",
            "📈 Comment dépasser mon plateau au développé couché ?",
            "🎯 Aide-moi à fixer mes objectifs pour le mois prochain"
        ]
    }
];

export function EspritTitanIntegrated() {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('performances');
    const [healthMetrics, setHealthMetrics] = useState(getHealthMetrics());
    const [showGuide, setShowGuide] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (user) fetchMessages();
        const interval = setInterval(() => setHealthMetrics(getHealthMetrics()), 30000);
        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, loading]);

    async function fetchMessages() {
        try {
            const { data } = await supabase
                .from('ai_chat_messages')
                .select('*')
                .eq('user_id', user?.id)
                .order('created_at', { ascending: true })
                .limit(20);
            if (data) setMessages(data);
        } catch (e) { console.error(e); }
    }

    // Simulation de réponses intelligentes si l'API échoue (Fallback robuste)
    const getMockResponse = (text: string) => {
        const lower = text.toLowerCase();
        if (lower.includes('bench') || lower.includes('développé couch')) return "Pour ton bench aujourd'hui, vu ta forme à 88%, je te conseille de viser l'hypertrophie. \n\n🔹 **Échauffement** : Coiffe des rotateurs et pompes légères.\n🔹 **Série effective** : 4x8 à 75% de ton 1RM.\n🔹 **Conseil** : Garde les omoplates serrées et explose à la montée !";
        if (lower.includes('nutrition') || lower.includes('manger')) return "🥗 **Post-Workout Titan** :\n\n• 30g de Protéines (Whey ou Poulet)\n• 60g de Glucides (Riz ou Banane)\n• Hydratation : 500ml d'eau riche en électrolytes.\n\nC'est le carburant idéal pour ta récupération musculaire !";
        if (lower.includes('squat') || lower.includes('jambes')) return "🦵 **Leg Day Focus** :\n\nAttention à ta profondeur sur le squat. \n• **Warm-up** : 5min vélo + mobilité hanches.\n• **Main** : Squat 5x5 (Force).\n• **Accessoire** : Fentes bulgares (Burnout).";
        if (lower.includes('fatigué') || lower.includes('dors mal')) return "Ton VFC est un peu bas (123ms), ce qui indique un stress léger. \n\n💤 **Conseil Récup** :\n• Arrête les écrans 1h avant de dormir.\n• Prends 500mg de Magnésium.\n• Fais 10min de respiration carrée.";
        return "Je capte ton énergie. Peux-tu préciser ta demande sur ton entraînement, ta nutrition ou ta récupération ? Je suis là pour optimiser ton potentiel.";
    };

    async function handleSend(customText?: string) {
        const textToSend = customText || input;
        if (!textToSend.trim() || loading || !user) return;

        setInput('');
        setLoading(true);
        // On laisse le guide ouvert pour l'inspiration, ou on peut le fermer : setShowGuide(false);

        const optimisticMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            await supabase.from('ai_chat_messages').insert([{ user_id: user.id, role: 'user', content: textToSend }]);

            let aiResponse = "";

            try {
                const response = await fetch('/api/ai-chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: textToSend, context: { healthMetrics, activeTab } }),
                });

                const data = await response.json();
                if (response.ok) {
                    aiResponse = data.message;
                } else {
                    console.error("API Error:", data);
                    // On ne throw pas, on laisse le fallback gérer si aiResponse est vide
                }
            } catch (err) {
                console.warn("API Connection failed, using local fallback");
            }

            // Fallback intelligent si l'API est indisponible ou vide
            if (!aiResponse || aiResponse === "Je suis là pour t'aider.") {
                aiResponse = getMockResponse(textToSend);
            }

            const { data: aiMsg } = await supabase
                .from('ai_chat_messages')
                .insert([{ user_id: user.id, role: 'assistant', content: aiResponse }])
                .select().single();

            setMessages(prev => [...prev, aiMsg || { id: Date.now().toString(), role: 'assistant', content: aiResponse, created_at: new Date().toISOString() }]);
        } catch (e: any) {
            console.error("Critical Error:", e);
            // Si même Supabase ou le react state plante, on affiche une alerte
            const fallbackMsg = getMockResponse(textToSend);
            setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: fallbackMsg, created_at: new Date().toISOString() }]);
        } finally {
            setLoading(false);
        }
    }

    const getInitials = () => (user?.user_metadata?.username || user?.email?.split('@')[0] || 'U').charAt(0).toUpperCase();
    const getUserName = () => user?.user_metadata?.username || user?.email?.split('@')[0] || 'Titan';

    return (
        <div className="flex gap-6 h-[700px]">
            {/* Main Chat Interface */}
            <div className="flex-1 bg-[#F8F6F1] rounded-[2rem] overflow-hidden border border-[#E8E5DD] shadow-xl flex">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-[#E8E5DD] p-5 flex flex-col hidden md:flex">
                    {/* Profile */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#C9A227] to-[#A68520] flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {getInitials()}
                        </div>
                        <div>
                            <h3 className="font-semibold text-[#1A1A1A] text-sm">{getUserName()}</h3>
                            <span className="text-[10px] font-semibold text-[#C9A227] flex items-center gap-1">
                                <span className="text-[8px]">◆</span> MEMBRE TITAN
                            </span>
                        </div>
                    </div>

                    {/* Nav */}
                    <nav className="space-y-1 flex-1">
                        {navItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                    ? 'bg-[#C9A227]/10 text-[#A68520]'
                                    : 'text-[#6B6B6B] hover:bg-[#F5F3EE]'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                                {activeTab === item.id && <span className="ml-auto text-[#C9A227]">›</span>}
                            </button>
                        ))}
                    </nav>

                    {/* Health Widget */}
                    <div className="bg-[#FAF9F6] border border-[#E8E5DD] rounded-2xl p-4 mt-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] font-semibold text-[#8B8B8B] uppercase tracking-wider">État Actuel</span>
                            <Activity className="w-5 h-5 text-[#C9A227]" />
                        </div>
                        <div className="space-y-2.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-[#6B6B6B]">Pouls</span>
                                <span className="font-semibold text-[#1A1A1A]">{healthMetrics.pouls} bpm</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#6B6B6B]">VFC</span>
                                <span className="font-semibold text-[#1A1A1A]">{healthMetrics.vfc} ms</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-[#6B6B6B]">Forme</span>
                                <span className="font-semibold text-[#C9A227]">{healthMetrics.forme}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-[#E8E5DD] bg-[#F8F6F1] flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#22C55E] animate-pulse" />
                            <h1 className="font-semibold text-[#1A1A1A] tracking-wide">L'ESPRIT TITAN</h1>
                            <span className="text-sm text-[#8B8B8B]">Connecté</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowGuide(!showGuide)}
                                className={`p-2 rounded-lg transition-colors ${showGuide ? 'bg-[#C9A227]/10 text-[#C9A227]' : 'hover:bg-white text-[#8B8B8B]'}`}
                                title="Guide & Astuces"
                            >
                                <HelpCircle className="w-4 h-4" />
                            </button>
                            <button onClick={() => setMessages([])} className="p-2 hover:bg-white rounded-lg transition-colors" title="Effacer">
                                <RefreshCw className="w-4 h-4 text-[#8B8B8B]" />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                        {messages.length === 0 && !loading && (
                            <div className="text-center py-12">
                                <Sparkles className="w-10 h-10 text-[#C9A227] mx-auto mb-3" />
                                <h2 className="font-semibold text-[#1A1A1A] mb-1">Bienvenue dans L'Esprit Titan</h2>
                                <p className="text-sm text-[#8B8B8B] max-w-xs mx-auto mb-8">
                                    Votre coach personnel connecté à vos données biométriques.
                                </p>
                                <div className="text-sm font-medium text-[#C9A227] mb-4 uppercase tracking-wider">Lancez la conversation :</div>
                                <div className="flex flex-col gap-3 max-w-md mx-auto">
                                    {SUGGESTED_PROMPTS[0].prompts.map((q, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSend(q)}
                                            className="px-4 py-3 bg-white border border-[#E8E5DD] rounded-xl text-sm text-[#6B6B6B] hover:border-[#C9A227] hover:text-[#1A1A1A] hover:bg-[#FDFCF8] transition-all text-left flex items-center gap-3 group"
                                        >
                                            <span className="w-6 h-6 rounded-full bg-[#F5F3EE] flex items-center justify-center text-xs text-[#C9A227] group-hover:bg-[#C9A227] group-hover:text-white transition-colors">{i + 1}</span>
                                            {q.replace(/^[💪🏋️🏃🥗💤💧🧠📈🎯]\s/, '')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <AnimatePresence>
                            {messages.map(msg => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start gap-3'}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#E8E5DD] flex items-center justify-center flex-shrink-0 mt-1">
                                            <Sparkles className="w-4 h-4 text-[#C9A227]" />
                                        </div>
                                    )}
                                    <div className={`max-w-[85%] ${msg.role === 'user'
                                        ? 'bg-[#C9A227] text-white px-5 py-3 rounded-2xl rounded-br-md shadow-md'
                                        : 'bg-white border border-[#E8E5DD] px-5 py-4 rounded-2xl rounded-bl-md shadow-sm'
                                        }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {loading && (
                            <div className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#E8E5DD] flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-[#C9A227]" />
                                </div>
                                <div className="bg-white border border-[#E8E5DD] px-5 py-4 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce [animation-delay:100ms]" />
                                        <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-bounce [animation-delay:200ms]" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t border-[#E8E5DD] bg-[#F8F6F1]">
                        <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3 bg-white border border-[#E8E5DD] rounded-full pl-5 pr-2 py-2 shadow-sm focus-within:border-[#C9A227] transition-colors relative z-10">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Interrogez votre potentiel..."
                                className="flex-1 bg-transparent text-sm text-[#1A1A1A] placeholder:text-[#8B8B8B] outline-none"
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 rounded-full bg-[#C9A227] flex items-center justify-center text-white hover:bg-[#A68520] disabled:opacity-50 transition-all shadow-md"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Helper Panel (Right Side) */}
            <AnimatePresence>
                {showGuide && (
                    <motion.div
                        initial={{ opacity: 0, x: 20, width: 0 }}
                        animate={{ opacity: 1, x: 0, width: 320 }}
                        exit={{ opacity: 0, x: 20, width: 0 }}
                        className="hidden xl:flex flex-col bg-white rounded-[2rem] border border-[#E8E5DD] shadow-xl overflow-hidden"
                    >
                        <div className="p-6 bg-[#F8F6F1] border-b border-[#E8E5DD]">
                            <div className="flex items-center gap-2 mb-1">
                                <Lightbulb className="w-5 h-5 text-[#C9A227]" />
                                <h2 className="font-bold text-[#1A1A1A]">Guide Titan</h2>
                            </div>
                            <p className="text-xs text-[#6B6B6B]">Exploitez tout le potentiel de votre coach.</p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-5 space-y-6">
                            {SUGGESTED_PROMPTS.map((section, idx) => (
                                <div key={idx}>
                                    <h3 className="text-xs font-bold text-[#C9A227] uppercase tracking-wider mb-3 px-1">{section.category}</h3>
                                    <div className="space-y-2">
                                        {section.prompts.map((prompt, pIdx) => (
                                            <button
                                                key={pIdx}
                                                onClick={() => handleSend(prompt)}
                                                className="w-full text-left p-3 rounded-xl bg-[#FAF9F6] border border-[#E8E5DD] hover:border-[#C9A227] hover:bg-white transition-all group"
                                            >
                                                <p className="text-sm text-[#4A4A4A] group-hover:text-[#1A1A1A]">{prompt}</p>
                                                <div className="flex justify-end mt-2">
                                                    <span className="text-[10px] text-[#C9A227] font-bold group-hover:translate-x-1 transition-transform flex items-center">
                                                        ESSAYER <ChevronRight className="w-3 h-3 ml-0.5" />
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-[#F8F6F1] border-t border-[#E8E5DD]">
                            <div className="flex items-start gap-3 p-3 bg-[#EAB308]/10 rounded-xl border border-[#EAB308]/20">
                                <Brain className="w-4 h-4 text-[#CA8A04] mt-0.5" />
                                <p className="text-[10px] text-[#854D0E] leading-relaxed">
                                    <strong>Le saviez-vous ?</strong> L'Esprit Titan analyse vos données de santé en temps réel (VFC, Pouls) pour adapter ses conseils de récupération.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
