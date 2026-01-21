import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Filter, SortAsc, Grid, List, Search } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { GoatCard } from '@/components/cards/GoatCard';
import { SkeletonCard } from '@/components/ui/skeleton-card';
import { FadeIn } from '@/components/animations/FadeIn';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { goats, domains, eras } from '@/lib/mock-data';
import { useAppStore } from '@/stores/app-store';
import { Domain, Era } from '@/types/goat';
import { cn } from '@/lib/utils';

export default function Categories() {
  const { selectedDomain, setDomain, selectedEras, setEras, sortBy, setSortBy } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(false);

  const filteredGoats = useMemo(() => {
    let result = [...goats];

    // Filter by domain
    if (selectedDomain) {
      result = result.filter(g => g.domain === selectedDomain);
    }

    // Filter by eras
    if (selectedEras.length > 0) {
      result = result.filter(g => g.era.some(e => selectedEras.includes(e)));
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(g => 
        g.name.toLowerCase().includes(query) ||
        g.nickname.toLowerCase().includes(query) ||
        g.subdomain.toLowerCase().includes(query)
      );
    }

    // Sort
    switch (sortBy) {
      case 'achievements':
        result.sort((a, b) => b.stats.achievements - a.stats.achievements);
        break;
      case 'influence':
        result.sort((a, b) => b.stats.influence - a.stats.influence);
        break;
      case 'votes':
        result.sort((a, b) => b.fanVotes - a.fanVotes);
        break;
      default:
        result.sort((a, b) => b.overallScore - a.overallScore);
    }

    return result;
  }, [selectedDomain, selectedEras, searchQuery, sortBy]);

  const handleDomainChange = (domain: Domain | null) => {
    setIsLoading(true);
    setDomain(domain);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleEraToggle = (era: Era) => {
    if (selectedEras.includes(era)) {
      setEras(selectedEras.filter(e => e !== era));
    } else {
      setEras([...selectedEras, era]);
    }
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <FadeIn>
            <div className="mb-8">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
                GOAT <span className="gold-text">Rankings</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl">
                Explore the greatest across all domains. Filter by category, era, and sort to find your GOATs.
              </p>
            </div>
          </FadeIn>

          {/* Filters */}
          <FadeIn delay={0.1}>
            <div className="glass rounded-xl p-6 mb-8">
              {/* Search & View Toggle */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search GOATs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className={viewMode === 'grid' ? 'bg-accent text-accent-foreground' : ''}
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className={viewMode === 'list' ? 'bg-accent text-accent-foreground' : ''}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Domain Filters */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Domain</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedDomain === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDomainChange(null)}
                    className={selectedDomain === null ? 'bg-accent text-accent-foreground' : 'border-border'}
                  >
                    All
                  </Button>
                  {domains.map((domain) => (
                    <Button
                      key={domain.value}
                      variant={selectedDomain === domain.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleDomainChange(domain.value)}
                      className={selectedDomain === domain.value ? 'bg-accent text-accent-foreground' : 'border-border'}
                    >
                      <span className="mr-1">{domain.icon}</span>
                      {domain.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Era Filters */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-medium">Era</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {eras.map((era) => (
                    <Button
                      key={era}
                      variant={selectedEras.includes(era) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleEraToggle(era)}
                      className={selectedEras.includes(era) ? 'bg-primary text-primary-foreground' : 'border-border'}
                    >
                      {era}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <SortAsc className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">Sort By</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'score', label: 'Overall Score' },
                    { value: 'achievements', label: 'Achievements' },
                    { value: 'influence', label: 'Influence' },
                    { value: 'votes', label: 'Fan Votes' },
                  ].map((option) => (
                    <Button
                      key={option.value}
                      variant={sortBy === option.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSortBy(option.value as typeof sortBy)}
                      className={sortBy === option.value ? 'bg-accent text-accent-foreground' : 'border-border'}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="text-foreground font-medium">{filteredGoats.length}</span> GOATs
            </p>
            {(selectedDomain || selectedEras.length > 0 || searchQuery) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDomain(null);
                  setEras([]);
                  setSearchQuery('');
                }}
                className="text-accent hover:text-accent/80"
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            )}>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredGoats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-2xl font-serif text-muted-foreground mb-4">No GOATs Found</p>
              <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
            </motion.div>
          ) : (
            <div className={cn(
              'grid gap-6',
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            )}>
              {filteredGoats.map((goat, index) => (
                <GoatCard key={goat.id} goat={goat} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
