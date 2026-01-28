import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Debate } from '@/types/goat';

export function useDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', categoryId],
        queryFn: async () => {
            const params = categoryId ? { categoryId } : {};
            const { data } = await api.get<Debate[]>('/debates', { params });
            return data;
        },
    });
}

export function useDebate(id: string) {
    return useQuery({
        queryKey: ['debate', id],
        queryFn: async () => {
            const { data } = await api.get<Debate>(`/debates/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useTrendingDebates(categoryId?: string) {
    return useQuery({
        queryKey: ['debates', 'trending', categoryId],
        queryFn: async () => {
            const params = { trending: true, ...(categoryId ? { categoryId } : {}) };
            const { data } = await api.get<Debate[]>('/debates', { params });
            return data;
        },
    });
}
