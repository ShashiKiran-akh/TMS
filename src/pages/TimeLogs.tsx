import { useEffect, useState, FormEvent } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface TimeLog {
  id: string;
  hours: number;
  description: string;
  log_date: string;
  tasks?: { title: string };
}

interface Task {
  id: string;
  title: string;
}

export function TimeLogs() {
  const { profile } = useAuth();
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ taskId: '', hours: '', logDate: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    if (profile) loadData();
  }, [profile]);

  async function loadData() {
    try {
      const [logsResult, tasksResult] = await Promise.all([
        supabase.from('time_logs').select('*, tasks(title)').eq('user_id', profile?.id).order('log_date', { ascending: false }),
        supabase.from('tasks').select('id, title').eq('assigned_to', profile?.id).in('status', ['in_progress', 'in_review']),
      ]);
      if (logsResult.error) throw logsResult.error;
      if (tasksResult.error) throw tasksResult.error;
      setLogs(logsResult.data || []);
      setTasks(tasksResult.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase.from('time_logs').insert([{
        user_id: profile?.id,
        task_id: formData.taskId,
        hours: parseFloat(formData.hours),
        log_date: formData.logDate,
      }]);
      if (error) throw error;
      setShowForm(false);
      setFormData({ taskId: '', hours: '', logDate: new Date().toISOString().split('T')[0] });
      loadData();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const totalHours = logs.reduce((sum, log) => sum + Number(log.hours), 0);
  const taskOptions = [{ value: '', label: 'Select Task' }, ...tasks.map((t) => ({ value: t.id, label: t.title }))];

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h2 style={{ color: 'var(--color-neutral-900)' }}>Time Tracking</h2>
          {!showForm && <Button onClick={() => setShowForm(true)}>Log Time</Button>}
        </div>

        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--color-primary-600)', marginBottom: '8px' }}>
                {totalHours.toFixed(1)}
              </div>
              <div style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>Total Hours Logged</div>
            </div>
          </Card>
        </div>

        {showForm && (
          <Card title="Log Time" style={{ marginBottom: 'var(--spacing-3)' }}>
            <form onSubmit={handleSubmit}>
              <Select label="Task" value={formData.taskId} onChange={(e) => setFormData({ ...formData, taskId: e.target.value })} options={taskOptions} required fullWidth />
              <Input label="Hours" type="number" step="0.5" min="0.5" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} required fullWidth />
              <Input label="Date" type="date" value={formData.logDate} onChange={(e) => setFormData({ ...formData, logDate: e.target.value })} required fullWidth />
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <Button type="submit">Save</Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        )}

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : logs.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No time logs</div></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {logs.map((log) => (
              <Card key={log.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{log.tasks?.title || 'Unknown'}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)' }}>
                      {log.hours}h | {new Date(log.log_date).toLocaleDateString()}
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
