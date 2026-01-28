"use client";

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCategory } from '@/hooks/use-categories';
import { useGoats } from '@/hooks/use-goats';
import { GoatCard } from '@/components/cards/GoatCard';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { ChevronLeft, TrendingUp, Award, Users, Info } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/stores/app-store';
import { useEffect } from 'react';
import NextImage from 'next/image';

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const { setCurrentCategory } = useAppStore();

    const { data: category, isLoading: categoryLoading } = useCategory(categorySlug);
    const { data: categoryGoats, isLoading: goatsLoading } = useGoats(categorySlug);

    useEffect(() => {
        if (categorySlug) setCurrentCategory(categorySlug);
        return () => setCurrentCategory(null);
    }, [categorySlug, setCurrentCategory]);

    const topGoats = [...(categoryGoats || [])].sort((a, b) => b.overallScore - a.overallScore);
    const featuredGoats = topGoats.slice(0, 2);
    const remainingGoats = topGoats.slice(2);
    const trendingGoats = (categoryGoats || []).filter(g => g.trending);

    if (categoryLoading || goatsLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="h-48 w-full bg-card/50 rounded-2xl animate-pulse mb-8" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-serif font-bold mb-4">Category Not Found</h1>
                <Link href="/categories">
                    <Button variant="outline">Back to All Categories</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Category Hero */}
            <section className="relative py-20 overflow-hidden" style={{ backgroundColor: category.colorTheme + '10' }}>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
                <div className="container mx-auto px-4 relative z-10">
                    <Link href="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-accent mb-8 transition-colors">
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Back to Categories
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="text-4xl">{category.icon}</span>
                                <span className="text-sm font-bold uppercase tracking-widest text-accent" style={{ color: category.colorTheme }}>
                                    {category.name} GOAT Debate
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
                                {category.name} <span className="gold-text">Arena</span>
                            </h1>
                            <p className="text-xl text-muted-foreground max-w-2xl">
                                {category.description}
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="glass p-4 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl font-bold gold-text">{(categoryGoats || []).length}</div>
                                <div className="text-xs text-muted-foreground uppercase">GOATs Ranked</div>
                            </div>
                            <div className="glass p-4 rounded-xl text-center min-w-[120px]">
                                <div className="text-2xl font-bold text-accent">{trendingGoats.length}</div>
                                <div className="text-xs text-muted-foreground uppercase">Trending Now</div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Battle */}
                    {featuredGoats.length === 2 && (
                        <FadeIn delay={0.2}>
                            <div className="relative glass rounded-3xl p-8 md:p-12 overflow-hidden border-accent/20 gold-glow mb-16">
                                <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                                    {/* Goat 1 */}
                                    <div className="flex-1 text-center md:text-right">
                                        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:ml-auto mb-6 rounded-2xl overflow-hidden border-4 border-accent/20">
                                            <NextImage src={featuredGoats[0].image} alt={featuredGoats[0].name} fill className="object-cover" />
                                        </div>
                                        <h3 className="text-3xl font-serif font-bold mb-2">{featuredGoats[0].name}</h3>
                                        <div className="text-accent font-bold text-xl">{featuredGoats[0].overallScore}</div>
                                    </div>

                                    {/* VS Animation */}
                                    <div className="relative">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="text-6xl md:text-8xl font-serif font-black italic text-accent/20"
                                        >
                                            VS
                                        </motion.div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold text-2xl gold-glow">
                                                VS
                                            </div>
                                        </div>
                                    </div>

                                    {/* Goat 2 */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto md:mr-auto mb-6 rounded-2xl overflow-hidden border-4 border-accent/20">
                                            <NextImage src={featuredGoats[1].image} alt={featuredGoats[1].name} fill className="object-cover" />
                                        </div>
                                        <h3 className="text-3xl font-serif font-bold mb-2">{featuredGoats[1].name}</h3>
                                        <div className="text-accent font-bold text-xl">{featuredGoats[1].overallScore}</div>
                                    </div>
                                </div>

                                <div className="mt-12 text-center">
                                    <Link href={`/categories/${categorySlug}/compare?goatA=${featuredGoats[0].id}&goatB=${featuredGoats[1].id}`}>
                                        <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-12 h-14 text-lg font-bold gold-glow">
                                            VOTE NOW
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>
            </section>

            <div className="container mx-auto px-4">
                {/* Trending Section */}
                {trendingGoats.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-2 mb-8">
                            <TrendingUp className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-serif font-bold">Trending in {category.name}</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {trendingGoats.map((goat, index) => (
                                <GoatCard key={goat.id} goat={goat} index={index} />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Rankings */}
                <section>
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-accent" />
                            <h2 className="text-2xl font-serif font-bold">Definitive Rankings</h2>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                            <Info className="w-4 h-4" />
                            <span>Rankings updated daily based on expert & fan consensus</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {remainingGoats.map((goat, index) => (
                            <GoatCard key={goat.id} goat={goat} index={index + 2} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
