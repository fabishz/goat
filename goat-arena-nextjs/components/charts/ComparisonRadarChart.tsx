"use client";

import { Radar, RadarChart as RechartsRadar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { GoatStats } from '@/types/goat';

interface ComparisonRadarChartProps {
    stats1: GoatStats;
    stats2: GoatStats;
    name1: string;
    name2: string;
    color1?: string;
    color2?: string;
}

export function ComparisonRadarChart({
    stats1,
    stats2,
    name1,
    name2,
    color1 = '#D4AF37',
    color2 = '#3B82F6'
}: ComparisonRadarChartProps) {
    const data = [
        { stat: 'Achievements', val1: stats1.achievements, val2: stats2.achievements },
        { stat: 'Influence', val1: stats1.influence, val2: stats2.influence },
        { stat: 'Awards', val1: stats1.awards, val2: stats2.awards },
        { stat: 'Longevity', val1: stats1.longevity, val2: stats2.longevity },
        { stat: 'Impact', val1: stats1.impact, val2: stats2.impact },
        { stat: 'Legacy', val1: stats1.legacy, val2: stats2.legacy },
    ];

    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsRadar data={data}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis
                        dataKey="stat"
                        tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        tickLine={false}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: '#6B7280', fontSize: 10 }}
                        tickCount={5}
                    />
                    <Radar
                        name={name1}
                        dataKey="val1"
                        stroke={color1}
                        fill={color1}
                        fillOpacity={0.3}
                        strokeWidth={2}
                    />
                    <Radar
                        name={name2}
                        dataKey="val2"
                        stroke={color2}
                        fill={color2}
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
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </RechartsRadar>
            </ResponsiveContainer>
        </div>
    );
}
