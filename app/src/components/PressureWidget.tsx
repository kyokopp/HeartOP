import { Activity } from 'lucide-react';

interface PressureWidgetProps {
  current: number;
  min24h: number;
  max24h: number;
}

export default function PressureWidget({ current, min24h, max24h }: PressureWidgetProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-white">
        <Activity size={18} />
        <span className="font-display font-bold">Pressure</span>
      </div>
      <div className="flex flex-col gap-4 flex-1 justify-center">
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-textMuted font-body text-sm">Current</span>
          <span className="text-white font-display font-bold text-xl">
            {current} <span className="text-xs text-textMuted font-normal">hPa</span>
          </span>
        </div>
        <div className="flex justify-between items-end border-b border-white/5 pb-2">
          <span className="text-textMuted font-body text-sm">Min (24h)</span>
          <span className="text-white font-display font-bold text-lg">{min24h}</span>
        </div>
        <div className="flex justify-between items-end pb-2">
          <span className="text-textMuted font-body text-sm">Max (24h)</span>
          <span className="text-white font-display font-bold text-lg">{max24h}</span>
        </div>
      </div>
    </>
  );
}
