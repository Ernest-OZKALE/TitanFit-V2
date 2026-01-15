'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Calendar, Dumbbell } from 'lucide-react';
import { ProgramCardContent } from '@/types/cms';
import Image from 'next/image';

export default function ProgramCard({
    title = "Beginner Full Body",
    duration = "8 weeks",
    level = "Beginner",
    thumbnail = "/program-default.jpg",
    badge,
}: Partial<ProgramCardContent>) {

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            className="max-w-sm"
        >
            <Card className="overflow-hidden border-0 shadow-xl bg-slate-900 group">
                {/* Thumbnail */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-800">
                    <Image
                        src={thumbnail}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* Badge Overlay */}
                    {badge && (
                        <div className="absolute top-3 right-3">
                            <Badge className="bg-[#D4AF37] text-slate-900 font-bold px-3 py-1">
                                {badge}
                            </Badge>
                        </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <h3 className="text-2xl font-black text-white">{title}</h3>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-[#D4AF37]" />
                            <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Dumbbell className="w-4 h-4 text-[#D4AF37]" />
                            <span>{level}</span>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                        size="lg"
                        className="w-full bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-full"
                    >
                        <Play className="w-5 h-5 mr-2" />
                        Commencer
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
}
