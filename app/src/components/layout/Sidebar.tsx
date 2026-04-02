import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, LineChart, Cpu, X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
} as const;

export default function Sidebar({ isOpen: _isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Analytics', path: '/analytics', icon: <LineChart size={20} /> },
  ];

  return (
    <motion.aside
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed left-0 top-0 bottom-0 w-72 z-40 glass-panel rounded-none border-y-0 border-l-0 flex flex-col p-6"
    >
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(187,134,252,0.3)]" style={{ background: 'rgba(var(--theme-primary), 0.2)', color: 'var(--theme-primary)' }}>
            <Cpu size={20} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight" style={{ color: 'var(--theme-text-main)' }}>HeartOP</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          style={{ color: 'var(--theme-text-muted)' }}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                  ? 'bg-primary/20 text-primary font-semibold shadow-[inset_0_0_10px_rgba(187,134,252,0.1)]'
                  : 'text-textMuted hover:bg-white/5 hover:text-white'
                }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <a
        href="https://github.com/kyokopp"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] font-body tracking-wide text-center opacity-30 hover:opacity-60 transition-opacity duration-300"
        style={{ color: 'var(--theme-text-muted)' }}
      >
        made by ppoolar
      </a>
    </motion.aside>
  );
}