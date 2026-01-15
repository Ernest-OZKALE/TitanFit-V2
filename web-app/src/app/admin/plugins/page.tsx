'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Puzzle,
    CreditCard,
    Mail,
    BarChart3,
    Bot,
    Shield,
    Zap,
    Globe,
    MessageSquare,
    Check
} from "lucide-react";
import { motion } from "framer-motion";

const plugins = [
    {
        id: "stripe",
        name: "Stripe Payments",
        description: "Gérez les abonnements et les paiements sécurisés.",
        icon: <CreditCard className="h-6 w-6 text-[#635BFF]" />,
        status: "installed",
        category: "Payment"
    },
    {
        id: "sendgrid",
        name: "SendGrid Email",
        description: "Envoi d'emails transactionnels et marketing.",
        icon: <Mail className="h-6 w-6 text-[#1A82E2]" />,
        status: "available",
        category: "Communication"
    },
    {
        id: "openai",
        name: "TitanFit Core Engine",
        description: "Le moteur de coaching avancé pour votre transformation.",
        icon: <Bot className="h-6 w-6 text-[#10A37F]" />,
        status: "installed",
        category: "AI Core"
    },
    {
        id: "analytics",
        name: "Advanced Analytics",
        description: "Tableaux de bord détaillés et prédictions.",
        icon: <BarChart3 className="h-6 w-6 text-[#F59E0B]" />,
        status: "available",
        category: "Data"
    },
    {
        id: "security",
        name: "Shield Pro",
        description: "Protection avancée contre les attaques DDOS.",
        icon: <Shield className="h-6 w-6 text-[#EF4444]" />,
        status: "beta",
        category: "Security"
    },
    {
        id: "intercom",
        name: "Support Chat",
        description: "Chat en direct avec vos utilisateurs.",
        icon: <MessageSquare className="h-6 w-6 text-[#286EFA]" />,
        status: "available",
        category: "Support"
    }
];

export default function PluginsPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                        <Puzzle className="h-8 w-8 text-[#D4AF37]" />
                        Plugins & Intégrations
                    </h1>
                    <p className="text-slate-500 mt-2">Étendez les fonctionnalités de votre TitanFit.</p>
                </div>
                <Button className="bg-[#0F172A] text-white hover:bg-[#D4AF37] transition-colors">
                    <Zap className="h-4 w-4 mr-2" />
                    Explorer le Store
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {plugins.map((plugin, idx) => (
                    <motion.div
                        key={plugin.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Card className="h-full border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden relative">
                            {plugin.status === "installed" && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                                        <Check className="h-3 w-3" />
                                        Installé
                                    </div>
                                </div>
                            )}

                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between">
                                    <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-[#D4AF37]/10 transition-colors">
                                        {plugin.icon}
                                    </div>
                                    <Badge variant="outline" className="text-xs text-slate-400 font-normal">
                                        {plugin.category}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-4 text-xl font-bold text-slate-900 group-hover:text-[#D4AF37] transition-colors">
                                    {plugin.name}
                                </CardTitle>
                                <CardDescription className="text-slate-500">
                                    {plugin.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-4 mt-auto">
                                <div className="w-full h-px bg-slate-100 mb-4" />
                                <div className="flex gap-2">
                                    {plugin.status === "installed" ? (
                                        <Button variant="outline" className="w-full border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300">
                                            Configurer
                                        </Button>
                                    ) : (
                                        <Button className="w-full bg-slate-900 text-white hover:bg-[#D4AF37]">
                                            Installer
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Coming Soon Section */}
            <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px] opacity-20"></div>

                <div className="relative z-10">
                    <Globe className="h-12 w-12 text-[#D4AF37] mx-auto mb-6 animate-pulse" />
                    <h2 className="text-2xl font-bold text-white mb-4">Plus d'intégrations à venir</h2>
                    <p className="text-slate-400 max-w-lg mx-auto mb-8">
                        Nous travaillons sur des connexions avec Shopify, Mailchimp, Discord et bien plus encore.
                    </p>
                    <Button variant="outline" className="border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-slate-900">
                        Proposer une intégration
                    </Button>
                </div>
            </div>
        </div>
    );
}
