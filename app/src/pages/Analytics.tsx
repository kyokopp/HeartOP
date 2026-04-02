import { motion } from 'framer-motion';
import TrendChart from '../components/TrendChart';
import LuminosityWidget from '../components/LuminosityWidget';
import AirQualityWidget from '../components/AirQualityWidget';
import PressureWidget from '../components/PressureWidget';
import { useSensorData } from '../hooks/useSensorData';
import { useWeatherContext } from '../context/WeatherContext';

const containerVars = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVars = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" as const } }
};

export default function Analytics() {
  const { latest, history, apiStatus } = useSensorData();
  const { current } = useWeatherContext();

  const lightData = history.length > 0
    ? history.slice(-8).map(entry => ({ value: entry.light }))
    : [{ value: 0 }];

  const gasRaw = latest?.gas ?? 0;
  const gasOptimal = gasRaw < 1000 ? 90
    : gasRaw < 2500 ? 60
    : 30;
  const gasQuality = [
    { name: 'Optimal', value: gasOptimal },
    { name: 'Trace', value: 100 - gasOptimal },
  ];

  const pressure = current ? {
    current: current.pressure,
    min24h: current.pressure - 4,
    max24h: current.pressure + 3,
  } : { current: 0, min24h: 0, max24h: 0 };

  const lastSync = latest?.receivedAt
    ? `Last Synced: ${new Date(latest.receivedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` 
    : 'Waiting for data...';

  return (
    <div className="flex flex-col gap-8 pb-8">

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
        <h1 className="font-display font-extrabold text-4xl text-white tracking-tight">Atmospheric Analytics</h1>
        <p className="font-body text-sm text-textMuted tracking-widest uppercase">
          System Node 01 • {apiStatus === 'healthy' ? lastSync : 'Backend Offline'}
        </p>
      </motion.div>

      <TrendChart history={history} />

      <motion.div variants={containerVars} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-8">

        <motion.div variants={itemVars} className="glass-panel p-6 rounded-[48px] flex flex-col justify-between h-[280px]">
          <LuminosityWidget data={lightData} />
        </motion.div>

        <motion.div variants={itemVars} className="glass-panel p-6 rounded-[48px] flex flex-col justify-between h-[280px]">
          <AirQualityWidget data={gasQuality} />
        </motion.div>

        <motion.div variants={itemVars} className="glass-panel p-6 rounded-[48px] flex flex-col gap-6 h-[280px]">
          <PressureWidget current={pressure.current} min24h={pressure.min24h} max24h={pressure.max24h} />
        </motion.div>

      </motion.div>
    </div>
  );
}