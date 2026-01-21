import { useQuery } from '@tanstack/react-query';
import { goats } from '@/lib/mock-data';
import { Goat } from '@/types/goat';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', categoryId],
        queryFn: async () => {
            await delay(800);
            if (categoryId) {
                return goats.filter(g => g.categoryId === categoryId);
            }
            return goats;
        },
    });
}

export function useGoat(id: string) {
    return useQuery({
        queryKey: ['goat', id],
        queryFn: async () => {
            await delay(500);
            const goat = goats.find(g => g.id === id);
            if (!goat) throw new Error('GOAT not found');
            return goat;
        },
        enabled: !!id,
    });
}

export function useTrendingGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', 'trending', categoryId],
        queryFn: async () => {
            await delay(600);
            let result = goats.filter(g => g.trending);
            if (categoryId) {
                result = result.filter(g => g.categoryId === categoryId);
            }
            return result;
        },
    });
}
