import { supabase, isDemoMode } from '../lib/supabase';
import type { Comment } from '../types/database';

export const commentService = {
  async createComment(postId: string, userId: string, content: string, parentId?: string): Promise<{ comment: Comment | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { comment: null, error: 'Modo demo: não é possível criar comentários' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('comments')
        .insert({
          post_id: postId,
          author_id: userId,
          content,
          parent_id: parentId || null,
        })
        .select(`
          *,
          author:profiles!author_id(id, display_name, username, avatar_url, is_verified)
        `)
        .single();

      if (error) return { comment: null, error: error.message };
      return { comment: data, error: null };
    } catch (err) {
      return { comment: null, error: 'Erro ao criar comentário' };
    }
  },

  async getComments(postId: string, limit: number = 50): Promise<{ comments: Comment[]; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { comments: [], error: 'Modo demo: comentários não disponíveis' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('comments')
        .select(`
          *,
          author:profiles!author_id(id, display_name, username, avatar_url, is_verified)
        `)
        .eq('post_id', postId)
        .is('parent_id', null)
        .order('created_at', { ascending: true })
        .limit(limit);

      if (error) return { comments: [], error: error.message };
      return { comments: data || [], error: null };
    } catch (err) {
      return { comments: [], error: 'Erro ao carregar comentários' };
    }
  },

  async getReplies(commentId: string): Promise<{ replies: Comment[]; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { replies: [], error: 'Modo demo: respostas não disponíveis' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('comments')
        .select(`
          *,
          author:profiles!author_id(id, display_name, username, avatar_url, is_verified)
        `)
        .eq('parent_id', commentId)
        .order('created_at', { ascending: true });

      if (error) return { replies: [], error: error.message };
      return { replies: data || [], error: null };
    } catch (err) {
      return { replies: [], error: 'Erro ao carregar respostas' };
    }
  },

  async updateComment(commentId: string, userId: string, content: string): Promise<{ comment: Comment | null; error: string | null }> {
    if (isDemoMode || !supabase) {
      return { comment: null, error: 'Modo demo: não é possível editar' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('author_id', userId)
        .select()
        .single();

      if (error) return { comment: null, error: error.message };
      return { comment: data, error: null };
    } catch (err) {
      return { comment: null, error: 'Erro ao editar comentário' };
    }
  },

  async deleteComment(commentId: string, userId: string): Promise<{ error: string | null }> {
    if (isDemoMode || !supabase) {
      return { error: 'Modo demo: não é possível excluir' };
    }

    try {
      const { error } = await (supabase as any)
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', userId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao excluir comentário' };
    }
  },
};
