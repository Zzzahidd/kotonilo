import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-[#55555C] mb-1.5">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#848389]">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-white border border-[#E3E2E3] rounded-xl text-sm text-[#191923] placeholder-[#848389] transition-all duration-150',
                'focus:outline-none focus:border-[#191923] focus:ring-1 focus:ring-[#191923]',
                'h-11 px-4',
                icon && 'pl-10',
                rightElement && 'pr-11',
                error && 'border-[#D94A45] focus:border-[#D94A45] focus:ring-[#D94A45]',
                className
              )
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-xs text-[#D94A45]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
