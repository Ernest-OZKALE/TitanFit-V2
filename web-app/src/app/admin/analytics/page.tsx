'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-1">Track your business performance</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Revenue (30d)</CardDescription>
                        <CardTitle className="text-2xl font-bold">$0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-600 font-medium">+0% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">New Users</CardDescription>
                        <CardTitle className="text-2xl font-bold">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-600 font-medium">+0% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Orders</CardDescription>
                        <CardTitle className="text-2xl font-bold">0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-600 font-medium">+0% from last month</p>
                    </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardDescription className="text-xs font-medium text-gray-500 uppercase">Avg Order Value</CardDescription>
                        <CardTitle className="text-2xl font-bold">$0</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-green-600 font-medium">+0% from last month</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Revenue Over Time</CardTitle>
                        <CardDescription>Monthly revenue trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <TrendingUp className="h-16 w-16 mx-auto mb-3" />
                                <p className="font-medium">Chart Coming Soon</p>
                                <p className="text-sm">Revenue data will be visualized here</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">User Growth</CardTitle>
                        <CardDescription>New user registrations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-80 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <Users className="h-16 w-16 mx-auto mb-3" />
                                <p className="font-medium">Chart Coming Soon</p>
                                <p className="text-sm">User growth data will be visualized here</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Top Products */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
                    <CardDescription>Best selling products this month</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-12 text-gray-400">
                        <BarChart3 className="h-12 w-12 mx-auto mb-3" />
                        <p>No sales data available yet</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
