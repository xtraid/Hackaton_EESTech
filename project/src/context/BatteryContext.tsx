import React, { createContext, useContext, useState } from 'react';
import { RoutePoint, OptimizationResult } from '../types';

type BatteryContextType = {
  routeData: RoutePoint[] | null;
  setRouteData: (data: RoutePoint[]) => void;
  optimizationResult: OptimizationResult | null;
  setOptimizationResult: (result: OptimizationResult) => void;
  hasRouteData: boolean;
};

const BatteryContext = createContext<BatteryContextType | undefined>(undefined);

export const BatteryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routeData, setRouteData] = useState<RoutePoint[] | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  
  return (
    <BatteryContext.Provider value={{
      routeData,
      setRouteData,
      optimizationResult,
      setOptimizationResult,
      hasRouteData: !!routeData,
    }}>
      {children}
    </BatteryContext.Provider>
  );
};

export const useBatteryContext = () => {
  const context = useContext(BatteryContext);
  if (context === undefined) {
    throw new Error('useBatteryContext must be used within a BatteryProvider');
  }
  return context;
};