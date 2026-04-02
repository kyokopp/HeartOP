import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ClimateTheme = 'sunny' | 'rain' | 'night' | 'snow' | 'sunny-rain' | 'night-rain';

interface ThemeContextValue {
  theme: ClimateTheme;
  setTheme: (theme: ClimateTheme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'night',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ClimateTheme>(() => {
    const saved = localStorage.getItem('heartop-theme') as ClimateTheme | null;
    return saved ?? 'night';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('heartop-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
