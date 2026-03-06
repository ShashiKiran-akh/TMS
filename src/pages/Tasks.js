import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function Tasks() {
    const { profile } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (profile)
            loadTasks();
    }, [profile]);
    async function loadTasks() {
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*, projects(name)')
                .eq('assigned_to', profile?.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setTasks(data || []);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function updateTaskStatus(taskId, newStatus) {
        try {
            await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
            loadTasks();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsx("h2", { style: { marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }, children: "My Tasks" }), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading tasks..." }) })) : tasks.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No tasks found" }) })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }, children: tasks.map((task) => (_jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 8px 0' }, children: task.title }), _jsxs("div", { style: { fontSize: '0.875rem', color: 'var(--color-neutral-500)' }, children: [task.projects && `Project: ${task.projects.name}`, " | Status: ", task.status] })] }), task.status === 'todo' && _jsx(Button, { size: "sm", onClick: () => updateTaskStatus(task.id, 'in_progress'), children: "Start" }), task.status === 'in_progress' && _jsx(Button, { size: "sm", variant: "warning", onClick: () => updateTaskStatus(task.id, 'in_review'), children: "Review" }), task.status === 'in_review' && _jsx(Button, { size: "sm", variant: "success", onClick: () => updateTaskStatus(task.id, 'completed'), children: "Complete" })] }) }, task.id))) }))] }) }));
}
