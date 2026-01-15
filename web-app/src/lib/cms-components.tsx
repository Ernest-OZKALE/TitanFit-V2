import { CmsSection } from '@/types/cms';
import dynamic from 'next/dynamic';
import React from 'react';

// Import working components
const HorizontalScrollSection = dynamic(() => import('@/components/HorizontalScrollSection').then(mod => ({ default: mod.HorizontalScrollSection })), { ssr: true });
const PaywallSection = dynamic(() => import('@/components/PaywallSection'), { ssr: true });
const StatsWidget = dynamic(() => import('@/components/StatsWidget'), { ssr: true });
const ProgramCard = dynamic(() => import('@/components/ProgramCard'), { ssr: true });

/**
 * Component Registry
 * Maps component_name from DB to actual React components
 */
export const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
    'HorizontalScrollSection': HorizontalScrollSection,
    'PaywallSection': PaywallSection,
    'StatsWidget': StatsWidget,
    'ProgramCard': ProgramCard,
};

/**
 * Render a CMS section dynamically based on its component_name
 */
export function renderSection(section: CmsSection): React.ReactNode {
    if (!section.is_visible) return null;
    if (section.locked && !section.content.show_locked) return null;

    const Component = COMPONENT_REGISTRY[section.component_name || ''];

    if (!Component) {
        console.warn(`Component not found: ${section.component_name}`);
        return null;
    }

    // Merge section content with style_config
    const props = {
        ...section.content,
        ...section.style_config,
        _sectionId: section.id,
    };

    return <Component key={section.id} {...props} />;
}

/**
 * Render multiple sections in sequence
 */
export function renderSections(sections: CmsSection[]): React.ReactNode[] {
    return sections
        .sort((a, b) => a.order_index - b.order_index)
        .map(section => renderSection(section));
}
