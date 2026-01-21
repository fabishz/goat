"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import NextImage from 'next/image';
import { Crown, TrendingUp, Users, Award } from 'lucide-react';
import { Goat } from '@/types/goat';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

interface GoatCardProps {
  goat: Goat;
  index?: number;
  showCompare?: boolean;
}

export function GoatCard({ goat, index = 0, showCompare = true }: GoatCardProps) {
  const { addToCompare, compareGoats } = useAppStore();
  const isInCompare = compareGoats.some(g => g.id === goat.id);

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-accent to-gold-dark';
    if (rank === 2) return 'from-silver to-gray-400';
    if (rank === 3) return 'from-bronze to-amber-700';
    return 'from-primary to-royal-light';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <div className="card-elevated rounded-xl overflow-hidden border border-border/50 hover:border-accent/50 transition-all duration-300">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <NextImage
            src={goat.image}
            alt={goat.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          {/* Rank Badge */}
          <div className={cn(
            'absolute top-3 left-3 w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold text-lg bg-gradient-to-br shadow-lg',
            getRankColor(goat.rank)
          )}>
            {goat.rank <= 3 ? (
              <Crown className="w-5 h-5 text-white" />
            ) : (
              <span className="text-white">{goat.rank}</span>
            )}
          </div>

          {/* Trending Badge */}
          {goat.trending && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 right-3 bg-accent/90 text-accent-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1"
            >
              <TrendingUp className="w-3 h-3" />
              Trending
            </motion.div>
          )}

          {/* Score */}
          <div className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <div className="text-xs text-muted-foreground">Score</div>
            <div className="font-serif font-bold text-accent text-lg">
              <AnimatedCounter value={goat.overallScore} decimals={1} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
            <span className="px-2 py-0.5 bg-secondary rounded-full">{goat.subdomain}</span>
            <span>{goat.country}</span>
          </div>

          <Link href={`/categories/${goat.categoryId}/goat/${goat.id}`}>
            <h3 className="font-serif text-xl font-bold hover:text-accent transition-colors">
              {goat.name}
            </h3>
          </Link>

          <p className="text-sm text-accent italic mb-3">
            &quot;{goat.nickname}&quot;
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{(goat.fanVotes / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              <span>{goat.achievements.length}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/categories/${goat.categoryId}/goat/${goat.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full border-border hover:border-accent hover:bg-accent/10">
                View Profile
              </Button>
            </Link>
            {showCompare && (
              <Button
                size="sm"
                variant={isInCompare ? 'default' : 'outline'}
                className={cn(
                  isInCompare && 'bg-accent text-accent-foreground'
                )}
                onClick={() => addToCompare(goat)}
                disabled={isInCompare || compareGoats.length >= 2}
              >
                {isInCompare ? '✓' : '+'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
