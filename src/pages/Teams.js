import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function Teams() {
    const { profile } = useAuth();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (profile)
            loadTeams();
    }, [profile]);
    async function loadTeams() {
        try {
            const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
            if (error)
                throw error;
            setTeams(data || []);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }, children: [_jsx("h2", { style: { color: 'var(--color-neutral-900)' }, children: "Teams" }), ['manager', 'admin'].includes(profile?.role || '') && _jsx(Button, { children: "Create Team" })] }), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading..." }) })) : teams.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No teams" }) })) : (_jsx("div", { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }, children: teams.map((team) => (_jsxs(Card, { children: [_jsx("h3", { style: { margin: '0 0 8px 0' }, children: team.name }), team.description && _jsx("p", { style: { fontSize: '0.875rem', color: 'var(--color-neutral-600)', margin: '0 0 12px 0' }, children: team.description }), _jsx(Button, { variant: "ghost", size: "sm", fullWidth: true, children: "View Team" })] }, team.id))) }))] }) }));
}
