import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session?.user) {
                loadProfile(session.user.id);
            }
            else {
                setLoading(false);
            }
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            (async () => {
                setSession(session);
                setUser(session?.user ?? null);
                if (session?.user) {
                    await loadProfile(session.user.id);
                }
                else {
                    setProfile(null);
                    setLoading(false);
                }
            })();
        });
        return () => subscription.unsubscribe();
    }, []);
    async function loadProfile(userId) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .maybeSingle();
            if (error)
                throw error;
            setProfile(data);
        }
        catch (error) {
            console.error('Error loading profile:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error)
            throw error;
        if (data.user) {
            await loadProfile(data.user.id);
        }
    }
    async function signUp(email, password, fullName, role) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error)
            throw error;
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                {
                    id: data.user.id,
                    email,
                    full_name: fullName,
                    role,
                },
            ]);
            if (profileError)
                throw profileError;
            await loadProfile(data.user.id);
        }
    }
    async function signOut() {
        const { error } = await supabase.auth.signOut();
        if (error)
            throw error;
        setUser(null);
        setProfile(null);
        setSession(null);
    }
    return (_jsx(AuthContext.Provider, { value: {
            user,
            profile,
            session,
            loading,
            signIn,
            signUp,
            signOut,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
