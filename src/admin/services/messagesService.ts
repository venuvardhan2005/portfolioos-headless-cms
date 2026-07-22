import { supabase } from '../../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const messagesService = {
  /**
   * Fetch all contact messages ordered by creation date
   */
  async getMessages(): Promise<ContactMessageRecord[]> {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('Supabase contact_messages query warning:', error.message);
    }

    return (data as ContactMessageRecord[]) || [];
  },

  /**
   * Mark a single message as read
   */
  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Mark multiple messages as read
   */
  async markMultipleAsRead(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await supabase
      .from('contact_messages')
      .update({ is_read: true })
      .in('id', ids);

    if (error) throw error;
  },

  /**
   * Delete a single message record
   */
  async deleteMessage(id: string): Promise<void> {
    const { error } = await supabase.from('contact_messages').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Delete multiple messages
   */
  async deleteMultipleMessages(ids: string[]): Promise<void> {
    if (ids.length === 0) return;
    const { error } = await supabase.from('contact_messages').delete().in('id', ids);
    if (error) throw error;
  },

  /**
   * Subscribe to real-time incoming messages via Supabase Realtime channel
   */
  subscribeToNewMessages(onNewMessage: (msg: ContactMessageRecord) => void): RealtimeChannel {
    const channel = supabase
      .channel('public:contact_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'contact_messages' },
        (payload) => {
          if (payload.new) {
            onNewMessage(payload.new as ContactMessageRecord);
          }
        }
      )
      .subscribe();

    return channel;
  }
};
