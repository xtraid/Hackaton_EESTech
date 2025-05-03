import React from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { RoutePoint } from '../../types';

type PowerAllocationChartProps = {
  routeData: RoutePoint[];
  powerAllocation: number[];
};

const PowerAllocationChart: React.FC<PowerAllocationChartProps> = ({ routeData, powerAllocation }) => {
  // Format data for the chart
  const chartData = routeData.map((point, index) => {
    return {
      name: `${(point.distance || index / 10).toFixed(1)} km`,
      elevation: point.elevation,
      power: (powerAllocation[index] || 0) * 100, // Convert to percentage
    };
  });
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12, fill: '#9CA3AF' }} 
          tickMargin={5}
          stroke="#9CA3AF"
        />
        <YAxis 
          yAxisId="left"
          tick={{ fontSize: 12, fill: '#9CA3AF' }} 
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
          tick={{ fontSize: 12, fill: '#9CA3AF' }} 
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
          stroke="#9CA3AF" 
          strokeWidth={1}
          strokeDasharray="3 3"
          yAxisId="right"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PowerAllocationChart;