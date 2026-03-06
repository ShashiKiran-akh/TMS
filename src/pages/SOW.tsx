import { useEffect, useState, FormEvent } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SOWDocument {
  id: string;
  document_number: string;
  title: string;
  client_name: string;
  status: string;
}

export function SOW() {
  const { profile } = useAuth();
  const [documents, setDocuments] = useState<SOWDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', clientName: '', scopeOfWork: '' });

  useEffect(() => {
    if (profile) loadDocuments();
  }, [profile]);

  async function loadDocuments() {
    try {
      const { data, error } = await supabase
        .from('sow_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
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

      if (error) throw error;
      setShowForm(false);
      setFormData({ title: '', clientName: '', scopeOfWork: '' });
      loadDocuments();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function updateStatus(id: string, status: string) {
    try {
      const updateData: any = { status };
      if (status === 'approved') {
        updateData.approved_by = profile?.id;
        updateData.approved_at = new Date().toISOString();
      }
      await supabase.from('sow_documents').update(updateData).eq('id', id);
      loadDocuments();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h2 style={{ color: 'var(--color-neutral-900)' }}>SOW Documents</h2>
          {!showForm && <Button onClick={() => setShowForm(true)}>Generate SOW</Button>}
        </div>

        {showForm && (
          <Card title="Generate SOW" style={{ marginBottom: 'var(--spacing-3)' }}>
            <form onSubmit={handleSubmit}>
              <Input label="Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required fullWidth />
              <Input label="Client Name" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} required fullWidth />
              <div style={{ marginBottom: 'var(--spacing-2)' }}>
                <label style={{ display: 'block', marginBottom: 'var(--spacing-1)', fontSize: '0.875rem', fontWeight: '500' }}>Scope of Work</label>
                <textarea value={formData.scopeOfWork} onChange={(e) => setFormData({ ...formData, scopeOfWork: e.target.value })} required style={{ width: '100%', minHeight: '100px', padding: '10px', borderRadius: 'var(--border-radius-md)', border: '1px solid var(--color-neutral-300)' }} />
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button type="submit">Generate</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : documents.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No SOW documents</div></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {documents.map((doc) => (
              <Card key={doc.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{doc.title}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                      {doc.document_number} | Client: {doc.client_name} | Status: {doc.status}
                    </div>
                  </div>
                  {doc.status === 'pending_approval' && ['client_manager', 'admin'].includes(profile?.role || '') && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button size="sm" variant="success" onClick={() => updateStatus(doc.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="error" onClick={() => updateStatus(doc.id, 'rejected')}>Reject</Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
