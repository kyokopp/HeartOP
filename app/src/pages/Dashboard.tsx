import WeatherCard from '../components/WeatherCard';
import ClockWidget from '../components/ClockWidget';
import SensorPanel from '../components/SensorPanel';
import AlertsPanel from '../components/AlertsPanel';
import ForecastGrid from '../components/ForecastGrid';
import { useWeatherContext } from '../context/WeatherContext';
import { useSensorData } from '../hooks/useSensorData';

export default function Dashboard() {
  const { current, forecast, loading: weatherLoading } = useWeatherContext();
  const { latest, alerts, loading: sensorLoading, apiStatus } = useSensorData();

  return (
    <div className="flex flex-col gap-8 pb-8">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 flex flex-col gap-8">
          <WeatherCard weather={current} loading={weatherLoading} />
          <ClockWidget />
        </div>
        
        <div className="lg:col-span-1 flex flex-col gap-8">
          <SensorPanel data={latest} loading={sensorLoading} />
          <AlertsPanel alerts={alerts} apiStatus={apiStatus} />
        </div>

      </div>

      <ForecastGrid forecast={forecast} loading={weatherLoading} />

    </div>
  );
}