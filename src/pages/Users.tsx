import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Profile } from '../lib/supabase';

export function Users() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.role === 'admin') loadUsers();
  }, [profile]);

  async function loadUsers() {
    try {
      const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  if (profile?.role !== 'admin') {
    return (
      <DashboardLayout>
        <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-error-600)' }}>Admin only</div></Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h2 style={{ color: 'var(--color-neutral-900)' }}>Users</h2>
          <Button>Add User</Button>
        </div>

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : users.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No users</div></Card>
        ) : (
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-neutral-200)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Role</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary-700)', fontWeight: '600' }}>
                          {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ fontWeight: '500' }}>{user.full_name}</div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: 'var(--color-neutral-600)' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: 'var(--border-radius-sm)', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'var(--color-primary-50)', color: 'var(--color-primary-700)', textTransform: 'capitalize' }}>
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Button size="sm" variant="ghost">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
