"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, ChevronRight, ChevronLeft,
    Award, User, BookOpen, Send, Sparkles,
    Info, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const steps = [
    { id: 'basic', title: 'Identity', icon: User, description: 'Who is this legend?' },
    { id: 'stats', title: 'Legacy', icon: Award, description: 'What did they achieve?' },
    { id: 'story', title: 'Impact', icon: BookOpen, description: 'Why are they a GOAT?' },
    { id: 'review', title: 'Review', icon: Send, description: 'Final check' },
];

export default function SubmitGoatPage() {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        domain: '',
        subdomain: '',
        country: '',
        era: '',
        achievements: [''],
        bio: '',
        impact: '',
        image: null as File | null,
    });

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
            window.scrollTo(0, 0);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
            window.scrollTo(0, 0);
        }
    };

    const updateFormData = (field: string, value: string | number | string[] | File | null) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addAchievement = () => {
        setFormData(prev => ({ ...prev, achievements: [...prev.achievements, ''] }));
    };

    const updateAchievement = (index: number, value: string) => {
        const newAch = [...formData.achievements];
        newAch[index] = value;
        setFormData(prev => ({ ...prev, achievements: newAch }));
    };

    return (
        <div className="min-h-screen pb-20 pt-12">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Nominate a <span className="gold-text">GOAT</span></h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Help us build the definitive hall of fame. Provide detailed evidence to ensure your candidate meets the GOAT criteria.
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="mb-12">
                    <div className="flex justify-between items-center mb-4">
                        {steps.map((step, i) => (
                            <div key={step.id} className="flex flex-col items-center relative z-10">
                                <div className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500",
                                    i <= currentStep ? "bg-accent text-accent-foreground gold-glow" : "bg-secondary text-muted-foreground border border-border"
                                )}>
                                    {i < currentStep ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                                </div>
                                <div className="mt-2 text-[10px] font-bold uppercase tracking-widest hidden md:block">
                                    {step.title}
                                </div>
                            </div>
                        ))}
                        {/* Progress Line */}
                        <div className="absolute left-0 right-0 top-5 h-0.5 bg-secondary -z-0 mx-auto max-w-2xl hidden md:block" />
                        <motion.div
                            className="absolute left-0 top-5 h-0.5 bg-accent -z-0 mx-auto max-w-2xl hidden md:block origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: currentStep / (steps.length - 1) }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                {/* Form Content */}
                <div className="glass p-8 md:p-12 rounded-3xl border border-border/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Sparkles className="w-24 h-24 text-accent" />
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {currentStep === 0 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                                            <Input
                                                placeholder="e.g. Michael Jordan"
                                                value={formData.name}
                                                onChange={(e) => updateFormData('name', e.target.value)}
                                                className="h-12 bg-secondary/50 border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Nickname</label>
                                            <Input
                                                placeholder="e.g. Air Jordan"
                                                value={formData.nickname}
                                                onChange={(e) => updateFormData('nickname', e.target.value)}
                                                className="h-12 bg-secondary/50 border-border"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Domain</label>
                                            <select
                                                className="w-full h-12 bg-secondary/50 border border-border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                                                value={formData.domain}
                                                onChange={(e) => updateFormData('domain', e.target.value)}
                                            >
                                                <option value="">Select Domain</option>
                                                <option value="sports">Sports</option>
                                                <option value="music">Music</option>
                                                <option value="science">Science</option>
                                                <option value="politics">Politics</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Sub-domain / Role</label>
                                            <Input
                                                placeholder="e.g. Basketball"
                                                value={formData.subdomain}
                                                onChange={(e) => updateFormData('subdomain', e.target.value)}
                                                className="h-12 bg-secondary/50 border-border"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Country / Region</label>
                                            <Input
                                                placeholder="e.g. USA"
                                                value={formData.country}
                                                onChange={(e) => updateFormData('country', e.target.value)}
                                                className="h-12 bg-secondary/50 border-border"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Active Era</label>
                                            <Input
                                                placeholder="e.g. 1984-2003"
                                                value={formData.era}
                                                onChange={(e) => updateFormData('era', e.target.value)}
                                                className="h-12 bg-secondary/50 border-border"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Key Achievements</label>
                                        {formData.achievements.map((ach, i) => (
                                            <div key={i} className="flex gap-2">
                                                <Input
                                                    placeholder={`Achievement #${i + 1}`}
                                                    value={ach}
                                                    onChange={(e) => updateAchievement(i, e.target.value)}
                                                    className="h-12 bg-secondary/50 border-border"
                                                />
                                            </div>
                                        ))}
                                        <Button variant="outline" onClick={addAchievement} className="w-full border-dashed border-border hover:border-accent hover:bg-accent/5">
                                            + Add Another Achievement
                                        </Button>
                                    </div>
                                    <div className="p-4 bg-accent/5 rounded-xl border border-accent/10 flex gap-3">
                                        <Info className="w-5 h-5 text-accent shrink-0" />
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Be specific. Instead of &quot;Won many titles&quot;, use &quot;6x NBA Champion, 6x Finals MVP&quot;.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">The GOAT Story (Bio)</label>
                                        <Textarea
                                            placeholder="A brief overview of their journey and career..."
                                            className="min-h-[150px] bg-secondary/50 border-border"
                                            value={formData.bio}
                                            onChange={(e) => updateFormData('bio', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Why are they the GOAT?</label>
                                        <Textarea
                                            placeholder="Explain their unique impact, dominance, and legacy..."
                                            className="min-h-[150px] bg-secondary/50 border-border"
                                            value={formData.impact}
                                            onChange={(e) => updateFormData('impact', e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-serif font-bold border-b border-border pb-2">Identity</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Name:</span> <span>{formData.name || '---'}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Nickname:</span> <span>{formData.nickname || '---'}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Domain:</span> <span className="capitalize">{formData.domain || '---'}</span></div>
                                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Role:</span> <span>{formData.subdomain || '---'}</span></div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-serif font-bold border-b border-border pb-2">Achievements</h3>
                                            <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                                                {formData.achievements.filter(a => a).map((a, i) => <li key={i}>{a}</li>)}
                                                {formData.achievements.filter(a => a).length === 0 && <li>No achievements listed</li>}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-accent/5 rounded-2xl border border-accent/20">
                                        <div className="flex items-center gap-2 mb-4">
                                            <AlertCircle className="w-5 h-5 text-accent" />
                                            <h3 className="text-sm font-bold uppercase tracking-widest text-accent">Final Confirmation</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground leading-relaxed">
                                            By submitting, you confirm that this information is accurate to the best of your knowledge. Submissions are reviewed by the community and experts before being officially added to the rankings.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="mt-12 flex justify-between items-center pt-8 border-t border-border/50">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>

                        {currentStep === steps.length - 1 ? (
                            <Button className="bg-accent text-accent-foreground px-8 h-12 gold-glow font-bold">
                                Submit Nomination
                                <Send className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleNext}
                                className="bg-accent text-accent-foreground px-8 h-12 gold-glow font-bold"
                            >
                                Continue
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
