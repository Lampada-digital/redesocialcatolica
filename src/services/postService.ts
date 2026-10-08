import { supabase } from '../lib/supabase';
import type { Post, PostVisibility } from '../types/database';

export interface CreatePostData {
  content: string;
  visibility?: PostVisibility;
  community_id?: string | null;
}

export interface PostWithAuthor extends Omit<Post, 'author'> {
  author: {
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
    is_verified: boolean;
  };
}

export const postService = {
  async createPost(userId: string, data: CreatePostData): Promise<{ post: Post | null; error: string | null }> {
    if (!supabase) {
      return { post: null, error: 'Supabase não configurado' };
    }

    try {
      const { data: post, error } = await (supabase as any)
        .from('posts')
        .insert({
          author_id: userId,
          content: data.content,
          visibility: data.visibility || 'PUBLIC',
          community_id: data.community_id || null,
        })
        .select()
        .single();

      if (error) return { post: null, error: error.message };
      return { post, error: null };
    } catch (err) {
      return { post: null, error: 'Erro ao criar publicação' };
    }
  },

  async getFeed(userId: string, cursor?: string, limit: number = 20): Promise<{ posts: PostWithAuthor[]; error: string | null; nextCursor?: string }> {
    if (!supabase) {
      return { posts: [], error: 'Supabase não configurado' };
    }

    try {
      let query = (supabase as any)
        .from('posts')
        .select(`
          *,
          author:profiles!author_id(id, display_name, username, avatar_url, is_verified)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (cursor) {
        query = query.lt('created_at', cursor);
      }

      const { data, error } = await query;

      if (error) return { posts: [], error: error.message };

      const posts = data || [];
      const nextCursor = posts.length === limit ? posts[posts.length - 1].created_at : undefined;

      return { posts, error: null, nextCursor };
    } catch (err) {
      return { posts: [], error: 'Erro ao carregar feed' };
    }
  },

  async getPost(postId: string): Promise<{ post: PostWithAuthor | null; error: string | null }> {
    if (!supabase) {
      return { post: null, error: 'Supabase não configurado' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('posts')
        .select(`
          *,
          author:profiles!author_id(id, display_name, username, avatar_url, is_verified)
        `)
        .eq('id', postId)
        .single();

      if (error) return { post: null, error: error.message };
      return { post: data, error: null };
    } catch (err) {
      return { post: null, error: 'Erro ao carregar publicação' };
    }
  },

  async updatePost(postId: string, userId: string, content: string): Promise<{ post: Post | null; error: string | null }> {
    if (!supabase) {
      return { post: null, error: 'Supabase não configurado' };
    }

    try {
      const { data, error } = await (supabase as any)
        .from('posts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', postId)
        .eq('author_id', userId)
        .select()
        .single();

      if (error) return { post: null, error: error.message };
      return { post: data, error: null };
    } catch (err) {
      return { post: null, error: 'Erro ao editar publicação' };
    }
  },

  async deletePost(postId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) {
      return { error: 'Supabase não configurado' };
    }

    try {
      const { error } = await (supabase as any)
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', userId);

      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao excluir publicação' };
    }
  },

  async toggleReaction(postId: string, userId: string, reactionType: string = 'LIKE'): Promise<{ reacted: boolean; error: string | null }> {
    if (!supabase) {
      return { reacted: false, error: 'Supabase não configurado' };
    }

    try {
      // Check if already reacted
      const { data: existing } = await (supabase as any)
        .from('post_reactions')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .eq('reaction_type', reactionType)
        .single();

      if (existing) {
        // Remove reaction
        const { error } = await (supabase as any)
          .from('post_reactions')
          .delete()
          .eq('id', existing.id);

        if (error) return { reacted: false, error: error.message };
        return { reacted: false, error: null };
      } else {
        // Add reaction
        const { error } = await (supabase as any)
          .from('post_reactions')
          .insert({
            post_id: postId,
            user_id: userId,
            reaction_type: reactionType,
          });

        if (error) return { reacted: false, error: error.message };
        return { reacted: true, error: null };
      }
    } catch (err) {
      return { reacted: false, error: 'Erro ao reagir' };
    }
  },

  async getUserReaction(postId: string, userId: string): Promise<{ reacted: boolean; reactionType: string | null }> {
    if (!supabase) {
      return { reacted: false, reactionType: null };
    }

    try {
      const { data } = await (supabase as any)
        .from('post_reactions')
        .select('reaction_type')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      return { reacted: !!data, reactionType: data?.reaction_type || null };
    } catch (err) {
      return { reacted: false, reactionType: null };
    }
  },

  async toggleSave(postId: string, userId: string): Promise<{ saved: boolean; error: string | null }> {
    if (!supabase) {
      return { saved: false, error: 'Supabase não configurado' };
    }

    try {
      // Check if already saved
      const { data: existing } = await (supabase as any)
        .from('saved_posts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Remove from saved
        const { error } = await (supabase as any)
          .from('saved_posts')
          .delete()
          .eq('id', existing.id);

        if (error) return { saved: false, error: error.message };
        return { saved: false, error: null };
      } else {
        // Save post
        const { error } = await (supabase as any)
          .from('saved_posts')
          .insert({
            post_id: postId,
            user_id: userId,
          });

        if (error) return { saved: false, error: error.message };
        return { saved: true, error: null };
      }
    } catch (err) {
      return { saved: false, error: 'Erro ao salvar' };
    }
  },

  async isPostSaved(postId: string, userId: string): Promise<boolean> {
    if (!supabase) {
      return false;
    }

    try {
      const { data } = await (supabase as any)
        .from('saved_posts')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      return !!data;
    } catch (err) {
      return false;
    }
  },
};
