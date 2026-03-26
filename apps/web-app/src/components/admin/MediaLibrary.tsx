'use client';

import React, { useState, useEffect, useRef } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { CmsMediaLibrary } from '@/types/cms';
import {
    Upload,
    Search,
    Grid,
    List,
    Image as ImageIcon,
    Video,
    FileText,
    Trash2,
    Copy,
    ExternalLink,
    X,
    FolderOpen,
    Loader2,
    Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';



interface MediaLibraryProps {
    onSelect?: (file: CmsMediaLibrary) => void;
    allowSelection?: boolean;
}

/**
 * MediaLibrary Component
 * Premium interface for managing application assets
 */
export const MediaLibrary: React.FC<MediaLibraryProps> = ({ onSelect, allowSelection = false }) => {
    const [files, setFiles] = useState<CmsMediaLibrary[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchMedia();
    }, [filterType]);

    const fetchMedia = async (query = '') => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/media?search=${encodeURIComponent(query)}&type=${filterType}`);
            const data = await response.json();
            if (data.media) {
                setFiles(data.media);
            }
        } catch (error) {
            console.error('Error fetching media:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchMedia(search);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'general');

        try {
            const response = await fetch('/api/admin/media', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchMedia(search);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

        try {
            const response = await fetch(`/api/admin/media?id=${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setFiles(files.filter(f => f.id !== id));
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    const copyToClipboard = (url: string | null, id: string) => {
        if (!url) return;
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getIcon = (type: string) => {
        if (type.startsWith('image/')) return <ImageIcon size={20} />;
        if (type.startsWith('video/')) return <Video size={20} />;
        return <FileText size={20} />;
    };

    return (
        <div className="space-y-6">
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher média..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-titan-gold/50 transition-all font-mono text-sm"
                        />
                    </form>
                    <div className="flex bg-white/5 border border-white/10 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <List size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-400 focus:outline-none focus:border-titan-gold/50 cursor-pointer"
                    >
                        <option value="">Tous les types</option>
                        <option value="image">Images</option>
                        <option value="video">Vidéos</option>
                    </select>

                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        className="hidden"
                        accept="image/*,video/*"
                    />

                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="bg-titan-gold text-black hover:bg-titan-gold/90 font-bold"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin mr-2" /> : <Upload size={18} className="mr-2" />}
                        {uploading ? 'Upload en cours...' : 'Ajouter Média'}
                    </Button>
                </div>
            </div>

            {/* MEDIA GRID/LIST */}
            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : files.length > 0 ? (
                viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {files.map((file) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={file.id}
                                    className={`group relative aspect-square rounded-2xl border bg-black overflow-hidden transition-all cursor-pointer shadow-lg ${allowSelection ? 'hover:border-titan-gold ring-titan-gold' : 'hover:border-titan-gold/30'}`}
                                >
                                    {/* Selection Overlay */}
                                    {allowSelection && (
                                        <div className="absolute inset-0 bg-titan-gold/5 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                                            <Button
                                                onClick={() => onSelect?.(file)}
                                                className="bg-titan-gold text-black hover:bg-white font-bold"
                                            >
                                                Choisir
                                            </Button>
                                        </div>
                                    )}

                                    {/* Preview */}
                                    {file.mime_type.startsWith('image/') ? (
                                        <img
                                            src={file.public_url || ''}
                                            alt={file.alt_text || file.original_filename}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500">
                                            {getIcon(file.mime_type)}
                                        </div>
                                    )}

                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => copyToClipboard(file.public_url, file.id)}
                                                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-titan-gold hover:text-black transition-colors"
                                                title="Copier URL"
                                            >
                                                {copiedId === file.id ? <Check size={16} /> : <Copy size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-red-500 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-white truncate mb-0.5">{file.original_filename}</p>
                                            <p className="text-[9px] font-mono text-gray-400 capitalize">{formatSize(file.file_size)} • {file.mime_type.split('/')[1]}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                ) : (
                    <GlassCard noPadding>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 border-b border-white/5 text-gray-400 text-[10px] uppercase font-mono tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Fichier</th>
                                        <th className="px-6 py-4 font-normal">Taille</th>
                                        <th className="px-6 py-4 font-normal">Format</th>
                                        <th className="px-6 py-4 font-normal">Date</th>
                                        <th className="px-6 py-4 text-right font-normal">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {files.map((file) => (
                                        <tr key={file.id} className="group hover:bg-white/[0.02]">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 overflow-hidden border border-white/10">
                                                        {file.mime_type.startsWith('image/') ? (
                                                            <img src={file.public_url || ''} className="object-cover w-full h-full" alt="" />
                                                        ) : getIcon(file.mime_type)}
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors truncate max-w-[200px]">
                                                        {file.original_filename}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">{formatSize(file.file_size)}</td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-mono bg-white/5 px-2 py-1 rounded text-gray-400 uppercase">{file.mime_type.split('/')[1]}</span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                                {format(new Date(file.created_at), 'dd/MM/yy', { locale: fr })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => copyToClipboard(file.public_url, file.id)} className="text-gray-400 hover:text-titan-gold">
                                                        {copiedId === file.id ? <Check size={16} /> : <Copy size={16} />}
                                                    </button>
                                                    <a href={file.public_url || '#'} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                                                        <ExternalLink size={16} />
                                                    </a>
                                                    <button onClick={() => handleDelete(file.id)} className="text-gray-400 hover:text-red-500">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </GlassCard>
                )
            ) : (
                <div className="py-20 text-center bg-white/5 border border-dashed border-white/10 rounded-3xl">
                    <FolderOpen size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-400 font-mono text-sm mb-6">Votre bibliothèque est vide.</p>
                    <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="bg-white/5 border-white/10"
                    >
                        Importer votre premier fichier
                    </Button>
                </div>
            )}
        </div>
    );
};
