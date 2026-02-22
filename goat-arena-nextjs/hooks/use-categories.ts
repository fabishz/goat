import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Category } from '@/types/goat';
import { categories as mockCategories } from '@/lib/mock-data';

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const { data } = await api.get<Category[]>('/categories');
                return data;
            } catch (error) {
                // Fallback to mock data if API is unavailable
                console.warn('Using mock data: API unavailable');
                return mockCategories;
            }
        },
    });
}

export function useCategory(slug: string) {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            try {
                const { data } = await api.get<Category[]>('/categories');
                const category = data.find((c) => c.slug === slug);
                if (!category) throw new Error(`Category not found: ${slug}`);
                return category;
            } catch (error) {
                console.warn('Using mock category data: API unavailable');
                const category = mockCategories.find((c) => c.slug === slug);
                if (!category) throw new Error(`Category not found: ${slug}`);
                return category;
            }
        },
        enabled: !!slug,
    });
}
