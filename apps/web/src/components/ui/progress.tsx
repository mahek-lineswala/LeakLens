import { cn } from '../../lib/cn';

export function Progress({
  value,
  className,
  indicatorClassName,
}: {
  value: number;
  className?: string;
  indicatorClassName?: string;
}) {
  return (
    <div className={cn('h-2 overflow-hidden rounded-full bg-white/6', className)}>
      <div
        className={cn('h-full rounded-full bg-cyan-300 transition-all duration-500', indicatorClassName)}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
