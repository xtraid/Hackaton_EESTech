import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine } from 'recharts';
import { RoutePoint } from '../../types';

type RouteElevationChartProps = {
  routeData: RoutePoint[];
};

const RouteElevationChart: React.FC<RouteElevationChartProps> = ({ routeData }) => {
  // Calculate gradients and enhance data
  const chartData = routeData.map((point, index) => {
    const nextPoint = routeData[index + 1];
    let gradient = 0;
    
    if (nextPoint) {
      const distance = (nextPoint.distance || (index + 1) / 10) - (point.distance || index / 10);
      const elevationChange = nextPoint.elevation - point.elevation;
      gradient = distance > 0 ? (elevationChange / distance / 10) : 0;
    }
    
    return {
      name: `${(point.distance || index / 10).toFixed(1)} km`,
      elevation: point.elevation,
      gradient: gradient,
      isLocalMax: index > 0 && index < routeData.length - 1 &&
        point.elevation > routeData[index - 1].elevation &&
        point.elevation > (routeData[index + 1]?.elevation || 0),
      isLocalMin: index > 0 && index < routeData.length - 1 &&
        point.elevation < routeData[index - 1].elevation &&
        point.elevation < (routeData[index + 1]?.elevation || 0),
    };
  });

  // Calculate statistics
  const stats = {
    maxElevation: Math.max(...routeData.map(p => p.elevation)),
    minElevation: Math.min(...routeData.map(p => p.elevation)),
    totalAscent: routeData.reduce((acc, point, i) => {
      if (i === 0) return 0;
      const gain = point.elevation - routeData[i - 1].elevation;
      return acc + (gain > 0 ? gain : 0);
    }, 0),
    totalDescent: routeData.reduce((acc, point, i) => {
      if (i === 0) return 0;
      const loss = routeData[i - 1].elevation - point.elevation;
      return acc + (loss > 0 ? loss : 0);
    }, 0),
  };

  const getGradientColor = (gradient: number) => {
    if (gradient > 8) return '#EF4444';
    if (gradient > 4) return '#F59E0B';
    if (gradient > 0) return '#10B981';
    if (gradient < -8) return '#3B82F6';
    if (gradient < -4) return '#60A5FA';
    if (gradient < 0) return '#93C5FD';
    return '#6B7280';
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">Distance: {label}</p>
        <p className="text-gray-700 dark:text-gray-300">Elevation: {data.elevation.toFixed(1)}m</p>
        <p className="text-gray-700 dark:text-gray-300">
          Gradient: <span style={{ color: getGradientColor(data.gradient) }}>
            {(data.gradient * 100).toFixed(1)}%
          </span>
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorElevation" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(156, 163, 175, 0.2)" />
                <stop offset="100%" stopColor="rgba(156, 163, 175, 0.05)" />
              </linearGradient>
            </defs>

            <CartesianGrid 
              strokeDasharray="3 3" 
              vertical={false}
              fill="url(#colorGrid)"
              stroke="rgba(156, 163, 175, 0.2)"
            />

            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickMargin={5}
              stroke="#9CA3AF"
              tickFormatter={(value) => value.replace(' km', '')}
              interval={Math.ceil(chartData.length / 20)}
            />

            <YAxis
              tick={{ fontSize: 12, fill: '#9CA3AF' }}
              tickMargin={5}
              stroke="#9CA3AF"
              domain={['dataMin - 20', 'dataMax + 20']}
              label={{
                value: 'Elevation (m)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#6B7280' }
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Area
              type="monotone"
              dataKey="elevation"
              stroke="#10B981"
              strokeWidth={2}
              fill="url(#colorElevation)"
              animationDuration={1000}
              dot={false}
            />

            {chartData.map((point, index) => (
              <React.Fragment key={index}>
                {point.isLocalMax && (
                  <ReferenceLine
                    x={point.name}
                    stroke="#EF4444"
                    strokeDasharray="3 3"
                    label={{
                      value: `${point.elevation.toFixed(0)}m`,
                      position: 'top',
                      fill: '#EF4444',
                      fontSize: 12
                    }}
                  />
                )}
                {point.isLocalMin && (
                  <ReferenceLine
                    x={point.name}
                    stroke="#10B981"
                    strokeDasharray="3 3"
                    label={{
                      value: `${point.elevation.toFixed(0)}m`,
                      position: 'bottom',
                      fill: '#10B981',
                      fontSize: 12
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-blue-50 dark:bg-skyblue-900/20 p-3 rounded-md">
          <p className="text-blue-700 dark:text-darkblue-300">Max Elevation</p>
          <p className="text-xl font-semibold text-blue-900 dark:text-black-100">{stats.maxElevation.toFixed(0)}m</p>
        </div>
        <div className="bg-green-50 dark:bg-lightgreen-900/20 p-3 rounded-md">
          <p className="text-green-700 dark:text-darkgreen-300">Min Elevation</p>
          <p className="text-xl font-semibold text-green-900 dark:text-black-100">{stats.minElevation.toFixed(0)}m</p>
        </div>
        <div className="bg-orange-50 dark:bg-darkorange-900/20 p-3 rounded-md">
          <p className="text-orange-700 dark:text-orange-300">Total Ascent</p>
          <p className="text-xl font-semibold text-orange-900 dark:text-black-100">+{stats.totalAscent.toFixed(0)}m</p>
        </div>
        <div className="bg-purple-50 dark:bg-darkpurple-900/20 p-3 rounded-md">
          <p className="text-purple-700 dark:text-purple-300">Total Descent</p>
          <p className="text-xl font-semibold text-purple-900 dark:text-black-100">-{stats.totalDescent.toFixed(0)}m</p>
        </div>
      </div>
    </div>
  );
};

export default RouteElevationChart;