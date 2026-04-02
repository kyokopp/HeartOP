import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { Outlet } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { themeBackgrounds } from '../../theme';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme } = useTheme();

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);
  const closeSidebar  = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">

      {/* === Background Image Layer === */}
      <AnimatePresence mode="wait">
        <motion.img
          key={theme}
          src={themeBackgrounds[theme]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        />
      </AnimatePresence>

      {/* === Dark Overlay for Legibility === */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-[background] duration-500"
        style={{ background: 'var(--theme-bg-overlay)' }}
      />

      {/* === Sidebar Overlay (click to dismiss) === */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* === Sidebar (slide in/out) === */}
      <AnimatePresence>
        {sidebarOpen && (
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        )}
      </AnimatePresence>

      {/* === Main Content === */}
      <div className="flex flex-col flex-1 relative z-[2]">
        <Topbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}