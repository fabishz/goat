"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronRight, Sparkles, Target,
    Crown, Users, Trophy, Rocket,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

interface Category {
    id: string;
    name: string;
    slug: string;
    domain: string;
}

export function OnboardingWizard() {
    const { user, setCurrentCategory, completeOnboarding } = useAppStore();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                }
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const handleComplete = () => {
        // In a real app, we'd save these interests to the backend
        if (selectedInterests.length > 0) {
            setCurrentCategory(selectedInterests[0]);
        }
        completeOnboarding();
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-background/80 backdrop-blur-xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass w-full max-w-2xl rounded-[2.5rem] border border-accent/20 shadow-2xl overflow-hidden relative"
            >
                <div className="p-8 md:p-12">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 rounded-3xl bg-accent/20 flex items-center justify-center mx-auto mb-8 gold-glow">
                                    <Rocket className="w-10 h-10 text-accent" />
                                </div>
                                <h2 className="text-4xl font-serif font-bold mb-4">
                                    Welcome to the <span className="gold-text">Arena</span>, {user?.name}!
                                </h2>
                                <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto">
                                    You&apos;re now part of the ultimate GOAT ranking platform. Let&apos;s personalize your experience.
                                </p>
                                <Button
                                    onClick={() => setStep(2)}
                                    size="lg"
                                    className="h-14 px-10 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/90 gold-glow font-bold text-lg"
                                >
                                    Get Started
                                    <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-10">
                                    <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                        <Target className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Step 2 of 3</span>
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold mb-2">Pick Your <span className="gold-text">Interests</span></h2>
                                    <p className="text-muted-foreground text-sm">Select at least 3 categories you&apos;re passionate about.</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => toggleInterest(cat.id)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all duration-300 text-left relative group",
                                                selectedInterests.includes(cat.id)
                                                    ? "bg-accent/20 border-accent shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                                                    : "bg-secondary/30 border-border/50 hover:border-accent/40"
                                            )}
                                        >
                                            <div className="text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">{cat.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase opacity-60">{cat.domain}</div>
                                            {selectedInterests.includes(cat.id) && (
                                                <div className="absolute top-2 right-2 text-accent">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-between items-center">
                                    <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground">Back</Button>
                                    <Button
                                        disabled={selectedInterests.length < 1}
                                        onClick={() => setStep(3)}
                                        className="h-12 px-8 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                                    >
                                        Next Step
                                        <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="text-center mb-10">
                                    <div className="flex items-center justify-center gap-2 text-accent mb-2">
                                        <Crown className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Final Step</span>
                                    </div>
                                    <h2 className="text-3xl font-serif font-bold mb-2">Understand the <span className="gold-text">Dynamics</span></h2>
                                    <p className="text-muted-foreground text-sm">How your voice shapes the rankings.</p>
                                </div>

                                <div className="space-y-4 mb-10">
                                    <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                                            <Users className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Fan Sentiment (10%)</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">Your votes and daily participation build the community consensus and drive the hype factor.</p>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                            <Trophy className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Expert Council (20%)</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">Verified professionals and statistical analysts provide weighted insights based on technical achievements.</p>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10 flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm mb-1 uppercase tracking-wider">Pure Data (70%)</h4>
                                            <p className="text-xs text-muted-foreground leading-relaxed">The core of the Arena is built on immutable statistics, championships, and verifiable records.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <Button variant="ghost" onClick={() => setStep(2)} className="text-muted-foreground">Back</Button>
                                    <Button
                                        onClick={handleComplete}
                                        className="h-12 px-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 gold-glow font-bold"
                                    >
                                        Enter the Arena
                                        <Sparkles className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Progress Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-1.5 h-1.5 rounded-full transition-all duration-300",
                                step === i ? "w-6 bg-accent" : "bg-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
