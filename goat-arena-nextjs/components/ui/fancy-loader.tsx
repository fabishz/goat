"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";

export default function FancyLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md">
            <div className="relative">
                {/* Outer rotating ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-24 h-24 rounded-full border-t-2 border-r-2 border-accent/30 border-t-accent"
                />

                {/* Inner pulsing crown */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Crown className="w-10 h-10 text-accent gold-glow" />
                    </motion.div>
                </div>

                {/* Orbiting particles */}
                {[...Array(3)].map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            rotate: 360,
                            scale: [1, 1.5, 1]
                        }}
                        transition={{
                            rotate: { duration: 3 + i, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                        className="absolute top-1/2 left-1/2 w-2 h-2 bg-accent rounded-full"
                        style={{
                            marginLeft: -4,
                            marginTop: -4,
                            transformOrigin: `${40 + i * 10}px 0`
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
            >
                <h2 className="font-serif text-2xl font-bold gold-text tracking-widest uppercase">
                    The Arena
                </h2>
                <p className="text-muted-foreground text-sm mt-2 animate-pulse">
                    Summoning the GOATs...
                </p>
            </motion.div>
        </div>
    );
}
