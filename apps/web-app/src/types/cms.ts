// Types for Titan CMS V2
// Matches the structure defined in supabase/titan_cms_v1.sql and titan_cms_v2.sql

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface CmsPage {
    id: string
    slug: string
    title: string
    seo_title: string | null
    seo_description: string | null
    is_published: boolean
    created_at: string
    updated_at: string
}

export interface CmsSection {
    id: string
    page_id: string
    section_type: 'hero' | 'marquee' | 'bento_grid' | 'horizontal_scroll' | 'features' | 'cta' | 'html' | 'paywall' | 'stats' | 'program' | string
    order_index: number
    title: string | null
    subtitle: string | null
    description: string | null
    content: Record<string, any>
    style_config: Record<string, any>
    component_name: string | null
    is_visible: boolean
    media_id: string | null // V2: Link to Media Library
    locked: boolean // V2: Premium feature lock
    created_at: string
    updated_at: string
}

export interface CmsSettings {
    key: string
    value: Record<string, any>
    description: string | null
}

// ============================================================================
// CMS V2: New Tables
// ============================================================================

export interface CmsMediaLibrary {
    id: string
    filename: string
    original_filename: string
    storage_path: string
    public_url: string | null
    mime_type: string
    file_size: number
    width: number | null
    height: number | null
    alt_text: string | null
    title: string | null
    description: string | null
    uploaded_by: string | null
    created_at: string
}

export interface CmsComponent {
    id: string
    component_name: string
    display_name: string
    category: string | null
    description: string | null
    icon: string | null
    props_schema: Record<string, any>
    default_content: Record<string, any>
    is_active: boolean
    created_at: string
}

export interface CmsMenu {
    id: string
    location: 'header' | 'footer' | 'sidebar' | string
    label: string
    url: string | null
    icon: string | null
    parent_id: string | null
    order_index: number
    is_visible: boolean
    target: '_self' | '_blank'
    created_at: string
}

// ============================================================================
// Specific Content Interfaces for Type Safety in Components
// ============================================================================

export interface HeroContent {
    badge?: string
    heading_line_1?: string
    heading_gradient?: string
    description?: string
    cta_primary?: { text: string; href: string }
    cta_secondary?: { text: string; href: string }
}

export interface ScrollItem {
    id: number | string
    title: string
    subtitle: string
    description: string
    img: string
    color?: string
    textColor?: string
}

export interface HorizontalScrollContent {
    title_line_1?: string
    title_highlight?: string
    description?: string
    items: ScrollItem[]
}

export interface BentoItem {
    title: string
    description: string
    col_span?: number
    img?: string
    icon?: string
}

export interface BentoGridContent {
    title: string
    description: string
    items: BentoItem[]
}

// ============================================================================
// CMS V2: Advanced Component Content Types
// ============================================================================

export interface PaywallContent {
    heading: string
    benefits: string[]
    rating: number
    testimonial: {
        author: string
        text: string
        rating: number
    }
    cta_text: string
    pricing: {
        amount: string
        period: string
        trial_text: string
    }
}

export interface StatItem {
    label: string
    value: string
    icon: string
    color: string
    locked: boolean
}

export interface StatsWidgetContent {
    stats: StatItem[]
    no_data_text: string
    upgrade_prompt: {
        title: string
        description: string
        cta_text: string
    }
}

export interface ProgramCardContent {
    title: string
    duration: string
    level: string
    thumbnail: string
    badge?: string
}
