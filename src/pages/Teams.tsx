import { useEffect, useState } from 'react';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
  description: string;
}

export function Teams() {
  const { profile } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) loadTeams();
  }, [profile]);

  async function loadTeams() {
    try {
      const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setTeams(data || []);
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
          <h2 style={{ color: 'var(--color-neutral-900)' }}>Teams</h2>
          {['manager', 'admin'].includes(profile?.role || '') && <Button>Create Team</Button>}
        </div>

        {loading ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>Loading...</div></Card>
        ) : teams.length === 0 ? (
          <Card><div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>No teams</div></Card>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}>
            {teams.map((team) => (
              <Card key={team.id}>
                <h3 style={{ margin: '0 0 8px 0' }}>{team.name}</h3>
                {team.description && <p style={{ fontSize: '0.875rem', color: 'var(--color-neutral-600)', margin: '0 0 12px 0' }}>{team.description}</p>}
                <Button variant="ghost" size="sm" fullWidth>View Team</Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
