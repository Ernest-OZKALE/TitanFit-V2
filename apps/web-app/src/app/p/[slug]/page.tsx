import React from 'react';
import { notFound } from 'next/navigation';
import { CmsService } from '@/lib/cms-service';
import { CmsRenderer } from '@/components/cms/CmsRenderer';
import TitaniumBackground from '@/components/TitaniumBackground';
import StandardFooter from '@/components/landing/StandardFooter';

interface CmsDynamicPageProps {
    params: {
        slug: string;
    };
}

/**
 * Public Dynamic Page Route
 * Fetches and renders CMS-managed pages
 */
export default async function CmsDynamicPage({ params }: CmsDynamicPageProps) {
    const { slug } = params;

    // Fetch data from CmsService (Server-side)
    const data = await CmsService.getPageBySlug(slug);

    if (!data) {
        notFound();
    }

    const { page, sections } = data;

    return (
        <main className="relative min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
            {/* Background Layer */}
            <TitaniumBackground />

            {/* SEO Metadata (Simulated - in real app would use generateMetadata) */}
            <title>{page.seo_title || page.title} | TitanFit</title>
            <meta name="description" content={page.seo_description || "TitanFit Dynamic Page"} />

            {/* Content Renderer */}
            <div className="relative z-10">
                <CmsRenderer sections={sections} />
            </div>

            {/* Footer */}
            <StandardFooter />
        </main>
    );
}

// Optional: Generate static paths for better performance
/*
export async function generateStaticParams() {
    // In production, would fetch all published slugs from DB
    return [{ slug: 'demo' }];
}
*/
