import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';
export function Dashboard() {
    const { profile } = useAuth();
    const [stats, setStats] = useState({ myTasks: 0, pendingLeaves: 0 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (profile)
            loadDashboardData();
    }, [profile]);
    async function loadDashboardData() {
        try {
            const [tasksResult, leavesResult] = await Promise.all([
                supabase
                    .from('tasks')
                    .select('id', { count: 'exact', head: true })
                    .eq('assigned_to', profile?.id)
                    .in('status', ['todo', 'in_progress']),
                supabase
                    .from('leave_requests')
                    .select('id', { count: 'exact', head: true })
                    .eq('user_id', profile?.id)
                    .eq('status', 'pending'),
            ]);
            setStats({
                myTasks: tasksResult.count || 0,
                pendingLeaves: leavesResult.count || 0,
            });
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("h2", { style: { marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }, children: ["Welcome back, ", profile?.full_name] }), _jsxs("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: 'var(--spacing-3)',
                        marginBottom: 'var(--spacing-4)',
                    }, children: [_jsx(Card, { children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: {
                                            fontSize: '2.5rem',
                                            fontWeight: '700',
                                            color: 'var(--color-primary-600)',
                                            marginBottom: 'var(--spacing-1)',
                                        }, children: loading ? '...' : stats.myTasks }), _jsx("div", { style: { color: 'var(--color-neutral-600)', fontSize: '0.875rem' }, children: "Active Tasks" })] }) }), _jsx(Card, { children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: {
                                            fontSize: '2.5rem',
                                            fontWeight: '700',
                                            color: 'var(--color-warning-600)',
                                            marginBottom: 'var(--spacing-1)',
                                        }, children: loading ? '...' : stats.pendingLeaves }), _jsx("div", { style: { color: 'var(--color-neutral-600)', fontSize: '0.875rem' }, children: "Pending Leaves" })] }) })] }), _jsx(Card, { title: "Quick Links", children: _jsxs("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }, children: [_jsx("a", { href: "/tasks", style: { padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }, children: "View My Tasks" }), _jsx("a", { href: "/time-logs", style: { padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }, children: "Log Time" }), _jsx("a", { href: "/leaves", style: { padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }, children: "Request Leave" })] }) })] }) }));
}
