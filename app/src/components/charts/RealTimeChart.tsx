import React, { useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RoutePoint } from '../../types';

type RealTimeChartProps = {
  routeData: RoutePoint[];
  currentPosition: number;
  powerAllocation: number[];
};

const RealTimeChart: React.FC<RealTimeChartProps> = ({ 
  routeData, 
  currentPosition,
  powerAllocation
}) => {
  const [visibleRange, setVisibleRange] = useState<{ start: number; end: number }>({ 
    start: 0, 
    end: Math.min(routeData.length - 1, 30) 
  });
  
  useEffect(() => {
    // Keep the current position within the visible range, showing some data ahead
    const windowSize = 30; // Show 30 points at a time
    
    if (currentPosition > visibleRange.end - 10) {
      const newEnd = Math.min(routeData.length - 1, currentPosition + 20);
      const newStart = Math.max(0, newEnd - windowSize);
      setVisibleRange({ start: newStart, end: newEnd });
    } else if (currentPosition < visibleRange.start + 5) {
      const newStart = Math.max(0, currentPosition - 5);
      const newEnd = Math.min(routeData.length - 1, newStart + windowSize);
      setVisibleRange({ start: newStart, end: newEnd });
    }
  }, [currentPosition, routeData.length]);
  
  // Format data for the chart
  const visibleData = routeData
    .slice(visibleRange.start, visibleRange.end + 1)
    .map((point, index) => {
      const actualIndex = index + visibleRange.start;
      return {
        name: `${(point.distance || actualIndex / 10).toFixed(1)} km`,
        elevation: point.elevation,
        power: (powerAllocation[actualIndex] || 0) * 100, // Convert to percentage
        current: actualIndex === currentPosition,
      };
    });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={visibleData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }} 
          tickMargin={5}
          stroke="#9CA3AF"
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 12 }} 
          tickMargin={5}
          domain={[0, 100]}
          stroke="#9CA3AF"
          label={{ 
            value: 'Power (%)', 
            angle: -90, 
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
          }}
        />
        <YAxis 
          yAxisId="right"
          orientation="right"
          domain={['dataMin - 10', 'dataMax + 10']}
          tick={{ fontSize: 12 }} 
          tickMargin={5}
          stroke="#9CA3AF"
          label={{ 
            value: 'Elevation (m)', 
            angle: 90, 
            position: 'insideRight',
            style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
          }}
        />
        <Tooltip 
          formatter={(value: number, name: string) => {
            if (name === 'power') return [`${value.toFixed(0)}%`, 'Power'];
            return [`${value} m`, 'Elevation'];
          }}
          contentStyle={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.9)', 
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="power" 
          stroke="#10B981" 
          strokeWidth={2}
          yAxisId="left"
          dot={false}
        />
        <Line 
          type="monotone" 
          dataKey="elevation" 
          stroke="#6B7280" 
          strokeWidth={1}
          strokeDasharray="3 3"
          yAxisId="right"
          dot={false}
        />
        
        {/* Current position indicator */}
        <ReferenceLine 
          x={visibleData.find(d => d.current)?.name} 
          stroke="#EF4444" 
          strokeWidth={2} 
          label={{
            value: 'Current',
            position: 'top',
            fill: '#EF4444',
            fontSize: 12
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RealTimeChart;