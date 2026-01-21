"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate registration
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl border border-border/50 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">Join the <span className="gold-text">Arena</span></h2>
                <p className="text-muted-foreground text-sm">Create your account to start deciding history.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="John Champion"
                            className="pl-12 bg-background/50 border-border/50 h-12 rounded-xl focus:ring-accent/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="email"
                            placeholder="name@example.com"
                            className="pl-12 bg-background/50 border-border/50 h-12 rounded-xl focus:ring-accent/50"
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 bg-background/50 border-border/50 h-12 rounded-xl focus:ring-accent/50"
                            required
                        />
                    </div>
                </div>

                <div className="p-4 bg-accent/5 rounded-2xl border border-accent/10 mb-2">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-accent mt-0.5" />
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider mb-1">Role Selection</div>
                            <p className="text-[10px] text-muted-foreground leading-relaxed">
                                By default, you will join as a **Fan**. Experts and Admins are vetted by the community.
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 gold-glow rounded-xl font-bold text-sm uppercase tracking-widest"
                    disabled={isLoading}
                >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link href="/login" className="text-accent font-bold hover:underline">Sign in</Link>
            </p>
        </motion.div>
    );
}
