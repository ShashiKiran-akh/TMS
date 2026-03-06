import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
export function SOW() {
    const { profile } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ title: '', clientName: '', scopeOfWork: '' });
    useEffect(() => {
        if (profile)
            loadDocuments();
    }, [profile]);
    async function loadDocuments() {
        try {
            const { data, error } = await supabase
                .from('sow_documents')
                .select('*')
                .order('created_at', { ascending: false });
            if (error)
                throw error;
            setDocuments(data || []);
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
            const { error } = await supabase.from('sow_documents').insert([{
                    document_number: `SOW-${Date.now()}`,
                    title: formData.title,
                    client_name: formData.clientName,
                    scope_of_work: formData.scopeOfWork,
                    status: 'draft',
                    created_by: profile?.id,
                }]);
            if (error)
                throw error;
            setShowForm(false);
            setFormData({ title: '', clientName: '', scopeOfWork: '' });
            loadDocuments();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    async function updateStatus(id, status) {
        try {
            const updateData = { status };
            if (status === 'approved') {
                updateData.approved_by = profile?.id;
                updateData.approved_at = new Date().toISOString();
            }
            await supabase.from('sow_documents').update(updateData).eq('id', id);
            loadDocuments();
        }
        catch (error) {
            console.error('Error:', error);
        }
    }
    return (_jsx(DashboardLayout, { children: _jsxs("div", { children: [_jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }, children: [_jsx("h2", { style: { color: 'var(--color-neutral-900)' }, children: "SOW Documents" }), !showForm && _jsx(Button, { onClick: () => setShowForm(true), children: "Generate SOW" })] }), showForm && (_jsx(Card, { title: "Generate SOW", style: { marginBottom: 'var(--spacing-3)' }, children: _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(Input, { label: "Title", value: formData.title, onChange: (e) => setFormData({ ...formData, title: e.target.value }), required: true, fullWidth: true }), _jsx(Input, { label: "Client Name", value: formData.clientName, onChange: (e) => setFormData({ ...formData, clientName: e.target.value }), required: true, fullWidth: true }), _jsxs("div", { style: { marginBottom: 'var(--spacing-2)' }, children: [_jsx("label", { style: { display: 'block', marginBottom: 'var(--spacing-1)', fontSize: '0.875rem', fontWeight: '500' }, children: "Scope of Work" }), _jsx("textarea", { value: formData.scopeOfWork, onChange: (e) => setFormData({ ...formData, scopeOfWork: e.target.value }), required: true, style: { width: '100%', minHeight: '100px', padding: '10px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-neutral-300)' } })] }), _jsxs("div", { style: { display: 'flex', gap: 'var(--spacing-2)' }, children: [_jsx(Button, { type: "submit", children: "Generate" }), _jsx(Button, { type: "button", variant: "ghost", onClick: () => setShowForm(false), children: "Cancel" })] })] }) })), loading ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "Loading..." }) })) : documents.length === 0 ? (_jsx(Card, { children: _jsx("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: "No SOW documents" }) })) : (_jsx("div", { style: { display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }, children: documents.map((doc) => (_jsx(Card, { children: _jsxs("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [_jsxs("div", { children: [_jsx("h3", { style: { margin: '0 0 8px 0' }, children: doc.title }), _jsxs("div", { style: { fontSize: '0.875rem', color: 'var(--color-neutral-600)' }, children: [doc.document_number, " | Client: ", doc.client_name, " | Status: ", doc.status] })] }), doc.status === 'pending_approval' && ['client_manager', 'admin'].includes(profile?.role || '') && (_jsxs("div", { style: { display: 'flex', gap: '8px' }, children: [_jsx(Button, { size: "sm", variant: "success", onClick: () => updateStatus(doc.id, 'approved'), children: "Approve" }), _jsx(Button, { size: "sm", variant: "error", onClick: () => updateStatus(doc.id, 'rejected'), children: "Reject" })] }))] }) }, doc.id))) }))] }) }));
}
