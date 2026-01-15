import { supabase } from '@/lib/supabase';
import { CmsMediaLibrary } from '@/types/cms';

/**
 * Media Service for Supabase Storage integration
 */
export class MediaService {
    private static BUCKET_NAME = 'cms-media'; // Supabase Storage bucket

    /**
     * Upload a file to Supabase Storage and create DB record
     */
    static async uploadFile(file: File): Promise<CmsMediaLibrary | null> {
        try {
            // 1. Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;

            // 2. Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from(this.BUCKET_NAME)
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false,
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return null;
            }

            // 3. Get public URL
            const { data: urlData } = supabase.storage
                .from(this.BUCKET_NAME)
                .getPublicUrl(filePath);

            // 4. Create DB record
            const { data: mediaRecord, error: dbError } = await supabase
                .from('cms_media_library')
                .insert({
                    filename: fileName,
                    original_filename: file.name,
                    storage_path: filePath,
                    public_url: urlData.publicUrl,
                    mime_type: file.type,
                    file_size: file.size,
                    // Dimensions will be null for non-images
                    width: null,
                    height: null,
                })
                .select()
                .single();

            if (dbError) {
                console.error('DB error:', dbError);
                // Cleanup storage if DB insert fails
                await supabase.storage.from(this.BUCKET_NAME).remove([filePath]);
                return null;
            }

            return mediaRecord;
        } catch (error) {
            console.error('Upload failed:', error);
            return null;
        }
    }

    /**
     * Get all media files
     */
    static async getAllMedia(): Promise<CmsMediaLibrary[]> {
        const { data, error } = await supabase
            .from('cms_media_library')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Failed to fetch media:', error);
            return [];
        }

        return data || [];
    }

    /**
     * Delete a media file
     */
    static async deleteMedia(id: string, storagePath: string): Promise<boolean> {
        try {
            // 1. Delete from storage
            const { error: storageError } = await supabase.storage
                .from(this.BUCKET_NAME)
                .remove([storagePath]);

            if (storageError) {
                console.error('Storage delete error:', storageError);
                return false;
            }

            // 2. Delete DB record
            const { error: dbError } = await supabase
                .from('cms_media_library')
                .delete()
                .eq('id', id);

            if (dbError) {
                console.error('DB delete error:', dbError);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Delete failed:', error);
            return false;
        }
    }

    /**
     * Update media metadata (alt text, title, description)
     */
    static async updateMediaMetadata(
        id: string,
        metadata: { alt_text?: string; title?: string; description?: string }
    ): Promise<boolean> {
        const { error } = await supabase
            .from('cms_media_library')
            .update(metadata)
            .eq('id', id);

        if (error) {
            console.error('Metadata update error:', error);
            return false;
        }

        return true;
    }
}
