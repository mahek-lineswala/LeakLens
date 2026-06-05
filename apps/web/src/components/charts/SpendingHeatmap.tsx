import { Fragment } from 'react';

import { cn } from '../../lib/cn';

type HeatmapCell = {
  day: string;
  bucket: string;
  value: number;
};

export function SpendingHeatmap({ data }: { data: HeatmapCell[] }) {
  const max = Math.max(...data.map((item) => item.value));
  const days = [...new Set(data.map((item) => item.day))];
  const buckets = [...new Set(data.map((item) => item.bucket))];

  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[520px] grid-cols-[90px_repeat(7,minmax(56px,1fr))] gap-2">
        <div />
        {days.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
        {buckets.map((bucket) => (
          <Fragment key={bucket}>
            <div key={`${bucket}-label`} className="self-center text-xs font-medium text-slate-500">
              {bucket}
            </div>
            {days.map((day) => {
              const cell = data.find((item) => item.day === day && item.bucket === bucket);
              const intensity = cell ? cell.value / max : 0;
              return (
                <div
                  key={`${bucket}-${day}`}
                  className={cn(
                    'h-14 rounded-2xl border border-white/6 transition',
                    intensity > 0.75
                      ? 'bg-cyan-300/40'
                      : intensity > 0.5
                      ? 'bg-cyan-300/25'
                      : intensity > 0.25
                      ? 'bg-cyan-300/15'
                      : 'bg-white/[0.03]'
                  )}
                  title={`${bucket} · ${day} · ${cell?.value ?? 0} expenses`}
                >
                  <div className="flex h-full items-end justify-start p-2 text-[11px] font-medium text-slate-200">
                    {cell?.value ?? 0}
                  </div>
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
