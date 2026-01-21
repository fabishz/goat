import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crown, MapPin, Calendar, Users, Award, TrendingUp, ChevronRight, ThumbsUp, MessageSquare, Share2, ArrowLeft } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { RadarChart } from '@/components/charts/RadarChart';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { goats, experts } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';

export default function GoatProfile() {
  const { id } = useParams<{ id: string }>();
  const { addToCompare, compareGoats } = useAppStore();
  
  const goat = goats.find(g => g.id === id);
  
  if (!goat) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-4xl mb-4">GOAT Not Found</h1>
          <Link to="/categories">
            <Button>Back to Rankings</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const isInCompare = compareGoats.some(g => g.id === goat.id);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return { icon: '🥇', label: 'Champion' };
    if (rank === 2) return { icon: '🥈', label: 'Runner-up' };
    if (rank === 3) return { icon: '🥉', label: 'Third Place' };
    return { icon: '#' + rank, label: 'Ranked' };
  };

  const rankBadge = getRankBadge(goat.rank);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative">
        {/* Background */}
        <div className="absolute inset-0 h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${goat.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
          {/* Back Button */}
          <Link to="/categories">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rankings
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Image & Basic Info */}
            <div className="lg:col-span-1">
              <FadeIn>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative"
                >
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-2xl overflow-hidden border-4 border-accent/30 gold-glow">
                    <img
                      src={goat.image}
                      alt={goat.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2">
                      <div className="text-2xl mb-1">{rankBadge.icon}</div>
                      <div className="text-xs text-muted-foreground">{rankBadge.label}</div>
                    </div>

                    {/* Trending Badge */}
                    {goat.trending && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Trending
                      </motion.div>
                    )}
                  </div>

                  {/* Overall Score */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute -bottom-8 left-1/2 -translate-x-1/2 glass-strong rounded-xl px-6 py-4 text-center gold-glow"
                  >
                    <div className="text-xs text-muted-foreground mb-1">OVERALL SCORE</div>
                    <div className="font-serif text-4xl font-bold gold-text">
                      <AnimatedCounter value={goat.overallScore} decimals={1} />
                    </div>
                  </motion.div>
                </motion.div>
              </FadeIn>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2 pt-4 lg:pt-8">
              <FadeIn delay={0.1}>
                {/* Domain Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {goat.subdomain}
                  </span>
                  <span className="px-3 py-1 bg-secondary rounded-full text-sm text-muted-foreground">
                    {goat.domain.charAt(0).toUpperCase() + goat.domain.slice(1)}
                  </span>
                </div>

                {/* Name & Nickname */}
                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-2">
                  {goat.name}
                </h1>
                <p className="text-xl text-accent italic mb-6">
                  "{goat.nickname}"
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {goat.country}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {goat.era.join(' - ')}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                  {goat.bio}
                </p>

                {/* Vote Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="glass rounded-lg p-4 text-center">
                    <Users className="w-5 h-5 text-accent mx-auto mb-2" />
                    <div className="font-serif text-2xl font-bold">
                      <AnimatedCounter value={goat.fanVotes / 1000000} decimals={1} suffix="M" />
                    </div>
                    <div className="text-xs text-muted-foreground">Fan Votes</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <Award className="w-5 h-5 text-accent mx-auto mb-2" />
                    <div className="font-serif text-2xl font-bold">
                      <AnimatedCounter value={goat.expertVotes} />
                    </div>
                    <div className="text-xs text-muted-foreground">Expert Votes</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <Crown className="w-5 h-5 text-accent mx-auto mb-2" />
                    <div className="font-serif text-2xl font-bold">
                      #{goat.rank}
                    </div>
                    <div className="text-xs text-muted-foreground">Overall Rank</div>
                  </div>
                  <div className="glass rounded-lg p-4 text-center">
                    <TrendingUp className="w-5 h-5 text-accent mx-auto mb-2" />
                    <div className="font-serif text-2xl font-bold">
                      <AnimatedCounter value={goat.achievements.length} />
                    </div>
                    <div className="text-xs text-muted-foreground">Achievements</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <Link to="/vote">
                    <Button className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      Vote for {goat.name.split(' ')[0]}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    onClick={() => addToCompare(goat)}
                    disabled={isInCompare || compareGoats.length >= 2}
                    className={cn(isInCompare && 'bg-accent/20')}
                  >
                    {isInCompare ? '✓ Added to Compare' : 'Add to Compare'}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Stats & Radar Chart */}
      <section className="py-16 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Radar Chart */}
            <FadeIn>
              <div className="card-elevated rounded-xl p-6 border border-border/50">
                <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                  <Crown className="w-6 h-6 text-accent" />
                  Skill Breakdown
                </h2>
                <RadarChart stats={goat.stats} />
              </div>
            </FadeIn>

            {/* Achievements */}
            <FadeIn delay={0.1}>
              <div className="card-elevated rounded-xl p-6 border border-border/50">
                <h2 className="font-serif text-2xl font-bold mb-6 flex items-center gap-2">
                  <Award className="w-6 h-6 text-accent" />
                  Key Achievements
                </h2>
                <div className="space-y-3">
                  {goat.achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 p-3 glass rounded-lg"
                    >
                      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-medium">{achievement}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Expert Commentary */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <h2 className="font-serif text-3xl font-bold mb-8 text-center">
              Expert Commentary
            </h2>
          </FadeIn>
          
          <div className="max-w-3xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="glass rounded-xl p-8">
                <div className="flex items-start gap-4">
                  <img
                    src={experts[0].avatar}
                    alt={experts[0].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-accent/50"
                  />
                  <div>
                    <p className="text-lg italic text-foreground/90 mb-4">
                      "{goat.name} represents the pinnacle of excellence in {goat.subdomain}. 
                      Their combination of skill, determination, and impact on the game is 
                      virtually unmatched. The numbers tell one story, but watching them 
                      perform told an even greater one."
                    </p>
                    <div>
                      <p className="font-medium">{experts[0].name}</p>
                      <p className="text-sm text-muted-foreground">{experts[0].title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Fan Reactions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-3xl font-bold flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-accent" />
                Fan Reactions
              </h2>
              <Button variant="outline" size="sm">
                View All
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { user: 'SportsGuru23', text: 'No debate needed. GOAT status confirmed! 🐐', likes: 2341 },
              { user: 'HistoryBuff', text: 'When you consider the era they played in, the dominance is even more impressive.', likes: 1829 },
              { user: 'FanForever', text: 'Watched every game. The clutch performances in big moments were unreal.', likes: 1456 },
            ].map((reaction, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="glass rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="font-medium text-sm">@{reaction.user}</span>
                  </div>
                  <p className="text-foreground/80 mb-3">{reaction.text}</p>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <ThumbsUp className="w-4 h-4" />
                    {reaction.likes.toLocaleString()}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="font-serif text-3xl font-bold mb-4">
                Is {goat.name.split(' ')[0]} Your GOAT?
              </h2>
              <p className="text-muted-foreground mb-8">
                Cast your vote and help shape the definitive rankings.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/vote">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 gold-glow">
                    Vote Now
                  </Button>
                </Link>
                <Link to="/compare">
                  <Button size="lg" variant="outline">
                    Compare GOATs
                  </Button>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </Layout>
  );
}
