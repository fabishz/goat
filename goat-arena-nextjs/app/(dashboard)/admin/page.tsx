"use client";


import { Shield, Users, Layers, BarChart3, Settings, AlertTriangle, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminDashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
                        <Shield className="w-4 h-4" />
                        System Administration
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Admin <span className="gold-text">Panel</span></h1>
                    <p className="text-muted-foreground text-lg">Manage the platform, categories, and user roles.</p>
                </div>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Category
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { label: 'Total Users', value: '12,450', icon: Users, color: 'text-blue-500' },
                    { label: 'Active Debates', value: '842', icon: BarChart3, color: 'text-green-500' },
                    { label: 'Categories', value: '12', icon: Layers, color: 'text-accent' },
                    { label: 'System Health', value: '99.9%', icon: Shield, color: 'text-purple-500' },
                ].map((stat, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-border/50">
                        <div className="flex items-center justify-between mb-4">
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Live</span>
                        </div>
                        <div className="text-3xl font-serif font-bold mb-1">{stat.value}</div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-serif font-bold">Recent User Activity</h3>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input placeholder="Search users..." className="pl-10 bg-background/55 border-border/50 h-10 text-xs" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl hover:bg-accent/5 transition-colors border border-transparent hover:border-border/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-xs">
                                            U{i}
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">User_{i}82</div>
                                            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Joined 2 hours ago</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase rounded-full border border-blue-500/20">
                                            Fan
                                        </span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            System Alerts
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20">
                                <div className="font-bold text-xs text-red-500 mb-1">High Traffic Warning</div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    Traffic increased by 400% in the NBA category due to a trending debate.
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                                <div className="font-bold text-xs text-accent mb-1">New Expert Application</div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed">
                                    3 new users applied for Expert status in the Music domain.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
