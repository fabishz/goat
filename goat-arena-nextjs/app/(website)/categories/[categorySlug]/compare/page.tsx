"use client";

import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    GitCompare, X, Crown, Trophy,
    ArrowLeftRight, Sparkles, Share2, Zap
} from 'lucide-react';
import { ComparisonRadarChart } from '@/components/charts/ComparisonRadarChart';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { goats } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import NextImage from 'next/image';

export default function Compare() {
    const params = useParams();
    const categorySlug = params?.categorySlug as string;
    const { compareGoats, removeFromCompare, clearCompare, addToCompare } = useAppStore();

    const goat1 = compareGoats[0];
    const goat2 = compareGoats[1];

    const getStatComparison = (stat1: number, stat2: number) => {
        if (stat1 > stat2) return { winner: 1, diff: stat1 - stat2 };
        if (stat2 > stat1) return { winner: 2, diff: stat2 - stat1 };
        return { winner: 0, diff: 0 };
    };

    const stats = [
        { label: 'Achievements', key: 'achievements' as const },
        { label: 'Influence', key: 'influence' as const },
        { label: 'Awards', key: 'awards' as const },
        { label: 'Longevity', key: 'longevity' as const },
        { label: 'Impact', key: 'impact' as const },
        { label: 'Legacy', key: 'legacy' as const },
    ];

    const suggestedGoats = goats.filter(g => g.categoryId === categorySlug && !compareGoats.some(cg => cg.id === g.id)).slice(0, 4);

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-16">
                        <div className="flex items-center justify-center gap-2 text-accent mb-4">
                            <GitCompare className="w-6 h-6" />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]">The Laboratory</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                            Deep <span className="gold-text">Analysis</span> Engine
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Compare legends across every dimension. Our AI-powered engine analyzes decades of data to provide the definitive verdict.
                        </p>
                    </div>
                </FadeIn>

                {/* Comparison Slots */}
                <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 mb-16 items-center">
                    {/* Slot 1 */}
                    <div className="lg:col-span-5">
                        {goat1 ? (
                            <motion.div
                                layoutId={`goat-${goat1.id}`}
                                className="glass rounded-[2.5rem] border-2 border-accent/30 overflow-hidden gold-glow relative group"
                            >
                                <div className="relative aspect-[16/9]">
                                    <NextImage src={goat1.image} alt={goat1.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <button
                                        onClick={() => removeFromCompare(goat1.id)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors z-20"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-6 left-8">
                                        <div className="text-xs font-bold uppercase tracking-widest text-accent mb-1">{goat1.subdomain}</div>
                                        <h3 className="text-3xl font-serif font-bold text-white">{goat1.name}</h3>
                                    </div>
                                </div>
                                <div className="p-8 text-center bg-accent/5">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Overall Score</div>
                                    <div className="text-5xl font-serif font-bold gold-text">
                                        <AnimatedCounter value={goat1.overallScore} decimals={1} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[300px] rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center group hover:border-accent/50 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Crown className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-2">Select First GOAT</h3>
                                <p className="text-sm text-muted-foreground mb-6">Choose a legend to begin the analysis</p>
                                <Link href="/categories">
                                    <Button variant="outline" className="rounded-full">Browse Rankings</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* VS */}
                    <div className="lg:col-span-1 flex justify-center">
                        <div className="w-16 h-16 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-serif font-bold text-2xl gold-glow">
                            VS
                        </div>
                    </div>

                    {/* Slot 2 */}
                    <div className="lg:col-span-5">
                        {goat2 ? (
                            <motion.div
                                layoutId={`goat-${goat2.id}`}
                                className="glass rounded-[2.5rem] border-2 border-blue-500/30 overflow-hidden relative group"
                            >
                                <div className="relative aspect-[16/9]">
                                    <NextImage src={goat2.image} alt={goat2.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <button
                                        onClick={() => removeFromCompare(goat2.id)}
                                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors z-20"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                    <div className="absolute bottom-6 left-8">
                                        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-1">{goat2.subdomain}</div>
                                        <h3 className="text-3xl font-serif font-bold text-white">{goat2.name}</h3>
                                    </div>
                                </div>
                                <div className="p-8 text-center bg-blue-500/5">
                                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-1">Overall Score</div>
                                    <div className="text-5xl font-serif font-bold text-blue-400">
                                        <AnimatedCounter value={goat2.overallScore} decimals={1} />
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[300px] rounded-[2.5rem] border-2 border-dashed border-border flex flex-col items-center justify-center p-8 text-center group hover:border-blue-500/50 transition-colors">
                                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Trophy className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-xl font-serif font-bold mb-2">Select Second GOAT</h3>
                                <p className="text-sm text-muted-foreground mb-6">Add a challenger to compare</p>
                                <Link href="/categories">
                                    <Button variant="outline" className="rounded-full">Browse Rankings</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {goat1 && goat2 ? (
                    <div className="space-y-12">
                        {/* AI Verdict */}
                        <FadeIn>
                            <div className="glass p-10 rounded-[3rem] border border-accent/20 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Sparkles className="w-24 h-24 text-accent" />
                                </div>
                                <div className="flex items-center gap-2 mb-6">
                                    <Sparkles className="w-6 h-6 text-accent" />
                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-accent">AI-Generated Verdict</h3>
                                </div>
                                <div className="flex flex-col md:flex-row gap-8 items-center">
                                    <div className="flex-1">
                                        <p className="text-2xl font-serif italic leading-relaxed text-foreground/90">
                                            &quot;While {goat2.name} shows superior {goat2.stats.longevity > goat1.stats.longevity ? 'longevity' : 'impact'},
                                            {goat1.name}&apos;s peak dominance and {goat1.stats.legacy > goat2.stats.legacy ? 'legacy' : 'achievements'}
                                            give them the edge in this definitive comparison. The data suggests a {Math.abs(goat1.overallScore - goat2.overallScore).toFixed(1)}%
                                            performance delta.&quot;
                                        </p>
                                    </div>
                                    <div className="shrink-0 text-center px-8 py-6 bg-accent/10 rounded-3xl border border-accent/20">
                                        <div className="text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Projected Winner</div>
                                        <div className="text-3xl font-serif font-bold">{goat1.overallScore > goat2.overallScore ? goat1.name : goat2.name}</div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        {/* Visual Comparison */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="glass p-8 rounded-3xl border border-border/50">
                                <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-accent" />
                                    Skill Overlay
                                </h3>
                                <ComparisonRadarChart
                                    stats1={goat1.stats}
                                    stats2={goat2.stats}
                                    name1={goat1.name}
                                    name2={goat2.name}
                                />
                            </div>

                            <div className="glass p-8 rounded-3xl border border-border/50">
                                <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-2">
                                    <ArrowLeftRight className="w-5 h-5 text-accent" />
                                    Metric Breakdown
                                </h3>
                                <div className="space-y-6">
                                    {stats.map((stat) => {
                                        const comp = getStatComparison(goat1.stats[stat.key], goat2.stats[stat.key]);
                                        return (
                                            <div key={stat.key} className="space-y-2">
                                                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                                                    <span>{goat1.name.split(' ')[1] || goat1.name}</span>
                                                    <span>{stat.label}</span>
                                                    <span>{goat2.name.split(' ')[1] || goat2.name}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={cn("text-sm font-bold w-8 text-right", comp.winner === 1 && "text-accent")}>{goat1.stats[stat.key]}</span>
                                                    <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden flex">
                                                        <div
                                                            className="h-full bg-accent"
                                                            style={{ width: `${(goat1.stats[stat.key] / (goat1.stats[stat.key] + goat2.stats[stat.key])) * 100}%` }}
                                                        />
                                                        <div
                                                            className="h-full bg-blue-500"
                                                            style={{ width: `${(goat2.stats[stat.key] / (goat1.stats[stat.key] + goat2.stats[stat.key])) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className={cn("text-sm font-bold w-8", comp.winner === 2 && "text-blue-400")}>{goat2.stats[stat.key]}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Share & Actions */}
                        <div className="flex flex-wrap justify-center gap-4 pt-8">
                            <Button size="lg" className="bg-accent text-accent-foreground gold-glow px-8 rounded-full font-bold">
                                <Share2 className="w-5 h-5 mr-2" /> Share Comparison
                            </Button>
                            <Button size="lg" variant="outline" onClick={clearCompare} className="rounded-full px-8">
                                Clear & Start Over
                            </Button>
                        </div>
                    </div>
                ) : (
                    <FadeIn delay={0.2}>
                        <div className="glass p-10 rounded-[3rem] border border-border/50">
                            <h3 className="text-2xl font-serif font-bold mb-8">Suggested Comparisons</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                {suggestedGoats.map((goat) => (
                                    <button
                                        key={goat.id}
                                        onClick={() => addToCompare(goat)}
                                        className="group p-6 rounded-3xl bg-secondary/30 border border-transparent hover:border-accent/30 transition-all text-center"
                                    >
                                        <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border group-hover:border-accent/50 transition-all">
                                            <NextImage src={goat.image} alt={goat.name} fill className="object-cover" />
                                        </div>
                                        <div className="font-bold text-sm">{goat.name}</div>
                                        <div className="text-[10px] text-muted-foreground uppercase font-bold">{goat.subdomain}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
