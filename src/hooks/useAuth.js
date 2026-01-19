import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useAuth = () => {
    const [session, setSession] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (userId) => {
        // v2 profile logic will eventually go here
        // For now, return a placeholder until Phase 3 Step 3 is live
        return { full_name: 'Developer Mode' };
    };

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            if (session) {
                fetchProfile(session.user.id).then(p => {
                    setProfile(p);
                    setLoading(false);
                });
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) fetchProfile(session.user.id).then(setProfile);
        });

        return () => subscription.unsubscribe();
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
        setSession(null);
        setProfile(null);
        window.location.reload();
    };

    return { session, profile, loading, logout, setProfile, setLoading };
};