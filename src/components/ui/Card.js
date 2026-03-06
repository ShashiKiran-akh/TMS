import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function Card({ children, title, action, padding = true, style }) {
    return (_jsxs("div", { style: {
            backgroundColor: 'white',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--color-neutral-200)',
            overflow: 'hidden',
            ...style,
        }, children: [(title || action) && (_jsxs("div", { style: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 'var(--spacing-2)',
                    borderBottom: '1px solid var(--color-neutral-200)',
                }, children: [title && (_jsx("h3", { style: { fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-neutral-900)' }, children: title })), action && _jsx("div", { children: action })] })), _jsx("div", { style: { padding: padding ? 'var(--spacing-2)' : '0' }, children: children })] }));
}
