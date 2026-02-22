import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Goat } from '@/types/goat';
import { goats as mockGoats } from '@/lib/mock-data';

function filterTrending(goats: Goat[]) {
    return goats.filter((g) => g.trending);
}

export function useGoats(categoryId?: string) {
    return useQuery({
        queryKey: ['goats', categoryId],
        queryFn: async () => {
            try {
                if (categoryId) {
                    const { data } = await api.get<Goat[]>(`/categories/${categoryId}/goats`);
                    return data;
                }
                const { data } = await api.get<Goat[]>('/entities');
                return data;
            } catch (error) {
                console.warn('Using mock goats data: API unavailable');
                return categoryId ? mockGoats.filter((g) => g.categoryId === categoryId) : mockGoats;
            }
        },
    });
}

export function useGoat(id: string, categoryId?: string) {
    return useQuery({
        queryKey: ['goat', id, categoryId],
        queryFn: async () => {
            try {
                if (categoryId) {
                    const { data } = await api.get<Goat>(`/categories/${categoryId}/goats/${id}`);
                    return data;
                }
                const { data } = await api.get<Goat>(`/entities/${id}`);
                return data;
            } catch (error) {
                console.warn('Using mock goat data: API unavailable');
                const goat = mockGoats.find((g) => g.id === id);
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
                if (categoryId) {
                    const { data } = await api.get<Goat[]>(`/categories/${categoryId}/goats`);
                    return filterTrending(data);
                }
                const { data } = await api.get<Goat[]>('/entities');
                return filterTrending(data);
            } catch (error) {
                console.warn('Using mock trending goats: API unavailable');
                const filtered = categoryId
                    ? mockGoats.filter((g) => g.categoryId === categoryId && g.trending)
                    : filterTrending(mockGoats);
                return filtered;
            }
        },
    });
}
