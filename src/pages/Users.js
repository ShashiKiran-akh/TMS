import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function Users() {
    const { profile } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (profile?.role === 'admin')
            loadUsers();
    }, [profile]);
    async function loadUsers() {
        try {
            const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
            if (error)
                throw error;
            setUsers(data || []);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }
    if (profile?.role !== 'admin') {
        return (_jsx(DashboardLayout, { children: _jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-error-600)' }, children: "Admin only" }) }) }));
    }
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }, children: [_jsx("h2", { style: { color: 'var(--color-neutral-900)' }, children: "Users" }), _jsx(Button, { children: "Add User" })] }), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading..." }) })) : users.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No users" }) })) : (_jsx(Card, { children: _jsxs("table", { style: { width: '100%', borderCollapse: 'collapse' }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: '2px solid var(--color-neutral-200)' }, children: [_jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }, children: "User" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }, children: "Email" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }, children: "Role" }), _jsx("th", { style: { padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }, children: "Action" })] }) }), _jsx("tbody", { children: users.map((user) => (_jsxs("tr", { style: { borderBottom: '1px solid var(--color-neutral-200)' }, children: [_jsx("td", { style: { padding: '12px' }, children: _jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '12px' }, children: [_jsx("div", { style: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)', fontWeight: '600' }, children: user.full_name.charAt(0).toUpperCase() }), _jsx("div", { style: { fontWeight: '500' }, children: user.full_name })] }) }), _jsx("td", { style: { padding: '12px', color: 'var(--color-neutral-600)' }, children: user.email }), _jsx("td", { style: { padding: '12px' }, children: _jsx("span", { style: { padding: '4px 8px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', textTransform: 'capitalize' }, children: user.role.replace('_', ' ') }) }), _jsx("td", { style: { padding: '12px' }, children: _jsx(Button, { size: "sm", variant: "ghost", children: "Edit" }) })] }, user.id))) })] }) }))] }) }));
}
