import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Category } from '@/types/goat';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const { data } = await api.get<Category[]>('/categories');
            return data;
        },
    });
}

export function useCategory(slug: string) {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            const { data } = await api.get<Category>(`/categories/${slug}`);
            return data;
        },
        enabled: !!slug,
    });
}
