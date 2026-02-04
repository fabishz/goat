"use client";

import { motion } from 'framer-motion';
import { Trophy, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useState, useEffect } from 'react';

interface VoteSuccessProps {
    points: number;
    lvlProgress: number;
    onClose: () => void;
}

export function VoteSuccess({ points, lvlProgress, onClose }: VoteSuccessProps) {
    const [particles, setParticles] = useState<{ left: string; top: string; duration: number }[]>([]);

    useEffect(() => {
        const generated = [...Array(12)].map(() => ({
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: 1 + Math.random(),
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setParticles(generated);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-background/40 backdrop-blur-md"
        >
            <motion.div
                initial={{ scale: 0.8, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: 40, opacity: 0 }}
                className="glass w-full max-w-md p-8 rounded-[2rem] border border-accent/30 shadow-2xl relative overflow-hidden text-center"
            >
                {/* Background Glows */}
                <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-1/4 -right-1/4 w-full h-full bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-xl hover:bg-accent/10 text-muted-foreground transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="relative z-10">
                    <motion.div
                        initial={{ rotate: -15, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                        className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center mx-auto mb-6 gold-glow shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                    >
                        <Trophy className="w-10 h-10 text-accent-foreground" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-serif font-bold mb-2"
                    >
                        Vote <span className="gold-text">Recorded!</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-muted-foreground mb-8"
                    >
                        Your voice has shaped the destiny of the Arena.
                    </motion.p>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="bg-card/40 border border-border/50 rounded-2xl p-6 mb-8"
                    >
                        <div className="flex justify-between items-end mb-4">
                            <div className="text-left">
                                <div className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">XP Earned</div>
                                <div className="text-2xl font-serif font-bold">+{points} Points</div>
                            </div>
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Level Progress</div>
                                <div className="text-sm font-bold text-accent">{lvlProgress}%</div>
                            </div>
                        </div>
                        <Progress value={lvlProgress} className="h-2" />
                    </motion.div>

                    <Button
                        onClick={onClose}
                        className="w-full h-12 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-bold uppercase tracking-widest text-xs"
                    >
                        Back to the Arena
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>

                {/* Simulated Confetti/Particles */}
                {particles.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            left: "50%",
                            top: "50%",
                            scale: 0,
                            opacity: 1
                        }}
                        animate={{
                            left: p.left,
                            top: p.top,
                            scale: [0, 1, 0.5],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: p.duration,
                            delay: 0.3,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                        className="absolute w-2 h-2 bg-accent rounded-full pointer-events-none"
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
