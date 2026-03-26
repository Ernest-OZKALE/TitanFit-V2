'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './auth-context';

export function useProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return;
        }

        async function fetchProfile() {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user?.id)
                .single();

            if (!error && data) {
                setProfile(data);
            }
            setLoading(false);
        }

        fetchProfile();
    }, [user]);

    return { profile, loading, isAdmin: profile?.role === 'admin' };
}
