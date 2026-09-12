import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', isLoading = false, className = '', disabled, ...props }: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors';
  const variantClasses = variant === 'primary'
    ? 'bg-ink text-surface hover:opacity-90'
    : 'border border-rule-strong text-ink hover:bg-surface-sunken';
  const stateClasses = (isLoading || disabled) ? 'cursor-not-allowed opacity-40' : 'cursor-pointer';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${stateClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
}
