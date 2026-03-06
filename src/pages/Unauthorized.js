import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
export function Unauthorized() {
    return (_jsx("div", { style: {
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-neutral-100)',
            padding: 'var(--spacing-2)',
        }, children: _jsx("div", { style: { width: '100%', maxWidth: '500px' }, children: _jsx(Card, { children: _jsxs("div", { style: { textAlign: 'center', padding: 'var(--spacing-4)' }, children: [_jsx("div", { style: {
                                fontSize: '4rem',
                                fontWeight: '700',
                                color: 'var(--color-error-600)',
                                marginBottom: 'var(--spacing-2)',
                            }, children: "403" }), _jsx("h2", { style: { marginBottom: 'var(--spacing-2)', color: 'var(--color-neutral-900)' }, children: "Access Denied" }), _jsx("p", { style: { color: 'var(--color-neutral-600)', marginBottom: 'var(--spacing-3)' }, children: "You don't have permission to access this page." }), _jsx(Link, { to: "/", children: _jsx(Button, { children: "Go to Dashboard" }) })] }) }) }) }));
}
