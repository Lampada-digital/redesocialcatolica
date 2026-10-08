import { supabase } from '../lib/supabase';
import type { Event, EventType, EventAttendeeStatus } from '../types/database';

export interface CreateEventData {
  title: string;
  description?: string;
  location?: string;
  address?: string;
  start_at: string;
  end_at?: string;
  type: EventType;
  capacity?: number;
  visibility?: 'PUBLIC' | 'PRIVATE' | 'COMMUNITY';
  community_id?: string;
  parish_id?: string;
}

export const eventService = {
  async createEvent(userId: string, data: CreateEventData): Promise<{ event: Event | null; error: string | null }> {
    if (!supabase) return { event: null, error: 'Supabase não configurado' };
    try {
      const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
      const { data: event, error } = await (supabase as any).from('events').insert({
        title: data.title, slug, description: data.description || null, location: data.location || null,
        address: data.address || null, start_at: data.start_at, end_at: data.end_at || null,
        organizer_id: userId, organizer_type: 'USER', type: data.type, capacity: data.capacity || null,
        visibility: data.visibility || 'PUBLIC', community_id: data.community_id || null, parish_id: data.parish_id || null,
      }).select().single();
      if (error) return { event: null, error: error.message };
      return { event, error: null };
    } catch (err) { return { event: null, error: 'Erro ao criar evento' }; }
  },

  async getEvents(limit: number = 50, type?: EventType): Promise<{ events: Event[]; error: string | null }> {
    if (!supabase) return { events: [], error: 'Supabase não configurado' };
    try {
      let query = (supabase as any).from('events').select('*').gte('start_at', new Date().toISOString()).order('start_at', { ascending: true }).limit(limit);
      if (type) query = query.eq('type', type);
      const { data, error } = await query;
      if (error) return { events: [], error: error.message };
      return { events: data || [], error: null };
    } catch (err) { return { events: [], error: 'Erro ao carregar eventos' }; }
  },

  async getEvent(slug: string): Promise<{ event: Event | null; error: string | null }> {
    if (!supabase) return { event: null, error: 'Supabase não configurado' };
    try {
      const { data, error } = await (supabase as any).from('events').select('*').eq('slug', slug).single();
      if (error) return { event: null, error: error.message };
      return { event: data, error: null };
    } catch (err) { return { event: null, error: 'Erro ao carregar evento' }; }
  },

  async attendEvent(eventId: string, userId: string, status: EventAttendeeStatus = 'GOING'): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };
    try {
      const { error } = await (supabase as any).from('event_attendees').upsert({ event_id: eventId, user_id: userId, status }).eq('event_id', eventId).eq('user_id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) { return { error: 'Erro ao participar do evento' }; }
  },

  async cancelAttendance(eventId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };
    try {
      const { error } = await (supabase as any).from('event_attendees').delete().eq('event_id', eventId).eq('user_id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) { return { error: 'Erro ao cancelar participação' }; }
  },

  async isAttending(eventId: string, userId: string): Promise<{ attending: boolean; status: EventAttendeeStatus | null }> {
    if (!supabase) return { attending: false, status: null };
    try {
      const { data } = await (supabase as any).from('event_attendees').select('status').eq('event_id', eventId).eq('user_id', userId).single();
      return { attending: !!data, status: data?.status || null };
    } catch (err) { return { attending: false, status: null }; }
  },

  async deleteEvent(eventId: string, userId: string): Promise<{ error: string | null }> {
    if (!supabase) return { error: 'Supabase não configurado' };
    try {
      const { error } = await (supabase as any).from('events').delete().eq('id', eventId).eq('organizer_id', userId);
      if (error) return { error: error.message };
      return { error: null };
    } catch (err) { return { error: 'Erro ao excluir evento' }; }
  },
};
