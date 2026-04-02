import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Settings, ChevronDown, MapPin } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useWeatherContext } from '../../context/WeatherContext';
import { themeOptions } from '../../theme';
import { searchCities } from '../../hooks/useWeather';
import type { ClimateTheme } from '../../context/ThemeContext';
import type { GeoResult } from '../../hooks/useWeather';

interface TopbarProps {
  onToggleSidebar: () => void;
}

export default function Topbar({ onToggleSidebar }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { city, setCity, loading: weatherLoading, error: weatherError } = useWeatherContext();

  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // --- City Search State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeoResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close picker on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    }
    if (pickerOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [pickerOpen]);

  // Close search dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Debounced city search
  const handleSearchInput = useCallback((value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchCities(value);
      setSearchResults(results);
      setSearchOpen(results.length > 0);
      setSearching(false);
    }, 150);
  }, []);

  // Select a city from results
  const handleSelectCity = useCallback((result: GeoResult) => {
    const cityLabel = result.state
      ? `${result.name}, ${result.state}, ${result.country}`
      : `${result.name}, ${result.country}`;
    setCity(cityLabel);
    setSearchQuery('');
    setSearchResults([]);
    setSearchOpen(false);
  }, [setCity]);

  const currentTheme = themeOptions.find(t => t.id === theme) ?? themeOptions[2];

  // Determine live status based on weather context
  const liveStatus = weatherError ? 'offline' : (weatherLoading ? 'loading' : 'healthy');

  return (
    <header className="h-20 w-full px-8 flex items-center justify-between z-20 relative">
      
      {/* Settings button (toggles sidebar) */}
      <button
        onClick={onToggleSidebar}
        className="glass-panel-hover p-2.5 rounded-xl flex items-center gap-2 cursor-pointer"
        style={{ color: 'var(--theme-text-muted)' }}
        title="Toggle settings"
      >
        <Settings size={20} />
      </button>

      {/* Centered City Search Bar */}
      <div className="flex-1 flex justify-center">
        <div className="relative w-96 group" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors" style={{ color: 'var(--theme-text-muted)' }} size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
            placeholder={`📍 ${city}`}
            className="w-full glass-panel !rounded-full py-2.5 pl-12 pr-4 text-sm placeholder-textMuted focus:outline-none focus:border-primary/50 focus:shadow-[0_0_15px_rgba(187,134,252,0.1)] transition-all"
            style={{ color: 'var(--theme-text-main)' }}
          />

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute left-0 right-0 top-full mt-2 glass-panel rounded-2xl overflow-hidden z-50"
              >
                {searching ? (
                  <div className="px-4 py-3 text-sm text-center animate-pulse" style={{ color: 'var(--theme-text-muted)' }}>
                    Searching...
                  </div>
                ) : (
                  searchResults.map((result, i) => (
                    <button
                      key={`${result.lat}-${result.lon}-${i}`}
                      onClick={() => handleSelectCity(result)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 cursor-pointer hover:bg-white/5"
                      style={{ color: 'var(--theme-text-main)' }}
                    >
                      <MapPin size={14} style={{ color: 'var(--theme-text-muted)', flexShrink: 0 }} />
                      <div className="flex flex-col min-w-0">
                        <span className="text-sm font-display font-semibold truncate">
                          {result.name}
                        </span>
                        <span className="text-[10px] tracking-wider uppercase truncate" style={{ color: 'var(--theme-text-muted)' }}>
                          {result.state ? `${result.state}, ` : ''}{result.country}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Theme Picker + Status */}
      <div className="flex items-center gap-4">

        {/* Theme Picker */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={() => setPickerOpen(prev => !prev)}
            className="glass-panel-hover px-3 py-2 rounded-xl flex items-center gap-2 cursor-pointer"
            style={{ color: 'var(--theme-text-muted)' }}
          >
            <span className="text-base">{currentTheme.icon}</span>
            <span className="text-xs font-semibold uppercase tracking-wider font-display">{currentTheme.label}</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${pickerOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {pickerOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="absolute right-0 top-full mt-2 glass-panel rounded-2xl overflow-hidden min-w-[160px] z-50"
              >
                {themeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setTheme(opt.id as ClimateTheme); setPickerOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200 cursor-pointer ${
                      theme === opt.id
                        ? 'bg-white/10'
                        : 'hover:bg-white/5'
                    }`}
                    style={{ color: theme === opt.id ? 'var(--theme-text-main)' : 'var(--theme-text-muted)' }}
                  >
                    <span className="text-base">{opt.icon}</span>
                    <span className="text-sm font-display font-semibold">{opt.label}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Badge — Reflects live weather API status */}
        <div className="flex items-center gap-2 px-4 py-1.5 glass-panel !rounded-full">
          <div className={`w-2 h-2 rounded-full animate-pulse-dot ${
            liveStatus === 'healthy' ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' :
            liveStatus === 'loading' ? 'bg-amber-400 shadow-[0_0_10px_#fbbf24]' :
            'bg-red-500 shadow-[0_0_10px_#ef4444]'
          }`} />
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>
            {liveStatus === 'healthy' ? 'Live' : liveStatus === 'loading' ? 'Syncing' : 'Offline'}
          </span>
        </div>
      </div>
    </header>
  );
}