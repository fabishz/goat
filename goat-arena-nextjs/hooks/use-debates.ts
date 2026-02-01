import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Debate } from '@/types/goat';
import { debates as mockDebates } from '@/lib/mock-data';

export function useDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', categoryId],
        queryFn: async () => {
            try {
                const params = categoryId ? { categoryId } : {};
                const { data } = await api.get<Debate[]>('/debates', { params });
                return data;
            } catch (error) {
                console.warn('Using mock debates data: API unavailable');
                return mockDebates;
            }
        },
    });
}

export function useDebate(id: string) {
    return useQuery({
        queryKey: ['debate', id],
        queryFn: async () => {
            try {
                const { data } = await api.get<Debate>(`/debates/${id}`);
                return data;
            } catch (error) {
                console.warn('Using mock debate data: API unavailable');
                const debate = mockDebates.find(d => d.id === id);
                if (!debate) throw new Error(`Debate not found: ${id}`);
                return debate;
            }
        },
        enabled: !!id,
    });
}

export function useTrendingDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', 'trending', categoryId],
        queryFn: async () => {
            try {
                const params = { trending: true, ...(categoryId ? { categoryId } : {}) };
                const { data } = await api.get<Debate[]>('/debates', { params });
                return data;
            } catch (error) {
                console.warn('Using mock trending debates: API unavailable');
                return mockDebates.filter(d => d.trending);
            }
        },
    });
}
