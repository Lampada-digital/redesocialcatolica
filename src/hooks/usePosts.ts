import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postService } from '../services/postService';
import { useApp } from '../context/AppContext';

export function usePosts(limit: number = 20, cursor?: string) {
  const { user } = useApp();

  return useQuery({
    queryKey: ['posts', { limit, cursor }],
    queryFn: async () => {
      if (!user) return { posts: [], error: 'Não autenticado' };
      const result = await postService.getFeed(user.id, cursor, limit);
      return result;
    },
    enabled: !!user,
  });
}

export function usePost(postId: string) {
  return useQuery({
    queryKey: ['post', postId],
    queryFn: async () => {
      const result = await postService.getPost(postId);
      return result;
    },
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await postService.createPost(user.id, { content });
      if (result.error) throw new Error(result.error);
      return result.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useLikePost() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await postService.toggleReaction(postId, user.id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}

export function useSavePost() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await postService.toggleSave(postId, user.id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await postService.deletePost(postId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
