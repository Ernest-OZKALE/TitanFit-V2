import { getAllPosts, getPostBySlug } from '@/lib/blog';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { PremiumNavbar } from '@/components/PremiumNavbar';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

// Correctly type params for Next.js 15/16 App Router
type Props = {
    params: Promise<{ slug: string }>;
};

// Generate Static Params for SSG
export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function BlogPost({ params }: Props) {
    // Unwrap params using React.use() or await in async component
    // Since this is an async component, we can await params
    const { slug } = use(params);
    const post = getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
            <PremiumNavbar />

            <main className="container mx-auto px-4 py-24 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center text-gray-500 hover:text-[#D4AF37] mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour au TitanLog
                </Link>

                <article>
                    <header className="mb-12">
                        <div className="flex gap-2 mb-6">
                            {post.tags?.map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 px-3 py-1 rounded-full">
                                    <Tag className="w-3 h-3" /> {tag}
                                </span>
                            ))}
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 uppercase leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex items-center text-gray-400 font-mono text-sm border-l-2 border-[#D4AF37] pl-4">
                            <Calendar className="w-4 h-4 mr-2" />
                            {post.date}
                        </div>
                    </header>

                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-tight prose-a:text-[#D4AF37] prose-strong:text-white">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </article>
            </main>
        </div>
    );
}
