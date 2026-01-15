'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Brain, Shield, Rocket, Crown, Check, Activity, Flame, Cpu, Sparkles, Mouse } from 'lucide-react';
import { ReactLenis } from 'lenis/react';
import dynamic from 'next/dynamic';

import TitaniumBackground from '@/components/TitaniumBackground';
import MagneticButton from '@/components/landing/MagneticButton';
import Protocol from '@/components/landing/Protocol';
import TheProblem from '@/components/landing/TheProblem';
import CinematicMobile from '@/components/landing/CinematicMobile';
import VisualArsenal from '@/components/landing/VisualArsenal';
import BentoFeatures from '@/components/landing/BentoFeatures';
import VelocityScroll from '@/components/landing/VelocityScroll';
import { variants } from '@/lib/animation-utils';
import { Testimonials, FAQ } from '@/components/landing/SocialProof';
import IdentitySelector from '@/components/landing/IdentitySelector';
import CommunityEmpire from '@/components/landing/CommunityEmpire';
import FuelMastery from '@/components/landing/FuelMastery';
import LegendaryFooter from '@/components/landing/LegendaryFooter';
import PricingSection from '@/components/landing/PricingSection';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

// VERCEL BEST PRACTICE: Lazy Load Heavy Interactive Components
const AppShowcase = dynamic(() => import('@/components/landing/AppShowcase'), {
  loading: () => <div className="h-[500px] flex items-center justify-center text-[#D4AF37]">Chargement de l'Interface...</div>
});
const FutureReality = dynamic(() => import('@/components/landing/FutureReality'), {
  loading: () => <div className="h-[400px]" />
});
const TechDeepDive = dynamic(() => import('@/components/landing/TechDeepDive'));


function AuthButtons() {
  const { user, loading } = useAuth();

  if (loading) return <div className="w-8 h-8 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />;

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative group"
      >
        {/* Holographic Container */}
        <div className="absolute inset-0 bg-[#D4AF37]/20 blur-[40px] rounded-full opacity-50 animate-pulse" />

        <MagneticButton>
          <Link href="/dashboard" className="relative flex items-center gap-6 px-8 py-5 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:bg-slate-50 transition-all group-hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.3)] shadow-xl">

            {/* Scan Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out" />

            <div className="flex flex-col items-start min-w-[140px]">
              <div className="flex items-center gap-2 text-[10px] text-[#D4AF37] font-black uppercase tracking-widest mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Session Active
              </div>
              <div className="text-slate-900 font-bold text-sm truncate max-w-[150px] opacity-90 capitalize">
                {user.user_metadata?.username || user.email?.split('@')[0]}
              </div>
            </div>

            <div className="h-10 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-3 text-[#D4AF37] font-black uppercase tracking-wider">
              Accéder au Nexus
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>

          </Link>
        </MagneticButton>
      </motion.div>
    );
  }

  return (
    <>
      <MagneticButton>
        <Link href="/signup" className="group relative px-10 py-5 bg-[#D4AF37] text-white font-black text-lg rounded-full overflow-hidden transition-all shadow-[0_10px_40px_-10px_rgba(212,175,55,0.5)] hover:shadow-[0_20px_60px_-10px_rgba(212,175,55,0.7)] block hover:scale-105 active:scale-95">
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 ease-out" />
          <span className="relative flex items-center gap-3 tracking-wide">
            COMMENCER L'EXPÉRIENCE <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </span>
        </Link>
      </MagneticButton>

      <MagneticButton>
        <Link href="/login" className="px-10 py-5 bg-white text-slate-900 font-bold text-lg rounded-full border border-slate-200 hover:border-[#D4AF37]/50 block shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_30px_-5px_rgba(212,175,55,0.2)] hover:scale-105 active:scale-95 transition-all group">
          <span className="group-hover:text-[#D4AF37] transition-colors">CONNEXION</span>
        </Link>
      </MagneticButton>
    </>
  );
}

// FADE UP VARIANT with Blur
const blurFadeUp = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

// SPLIT TEXT STAGGER
const container = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
  }),
};

const child = {
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    filter: 'blur(20px)',
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

export default function LandingPage() {
  return (
    <ReactLenis root>
      <div className="relative bg-white selection:bg-[#D4AF37] selection:text-white font-sans min-h-screen text-slate-900">
        <TitaniumBackground />

        {/* --- HERO SECTION (PURE WHITE EDITION) --- */}
        <section className="relative h-dvh flex flex-col items-center justify-center text-center px-4 overflow-hidden perspective-1000 bg-white/0">

          {/* ATMOSPHERE LAYER */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.div
              animate={{ opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] bg-gradient-radial from-[#D4AF37]/5 via-transparent to-transparent rounded-full blur-[100px]"
            />
          </div>

          {/* VIDEO BACKGROUND (Subtle High Key) */}
          <div className="absolute inset-0 z-0 opacity-10 mix-blend-multiply scale-110">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white z-10" />
            <video
              autoPlay
              loop
              muted
              playsInline
              poster="https://images.unsplash.com/photo-1635322966219-b75ed3a90e2d?q=80&w=2000&auto=format&fit=crop"
              className="w-full h-full object-cover grayscale brightness-125 contrast-[0.9] select-none pointer-events-none"
            >
              <source src="https://cdn.pixabay.com/video/2016/09/21/5306-183786157_tiny.mp4" type="video/mp4" />
            </video>
          </div>

          {/* FLOATING PARTICLES / DATA POINTS */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0, rotate: [0, 5, 0] }}
              transition={{ duration: 1.5, delay: 1 }}
              className="absolute top-[25%] left-[10%] hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 border border-slate-200/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-xs font-mono text-slate-500">BIO_METRICS_SYNCED</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0, rotate: [0, -5, 0] }}
              transition={{ duration: 1.5, delay: 1.2 }}
              className="absolute bottom-[30%] right-[10%] hidden lg:flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/80 border border-slate-200/60 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <Cpu className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-xs font-mono text-slate-500">ALGORITHM_OPTIMIZED</span>
            </motion.div>
          </div>


          <motion.div
            initial="hidden"
            animate="visible"
            variants={container}
            className="z-20 relative flex flex-col items-center"
          >
            {/* NEW: CLARITY TAG - IMMEDIATE VALUE PROP */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center gap-3 px-4 py-2 rounded-full border border-slate-200 bg-white/50 backdrop-blur-sm mb-6 mt-12 cursor-default hover:border-[#D4AF37]/50 transition-colors duration-300"
            >
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold">IA</div>
                <div className="w-6 h-6 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white">💪</div>
              </div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Coach Sportif & Nutritionnel Intelligent</span>
            </motion.div>

            {/* MAIN TITLE: TITANFIT - PURE GOLD */}
            <div className="relative mb-6 scale-90 md:scale-100 z-10">
              {/* Invisible H1 for SEO */}
              <h1 className="sr-only">TITANFIT - Coach Sportif IA</h1>

              {/* Visual Title */}
              <motion.div
                className="relative font-black text-6xl md:text-[8rem] lg:text-[11rem] tracking-tighter leading-[0.8] uppercase italic select-none flex justify-center"
                initial="hidden"
                animate="visible"
                variants={variants.staggerContainer}
              >
                {["T", "I", "T", "A", "N", "F", "I", "T"].map((char, i) => (
                  <motion.span
                    key={i}
                    className={i >= 5
                      ? "gold-pulse"
                      : "text-slate-900"
                    }
                    variants={variants.textReveal}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* NEW SLOGAN WITH CONCRETE MEANING */}
            <div className="h-auto min-h-[5rem] flex flex-col items-center justify-center mb-10 max-w-2xl px-4">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2 }}
                className="text-lg md:text-xl text-slate-500 font-light text-center leading-relaxed"
              >
                <span className="text-slate-900 font-semibold block mb-2 sm:inline sm:mb-0">Nutrition. Entraînement. Récupération.</span>
                <br className="hidden sm:block" />
                Un écosystème unique qui s'adapte à votre physiologie en temps réel.
              </motion.p>
            </div>

            <motion.div
              variants={blurFadeUp}
              transition={{ delay: 1.4 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center min-h-[100px] w-full px-4"
            >
              <AuthButtons />
            </motion.div>

          </motion.div>

          {/* SCROLL INDICATOR */}
          {/* SCROLL INDICATOR - ENHANCED V2 (WITH MOUSE) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{ duration: 1.5, delay: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <Mouse className="w-6 h-6 text-slate-400 group-hover:text-[#D4AF37] transition-colors" />
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-[#D4AF37] transition-colors">Explorer</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] via-[#D4AF37] to-transparent opacity-60 group-hover:h-20 transition-all duration-500" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* --- THE PROBLEM (Marketing Hook) --- */}
        <TheProblem />

        {/* --- IDENTITY SELECTOR (Segmentation) --- */}
        <IdentitySelector />

        {/* --- APP SHOWCASE (The Solution) --- */}
        <AppShowcase />

        {/* --- FUTURE REALITY (Sci-Fi Hook) --- */}
        <FutureReality />

        {/* --- THE PROTOCOL (Process) --- */}
        <Protocol />

        {/* --- TECH DEEP DIVE (Vertical Explanation) --- */}
        <TechDeepDive />

        {/* --- FUEL MASTERY (Nutrition & Supps) --- */}
        <FuelMastery />

        {/* --- CINEMATIC MOBILE (Dopamine Object) --- */}
        <CinematicMobile />
        <VelocityScroll />

        {/* --- BENTO GRID FEATURES (Premium Replacement) --- */}
        <BentoFeatures />

        <CommunityEmpire />

        {/* --- SOCIAL PROOF (Testimonials) --- */}
        <Testimonials />



        {/* --- LEGENDARY CTA --- */}
        <LegendaryFooter />

        {/* --- PRICING SECTION (Replaces TIERS) --- */}
        <PricingSection />

        {/* --- FAQ (Closing) --- */}
        <FAQ />
      </div>
    </ReactLenis>
  );
}
