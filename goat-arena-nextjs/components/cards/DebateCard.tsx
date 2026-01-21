"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageSquare, ThumbsUp } from 'lucide-react';
import NextImage from 'next/image';
import { Debate } from '@/types/goat';
import { Button } from '@/components/ui/button';

interface DebateCardProps {
  debate: Debate;
  index?: number;
}

export function DebateCard({ debate, index = 0 }: DebateCardProps) {
  const totalVotes = debate.votes1 + debate.votes2;
  const percentage1 = Math.round((debate.votes1 / totalVotes) * 100);
  const percentage2 = 100 - percentage1;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="card-elevated rounded-xl border border-border/50 overflow-hidden hover:border-accent/50 transition-all"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            {debate.trending && (
              <span className="flex items-center gap-1 text-xs bg-accent/20 text-accent px-2 py-1 rounded-full">
                <ThumbsUp className="w-3 h-3" />
                Hot Debate
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            {debate.comments.toLocaleString()}
          </div>
        </div>

        <h3 className="font-serif text-lg font-semibold mb-4">
          {debate.title}
        </h3>

        {/* VS Section */}
        <div className="flex items-center gap-4 mb-4">
          {/* Goat 1 */}
          <div className="flex-1 text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <NextImage
                src={debate.goat1.image}
                alt={debate.goat1.name}
                fill
                className="object-cover rounded-full border-2 border-accent"
              />
              <div className="absolute -bottom-1 -right-1 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {percentage1}%
              </div>
            </div>
            <p className="font-medium text-sm truncate">{debate.goat1.name}</p>
            <p className="text-xs text-muted-foreground">{debate.votes1.toLocaleString()} votes</p>
          </div>

          {/* VS */}
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-serif font-bold text-accent">
              VS
            </div>
          </div>

          {/* Goat 2 */}
          <div className="flex-1 text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <NextImage
                src={debate.goat2.image}
                alt={debate.goat2.name}
                fill
                className="object-cover rounded-full border-2 border-border"
              />
              <div className="absolute -bottom-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                {percentage2}%
              </div>
            </div>
            <p className="font-medium text-sm truncate">{debate.goat2.name}</p>
            <p className="text-xs text-muted-foreground">{debate.votes2.toLocaleString()} votes</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage1}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full bg-gradient-to-r from-accent to-gold-light"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link href={`/debates/${debate.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
              <MessageSquare className="w-4 h-4 mr-2" />
              Join the Debate
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
