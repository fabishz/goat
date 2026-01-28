import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Goat } from '@/types/goat';

export function useGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', categoryId],
        queryFn: async () => {
            const params = categoryId ? { categoryId } : {};
            const { data } = await api.get<Goat[]>('/goats', { params });
            return data;
        },
    });
}

export function useGoat(id: string) {
    return useQuery({
        queryKey: ['goat', id],
        queryFn: async () => {
            const { data } = await api.get<Goat>(`/goats/${id}`);
            return data;
        },
        enabled: !!id,
    });
}

export function useTrendingGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', 'trending', categoryId],
        queryFn: async () => {
            const params = { trending: true, ...(categoryId ? { categoryId } : {}) };
            const { data } = await api.get<Goat[]>('/goats', { params });
            return data;
        },
    });
}
