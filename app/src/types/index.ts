// Route data types
export interface RoutePoint {
  latitude: number;
  longitude: number;
  elevation: number;
  distance?: number;
}

// Battery optimization types
export interface OptimizationResult {
  isFeasible: boolean;
  batteryStart: number;
  batteryEnd: number;
  powerAllocation: number[];
  estimatedSOHDrop: number;
  estimatedLifespanExtension: number;
  completionTime: number;
}

// User preferences
export interface UserPreferences {
  effortLevel: number;
  speedMode: 'Eco' | 'City' | 'Sport';
  completionTime: number;
  weight?: number;
}

// Bike specifications
export interface BikeSpecifications {
  weight: number;
  maxPower: number;
  batteryCapacity: number;
}