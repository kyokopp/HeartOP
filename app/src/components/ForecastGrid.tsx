import { motion } from 'framer-motion';
import { Calendar, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Thermometer } from 'lucide-react';

// Forecast SVG icon mapper (smaller, for card size)
function ForecastIcon({ code, size = 28 }: { code?: string; size?: number }) {
  const iconProps = { size, strokeWidth: 1.8 };
  
  switch (code) {
    case '01d': return <Sun {...iconProps} className="text-amber-400" />;
    case '01n': return <Moon {...iconProps} className="text-indigo-300" />;
    case '02d': return <Cloud {...iconProps} className="text-sky-300" />;
    case '02n': return <Cloud {...iconProps} className="text-slate-400" />;
    case '03d': case '03n': return <Cloud {...iconProps} className="text-slate-300" />;
    case '04d': case '04n': return <Cloud {...iconProps} className="text-slate-400" />;
    case '09d': case '09n': return <CloudDrizzle {...iconProps} className="text-blue-400" />;
    case '10d': case '10n': return <CloudRain {...iconProps} className="text-blue-400" />;
    case '11d': case '11n': return <CloudLightning {...iconProps} className="text-yellow-400" />;
    case '13d': case '13n': return <CloudSnow {...iconProps} className="text-cyan-200" />;
    case '50d': case '50n': return <CloudFog {...iconProps} className="text-gray-400" />;
    default: return <Thermometer {...iconProps} className="text-white/60" />;
  }
}

interface DayForecast {
  label: string;
  temp: number;
  low: number;
  icon: string;       // emoji fallback
  iconCode?: string;  // OWM icon code
}

interface ForecastProps {
  forecast: DayForecast[];
  loading: boolean;
}

const containerVars = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }
};

export default function ForecastGrid({ forecast, loading }: ForecastProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-8 flex flex-col gap-6 rounded-[48px]"
    >
      <div className="flex items-center gap-3">
        <Calendar size={20} className="text-textMuted" />
        <span className="font-display font-bold text-xl text-white">Atmospheric Projection</span>
      </div>

      {loading ? (
        <div className="py-10 text-center text-textMuted font-body animate-pulse">Calculating projections...</div>
      ) : forecast.length === 0 ? (
        <div className="py-10 text-center text-textMuted font-body">No projection data available.</div>
      ) : (
        <motion.div 
          variants={containerVars}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {forecast.map((day, i) => (
            <motion.div key={i} variants={itemVars} className="bg-black/20 border border-white/5 rounded-[32px] p-6 flex flex-col items-center gap-2 hover:bg-white/5 transition-colors">
              <span className="font-body font-semibold text-[10px] text-textMuted tracking-wider uppercase">{day.label}</span>
              <div className="my-2">
                {day.iconCode ? <ForecastIcon code={day.iconCode} /> : <span className="text-3xl">{day.icon}</span>}
              </div>
              <span className="font-display font-extrabold text-2xl text-white">{day.temp}°</span>
              <span className="font-body font-medium text-[11px] text-textMuted/60">{day.low}° Low</span>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}