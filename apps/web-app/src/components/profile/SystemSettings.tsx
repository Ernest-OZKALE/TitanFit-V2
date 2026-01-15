'use client';

import { Bell, Moon, Shield, Smartphone, LogOut, ChevronRight, ToggleRight, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export function SystemSettings() {
    const { signOut } = useAuth();

    return (
        <div className="space-y-8">
            {/* Preferences */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Préférences</h3>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <SettingItem icon={Moon} label="Mode Sombre (Titanium)" description="Thème sombre haute performance">
                        <Switch id="dark-mode" />
                    </SettingItem>
                    <div className="h-px bg-slate-100 mx-6" />
                    <SettingItem icon={Bell} label="Notifications" description="Rappels d'entraînement & social">
                        <Switch id="notifications" defaultChecked />
                    </SettingItem>
                </div>
            </section>

            {/* Security */}
            <section className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-2">Sécurité</h3>
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <button className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors text-left group">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-slate-900 transition-colors">
                                <Shield className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">Mot de Passe</h4>
                                <p className="text-xs text-slate-400">Modifié il y a 30 jours</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                    </button>
                </div>
            </section>

            {/* Danger Zone */}
            <section className="pt-4">
                <Button
                    onClick={() => signOut()}
                    variant="outline"
                    className="w-full h-14 rounded-2xl border-2 border-red-50 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-widest flex items-center justify-center gap-2"
                >
                    <LogOut className="w-4 h-4" /> Se déconnecter
                </Button>
            </section>
        </div>
    );
}

function SettingItem({ icon: Icon, label, description, children }: { icon: any, label: string, description: string, children: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-900">{label}</h4>
                    <p className="text-xs text-slate-400">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
