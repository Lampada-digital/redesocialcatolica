import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityService } from '../services/communityService';
import { useApp } from '../context/AppContext';

export function useCommunities(limit: number = 50, category?: string) {
  return useQuery({
    queryKey: ['communities', { limit, category }],
    queryFn: async () => {
      const result = await communityService.getCommunities(limit, category);
      return result;
    },
  });
}

export function useCommunity(slug: string) {
  return useQuery({
    queryKey: ['community', slug],
    queryFn: async () => {
      const result = await communityService.getCommunity(slug);
      return result;
    },
    enabled: !!slug,
  });
}

export function useUserCommunities() {
  const { user } = useApp();
  return useQuery({
    queryKey: ['user-communities', user?.id],
    queryFn: async () => {
      if (!user) return { communities: [], error: 'Não autenticado' };
      const result = await communityService.getUserCommunities(user.id);
      return result;
    },
    enabled: !!user,
  });
}

export function useJoinCommunity() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (communityId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await communityService.joinCommunity(communityId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
    },
  });
}

export function useLeaveCommunity() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (communityId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await communityService.leaveCommunity(communityId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['user-communities'] });
    },
  });
}

export function useCreateCommunity() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (data: { name: string; description?: string; type?: any; category?: string }) => {
      if (!user) throw new Error('Não autenticado');
      const result = await communityService.createCommunity(user.id, data);
      if (result.error) throw new Error(result.error);
      return result.community;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
    },
  });
}
