import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function Leaves() {
    const { profile } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ leaveType: 'vacation', startDate: '', endDate: '' });
    useEffect(() => {
        if (profile)
            loadRequests();
    }, [profile]);
    async function loadRequests() {
        try {
            const { data, error } = await supabase
                .from('leave_requests')
                .select('*')
                .eq('user_id', profile?.id)
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setRequests(data || []);
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
            const { error } = await supabase.from('leave_requests').insert([{
                    user_id: profile?.id,
                    leave_type: formData.leaveType,
                    start_date: formData.startDate,
                    end_date: formData.endDate,
                    status: 'pending',
                }]);
            if (error)
                throw error;
            setShowForm(false);
            setFormData({ leaveType: 'vacation', startDate: '', endDate: '' });
            loadRequests();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    const leaveOptions = [
        { value: 'vacation', label: 'Vacation' },
        { value: 'sick', label: 'Sick Leave' },
        { value: 'personal', label: 'Personal' },
    ];
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }, children: [_jsx("h2", { style: { color: 'var(--color-neutral-900)' }, children: "Leave Requests" }), !showForm && _jsx(Button, { onClick: () => setShowForm(true), children: "Request Leave" })] }), showForm && (_jsx(Card, { title: "New Leave Request", style: { marginBottom: 'var(--spacing-3)' }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(Select, { label: "Type", value: formData.leaveType, onChange: (e) => setFormData({ ...formData, leaveType: e.target.value }), options: leaveOptions, required: true, fullWidth: true }), _jsx(Input, { label: "Start Date", type: "date", value: formData.startDate, onChange: (e) => setFormData({ ...formData, startDate: e.target.value }), required: true, fullWidth: true }), _jsx(Input, { label: "End Date", type: "date", value: formData.endDate, onChange: (e) => setFormData({ ...formData, endDate: e.target.value }), required: true, fullWidth: true }), _jsxs("div", { style: { display: 'flex', gap: 'var(--spacing-2)' }, children: [_jsx(Button, { type: "submit", children: "Submit" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowForm(false), children: "Cancel" })] })] }) })), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading..." }) })) : requests.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No leave requests" }) })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }, children: requests.map((req) => (_jsx(Card, { children: _jsx("div", { style: { display: 'flex', justifyContent: 'space-between' }, children: _jsxs("div", { children: [_jsxs("h3", { style: { margin: '0 0 8px 0', textTransform: 'capitalize' }, children: [req.leave_type, " Leave"] }), _jsxs("div", { style: { fontSize: '0.875rem', color: 'var(--color-neutral-600)' }, children: [new Date(req.start_date).toLocaleDateString(), " - ", new Date(req.end_date).toLocaleDateString(), " | Status: ", req.status] })] }) }) }, req.id))) }))] }) }));
}
