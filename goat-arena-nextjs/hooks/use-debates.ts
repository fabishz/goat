import { useQuery } from '@tanstack/react-query';
import { Debate } from '@/types/goat';
import { debates as mockDebates } from '@/lib/mock-data';

const useMockDebates = process.env.NODE_ENV !== 'production';

export function useDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', categoryId],
        queryFn: async () => {
            if (useMockDebates) {
                return categoryId ? mockDebates.filter((d) => d.categoryId === categoryId) : mockDebates;
            }
            console.warn('Debates are not available in production yet.');
            return [] as Debate[];
        },
    });
}

export function useDebate(id: string) {
    return useQuery({
        queryKey: ['debate', id],
        queryFn: async () => {
            if (useMockDebates) {
                const debate = mockDebates.find((d) => d.id === id);
                if (!debate) throw new Error(`Debate not found: ${id}`);
                return debate;
            }
            throw new Error('Debates are not available in production yet.');
        },
        enabled: !!id,
    });
}

export function useTrendingDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', 'trending', categoryId],
        queryFn: async () => {
            if (useMockDebates) {
                const base = categoryId ? mockDebates.filter((d) => d.categoryId === categoryId) : mockDebates;
                return base.filter((d) => d.trending);
            }
            console.warn('Debates are not available in production yet.');
            return [] as Debate[];
        },
    });
}
