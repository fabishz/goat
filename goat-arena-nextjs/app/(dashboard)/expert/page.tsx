"use client";

import { motion } from 'framer-motion';
import { Star, MessageSquare, Award, TrendingUp, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExpertDashboardPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
                        <Award className="w-4 h-4" />
                        Expert Council
                    </div>
                    <h1 className="text-4xl font-serif font-bold mb-2">Expert <span className="gold-text">Hub</span></h1>
                    <p className="text-muted-foreground text-lg">Your expert takes shape the history of the Arena.</p>
                </div>
                <div className="flex gap-4">
                    <div className="text-right">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Expert Rank</div>
                        <div className="text-2xl font-serif font-bold gold-text">#14 Global</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="glass p-8 rounded-3xl border border-accent/20 gold-glow flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                        <Star className="w-8 h-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">Expert Voting</h3>
                    <p className="text-sm text-muted-foreground mb-6">Cast your high-weight votes on trending GOAT battles.</p>
                    <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                        Start Voting
                    </Button>
                </div>

                <div className="glass p-8 rounded-3xl border border-border/50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                        <MessageSquare className="w-8 h-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">Moderate Debates</h3>
                    <p className="text-sm text-muted-foreground mb-6">Review reported arguments and maintain Arena standards.</p>
                    <Button variant="outline" className="w-full border-border/50">
                        Open Queue
                    </Button>
                </div>

                <div className="glass p-8 rounded-3xl border border-border/50 flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                        <TrendingUp className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2">Impact Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-6">See how your expert takes have influenced the rankings.</p>
                    <Button variant="outline" className="w-full border-border/50">
                        View Analytics
                    </Button>
                </div>
            </div>

            <div className="glass p-8 rounded-3xl border border-border/50">
                <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-accent" />
                    Pending Expert Actions
                </h3>

                <div className="space-y-4">
                    {[
                        { title: 'Verify Era Data: 90s NBA', type: 'Data Verification', priority: 'High' },
                        { title: 'Moderate Debate: Messi vs Ronaldo', type: 'Moderation', priority: 'Medium' },
                        { title: 'Expert Verdict: Greatest Rap Album', type: 'Voting', priority: 'High' },
                    ].map((action, i) => (
                        <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-secondary/30 border border-border/50 group hover:border-accent/30 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${action.priority === 'High' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                                <div>
                                    <div className="font-bold text-sm mb-0.5">{action.title}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">{action.type}</div>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-accent group-hover:translate-x-1 transition-transform">
                                Take Action
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
