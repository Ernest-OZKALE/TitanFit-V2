'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Eye } from 'lucide-react';

export default function ContentPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        const { data, error } = await supabase
            .from('content_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setPosts(data);
        }
        setLoading(false);
    }

    const filteredPosts = posts.filter(p =>
        p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content</h1>
                    <p className="text-gray-600 mt-1">Manage blog posts and articles</p>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Posts</CardDescription>
                        <CardTitle className="text-2xl font-bold">{posts.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Published</CardDescription>
                        <CardTitle className="text-2xl font-bold">{posts.filter(p => p.status === 'published').length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Drafts</CardDescription>
                        <CardTitle className="text-2xl font-bold">{posts.filter(p => p.status === 'draft').length}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search */}
            <Card className="border-0 shadow-sm">
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Posts List */}
            {filteredPosts.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                            <p className="text-gray-600 mb-4">Start creating content for your users</p>
                            <Button className="bg-purple-600 hover:bg-purple-700">
                                <Plus className="h-4 w-4 mr-2" />
                                New Post
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-200">
                            {filteredPosts.map((post) => (
                                <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                                                <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                                    {post.status}
                                                </Badge>
                                                {post.category && (
                                                    <Badge variant="outline">{post.category}</Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {post.excerpt || 'No excerpt'}
                                            </p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Created {new Date(post.created_at).toLocaleDateString()}</span>
                                                {post.published_at && (
                                                    <span>Published {new Date(post.published_at).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 ml-4">
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4 mr-1" />
                                                View
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
