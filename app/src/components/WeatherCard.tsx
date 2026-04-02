import { motion } from 'framer-motion';
import { MapPin, Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle, CloudFog, Thermometer } from 'lucide-react';

// Map OpenWeatherMap icon codes to Lucide SVG components
function WeatherIcon({ code, size = 80 }: { code?: string; size?: number }) {
  const iconProps = { size, strokeWidth: 1.5 };
  
  switch (code) {
    case '01d': return <Sun {...iconProps} className="text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,0.5)]" />;
    case '01n': return <Moon {...iconProps} className="text-indigo-300 drop-shadow-[0_0_20px_rgba(165,180,252,0.5)]" />;
    case '02d': return <Cloud {...iconProps} className="text-sky-300 drop-shadow-[0_0_15px_rgba(125,211,252,0.4)]" />;
    case '02n': return <Cloud {...iconProps} className="text-slate-400 drop-shadow-[0_0_15px_rgba(148,163,184,0.4)]" />;
    case '03d': case '03n': return <Cloud {...iconProps} className="text-slate-300 drop-shadow-[0_0_12px_rgba(203,213,225,0.3)]" />;
    case '04d': case '04n': return <Cloud {...iconProps} className="text-slate-400 drop-shadow-[0_0_12px_rgba(148,163,184,0.3)]" />;
    case '09d': case '09n': return <CloudDrizzle {...iconProps} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.4)]" />;
    case '10d': case '10n': return <CloudRain {...iconProps} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />;
    case '11d': case '11n': return <CloudLightning {...iconProps} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />;
    case '13d': case '13n': return <CloudSnow {...iconProps} className="text-cyan-200 drop-shadow-[0_0_15px_rgba(186,230,253,0.5)]" />;
    case '50d': case '50n': return <CloudFog {...iconProps} className="text-gray-400 drop-shadow-[0_0_12px_rgba(156,163,175,0.4)]" />;
    default: return <Thermometer {...iconProps} className="text-white/60" />;
  }
}

// TypeScript Interface for our expected data
interface WeatherProps {
  weather: any;
  loading: boolean;
}

export default function WeatherCard({ weather, loading }: WeatherProps) {
  if (loading) {
    return (
      <div className="glass-panel p-10 min-h-[400px] flex items-center justify-center rounded-[48px]">
        <div className="text-textMuted font-body animate-pulse">Loading atmospheric data...</div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass-panel p-10 min-h-[400px] flex items-center justify-center rounded-[48px]">
        <div className="text-textMuted font-body text-center">
          Configure VITE_WEATHER_API_KEY <br/> to initialize atmospheric scan.
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-10 min-h-[400px] flex flex-col justify-between relative overflow-hidden rounded-[48px]"
    >
      {/* Background Icon Watermark — Modern SVG */}
      <div className="absolute top-6 right-6 opacity-40 pointer-events-none select-none">
        <WeatherIcon code={weather.iconCode} size={120} />
      </div>

      <div className="flex flex-col gap-2 z-10">
        <div className="flex items-center gap-2 text-textMuted">
          <MapPin size={16} />
          <span className="font-body font-semibold text-sm tracking-[1.4px] uppercase">
            {weather.city || 'Goiânia, GO, Brasil'}
          </span>
        </div>

        <div className="font-display font-extrabold text-[72px] tracking-[-3.6px] text-white leading-none mt-2">
          {weather.temp}<span className="text-primary">°C</span>
        </div>

        <div className="font-body text-2xl text-textMuted/80 capitalize mt-2">
          {weather.description}
        </div>
      </div>

      <div className="flex gap-8 z-10 mt-8">
        <div className="flex flex-col gap-1">
          <span className="font-body font-semibold text-[10px] text-textMuted/60 tracking-widest uppercase">Humidity</span>
          <span className="font-display font-bold text-lg text-white">{weather.humidity}%</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body font-semibold text-[10px] text-textMuted/60 tracking-widest uppercase">Wind</span>
          <span className="font-display font-bold text-lg text-white">{weather.windSpeed} km/h</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="font-body font-semibold text-[10px] text-textMuted/60 tracking-widest uppercase">Pressure</span>
          <span className="font-display font-bold text-lg text-white">{weather.pressure} hPa</span>
        </div>
      </div>
    </motion.div>
  );
}