import { useEffect, useState, FormEvent } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface LeaveRequest {
  id: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  status: string;
}

export function Leaves() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ leaveType: 'vacation', startDate: '', endDate: '' });

  useEffect(() => {
    if (profile) loadRequests();
  }, [profile]);

  async function loadRequests() {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('leave_requests').insert([{
        user_id: profile?.id,
        leave_type: formData.leaveType,
        start_date: formData.startDate,
        end_date: formData.endDate,
        status: 'pending',
      }]);
      if (error) throw error;
      setShowForm(false);
      setFormData({ leaveType: 'vacation', startDate: '', endDate: '' });
      loadRequests();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const leaveOptions = [
    { value: 'vacation', label: 'Vacation' },
    { value: 'sick', label: 'Sick Leave' },
    { value: 'personal', label: 'Personal' },
  ];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h2 style={{ color: 'var(--color-neutral-900)' }}>Leave Requests</h2>
          {!showForm && <Button onClick={() => setShowForm(true)}>Request Leave</Button>}
        </div>

        {showForm && (
          <Card title="New Leave Request" style={{ marginBottom: 'var(--spacing-3)' }}>
            <form onSubmit={handleSubmit}>
              <Select label="Type" value={formData.leaveType} onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })} options={leaveOptions} required fullWidth />
              <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required fullWidth />
              <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required fullWidth />
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button type="submit">Submit</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : requests.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No leave requests</div></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {requests.map((req) => (
              <Card key={req.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', textTransform: 'capitalize' }}>{req.leave_type} Leave</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                      {new Date(req.start_date).toLocaleDateString()} - {new Date(req.end_date).toLocaleDateString()} | Status: {req.status}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
