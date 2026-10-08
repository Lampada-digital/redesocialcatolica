import { supabase } from '../lib/supabase';
import type { Parish, Diocese, Pastoral } from '../types/database';

export const parishService = {
  async getParishes(limit: number = 50, dioceseId?: string): Promise<{ parishes: Parish[]; error: string | null }> {
    if (!supabase) return { parishes: [], error: 'Supabase não configurado' };
    try {
      let query = (supabase as any).from('parishes').select(`*, diocese:dioceses!diocese_id(id, name)`).order('name').limit(limit);
      if (dioceseId) query = query.eq('diocese_id', dioceseId);
      const { data, error } = await query;
      if (error) return { parishes: [], error: error.message };
      return { parishes: data || [], error: null };
    } catch (err) { return { parishes: [], error: 'Erro ao carregar paróquias' }; }
  },

  async getParish(slug: string): Promise<{ parish: Parish | null; error: string | null }> {
    if (!supabase) return { parish: null, error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('parishes').select(`*, diocese:dioceses!diocese_id(id, name, slug), pastorals(*)`).eq('slug', slug).single();
      if (error) return { parish: null, error: error.message };
      return { parish: data, error: null };
    } catch (err) { return { parish: null, error: 'Erro ao carregar paróquia' }; }
  },

  async getDioceses(limit: number = 50): Promise<{ dioceses: Diocese[]; error: string | null }> {
    if (!supabase) return { dioceses: [], error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('dioceses').select('*').order('name').limit(limit);
      if (error) return { dioceses: [], error: error.message };
      return { dioceses: data || [], error: null };
    } catch (err) { return { dioceses: [], error: 'Erro ao carregar dioceses' }; }
  },

  async getDiocese(slug: string): Promise<{ diocese: Diocese | null; error: string | null }> {
    if (!supabase) return { diocese: null, error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('dioceses').select('*').eq('slug', slug).single();
      if (error) return { diocese: null, error: error.message };
      return { diocese: data, error: null };
    } catch (err) { return { diocese: null, error: 'Erro ao carregar diocese' }; }
  },

  async getPastorals(parishId: string): Promise<{ pastorals: Pastoral[]; error: string | null }> {
    if (!supabase) return { pastorals: [], error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('pastorals').select('*').eq('parish_id', parishId).order('name');
      if (error) return { pastorals: [], error: error.message };
      return { pastorals: data || [], error: null };
    } catch (err) { return { pastorals: [], error: 'Erro ao carregar pastorais' }; }
  },

  async searchParishes(query: string, limit: number = 20): Promise<{ parishes: Parish[]; error: string | null }> {
    if (!supabase) return { parishes: [], error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('parishes').select(`*, diocese:dioceses!diocese_id(id, name)`).or(`name.ilike.%${query}%,city.ilike.%${query}%`).limit(limit);
      if (error) return { parishes: [], error: error.message };
      return { parishes: data || [], error: null };
    } catch (err) { return { parishes: [], error: 'Erro ao buscar paróquias' }; }
  },
};
