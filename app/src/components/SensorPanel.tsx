import { motion } from 'framer-motion';
import { Zap, Thermometer, Droplets, Sun, Wind } from 'lucide-react';

interface SensorProps {
  data: any;
  loading: boolean;
}

function getAirQuality(gasRaw: number) {
  if (gasRaw === null || gasRaw === undefined) return { label: '—', color: 'text-textMuted' };
  if (gasRaw < 1000) return { label: 'Excellent', color: 'text-primary' };
  if (gasRaw < 2500) return { label: 'Warning', color: 'text-amber-500' };
  return { label: 'Danger', color: 'text-red-500' };
}

export default function SensorPanel({ data, loading }: SensorProps) {
  const airQuality = getAirQuality(data?.gas);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6 flex flex-col gap-6 rounded-[48px] shadow-[0_0_20px_rgba(187,134,252,0.15)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Zap size={20} />
          </div>
          <span className="font-display font-bold text-lg text-white">ESP32 Node</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/5 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse-dot" />
          <span className="font-body font-semibold text-[10px] text-textMuted uppercase">Live</span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10 text-textMuted font-body text-sm animate-pulse">Establishing Node Connection...</div>
      ) : !data ? (
        <div className="text-center py-10 text-textMuted font-body text-sm">No readings yet.<br />Start the Wokwi simulation.</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          
          {/* Temperature */}
          <div className={`bg-black/30 border ${data.temperature > 35 ? 'border-red-500/30' : 'border-white/5'} rounded-[32px] p-4 flex flex-col gap-1`}>
            <Thermometer size={14} className="text-textMuted mb-1" />
            <span className="font-body font-semibold text-[10px] text-textMuted uppercase">Temp</span>
            <div>
              <span className="font-display font-extrabold text-xl text-white">{data.temperature?.toFixed(1)}</span>
              <span className="font-display font-medium text-sm text-primary ml-1">°C</span>
            </div>
          </div>

          {/* Humidity */}
          <div className={`bg-black/30 border ${data.humidity > 80 || data.humidity < 20 ? 'border-red-500/30' : 'border-white/5'} rounded-[32px] p-4 flex flex-col gap-1`}>
            <Droplets size={14} className="text-textMuted mb-1" />
            <span className="font-body font-semibold text-[10px] text-textMuted uppercase">Humidity</span>
            <div>
              <span className="font-display font-extrabold text-xl text-white">{data.humidity?.toFixed(0)}</span>
              <span className="font-display font-medium text-sm text-primary ml-1">%</span>
            </div>
          </div>

          {/* Luminosity */}
          <div className="bg-black/30 border border-white/5 rounded-[32px] p-4 flex flex-col gap-1">
            <Sun size={14} className="text-textMuted mb-1" />
            <span className="font-body font-semibold text-[10px] text-textMuted uppercase">Luminosity</span>
            <div>
              <span className="font-display font-extrabold text-xl text-white">{data.light}</span>
              <span className="font-display font-medium text-sm text-primary ml-1">%</span>
            </div>
          </div>

          {/* Air Quality */}
          <div className={`bg-black/30 border ${data.gas >= 2500 ? 'border-red-500/30' : 'border-white/5'} rounded-[32px] p-4 flex flex-col gap-1`}>
            <Wind size={14} className="text-textMuted mb-1" />
            <span className="font-body font-semibold text-[10px] text-textMuted uppercase">Air Quality</span>
            <span className={`font-display font-extrabold text-lg ${airQuality.color}`}>
              {airQuality.label}
            </span>
          </div>

        </div>
      )}
    </motion.div>
  );
}