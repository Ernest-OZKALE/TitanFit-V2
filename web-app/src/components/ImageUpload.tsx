'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Loader2, Camera } from 'lucide-react';

interface ImageUploadProps {
    bucket: string;
    onUploadComplete: (url: string) => void;
    currentImage?: string;
}

export default function ImageUpload({ bucket, onUploadComplete, currentImage }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Vous devez sélectionner une image.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

            onUploadComplete(data.publicUrl);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group w-32 h-32 rounded-full overflow-hidden bg-black/50 border-2 border-[#D4AF37] shadow-[0_0_15px_-3px_#D4AF37] transition-all hover:shadow-[0_0_25px_-3px_#D4AF37] hover:scale-105">
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-[#D4AF37]/50">
                        <Camera className="h-10 w-10 mb-1" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                    {uploading ? (
                        <Loader2 className="h-8 w-8 text-[#D4AF37] animate-spin" />
                    ) : (
                        <label htmlFor="single-upload" className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white text-xs font-bold uppercase tracking-wider">
                            <Upload className="h-6 w-6 mb-1 text-[#D4AF37]" />
                            Modifier
                        </label>
                    )}
                </div>

                <input
                    type="file"
                    id="single-upload"
                    accept="image/*"
                    onChange={uploadImage}
                    disabled={uploading}
                    className="hidden"
                />
            </div>

            {error && <p className="text-xs text-red-500 bg-red-900/20 px-2 py-1 rounded border border-red-500/50">{error}</p>}
        </div>
    );
}
