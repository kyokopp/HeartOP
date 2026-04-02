import { ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Sun } from 'lucide-react';

interface LuminosityWidgetProps {
  data: { value: number }[];
}

export default function LuminosityWidget({ data }: LuminosityWidgetProps) {
  const avgIntensity = Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length);

  return (
    <>
      <div className="flex items-center gap-2 text-white">
        <Sun size={18} />
        <span className="font-display font-bold">Luminosity History</span>
      </div>
      <div className="h-32 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <Bar dataKey="value" radius={[2, 2, 0, 0]}>
              {data.map((_, i) => (
                <Cell
                  key={`light-${i}`}
                  fill={`rgba(34, 211, 238, ${0.3 + (i / data.length) * 0.7})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <span className="font-body text-xs text-textMuted uppercase tracking-wider mt-4">
        Avg Intensity: {avgIntensity} Lux
      </span>
    </>
  );
}
