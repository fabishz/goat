import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GitCompare, X, ChevronRight, Crown, Trophy, Users, Award, ArrowLeftRight } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { RadarChart } from '@/components/charts/RadarChart';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { goats } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

export default function Compare() {
  const { compareGoats, removeFromCompare, clearCompare, addToCompare } = useAppStore();

  const goat1 = compareGoats[0];
  const goat2 = compareGoats[1];

  const getStatComparison = (stat1: number, stat2: number) => {
    if (stat1 > stat2) return { winner: 1, diff: stat1 - stat2 };
    if (stat2 > stat1) return { winner: 2, diff: stat2 - stat1 };
    return { winner: 0, diff: 0 };
  };

  const stats = goat1 && goat2 ? [
    { label: 'Achievements', key: 'achievements' as const },
    { label: 'Influence', key: 'influence' as const },
    { label: 'Awards', key: 'awards' as const },
    { label: 'Longevity', key: 'longevity' as const },
    { label: 'Impact', key: 'impact' as const },
    { label: 'Legacy', key: 'legacy' as const },
  ] : [];

  const suggestedGoats = goats.filter(g => !compareGoats.some(cg => cg.id === g.id)).slice(0, 4);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <FadeIn>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 text-accent mb-2">
                <GitCompare className="w-5 h-5" />
                <span className="text-sm font-medium uppercase tracking-wide">Head to Head</span>
              </div>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                Compare <span className="gold-text">GOATs</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Put legends side by side and see how they stack up across every metric.
              </p>
            </div>
          </FadeIn>

          {/* Comparison Area */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-12">
            {/* GOAT 1 Slot */}
            <div className="lg:col-span-3">
              {goat1 ? (
                <FadeIn>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-elevated rounded-xl border border-accent/30 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative h-48">
                      <img
                        src={goat1.image}
                        alt={goat1.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <button
                        onClick={() => removeFromCompare(goat1.id)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-accent text-sm mb-1">{goat1.subdomain}</p>
                        <h3 className="font-serif text-2xl font-bold">{goat1.name}</h3>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="p-6 text-center border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                      <div className="font-serif text-5xl font-bold gold-text">
                        <AnimatedCounter value={goat1.overallScore} decimals={1} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6">
                      <RadarChart stats={goat1.stats} color="#D4AF37" />
                    </div>
                  </motion.div>
                </FadeIn>
              ) : (
                <FadeIn>
                  <div className="card-elevated rounded-xl border-2 border-dashed border-border h-[500px] flex flex-col items-center justify-center p-8 text-center">
                    <Crown className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">Select First GOAT</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Choose a legend from the rankings or suggestions below
                    </p>
                    <Link to="/categories">
                      <Button variant="outline">
                        Browse Rankings
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              )}
            </div>

            {/* VS Divider */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="w-16 h-16 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center"
              >
                <span className="font-serif font-bold text-accent text-xl">VS</span>
              </motion.div>
            </div>

            {/* GOAT 2 Slot */}
            <div className="lg:col-span-3">
              {goat2 ? (
                <FadeIn>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="card-elevated rounded-xl border border-primary/30 overflow-hidden"
                  >
                    {/* Header */}
                    <div className="relative h-48">
                      <img
                        src={goat2.image}
                        alt={goat2.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                      <button
                        onClick={() => removeFromCompare(goat2.id)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-destructive/80 hover:bg-destructive flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-4 left-4">
                        <p className="text-royal-light text-sm mb-1">{goat2.subdomain}</p>
                        <h3 className="font-serif text-2xl font-bold">{goat2.name}</h3>
                      </div>
                    </div>

                    {/* Score */}
                    <div className="p-6 text-center border-b border-border">
                      <p className="text-sm text-muted-foreground mb-1">Overall Score</p>
                      <div className="font-serif text-5xl font-bold text-royal-light">
                        <AnimatedCounter value={goat2.overallScore} decimals={1} />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6">
                      <RadarChart stats={goat2.stats} color="#3B6BA5" />
                    </div>
                  </motion.div>
                </FadeIn>
              ) : (
                <FadeIn>
                  <div className="card-elevated rounded-xl border-2 border-dashed border-border h-[500px] flex flex-col items-center justify-center p-8 text-center">
                    <Trophy className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-2">Select Second GOAT</h3>
                    <p className="text-muted-foreground text-sm mb-6">
                      Choose another legend to compare against
                    </p>
                    <Link to="/categories">
                      <Button variant="outline">
                        Browse Rankings
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>

          {/* Stat Comparison Table */}
          {goat1 && goat2 && (
            <FadeIn delay={0.2}>
              <div className="card-elevated rounded-xl border border-border/50 p-6 mb-12">
                <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                  <ArrowLeftRight className="w-6 h-6 text-accent" />
                  Stat Breakdown
                </h2>

                <div className="space-y-4">
                  {stats.map((stat, index) => {
                    const comparison = getStatComparison(goat1.stats[stat.key], goat2.stats[stat.key]);
                    return (
                      <motion.div
                        key={stat.key}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="grid grid-cols-7 items-center gap-4"
                      >
                        {/* Goat 1 Value */}
                        <div className={cn(
                          'col-span-2 text-right font-bold text-xl',
                          comparison.winner === 1 && 'gold-text'
                        )}>
                          {goat1.stats[stat.key]}
                          {comparison.winner === 1 && (
                            <span className="text-accent text-sm ml-2">+{comparison.diff}</span>
                          )}
                        </div>

                        {/* Bar */}
                        <div className="col-span-3">
                          <div className="text-center text-sm text-muted-foreground mb-2">
                            {stat.label}
                          </div>
                          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(goat1.stats[stat.key] / (goat1.stats[stat.key] + goat2.stats[stat.key])) * 100}%` }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-accent to-gold-light rounded-l-full"
                            />
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(goat2.stats[stat.key] / (goat1.stats[stat.key] + goat2.stats[stat.key])) * 100}%` }}
                              transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                              className="absolute right-0 top-0 h-full bg-gradient-to-l from-royal to-royal-light rounded-r-full"
                            />
                          </div>
                        </div>

                        {/* Goat 2 Value */}
                        <div className={cn(
                          'col-span-2 text-left font-bold text-xl',
                          comparison.winner === 2 && 'text-royal-light'
                        )}>
                          {goat2.stats[stat.key]}
                          {comparison.winner === 2 && (
                            <span className="text-royal-light text-sm ml-2">+{comparison.diff}</span>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Overall Winner */}
                <div className="mt-8 pt-6 border-t border-border text-center">
                  <p className="text-muted-foreground mb-2">Based on overall score</p>
                  <div className="flex items-center justify-center gap-4">
                    {goat1.overallScore > goat2.overallScore ? (
                      <>
                        <Crown className="w-8 h-8 text-accent" />
                        <span className="font-serif text-2xl font-bold gold-text">{goat1.name} leads</span>
                        <span className="text-accent">+{(goat1.overallScore - goat2.overallScore).toFixed(1)}</span>
                      </>
                    ) : goat2.overallScore > goat1.overallScore ? (
                      <>
                        <Crown className="w-8 h-8 text-royal-light" />
                        <span className="font-serif text-2xl font-bold text-royal-light">{goat2.name} leads</span>
                        <span className="text-royal-light">+{(goat2.overallScore - goat1.overallScore).toFixed(1)}</span>
                      </>
                    ) : (
                      <span className="font-serif text-2xl font-bold">It's a tie!</span>
                    )}
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Suggested GOATs */}
          {compareGoats.length < 2 && (
            <FadeIn delay={0.3}>
              <div className="card-elevated rounded-xl border border-border/50 p-6">
                <h3 className="font-serif text-xl font-bold mb-6">Suggested GOATs</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {suggestedGoats.map((goat) => (
                    <motion.button
                      key={goat.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => addToCompare(goat)}
                      className="glass rounded-xl p-4 text-center hover:border-accent/50 transition-colors"
                    >
                      <img
                        src={goat.image}
                        alt={goat.name}
                        className="w-16 h-16 rounded-full object-cover mx-auto mb-3 border-2 border-border"
                      />
                      <p className="font-medium text-sm">{goat.name}</p>
                      <p className="text-xs text-muted-foreground">{goat.subdomain}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}

          {/* Clear Button */}
          {compareGoats.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="ghost" onClick={clearCompare} className="text-muted-foreground hover:text-destructive">
                Clear Comparison
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
