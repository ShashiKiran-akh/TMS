import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
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
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email, password);
            navigate('/');
        }
        catch (err) {
            setError('Failed to sign in. Please check your credentials.');
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    }
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-neutral-100)',
            padding: 'var(--spacing-2)',
        }, children: _jsxs("div", { style: { width: '100%', maxWidth: '400px' }, children: [_jsxs("div", { style: { textAlign: 'center', marginBottom: 'var(--spacing-4)' }, children: [_jsx("h1", { style: {
                                fontSize: '2.5rem',
                                fontWeight: '700',
                                color: 'var(--color-primary-600)',
                                marginBottom: 'var(--spacing-1)',
                            }, children: "TMS" }), _jsx("p", { style: { color: 'var(--color-neutral-600)', fontSize: '1rem' }, children: "Team Management System" })] }), _jsxs(Card, { children: [_jsx("h2", { style: { marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }, children: "Sign In" }), error && (_jsx("div", { style: {
                                padding: 'var(--spacing-2)',
                                backgroundColor: 'var(--color-error-50)',
                                color: 'var(--color-error-700)',
                                borderRadius: 'var(--border-radius-md)',
                                marginBottom: 'var(--spacing-2)',
                                fontSize: '0.875rem',
                            }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(Input, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true, fullWidth: true }), _jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, fullWidth: true }), _jsx(Button, { type: "submit", fullWidth: true, disabled: loading, style: { marginTop: 'var(--spacing-2)' }, children: loading ? 'Signing in...' : 'Sign In' })] }), _jsx("div", { style: { marginTop: 'var(--spacing-3)', textAlign: 'center' }, children: _jsxs("p", { style: { color: 'var(--color-neutral-600)', fontSize: '0.875rem' }, children: ["Don't have an account?", ' ', _jsx(Link, { to: "/register", style: {
                                            color: 'var(--color-primary-600)',
                                            fontWeight: '500',
                                            textDecoration: 'none',
                                        }, children: "Register here" })] }) })] })] }) }));
}
