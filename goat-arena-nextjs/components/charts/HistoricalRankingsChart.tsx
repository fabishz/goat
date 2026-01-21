"use client";

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HistoricalRankingsChartProps {
    data: { year: number; rank: number }[];
}

export function HistoricalRankingsChart({ data }: HistoricalRankingsChartProps) {
    return (
        <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis
                        dataKey="year"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        reversed
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        domain={[1, 'dataMax + 1']}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'hsl(222, 30%, 12%)',
                            border: '1px solid hsl(222, 20%, 18%)',
                            borderRadius: '8px',
                            color: '#F5F5DC',
                        }}
                        itemStyle={{ color: '#D4AF37' }}
                    />
                    <Line
                        type="monotone"
                        dataKey="rank"
                        stroke="#D4AF37"
                        strokeWidth={3}
                        dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
