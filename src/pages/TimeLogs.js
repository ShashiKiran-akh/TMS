import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function TimeLogs() {
    const { profile } = useAuth();
    const [logs, setLogs] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ taskId: '', hours: '', logDate: new Date().toISOString().split('T')[0] });
    useEffect(() => {
        if (profile)
            loadData();
    }, [profile]);
    async function loadData() {
        try {
            const [logsResult, tasksResult] = await Promise.all([
                supabase.from('time_logs').select('*, tasks(title)').eq('user_id', profile?.id).order('log_date', { ascending: false }),
                supabase.from('tasks').select('id, title').eq('assigned_to', profile?.id).in('status', ['in_progress', 'in_review']),
            ]);
            if (logsResult.error)
                throw logsResult.error;
            if (tasksResult.error)
                throw tasksResult.error;
            setLogs(logsResult.data || []);
            setTasks(tasksResult.data || []);
        }
        catch (error) {
            console.error('Error:', error);
        }
        finally {
            setLoading(false);
        }
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const { error } = await supabase.from('time_logs').insert([{
                    user_id: profile?.id,
                    task_id: formData.taskId,
                    hours: parseFloat(formData.hours),
                    log_date: formData.logDate,
                }]);
            if (error)
                throw error;
            setShowForm(false);
            setFormData({ taskId: '', hours: '', logDate: new Date().toISOString().split('T')[0] });
            loadData();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    const totalHours = logs.reduce((sum, log) => sum + Number(log.hours), 0);
    const taskOptions = [{ value: '', label: 'Select Task' }, ...tasks.map((t) => ({ value: t.id, label: t.title }))];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }, children: [_jsx("h2", { style: { color: 'var(--color-neutral-900)' }, children: "Time Tracking" }), !showForm && _jsx(Button, { onClick: () => setShowForm(true), children: "Log Time" })] }), _jsx("div", { style: { marginBottom: 'var(--spacing-3)' }, children: _jsx(Card, { children: _jsxs("div", { style: { textAlign: 'center' }, children: [_jsx("div", { style: { fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary-600)', marginBottom: '8px' }, children: totalHours.toFixed(1) }), _jsx("div", { style: { color: 'var(--color-neutral-600)', fontSize: '0.875rem' }, children: "Total Hours Logged" })] }) }) }), showForm && (_jsx(Card, { title: "Log Time", style: { marginBottom: 'var(--spacing-3)' }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(Select, { label: "Task", value: formData.taskId, onChange: (e) => setFormData({ ...formData, taskId: e.target.value }), options: taskOptions, required: true, fullWidth: true }), _jsx(Input, { label: "Hours", type: "number", step: "0.5", min: "0.5", value: formData.hours, onChange: (e) => setFormData({ ...formData, hours: e.target.value }), required: true, fullWidth: true }), _jsx(Input, { label: "Date", type: "date", value: formData.logDate, onChange: (e) => setFormData({ ...formData, logDate: e.target.value }), required: true, fullWidth: true }), _jsxs("div", { style: { display: 'flex', gap: 'var(--spacing-2)' }, children: [_jsx(Button, { type: "submit", children: "Save" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowForm(false), children: "Cancel" })] })] }) })), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading..." }) })) : logs.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No time logs" }) })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }, children: logs.map((log) => (_jsx(Card, { children: _jsx("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: _jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 8px 0' }, children: log.tasks?.title || 'Unknown' }), _jsxs("div", { style: { fontSize: '0.875rem', color: 'var(--color-neutral-600)' }, children: [log.hours, "h | ", new Date(log.log_date).toLocaleDateString()] })] }) }) }, log.id))) }))] }) }));
}
