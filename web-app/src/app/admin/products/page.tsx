'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Package2, DollarSign } from 'lucide-react';

export default function ProductsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setProducts(data);
        }
        setLoading(false);
    }

    const filteredProducts = products.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
                    <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600 mt-1">Manage your product catalog</p>
                </div>
                <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                </Button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Products</CardDescription>
                        <CardTitle className="text-2xl font-bold">{products.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Active</CardDescription>
                        <CardTitle className="text-2xl font-bold">{products.filter(p => p.is_active).length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Out of Stock</CardDescription>
                        <CardTitle className="text-2xl font-bold">{products.filter(p => p.stock_quantity === 0).length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Value</CardDescription>
                        <CardTitle className="text-2xl font-bold">
                            ${products.reduce((sum, p) => sum + (p.price_usd || 0) * (p.stock_quantity || 0), 0).toFixed(2)}
                        </CardTitle>
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
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Package2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products yet</h3>
                            <p className="text-gray-600 mb-4">Get started by creating your first product</p>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProducts.map((product) => (
                        <Card key={product.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                                    {product.image_url ? (
                                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <Package2 className="h-16 w-16 text-gray-400" />
                                    )}
                                </div>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <CardDescription className="line-clamp-2">{product.description || 'No description'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">${product.price_usd}</p>
                                        {product.price_coins && (
                                            <p className="text-sm text-gray-500">{product.price_coins} coins</p>
                                        )}
                                    </div>
                                    <Badge variant={product.is_active ? 'default' : 'secondary'}>
                                        {product.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Stock: {product.stock_quantity}</span>
                                    <Badge variant="outline">{product.category}</Badge>
                                </div>
                                <Button variant="outline" className="w-full mt-4">
                                    Edit Product
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
