import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [role, setRole] = useState('employee');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const roleOptions = [
        { value: 'employee', label: 'Employee' },
        { value: 'team_lead', label: 'Team Lead' },
        { value: 'manager', label: 'Manager' },
        { value: 'project_manager', label: 'Project Manager' },
        { value: 'delivery_manager', label: 'Delivery Manager' },
        { value: 'client_manager', label: 'Client Manager' },
        { value: 'admin', label: 'Admin' },
    ];
    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signUp(email, password, fullName, role);
            navigate('/');
        }
        catch (err) {
            setError('Failed to create account. Please try again.');
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
                            }, children: "TMS" }), _jsx("p", { style: { color: 'var(--color-neutral-600)', fontSize: '1rem' }, children: "Team Management System" })] }), _jsxs(Card, { children: [_jsx("h2", { style: { marginBottom: 'var(--spacing-3)', color: 'var(--color-neutral-900)' }, children: "Create Account" }), error && (_jsx("div", { style: {
                                padding: 'var(--spacing-2)',
                                backgroundColor: 'var(--color-error-50)',
                                color: 'var(--color-error-700)',
                                borderRadius: 'var(--border-radius-md)',
                                marginBottom: 'var(--spacing-2)',
                                fontSize: '0.875rem',
                            }, children: error })), _jsxs("form", { onSubmit: handleSubmit, children: [_jsx(Input, { label: "Full Name", type: "text", value: fullName, onChange: (e) => setFullName(e.target.value), placeholder: "John Doe", required: true, fullWidth: true }), _jsx(Input, { label: "Email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "you@example.com", required: true, fullWidth: true }), _jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", required: true, fullWidth: true }), _jsx(Select, { label: "Role", value: role, onChange: (e) => setRole(e.target.value), options: roleOptions, required: true, fullWidth: true }), _jsx(Button, { type: "submit", fullWidth: true, disabled: loading, style: { marginTop: 'var(--spacing-2)' }, children: loading ? 'Creating account...' : 'Create Account' })] }), _jsx("div", { style: { marginTop: 'var(--spacing-3)', textAlign: 'center' }, children: _jsxs("p", { style: { color: 'var(--color-neutral-600)', fontSize: '0.875rem' }, children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", style: {
                                            color: 'var(--color-primary-600)',
                                            fontWeight: '500',
                                            textDecoration: 'none',
                                        }, children: "Sign in here" })] }) })] })] }) }));
}
