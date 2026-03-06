import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Project {
  id: string;
  name: string;
  status: string;
  client_name: string;
  budget: number;
}

export function Projects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadProjects();
  }, [profile]);

  async function loadProjects() {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-3)' }}>
          <h2 style={{ color: 'var(--color-neutral-900)' }}>Projects</h2>
          {['project_manager', 'delivery_manager', 'admin'].includes(profile?.role || '') && <Button>Create Project</Button>}
        </div>

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : projects.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No projects</div></Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {projects.map((project) => (
              <Card key={project.id}>
                <h3 style={{ margin: '0 0 8px 0' }}>{project.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', margin: '0 0 12px 0' }}>
                  Client: {project.client_name || 'N/A'}<br/>
                  Status: {project.status}<br/>
                  Budget: ${project.budget?.toLocaleString() || 'N/A'}
                </p>
                <Button variant="ghost" size="sm" fullWidth>View Details</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
