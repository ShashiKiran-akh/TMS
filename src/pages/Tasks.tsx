import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  projects?: { name: string };
}

export function Tasks() {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadTasks();
  }, [profile]);

  async function loadTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(name)')
        .eq('assigned_to', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateTaskStatus(taskId: string, newStatus: string) {
    try {
      await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
      loadTasks();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <DashboardLayout>
      <div>
        <h2 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }}>My Tasks</h2>

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading tasks...</div></Card>
        ) : tasks.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No tasks found</div></Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
            {tasks.map((task) => (
              <Card key={task.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '0 0 8px 0' }}>{task.title}</h3>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-neutral-500)' }}>
                      {task.projects && `Project: ${task.projects.name}`} | Status: {task.status}
                    </div>
                  </div>
                  {task.status === 'todo' && <Button size="sm" onClick={() => updateTaskStatus(task.id, 'in_progress')}>Start</Button>}
                  {task.status === 'in_progress' && <Button size="sm" variant="warning" onClick={() => updateTaskStatus(task.id, 'in_review')}>Review</Button>}
                  {task.status === 'in_review' && <Button size="sm" variant="success" onClick={() => updateTaskStatus(task.id, 'completed')}>Complete</Button>}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
