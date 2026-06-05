import type { ButtonHTMLAttributes } from 'react';

import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost';

const styles: Record<Variant, string> = {
  primary:
    'bg-cyan-300 text-slate-950 hover:bg-cyan-200 shadow-[0_10px_35px_rgba(103,232,249,0.25)]',
  secondary:
    'border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10',
  ghost: 'text-slate-400 hover:bg-white/5 hover:text-white',
};

export function Button({
  className,
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition duration-200 disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
