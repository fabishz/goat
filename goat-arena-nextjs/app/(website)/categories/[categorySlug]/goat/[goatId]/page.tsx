"use client";

import { useParams } from 'next/navigation';
import Link from 'next/link';

import {
    MapPin, Calendar, Users, Award, TrendingUp,
    ChevronRight, MessageSquare, ArrowLeft,
    Info, History, Zap, ShieldCheck, BarChart3
} from 'lucide-react';
import { RadarChart } from '@/components/charts/RadarChart';
import { HistoricalRankingsChart } from '@/components/charts/HistoricalRankingsChart';
import { ExpertFanComparison } from '@/components/charts/ExpertFanComparison';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { goats, experts, debates } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';

import NextImage from 'next/image';
import { AuthActionGate } from '@/components/auth/AuthActionGate';

export default function GoatProfile() {
    const params = useParams();
    const goatId = params?.goatId as string;
    const categorySlug = params?.categorySlug as string;
    const { addToCompare, compareGoats } = useAppStore();

    const goat = goats.find(g => String(g.id) === String(goatId));

    // Redirect or show error if goat doesn't belong to this category
    if (goat && goat.categoryId !== categorySlug) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="font-serif text-4xl mb-4">Invalid Category</h1>
                <p className="text-muted-foreground mb-8">This GOAT does not belong to the {categorySlug} category.</p>
                <Link href={`/categories/${categorySlug}`}>
                    <Button>Back to {categorySlug} Rankings</Button>
                </Link>
            </div>
        );
    }

    if (!goat) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="font-serif text-4xl mb-4">GOAT Not Found</h1>
                <p className="text-muted-foreground mb-8">We couldn&apos;t find the GOAT you&apos;re looking for (ID: {goatId})</p>
                <Link href={`/categories/${categorySlug}`}>
                    <Button>Back to Rankings</Button>
                </Link>
            </div>
        );
    }

    const isInCompare = compareGoats.some(g => g.id === goat.id);
    const goatDebates = debates.filter(d => d.goat1.id === goat.id || d.goat2.id === goat.id);

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Section */}
            <section className="relative pt-8 pb-12 overflow-hidden">
                <div className="absolute inset-0 h-[600px]">
                    <div
                        className="absolute inset-0 bg-cover bg-center opacity-10"
                        style={{ backgroundImage: `url(${goat.image})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/80 to-background" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <Link href={`/categories/${categorySlug}`}>
                        <Button variant="ghost" size="sm" className="mb-8 text-muted-foreground hover:text-accent">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to {categorySlug.toUpperCase()} Rankings
                        </Button>
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left: Profile Image & Core Stats */}
                        <div className="lg:col-span-4 space-y-8">
                            <FadeIn>
                                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border-4 border-accent/20 gold-glow">
                                    <NextImage src={goat.image} alt={goat.name} fill className="object-cover" priority />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                    <div className="absolute top-4 left-4 glass px-3 py-2 rounded-lg">
                                        <div className="text-2xl font-serif font-bold gold-text">#{goat.rank}</div>
                                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">{categorySlug.toUpperCase()} Rank</div>
                                    </div>

                                    {goat.trending && (
                                        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            TRENDING
                                        </div>
                                    )}

                                    <div className="absolute bottom-6 left-6 right-6">
                                        <div className="text-xs font-bold uppercase tracking-[0.2em] text-accent mb-1">Overall Score</div>
                                        <div className="text-6xl font-serif font-bold text-white leading-none">
                                            <AnimatedCounter value={goat.overallScore} decimals={1} />
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="glass p-4 rounded-xl border border-border/50">
                                    <Users className="w-5 h-5 text-accent mb-2" />
                                    <div className="text-xl font-bold">{(goat.fanVotes / 1000000).toFixed(1)}M</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Fan Votes</div>
                                </div>
                                <div className="glass p-4 rounded-xl border border-border/50">
                                    <ShieldCheck className="w-5 h-5 text-accent mb-2" />
                                    <div className="text-xl font-bold">{goat.expertVotes.toLocaleString()}</div>
                                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Expert Score</div>
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 gold-glow"
                                onClick={() => addToCompare(goat)}
                                disabled={isInCompare || compareGoats.length >= 2}
                            >
                                {isInCompare ? '✓ Added to Comparison' : 'Add to Comparison'}
                            </Button>
                        </div>

                        {/* Right: Detailed Info & Tabs */}
                        <div className="lg:col-span-8">
                            <FadeIn delay={0.1}>
                                <div className="mb-8">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-bold uppercase tracking-wider">
                                            {categorySlug.toUpperCase()}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <MapPin className="w-4 h-4" /> {goat.country}
                                        </span>
                                        <span className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Calendar className="w-4 h-4" /> {goat.era.join(', ')}
                                        </span>
                                    </div>
                                    <h1 className="text-6xl md:text-7xl font-serif font-bold mb-4">{goat.name}</h1>
                                    <p className="text-2xl text-accent italic font-serif mb-6">&quot;{goat.nickname}&quot;</p>
                                    <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                        {goat.bio}
                                    </p>
                                </div>

                                <Tabs defaultValue="overview" className="w-full">
                                    <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none h-12 p-0 mb-8 overflow-x-auto">
                                        <TabsTrigger value="overview" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 font-bold uppercase tracking-wider text-xs">Overview</TabsTrigger>
                                        <TabsTrigger value="achievements" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 font-bold uppercase tracking-wider text-xs">Achievements</TabsTrigger>
                                        <TabsTrigger value="influence" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 font-bold uppercase tracking-wider text-xs">Influence</TabsTrigger>
                                        <TabsTrigger value="debate" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 font-bold uppercase tracking-wider text-xs">Debates</TabsTrigger>
                                        <TabsTrigger value="history" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-6 font-bold uppercase tracking-wider text-xs">History</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="overview" className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="glass p-6 rounded-xl border border-border/50">
                                                <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                                                    <Zap className="w-5 h-5 text-accent" />
                                                    Performance Metrics
                                                </h3>
                                                <RadarChart stats={goat.stats} />
                                            </div>
                                            <div className="glass p-6 rounded-xl border border-border/50">
                                                <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                                                    <BarChart3 className="w-5 h-5 text-accent" />
                                                    Consensus Breakdown
                                                </h3>
                                                <ExpertFanComparison expertScore={88} fanScore={94} />
                                                <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/10">
                                                    <div className="flex items-start gap-3">
                                                        <Info className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                                        <p className="text-sm text-muted-foreground">
                                                            <span className="text-accent font-bold">Era-Normalized Score:</span> This score is adjusted to account for the competitive density and global reach of the {goat.era[0]} era.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="achievements">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {goat.achievements.map((ach, i) => (
                                                <div key={i} className="flex items-center gap-4 p-4 glass rounded-xl border border-border/50">
                                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                                        <Award className="w-5 h-5" />
                                                    </div>
                                                    <span className="font-bold">{ach}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="influence">
                                        <div className="space-y-6">
                                            <div className="glass p-8 rounded-xl border border-border/50">
                                                <h3 className="text-2xl font-serif font-bold mb-4">Cultural Impact</h3>
                                                <p className="text-muted-foreground leading-relaxed mb-6">
                                                    {goat.name} transcends {goat.subdomain}. Their influence on global culture, fashion, and the next generation of athletes is immeasurable.
                                                </p>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold gold-text">10/10</div>
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Global Reach</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold gold-text">High</div>
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Era Dominance</div>
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-3xl font-bold gold-text">Infinite</div>
                                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Legacy Score</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="debate">
                                        <div className="space-y-4">
                                            {goatDebates.length > 0 ? (
                                                goatDebates.map(debate => (
                                                    <Link key={debate.id} href={`/categories/${categorySlug}/debates/${debate.id}`}>
                                                        <div className="glass p-6 rounded-xl border border-border/50 hover:border-accent/50 transition-all group">
                                                            <div className="flex justify-between items-center">
                                                                <div>
                                                                    <h4 className="text-xl font-serif font-bold group-hover:text-accent transition-colors">{debate.title}</h4>
                                                                    <p className="text-sm text-muted-foreground mt-1">{debate.comments} active arguments</p>
                                                                </div>
                                                                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-accent" />
                                                            </div>
                                                        </div>
                                                    </Link>
                                                ))
                                            ) : (
                                                <div className="text-center py-12 glass rounded-xl border border-dashed border-border">
                                                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                                                    <p className="text-muted-foreground">No active debates for this GOAT yet.</p>
                                                    <AuthActionGate actionName="to start a debate">
                                                        <Button variant="outline" className="mt-4">Start a Debate</Button>
                                                    </AuthActionGate>
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="history">
                                        <div className="glass p-6 rounded-xl border border-border/50">
                                            <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                                                <History className="w-5 h-5 text-accent" />
                                                Historical Ranking Movement
                                            </h3>
                                            {goat.historicalRankings ? (
                                                <HistoricalRankingsChart data={goat.historicalRankings} />
                                            ) : (
                                                <div className="h-[300px] flex items-center justify-center text-muted-foreground italic">
                                                    Historical data being compiled...
                                                </div>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expert Commentary Section */}
            <section className="py-20 bg-accent/5 border-y border-accent/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="relative w-48 h-48 shrink-0">
                                <div className="absolute inset-0 rounded-full border-4 border-accent/20 gold-glow" />
                                <NextImage
                                    src={experts[0].avatar}
                                    alt={experts[0].name}
                                    fill
                                    className="rounded-full object-cover p-2"
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Award className="w-5 h-5 text-accent" />
                                    <span className="text-sm font-bold uppercase tracking-widest text-accent">Expert Verdict</span>
                                </div>
                                <blockquote className="text-2xl font-serif italic mb-6 leading-relaxed">
                                    &quot;{goat.name} represents the absolute pinnacle of human achievement in {goat.subdomain}.
                                    Beyond the statistics, it was the way they redefined the boundaries of what was possible that
                                    cements their status as the definitive GOAT.&quot;
                                </blockquote>
                                <div>
                                    <div className="font-bold text-lg">{experts[0].name}</div>
                                    <div className="text-muted-foreground">{experts[0].title}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
