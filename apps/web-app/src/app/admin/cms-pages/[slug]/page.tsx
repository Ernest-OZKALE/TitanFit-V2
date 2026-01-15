'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    ArrowLeft,
    Plus,
    Eye,
    Save,
    Trash2,
    GripVertical,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { CmsPage, CmsSection, CmsComponent } from '@/types/cms';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function PageEditor() {
    const params = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [page, setPage] = useState<CmsPage | null>(null);
    const [sections, setSections] = useState<CmsSection[]>([]);
    const [components, setComponents] = useState<CmsComponent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);

    const slug = params?.slug as string;

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (slug) {
            fetchPageData();
            fetchAvailableComponents();
        }
    }, [slug]);

    async function fetchPageData() {
        // Fetch page metadata
        const { data: pageData, error: pageError } = await supabase
            .from('cms_pages')
            .select('*')
            .eq('slug', slug)
            .single();

        if (pageError || !pageData) {
            console.error('Page not found:', pageError);
            return;
        }

        setPage(pageData);

        // Fetch sections
        const { data: sectionsData, error: sectionsError } = await supabase
            .from('cms_sections')
            .select('*')
            .eq('page_id', pageData.id)
            .order('order_index', { ascending: true });

        if (!sectionsError && sectionsData) {
            setSections(sectionsData);
        }

        setLoading(false);
    }

    async function fetchAvailableComponents() {
        const { data, error } = await supabase
            .from('cms_components')
            .select('*')
            .eq('is_active', true)
            .order('display_name');

        if (!error && data) {
            setComponents(data);
        }
    }

    async function addSection(componentName: string) {
        if (!page) return;

        const component = components.find(c => c.component_name === componentName);
        if (!component) return;

        const newOrderIndex = sections.length > 0 ? Math.max(...sections.map(s => s.order_index)) + 1 : 0;

        const { data, error } = await supabase
            .from('cms_sections')
            .insert({
                page_id: page.id,
                section_type: component.category || 'content',
                component_name: componentName,
                order_index: newOrderIndex,
                content: component.default_content,
                style_config: {},
                is_visible: true,
                locked: false,
            })
            .select()
            .single();

        if (!error && data) {
            setSections([...sections, data]);
        }
    }

    async function updateSection(sectionId: string, updates: Partial<CmsSection>) {
        const { error } = await supabase
            .from('cms_sections')
            .update(updates)
            .eq('id', sectionId);

        if (!error) {
            setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
        }
    }

    async function deleteSection(sectionId: string) {
        const { error } = await supabase
            .from('cms_sections')
            .delete()
            .eq('id', sectionId);

        if (!error) {
            setSections(sections.filter(s => s.id !== sectionId));
        }
    }

    async function togglePublish() {
        if (!page) return;

        const { error } = await supabase
            .from('cms_pages')
            .update({ is_published: !page.is_published })
            .eq('id', page.id);

        if (!error) {
            setPage({ ...page, is_published: !page.is_published });
        }
    }

    async function moveSectionUp(index: number) {
        if (index === 0) return;
        const newSections = [...sections];
        [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];

        // Update order_index for both
        await Promise.all([
            updateSection(newSections[index].id, { order_index: index }),
            updateSection(newSections[index - 1].id, { order_index: index - 1 })
        ]);

        setSections(newSections);
    }

    async function moveSectionDown(index: number) {
        if (index === sections.length - 1) return;
        const newSections = [...sections];
        [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];

        await Promise.all([
            updateSection(newSections[index].id, { order_index: index }),
            updateSection(newSections[index + 1].id, { order_index: index + 1 })
        ]);

        setSections(newSections);
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!page) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Page non trouvée</h2>
                <Button onClick={() => router.push('/admin/cms-pages')} className="mt-4">
                    Retour aux pages
                </Button>
            </div>
        );
    }

    const selectedSectionData = sections.find(s => s.id === selectedSection);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.push('/admin/cms-pages')}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
                        <p className="text-gray-600 mt-1">/{page.slug}</p>
                    </div>
                    <Badge variant={page.is_published ? 'default' : 'secondary'} className={page.is_published ? 'bg-green-500' : 'bg-orange-500'}>
                        {page.is_published ? 'Publiée' : 'Brouillon'}
                    </Badge>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => window.open(`/${page.slug}`, '_blank')}
                    >
                        <Eye className="h-4 w-4 mr-2" />
                        Prévisualiser
                    </Button>
                    <Button
                        onClick={togglePublish}
                        className={page.is_published ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'}
                    >
                        {page.is_published ? 'Dépublier' : 'Publier'}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar - Sections List */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">Sections ({sections.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Select onValueChange={addSection}>
                            <SelectTrigger>
                                <SelectValue placeholder="+ Ajouter une section" />
                            </SelectTrigger>
                            <SelectContent>
                                {components.map(comp => (
                                    <SelectItem key={comp.id} value={comp.component_name}>
                                        {comp.display_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="space-y-2 mt-4">
                            {sections.map((section, index) => (
                                <div
                                    key={section.id}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedSection === section.id
                                            ? 'border-[#D4AF37] bg-[#D4AF37]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    onClick={() => setSelectedSection(section.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1">
                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">
                                                {section.component_name || section.section_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => { e.stopPropagation(); moveSectionUp(index); }}
                                                disabled={index === 0}
                                            >
                                                <ChevronUp className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={(e) => { e.stopPropagation(); moveSectionDown(index); }}
                                                disabled={index === sections.length - 1}
                                            >
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-red-600 hover:text-red-700"
                                                onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Right - Section Editor */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {selectedSectionData ? `Éditer: ${selectedSectionData.component_name}` : 'Sélectionnez une section'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {selectedSectionData ? (
                            <div className="space-y-4">
                                <div>
                                    <Label>Titre</Label>
                                    <Input
                                        value={selectedSectionData.title || ''}
                                        onChange={(e) => updateSection(selectedSectionData.id, { title: e.target.value })}
                                        placeholder="Titre de la section"
                                    />
                                </div>

                                <div>
                                    <Label>Sous-titre</Label>
                                    <Input
                                        value={selectedSectionData.subtitle || ''}
                                        onChange={(e) => updateSection(selectedSectionData.id, { subtitle: e.target.value })}
                                        placeholder="Sous-titre"
                                    />
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={selectedSectionData.description || ''}
                                        onChange={(e) => updateSection(selectedSectionData.id, { description: e.target.value })}
                                        placeholder="Description"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>Contenu JSON (Avancé)</Label>
                                    <Textarea
                                        value={JSON.stringify(selectedSectionData.content, null, 2)}
                                        onChange={(e) => {
                                            try {
                                                const parsed = JSON.parse(e.target.value);
                                                updateSection(selectedSectionData.id, { content: parsed });
                                            } catch (err) {
                                                // Invalid JSON, don't update
                                            }
                                        }}
                                        rows={10}
                                        className="font-mono text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="visible"
                                        checked={selectedSectionData.is_visible}
                                        onChange={(e) => updateSection(selectedSectionData.id, { is_visible: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="visible">Section visible</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="locked"
                                        checked={selectedSectionData.locked}
                                        onChange={(e) => updateSection(selectedSectionData.id, { locked: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="locked">Section verrouillée (Premium)</Label>
                                </div>

                                <Button className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900">
                                    <Save className="h-4 w-4 mr-2" />
                                    Sauvegarder
                                </Button>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                Sélectionnez une section dans la liste pour l'éditer
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
