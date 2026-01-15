'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CmsSection } from '@/types/cms';
import { Sparkles, ArrowRight } from 'lucide-react';
import MagneticButton from '@/components/landing/MagneticButton';
import Link from 'next/link';

interface CmsRendererProps {
    sections: CmsSection[];
}

/**
 * CmsRenderer
 * Dynamically renders components based on CMS section types
 */
export const CmsRenderer: React.FC<CmsRendererProps> = ({ sections }) => {
    return (
        <div className="flex flex-col">
            {sections.map((section, index) => {
                const Component = componentMap[section.section_type] || DefaultSection;
                return (
                    <section
                        key={section.id}
                        className={`${section.style_config?.padding_top || ''} ${section.style_config?.padding_bottom || ''} ${getBgStyle(section.style_config?.bg_style)}`}
                    >
                        <Component section={section} />
                    </section>
                );
            })}
        </div>
    );
};

const getBgStyle = (style?: string) => {
    switch (style) {
        case 'black': return 'bg-black';
        case 'titanium': return 'bg-[#050505]';
        case 'glass': return 'bg-white/5 backdrop-blur-md';
        default: return 'bg-transparent';
    }
};

// --- CMS COMPONENTS ---

const CmsHero: React.FC<{ section: CmsSection }> = ({ section }) => {
    const { content } = section;
    return (
        <div className="relative h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
            {/* Background */}
            {content.background_url && (
                <div className="absolute inset-0 z-0 opacity-40">
                    <img
                        src={content.background_url}
                        className="w-full h-full object-cover grayscale contrast-125"
                        alt=""
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 flex flex-col items-center"
            >
                {content.badge && (
                    <div className="mb-8 inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl">
                        <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                        <span className="text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase">{content.badge}</span>
                    </div>
                )}

                <h1 className="text-5xl md:text-[7rem] font-black tracking-tighter text-white mb-8 uppercase leading-[0.9]">
                    {content.heading_line_1} <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#FFF5C3] via-[#D4AF37] to-[#8C6D1F]">
                        {content.heading_gradient}
                    </span>
                </h1>

                {section.description && (
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
                        {section.description}
                    </p>
                )}

                <MagneticButton>
                    <Link href="/signup" className="px-10 py-5 bg-[#D4AF37] text-black font-black text-lg rounded-full flex items-center gap-3">
                        COMMENCER <ArrowRight size={20} />
                    </Link>
                </MagneticButton>
            </motion.div>
        </div>
    );
};

const DefaultSection: React.FC<{ section: CmsSection }> = ({ section }) => {
    return (
        <div className="py-20 max-w-7xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-black uppercase italic italic text-white mb-4">{section.title}</h2>
            <p className="text-gray-400">{section.description}</p>
        </div>
    );
};

const componentMap: Record<string, React.FC<{ section: CmsSection }>> = {
    'hero': CmsHero,
    'default': DefaultSection
};
