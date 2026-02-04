"use client";


import {
    Award, Vote, History, Star,
    Target, PieChart as PieChartIcon,
    Activity, MessageSquare
} from 'lucide-react';

import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/stores/app-store';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell,
    PieChart, Pie
} from 'recharts';

export default function DashboardPage() {
    const { user } = useAppStore();

    if (!user) return null;

    const accuracyData = [
        { month: 'Jan', accuracy: 75 },
        { month: 'Feb', accuracy: 82 },
        { month: 'Mar', accuracy: 78 },
        { month: 'Apr', accuracy: 85 },
        { month: 'May', accuracy: 88 },
    ];

    const categoryData = [
        { name: 'Sports', value: 45, color: '#D4AF37' },
        { name: 'Music', value: 25, color: '#3B82F6' },
        { name: 'Science', value: 20, color: '#10B981' },
        { name: 'Other', value: 10, color: '#6B7280' },
    ];

    return (
        <div className="pb-20">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Main Stats */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass p-6 rounded-2xl border border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <Activity className="w-5 h-5 text-accent" />
                                    <span className="text-[10px] font-bold text-green-500">+12% this week</span>
                                </div>
                                <div className="text-3xl font-serif font-bold mb-1">{user.influenceWeight}x</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Influence Weight</div>
                            </div>
                            <div className="glass p-6 rounded-2xl border border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <Vote className="w-5 h-5 text-accent" />
                                    <span className="text-[10px] font-bold text-accent">Top 5% Voter</span>
                                </div>
                                <div className="text-3xl font-serif font-bold mb-1">{user.votesCount}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Votes Cast</div>
                            </div>
                            <div className="glass p-6 rounded-2xl border border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <MessageSquare className="w-5 h-5 text-accent" />
                                    <span className="text-[10px] font-bold text-accent">Active Debater</span>
                                </div>
                                <div className="text-3xl font-serif font-bold mb-1">{user.debatesJoined}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Debates Joined</div>
                            </div>
                        </div>

                        {/* Accuracy Chart */}
                        <div className="glass p-8 rounded-2xl border border-border/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <Target className="w-5 h-5 text-accent" />
                                    <h3 className="text-xl font-serif font-bold">Accuracy vs Experts</h3>
                                </div>
                                <div className="text-sm text-muted-foreground">Last 5 Months</div>
                            </div>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={accuracyData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                        <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
                                            contentStyle={{ backgroundColor: 'hsl(222, 30%, 12%)', border: '1px solid hsl(222, 20%, 18%)', borderRadius: '8px' }}
                                        />
                                        <Bar dataKey="accuracy" fill="#D4AF37" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="glass p-8 rounded-2xl border border-border/50">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-2">
                                    <History className="w-5 h-5 text-accent" />
                                    <h3 className="text-xl font-serif font-bold">Recent Activity</h3>
                                </div>
                                <Button variant="ghost" size="sm" className="text-accent">View All</Button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { type: 'vote', target: 'Michael Jordan', time: '2 hours ago', points: '+15' },
                                    { type: 'debate', target: 'Jordan vs Messi', time: '5 hours ago', points: '+25' },
                                    { type: 'badge', target: 'Analyst Badge', time: '1 day ago', points: '+100' },
                                ].map((act, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/5 transition-colors border border-transparent hover:border-border/50">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                {act.type === 'vote' ? <Vote className="w-5 h-5 text-accent" /> :
                                                    act.type === 'debate' ? <MessageSquare className="w-5 h-5 text-accent" /> :
                                                        <Award className="w-5 h-5 text-accent" />}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">
                                                    {act.type === 'vote' ? 'Voted for ' : act.type === 'debate' ? 'Joined debate ' : 'Unlocked '}
                                                    <span className="text-accent">{act.target}</span>
                                                </div>
                                                <div className="text-xs text-muted-foreground">{act.time}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-accent">{act.points} pts</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Stats */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Contribution Progress */}
                        <div className="glass p-8 rounded-2xl border border-accent/20 gold-glow">
                            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-accent" />
                                Contribution
                            </h3>
                            <div className="text-center mb-8">
                                <div className="text-5xl font-serif font-bold gold-text mb-2">
                                    <AnimatedCounter value={user.contributionPoints} />
                                </div>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Points</div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-muted-foreground">Next Level: 2000 pts</span>
                                    <span className="text-accent">750 pts to go</span>
                                </div>
                                <Progress value={62.5} className="h-2" />
                            </div>
                        </div>

                        {/* Badges System */}
                        <div className="glass p-8 rounded-2xl border border-border/50">
                            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                <Award className="w-5 h-5 text-accent" />
                                Badges
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {user.badges.map((badge) => (
                                    <div key={badge.id} className="text-center p-4 rounded-xl bg-secondary/30 border border-border/50 group hover:border-accent/50 transition-all">
                                        <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{badge.icon}</div>
                                        <div className="text-xs font-bold mb-1">{badge.name}</div>
                                        <div className="text-[8px] text-muted-foreground uppercase tracking-tighter">{badge.description}</div>
                                    </div>
                                ))}
                                <div className="text-center p-4 rounded-xl border border-dashed border-border opacity-40">
                                    <div className="text-3xl mb-2">🔒</div>
                                    <div className="text-xs font-bold mb-1">Locked</div>
                                </div>
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="glass p-8 rounded-2xl border border-border/50">
                            <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                                <PieChartIcon className="w-5 h-5 text-accent" />
                                Interests
                            </h3>
                            <div className="h-[200px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {categoryData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 space-y-2">
                                {categoryData.map((cat) => (
                                    <div key={cat.name} className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span className="text-muted-foreground">{cat.name}</span>
                                        </div>
                                        <span className="font-bold">{cat.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
