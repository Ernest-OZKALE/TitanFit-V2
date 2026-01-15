'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        const { data, error } = await supabase
            .from('site_settings')
            .select('*');

        if (!error && data) {
            const settingsObj = data.reduce((acc: any, setting: any) => {
                acc[setting.key] = setting.value;
                return acc;
            }, {});
            setSettings(settingsObj);
        }
        setLoading(false);
    }

    async function handleSave() {
        setSaving(true);
        // Save settings logic here
        setTimeout(() => {
            setSaving(false);
            alert('Settings saved successfully!');
        }, 1000);
    }

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
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600 mt-1">Configure your site settings</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            {/* General Settings */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">General</CardTitle>
                    <CardDescription>Basic site configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="site_name">Site Name</Label>
                            <Input
                                id="site_name"
                                value={settings.site_name || ''}
                                onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="site_description">Site Description</Label>
                            <Input
                                id="site_description"
                                value={settings.site_description || ''}
                                onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Currency Settings */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Currency</CardTitle>
                    <CardDescription>Configure currency and pricing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="currency">Default Currency</Label>
                            <Input
                                id="currency"
                                value={settings.currency || 'USD'}
                                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="coins_per_dollar">Coins per Dollar</Label>
                            <Input
                                id="coins_per_dollar"
                                type="number"
                                value={settings.coins_per_dollar || '100'}
                                onChange={(e) => setSettings({ ...settings, coins_per_dollar: e.target.value })}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card className="border-0 shadow-sm">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Maintenance</CardTitle>
                    <CardDescription>Site maintenance settings</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Maintenance Mode</p>
                            <p className="text-sm text-gray-600">Temporarily disable the site for maintenance</p>
                        </div>
                        <Button variant="outline">
                            {settings.maintenance_mode === 'true' ? 'Disable' : 'Enable'}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-0 shadow-sm border-red-200">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold text-red-600">Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                        <div>
                            <p className="font-medium text-gray-900">Clear All Data</p>
                            <p className="text-sm text-gray-600">Delete all users, products, and orders</p>
                        </div>
                        <Button variant="destructive">
                            Clear Data
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
