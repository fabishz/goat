"use client";

import { motion } from 'framer-motion';
import { Vote, Calendar, TrendingUp, Award, ChevronRight, Search, Filter } from 'lucide-react';
import { goats } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';
import Link from 'next/link';

export default function VotesPage() {
    // Simulate user's voted goats
    const votedGoats = goats.slice(0, 5).map((goat, i) => ({
        ...goat,
        votedAt: new Date(Date.now() - i * 86400000 * 2).toLocaleDateString(),
        impact: (Math.random() * 5 + 1).toFixed(1),
    }));

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">My <span className="gold-text">Votes</span></h1>
                    <p className="text-muted-foreground text-lg">Track your influence and voting history across the arena.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search your votes..." className="pl-10 bg-card/50 border-border/50" />
                    </div>
                    <Button variant="outline" size="icon" className="border-border/50">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {votedGoats.map((goat, index) => (
                    <motion.div
                        key={goat.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass p-6 rounded-2xl border border-border/50 hover:border-accent/30 transition-all group"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-accent/20">
                                <NextImage src={goat.image} alt={goat.name} fill className="object-cover" />
                            </div>

                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <h3 className="text-xl font-serif font-bold">{goat.name}</h3>
                                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] font-bold uppercase rounded-full border border-accent/20">
                                        {goat.subdomain}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-4 h-4" />
                                        <span>Voted on {goat.votedAt}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4 text-green-500" />
                                        <span>Impact: +{goat.impact} pts</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <div className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Current Rank</div>
                                    <div className="text-2xl font-serif font-bold gold-text">#{goat.rank}</div>
                                </div>
                                <Link href={`/categories/${goat.categoryId}/goat/${goat.id}`}>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent/10 hover:text-accent">
                                        <ChevronRight className="w-5 h-5" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {votedGoats.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl border border-dashed border-border/50">
                    <Vote className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">No votes yet</h3>
                    <p className="text-muted-foreground mb-8">Start influencing the rankings by casting your first vote.</p>
                    <Link href="/categories">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                            Explore Categories
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
