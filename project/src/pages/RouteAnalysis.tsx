import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Map, ArrowRight, Check } from 'lucide-react';
import { useBatteryContext } from '../context/BatteryContext';
import RouteElevationChart from '../components/charts/RouteElevationChart';
import toast from 'react-hot-toast';

const RouteAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { setRouteData, routeData } = useBatteryContext();
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsUploading(true);
    
    setTimeout(() => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const mockRouteData = generateMockRouteData();
          setRouteData(mockRouteData);
          setIsUploading(false);
          toast.success('Route data uploaded successfully!');
        } catch (error) {
          console.error('Error parsing route data:', error);
          setIsUploading(false);
          toast.error('Failed to parse route data. Please check the file format.');
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        toast.error('Error reading file');
      };
      
      reader.readAsText(file);
    }, 1500);
  };
  
  const generateMockRouteData = () => {
    const points = 200; // Increased number of points for more detail
    const data = [];
    
    // Generate more complex elevation profile with multiple peaks and valleys
    for (let i = 0; i < points; i++) {
      const progress = i / points;
      const distance = progress * 10; // Total distance of 10km
      
      // Create more complex elevation profile using multiple sine waves
      const baseElevation = 200;
      const elevation = baseElevation + 
        100 * Math.sin(progress * Math.PI * 2) + // Main hill pattern
        50 * Math.sin(progress * Math.PI * 6) +  // Medium hills
        20 * Math.sin(progress * Math.PI * 12) + // Small variations
        30 * Math.sin(progress * Math.PI * 3);   // Additional complexity
      
      data.push({
        latitude: 41.9028 + (Math.cos(progress * Math.PI * 2) * 0.01),
        longitude: 12.4964 + (Math.sin(progress * Math.PI * 2) * 0.01),
        elevation: Math.max(0, elevation), // Ensure elevation is never negative
        distance: distance,
      });
    }
    
    return data;
  };
  
  const handleContinue = () => {
    navigate('/battery-optimizer');
  };

  return (
    <div className="space-y-6">
      
      {!routeData ? (
        <div className="bg-white rounded-lg shadow-md p-8 border border-dashed border-gray-300">
          <div className="flex flex-col items-center text-center">
            <Map className="w-16 h-16 text-green-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Upload Route Data</h2>
            <p className="text-gray-600 mb-6 max-w-md">
              Upload your cycling route in GPX, CSV, or TCX format. The file should include latitude, 
              longitude, and elevation data for best results.
            </p>
            
            <label className="relative cursor-pointer bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md transition-colors inline-flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              <span>{isUploading ? 'Uploading...' : 'Select Route File'}</span>
              <input 
                type="file" 
                className="hidden" 
                accept=".gpx,.csv,.tcx" 
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            </label>
            
            {fileName && (
              <div className="mt-4 text-sm text-gray-600 flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                Selected file: {fileName}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Elevation Profile</h2>
            <div className="h-96"> {/* Increased height for better visibility */}
              <RouteElevationChart routeData={routeData} />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Total Distance</p>
                <p className="text-2xl font-bold text-gray-800">10.0 km</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Elevation Gain</p>
                <p className="text-2xl font-bold text-gray-800">550 m</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Max Elevation</p>
                <p className="text-2xl font-bold text-gray-800">450 m</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-500">Estimated Duration</p>
                <p className="text-2xl font-bold text-gray-800">45 min</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Continue to Battery Optimizer <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteAnalysis;