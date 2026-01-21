import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GoatStats } from '@/types/goat';

interface RadarChartProps {
  stats: GoatStats;
  color?: string;
  showLabels?: boolean;
}

export function RadarChart({ stats, color = '#D4AF37', showLabels = true }: RadarChartProps) {
  const data = [
    { stat: 'Achievements', value: stats.achievements, fullMark: 100 },
    { stat: 'Influence', value: stats.influence, fullMark: 100 },
    { stat: 'Awards', value: stats.awards, fullMark: 100 },
    { stat: 'Longevity', value: stats.longevity, fullMark: 100 },
    { stat: 'Impact', value: stats.impact, fullMark: 100 },
    { stat: 'Legacy', value: stats.legacy, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsRadar data={data}>
        <PolarGrid stroke="#374151" />
        <PolarAngleAxis 
          dataKey="stat" 
          tick={{ fill: '#9CA3AF', fontSize: 12 }}
          tickLine={false}
        />
        {showLabels && (
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#6B7280', fontSize: 10 }}
            tickCount={5}
          />
        )}
        <Radar
          name="Stats"
          dataKey="value"
          stroke={color}
          fill={color}
          fillOpacity={0.3}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(222, 30%, 12%)',
            border: '1px solid hsl(222, 20%, 18%)',
            borderRadius: '8px',
            color: '#F5F5DC',
          }}
          formatter={(value: number) => [`${value}%`, 'Score']}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
}
