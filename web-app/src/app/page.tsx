'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Activity } from 'lucide-react';
import TitaniumBackground from '@/components/TitaniumBackground';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      <TitaniumBackground />

      {/* Content Container */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">TitanFit V2.0</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-8 drop-shadow-2xl">
            FORGE YOUR <br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F7E7CE] to-[#D4AF37] bg-clip-text text-transparent">LEGACY</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            L'excellence n'est pas un acte, c'est une habitude. Rejoignez l'élite avec le coaching IA le plus avancé au monde.
          </p>

          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/signup" className="group relative px-8 py-4 bg-[#D4AF37] text-black font-bold text-lg rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_#D4AF37]">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative flex items-center gap-2">
                Commencer Maintenant <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

            <Link href="/login" className="px-8 py-4 bg-white/5 text-white font-medium text-lg rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all hover:border-[#D4AF37]/50">
              Se Connecter
            </Link>
          </div>
        </motion.div>

        {/* Floating Stats Cards */}
        <div className="absolute top-1/2 left-10 -translate-y-1/2 hidden xl:block">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 w-64"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Progression</div>
                <div className="text-xl font-bold">+125%</div>
              </div>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full w-[70%] bg-[#D4AF37]" />
            </div>
          </motion.div>
        </div>

        <div className="absolute top-1/2 right-10 -translate-y-1/2 hidden xl:block">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 w-64 text-left"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37]">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Objectif</div>
                <div className="text-xl font-bold">Atteint</div>
              </div>
            </div>
            <p className="text-xs text-gray-500">Continuez sur cette lancée pour débloquer le mode Élite.</p>
          </motion.div>
        </div>

      </main>

      {/* Footer minimal */}
      <footer className="absolute bottom-0 w-full p-6 text-center text-gray-600 text-sm z-10">
        &copy; 2024 TitanFit AI. All rights reserved.
      </footer>
    </div>
  );
}
