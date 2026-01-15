import { supabase } from '@/lib/supabase';
import { CmsPage, CmsSection } from '@/types/cms';

// Singleton instance to be used across the app
export class CmsService {

    /**
     * Fetch a full page layout by its slug
     * Includes all active sections ordered by index
     */
    static async getPageBySlug(slug: string): Promise<{ page: CmsPage; sections: CmsSection[] } | null> {
        // 1. Get Page Metadata
        const { data: page, error: pageError } = await supabase
            .from('cms_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (pageError || !page) {
            console.error(`CMS Error: Page not found [${slug}]`, pageError);
            return null;
        }

        // 2. Get Sections for this Page
        const { data: sections, error: sectionError } = await supabase
            .from('cms_sections')
            .select('*')
            .eq('page_id', page.id)
            .eq('is_visible', true)
            .order('order_index', { ascending: true });

        if (sectionError) {
            console.error(`CMS Error: Could not fetch sections for [${slug}]`, sectionError);
            return { page, sections: [] };
        }

        return { page, sections: sections || [] };
    }

    /**
     * Fetch global settings (e.g. navbar links)
     */
    static async getGlobalSettings(key: string) {
        const { data, error } = await supabase
            .from('cms_settings')
            .select('value')
            .eq('key', key)
            .single();

        if (error) return null;
        return data?.value;
    }
}
