'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Package, ShoppingCart, DollarSign, TrendingUp, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) return null;

    const stats = [
        { name: 'Total Users', value: '0', change: '+0%', icon: Users, color: 'blue' },
        { name: 'Products', value: '0', change: '+0', icon: Package, color: 'green' },
        { name: 'Orders', value: '0', change: '+0%', icon: ShoppingCart, color: 'purple' },
        { name: 'Revenue', value: '$0', change: '+$0', icon: DollarSign, color: 'yellow' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome to your TitanFit admin panel</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.name} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardDescription className="text-sm font-medium text-gray-600">
                                {stat.name}
                            </CardDescription>
                            <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                            <p className="text-xs text-gray-500 mt-1">
                                <span className="text-green-600 font-medium">{stat.change}</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Sales Overview</CardTitle>
                        <CardDescription>Monthly revenue trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <TrendingUp className="h-12 w-12 mb-2" />
                            <p className="ml-2">Chart will appear here</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">User Activity</CardTitle>
                        <CardDescription>Daily active users</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <Activity className="h-12 w-12 mb-2" />
                            <p className="ml-2">Chart will appear here</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                    <CardDescription>Latest actions in your system</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-400">
                        <p>No recent activity</p>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Manage Users</h3>
                            <p className="text-sm text-gray-600 mt-1">View and edit user accounts</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                                <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Add Product</h3>
                            <p className="text-sm text-gray-600 mt-1">Create new product listing</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                                <ShoppingCart className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">View Orders</h3>
                            <p className="text-sm text-gray-600 mt-1">Process customer orders</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
