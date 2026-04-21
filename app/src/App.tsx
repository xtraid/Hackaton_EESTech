import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Dashboard from './pages/Dashboard';
import RouteAnalysis from './pages/RouteAnalysis';
import BatteryOptimizer from './pages/BatteryOptimizer';
import RealTimeAdjustments from './pages/RealTimeAdjustments';
import { BatteryProvider } from './context/BatteryContext';

function App() {
  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <HelmetProvider>
      <BatteryProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            <Helmet>
              <title>E-Bike Battery Optimizer</title>
              <meta name="description" content="Optimize your e-bike battery life for maximum longevity" />
            </Helmet>

            <Navbar />
            
            <main className="flex-grow container mx-auto px-4 py-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/route-analysis" element={<RouteAnalysis />} />
                <Route path="/battery-optimizer" element={<BatteryOptimizer />} />
                <Route path="/real-time" element={<RealTimeAdjustments />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
            <Toaster position="bottom-right" />
          </div>
        </BrowserRouter>
      </BatteryProvider>
    </HelmetProvider>
  );
}

export default App;