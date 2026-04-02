import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Wind } from 'lucide-react';
import { colors } from '../theme';

interface GasEntry {
  name: string;
  value: number;
}

interface AirQualityWidgetProps {
  data: GasEntry[];
}

export default function AirQualityWidget({ data }: AirQualityWidgetProps) {
  const optimalValue = data.find(d => d.name === 'Optimal')?.value ?? 0;

  return (
    <>
      <div className="flex items-center gap-2 text-white">
        <Wind size={18} />
        <span className="font-display font-bold">Air Quality</span>
      </div>
      <div className="flex-1 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={70}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell key="optimal" fill={colors.secondary} />
              <Cell key="trace" fill={colors.faintWhite} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center">
          <div className="font-display font-bold text-3xl text-white">{optimalValue}%</div>
          <div className="font-body text-[10px] text-textMuted uppercase">Purity</div>
        </div>
      </div>
      <div className="flex justify-between px-4 mt-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary"></div>
          <span className="text-xs text-textMuted">Optimal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-white/10"></div>
          <span className="text-xs text-textMuted">Trace</span>
        </div>
      </div>
    </>
  );
}
