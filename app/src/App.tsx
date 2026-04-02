import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider } from './context/WeatherContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';

function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </WeatherProvider>
    </ThemeProvider>
  );
}

export default App;