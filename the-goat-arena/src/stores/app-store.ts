import { create } from 'zustand';
import { Goat, Domain, Era, User } from '@/types/goat';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Filters
  selectedDomain: Domain | null;
  selectedEras: Era[];
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
  setDomain: (domain: Domain | null) => void;
  setEras: (eras: Era[]) => void;
  setSortBy: (sort: 'score' | 'achievements' | 'influence' | 'votes') => void;
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
  selectedDomain: null,
  selectedEras: [],
  sortBy: 'score',
  compareGoats: [],
  currentVote: {
    goatId: null,
    step: 1,
    reason: '',
  },
  
  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setDomain: (domain) => set({ selectedDomain: domain }),
  setEras: (eras) => set({ selectedEras: eras }),
  setSortBy: (sort) => set({ sortBy: sort }),
  
  addToCompare: (goat) => set((state) => {
    if (state.compareGoats.length >= 2) return state;
    if (state.compareGoats.find(g => g.id === goat.id)) return state;
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
