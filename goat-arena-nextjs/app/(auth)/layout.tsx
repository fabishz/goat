import { ReactNode } from 'react';
import Link from 'next/link';
import { Crown } from 'lucide-react';

interface AuthLayoutProps {
    children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="p-8">
                <Link href="/" className="flex items-center gap-2 group w-fit">
                    <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center gold-glow group-hover:scale-110 transition-transform">
                        <Crown className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <span className="font-serif font-bold text-2xl tracking-tight">
                        The <span className="gold-text">Arena</span>
                    </span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </main>

            <footer className="p-8 text-center text-xs text-muted-foreground uppercase tracking-widest font-bold">
                &copy; 2024 The Arena &bull; Deciding History
            </footer>
        </div>
    );
}
