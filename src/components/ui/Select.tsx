import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  options: Array<{ value: string; label: string }>;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, fullWidth = false, options, className = '', ...props }, ref) => {
    return (
      <div style={{ marginBottom: 'var(--spacing-2)', width: fullWidth ? '100%' : 'auto' }}>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: 'var(--spacing-1)',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: 'var(--color-neutral-700)',
            }}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '1rem',
            borderRadius: 'var(--border-radius-md)',
            border: `1px solid ${error ? 'var(--color-error-500)' : 'var(--color-neutral-300)'}`,
            backgroundColor: 'white',
            color: 'var(--color-neutral-900)',
            transition: 'border-color var(--transition-fast), box-shadow var(--transition-fast)',
            outline: 'none',
            cursor: 'pointer',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-primary-500)';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'var(--color-error-50)' : 'var(--color-primary-50)'}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = error ? 'var(--color-error-500)' : 'var(--color-neutral-300)';
            e.target.style.boxShadow = 'none';
          }}
          className={className}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p
            style={{
              marginTop: '4px',
              fontSize: '0.875rem',
              color: 'var(--color-error-600)',
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
