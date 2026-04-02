import { motion } from 'framer-motion';
import { Bell, Activity } from 'lucide-react';

interface Alert {
  id: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'GAS';
  severity: 'WARNING' | 'DANGER';
  message: string;
  triggeredAt: string;
}

interface AlertsProps {
  alerts: Alert[];
  apiStatus: string;
}

const TYPE_ICONS: Record<string, string> = {
  TEMPERATURE: '🌡️',
  HUMIDITY: '💧',
  GAS: '🌬️',
};

export default function AlertsPanel({ alerts = [], apiStatus }: AlertsProps) {
  // Grab only the 4 most recent alerts so it doesn't break the layout
  const recentAlerts = alerts.slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-6 flex flex-col gap-4 rounded-[48px] shadow-[0_0_20px_rgba(187,134,252,0.1)] h-full"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white">
          <Bell size={16} />
        </div>
        <span className="font-display font-bold text-lg text-white">System Alerts</span>
      </div>

      {recentAlerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 py-6">
          <Activity size={32} className={apiStatus === 'healthy' ? 'text-primary' : 'text-red-500'} />
          <span className="font-body font-semibold text-xs tracking-[2px] uppercase text-primary">
            {apiStatus === 'healthy' ? 'All Systems Nominal' : 'API Offline'}
          </span>
        </div>
      ) : (
        <div className="flex flex-col gap-3 overflow-y-auto pr-2">
          {recentAlerts.map(alert => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-2xl bg-black/20 border border-white/5">
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${alert.severity === 'DANGER' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'}`} />
              <div className="flex flex-col flex-1 gap-1">
                <span className="font-body text-sm text-textMuted leading-snug">
                  {TYPE_ICONS[alert.type]} {alert.message}
                </span>
                <span className="font-body text-[10px] text-textMuted/50">
                  {new Date(alert.triggeredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}