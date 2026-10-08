import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prayerService } from '../services/prayerService';
import { useApp } from '../context/AppContext';

export function usePrayerIntentions(limit: number = 50) {
  return useQuery({
    queryKey: ['prayer-intentions', { limit }],
    queryFn: async () => {
      const result = await prayerService.getIntentions(limit);
      return result;
    },
  });
}

export function useCreatePrayerIntention() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (data: { content: string; category?: string; visibility?: any; is_anonymous?: boolean }) => {
      if (!user) throw new Error('Não autenticado');
      const result = await prayerService.createIntention(user.id, data);
      if (result.error) throw new Error(result.error);
      return result.intention;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-intentions'] });
    },
  });
}

export function useSupportPrayer() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (intentionId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await prayerService.supportIntention(intentionId, user.id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-intentions'] });
    },
  });
}

export function useDeletePrayerIntention() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (intentionId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await prayerService.deleteIntention(intentionId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-intentions'] });
    },
  });
}
