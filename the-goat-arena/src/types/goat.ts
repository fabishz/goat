export type Domain = 'sports' | 'music' | 'politics' | 'entertainment' | 'science';

export type Era = '1900s' | '1950s' | '1960s' | '1970s' | '1980s' | '1990s' | '2000s' | '2010s' | '2020s';

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
  domain: Domain;
  subdomain: string;
  era: Era[];
  image: string;
  country: string;
  overallScore: number;
  stats: GoatStats;
  achievements: string[];
  bio: string;
  expertVotes: number;
  fanVotes: number;
  trending: boolean;
  rank: number;
}

export interface Vote {
  id: string;
  goatId: string;
  userId: string;
  weight: number;
  reason: string;
  createdAt: Date;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  avatar: string;
  specialty: Domain;
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
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  influenceWeight: number;
  votesCount: number;
  achievements: string[];
}
