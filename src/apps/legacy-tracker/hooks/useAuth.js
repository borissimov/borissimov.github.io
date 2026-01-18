import { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { DataManager } from '../../../data/DataManager';

export const useAuth = () => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = async (userId) => {
        const p = await DataManager.getProfile(userId);
        setProfile(p);
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) refreshProfile(session.user.id).finally(() => setLoading(false));
            else setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) refreshProfile(session.user.id); // Auth change doesn't always need to block loading
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        
        // Reset to Offline Mode on Logout
        sessionStorage.removeItem('mp_is_temp_online');
        localStorage.setItem('mp_use_mock_db', 'true');

        setSession(null);
        setProfile(null);
        
        // Force reload to re-initialize supabase client in Mock mode
        window.location.reload();
    };

    return { session, profile, loading, logout, refreshProfile, setLoading };
};
