import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationService } from '../services/notificationService';
import { useApp } from '../context/AppContext';

export function useNotifications(limit: number = 50) {
  const { user } = useApp();

  return useQuery({
    queryKey: ['notifications', { limit }],
    queryFn: async () => {
      if (!user) return { notifications: [], error: 'Não autenticado' };
      const result = await notificationService.getNotifications(user.id, limit);
      return result;
    },
    enabled: !!user,
  });
}

export function useUnreadNotificationsCount() {
  const { user } = useApp();

  return useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      if (!user) return 0;
      const count = await notificationService.getUnreadCount(user.id);
      return count;
    },
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await notificationService.markAsRead(notificationId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  const { user } = useApp();

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Não autenticado');
      const result = await notificationService.markAllAsRead(user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
