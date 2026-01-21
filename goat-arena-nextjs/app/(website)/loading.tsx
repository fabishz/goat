import { Crown } from 'lucide-react';

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                {/* Crown icon with animation */}
                <div className="relative">
                    <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full animate-pulse" />
                    <div className="relative w-16 h-16 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                        <Crown className="w-8 h-8 text-accent animate-pulse" />
                    </div>
                </div>

                {/* Loading text */}
                <div className="text-center">
                    <h3 className="text-xl font-serif font-bold mb-2">
                        Loading <span className="gold-text">Arena</span>
                    </h3>
                    <div className="flex gap-1 justify-center">
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
