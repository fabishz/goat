import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Goat } from '@/types/goat';
import { goats as mockGoats } from '@/lib/mock-data';

export function useGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', categoryId],
        queryFn: async () => {
            try {
                const params = categoryId ? { categoryId } : {};
                const { data } = await api.get<Goat[]>('/goats', { params });
                return data;
            } catch (error) {
                console.warn('Using mock goats data: API unavailable');
                return categoryId ? mockGoats.filter(g => g.categoryId === categoryId) : mockGoats;
            }
        },
    });
}

export function useGoat(id: string) {
    return useQuery({
        queryKey: ['goat', id],
        queryFn: async () => {
            try {
                const { data } = await api.get<Goat>(`/goats/${id}`);
                return data;
            } catch (error) {
                console.warn('Using mock goat data: API unavailable');
                const goat = mockGoats.find(g => g.id === id);
                if (!goat) throw new Error(`Goat not found: ${id}`);
                return goat;
            }
        },
        enabled: !!id,
    });
}

export function useTrendingGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', 'trending', categoryId],
        queryFn: async () => {
            try {
                const params = { trending: true, ...(categoryId ? { categoryId } : {}) };
                const { data } = await api.get<Goat[]>('/goats', { params });
                return data;
            } catch (error) {
                console.warn('Using mock trending goats: API unavailable');
                const filtered = categoryId ? mockGoats.filter(g => g.categoryId === categoryId && g.trending) : mockGoats.filter(g => g.trending);
                return filtered;
            }
        },
    });
}
