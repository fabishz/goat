"use client";

import { useMemo, useState } from 'react';
import NextImage from 'next/image';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useDebate } from '@/hooks/use-debates';
import { useCreateDebateArgument, useDebateArguments, useVoteDebateArgument } from '@/hooks/use-debate-arguments';
import { SkeletonCard } from '@/components/ui/skeleton-card';

interface DebateDetailProps {
    debateId: string;
}

export function DebateDetail({ debateId }: DebateDetailProps) {
    const { data: debate, isLoading: debateLoading } = useDebate(debateId);
    const { data: argumentsList, isLoading: argumentsLoading } = useDebateArguments(debateId);
    const createArgument = useCreateDebateArgument(debateId);
    const voteArgument = useVoteDebateArgument(debateId);

    const [content, setContent] = useState('');
    const [type, setType] = useState<'pro' | 'con'>('pro');

    const totalVotes = useMemo(() => {
        if (!debate) return 0;
        return debate.votes1 + debate.votes2;
    }, [debate]);

    const percent1 = useMemo(() => {
        if (!debate || totalVotes === 0) return 50;
        return Math.round((debate.votes1 / totalVotes) * 100);
    }, [debate, totalVotes]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        await createArgument.mutateAsync({ content: content.trim(), type });
        setContent('');
    };

    if (debateLoading) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="h-48 w-full bg-card/50 rounded-2xl animate-pulse mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => <SkeletonCard key={i} />)}
                </div>
            </div>
        );
    }

    if (!debate) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl font-serif font-bold mb-4">Debate Not Found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20">
            <section className="relative py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent" />
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">
                        {debate.title}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                        <div className="text-center">
                            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-accent/30">
                                <NextImage src={debate.goat1.image} alt={debate.goat1.name} fill className="object-cover" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold">{debate.goat1.name}</h3>
                            <div className="text-sm text-muted-foreground">{debate.votes1.toLocaleString()} votes</div>
                        </div>

                        <div className="text-center">
                            <div className="text-5xl font-serif font-black text-accent mb-4">VS</div>
                            <div className="h-3 bg-secondary rounded-full overflow-hidden">
                                <div className="h-full bg-accent" style={{ width: `${percent1}%` }} />
                            </div>
                            <div className="mt-2 text-sm text-muted-foreground">{percent1}% / {100 - percent1}%</div>
                        </div>

                        <div className="text-center">
                            <div className="relative w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-border">
                                <NextImage src={debate.goat2.image} alt={debate.goat2.name} fill className="object-cover" />
                            </div>
                            <h3 className="text-2xl font-serif font-bold">{debate.goat2.name}</h3>
                            <div className="text-sm text-muted-foreground">{debate.votes2.toLocaleString()} votes</div>
                        </div>
                    </div>

                    {debate.aiSummary && (
                        <div className="mt-10 glass p-6 rounded-2xl border border-border/50">
                            <h4 className="text-sm uppercase tracking-widest text-muted-foreground mb-2">AI Summary</h4>
                            <p className="text-base text-foreground/90">{debate.aiSummary}</p>
                        </div>
                    )}
                </div>
            </section>

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7">
                        <h2 className="text-2xl font-serif font-bold mb-6">Arguments</h2>
                        {argumentsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-24 bg-card/50 rounded-xl animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {(argumentsList || []).map((arg) => (
                                    <div key={arg.id} className="glass p-4 rounded-xl border border-border/50">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                                                    {arg.type === 'pro' ? 'Pro' : 'Con'} • {arg.userName}
                                                </div>
                                                <p className="mt-2 text-sm text-foreground/90">{arg.content}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => voteArgument.mutate({ argumentId: arg.id, direction: 'up' })}
                                                >
                                                    <ThumbsUp className="w-4 h-4" />
                                                </Button>
                                                <span className="text-xs w-6 text-center">{arg.upvotes}</span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => voteArgument.mutate({ argumentId: arg.id, direction: 'down' })}
                                                >
                                                    <ThumbsDown className="w-4 h-4" />
                                                </Button>
                                                <span className="text-xs w-6 text-center">{arg.downvotes}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-5">
                        <div className="glass p-6 rounded-2xl border border-border/50">
                            <h3 className="text-xl font-serif font-bold mb-4">Add Your Argument</h3>
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant={type === 'pro' ? 'default' : 'outline'}
                                        onClick={() => setType('pro')}
                                        className="flex-1"
                                    >
                                        Pro
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={type === 'con' ? 'default' : 'outline'}
                                        onClick={() => setType('con')}
                                        className="flex-1"
                                    >
                                        Con
                                    </Button>
                                </div>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Share your argument..."
                                    className="min-h-[120px]"
                                />
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={createArgument.isLoading}
                                >
                                    {createArgument.isLoading ? 'Posting...' : 'Post Argument'}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
