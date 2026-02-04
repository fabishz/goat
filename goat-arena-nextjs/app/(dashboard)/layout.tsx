"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard,
    User,
    Settings,
    LogOut,
    Home,
    Crown,
    TrendingUp,
    MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { Shield, Award } from 'lucide-react';
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard';
import NextImage from 'next/image';

interface DashboardLayoutProps {
    children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, isInitializing, isAuthenticated, isOnboardingCompleted, logout } = useAppStore();

    useEffect(() => {
        if (!isInitializing && !isAuthenticated) {
            router.push('/login');
        }

        // Role-based protection
        if (!isInitializing && isAuthenticated && user) {
            if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
                router.push('/dashboard');
            }
            if (pathname.startsWith('/dashboard/expert') && user.role !== 'expert') {
                router.push('/dashboard');
            }
        }
    }, [isInitializing, isAuthenticated, user, pathname, router]);

    if (isInitializing) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return null;
    }

    const menuItems = [
        { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
        { icon: TrendingUp, label: 'My Votes', href: '/dashboard/votes' },
        { icon: MessageSquare, label: 'My Debates', href: '/dashboard/debates' },
        { icon: User, label: 'Profile', href: '/dashboard/profile' },
        { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    ];

    // Conditionally add role-specific links
    if (user?.role === 'admin') {
        menuItems.push({ icon: Shield, label: 'Admin Panel', href: '/dashboard/admin' });
    } else if (user?.role === 'expert') {
        menuItems.push({ icon: Award, label: 'Expert Hub', href: '/dashboard/expert' });
    }

    return (
        <div className="min-h-screen flex bg-background">
            {!isOnboardingCompleted && <OnboardingWizard />}
            {/* Dashboard Sidebar */}
            <aside className="w-64 border-r border-border/50 bg-card/30 backdrop-blur-xl hidden md:flex flex-col sticky top-0 h-screen">
                <div className="p-6 border-b border-border/50">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center gold-glow group-hover:scale-110 transition-transform">
                            <Crown className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="font-serif font-bold text-xl tracking-tight">
                            The <span className="gold-text">Arena</span>
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-4">
                        Main Menu
                    </div>
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 h-11 px-4 rounded-xl transition-all",
                                    pathname === item.href
                                        ? "bg-accent/10 text-accent border border-accent/20"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                                )}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="font-medium">{item.label}</span>
                            </Button>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border/50">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground hover:text-foreground">
                            <Home className="w-4 h-4" />
                            <span>Back to Website</span>
                        </Button>
                    </Link>
                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive mt-2"
                        onClick={() => {
                            logout();
                            router.push('/login');
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-30">
                    <h2 className="font-serif font-bold text-lg">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-bold">{user?.name || 'Guest'}</span>
                            <span className="text-[10px] text-accent font-bold uppercase tracking-wider">{user?.role || 'Fan'} Member</span>
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-accent/20 p-0.5">
                            <div className="w-full h-full rounded-full bg-secondary overflow-hidden relative">
                                {user?.avatar ? (
                                    <NextImage src={user.avatar} alt={user.name || 'User'} fill className="object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                                        {user?.name?.charAt(0) || 'G'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
