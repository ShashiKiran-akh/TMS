import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  myTasks: number;
  pendingLeaves: number;
}

export function Dashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ myTasks: 0, pendingLeaves: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadDashboardData();
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
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }}>
          Welcome back, {profile?.full_name}
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-4)',
          }}
        >
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--color-primary-600)',
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                {loading ? '...' : stats.myTasks}
              </div>
              <div style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>
                Active Tasks
              </div>
            </div>
          </Card>

          <Card>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: 'var(--color-warning-600)',
                  marginBottom: 'var(--spacing-1)',
                }}
              >
                {loading ? '...' : stats.pendingLeaves}
              </div>
              <div style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>
                Pending Leaves
              </div>
            </div>
          </Card>
        </div>

        <Card title="Quick Links">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            <a href="/tasks" style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }}>View My Tasks</a>
            <a href="/time-logs" style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }}>Log Time</a>
            <a href="/leaves" style={{ padding: 'var(--spacing-2)', backgroundColor: 'var(--color-neutral-50)', borderRadius: 'var(--border-radius-md)', textDecoration: 'none', color: 'var(--color-neutral-900)' }}>Request Leave</a>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
