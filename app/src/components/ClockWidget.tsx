import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

/**
 * Live clock widget that follows the HeartOP glass-panel design language.
 * Updates every second, showing time + date with day-of-week.
 */
export default function ClockWidget() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');

  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="glass-panel p-8 rounded-[48px] flex items-center gap-6 relative overflow-hidden"
    >
      {/* Decorative background clock icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.04] pointer-events-none select-none">
        <Clock size={160} strokeWidth={1} />
      </div>

      {/* Clock icon badge */}
      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
        <Clock size={26} className="text-primary drop-shadow-[0_0_12px_var(--theme-primary)]" />
      </div>

      {/* Time + Date */}
      <div className="flex flex-col gap-1 z-10">
        <div className="flex items-baseline gap-1">
          <span className="font-display font-extrabold text-4xl text-white tracking-tight tabular-nums">
            {hours}:{minutes}
          </span>
          <span className="font-display font-semibold text-lg text-primary/70 tabular-nums">
            :{seconds}
          </span>
        </div>
        <span className="font-body text-sm text-textMuted tracking-wide">
          {dateStr}
        </span>
      </div>
    </motion.div>
  );
}
