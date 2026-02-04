"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Calendar, ArrowRight, TrendingUp, Search } from 'lucide-react';
import { debates } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import NextImage from 'next/image';
import Link from 'next/link';

export default function DebatesPage() {
    const [userDebates, setUserDebates] = useState<{
        id: string;
        title: string;
        comments: number;
        participationDate: string;
        goat1: { image: string; name: string; categoryId: string };
        goat2: { image: string; name: string };
        userArgument: { content: string; upvotes: number; downvotes: number };
    }[]>([]);

    useEffect(() => {
        const data = debates.map((debate, i) => ({
            ...debate,
            userArgument: debate.arguments[0],
            participationDate: new Date(Date.now() - i * 86400000 * 3).toLocaleDateString(),
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserDebates(data);
    }, []);

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold mb-2">My <span className="gold-text">Debates</span></h1>
                    <p className="text-muted-foreground text-lg">Your contributions to the greatest discussions in history.</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input placeholder="Search debates..." className="pl-10 bg-card/50 border-border/50" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {userDebates.map((debate, index) => (
                    <motion.div
                        key={debate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-2xl border border-border/50 overflow-hidden hover:border-accent/30 transition-all"
                    >
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-6 mb-6">
                                <div className="flex -space-x-4">
                                    <div className="relative w-16 h-16 rounded-full border-2 border-background overflow-hidden z-10">
                                        <NextImage src={debate.goat1.image} alt={debate.goat1.name} fill className="object-cover" />
                                    </div>
                                    <div className="relative w-16 h-16 rounded-full border-2 border-background overflow-hidden">
                                        <NextImage src={debate.goat2.image} alt={debate.goat2.name} fill className="object-cover" />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2 text-accent text-[10px] font-bold uppercase tracking-widest mb-1">
                                        <TrendingUp className="w-3 h-3" />
                                        Trending Debate
                                    </div>
                                    <h3 className="text-xl font-serif font-bold mb-1">{debate.title}</h3>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <MessageSquare className="w-3 h-3" />
                                            {debate.comments} comments
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            Joined {debate.participationDate}
                                        </span>
                                    </div>
                                </div>

                                <Link href={`/categories/${debate.goat1.categoryId}/debates`}>
                                    <Button variant="outline" size="sm" className="border-border/50 hover:border-accent">
                                        View Full Debate
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>

                            <div className="bg-accent/5 rounded-xl p-4 border border-accent/10">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                                        You
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-wider">Your Argument</span>
                                </div>
                                <p className="text-sm italic text-foreground/80 mb-4">
                                    &quot;{debate.userArgument.content}&quot;
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        {debate.userArgument.upvotes}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-500">
                                        <ThumbsDown className="w-3.5 h-3.5" />
                                        {debate.userArgument.downvotes}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {userDebates.length === 0 && (
                <div className="text-center py-20 glass rounded-3xl border border-dashed border-border/50">
                    <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-serif font-bold mb-2">No debates yet</h3>
                    <p className="text-muted-foreground mb-8">Join the conversation and share your expert takes.</p>
                    <Link href="/categories">
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                            Find a Debate
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
