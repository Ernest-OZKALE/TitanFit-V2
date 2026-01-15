'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    Calendar,
    User,
    FileText,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: 'draft' | 'published' | 'archived';
    content_type: string;
    published_at: string | null;
    updated_at: string;
    author: {
        full_name: string;
        email: string;
    };
}

interface BlogListProps {
    onEdit: (post: BlogPost) => void;
    onCreate: () => void;
}

/**
 * BlogList Component
 * Premium list of blog posts with management actions
 */
export const BlogList: React.FC<BlogListProps> = ({ onEdit, onCreate }) => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        fetchPosts();
    }, [statusFilter]);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/blog?status=${statusFilter}`);
            const data = await response.json();
            if (data.posts) {
                setPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) return;

        try {
            const response = await fetch(`/api/admin/blog?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setPosts(posts.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                        <CheckCircle2 size={12} /> Publié
                    </span>
                );
            case 'draft':
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider border border-amber-500/20">
                        <Clock size={12} /> Brouillon
                    </span>
                );
            default:
                return (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-500/10 text-gray-500 text-[10px] font-bold uppercase tracking-wider border border-gray-500/20">
                        <AlertCircle size={12} /> Archivé
                    </span>
                );
        }
    };

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher un article..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-titan-gold/50 transition-all font-mono text-sm"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none focus:border-titan-gold/50 cursor-pointer"
                    >
                        <option value="">Tous les statuts</option>
                        <option value="published">Publiés</option>
                        <option value="draft">Brouillons</option>
                    </select>
                </div>

                <Button
                    onClick={onCreate}
                    className="bg-titan-gold text-black hover:bg-titan-gold/90 font-bold w-full md:w-auto"
                >
                    <Plus size={18} className="mr-2" />
                    Nouvel Article
                </Button>
            </div>

            {/* Posts Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : posts.length > 0 ? (
                <div className="space-y-4">
                    <AnimatePresence>
                        {posts
                            .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
                            .map((post) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={post.id}
                                >
                                    <GlassCard noPadding className="group hover:border-titan-gold/30 transition-all duration-300">
                                        <div className="flex flex-col md:flex-row items-stretch md:items-center p-4 gap-4">
                                            {/* Info */}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-3">
                                                    {getStatusBadge(post.status)}
                                                    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{post.content_type}</span>
                                                </div>
                                                <h3 className="text-xl font-bold group-hover:text-titan-gold transition-colors">{post.title}</h3>
                                                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] text-gray-500 uppercase tracking-wider">
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <User size={12} className="text-titan-gold/50" />
                                                        {post.author?.full_name || 'Admin'}
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar size={12} className="text-titan-gold/50" />
                                                        {format(new Date(post.updated_at), 'dd MMM yyyy', { locale: fr })}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-titan-gold line-clamp-1">
                                                        <FileText size={12} />
                                                        /{post.slug}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-white/5 pt-4 md:pt-0 md:pl-6 px-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-gray-400"
                                                    onClick={() => onEdit(post)}
                                                >
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="bg-white/5 border-white/10 hover:bg-white/10 text-gray-400"
                                                    asChild
                                                >
                                                    <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                                        <Eye size={16} />
                                                    </a>
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="bg-white/5 border-white/10 hover:bg-red-500/20 text-gray-400 hover:text-red-500"
                                                    onClick={() => handleDelete(post.id)}
                                                >
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <FileText size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 font-mono text-sm mb-6">Aucun article trouvé.</p>
                    <Button
                        onClick={onCreate}
                        variant="outline"
                        className="bg-white/5 border-white/10"
                    >
                        Écrire votre premier article
                    </Button>
                </div>
            )}
        </div>
    );
};
