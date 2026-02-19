import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label className="text-sm font-semibold text-slate-700 ml-1">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex w-full rounded-lg border-2 border-slate-200 bg-white px-3 py-2 text-sm transition-colors placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 disabled:cursor-not-allowed disabled:opacity-50',
                        error && 'border-rose-500 focus:border-rose-500',
                        className
                    )}
                    {...props}
                />
                {error && <span className="text-xs font-medium text-rose-500 ml-1">{error}</span>}
            </div>
        );
    }
);

Input.displayName = 'Input';
