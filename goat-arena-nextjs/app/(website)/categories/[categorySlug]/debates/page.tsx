"use client";


import { useParams } from 'next/navigation';
import { MessageSquare, TrendingUp, Trophy, Users, Search, Filter } from 'lucide-react';
import { DebateCard } from '@/components/cards/DebateCard';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useDebates, useTrendingDebates } from '@/hooks/use-debates';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import NextImage from 'next/image';
import { AuthActionGate } from '@/components/auth/AuthActionGate';
import { useCategory } from '@/hooks/use-categories';

export default function DebatesPage() {
    const params = useParams();
    const categorySlug = params?.categorySlug as string;
    const { data: category } = useCategory(categorySlug);
    const categoryId = category?.id;
    const { data: allDebates, isLoading: debatesLoading } = useDebates(categoryId);
    const { data: trendingDebates, isLoading: trendingLoading } = useTrendingDebates(categoryId);

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                            The <span className="gold-text">Debate</span> Center
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                            Join the world&apos;s most passionate arguments. Defend your GOAT, challenge the consensus, and earn influence.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-border/50">
                                <Users className="w-4 h-4 text-accent" />
                                <span className="text-sm font-bold">12.4K Active Debaters</span>
                            </div>
                            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full border border-border/50">
                                <MessageSquare className="w-4 h-4 text-accent" />
                                <span className="text-sm font-bold">850+ Arguments Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Trending Debates */}
                        <section>
                            <div className="flex items-center gap-2 mb-8">
                                <TrendingUp className="w-6 h-6 text-accent" />
                                <h2 className="text-3xl font-serif font-bold">Trending Now</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trendingLoading ? (
                                    [1, 2].map(i => <SkeletonCard key={i} />)
                                ) : (
                                    trendingDebates?.map((debate, index) => (
                                        <DebateCard key={debate.id} debate={debate} index={index} />
                                    ))
                                )}
                            </div>
                        </section>

                        {/* All Debates with Search/Filters */}
                        <section>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                                <h2 className="text-3xl font-serif font-bold">All Debates</h2>
                                <div className="flex gap-4 flex-1 max-w-md">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input placeholder="Search debates..." className="pl-10 bg-secondary/50 border-border" />
                                    </div>
                                    <Button variant="outline" size="icon">
                                        <Filter className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {debatesLoading ? (
                                    [1, 2, 3].map(i => <div key={i} className="h-32 w-full bg-card/50 animate-pulse rounded-xl" />)
                                ) : (
                                    allDebates?.map((debate, index) => (
                                        <DebateCard key={debate.id} debate={debate} index={index} />
                                    ))
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* Debate Leaderboard */}
                        <section className="glass p-6 rounded-2xl border border-border/50">
                            <div className="flex items-center gap-2 mb-6">
                                <Trophy className="w-5 h-5 text-accent" />
                                <h3 className="text-xl font-serif font-bold">Top Contributors</h3>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { name: 'AnalystPrime', points: 2450, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1' },
                                    { name: 'HistoryBuff', points: 1820, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2' },
                                    { name: 'GoatWatcher', points: 1650, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3' },
                                    { name: 'StatKing', points: 1420, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4' },
                                    { name: 'DebateMaster', points: 1280, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5' },
                                ].map((contributor, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-muted-foreground w-4">{i + 1}</span>
                                            <NextImage src={contributor.avatar} alt={contributor.name} width={32} height={32} className="rounded-full bg-secondary" />
                                            <span className="font-medium text-sm">{contributor.name}</span>
                                        </div>
                                        <div className="text-xs font-bold text-accent">{contributor.points} pts</div>
                                    </div>
                                ))}
                            </div>

                            <Button variant="ghost" className="w-full mt-6 text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-accent">
                                View Full Leaderboard
                            </Button>
                        </section>

                        {/* Start a Debate CTA */}
                        <section className="bg-accent p-8 rounded-2xl gold-glow text-accent-foreground">
                            <h3 className="text-2xl font-serif font-bold mb-4">Have a better argument?</h3>
                            <p className="text-sm opacity-90 mb-6 leading-relaxed">
                                Create a new debate between any two GOATs and let the community decide who truly reigns supreme.
                            </p>
                            <AuthActionGate actionName="to start a debate">
                                <Button className="w-full bg-white text-accent hover:bg-white/90 font-bold">
                                    Start New Debate
                                </Button>
                            </AuthActionGate>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
