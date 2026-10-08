import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventService } from '../services/eventService';
import { useApp } from '../context/AppContext';

export function useEvents(limit: number = 50, type?: string) {
  return useQuery({
    queryKey: ['events', { limit, type }],
    queryFn: async () => {
      const result = await eventService.getEvents(limit, type as any);
      return result;
    },
  });
}

export function useEvent(slug: string) {
  return useQuery({
    queryKey: ['event', slug],
    queryFn: async () => {
      const result = await eventService.getEvent(slug);
      return result;
    },
    enabled: !!slug,
  });
}

export function useAttendEvent() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string; status?: any }) => {
      if (!user) throw new Error('Não autenticado');
      const result = await eventService.attendEvent(eventId, user.id, status);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useCancelAttendance() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (eventId: string) => {
      if (!user) throw new Error('Não autenticado');
      const result = await eventService.cancelAttendance(eventId, user.id);
      if (result.error) throw new Error(result.error);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  const { user } = useApp();
  return useMutation({
    mutationFn: async (data: any) => {
      if (!user) throw new Error('Não autenticado');
      const result = await eventService.createEvent(user.id, data);
      if (result.error) throw new Error(result.error);
      return result.event;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
