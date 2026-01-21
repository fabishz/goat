"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate login
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-8 rounded-3xl border border-border/50 shadow-2xl"
        >
            <div className="text-center mb-8">
                <h2 className="text-3xl font-serif font-bold mb-2">Welcome <span className="gold-text">Back</span></h2>
                <p className="text-muted-foreground text-sm">Enter your credentials to access the arena.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Password</label>
                        <Link href="#" className="text-[10px] font-bold text-accent uppercase tracking-tighter hover:underline">Forgot Password?</Link>
                    </div>
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

                <Button
                    type="submit"
                    className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 gold-glow rounded-xl font-bold text-sm uppercase tracking-widest"
                    disabled={isLoading}
                >
                    {isLoading ? "Authenticating..." : "Enter the Arena"}
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
                </Button>
            </form>

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-background px-4 text-muted-foreground">Or continue with</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="h-12 border-border/50 rounded-xl hover:bg-accent/5">
                    <Github className="w-4 h-4 mr-2" />
                    Github
                </Button>
                <Button variant="outline" className="h-12 border-border/50 rounded-xl hover:bg-accent/5">
                    <Chrome className="w-4 h-4 mr-2" />
                    Google
                </Button>
            </div>

            <p className="mt-8 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="text-accent font-bold hover:underline">Create one</Link>
            </p>
        </motion.div>
    );
}
