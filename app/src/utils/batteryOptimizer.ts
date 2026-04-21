import { RoutePoint, UserPreferences, BikeSpecifications, OptimizationResult } from '../types';
import { initPulp, PulpSolver } from 'pulp-wasm';

let pulp: PulpSolver | null = null;

// Initialize PuLP WASM
const initializePulp = async () => {
  if (!pulp) {
    pulp = await initPulp();
  }
  return pulp;
};

/**
 * Calculate SOH impact based on voltage and current profiles
 */
const calculateSOH = (voltage: number[], current: number[]): number => {
  // Simplified SOH calculation based on voltage and current stress
  const voltageStress = voltage.reduce((sum, v) => sum + Math.pow((v - 36) / 36, 2), 0) / voltage.length;
  const currentStress = current.reduce((sum, i) => sum + Math.pow(i / 15, 2), 0) / current.length;
  
  return 0.001 * (voltageStress + currentStress);
};

/**
 * Optimize battery usage using PuLP linear programming
 */
export const optimizeBattery = async (
  routeData: RoutePoint[],
  preferences: UserPreferences,
  bikeSpecs?: BikeSpecifications
): Promise<OptimizationResult> => {
  const { effortLevel, speedMode, completionTime } = preferences;
  
  // Initialize PuLP
  const solver = await initializePulp();
  
  // Constants
  const segments = routeData.length;
  const riderPower = 240 * (effortLevel / 5); // Max rider power based on effort level
  
  // Speed ranges based on mode (km/h)
  const speedRanges = {
    Eco: { min: 15, max: 20 },
    City: { min: 20, max: 25 },
    Sport: { min: 25, max: 32 }
  };
  const speedRange = speedRanges[speedMode as keyof typeof speedRanges];
  
  // Create optimization problem
  const problem = solver.createProblem('battery_optimization');
  
  // Variables
  const voltage = Array.from({ length: segments }, (_, i) => 
    problem.addVariable(`v${i}`, { lb: 32, ub: 42 })
  );
  
  const current = Array.from({ length: segments }, (_, i) => 
    problem.addVariable(`i${i}`, { lb: 0, ub: 15 })
  );
  
  // Calculate required power for each segment
  const requiredPower = routeData.map((point, i) => {
    const nextPoint = routeData[i + 1] || point;
    const elevationChange = nextPoint.elevation - point.elevation;
    const grade = elevationChange / (point.distance || 0.1);
    
    // Basic power calculation considering grade and speed
    const speed = (speedRange.min + speedRange.max) / 2;
    const rollingResistance = 0.01;
    const gravity = 9.81;
    const totalMass = (preferences.weight || 75) + (bikeSpecs?.weight || 25);
    
    return (
      rollingResistance * totalMass * gravity +
      totalMass * gravity * grade +
      0.5 * 1.225 * 0.6 * Math.pow(speed / 3.6, 2)
    );
  });
  
  // Constraints
  requiredPower.forEach((power, i) => {
    // Power balance: Battery power + rider power = required power
    problem.addConstraint(
      voltage[i].multiply(current[i]).add(-power + riderPower),
      '==',
      0,
      `power_balance_${i}`
    );
  });
  
  // Objective: Minimize SOH degradation
  const voltageTerms = voltage.map(v => v.subtract(36).pow(2));
  const currentTerms = current.map(i => i.pow(2));
  
  problem.setObjective(
    voltageTerms.concat(currentTerms).reduce((sum, term) => sum.add(term)),
    'minimize'
  );
  
  // Solve the optimization problem
  const status = await problem.solve();
  
  if (status.success) {
    // Extract solution
    const voltageValues = voltage.map(v => v.value);
    const currentValues = current.map(i => i.value);
    
    // Calculate power allocation as percentage of max power
    const powerAllocation = voltageValues.map((v, i) => 
      (v * currentValues[i]) / (42 * 15)
    );
    
    // Calculate SOH impact
    const sohDrop = calculateSOH(voltageValues, currentValues);
    
    return {
      isFeasible: true,
      batteryStart: 100,
      batteryEnd: Math.max(25, 100 - (powerAllocation.reduce((sum, p) => sum + p, 0) / segments) * 100),
      powerAllocation,
      estimatedSOHDrop: sohDrop,
      estimatedLifespanExtension: Math.floor(100 / sohDrop),
      completionTime
    };
  } else {
    // Fallback to simplified optimization if PuLP fails
    return fallbackOptimization(routeData, preferences, bikeSpecs);
  }
};

/**
 * Fallback optimization method when PuLP optimization fails
 */
const fallbackOptimization = (
  routeData: RoutePoint[],
  preferences: UserPreferences,
  bikeSpecs?: BikeSpecifications
): OptimizationResult => {
  const { effortLevel, speedMode, completionTime } = preferences;
  
  // Check if the route is feasible with given parameters
  const isFeasible = effortLevel >= 2 || completionTime >= 40;
  
  // Calculate battery end level (minimum 25%)
  let batteryEnd = 100 - (10 * (6 - effortLevel));
  if (batteryEnd < 25) batteryEnd = 25;
  
  // Calculate power allocation per segment
  const powerAllocation = routeData.map((point, index) => {
    const nextPoint = routeData[index + 1] || point;
    const elevationChange = nextPoint.elevation - point.elevation;
    
    let power;
    if (elevationChange > 5) {
      power = 0.6 + (0.1 * effortLevel);
    } else if (elevationChange < -5) {
      power = 0.2;
    } else {
      power = 0.4 + (0.05 * effortLevel);
    }
    
    // Adjust for speed mode
    if (speedMode === 'Eco') power *= 0.8;
    if (speedMode === 'Sport') power *= 1.2;
    
    return Math.min(Math.max(power, 0), 1);
  });
  
  // Calculate SOH impact
  const avgPower = powerAllocation.reduce((sum, power) => sum + power, 0) / powerAllocation.length;
  const baseSOHDrop = 0.003;
  const effortMultiplier = 1 - (effortLevel - 1) * 0.15;
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

// Export other utility functions
export { getRealTimePowerRecommendation } from './realTimePowerRecommendation';