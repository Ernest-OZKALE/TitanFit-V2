import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Zap, Activity, X } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard"; // V2 GlassCard
import { GoldButton } from "@/components/ui/premium-components";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useReward } from "@/context/RewardContext";

interface MorningCheckInProps {
    onComplete: () => void;
}

export function MorningCheckIn({ onComplete }: MorningCheckInProps) {
    const [step, setStep] = useState(1);
    const [sleepScore, setSleepScore] = useState(70);
    const [stressScore, setStressScore] = useState(30);
    const [sorenessScore, setSorenessScore] = useState(20);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const queryClient = useQueryClient();
    const { triggerReward } = useReward();

    const handleSubmit = async () => {
        setIsSubmitting(true);
        const today = new Date().toISOString().split('T')[0];

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("No user");

            // Upsert metrics
            const { error } = await supabase.from('daily_metrics').upsert({
                user_id: user.id,
                date: today,
                sleep_score: sleepScore,
                stress_score: stressScore,
                recovery_score: 100 - sorenessScore,
            });

            if (error) throw error;

            toast.success("Protocole Matinal Terminé", {
                description: "Vos métriques ont été calibrées."
            });

            // Trigger Premium Level Up Reward
            triggerReward('level_up', { level: 2, title: 'Titan-Grade Élite' });

            // Invalidate to refresh Energy Battery
            await queryClient.invalidateQueries({ queryKey: ['dailyMetrics'] });

            // Delay onComplete slightly to let the animation start
            setTimeout(onComplete, 500);

        } catch (err) {
            console.error("Check-in failed", err);
            toast.error("Erreur de sauvegarde", {
                description: "Vérifiez votre connexion ou réessayez."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/40 backdrop-blur-md"
        >
            <GlassCard className="max-w-md w-full relative overflow-hidden border-slate-200/60 shadow-[0_20px_50px_rgba(0,0,0,0.1)]" gradient>
                <button
                    onClick={onComplete}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors z-20"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Header */}
                <div className="text-center mb-10 relative z-10">
                    <p className="text-[10px] font-bold font-mono text-[#D4AF37] uppercase tracking-[0.2em] mb-2">Protocole Titan</p>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Calibrage Matinal</h2>
                </div>

                <div className="relative z-10 min-h-[300px]">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <StepView
                                key="step1"
                                icon={Moon}
                                iconColor="text-indigo-600"
                                iconBg="bg-indigo-50"
                                title="Qualité du Sommeil"
                                subtitle="Évaluation subjective de votre nuit"
                                value={sleepScore}
                                onChange={setSleepScore}
                                onNext={() => setStep(2)}
                            />
                        )}

                        {step === 2 && (
                            <StepView
                                key="step2"
                                icon={Activity}
                                iconColor="text-red-600"
                                iconBg="bg-red-50"
                                title="Charge Mentale"
                                subtitle="Niveau de stress au réveil"
                                value={stressScore}
                                onChange={setStressScore}
                                onNext={() => setStep(3)}
                                onBack={() => setStep(1)}
                            />
                        )}

                        {step === 3 && (
                            <StepView
                                key="step3"
                                icon={Zap}
                                iconColor="text-titan-gold"
                                iconBg="bg-amber-50"
                                title="État Physique"
                                subtitle="Douleurs ou raideurs musculaires"
                                value={sorenessScore}
                                onChange={setSorenessScore}
                                onNext={handleSubmit}
                                onBack={() => setStep(2)}
                                isLast
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>
        </motion.div>
    );
}

// Helper Component for Steps to clean up the code
function StepView({
    icon: Icon, iconColor, iconBg,
    title, subtitle,
    value, onChange,
    onNext, onBack,
    isLast = false, isSubmitting = false
}: any) {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl ${iconBg} ${iconColor} border border-white`}>
                    <Icon className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-slate-900 leading-none mb-1">{title}</h3>
                    <p className="text-sm text-slate-500">{subtitle}</p>
                </div>
                <span className="ml-auto text-3xl font-black text-slate-900 font-mono">{value}%</span>
            </div>

            <div className="space-y-4">
                <input
                    type="range"
                    min="0" max="100"
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-3 bg-slate-100 rounded-full appearance-none cursor-pointer accent-[#D4AF37] hover:bg-slate-200 transition-colors"
                />
                <div className="flex justify-between text-xs text-slate-400 font-bold font-mono uppercase">
                    <span>Faible</span>
                    <span>Élevé</span>
                </div>
            </div>

            <div className="flex gap-4 pt-4">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        RETOUR
                    </button>
                )}
                <GoldButton
                    onClick={onNext}
                    disabled={isSubmitting}
                    className="flex-[2] py-4 text-base shadow-xl shadow-[#D4AF37]/10"
                >
                    {isLast ? (isSubmitting ? "CALIBRAGE..." : "LANCER LA JOURNÉE") : "SUIVANT"}
                </GoldButton>
            </div>
        </motion.div>
    );
}
