'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, DollarSign, Package, TrendingUp } from 'lucide-react';

export default function OrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        profiles (username, email)
      `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setOrders(data);
        }
        setLoading(false);
    }

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0);

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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
                <p className="text-gray-600 mt-1">Manage customer orders and transactions</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Orders</CardDescription>
                        <CardTitle className="text-2xl font-bold">{orders.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Pending</CardDescription>
                        <CardTitle className="text-2xl font-bold">{orders.filter(o => o.status === 'pending').length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Completed</CardDescription>
                        <CardTitle className="text-2xl font-bold">{orders.filter(o => o.status === 'completed').length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Total Revenue</CardDescription>
                        <CardTitle className="text-2xl font-bold">${totalRevenue.toFixed(2)}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
                <Card className="border-0 shadow-sm">
                    <CardContent className="py-12">
                        <div className="text-center">
                            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-600">Orders will appear here when customers make purchases</p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-0 shadow-sm">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900">#{order.id.slice(0, 8)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{order.profiles?.username || 'Unknown'}</div>
                                                <div className="text-sm text-gray-500">{order.profiles?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">${parseFloat(order.total_amount).toFixed(2)}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge variant={
                                                    order.status === 'completed' ? 'default' :
                                                        order.status === 'pending' ? 'secondary' :
                                                            'destructive'
                                                }>
                                                    {order.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(order.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Button variant="outline" size="sm">
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
