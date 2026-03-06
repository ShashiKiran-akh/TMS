import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
export const Input = forwardRef(({ label, error, fullWidth = false, className = '', ...props }, ref) => {
    return (_jsxs("div", { style: { marginBottom: 'var(--spacing-2)', width: fullWidth ? '100%' : 'auto' }, children: [label && (_jsx("label", { style: {
                    display: 'block',
                    marginBottom: 'var(--spacing-1)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--color-neutral-700)',
                }, children: label })), _jsx("input", { ref: ref, style: {
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '1rem',
                    borderRadius: 'var(--border-radius-md)',
                    border: `1px solid ${error ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
                    backgroundColor: 'white',
                    color: 'var(--color-neutral-900)',
                    transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
                    outline: 'none',
                }, onFocus: (e) => {
                    e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-primary-500)';
                    e.target.style.boxShadow = `0 0 0 3px ${error ? 'var(--color-error-50)' : 'var(--color-primary-50)'}`;
                }, onBlur: (e) => {
                    e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-neutral-300)';
                    e.target.style.boxShadow = 'none';
                }, className: className, ...props }), error && (_jsx("p", { style: {
                    marginTop: '4px',
                    fontSize: '0.875rem',
                    color: 'var(--color-error-600)',
                }, children: error }))] }));
});
Input.displayName = 'Input';
