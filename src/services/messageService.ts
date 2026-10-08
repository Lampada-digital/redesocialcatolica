import { supabase, isDemoMode } from '../lib/supabase';
import type { Conversation, Message } from '../types/database';

export const messageService = {
  async createConversation(userId: string, participantIds: string[], isGroup: boolean = false, groupName?: string): Promise<{ conversation: Conversation | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { conversation: null, error: 'Modo demo: não é possível criar conversas' };
    }

    try {
      const { data: conversation, error } = await (supabase as any)
        .from('conversations')
        .insert({
          is_group: isGroup,
          group_name: groupName || null,
        })
        .select()
        .single();

      if (error) return { conversation: null, error: error.message };

      // Add all participants
      const members = [userId, ...participantIds].map(id => ({
        conversation_id: conversation.id,
        user_id: id,
        role: id === userId ? 'ADMIN' : 'MEMBER',
      }));

      await (supabase as any)
        .from('conversation_members')
        .insert(members);

      return { conversation, error: null };
    } catch (err) {
      return { conversation: null, error: 'Erro ao criar conversa' };
    }
  },

  async getConversations(userId: string): Promise<{ conversations: Conversation[]; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { conversations: [], error: 'Modo demo: conversas não disponíveis' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('conversation_members')
        .select(`
          conversation:conversations(*),
          last_read_at
        `)
        .eq('user_id', userId)
        .order('conversation(last_message_at)', { ascending: false });

      if (error) return { conversations: [], error: error.message };
      const conversations = data?.map((m: any) => m.conversation) || [];
      return { conversations, error: null };
    } catch (err) {
      return { conversations: [], error: 'Erro ao carregar conversas' };
    }
  },

  async sendMessage(conversationId: string, userId: string, content: string): Promise<{ message: Message | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { message: null, error: 'Modo demo: não é possível enviar mensagens' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: userId,
          content,
        })
        .select()
        .single();

      if (error) return { message: null, error: error.message };
      return { message: data, error: null };
    } catch (err) {
      return { message: null, error: 'Erro ao enviar mensagem' };
    }
  },

  async getMessages(conversationId: string, limit: number = 50, cursor?: string): Promise<{ messages: Message[]; error: string | null; nextCursor?: string }> {
    if (isDemoMode || !supabase) {
      return { messages: [], error: 'Modo demo: mensagens não disponíveis' };
    }

    try {
      let query = (supabase as any)
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_id(id, display_name, username, avatar_url)
        `)
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;

      if (error) return { messages: [], error: error.message };

      const messages = (data || []).reverse();
      const nextCursor = messages.length === limit ? messages[0].created_at : undefined;

      return { messages, error: null, nextCursor };
    } catch (err) {
      return { messages: [], error: 'Erro ao carregar mensagens' };
    }
  },

  async markAsRead(conversationId: string, userId: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: 'Modo demo: não é possível marcar como lida' };
    }

    try {
      const { error } = await (supabase as any)
        .from('conversation_members')
        .update({ last_read_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao marcar como lida' };
    }
  },

  async getUnreadCount(conversationId: string, userId: string): Promise<number> {
    if (isDemoMode || !supabase) {
      return 0;
    }

    try {
      const { data: member } = await (supabase as any)
        .from('conversation_members')
        .select('last_read_at')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .single();

      if (!member?.last_read_at) return 0;

      const { count } = await (supabase as any)
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .gt('created_at', member.last_read_at);

      return count || 0;
    } catch (err) {
      return 0;
    }
  },

  subscribeToMessages(conversationId: string, callback: (message: Message) => void) {
    if (isDemoMode || !supabase) {
      return { unsubscribe: () => {} };
    }

    const subscription = (supabase as any)
      .channel(`messages:${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
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
