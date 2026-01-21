import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Award, Vote, History, TrendingUp, Star, Crown, ChevronRight, Settings, LogOut } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { FadeIn } from '@/components/animations/FadeIn';
import { AnimatedCounter } from '@/components/animations/AnimatedCounter';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { goats } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'John Champion',
    email: 'john@goatvoter.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    influenceWeight: 1.2,
    votesCount: 47,
    memberSince: 'January 2024',
    level: 'Gold Voter',
    xp: 720,
    nextLevelXp: 1000,
  };

  const recentVotes = [
    { goat: goats[0], date: '2 hours ago' },
    { goat: goats[2], date: '1 day ago' },
    { goat: goats[3], date: '3 days ago' },
  ];

  const achievements = [
    { id: 1, name: 'First Vote', description: 'Cast your first GOAT vote', icon: Vote, unlocked: true },
    { id: 2, name: 'Debate Starter', description: 'Join 5 GOAT debates', icon: TrendingUp, unlocked: true },
    { id: 3, name: 'Expert Voice', description: 'Get 100 upvotes on comments', icon: Star, unlocked: true },
    { id: 4, name: 'GOAT Connoisseur', description: 'Vote in all categories', icon: Crown, unlocked: false },
    { id: 5, name: 'Influencer', description: 'Reach 2x vote weight', icon: Award, unlocked: false },
  ];

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card */}
            <div className="lg:col-span-1">
              <FadeIn>
                <div className="card-elevated rounded-xl border border-border/50 overflow-hidden sticky top-24">
                  {/* Header Background */}
                  <div className="h-24 bg-gradient-to-r from-accent/30 to-primary/30" />
                  
                  {/* Avatar & Basic Info */}
                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-24 h-24 rounded-full object-cover border-4 border-card mx-auto"
                      />
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground text-xs font-bold px-3 py-1 rounded-full">
                        {user.level}
                      </div>
                    </div>

                    <div className="text-center mb-6">
                      <h1 className="font-serif text-2xl font-bold">{user.name}</h1>
                      <p className="text-muted-foreground text-sm">{user.email}</p>
                      <p className="text-muted-foreground text-xs mt-1">Member since {user.memberSince}</p>
                    </div>

                    {/* Level Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Level Progress</span>
                        <span className="text-accent">{user.xp} / {user.nextLevelXp} XP</span>
                      </div>
                      <Progress value={(user.xp / user.nextLevelXp) * 100} className="h-2" />
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="glass rounded-lg p-3 text-center">
                        <Vote className="w-5 h-5 text-accent mx-auto mb-1" />
                        <div className="font-serif font-bold text-xl">
                          <AnimatedCounter value={user.votesCount} />
                        </div>
                        <p className="text-xs text-muted-foreground">Total Votes</p>
                      </div>
                      <div className="glass rounded-lg p-3 text-center">
                        <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
                        <div className="font-serif font-bold text-xl">
                          {user.influenceWeight}x
                        </div>
                        <p className="text-xs text-muted-foreground">Vote Weight</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        Account Settings
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column - Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vote History */}
              <FadeIn delay={0.1}>
                <div className="card-elevated rounded-xl border border-border/50 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-serif text-xl font-bold flex items-center gap-2">
                      <History className="w-5 h-5 text-accent" />
                      Recent Votes
                    </h2>
                    <Button variant="ghost" size="sm">
                      View All
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {recentVotes.map((vote, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={vote.goat.image}
                            alt={vote.goat.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-accent/50"
                          />
                          <div>
                            <p className="font-medium">{vote.goat.name}</p>
                            <p className="text-sm text-muted-foreground">{vote.goat.subdomain}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">{vote.date}</p>
                          <p className="text-xs text-accent">+10 XP</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 text-center">
                    <Link to="/vote">
                      <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                        <Vote className="w-4 h-4 mr-2" />
                        Cast New Vote
                      </Button>
                    </Link>
                  </div>
                </div>
              </FadeIn>

              {/* Achievements */}
              <FadeIn delay={0.2}>
                <div className="card-elevated rounded-xl border border-border/50 p-6">
                  <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                    <Award className="w-5 h-5 text-accent" />
                    Achievements
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {achievements.map((achievement, index) => (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={cn(
                          'glass rounded-lg p-4 flex items-center gap-4 transition-all',
                          achievement.unlocked 
                            ? 'border border-accent/30' 
                            : 'opacity-50 grayscale'
                        )}
                      >
                        <div className={cn(
                          'w-12 h-12 rounded-full flex items-center justify-center',
                          achievement.unlocked 
                            ? 'bg-accent/20 text-accent' 
                            : 'bg-muted text-muted-foreground'
                        )}>
                          <achievement.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            {achievement.name}
                            {achievement.unlocked && (
                              <span className="text-xs bg-accent/20 text-accent px-2 py-0.5 rounded-full">
                                Unlocked
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </FadeIn>

              {/* Influence Breakdown */}
              <FadeIn delay={0.3}>
                <div className="card-elevated rounded-xl border border-border/50 p-6">
                  <h2 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">
                    <Star className="w-5 h-5 text-accent" />
                    Your Influence
                  </h2>

                  <div className="glass rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-3xl font-serif font-bold gold-text">{user.influenceWeight}x</p>
                        <p className="text-sm text-muted-foreground">Current Vote Weight</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">2.0x</p>
                        <p className="text-xs text-muted-foreground">Next Level</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Base Weight</span>
                          <span>1.0x</span>
                        </div>
                        <Progress value={100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Activity Bonus</span>
                          <span className="text-accent">+0.15x</span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Accuracy Bonus</span>
                          <span className="text-accent">+0.05x</span>
                        </div>
                        <Progress value={25} className="h-2" />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mt-6">
                      Vote regularly and accurately to increase your influence weight. 
                      Higher weight means your votes have more impact on rankings.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
