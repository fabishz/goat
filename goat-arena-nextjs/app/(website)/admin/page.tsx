"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, Users, AlertTriangle,
    CheckCircle, XCircle, BarChart3,
    Search, Filter, ExternalLink,
    Clock, Database, ShieldAlert
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState('submissions');

    const stats = [
        { label: 'Total Votes', value: '1.2M', change: '+12%', icon: BarChart3 },
        { label: 'Active Users', value: '45.2K', change: '+5%', icon: Users },
        { label: 'Pending Submissions', value: '124', change: '-8%', icon: Clock },
        { label: 'Flagged Content', value: '18', change: '+2', icon: ShieldAlert },
    ];

    const submissions = [
        { id: '1', name: 'Zinedine Zidane', domain: 'Sports', subdomain: 'Football', submittedBy: 'AnalystPrime', date: '2 hours ago', status: 'pending' },
        { id: '2', name: 'Freddie Mercury', domain: 'Music', subdomain: 'Rock', submittedBy: 'RockFan99', date: '5 hours ago', status: 'pending' },
        { id: '3', name: 'Albert Einstein', domain: 'Science', subdomain: 'Physics', submittedBy: 'HistoryBuff', date: '1 day ago', status: 'pending' },
    ];

    const flagged = [
        { id: '1', type: 'Argument', content: 'This stat is completely fabricated...', user: 'TrollHunter', reason: 'Misinformation', date: '10 mins ago' },
        { id: '2', type: 'Comment', content: 'Jordan is mid, LeBron is better...', user: 'LeBronStan', reason: 'Harassment', date: '1 hour ago' },
    ];

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="container mx-auto px-4">
                {/* Admin Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-accent mb-2">
                            <Shield className="w-5 h-5" />
                            <span className="text-sm font-bold uppercase tracking-widest">Command Center</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold">Platform <span className="gold-text">Administration</span></h1>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="border-border">Export Data</Button>
                        <Button className="bg-accent text-accent-foreground gold-glow">System Status</Button>
                    </div>
                </div>

                {/* Global Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="glass p-6 rounded-2xl border border-border/50">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                        <stat.icon className="w-5 h-5" />
                                    </div>
                                    <span className={cn(
                                        "text-xs font-bold px-2 py-1 rounded-full",
                                        stat.change.startsWith('+') ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    )}>{stat.change}</span>
                                </div>
                                <div className="text-3xl font-serif font-bold mb-1">{stat.value}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">{stat.label}</div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Main Admin Tabs */}
                <Tabs defaultValue="submissions" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-12 p-0 mb-8">
                        <TabsTrigger value="submissions" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-8 font-bold uppercase tracking-wider text-xs">Submission Queue</TabsTrigger>
                        <TabsTrigger value="moderation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-8 font-bold uppercase tracking-wider text-xs">Moderation</TabsTrigger>
                        <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-8 font-bold uppercase tracking-wider text-xs">Platform Analytics</TabsTrigger>
                        <TabsTrigger value="users" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-8 font-bold uppercase tracking-wider text-xs">User Management</TabsTrigger>
                    </TabsList>

                    <TabsContent value="submissions">
                        <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                            <div className="p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <h3 className="text-xl font-serif font-bold">Pending Nominations</h3>
                                <div className="flex gap-4 w-full md:w-auto">
                                    <div className="relative flex-1 md:w-64">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Search nominations..." className="pl-10 bg-secondary/30 border-border" />
                                    </div>
                                    <Button variant="outline" size="icon"><Filter className="w-4 h-4" /></Button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-secondary/30 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <tr>
                                            <th className="px-6 py-4 text-left">Candidate</th>
                                            <th className="px-6 py-4 text-left">Category</th>
                                            <th className="px-6 py-4 text-left">Submitted By</th>
                                            <th className="px-6 py-4 text-left">Date</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/50">
                                        {submissions.map((sub) => (
                                            <tr key={sub.id} className="hover:bg-accent/5 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-sm">{sub.name}</div>
                                                    <div className="text-[10px] text-muted-foreground uppercase">{sub.subdomain}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-medium px-2 py-1 bg-secondary rounded-full">{sub.domain}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium">{sub.submittedBy}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-muted-foreground">{sub.date}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="ghost" className="text-green-500 hover:text-green-600 hover:bg-green-500/10">
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost"><ExternalLink className="w-4 h-4" /></Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="moderation">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="glass rounded-2xl border border-border/50 overflow-hidden">
                                    <div className="p-6 border-b border-border/50">
                                        <h3 className="text-xl font-serif font-bold">Flagged Content</h3>
                                    </div>
                                    <div className="divide-y divide-border/50">
                                        {flagged.map((item) => (
                                            <div key={item.id} className="p-6 hover:bg-accent/5 transition-colors">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
                                                            <AlertTriangle className="w-4 h-4" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold">{item.type} by {item.user}</div>
                                                            <div className="text-[10px] text-red-500 uppercase font-bold">Reason: {item.reason}</div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{item.date}</span>
                                                </div>
                                                <p className="text-sm text-foreground/80 mb-4 bg-secondary/30 p-4 rounded-xl italic">
                                                    &quot;{item.content}&quot;
                                                </p>
                                                <div className="flex gap-3">
                                                    <Button size="sm" className="bg-red-500 text-white hover:bg-red-600">Remove Content</Button>
                                                    <Button size="sm" variant="outline">Dismiss Flag</Button>
                                                    <Button size="sm" variant="ghost" className="text-muted-foreground">Warn User</Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="glass p-6 rounded-2xl border border-border/50">
                                    <h3 className="text-lg font-serif font-bold mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-accent" />
                                        Moderation Tools
                                    </h3>
                                    <div className="space-y-3">
                                        <Button variant="outline" className="w-full justify-start h-12">
                                            <Database className="w-4 h-4 mr-3" /> Rebuild Search Index
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start h-12">
                                            <Users className="w-4 h-4 mr-3" /> Bulk User Actions
                                        </Button>
                                        <Button variant="outline" className="w-full justify-start h-12 text-red-500 hover:text-red-600 hover:bg-red-500/10">
                                            <ShieldAlert className="w-4 h-4 mr-3" /> Emergency Lockdown
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="analytics">
                        <div className="glass p-12 rounded-2xl border border-dashed border-border text-center">
                            <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                            <h3 className="text-2xl font-serif font-bold mb-2">Advanced Analytics</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                Detailed platform metrics, user retention cohorts, and category growth trends are being computed.
                            </p>
                            <Button className="mt-8 bg-accent text-accent-foreground">Generate Report</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
