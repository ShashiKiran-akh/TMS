import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '500',
    borderRadius: 'var(--border-radius-md)',
    transition: 'all var(--transition-fast)',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    opacity: props.disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    border: 'none',
  };

  const sizeStyles = {
    sm: {
      padding: '6px 12px',
      fontSize: '0.875rem',
      gap: '4px',
    },
    md: {
      padding: '10px 20px',
      fontSize: '1rem',
      gap: '8px',
    },
    lg: {
      padding: '14px 28px',
      fontSize: '1.125rem',
      gap: '10px',
    },
  };

  const variantStyles = {
    primary: {
      backgroundColor: 'var(--color-primary-600)',
      color: 'white',
    },
    secondary: {
      backgroundColor: 'var(--color-neutral-600)',
      color: 'white',
    },
    success: {
      backgroundColor: 'var(--color-success-600)',
      color: 'white',
    },
    warning: {
      backgroundColor: 'var(--color-warning-600)',
      color: 'white',
    },
    error: {
      backgroundColor: 'var(--color-error-600)',
      color: 'white',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--color-neutral-700)',
      border: '1px solid var(--color-neutral-300)',
    },
  };

  const hoverStyles = {
    primary: 'var(--color-primary-700)',
    secondary: 'var(--color-neutral-700)',
    success: 'var(--color-success-700)',
    warning: 'var(--color-warning-700)',
    error: 'var(--color-error-700)',
    ghost: 'var(--color-neutral-100)',
  };

  return (
    <button
      style={{
        ...baseStyles,
        ...sizeStyles[size],
        ...variantStyles[variant],
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          if (variant === 'ghost') {
            e.currentTarget.style.backgroundColor = hoverStyles[variant];
          } else {
            e.currentTarget.style.backgroundColor = hoverStyles[variant];
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.backgroundColor = variantStyles[variant].backgroundColor;
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}
