import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, ArrowRight, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useBatteryContext } from '../context/BatteryContext';
import RouteElevationChart from '../components/charts/RouteElevationChart';
import PowerAllocationChart from '../components/charts/PowerAllocationChart';
import toast from 'react-hot-toast';

const BatteryOptimizer: React.FC = () => {
  const navigate = useNavigate();
  const { routeData, setOptimizationResult } = useBatteryContext();
  
  const [effortLevel, setEffortLevel] = useState<number>(3);
  const [speedMode, setSpeedMode] = useState<string>('City');
  const [completionTime, setCompletionTime] = useState<number>(45);
  const [weight, setWeight] = useState<number>(75);
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizationResult, setLocalOptimizationResult] = useState<any>(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState<boolean>(false);
  
  useEffect(() => {
    if (!routeData) {
      navigate('/route-analysis');
    }
  }, [routeData, navigate]);

  const getEffortColor = (effort: number) => {
    if (effort === 1) return 'bg-emerald-500 hover:bg-emerald-600';
    if (effort === 2) return 'bg-green-500 hover:bg-green-600';
    if (effort === 3) return 'bg-yellow-500 hover:bg-yellow-600';
    if (effort === 4) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-red-500 hover:bg-red-600';
  };

  const getEffortTextColor = (effort: number) => {
    if (effort === 1) return 'text-emerald-500 dark:text-emerald-400';
    if (effort === 2) return 'text-green-500 dark:text-green-400';
    if (effort === 3) return 'text-yellow-500 dark:text-yellow-400';
    if (effort === 4) return 'text-orange-500 dark:text-orange-400';
    return 'text-red-500 dark:text-red-400';
  };

  const getEffortBgColor = (effort: number) => {
    if (effort === 1) return 'bg-emerald-900/20';
    if (effort === 2) return 'bg-green-900/20';
    if (effort === 3) return 'bg-yellow-900/20';
    if (effort === 4) return 'bg-orange-900/20';
    return 'bg-red-900/20';
  };
  
  const handleOptimize = () => {
    if (!routeData) return;
    
    setIsOptimizing(true);
    
    setTimeout(() => {
      const result = calculateOptimization();
      setLocalOptimizationResult(result);
      setOptimizationResult(result);
      setIsOptimizing(false);
      
      if (result.isFeasible) {
        toast.success('Optimization completed successfully!');
      } else {
        toast.error('Route cannot be completed with the given parameters.');
      }
    }, 2000);
  };
  
  const calculateOptimization = () => {
    const isFeasible = effortLevel >= 2 || completionTime >= 40;
    let batteryEnd = 100 - (10 * effortLevel);
    if (batteryEnd < 25) batteryEnd = 25;
    
    const powerAllocation = routeData?.map((point, index) => {
      const nextPoint = routeData[index + 1] || point;
      const elevationChange = nextPoint.elevation - point.elevation;
      let power = 1 - (effortLevel - 1) * 0.15;
      
      if (elevationChange > 5) {
        power *= 1.3;
      } else if (elevationChange < -5) {
        power *= 0.5;
      }
      
      if (speedMode === 'Eco') power *= 0.8;
      if (speedMode === 'Sport') power *= 1.2;
      
      return Math.min(Math.max(power, 0.1), 1);
    }) || [];
    
    const avgPower = powerAllocation.reduce((sum, power) => sum + power, 0) / powerAllocation.length;
    const baseSOHDrop = 0.003;
    const effortMultiplier = (effortLevel / 5);
    const estimatedSOHDrop = baseSOHDrop * avgPower * effortMultiplier;
    
    return {
      isFeasible,
      batteryStart: 100,
      batteryEnd,
      powerAllocation,
      estimatedSOHDrop,
      estimatedLifespanExtension: Math.floor(100 / estimatedSOHDrop),
      completionTime: isFeasible ? completionTime : completionTime * 1.3,
    };
  };

  return (
    <div className="space-y-6 dark:bg-gray-900">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Battery Optimizer</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Set your preferences and optimize battery usage for your route.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Rider Preferences</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Effort Level (1-5)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={effortLevel}
                    onChange={(e) => setEffortLevel(parseInt(e.target.value))}
                    className={`w-full h-2 rounded-lg appearance-none cursor-pointer transition-colors duration-300 ${getEffortBgColor(effortLevel)}`}
                    style={{
                      background: `linear-gradient(to right, 
                        #10B981 0%, 
                        #10B981 20%, 
                        #EAB308 40%,
                        #F97316 60%, 
                        #EF4444 80%,
                        #EF4444 100%)`
                    }}
                  />
                  <span className={`font-semibold transition-colors duration-300 ${getEffortTextColor(effortLevel)}`}>
                    {effortLevel}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Higher effort means you do more work and use less battery.
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Speed Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['Eco', 'City', 'Sport'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSpeedMode(mode)}
                      className={`py-2 px-3 rounded-md text-sm font-medium transition-all duration-300 ${
                        speedMode === mode
                          ? `${getEffortColor(effortLevel)} text-white`
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Desired Completion Time (minutes)
                </label>
                <input
                  type="number"
                  value={completionTime}
                  onChange={(e) => setCompletionTime(parseInt(e.target.value))}
                  min="20"
                  max="120"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <button
                  onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                  className={`text-sm ${getEffortTextColor(effortLevel)} hover:opacity-80 flex items-center transition-colors duration-300`}
                >
                  {showAdvancedOptions ? (
                    <>
                      <X className="w-4 h-4 mr-1" /> Hide Advanced Options
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4 mr-1" /> Show Advanced Options
                    </>
                  )}
                </button>
              </div>
              
              {showAdvancedOptions && (
                <div className="pt-2 space-y-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                      Rider Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(parseInt(e.target.value))}
                      min="40"
                      max="150"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              )}
              
              <button
                onClick={handleOptimize}
                disabled={isOptimizing}
                className={`w-full py-2 px-4 text-white rounded-md transition-all duration-300 flex justify-center items-center disabled:opacity-50 ${getEffortColor(effortLevel)}`}
              >
                {isOptimizing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Optimizing...
                  </>
                ) : (
                  <>
                    <Battery className="w-5 h-5 mr-2" />
                    Optimize Battery Usage
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
          {routeData && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Route Elevation Profile</h2>
              <div className="h-48">
                <RouteElevationChart routeData={routeData} />
              </div>
            </div>
          )}
          
          {optimizationResult && (
            <>
              <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
              </div>
              <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
              </div>
              <div className={`rounded-lg shadow-md p-6 mb-6 transition-colors duration-300`}>
              </div>
            
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Optimization Results</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className={`${getEffortBgColor(effortLevel)} rounded-lg p-4 transition-all duration-300`}>
                    <p className="text-sm text-gray-200">Battery Start Level</p>
                    <p className="text-2xl font-bold text-white">{optimizationResult.batteryStart}%</p>
                  </div>
                  <div className={`${getEffortBgColor(effortLevel)} rounded-lg p-4 transition-all duration-300`}>
                    <p className="text-sm text-gray-200">Battery End Level</p>
                    <p className="text-2xl font-bold text-white">{optimizationResult.batteryEnd}%</p>
                  </div>
                  <div className={`${getEffortBgColor(effortLevel)} rounded-lg p-4 transition-all duration-300`}>
                    <p className="text-sm text-gray-200">Estimated SOH Impact</p>
                    <p className="text-2xl font-bold text-white">{(optimizationResult.estimatedSOHDrop * 100).toFixed(2)}%</p>
                  </div>
                  <div className={`${getEffortBgColor(effortLevel)} rounded-lg p-4 transition-all duration-300`}>
                    <p className="text-sm text-gray-200">Battery Lifespan Extension</p>
                    <p className="text-2xl font-bold text-white">~{optimizationResult.estimatedLifespanExtension} cycles</p>
                  </div>
                </div>
                
                <h3 className="text-md font-semibold text-gray-800 dark:text-white mb-3">Power Allocation by Segment</h3>
                <div className="h-48">
                  <PowerAllocationChart 
                    routeData={routeData} 
                    powerAllocation={optimizationResult.powerAllocation}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BatteryOptimizer;

//export default BatteryOptimizer