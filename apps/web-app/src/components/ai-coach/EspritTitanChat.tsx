'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageSection {
    icon: string;
    title: string;
    content: string;
    bullets?: string[];
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sections?: MessageSection[];
    created_at: string;
}

interface EspritTitanChatProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading?: boolean;
}

// Parser pour extraire les sections du message IA
function parseAIMessage(content: string): MessageSection[] {
    // Essayer de détecter des patterns de sections
    const sectionPatterns = [
        { regex: /bilan|analyse|évaluation/i, icon: '⚡', title: 'BILAN DE FORME' },
        { regex: /activation|échauffement|préparation/i, icon: '🔥', title: 'ACTIVATION MUSCULAIRE' },
        { regex: /nutrition|repas|calories|protéines/i, icon: '🍎', title: 'CONSEIL NUTRITION' },
        { regex: /entraînement|exercice|workout/i, icon: '💪', title: 'PROGRAMME TRAINING' },
        { regex: /récupération|repos|sommeil/i, icon: '😴', title: 'RÉCUPÉRATION' },
        { regex: /mental|motivation|focus/i, icon: '🧠', title: 'FOCUS MENTAL' },
    ];

    // Détecter les bullet points
    const bulletMatch = content.match(/[•\-\*]\s*(.+?)(?=\n|$)/g);
    const bullets = bulletMatch
        ? bulletMatch.map(b => b.replace(/^[•\-\*]\s*/, '').trim())
        : undefined;

    // Trouver la section appropriée
    for (const pattern of sectionPatterns) {
        if (pattern.regex.test(content)) {
            // Nettoyer le contenu des bullets pour le texte principal
            let mainContent = content;
            if (bullets) {
                mainContent = content.replace(/[•\-\*]\s*.+?(?=\n|$)/g, '').trim();
            }

            return [{
                icon: pattern.icon,
                title: pattern.title,
                content: mainContent,
                bullets
            }];
        }
    }

    // Section par défaut
    return [{
        icon: '⚡',
        title: 'RÉPONSE TITAN',
        content,
        bullets
    }];
}

export function EspritTitanChat({ messages, onSendMessage, isLoading = false }: EspritTitanChatProps) {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <main className="esprit-main">
            {/* Header */}
            <header className="esprit-chat-header">
                <div className="esprit-chat-title">
                    <div className="esprit-status-dot online" />
                    <h1>L'ESPRIT TITAN</h1>
                    <span className="esprit-status">Connecté</span>
                </div>
                <button className="esprit-lock-btn" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Lock className="w-5 h-5" style={{ color: 'var(--esprit-text-muted)' }} />
                </button>
            </header>

            {/* Zone de messages */}
            <div className="esprit-messages">
                <AnimatePresence mode="popLayout">
                    {messages.length === 0 && !isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="esprit-welcome"
                            style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: 'var(--esprit-text-muted)'
                            }}
                        >
                            <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--esprit-gold)' }} />
                            <h2 style={{
                                fontSize: '20px',
                                fontWeight: 600,
                                color: 'var(--esprit-text)',
                                marginBottom: '8px'
                            }}>
                                Bienvenue dans L'Esprit Titan
                            </h2>
                            <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: 1.6 }}>
                                Votre coach personnel est prêt à analyser vos performances
                                et optimiser votre potentiel.
                            </p>
                        </motion.div>
                    )}

                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {message.role === 'user' ? (
                                <div className="esprit-user-message">
                                    <div className="esprit-user-bubble">
                                        {message.content}
                                    </div>
                                </div>
                            ) : (
                                <div className="esprit-ai-message">
                                    <div className="esprit-ai-avatar">
                                        <Sparkles />
                                    </div>
                                    <div className="esprit-ai-content">
                                        {(message.sections || parseAIMessage(message.content)).map((section, idx) => (
                                            <div key={idx} className="esprit-ai-card" style={{ marginBottom: idx < (message.sections?.length || 1) - 1 ? '12px' : 0 }}>
                                                <div className="esprit-section-header">
                                                    <span className="esprit-section-icon">{section.icon}</span>
                                                    <span className="esprit-section-title">{section.title}</span>
                                                </div>
                                                <div className="esprit-ai-text">
                                                    <p>{section.content}</p>
                                                    {section.bullets && section.bullets.length > 0 && (
                                                        <ul className="esprit-bullets">
                                                            {section.bullets.map((bullet, bIdx) => (
                                                                <li key={bIdx}>{bullet}</li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* État de chargement */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="esprit-loading"
                    >
                        CALCUL EN COURS
                    </motion.div>
                )}

                <div ref={messagesEndRef} style={{ height: '20px' }} />
            </div>

            {/* Zone d'input */}
            <div className="esprit-input-container">
                <form onSubmit={handleSubmit} className="esprit-input-wrapper">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Interrogez votre potentiel..."
                        className="esprit-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="esprit-send-btn"
                        disabled={!input.trim() || isLoading}
                    >
                        <Send />
                    </button>
                </form>
            </div>
        </main>
    );
}
