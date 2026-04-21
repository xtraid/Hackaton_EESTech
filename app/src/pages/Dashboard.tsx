import React from 'react';
import { Link } from 'react-router-dom';
import { Map, Battery, Activity, Upload, ArrowRight } from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import { useBatteryContext } from '../context/BatteryContext';

const Dashboard: React.FC = () => {
  const { hasRouteData } = useBatteryContext();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">E-Bike Battery Optimizer</h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-3xl">
          Maximize your e-bike battery life by optimizing power usage based on route conditions,
          rider preferences, and advanced battery health algorithms.
        </p>
      </div>
      
      {!hasRouteData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-dashed border-gray-300 dark:border-gray-700 text-center">
          <div className="flex justify-center mb-4">
            <Upload className="w-12 h-12 text-green-500 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Get Started</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Upload your route data to begin optimizing your e-bike's battery performance.
          </p>
          <Link 
            to="/route-analysis" 
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Upload Route Data <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Route Analysis"
          description="Upload and analyze your cycling route with elevation profiles."
          icon={<Map className="w-8 h-8 text-blue-500 dark:text-blue-400" />}
          linkTo="/route-analysis"
          linkText="Analyze Route"
          color="blue"
        />
        
        <StatCard 
          title="Battery Optimizer"
          description="Calculate optimal power settings for maximum battery life."
          icon={<Battery className="w-8 h-8 text-green-500 dark:text-green-400" />}
          linkTo="/battery-optimizer"
          linkText="Optimize Battery"
          color="green"
        />
        
        <StatCard 
          title="Real-Time Adjustments"
          description="Get power recommendations during your ride for optimal performance."
          icon={<Activity className="w-8 h-8 text-orange-500 dark:text-orange-400" />}
          linkTo="/real-time"
          linkText="Real-Time Mode"
          color="orange"
        />
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold">1</div>
            <h3 className="font-medium text-gray-800 dark:text-white">Upload Route</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Upload your route data including latitude, longitude, and elevation information.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold">2</div>
            <h3 className="font-medium text-gray-800 dark:text-white">Set Preferences</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Specify your effort level, preferred speed mode, and desired completion time.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold">3</div>
            <h3 className="font-medium text-gray-800 dark:text-white">Get Optimized Plan</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Receive optimized power settings to maximize your battery's State of Health.
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-blue-500 dark:from-green-600 dark:to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Advanced Battery Life Optimization</h2>
        <p className="mb-4">
          Our algorithm uses NASA battery research data to optimize your e-bike's battery usage,
          extending its lifespan while ensuring you have enough power for your entire ride.
        </p>
        <Link 
          to="/battery-optimizer" 
          className="inline-flex items-center px-4 py-2 bg-white text-green-600 dark:text-green-500 rounded-md hover:bg-gray-100 dark:hover:bg-gray-100/90 transition-colors"
        >
          Learn More <ArrowRight className="ml-2 w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;