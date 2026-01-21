"use client";

import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

export function PageLoader() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-primary/5 to-accent/5 animate-pulse" />

            {/* Main loader content */}
            <div className="relative z-10 flex flex-col items-center gap-8">
                {/* Crown icon with glow */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-accent/30 blur-3xl rounded-full" />
                    <div className="relative w-24 h-24 rounded-2xl bg-accent flex items-center justify-center gold-glow">
                        <Crown className="w-12 h-12 text-accent-foreground" />
                    </div>
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-center"
                >
                    <h2 className="text-3xl font-serif font-bold mb-2">
                        The <span className="gold-text">Arena</span>
                    </h2>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest">
                        Loading greatness...
                    </p>
                </motion.div>

                {/* Animated progress bar */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="w-64 h-1 bg-secondary rounded-full overflow-hidden"
                >
                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: "100%" }}
                        transition={{
                            repeat: Infinity,
                            duration: 1.5,
                            ease: "easeInOut"
                        }}
                        className="h-full w-1/3 bg-gradient-to-r from-transparent via-accent to-transparent"
                    />
                </motion.div>
            </div>
        </div>
    );
}
