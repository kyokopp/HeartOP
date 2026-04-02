import type { ClimateTheme } from './context/ThemeContext';

export const colors = {
  secondary: '#22d3ee',
  muted: '#bbc9cf',
  faintWhite: 'rgba(255,255,255,0.05)',
  gridStroke: 'rgba(255,255,255,0.05)',
} as const;

export const themeBackgrounds: Record<ClimateTheme, string> = {
  sunny:      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&auto=format',
  rain:       'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&q=80&auto=format',
  night:      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80&auto=format',
  snow:       'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80&auto=format',
  'sunny-rain': 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1920&q=80&auto=format',
  'night-rain': 'https://images.unsplash.com/photo-1501999635878-71cb5379c2d8?w=1920&q=80&auto=format',
};

export const themeOptions: { id: ClimateTheme; label: string; icon: string }[] = [
  { id: 'sunny',      label: 'Sunny',      icon: '☀️' },
  { id: 'sunny-rain', label: 'Sunny Rain',  icon: '🌦️' },
  { id: 'night-rain', label: 'Night Rain',  icon: '🌧️' },
  { id: 'night',      label: 'Night',      icon: '🌙' },
  { id: 'snow',       label: 'Snow',       icon: '❄️' },
  { id: 'rain',       label: 'Rain',       icon: '🌧️' },
];
