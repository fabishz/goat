"use client";

import { motion } from 'framer-motion';
import { Award, Star, Zap, ShieldCheck, MapPin, Calendar, Edit2, Share2, Crown } from 'lucide-react';
import { currentUser } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import NextImage from 'next/image';

export default function ProfilePage() {
    const user = currentUser;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Profile Header Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-3xl border border-border/50 overflow-hidden mb-8"
            >
                <div className="h-48 bg-gradient-to-r from-accent/20 via-primary/10 to-accent/20 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
                </div>

                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 mb-8">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-2xl border-4 border-background bg-card p-1 gold-glow overflow-hidden">
                                <NextImage src={user.avatar} alt={user.name} fill className="object-cover rounded-xl" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-lg bg-accent flex items-center justify-center border-2 border-background shadow-lg">
                                <Crown className="w-5 h-5 text-accent-foreground" />
                            </div>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h1 className="text-4xl font-serif font-bold mb-1">{user.name}</h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> Global Arena</span>
                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined Jan 2024</span>
                                <span className="text-accent font-bold uppercase tracking-widest text-[10px] bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
                                    Level {user.level} Pro
                                </span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="border-border/50">
                                <Edit2 className="w-4 h-4 mr-2" />
                                Edit Profile
                            </Button>
                            <Button variant="outline" size="icon" className="border-border/50">
                                <Share2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 text-center">
                            <div className="text-2xl font-serif font-bold gold-text mb-1">{user.contributionPoints}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Arena Points</div>
                        </div>
                        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 text-center">
                            <div className="text-2xl font-serif font-bold gold-text mb-1">{user.accuracyScore}%</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Accuracy</div>
                        </div>
                        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 text-center">
                            <div className="text-2xl font-serif font-bold gold-text mb-1">{user.votesCount}</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Votes Cast</div>
                        </div>
                        <div className="bg-accent/5 rounded-2xl p-4 border border-accent/10 text-center">
                            <div className="text-2xl font-serif font-bold gold-text mb-1">{user.influenceWeight}x</div>
                            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Influence</div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Progress & Bio */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                            <Star className="w-5 h-5 text-accent" />
                            Arena Progress
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                                    <span className="text-muted-foreground">Level {user.level}</span>
                                    <span className="text-accent">Level {user.level + 1}</span>
                                </div>
                                <Progress value={65} className="h-2" />
                                <p className="text-[10px] text-muted-foreground mt-2 text-center">
                                    750 points until next rank
                                </p>
                            </div>

                            <div className="pt-6 border-t border-border/50">
                                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">Bio</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Passionate sports and music historian. I've been following the GOAT debates for over a decade, focusing on statistical dominance and cultural impact.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-accent" />
                            Verifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-xl bg-green-500/5 border border-green-500/20">
                                <span className="text-xs font-bold">Email Verified</span>
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-xl bg-accent/5 border border-accent/20">
                                <span className="text-xs font-bold">Pro Member</span>
                                <Crown className="w-4 h-4 text-accent" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Achievements & DNA */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                            <Award className="w-5 h-5 text-accent" />
                            Hall of Fame
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {user.badges.map((badge) => (
                                <div key={badge.id} className="flex items-center gap-4 p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:border-accent/30 transition-all group">
                                    <div className="text-4xl group-hover:scale-110 transition-transform">{badge.icon}</div>
                                    <div>
                                        <div className="font-bold text-sm mb-0.5">{badge.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase tracking-tighter leading-tight">
                                            {badge.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-border/50">
                        <h3 className="text-xl font-serif font-bold mb-6 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-accent" />
                            GOAT DNA
                        </h3>
                        <div className="space-y-6">
                            {[
                                { label: 'Sports', value: 85, color: 'bg-accent' },
                                { label: 'Music', value: 65, color: 'bg-blue-500' },
                                { label: 'Science', value: 40, color: 'bg-green-500' },
                                { label: 'Culture', value: 55, color: 'bg-purple-500' },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span className="text-muted-foreground uppercase tracking-widest">{item.label}</span>
                                        <span className="text-foreground">{item.value}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.value}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className={`h-full ${item.color}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
