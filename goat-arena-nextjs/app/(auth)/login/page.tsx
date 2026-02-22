"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';

export default function LoginPage() {
    const { checkAuth } = useAppStore();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${apiUrl}/auth/login/access-token`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    username: email,
                    password: password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'Login failed');
            }

            const { access_token } = await response.json();

            // Temporary mapping for login success until checkAuth fetches full profile
            // checkAuth will be called immediately after or logic could be centralized
            localStorage.setItem('arena_token', access_token);
            await checkAuth();
            router.push('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
            setIsLoading(false);
        }
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
                {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-xs font-bold text-center">
                        {error}
                    </div>
                )}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            name="email"
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
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 bg-background/50 border-border/50 h-12 rounded-xl focus:ring-accent/50"
                            required
                            autoComplete="current-password"
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

            <div className="flex justify-center">
                <Button variant="outline" className="w-full h-12 border-border/50 rounded-xl hover:bg-accent/5">
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
