"use client";
import { create } from 'zustand';
import { Goat, Domain, Era, User } from '@/types/goat';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  token: string | null;

  // Context
  currentCategoryId: string | null;

  // Filters
  selectedDomain: Domain | null;
  selectedEras: Era[];
  selectedRegion: string | null;
  selectedRole: string | null;
  sortBy: 'score' | 'achievements' | 'influence' | 'votes';

  // Compare
  compareGoats: Goat[];

  // Voting
  currentVote: {
    goatId: string | null;
    step: number;
    reason: string;
  };

  // Onboarding
  isOnboardingCompleted: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
  completeOnboarding: () => void;
  setDomain: (domain: Domain | null) => void;
  setEras: (eras: Era[]) => void;
  setRegion: (region: string | null) => void;
  setRole: (role: string | null) => void;
  setSortBy: (sort: 'score' | 'achievements' | 'influence' | 'votes') => void;
  setCurrentCategory: (categoryId: string | null) => void;
  addToCompare: (goat: Goat) => void;
  removeFromCompare: (goatId: string) => void;
  clearCompare: () => void;
  setVoteStep: (step: number) => void;
  setVoteGoat: (goatId: string) => void;
  setVoteReason: (reason: string) => void;
  resetVote: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  token: typeof window !== 'undefined' ? localStorage.getItem('arena_token') : null,
  currentCategoryId: null,
  selectedDomain: null,
  selectedEras: [],
  selectedRegion: null,
  selectedRole: null,
  sortBy: 'score',
  compareGoats: [],
  currentVote: {
    goatId: null,
    step: 1,
    reason: '',
  },
  isOnboardingCompleted: typeof window !== 'undefined' ? localStorage.getItem('onboarding_completed') === 'true' : false,

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('arena_token', token);
    } else {
      localStorage.removeItem('arena_token');
    }
    set({ token });
  },
  login: (token, user) => {
    localStorage.setItem('arena_token', token);
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('arena_token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  checkAuth: async () => {
    const token = localStorage.getItem('arena_token');
    if (!token) {
      set({ isInitializing: false });
      return;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const backendUser = await response.json();

      // Map backend user to frontend User interface
      const user: User = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.full_name || backendUser.email.split('@')[0],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${backendUser.id}`,
        level: 1, // Default for now
        contributionPoints: 0,
        accuracyScore: 0,
        influenceWeight: backendUser.role === 'expert' ? 2.5 : 1.0,
        votesCount: 0,
        debatesJoined: 0,
        achievements: [],
        badges: [],
        role: backendUser.role as 'user' | 'expert' | 'admin',
      };

      set({ user, isAuthenticated: true, isInitializing: false, token });
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem('arena_token');
      set({ token: null, user: null, isAuthenticated: false, isInitializing: false });
    }
  },
  completeOnboarding: () => {
    localStorage.setItem('onboarding_completed', 'true');
    set({ isOnboardingCompleted: true });
  },

  setDomain: (domain) => set({ selectedDomain: domain }),
  setEras: (eras) => set({ selectedEras: eras }),
  setRegion: (region) => set({ selectedRegion: region }),
  setRole: (role) => set({ selectedRole: role }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setCurrentCategory: (categoryId) => set({ currentCategoryId: categoryId }),

  addToCompare: (goat) => set((state) => {
    if (state.compareGoats.length >= 2) return state;
    if (state.compareGoats.find(g => g.id === goat.id)) return state;

    // Enforce category scoping for comparison
    if (state.compareGoats.length > 0 && state.compareGoats[0].categoryId !== goat.categoryId) {
      console.warn("Cross-category comparison blocked");
      return state;
    }

    return { compareGoats: [...state.compareGoats, goat] };
  }),

  removeFromCompare: (goatId) => set((state) => ({
    compareGoats: state.compareGoats.filter(g => g.id !== goatId)
  })),

  clearCompare: () => set({ compareGoats: [] }),

  setVoteStep: (step) => set((state) => ({
    currentVote: { ...state.currentVote, step }
  })),

  setVoteGoat: (goatId) => set((state) => ({
    currentVote: { ...state.currentVote, goatId, step: 1 }
  })),

  setVoteReason: (reason) => set((state) => ({
    currentVote: { ...state.currentVote, reason }
  })),

  resetVote: () => set({
    currentVote: { goatId: null, step: 1, reason: '' }
  }),
}));
