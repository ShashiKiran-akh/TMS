import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function Unauthorized() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-neutral-100)',
        padding: 'var(--spacing-2)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
            <div
              style={{
                fontSize: '4rem',
                fontWeight: '700',
                color: 'var(--color-error-600)',
                marginBottom: 'var(--spacing-2)',
              }}
            >
              403
            </div>
            <h2 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--color-neutral-900)' }}>
              Access Denied
            </h2>
            <p style={{ color: 'var(--color-neutral-600)', marginBottom: 'var(--spacing-3)' }}>
              You don't have permission to access this page.
            </p>
            <Link to="/">
              <Button>Go to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
