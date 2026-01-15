
import { createClient } from "@supabase/supabase-js";

// Fetch logic for server components
export async function getLandingPageData() {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    try {
        // 1. Get Home Page
        const { data: page, error: pageError } = await supabase
            .from('cms_pages')
            .select('id, seo_title, seo_description')
            .eq('slug', 'home')
            .single();

        if (pageError || !page) return null;

        // 2. Get Sections
        const { data: sections, error: sectionError } = await supabase
            .from('cms_sections')
            .select('*')
            .eq('page_id', page.id)
            .order('order_index', { ascending: true });

        if (sectionError) return null;

        // 3. Transform into a map for easy access
        // e.g. { hero: { ... }, features: { ... } }
        const contentMap: Record<string, any> = {};
        sections.forEach((section) => {
            contentMap[section.section_type] = {
                title: section.title,
                subtitle: section.subtitle,
                ...section.content
            };
        });

        return {
            seo: { title: page.seo_title, description: page.seo_description },
            sections: contentMap
        };

    } catch (error) {
        console.error("CMS Fetch Error:", error);
        return null;
    }
}
