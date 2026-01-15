import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { PremiumNavbar } from '@/components/PremiumNavbar';

export default function BlogIndex() {
    const posts = getAllPosts();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
            <PremiumNavbar />

            <main className="container mx-auto px-4 py-24">
                <div className="mb-12">
                    <h1 className="text-5xl font-black mb-4 tracking-tighter uppercase">
                        Titan<span className="text-[#D4AF37]">Log</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl">
                        Explorations sur la performance humaine, la technologie et le futur du fitness.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="group relative block bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37] transition-all duration-300">
                            <div className="p-8">
                                <div className="flex gap-2 mb-4">
                                    {post.tags?.map(tag => (
                                        <span key={tag} className="text-[#D4AF37] text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/30 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <h2 className="text-2xl font-bold mb-3 group-hover:text-[#D4AF37] transition-colors">
                                    {post.title}
                                </h2>
                                <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                                    {post.excerpt}
                                </p>
                                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                                    <span className="text-xs text-gray-500 font-mono">{post.date}</span>
                                    <span className="text-sm font-bold text-white group-hover:translate-x-2 transition-transform">Lire →</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
