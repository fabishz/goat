"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ExpertFanComparisonProps {
    expertScore: number;
    fanScore: number;
}

export function ExpertFanComparison({ expertScore, fanScore }: ExpertFanComparisonProps) {
    const data = [
        { name: 'Expert Consensus', score: expertScore, color: '#D4AF37' },
        { name: 'Fan Sentiment', score: fanScore, color: '#3B82F6' },
    ];

    return (
        <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#9CA3AF"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{
                            backgroundColor: 'hsl(222, 30%, 12%)',
                            border: '1px solid hsl(222, 20%, 18%)',
                            borderRadius: '8px',
                            color: '#F5F5DC',
                        }}
                    />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={30}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
