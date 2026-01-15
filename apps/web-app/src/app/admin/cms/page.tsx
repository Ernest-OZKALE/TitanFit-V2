"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Save, RefreshCw, LayoutTemplate, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CmsSection {
    id: string;
    section_type: string;
    title: string;
    subtitle: string;
    content: any; // JSON
    order_index: number;
}

export default function AdminCmsPage() {
    const [loading, setLoading] = useState(true);
    const [sections, setSections] = useState<CmsSection[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchCmsData();
    }, []);

    const fetchCmsData = async () => {
        setLoading(true);
        try {
            // 1. Get Home Page ID
            const { data: pageData, error: pageError } = await supabase
                .from('cms_pages')
                .select('id')
                .eq('slug', 'home')
                .single();

            if (pageError) throw pageError;

            // 2. Get Sections
            const { data: sectionsData, error: sectionsError } = await supabase
                .from('cms_sections')
                .select('*')
                .eq('page_id', pageData.id)
                .order('order_index', { ascending: true });

            if (sectionsError) throw sectionsError;

            setSections(sectionsData || []);
        } catch (error) {
            console.error("Error fetching CMS:", error);
            toast.error("Erreur lors du chargement du CMS");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateSection = (id: string, field: string, value: any) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const handleUpdateJson = (id: string, value: string) => {
        try {
            const parsed = JSON.parse(value);
            setSections(prev => prev.map(s => s.id === id ? { ...s, content: parsed } : s));
        } catch (e) {
            // Invalid JSON - just don't update state yet or show warning (optional)
        }
    };

    const handleSave = async (section: CmsSection) => {
        setSaving(true);
        try {
            const { error } = await supabase
                .from('cms_sections')
                .update({
                    title: section.title,
                    subtitle: section.subtitle,
                    content: section.content
                })
                .eq('id', section.id);

            if (error) throw error;
            toast.success(`Section ${section.section_type} mise à jour !`);
        } catch (error) {
            console.error("Error saving CMS:", error);
            toast.error("Erreur sauvegarde");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-gold" /></div>;

    return (
        <div className="p-8 space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
                        <LayoutTemplate className="text-gold" /> CMS Landing Page
                    </h1>
                    <p className="text-slate-400">Modifiez le contenu de la page d'accueil en temps réel.</p>
                </div>
                <Button variant="outline" onClick={fetchCmsData}><RefreshCw className="mr-2 h-4 w-4" /> Actualiser</Button>
            </div>

            <div className="grid gap-6">
                {sections.map((section) => (
                    <Card key={section.id} className="bg-black/40 border-white/10 backdrop-blur-md">
                        <CardHeader className="border-b border-white/5 pb-4">
                            <CardTitle className="text-xl font-bold flex items-center justify-between">
                                <span className="uppercase tracking-widest text-gold text-sm flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> {section.section_type}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(section)}
                                    disabled={saving}
                                    className="bg-gold text-black hover:bg-gold/80 font-bold"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                                    Sauvegarder
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Titre Principal</label>
                                <Input
                                    value={section.title || ''}
                                    onChange={(e) => handleUpdateSection(section.id, 'title', e.target.value)}
                                    className="bg-black/50 border-white/10 text-xl font-bold font-serif"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Sous-Titre / Description</label>
                                <Textarea
                                    value={section.subtitle || ''}
                                    onChange={(e) => handleUpdateSection(section.id, 'subtitle', e.target.value)}
                                    className="bg-black/50 border-white/10 min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Contenu Avancé (JSON)</label>
                                <Textarea
                                    defaultValue={JSON.stringify(section.content, null, 2)}
                                    onChange={(e) => handleUpdateJson(section.id, e.target.value)}
                                    className="bg-black/80 font-mono text-xs text-green-400 border-white/10 min-h-[150px]"
                                />
                                <p className="text-[10px] text-slate-500">
                                    Modifiez les labels des boutons, les images, ou les features ici. Respectez le format JSON.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
