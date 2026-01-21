"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, TrendingUp, Users, Award, ChevronRight, Sparkles, Star } from 'lucide-react';
import { GoatCard } from '@/components/cards/GoatCard';
import { DebateCard } from '@/components/cards/DebateCard';
import { ExpertCard } from '@/components/cards/ExpertCard';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { goats, debates, experts } from '@/lib/mock-data';
import NextImage from 'next/image';

export default function Home() {
  const topGoats = goats.slice(0, 4);
  const trendingDebates = debates.filter(d => d.trending);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center hero-gradient overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 50, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              rotate: -360,
            }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-full px-4 py-2 mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-accent font-medium">AI-Powered Rankings</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
            >
              Who is the{' '}
              <span className="gold-text">Greatest</span>
              <br />
              of All Time?
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Data-driven rankings powered by achievements, expert analysis, and millions of fan votes across sports, music, and beyond.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/vote">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow text-lg px-8 py-6">
                  <Crown className="w-5 h-5 mr-2" />
                  Vote Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="border-border hover:border-accent hover:bg-accent/10 text-lg px-8 py-6">
                  Explore Rankings
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold gold-text">
                  <AnimatedCounter value={12.5} suffix="M+" decimals={1} />
                </div>
                <div className="text-sm text-muted-foreground mt-1">Total Votes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold gold-text">
                  <AnimatedCounter value={500} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">GOATs Ranked</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-serif font-bold gold-text">
                  <AnimatedCounter value={150} suffix="+" />
                </div>
                <div className="text-sm text-muted-foreground mt-1">Expert Voters</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1.5, y: { duration: 1.5, repeat: Infinity } }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-accent rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Live Rankings Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-12">
              <div>
                <div className="flex items-center gap-2 text-accent mb-2">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm font-medium uppercase tracking-wide">Live Rankings</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold">
                  Top Ranked GOATs
                </h2>
              </div>
              <Link href="/categories">
                <Button variant="outline" className="hidden md:flex border-border hover:border-accent">
                  View All
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {topGoats.map((goat, index) => (
              <GoatCard key={goat.id} goat={goat} index={index} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link href="/categories">
              <Button variant="outline" className="border-border hover:border-accent">
                View All Rankings
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Debates Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <Star className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Hot Takes</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                Trending Debates
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Join the conversation and make your voice heard in the most contested GOAT debates.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingDebates.map((debate, index) => (
              <DebateCard key={debate.id} debate={debate} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Expert Opinions Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <Award className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Expert Panel</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold">
                What the Experts Say
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {experts.map((expert, index) => (
              <ExpertCard
                key={expert.id}
                expert={expert}
                index={index}
                quote={
                  index === 0
                    ? "Jordan's competitive fire was unmatched. Six finals, six MVPs – that's perfection."
                    : index === 1
                      ? "Music transcends eras. To compare across decades, we must weigh cultural impact."
                      : "The true GOAT debate isn't about statistics alone – it's about legacy."
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="glass rounded-2xl p-8 md:p-12 text-center">
              <div className="flex items-center justify-center gap-2 text-accent mb-4">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Community</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                Join Millions of Voters
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Be part of the largest GOAT ranking community. Your vote matters – every voice shapes the definitive rankings.
              </p>

              {/* Avatars */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full border-2 border-background overflow-hidden"
                    >
                      <NextImage
                        src={`https://images.unsplash.com/photo-${1500000000000 + i * 10000}?w=100&h=100&fit=crop`}
                        alt="User"
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="ml-4 text-muted-foreground text-sm">
                  +12.5M voters
                </span>
              </div>

              <Link href="/vote">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                  Cast Your Vote
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
