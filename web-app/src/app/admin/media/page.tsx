'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { MediaService } from '@/lib/media-service';
import { CmsMediaLibrary } from '@/types/cms';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Upload,
    Image as ImageIcon,
    Video,
    File,
    Trash2,
    Copy,
    Search
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from 'next/image';

export default function MediaLibrary() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [media, setMedia] = useState<CmsMediaLibrary[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<CmsMediaLibrary | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchMedia();
    }, []);

    async function fetchMedia() {
        const data = await MediaService.getAllMedia();
        setMedia(data);
        setLoading(false);
    }

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const result = await MediaService.uploadFile(file);

            if (result) {
                setMedia(prev => [result, ...prev]);
            }
        }

        setUploading(false);
        e.target.value = ''; // Reset input
    }, []);

    async function handleDelete(id: string, storagePath: string) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) return;

        const success = await MediaService.deleteMedia(id, storagePath);
        if (success) {
            setMedia(media.filter(m => m.id !== id));
            setIsDialogOpen(false);
        }
    }

    async function handleUpdateMetadata() {
        if (!selectedMedia) return;

        const success = await MediaService.updateMediaMetadata(selectedMedia.id, {
            alt_text: selectedMedia.alt_text,
            title: selectedMedia.title,
            description: selectedMedia.description,
        });

        if (success) {
            setMedia(media.map(m => m.id === selectedMedia.id ? selectedMedia : m));
        }
    }

    const filteredMedia = media.filter(m =>
        m.original_filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getFileIcon = (mimeType: string) => {
        if (mimeType.startsWith('image/')) return <ImageIcon className="h-5 w-5" />;
        if (mimeType.startsWith('video/')) return <Video className="h-5 w-5" />;
        return <File className="h-5 w-5" />;
    };

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
                    <h1 className="text-3xl font-bold text-gray-900">Bibliothèque de Médias</h1>
                    <p className="text-gray-600 mt-1">Gérez vos images, vidéos et fichiers</p>
                </div>

                <label>
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*,.pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                    <Button
                        as="span"
                        className="bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900 font-bold cursor-pointer"
                        disabled={uploading}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Upload en cours...' : 'Uploader des fichiers'}
                    </Button>
                </label>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Total Fichiers</CardTitle>
                        <p className="text-2xl font-bold">{media.length}</p>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Images</CardTitle>
                        <p className="text-2xl font-bold">
                            {media.filter(m => m.mime_type.startsWith('image/')).length}
                        </p>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-gray-500 uppercase">Vidéos</CardTitle>
                        <p className="text-2xl font-bold">
                            {media.filter(m => m.mime_type.startsWith('video/')).length}
                        </p>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Rechercher un fichier..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Media Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredMedia.map((item) => (
                    <Card
                        key={item.id}
                        className="overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
                        onClick={() => { setSelectedMedia(item); setIsDialogOpen(true); }}
                    >
                        <div className="aspect-square bg-gray-100 relative">
                            {item.mime_type.startsWith('image/') ? (
                                <Image
                                    src={item.public_url || ''}
                                    alt={item.alt_text || item.original_filename}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                    {getFileIcon(item.mime_type)}
                                </div>
                            )}
                        </div>
                        <CardContent className="p-3">
                            <p className="text-xs font-medium text-gray-900 truncate">
                                {item.title || item.original_filename}
                            </p>
                            <p className="text-xs text-gray-500">
                                {(item.file_size / 1024).toFixed(0)} KB
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Media Detail Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Détails du fichier</DialogTitle>
                        <DialogDescription>
                            Modifiez les métadonnées ou supprimez le fichier
                        </DialogDescription>
                    </DialogHeader>

                    {selectedMedia && (
                        <div className="space-y-4">
                            {/* Preview */}
                            {selectedMedia.mime_type.startsWith('image/') && (
                                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                        src={selectedMedia.public_url || ''}
                                        alt={selectedMedia.alt_text || ''}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            )}

                            {/* Metadata */}
                            <div className="space-y-3">
                                <div>
                                    <Label>Nom du fichier</Label>
                                    <Input value={selectedMedia.original_filename} disabled />
                                </div>

                                <div>
                                    <Label>Titre</Label>
                                    <Input
                                        value={selectedMedia.title || ''}
                                        onChange={(e) => setSelectedMedia({ ...selectedMedia, title: e.target.value })}
                                        placeholder="Titre du fichier"
                                    />
                                </div>

                                <div>
                                    <Label>Alt Text (SEO)</Label>
                                    <Input
                                        value={selectedMedia.alt_text || ''}
                                        onChange={(e) => setSelectedMedia({ ...selectedMedia, alt_text: e.target.value })}
                                        placeholder="Description pour les moteurs de recherche"
                                    />
                                </div>

                                <div>
                                    <Label>Description</Label>
                                    <Textarea
                                        value={selectedMedia.description || ''}
                                        onChange={(e) => setSelectedMedia({ ...selectedMedia, description: e.target.value })}
                                        placeholder="Description détaillée"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <Label>URL Publique</Label>
                                    <div className="flex gap-2">
                                        <Input value={selectedMedia.public_url || ''} disabled />
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => navigator.clipboard.writeText(selectedMedia.public_url || '')}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 justify-between pt-4">
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(selectedMedia.id, selectedMedia.storage_path)}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </Button>
                                <Button
                                    onClick={handleUpdateMetadata}
                                    className="bg-[#D4AF37] hover:bg-[#B8860B] text-slate-900"
                                >
                                    Sauvegarder les modifications
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
