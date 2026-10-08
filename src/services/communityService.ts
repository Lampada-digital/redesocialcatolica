import { supabase } from '../lib/supabase';
import type { Community, CommunityType } from '../types/database';

export interface CreateCommunityData {
  name: string;
  description?: string;
  type?: CommunityType;
  category?: string;
  rules?: string;
}

export const communityService = {
  async createCommunity(userId: string, data: CreateCommunityData): Promise<{ community: Community | null; error: string | null }> {
    if (!supabase) return { community: null, error: 'Supabase não configurado' };

    try {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const { data: community, error } = await (supabase as any)
        .from('communities')
        .insert({ name: data.name, slug, description: data.description || null, type: data.type || 'PUBLIC', category: data.category || null, rules: data.rules || null, creator_id: userId })
        .select().single();

      if (error) return { community: null, error: error.message };
      await (supabase as any).from('community_members').insert({ community_id: community.id, user_id: userId, role: 'ADMIN' });
      return { community, error: null };
    } catch (err) {
      return { community: null, error: 'Erro ao criar comunidade' };
    }
  },

  async getCommunities(limit: number = 50, category?: string): Promise<{ communities: Community[]; error: string | null }> {
    if (!supabase) return { communities: [], error: 'Supabase não configurado' };

    try {
      let query = (supabase as any).from('communities').select('*').eq('type', 'PUBLIC').order('members_count', { ascending: false }).limit(limit);
      if (category) query = query.eq('category', category);
      const { data, error } = await query;
      if (error) return { communities: [], error: error.message };
      return { communities: data || [], error: null };
    } catch (err) {
      return { communities: [], error: 'Erro ao carregar comunidades' };
    }
  },

  async getCommunity(slug: string): Promise<{ community: Community | null; error: string | null }> {
    if (!supabase) return { community: null, error: 'Supabase não configurado' };

    try {
      const { data, error } = await (supabase as any).from('communities').select('*').eq('slug', slug).single();
      if (error) return { community: null, error: error.message };
      return { community: data, error: null };
    } catch (err) {
      return { community: null, error: 'Erro ao carregar comunidade' };
    }
  },

  async joinCommunity(communityId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };

    try {
      const { error } = await (supabase as any).from('community_members').insert({ community_id: communityId, user_id: userId, role: 'MEMBER' });
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao entrar na comunidade' };
    }
  },

  async leaveCommunity(communityId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };

    try {
      const { error } = await (supabase as any).from('community_members').delete().eq('community_id', communityId).eq('user_id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) {
      return { error: 'Erro ao sair da comunidade' };
    }
  },

  async isMember(communityId: string, userId: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { data } = await (supabase as any).from('community_members').select('id').eq('community_id', communityId).eq('user_id', userId).single();
      return !!data;
    } catch (err) {
      return false;
    }
  },

  async getUserCommunities(userId: string): Promise<{ communities: Community[]; error: string | null }> {
    if (!supabase) return { communities: [], error: 'Supabase não configurado' };

    try {
      const { data, error } = await (supabase as any).from('community_members').select(`community:communities(*)`).eq('user_id', userId);
      if (error) return { communities: [], error: error.message };
      const communities = data?.map((m: any) => m.community) || [];
      return { communities, error: null };
    } catch (err) {
      return { communities: [], error: 'Erro ao carregar comunidades' };
    }
  },

  async updateCommunity(communityId: string, userId: string, data: Partial<CreateCommunityData>): Promise<{ community: Community | null; error: string | null }> {
    if (!supabase) return { community: null, error: 'Supabase não configurado' };

    try {
      const { data: community, error } = await (supabase as any).from('communities').update({ ...data, updated_at: new Date().toISOString() }).eq('id', communityId).eq('creator_id', userId).select().single();
      if (error) return { community: null, error: error.message };
      return { community, error: null };
    } catch (err) {
      return { community: null, error: 'Erro ao editar comunidade' };
    }
  },
};
