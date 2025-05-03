import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Battery, Activity, Download, Bike, Zap } from 'lucide-react';
import { useBatteryContext } from '../context/BatteryContext';
import RealTimeChart from '../components/charts/RealTimeChart';
import toast from 'react-hot-toast';

const RealTimeAdjustments: React.FC = () => {
  const navigate = useNavigate();
  const { routeData, optimizationResult } = useBatteryContext();
  
  const [isActive, setIsActive] = useState<boolean>(false);
  const [currentPosition, setCurrentPosition] = useState<number>(0);
  const [currentBattery, setCurrentBattery] = useState<number>(100);
  const [currentRecommendation, setCurrentRecommendation] = useState<string>('');
  const [currentPowerLevel, setCurrentPowerLevel] = useState<number>(0);
  const [deviationFromPlan, setDeviationFromPlan] = useState<number>(0);
  
  // Adjust the interval for simulation
  const updateInterval = 1000; // 1 second
  
  useEffect(() => {
    if (!routeData || !optimizationResult) {
      navigate('/battery-optimizer');
    }
  }, [routeData, optimizationResult, navigate]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && routeData && optimizationResult) {
      interval = setInterval(() => {
        // Simulate progress along the route
        setCurrentPosition((prev) => {
          const newPos = prev + 1;
          if (newPos >= routeData.length - 1) {
            setIsActive(false);
            toast.success('Ride completed!');
            return routeData.length - 1;
          }
          return newPos;
        });
        
        // Simulate battery usage
        setCurrentBattery((prev) => {
          const powerUsage = optimizationResult.powerAllocation[currentPosition] || 0;
          const adjustedUsage = powerUsage * (1 + deviationFromPlan / 100);
          const newBattery = prev - (adjustedUsage * 0.2);
          return Math.max(newBattery, optimizationResult.batteryEnd);
        });
        
        // Update real-time recommendations
        updateRecommendation();
      }, updateInterval);
    }
    
    return () => clearInterval(interval);
  }, [isActive, currentPosition, routeData, optimizationResult, deviationFromPlan]);
  
  useEffect(() => {
    updateRecommendation();
  }, [currentPosition, deviationFromPlan]);
  
  const updateRecommendation = () => {
    if (!routeData || !optimizationResult || currentPosition >= routeData.length) return;
    
    const currentPoint = routeData[currentPosition];
    const nextPoint = routeData[currentPosition + 1] || currentPoint;
    const elevationChange = nextPoint.elevation - currentPoint.elevation;
    
    let recommendation = '';
    let powerLevel = optimizationResult.powerAllocation[currentPosition] || 0;
    
    // Adjust based on terrain
    if (elevationChange > 10) {
      recommendation = 'Steep hill ahead. Increase assistance.';
      powerLevel = Math.min(powerLevel * 1.2, 1);
    } else if (elevationChange > 5) {
      recommendation = 'Uphill section. Moderate assistance recommended.';
    } else if (elevationChange < -10) {
      recommendation = 'Steep downhill. Reduce assistance to regenerate.';
      powerLevel = Math.max(powerLevel * 0.7, 0);
    } else if (elevationChange < -5) {
      recommendation = 'Downhill section. Light assistance recommended.';
    } else {
      recommendation = 'Flat section. Maintain current assistance.';
    }
    
    // Adjust for battery deviation
    if (deviationFromPlan > 10) {
      recommendation += ' Reduce power to save battery.';
      powerLevel = Math.max(powerLevel * 0.8, 0);
    } else if (deviationFromPlan < -10) {
      recommendation += ' You can increase power if needed.';
      powerLevel = Math.min(powerLevel * 1.1, 1);
    }
    
    setCurrentRecommendation(recommendation);
    setCurrentPowerLevel(powerLevel);
  };
  
  const handleStartStop = () => {
    if (!isActive) {
      // Starting the ride
      setIsActive(true);
      toast.success('Real-time mode activated!');
    } else {
      // Pausing the ride
      setIsActive(false);
      toast.success('Real-time mode paused!');
    }
  };
  
  const handleDownload = () => {
    // In a real app, this would generate a ride plan PDF or similar
    toast.success('Ride plan downloaded!');
  };
  
  const handleReset = () => {
    setIsActive(false);
    setCurrentPosition(0);
    setCurrentBattery(100);
    setDeviationFromPlan(0);
    toast.success('Ride reset!');
  };
  
  const getCurrentSegmentInfo = () => {
    if (!routeData || currentPosition >= routeData.length) return null;
    
    const current = routeData[currentPosition];
    const next = routeData[currentPosition + 1] || current;
    const elevationChange = next.elevation - current.elevation;
    const distancePercent = (currentPosition / (routeData.length - 1)) * 100;
    
    let terrainType = 'Flat';
    if (elevationChange > 10) terrainType = 'Steep Uphill';
    else if (elevationChange > 5) terrainType = 'Uphill';
    else if (elevationChange < -10) terrainType = 'Steep Downhill';
    else if (elevationChange < -5) terrainType = 'Downhill';
    
    return {
      distancePercent: distancePercent.toFixed(1),
      elevation: current.elevation.toFixed(0),
      terrainType,
      elevationChange: elevationChange.toFixed(1)
    };
  };
  
  const segment = getCurrentSegmentInfo();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Real-Time Adjustments</h1>
        <p className="text-gray-600">
          Get real-time power recommendations during your ride for optimal battery performance.
        </p>
      </div>
      
      {routeData && optimizationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Real-Time Progress</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={handleStartStop}
                    className={`py-1 px-3 rounded-md text-sm font-medium text-white ${
                      isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                    } transition-colors`}
                  >
                    {isActive ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-800 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>
              
              <div className="h-64">
                <RealTimeChart 
                  routeData={routeData} 
                  currentPosition={currentPosition}
                  powerAllocation={optimizationResult.powerAllocation}
                />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Current Status</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Bike className="w-5 h-5 text-blue-500" />
                    <p className="text-sm text-gray-500">Progress</p>
                  </div>
                  <p className="text-xl font-bold text-gray-800 mt-1">{segment?.distancePercent}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Battery className="w-5 h-5 text-green-500" />
                    <p className="text-sm text-gray-500">Battery</p>
                  </div>
                  <p className="text-xl font-bold text-gray-800 mt-1">{currentBattery.toFixed(1)}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-orange-500" />
                    <p className="text-sm text-gray-500">Terrain</p>
                  </div>
                  <p className="text-xl font-bold text-gray-800 mt-1">{segment?.terrainType}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-500" />
                    <p className="text-sm text-gray-500">Power</p>
                  </div>
                  <p className="text-xl font-bold text-gray-800 mt-1">{(currentPowerLevel * 100).toFixed(0)}%</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-md">
                <h3 className="font-medium text-blue-800 mb-1">Current Recommendation:</h3>
                <p className="text-blue-700">{currentRecommendation || 'Start your ride to see recommendations'}</p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Dynamic Adjustments</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deviation from Plan
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="-20"
                      max="20"
                      value={deviationFromPlan}
                      onChange={(e) => setDeviationFromPlan(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <span className="text-gray-800 font-semibold">{deviationFromPlan}%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Adjust if you're using more or less battery than planned.
                  </p>
                </div>
                
                <div className="pt-4 pb-2 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Battery Health Impact</h3>
                  <div className="bg-gray-100 rounded-full h-4">
                    <div 
                      className={`h-4 rounded-full ${
                        deviationFromPlan > 10
                          ? 'bg-red-500'
                          : deviationFromPlan > 0
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(100, 50 + deviationFromPlan)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {deviationFromPlan > 10
                      ? 'High impact on battery health'
                      : deviationFromPlan > 0
                        ? 'Moderate impact on battery health'
                        : 'Optimal for battery health'
                    }
                  </p>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={handleDownload}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex justify-center items-center"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Ride Plan
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Ride Stats</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total distance:</span>
                  <span className="font-medium">10.0 km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Elevation change:</span>
                  <span className="font-medium">±{segment?.elevationChange || '0'} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current elevation:</span>
                  <span className="font-medium">{segment?.elevation || '0'} m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated completion:</span>
                  <span className="font-medium">
                    {optimizationResult?.completionTime.toFixed(0) || '45'} min
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery remaining:</span>
                  <span className="font-medium">{currentBattery.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-500">Battery SOH Impact:</div>
                <div className="text-lg font-semibold text-gray-800">
                  {optimizationResult 
                    ? `${(optimizationResult.estimatedSOHDrop * 100).toFixed(2)}%`
                    : '0.20%'
                  } per ride
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeAdjustments;