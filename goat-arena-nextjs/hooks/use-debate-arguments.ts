import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Argument } from '@/types/goat';

function getAuthHeaders() {
    if (typeof window === 'undefined') return {};
    const token = localStorage.getItem('arena_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useDebateArguments(debateId: string) {
    return useQuery({
        queryKey: ['debate-arguments', debateId],
        queryFn: async () => {
            const { data } = await api.get<Argument[]>(`/debates/${debateId}/arguments`);
            return data;
        },
        enabled: !!debateId,
    });
}

export function useCreateDebateArgument(debateId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { content: string; type: 'pro' | 'con' }) => {
            const { data } = await api.post<Argument>(
                `/debates/${debateId}/arguments`,
                payload,
                { headers: getAuthHeaders() }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debate-arguments', debateId] });
            queryClient.invalidateQueries({ queryKey: ['debate', debateId] });
        },
    });
}

export function useVoteDebateArgument(debateId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (payload: { argumentId: string; direction: 'up' | 'down' }) => {
            const { data } = await api.post<Argument>(
                `/debates/${debateId}/arguments/${payload.argumentId}/vote`,
                { direction: payload.direction },
                { headers: getAuthHeaders() }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['debate-arguments', debateId] });
        },
    });
}
