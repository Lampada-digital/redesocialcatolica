import { supabase, isDemoMode } from '../lib/supabase';
import type { Notification, NotificationType } from '../types/database';

export const notificationService = {
  async createNotification(
    userId: string,
    type: NotificationType,
    content: string,
    fromUserId?: string,
    entityType?: string,
    entityId?: string,
    link?: string
  ): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: null }; // Silent in demo mode
    }

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          content,
          from_user_id: fromUserId || null,
          entity_type: entityType || null,
          entity_id: entityId || null,
          link: link || null,
        });

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao criar notificação' };
    }
  },

  async getNotifications(userId: string, limit: number = 50): Promise<{ notifications: Notification[]; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { notifications: [], error: 'Modo demo: notificações não disponíveis' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('notifications')
        .select(`
          *,
          from_user:profiles!from_user_id(id, display_name, username, avatar_url)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) return { notifications: [], error: error.message };
      return { notifications: data || [], error: null };
    } catch (err) {
      return { notifications: [], error: 'Erro ao carregar notificações' };
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    if (isDemoMode || !supabase) {
      return 0;
    }

    try {
      const { count } = await (supabase as any)
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      return count || 0;
    } catch (err) {
      return 0;
    }
  },

  async markAsRead(notificationId: string, userId: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: 'Modo demo: não é possível marcar como lida' };
    }

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao marcar como lida' };
    }
  },

  async markAllAsRead(userId: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: 'Modo demo: não é possível marcar como lidas' };
    }

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao marcar todas como lidas' };
    }
  },

  async deleteNotification(notificationId: string, userId: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: 'Modo demo: não é possível excluir' };
    }

    try {
      const { error } = await (supabase as any)
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', userId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao excluir notificação' };
    }
  },

  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    if (isDemoMode || !supabase) {
      return { unsubscribe: () => {} };
    }

    const subscription = (supabase as any)
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload: any) => {
        callback(payload.new);
      })
      .subscribe();

    return {
      unsubscribe: () => {
        (supabase as any).removeChannel(subscription);
      },
    };
  },
};
