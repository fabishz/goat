"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Crown, TrendingUp, Users, Award, ChevronRight, Star } from 'lucide-react';
import { GoatCard } from '@/components/cards/GoatCard';
import { DebateCard } from '@/components/cards/DebateCard';
import { ExpertCard } from '@/components/cards/ExpertCard';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { goats, debates, experts } from '@/lib/mock-data';
import NextImage from 'next/image';
import { cn } from '@/lib/utils';

export default function Home() {
  const topGoats = goats.slice(0, 4);
  const trendingDebates = debates.filter(d => d.trending);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <NextImage
            src="/images/background.jpg"
            alt="Background"
            fill
            className="object-cover opacity-40"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
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

          {/* Floating Trophies */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-10 w-32 h-32 opacity-20 hidden lg:block"
          >
            <NextImage src="/images/nba_trophy.png" alt="NBA Trophy" width={128} height={128} className="object-contain gold-glow" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-1/4 right-10 w-40 h-40 opacity-20 hidden lg:block"
          >
            <NextImage src="/images/world_cup.png" alt="World Cup" width={160} height={160} className="object-contain gold-glow" />
          </motion.div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}

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

      {/* Legends & Legacies Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <Crown className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-widest">Legends & Legacies</span>
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">
                The Faces of <span className="gold-text">Greatness</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Witness the icons who redefined their domains. Every championship, every record, every moment etched in gold.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Michael Jordan', title: 'The Standard', img: '/images/jordan_legend.png', trophy: '/images/nba_trophy.png', category: 'nba' },
              { name: 'Lionel Messi', title: 'The Maestro', img: '/images/messi_legend.png', trophy: '/images/world_cup.png', category: 'football' },
              { name: 'Cristiano Ronaldo', title: 'The Machine', img: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80', trophy: '/images/world_cup.png', category: 'football' },
              { name: 'LeBron James', title: 'The King', img: '/images/lebron_legend.png', trophy: '/images/nba_trophy.png', category: 'nba' },
            ].map((legend, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden glass border border-accent/20 hover:border-accent transition-all duration-500"
              >
                <NextImage
                  src={legend.img}
                  alt={legend.name}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-700 group-hover:scale-110",
                    legend.name === 'Cristiano Ronaldo' && "sepia-[0.4] brightness-[1.1] contrast-[1.1] saturate-[1.2]"
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="text-accent text-[10px] font-bold uppercase tracking-widest mb-1">{legend.title}</div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">{legend.name}</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 backdrop-blur-md flex items-center justify-center border border-accent/30">
                      <NextImage src={legend.trophy} alt="Trophy" width={24} height={24} className="object-contain" />
                    </div>
                    <Link href={`/categories/${legend.category}/goat/${legend.name.toLowerCase().replace(' ', '-')}`}>
                      <Button variant="ghost" className="text-white hover:text-accent p-0 font-bold uppercase tracking-tighter text-[10px]">
                        View Profile <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Rankings Section */}
      <section className="py-20 bg-card/30 relative overflow-hidden">
        {/* Decorative Trophy */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 pointer-events-none">
          <NextImage src="/images/gold_medals.png" alt="Gold Medals" width={256} height={256} className="object-contain grayscale hover:grayscale-0 transition-all duration-700" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
            <div className="glass rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              {/* Decorative Trophy Background */}
              <div className="absolute -left-10 -bottom-10 w-48 h-48 opacity-10 rotate-12 pointer-events-none">
                <NextImage src="/images/world_cup.png" alt="World Cup" width={192} height={192} className="object-contain" />
              </div>
              <div className="absolute -right-10 -top-10 w-48 h-48 opacity-10 -rotate-12 pointer-events-none">
                <NextImage src="/images/nba_trophy.png" alt="NBA Trophy" width={192} height={192} className="object-contain" />
              </div>

              <div className="flex items-center justify-center gap-2 text-accent mb-4 relative z-10">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Community</span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 relative z-10">
                Join Millions of Voters
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 relative z-10">
                Be part of the largest GOAT ranking community. Your vote matters – every voice shapes the definitive rankings.
              </p>

              {/* Avatars */}
              <div className="flex items-center justify-center mb-8 relative z-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="w-10 h-10 rounded-full border-2 border-background overflow-hidden relative"
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

              <Link href="/vote" className="relative z-10">
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
