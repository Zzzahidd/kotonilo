import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  loading = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  const variants = {
    primary:
      'bg-[#191923] hover:bg-[#2A2A35] text-white shadow-sm border border-[#191923]',
    secondary:
      'bg-white hover:bg-[#FAFAF8] text-[#191923] border border-[#E3E2E3] shadow-subtle',
    outline:
      'bg-transparent hover:bg-[#F0EFF0] text-[#191923] border border-[#E3E2E3]',
    ghost:
      'bg-transparent hover:bg-[#F0EFF0] text-[#191923]',
    danger:
      'bg-[#D94A45] hover:bg-[#C53934] text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 h-11',
    lg: 'px-6 py-3.5 text-base rounded-xl gap-2.5 h-12',
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : null}

      {icon && iconPosition === 'left' && !loading && (
        <span className="inline-flex items-center">{icon}</span>
      )}

      <span>{children}</span>

      {icon && iconPosition === 'right' && !loading && (
        <span className="inline-flex items-center ml-0.5">{icon}</span>
      )}
    </button>
  );
};
