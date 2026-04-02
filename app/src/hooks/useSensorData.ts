import { useState, useEffect, useCallback } from 'react';

const API_KEY = import.meta.env.VITE_API_KEY;

const API_HEADERS: HeadersInit = {
  'X-API-Key': API_KEY,
  'Content-Type': 'application/json',
}

export interface SensorReading {
  temperature: number;
  humidity: number;
  light: number;
  gas: number;
  receivedAt: string;
}

export interface SensorAlert {
  id: string;
  type: 'TEMPERATURE' | 'HUMIDITY' | 'GAS';
  severity: 'WARNING' | 'DANGER';
  message: string;
  triggeredAt: string;
}

export interface HistoryEntry {
  temperature: number;
  humidity: number;
  light: number;
  gas: number;
  receivedAt: string;
}

export type ApiStatus = 'healthy' | 'offline' | 'loading';

export function useSensorData(pollInterval = 5000) {
  const [latest, setLatest] = useState<SensorReading | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [alerts, setAlerts] = useState<SensorAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<ApiStatus>('loading');

  const fetchAll = useCallback(async () => {
    try {
      const [latestRes, alertsRes, historyRes] = await Promise.all([
        fetch(`/api/sensor-data/latest`, { headers: API_HEADERS }),
        fetch(`/api/alerts`, { headers: API_HEADERS }),
        fetch(`/api/sensor-data/history?hours=24`, { headers: API_HEADERS }),
      ]);

      if (!latestRes.ok && latestRes.status !== 404) {
        throw new Error(`Latest endpoint returned ${latestRes.status}`);
      }
      const latestData: SensorReading | null =
        latestRes.status === 404 ? null : await latestRes.json();

      const alertsData: SensorAlert[] = alertsRes.ok ? await alertsRes.json() : [];

      const historyData: HistoryEntry[] = historyRes.ok ? await historyRes.json() : [];

      setLatest(latestData);
      setAlerts(alertsData);
      setHistory(historyData);
      setApiStatus('healthy');
    } catch {
      setApiStatus('offline');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, pollInterval);
    return () => clearInterval(interval);
  }, [fetchAll, pollInterval]);

  return { latest, history, alerts, loading, apiStatus };
}
