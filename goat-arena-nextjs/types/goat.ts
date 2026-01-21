export type Domain = 'sports' | 'music' | 'politics' | 'entertainment' | 'science' | 'culture' | 'custom';

export type Era = '1900s' | '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

export type Region = 'Global' | 'North America' | 'Europe' | 'Asia' | 'South America' | 'Africa' | 'Oceania';

export interface GoatStats {
  achievements: number;
  influence: number;
  awards: number;
  longevity: number;
  impact: number;
  legacy: number;
}

export interface Goat {
  id: string;
  name: string;
  nickname: string;
  categoryId: string; // Strict category scoping
  domain: Domain;
  subdomain: string;
  era: Era[];
  region: Region;
  role?: string;
  image: string; // Real photo URL
  country: string;
  overallScore: number;
  stats: GoatStats;
  achievements: string[];
  bio: string;
  expertVotes: number;
  fanVotes: number;
  trending: boolean;
  rank: number;
  historicalRankings?: { year: number; rank: number }[];
}

export interface Vote {
  id: string;
  goatId: string;
  userId: string;
  weight: number;
  reason: string;
  confidence: number; // 0-100
  type: 'fan' | 'expert';
  createdAt: Date;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: Domain;
}

export interface Argument {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: 'pro' | 'con';
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface Debate {
  id: string;
  title: string;
  goat1: Goat;
  goat2: Goat;
  votes1: number;
  votes2: number;
  comments: number;
  trending: boolean;
  arguments: Argument[];
  aiSummary?: string;
  strongestArguments?: { pro: string; con: string };
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  influenceWeight: number;
  votesCount: number;
  debatesJoined: number;
  accuracyScore: number; // vs experts
  achievements: string[];
  badges: Badge[];
  contributionPoints: number;
  level: number;
  role: 'user' | 'expert' | 'admin';
}

export interface GoatSubmission {
  id: string;
  userId: string;
  name: string;
  domain: Domain;
  subdomain: string;
  era: Era[];
  region: Region;
  evidenceLinks: string[];
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  domain: Domain;
  description: string;
  icon: string;
  colorTheme?: string; // For category-specific themes
  trendingGoats: Goat[];
}
