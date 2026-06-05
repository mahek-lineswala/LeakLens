import type { HTMLAttributes, ReactNode } from 'react';

import { cn } from '../../lib/cn';

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/8 bg-[linear-gradient(180deg,rgba(20,27,45,0.96),rgba(12,16,28,0.96))] shadow-[0_22px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl',
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  title,
  eyebrow,
  action,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">{eyebrow}</p>
        ) : null}
        <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      </div>
      {action}
    </div>
  );
}
