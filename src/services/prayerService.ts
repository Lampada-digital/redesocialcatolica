import { supabase } from '../lib/supabase';
import type { PrayerIntention, PrayerVisibility } from '../types/database';

export interface CreatePrayerIntentionData {
  content: string;
  category?: string;
  visibility?: PrayerVisibility;
  is_anonymous?: boolean;
}

export const prayerService = {
  async createIntention(userId: string, data: CreatePrayerIntentionData): Promise<{ intention: PrayerIntention | null; error: string | null }> {
    if (!supabase) return { intention: null, error: 'Supabase não configurado' };
    try {
      const { data: intention, error } = await (supabase as any).from('prayer_intentions').insert({
        author_id: userId, content: data.content, category: data.category || null,
        visibility: data.visibility || 'PUBLIC', is_anonymous: data.is_anonymous || false,
      }).select().single();
      if (error) return { intention: null, error: error.message };
      return { intention, error: null };
    } catch (err) { return { intention: null, error: 'Erro ao criar intenção' }; }
  },

  async getIntentions(limit: number = 50, cursor?: string): Promise<{ intentions: PrayerIntention[]; error: string | null; nextCursor?: string }> {
    if (!supabase) return { intentions: [], error: 'Supabase não configurado' };
    try {
      let query = (supabase as any).from('prayer_intentions').select(`*, author:profiles!author_id(id, display_name, username, avatar_url, is_verified)`).eq('visibility', 'PUBLIC').order('created_at', { ascending: false }).limit(limit);
      if (cursor) query = query.lt('created_at', cursor);
      const { data, error } = await query;
      if (error) return { intentions: [], error: error.message };
      const intentions = data || [];
      const nextCursor = intentions.length === limit ? intentions[intentions.length - 1].created_at : undefined;
      return { intentions, error: null, nextCursor };
    } catch (err) { return { intentions: [], error: 'Erro ao carregar intenções' }; }
  },

  async supportIntention(intentionId: string, userId: string): Promise<{ supported: boolean; error: string | null }> {
    if (!supabase) return { supported: false, error: 'Supabase não configurado' };
    try {
      const { data: existing } = await (supabase as any).from('prayer_supports').select('id').eq('intention_id', intentionId).eq('user_id', userId).single();
      if (existing) {
        const { error } = await (supabase as any).from('prayer_supports').delete().eq('id', existing.id);
        if (error) return { supported: false, error: error.message };
        return { supported: false, error: null };
      } else {
        const { error } = await (supabase as any).from('prayer_supports').insert({ intention_id: intentionId, user_id: userId });
        if (error) return { supported: false, error: error.message };
        return { supported: true, error: null };
      }
    } catch (err) { return { supported: false, error: 'Erro ao apoiar intenção' }; }
  },

  async isSupporting(intentionId: string, userId: string): Promise<boolean> {
    if (!supabase) return false;
    try {
      const { data } = await (supabase as any).from('prayer_supports').select('id').eq('intention_id', intentionId).eq('user_id', userId).single();
      return !!data;
    } catch (err) { return false; }
  },

  async deleteIntention(intentionId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };
    try {
      const { error } = await (supabase as any).from('prayer_intentions').delete().eq('id', intentionId).eq('author_id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) { return { error: 'Erro ao excluir intenção' }; }
  },
};
