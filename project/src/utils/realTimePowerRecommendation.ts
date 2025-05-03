import { RoutePoint } from '../types';

/**
 * Get real-time power recommendation based on current position and conditions
 */
export const getRealTimePowerRecommendation = (
  routeData: RoutePoint[],
  optimizedPower: number[],
  currentPosition: number,
  batteryDeviation: number
): { recommendation: string; adjustedPower: number } => {
  if (!routeData || currentPosition >= routeData.length) {
    return { recommendation: 'Invalid position data', adjustedPower: 0 };
  }
  
  const currentPoint = routeData[currentPosition];
  const nextPoint = routeData[currentPosition + 1] || currentPoint;
  const elevationChange = nextPoint.elevation - currentPoint.elevation;
  
  let recommendation = '';
  let adjustedPower = optimizedPower[currentPosition] || 0;
  
  // Adjust based on terrain
  if (elevationChange > 10) {
    recommendation = 'Steep hill ahead. Increase assistance.';
    adjustedPower = Math.min(adjustedPower * 1.2, 1);
  } else if (elevationChange > 5) {
    recommendation = 'Uphill section. Moderate assistance recommended.';
  } else if (elevationChange < -10) {
    recommendation = 'Steep downhill. Reduce assistance to regenerate.';
    adjustedPower = Math.max(adjustedPower * 0.7, 0);
  } else if (elevationChange < -5) {
    recommendation = 'Downhill section. Light assistance recommended.';
  } else {
    recommendation = 'Flat section. Maintain current assistance.';
  }
  
  // Adjust for battery deviation
  if (batteryDeviation > 10) {
    recommendation += ' Reduce power to save battery.';
    adjustedPower = Math.max(adjustedPower * 0.8, 0);
  } else if (batteryDeviation < -10) {
    recommendation += ' You can increase power if needed.';
    adjustedPower = Math.min(adjustedPower * 1.1, 1);
  }
  
  return { recommendation, adjustedPower };
};