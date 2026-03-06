import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/');
    } catch (err) {
      setError('Failed to sign in. Please check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

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
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
          <h1
            style={{
              fontSize: '2.5rem',
              fontWeight: '700',
              color: 'var(--color-primary-600)',
              marginBottom: 'var(--spacing-1)',
            }}
          >
            TMS
          </h1>
          <p style={{ color: 'var(--color-neutral-600)', fontSize: '1rem' }}>
            Team Management System
          </p>
        </div>

        <Card>
          <h2 style={{ marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }}>
            Sign In
          </h2>

          {error && (
            <div
              style={{
                padding: 'var(--spacing-2)',
                backgroundColor: 'var(--color-error-50)',
                color: 'var(--color-error-700)',
                borderRadius: 'var(--border-radius-md)',
                marginBottom: 'var(--spacing-2)',
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              fullWidth
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              fullWidth
            />

            <Button type="submit" fullWidth disabled={loading} style={{ marginTop: 'var(--spacing-2)' }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div style={{ marginTop: 'var(--spacing-3)', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-neutral-600)', fontSize: '0.875rem' }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: 'var(--color-primary-600)',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Register here
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
