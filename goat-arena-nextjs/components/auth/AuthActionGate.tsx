"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { Button } from '@/components/ui/button';
import { LogIn, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuthActionGateProps {
    children: React.ReactNode;
    actionName?: string;
    className?: string;
}

export function AuthActionGate({ children, actionName = "to vote", className }: AuthActionGateProps) {
    const { isAuthenticated } = useAppStore();
    const router = useRouter();

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className={cn(
            "glass p-6 rounded-2xl border border-accent/20 flex flex-col items-center justify-center text-center gap-4 gold-glow",
            className
        )}>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                <Lock className="w-6 h-6" />
            </div>
            <div>
                <h4 className="text-lg font-serif font-bold mb-1">Sign in {actionName}</h4>
                <p className="text-sm text-muted-foreground">You must be logged in to participate in the Arena.</p>
            </div>
            <Button
                onClick={() => router.push('/login')}
                className="bg-accent text-accent-foreground hover:bg-accent/90 px-8"
            >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
            </Button>
        </div>
    );
}
