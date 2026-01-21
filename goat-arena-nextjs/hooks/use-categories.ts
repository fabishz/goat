import { useQuery } from '@tanstack/react-query';
import { categories } from '@/lib/mock-data';
import { Category } from '@/types/goat';

// Mock API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useCategories() {
    return useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            await delay(800);
            return categories;
        },
    });
}

export function useCategory(slug: string) {
    return useQuery({
        queryKey: ['category', slug],
        queryFn: async () => {
            await delay(500);
            const category = categories.find(c => c.slug === slug);
            if (!category) throw new Error('Category not found');
            return category;
        },
        enabled: !!slug,
    });
}
