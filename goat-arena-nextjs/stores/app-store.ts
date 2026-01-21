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

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
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
      // In a real app, we would call GET /me here
      // For now, we'll simulate it if we have a token
      // const response = await fetch('/api/v1/auth/me', { headers: { Authorization: `Bearer ${token}` } });
      // const user = await response.json();

      // Mocking successful auth check
      const mockUser: User = {
        id: '1',
        email: 'john@example.com',
        name: 'John Champion',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        level: 42,
        contributionPoints: 1250,
        accuracyScore: 88,
        influenceWeight: 2.5,
        votesCount: 156,
        debatesJoined: 24,
        badges: [],
        role: 'admin'
      };

      set({ user: mockUser, isAuthenticated: true, isInitializing: false });
    } catch (error) {
      localStorage.removeItem('arena_token');
      set({ token: null, user: null, isAuthenticated: false, isInitializing: false });
    }
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
