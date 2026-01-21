import { useQuery } from '@tanstack/react-query';
import { debates } from '@/lib/mock-data';
import { Debate } from '@/types/goat';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', categoryId],
        queryFn: async () => {
            await delay(800);
            if (categoryId) {
                return debates.filter(d => d.goat1.categoryId === categoryId);
            }
            return debates;
        },
    });
}

export function useDebate(id: string) {
    return useQuery({
        queryKey: ['debate', id],
        queryFn: async () => {
            await delay(500);
            const debate = debates.find(d => d.id === id);
            if (!debate) throw new Error('Debate not found');
            return debate;
        },
        enabled: !!id,
    });
}

export function useTrendingDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', 'trending', categoryId],
        queryFn: async () => {
            await delay(600);
            let result = debates.filter(d => d.trending);
            if (categoryId) {
                result = result.filter(d => d.goat1.categoryId === categoryId);
            }
            return result;
        },
    });
}
