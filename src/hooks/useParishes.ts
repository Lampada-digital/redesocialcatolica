import { useQuery } from '@tanstack/react-query';
import { parishService } from '../services/parishService';

export function useParishes(limit: number = 50, dioceseId?: string) {
  return useQuery({
    queryKey: ['parishes', { limit, dioceseId }],
    queryFn: async () => {
      const result = await parishService.getParishes(limit, dioceseId);
      return result;
    },
  });
}

export function useParish(slug: string) {
  return useQuery({
    queryKey: ['parish', slug],
    queryFn: async () => {
      const result = await parishService.getParish(slug);
      return result;
    },
    enabled: !!slug,
  });
}

export function useDioceses(limit: number = 50) {
  return useQuery({
    queryKey: ['dioceses', { limit }],
    queryFn: async () => {
      const result = await parishService.getDioceses(limit);
      return result;
    },
  });
}

export function useSearchParishes(query: string, limit: number = 20) {
  return useQuery({
    queryKey: ['search-parishes', { query, limit }],
    queryFn: async () => {
      if (!query) return { parishes: [], error: null };
      const result = await parishService.searchParishes(query, limit);
      return result;
    },
    enabled: query.length > 0,
  });
}
