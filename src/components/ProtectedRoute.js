import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
export function ProtectedRoute({ children, allowedRoles }) {
    const { user, profile, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { style: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontSize: '1.125rem',
                color: 'var(--color-neutral-600)'
            }, children: "Loading..." }));
    }
    if (!user || !profile) {
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    if (allowedRoles && !allowedRoles.includes(profile.role)) {
        return _jsx(Navigate, { to: "/unauthorized", replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
