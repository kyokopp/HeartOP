import { useState, useEffect, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org';

const WEATHER_ICONS: Record<string, string> = {
  '01d': '☀️', '01n': '🌙',
  '02d': '⛅', '02n': '⛅',
  '03d': '☁️', '03n': '☁️',
  '04d': '☁️', '04n': '☁️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '❄️', '13n': '❄️',
  '50d': '🌫️', '50n': '🌫️',
};

export interface CurrentWeather {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  pressure: number;
  description: string;
  icon: string;
  weatherId: number;
  iconCode: string;
}

export interface DayForecast {
  label: string;
  temp: number;
  low: number;
  icon: string;
  iconCode: string;
}

export interface GeoResult {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export type ClimateTheme = 'sunny' | 'rain' | 'night' | 'snow' | 'sunny-rain' | 'night-rain';

export function mapWeatherToTheme(weatherId: number, iconCode: string): ClimateTheme {
  const isNight = iconCode.endsWith('n');

  if (weatherId >= 600 && weatherId < 700) return 'snow';

  if (weatherId >= 200 && weatherId < 600) {
    return isNight ? 'night-rain' : 'sunny-rain';
  }

  if (weatherId >= 700 && weatherId < 800) {
    return isNight ? 'night-rain' : 'sunny-rain';
  }

  if (isNight) return 'night';

  return 'sunny';
}

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!API_KEY || query.trim().length < 2) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=10&appid=${API_KEY}`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((item: any) => ({
      name: item.name,
      state: item.state,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
    }));
  } catch {
    return [];
  }
}

export function useWeather(city: string, refreshInterval = 600000) {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!API_KEY) {
      setError('VITE_OPENWEATHER_API_KEY not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const geoRes = await fetch(
        `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${API_KEY}`
      );
      if (!geoRes.ok) throw new Error('Geocoding failed');
      const geoData = await geoRes.json();
      if (!geoData.length) throw new Error(`City "${city}" not found`);

      const { lat, lon } = geoData[0];

      const [currentRes, forecastRes] = await Promise.all([
        fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`),
        fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&cnt=40&appid=${API_KEY}`),
      ]);

      if (!currentRes.ok) throw new Error('Weather API error');
      if (!forecastRes.ok) throw new Error('Forecast API error');

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();

      const iconCode = currentData.weather[0].icon;
      setCurrent({
        city: `${currentData.name}, ${geoData[0].state ? geoData[0].state + ', ' : ''}${geoData[0].country}`,
        temp: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6),
        pressure: currentData.main.pressure,
        description: currentData.weather[0].description,
        icon: WEATHER_ICONS[iconCode] || '🌡️',
        weatherId: currentData.weather[0].id,
        iconCode,
      });

      const dailyMap: Record<string, { readings: any[]; noonItem: any }> = {};
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dayKey = date.toLocaleDateString('en-US', { weekday: 'long' });
        const hour = date.getHours();

        if (!dailyMap[dayKey]) {
          dailyMap[dayKey] = { readings: [], noonItem: item };
        }
        dailyMap[dayKey].readings.push(item);

        const currentNoonDist = Math.abs(new Date(dailyMap[dayKey].noonItem.dt * 1000).getHours() - 12);
        if (Math.abs(hour - 12) < currentNoonDist) {
          dailyMap[dayKey].noonItem = item;
        }
      });

      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      const days = Object.entries(dailyMap)
        .filter(([day]) => day !== today)
        .slice(0, 5)
        .map(([day, { readings, noonItem }], i) => {
          const temps = readings.map((r: any) => r.main.temp);
          const highs = readings.map((r: any) => r.main.temp_max);
          const lows = readings.map((r: any) => r.main.temp_min);
          const high = Math.round(Math.max(...temps, ...highs));
          const low = Math.round(Math.min(...temps, ...lows));

          return {
            label: i === 0 ? 'Tomorrow' : day,
            temp: high,
            low: low,
            icon: WEATHER_ICONS[noonItem.weather[0].icon] || '🌡️',
            iconCode: noonItem.weather[0].icon,
          };
        });

      setForecast(days);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchWeather, refreshInterval]);

  return { current, forecast, loading, error };
}
