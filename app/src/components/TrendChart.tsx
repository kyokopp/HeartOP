import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TooltipContentProps } from 'recharts/types/component/Tooltip';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import { colors } from '../theme';
import type { HistoryEntry } from '../hooks/useSensorData';

interface TrendChartProps {
  history?: HistoryEntry[];
}

// Transform API history entries into chart-friendly data
function formatHistory(history: HistoryEntry[]) {
  if (!history.length) return [];
  return history.map(entry => ({
    time: new Date(entry.receivedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    Temperature: parseFloat(entry.temperature.toFixed(1)),
    Humidity: parseFloat(entry.humidity.toFixed(1)),
  }));
}

const CustomTooltip = ({ active, payload, label }: TooltipContentProps<ValueType, NameType>) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel p-3 !rounded-2xl border border-white/10">
      <div className="text-textMuted text-xs mb-2 font-body">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="text-sm font-bold font-display" style={{ color: p.color }}>
          {p.name}: {Number(p.value).toFixed(1)}{p.name === 'Temperature' ? '°C' : '%'}
        </div>
      ))}
    </div>
  );
};

export default function TrendChart({ history = [] }: TrendChartProps) {
  const chartData = formatHistory(history);
  const hasData = chartData.length > 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
      className="glass-panel p-8 rounded-[48px] flex flex-col gap-8 h-[400px]"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h2 className="font-display font-bold text-2xl text-secondary">Atmospheric Trends</h2>
          <span className="font-body text-sm text-textMuted">24-Hour Temperature & Humidity Variance</span>
        </div>
        <div className="flex gap-3">
          <div className="px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-body text-xs font-semibold">
            Temperature (°C)
          </div>
          <div className="px-4 py-1.5 rounded-full border border-white/20 text-textMuted font-body text-xs font-semibold">
            Humidity (%)
          </div>
        </div>
      </div>

      <div className="flex-1 w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="humidGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colors.muted} stopOpacity={0.1} />
                  <stop offset="95%" stopColor={colors.muted} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.gridStroke} vertical={false} />
              <XAxis dataKey="time" tick={{ fill: colors.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: colors.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={CustomTooltip} />
              <Area type="monotone" dataKey="Temperature" stroke={colors.secondary} strokeWidth={3} fill="url(#tempGrad)" />
              <Area type="monotone" dataKey="Humidity" stroke={colors.muted} strokeWidth={2} strokeDasharray="5 5" fill="url(#humidGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-textMuted font-body text-sm animate-pulse">Waiting for sensor history data...</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}