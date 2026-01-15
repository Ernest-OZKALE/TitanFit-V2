'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { OnboardingData } from "./types";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Brain } from "lucide-react";
import { IdentityStep } from "./steps/IdentityStep";
import { BiometricsStep } from "./steps/BiometricsStep";
import { NutritionStep } from "./steps/NutritionStep";
import { InjuriesStep } from "./steps/InjuriesStep";
import { EquipmentStep } from "./steps/EquipmentStep";
import { LifestyleStep } from "./steps/LifestyleStep";

// Initial Data State
const INITIAL_DATA: OnboardingData = {
    identity: { name: "", gender: "male", age: 25 },
    biometrics: { weight: 75, height: 175, target_weight: 75 },
    experience: { level: "beginner", years: 0 },
    lifestyle: {
        job_activity: "sedentary", sleep_hours: 7, stress_level: "medium",
        wake_time: "standard", energy_level: "medium",
        training_schedule: [], session_duration: 60
    },
    goal: { primary: "lean", commitment: "serious" },
    nutrition: {
        diet_type: "classic", meals_per_day: 3, budget: "standard",
        cooking_skill: "basic", hydration: "medium",
        supplements: [], allergies: [], dislikes: []
    },
    injuries: [],
    health_conditions: [],
    equipment: { location: "commercial_gym", items: [], machines: [] }
};

export function OnboardingWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(INITIAL_DATA);
    const [isSyncing, setIsSyncing] = useState(false);

    const totalSteps = 6;

    const updateData = (section: keyof OnboardingData, payload: any) => {
        setData(prev => ({
            ...prev,
            [section]: { ...prev[section], ...payload }
        }));
    };

    // --- NAVIGATION HANDLERS ---
    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        else handleSync();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    // --- SYNC LOGIC ---
    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Update Profile (Base)
                await supabase.from('profiles').update({
                    full_name: data.identity.name,
                    onboarding_completed: true,
                    // Store the GIGA JSON
                    // @ts-ignore
                    onboarding_data: data
                }).eq('id', user.id);

                // 2. Update Metrics (Simplified for table)
                await supabase.from('user_metrics').upsert({
                    user_id: user.id,
                    weight_kg: data.biometrics.weight,
                    height_cm: data.biometrics.height,
                    age: data.identity.age,
                    goal_type: data.goal.primary,
                    activity_level: data.lifestyle.job_activity
                });

                toast.success("Initialisation TitanFit Terminée.");
                setTimeout(() => router.push("/dashboard"), 2000);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erreur Sync.");
            setIsSyncing(false);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto min-h-[700px] relative font-sans flex flex-col items-center justify-center">
            {/* Background Atmosphere */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] -z-10" />

            <AnimatePresence mode="wait">
                {!isSyncing ? (
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="w-full bg-black/80 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 relative overflow-hidden"
                    >
                        {/* Progress */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                            <div
                                className="h-full bg-[#D4AF37] transition-all duration-500"
                                style={{ width: `${(step / totalSteps) * 100}%` }}
                            />
                        </div>

                        {/* STEP CONTENT PLACEHOLDERS */}
                        <div className="min-h-[400px]">
                            {step === 1 && <IdentityStep data={data} update={updateData} />}
                            {step === 2 && <BiometricsStep data={data} update={updateData} />}
                            {step === 3 && (
                                <NutritionStep
                                    data={data.nutrition}
                                    updateData={(updates) => updateData('nutrition', updates)}
                                />
                            )}
                            {step === 4 && <InjuriesStep data={data} updateData={updateData} />}
                            {step === 5 && (
                                <EquipmentStep
                                    data={data.equipment}
                                    updateData={(updates) => updateData('equipment', updates)}
                                />
                            )}
                            {step === 6 && (
                                <LifestyleStep
                                    data={data.lifestyle}
                                    updateData={(updates) => updateData('lifestyle', updates)}
                                />
                            )}
                        </div>

                        {/* Footer Navigation */}
                        <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
                            <Button
                                variant="ghost"
                                onClick={handleBack}
                                disabled={step === 1}
                                className={cn("text-gray-400 hover:text-white", step === 1 && "opacity-0")}
                            >
                                <ArrowLeft className="mr-2 w-4 h-4" /> Retour
                            </Button>

                            <Button
                                onClick={handleNext}
                                className="bg-[#D4AF37] hover:bg-[#B8860B] text-black font-bold px-8 py-6 rounded-xl text-lg shadow-[0_0_20px_-5px_#D4AF37]"
                            >
                                {step === totalSteps ? "TERMINER L'AUDIT" : "CONTINUER"}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center">
                        <Brain className="w-16 h-16 text-[#D4AF37] animate-pulse mb-6" />
                        <h2 className="text-3xl font-black text-white">Compilation des Données...</h2>
                        <p className="text-gray-400 mt-2">Le Protocole analyse votre profil.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
