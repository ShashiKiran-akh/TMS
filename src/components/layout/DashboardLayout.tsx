import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

interface NavItem {
  path: string;
  label: string;
  roles?: string[];
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard' },
    { path: '/tasks', label: 'Tasks' },
    { path: '/projects', label: 'Projects', roles: ['team_lead', 'manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin'] },
    { path: '/teams', label: 'Teams', roles: ['team_lead', 'manager', 'project_manager', 'delivery_manager', 'admin'] },
    { path: '/sow', label: 'SOW Documents', roles: ['manager', 'project_manager', 'delivery_manager', 'client_manager', 'admin'] },
    { path: '/leaves', label: 'Leave Requests' },
    { path: '/time-logs', label: 'Time Tracking' },
    { path: '/users', label: 'Users', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(profile?.role || '')
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-neutral-50)' }}>
      <aside
        style={{
          width: sidebarOpen ? '260px' : '70px',
          backgroundColor: 'white',
          borderRight: '1px solid var(--color-neutral-200)',
          transition: 'width var(--transition-normal)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            padding: 'var(--spacing-2)',
            borderBottom: '1px solid var(--color-neutral-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--color-primary-600)',
              display: sidebarOpen ? 'block' : 'none',
            }}
          >
            TMS
          </h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '8px',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor: 'transparent',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav style={{ flex: 1, padding: 'var(--spacing-2)', overflowY: 'auto' }}>
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '4px',
                  borderRadius: 'var(--border-radius-md)',
                  backgroundColor: isActive ? 'var(--color-primary-50)' : 'transparent',
                  color: isActive ? 'var(--color-primary-700)' : 'var(--color-neutral-700)',
                  fontWeight: isActive ? '600' : '400',
                  transition: 'all var(--transition-fast)',
                  textDecoration: 'none',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'var(--color-neutral-100)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {sidebarOpen && item.label}
                {!sidebarOpen && item.label.charAt(0)}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: 'var(--spacing-2)',
            borderTop: '1px solid var(--color-neutral-200)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              marginBottom: 'var(--spacing-2)',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-primary-700)',
                fontWeight: '600',
                fontSize: '1.125rem',
                flexShrink: 0,
              }}
            >
              {profile?.full_name.charAt(0).toUpperCase()}
            </div>
            {sidebarOpen && (
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    color: 'var(--color-neutral-900)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {profile?.full_name}
                </div>
                <div
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-neutral-500)',
                    textTransform: 'capitalize',
                  }}
                >
                  {profile?.role.replace('_', ' ')}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'var(--color-error-50)',
              color: 'var(--color-error-700)',
              borderRadius: 'var(--border-radius-md)',
              fontWeight: '500',
              fontSize: '0.875rem',
              transition: 'background-color var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error-100)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-error-50)';
            }}
          >
            {sidebarOpen ? 'Sign Out' : 'Out'}
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 'var(--spacing-4)', maxWidth: '1400px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
