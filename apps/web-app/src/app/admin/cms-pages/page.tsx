'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Eye, Edit, Globe } from 'lucide-react';
import { CmsPage } from '@/types/cms';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function CmsPagesManager() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [pages, setPages] = useState<CmsPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newPage, setNewPage] = useState({ slug: '', title: '', seo_title: '', seo_description: '' });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchPages();
    }, []);

    async function fetchPages() {
        const { data, error } = await supabase
            .from('cms_pages')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPages(data);
        }
        setLoading(false);
    }

    async function createPage() {
        if (!newPage.slug || !newPage.title) {
            alert('Slug et Titre sont requis');
            return;
        }

        const { error } = await supabase
            .from('cms_pages')
            .insert({
                slug: newPage.slug,
                title: newPage.title,
                seo_title: newPage.seo_title || newPage.title,
                seo_description: newPage.seo_description,
                is_published: false,
            });

        if (error) {
            console.error('Error creating page:', error);
            alert('Erreur lors de la création de la page');
        } else {
            setIsCreateDialogOpen(false);
            setNewPage({ slug: '', title: '', seo_title: '', seo_description: '' });
            fetchPages();
        }
    }

    const filteredPages = pages.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">CMS - Pages</h1>
                    <p className="text-gray-600 mt-1">Gérez les pages dynamiques du site</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900 font-bold">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Page
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Créer une nouvelle page</DialogTitle>
                            <DialogDescription>
                                Définissez les informations de base de votre nouvelle page.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 mt-4">
                            <div>
                                <Label htmlFor="slug">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    placeholder="about-us"
                                    value={newPage.slug}
                                    onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="title">Titre de la page</Label>
                                <Input
                                    id="title"
                                    placeholder="À Propos de Nous"
                                    value={newPage.title}
                                    onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="seo_title">SEO - Titre (optionnel)</Label>
                                <Input
                                    id="seo_title"
                                    placeholder="Laissez vide pour utiliser le titre de la page"
                                    value={newPage.seo_title}
                                    onChange={(e) => setNewPage({ ...newPage, seo_title: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="seo_desc">SEO - Description (optionnel)</Label>
                                <Input
                                    id="seo_desc"
                                    placeholder="Brève description pour les moteurs de recherche"
                                    value={newPage.seo_description}
                                    onChange={(e) => setNewPage({ ...newPage, seo_description: e.target.value })}
                                />
                            </div>
                            <Button onClick={createPage} className="w-full bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900 font-bold">
                                Créer la Page
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Pages</CardDescription>
                        <CardTitle className="text-2xl font-bold">{pages.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Publiées</CardDescription>
                        <CardTitle className="text-2xl font-bold text-green-600">
                            {pages.filter(p => p.is_published).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Brouillons</CardDescription>
                        <CardTitle className="text-2xl font-bold text-orange-600">
                            {pages.filter(p => !p.is_published).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Rechercher une page..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pages List */}
            {filteredPages.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune page pour le moment</h3>
                            <p className="text-gray-600 mb-4">Commencez à créer des pages dynamiques pour votre site</p>
                            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900">
                                <Plus className="h-4 w-4 mr-2" />
                                Nouvelle Page
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                            {filteredPages.map((page) => (
                                <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                                                <Badge variant={page.is_published ? 'default' : 'secondary'} className={page.is_published ? 'bg-green-500' : 'bg-orange-500'}>
                                                    {page.is_published ? 'Publiée' : 'Brouillon'}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                                <span className="flex items-center gap-1">
                                                    <Globe className="h-3 w-3" />
                                                    /{page.slug}
                                                </span>
                                                <span>Créée le {new Date(page.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {page.seo_description && (
                                                <p className="text-gray-600 text-sm line-clamp-1">{page.seo_description}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <Button variant="outline" size="sm" onClick={() => window.open(`/${page.slug}`, '_blank')}>
                                                <Eye className="h-4 w-4 mr-1" />
                                                Voir
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push(`/admin/cms-pages/${page.slug}`)}
                                            >
                                                <Edit className="h-4 w-4 mr-1" />
                                                Éditer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
