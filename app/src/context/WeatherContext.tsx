import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useWeather, mapWeatherToTheme } from '../hooks/useWeather';
import { useTheme } from './ThemeContext';
import type { CurrentWeather, DayForecast } from '../hooks/useWeather';

interface WeatherContextValue {
  city: string;
  setCity: (city: string) => void;
  current: CurrentWeather | null;
  forecast: DayForecast[];
  loading: boolean;
  error: string | null;
}

const WeatherContext = createContext<WeatherContextValue>({
  city: 'Goiânia, Goiás',
  setCity: () => {},
  current: null,
  forecast: [],
  loading: true,
  error: null,
});

const DEFAULT_CITY = 'Goiânia, Goiás';

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [city, setCity] = useState(() => {
    return localStorage.getItem('heartop-city') || DEFAULT_CITY;
  });

  const { current, forecast, loading, error } = useWeather(city);
  const { setTheme } = useTheme();

  // Persist city selection
  useEffect(() => {
    localStorage.setItem('heartop-city', city);
  }, [city]);

  // Auto-switch theme based on weather conditions
  useEffect(() => {
    if (current) {
      const newTheme = mapWeatherToTheme(current.weatherId, current.iconCode);
      setTheme(newTheme);
    }
  }, [current, setTheme]);

  return (
    <WeatherContext.Provider value={{ city, setCity, current, forecast, loading, error }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  return useContext(WeatherContext);
}
