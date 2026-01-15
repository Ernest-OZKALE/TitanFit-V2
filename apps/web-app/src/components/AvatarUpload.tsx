'use client';

import { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface AvatarUploadProps {
    currentAvatar?: string;
    onUploadComplete: (url: string) => void;
    bucket?: string;
}

export default function AvatarUpload({ currentAvatar, onUploadComplete, bucket = 'avatars' }: AvatarUploadProps) {
    const [imageSrc, setImageSrc] = useState<string>('');
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [uploading, setUploading] = useState(false);
    const imgRef = useRef<any>(null);
    const fileInputRef = useRef<any>(null);

    const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const reader = new FileReader();
            reader.addEventListener('load', () =>
                setImageSrc(reader.result?.toString() || '')
            );
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!completedCrop || !imgRef.current) return;

        setUploading(true);
        try {
            // Create canvas from cropped image
            const canvas = document.createElement('canvas');
            const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
            const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
            const ctx = canvas.getContext('2d');

            canvas.width = completedCrop.width;
            canvas.height = completedCrop.height;

            if (ctx) {
                ctx.drawImage(
                    imgRef.current,
                    completedCrop.x * scaleX,
                    completedCrop.y * scaleY,
                    completedCrop.width * scaleX,
                    completedCrop.height * scaleY,
                    0,
                    0,
                    completedCrop.width,
                    completedCrop.height
                );
            }

            // Convert canvas to blob
            canvas.toBlob(async (blob) => {
                if (!blob) return;

                const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });

                // Here you would upload to Supabase Storage
                // For now, create a local URL
                const url = URL.createObjectURL(blob);
                onUploadComplete(url);
                setImageSrc('');
                setUploading(false);
            }, 'image/jpeg', 0.95);
        } catch (error) {
            console.error('Upload error:', error);
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            {!imageSrc ? (
                <div className="flex flex-col items-center">
                    <div className="relative">
                        {currentAvatar ? (
                            <img
                                src={currentAvatar}
                                alt="Avatar"
                                className="w-32 h-32 rounded-full object-cover border-4 border-purple-100"
                            />
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                                <Upload className="h-12 w-12 text-purple-400" />
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={onSelectFile}
                            className="hidden"
                        />
                        <Button
                            type="button"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 right-0 rounded-full w-10 h-10 p-0 bg-purple-600 hover:bg-purple-700"
                        >
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={1}
                            circularCrop
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop preview"
                                className="max-h-96 w-full object-contain"
                            />
                        </ReactCrop>
                    </div>
                    <div className="flex gap-2 justify-center">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setImageSrc('')}
                            disabled={uploading}
                        >
                            <X className="h-4 w-4 mr-2" />
                            Annuler
                        </Button>
                        <Button
                            type="button"
                            onClick={handleUpload}
                            disabled={!completedCrop || uploading}
                            className="bg-purple-600 hover:bg-purple-700"
                        >
                            {uploading ? 'Upload...' : 'Valider'}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
