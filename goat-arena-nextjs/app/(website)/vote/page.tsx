"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Vote as VoteIcon, Check, ChevronRight, ChevronLeft,
    Share2, Crown,
    ShieldCheck, TrendingUp, AlertCircle
} from 'lucide-react';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { goats } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import NextImage from 'next/image';
import { AuthActionGate } from '@/components/auth/AuthActionGate';

export default function Vote() {
    const { currentVote, setVoteStep, setVoteGoat, setVoteReason, resetVote } = useAppStore();
    const [selectedGoat, setSelectedGoat] = useState<string | null>(currentVote.goatId);
    const [reason, setReason] = useState(currentVote.reason);
    const [confidence, setConfidence] = useState([80]);
    const [isExpertVote, setIsExpertVote] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = [
        { number: 1, label: 'Select GOAT' },
        { number: 2, label: 'Details' },
        { number: 3, label: 'Confirm' },
    ];

    const currentStep = currentVote.step;
    const selectedGoatData = goats.find(g => g.id === selectedGoat);

    const handleGoatSelect = (goatId: string) => {
        setSelectedGoat(goatId);
        setVoteGoat(goatId);
    };

    const handleNext = () => {
        if (currentStep === 1 && selectedGoat) {
            setVoteStep(2);
        } else if (currentStep === 2) {
            setVoteReason(reason);
            setVoteStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setVoteStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ['#D4AF37', '#FFD700', '#B8860B', '#3B82F6'],
        });

        setVoteStep(4);
        setIsSubmitting(false);
    };

    const handleNewVote = () => {
        resetVote();
        setSelectedGoat(null);
        setReason('');
        setConfidence([80]);
        setIsExpertVote(false);
    };

    const impactScore = useMemo(() => {
        const base = isExpertVote ? 2.5 : 1.0;
        const confidenceMultiplier = confidence[0] / 100;
        const reasonBonus = reason.length > 50 ? 0.2 : 0;
        return (base * confidenceMultiplier + reasonBonus).toFixed(2);
    }, [isExpertVote, confidence, reason]);

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-2 text-accent mb-4">
                            <VoteIcon className="w-6 h-6" />
                            <span className="text-sm font-bold uppercase tracking-[0.2em]">The Arena</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">
                            Cast Your <span className="gold-text">Definitive</span> Vote
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                            Your vote is more than a choice—it&apos;s a statement. Help us determine the true GOAT.
                        </p>
                    </div>
                </FadeIn>

                {/* Progress Steps */}
                {currentStep <= 3 && (
                    <div className="flex items-center justify-center mb-16">
                        {steps.map((step, index) => (
                            <div key={step.number} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={cn(
                                        "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500",
                                        currentStep > step.number ? "bg-accent text-accent-foreground gold-glow" :
                                            currentStep === step.number ? "border-2 border-accent text-accent gold-glow" :
                                                "border-2 border-border text-muted-foreground"
                                    )}>
                                        {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                                    </div>
                                    <span className={cn(
                                        "mt-2 text-[10px] font-bold uppercase tracking-widest",
                                        currentStep === step.number ? "text-accent" : "text-muted-foreground"
                                    )}>{step.label}</span>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={cn(
                                        "w-16 md:w-32 h-0.5 mx-4 transition-colors duration-500",
                                        currentStep > step.number ? "bg-accent" : "bg-border"
                                    )} />
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="glass p-8 rounded-3xl border border-border/50">
                                <h2 className="text-2xl font-serif font-bold mb-8">Choose Your Candidate</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {goats.slice(0, 8).map((goat) => (
                                        <button
                                            key={goat.id}
                                            onClick={() => handleGoatSelect(goat.id)}
                                            className={cn(
                                                "group relative p-4 rounded-2xl transition-all duration-300",
                                                selectedGoat === goat.id ? "bg-accent/10 border-2 border-accent gold-glow" : "bg-secondary/30 border border-transparent hover:border-accent/30"
                                            )}
                                        >
                                            <div className="relative aspect-square mb-4 overflow-hidden rounded-full border-2 border-transparent group-hover:border-accent/50 transition-all">
                                                <NextImage src={goat.image} alt={goat.name} fill className="object-cover" />
                                            </div>
                                            <div className="font-bold text-sm truncate">{goat.name}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold">{goat.subdomain}</div>
                                            {selectedGoat === goat.id && (
                                                <div className="absolute -top-2 -right-2 bg-accent text-accent-foreground p-1 rounded-full gold-glow">
                                                    <Check className="w-4 h-4" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <AuthActionGate actionName="to continue" className="w-full md:w-auto">
                                    <Button
                                        size="lg"
                                        disabled={!selectedGoat}
                                        onClick={handleNext}
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow px-12 h-14 text-lg font-bold w-full"
                                    >
                                        Continue <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </AuthActionGate>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 2 && selectedGoatData && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                <div className="lg:col-span-7 space-y-8">
                                    <div className="glass p-8 rounded-3xl border border-border/50">
                                        <h2 className="text-2xl font-serif font-bold mb-8">The Reasoning</h2>
                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-sm font-bold uppercase tracking-widest">Confidence Level</Label>
                                                    <span className="text-accent font-bold">{confidence[0]}%</span>
                                                </div>
                                                <Slider
                                                    value={confidence}
                                                    onValueChange={setConfidence}
                                                    max={100}
                                                    step={1}
                                                    className="py-4"
                                                />
                                                <p className="text-[10px] text-muted-foreground italic">How certain are you that {selectedGoatData.name} is the definitive GOAT?</p>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-sm font-bold uppercase tracking-widest">Your Argument</Label>
                                                <Textarea
                                                    placeholder="Provide evidence, stats, or personal impact..."
                                                    className="min-h-[150px] bg-secondary/50 border-border"
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                />
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-accent/5 rounded-xl border border-accent/10">
                                                <div className="flex items-center gap-3">
                                                    <ShieldCheck className="w-5 h-5 text-accent" />
                                                    <div>
                                                        <div className="text-sm font-bold">Expert-Level Vote</div>
                                                        <div className="text-[10px] text-muted-foreground">Requires 100+ contribution points</div>
                                                    </div>
                                                </div>
                                                <Switch checked={isExpertVote} onCheckedChange={setIsExpertVote} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-5 space-y-8">
                                    <div className="glass p-8 rounded-3xl border border-accent/20 gold-glow">
                                        <h3 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
                                            <TrendingUp className="w-5 h-5 text-accent" />
                                            Impact Preview
                                        </h3>
                                        <div className="space-y-8">
                                            <div className="text-center">
                                                <div className="text-5xl font-serif font-bold gold-text mb-2">+{impactScore}</div>
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Estimated Ranking Impact</div>
                                            </div>
                                            <div className="space-y-4 pt-4 border-t border-border/50">
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Base Weight</span>
                                                    <span className="font-bold">1.00x</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Confidence Multiplier</span>
                                                    <span className="font-bold text-accent">{(confidence[0] / 100).toFixed(2)}x</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Expert Bonus</span>
                                                    <span className="font-bold text-accent">{isExpertVote ? '+1.50x' : '0.00x'}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-muted-foreground">Reasoning Bonus</span>
                                                    <span className="font-bold text-accent">{reason.length > 50 ? '+0.20x' : '0.00x'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-secondary/30 rounded-2xl border border-border/50 flex gap-3">
                                        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            High-confidence votes with detailed reasoning are prioritized in our ranking algorithm.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                                <Button variant="ghost" onClick={handleBack} size="lg">
                                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                                </Button>
                                <AuthActionGate actionName="to review and submit" className="flex-1 md:flex-none">
                                    <Button
                                        size="lg"
                                        onClick={handleNext}
                                        className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow px-12 h-14 text-lg font-bold w-full"
                                    >
                                        Review Vote <ChevronRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </AuthActionGate>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 3 && selectedGoatData && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="glass p-12 rounded-[3rem] border-2 border-accent/30 gold-glow text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-accent to-transparent" />
                                <Crown className="w-16 h-16 text-accent mx-auto mb-8" />
                                <h2 className="text-3xl font-serif font-bold mb-8">Confirm Your Statement</h2>

                                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-accent gold-glow">
                                    <NextImage src={selectedGoatData.image} alt={selectedGoatData.name} fill className="object-cover" />
                                </div>
                                <h3 className="text-4xl font-serif font-bold gold-text mb-2">{selectedGoatData.name}</h3>
                                <p className="text-xl text-accent italic font-serif mb-8">&quot;{selectedGoatData.nickname}&quot;</p>

                                <div className="grid grid-cols-2 gap-8 mb-12">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{confidence[0]}%</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Confidence</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{isExpertVote ? 'Expert' : 'Fan'}</div>
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground">Vote Type</div>
                                    </div>
                                </div>

                                {reason && (
                                    <div className="bg-secondary/50 p-6 rounded-2xl text-left mb-12 border border-border/50">
                                        <div className="text-[10px] uppercase font-bold text-muted-foreground mb-2">Your Argument</div>
                                        <p className="italic text-foreground/90 leading-relaxed">&quot;{reason}&quot;</p>
                                    </div>
                                )}

                                <div className="flex flex-col gap-4">
                                    <Button
                                        size="lg"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full h-16 text-xl bg-accent text-accent-foreground hover:bg-accent/90 gold-glow font-bold"
                                    >
                                        {isSubmitting ? "Finalizing..." : "SUBMIT DEFINITIVE VOTE"}
                                    </Button>
                                    <Button variant="ghost" onClick={handleBack} className="text-muted-foreground">
                                        Wait, I want to change something
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentStep === 4 && selectedGoatData && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-32 h-32 rounded-full bg-accent/20 border-4 border-accent flex items-center justify-center mx-auto mb-8 gold-glow">
                                <Check className="w-16 h-16 text-accent" />
                            </div>
                            <h2 className="text-5xl font-serif font-bold mb-6">Vote Recorded.</h2>
                            <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto leading-relaxed">
                                Your contribution has been factored into the global rankings. You&apos;ve earned <span className="text-accent font-bold">+25 Influence Points</span>.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Button size="lg" variant="outline" className="h-14 px-8 border-accent/30 hover:border-accent">
                                    <Share2 className="w-5 h-5 mr-2" /> Share Your Verdict
                                </Button>
                                <Button size="lg" onClick={handleNewVote} className="h-14 px-8 bg-accent text-accent-foreground gold-glow">
                                    Vote in Another Category
                                </Button>
                            </div>

                            <div className="mt-16">
                                <Link href="/dashboard" className="text-accent font-bold hover:underline flex items-center justify-center gap-2">
                                    View your impact on the dashboard <ChevronRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
