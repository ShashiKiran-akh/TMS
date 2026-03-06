import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  padding?: boolean;
  style?: CSSProperties;
}

export function Card({ children, title, action, padding = true, style }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        border: '1px solid var(--color-neutral-200)',
        overflow: 'hidden',
        ...style,
      }}
    >
      {(title || action) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--spacing-2)',
            borderBottom: '1px solid var(--color-neutral-200)',
          }}
        >
          {title && (
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-neutral-900)' }}>
              {title}
            </h3>
          )}
          {action && <div>{action}</div>}
        </div>
      )}
      <div style={{ padding: padding ? 'var(--spacing-2)' : '0' }}>{children}</div>
    </div>
  );
}
