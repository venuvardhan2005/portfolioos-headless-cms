import { supabase } from '../../lib/supabase';

export interface HighlightRecord {
  id: string;
  icon: string;
  title: string;
  value: string;
  description: string;
  badge: string;
  display_order: number;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}

export type HighlightInput = Omit<HighlightRecord, 'id' | 'created_at' | 'updated_at'>;

export const highlightsService = {
  /**
   * Fetch all highlights ordered by display_order
   */
  async getHighlights(): Promise<HighlightRecord[]> {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('[debugging] Error fetching highlights:', error.message);
      throw error;
    }

    return (data as HighlightRecord[]) || [];
  },

  /**
   * Create a new highlight card
   */
  async createHighlight(input: HighlightInput): Promise<HighlightRecord> {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .insert([input])
      .select()
      .maybeSingle();

    if (error) {
      console.error('[debugging] Error creating highlight:', error.message);
      throw error;
    }

    return data as HighlightRecord;
  },

  /**
   * Update an existing highlight card
   */
  async updateHighlight(id: string, input: Partial<HighlightInput>): Promise<HighlightRecord> {
    const { data, error } = await supabase
      .from('portfolio_highlights')
      .update({ ...input, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[debugging] Error updating highlight:', error.message);
      throw error;
    }

    return data as HighlightRecord;
  },

  /**
   * Toggle visibility status
   */
  async toggleVisibility(id: string, currentVisible: boolean): Promise<boolean> {
    const nextState = !currentVisible;
    const { error } = await supabase
      .from('portfolio_highlights')
      .update({ visible: nextState, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[debugging] Error toggling visibility:', error.message);
      throw error;
    }
    return nextState;
  },

  /**
   * Delete a highlight card by ID
   */
  async deleteHighlight(id: string): Promise<void> {
    const { error } = await supabase.from('portfolio_highlights').delete().eq('id', id);
    if (error) {
      console.error('[debugging] Error deleting highlight:', error.message);
      throw error;
    }
  },

  /**
   * Bulk update display_order
   */
  async updateDisplayOrders(items: { id: string; display_order: number }[]): Promise<void> {
    for (const item of items) {
      await supabase
        .from('portfolio_highlights')
        .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
        .eq('id', item.id);
    }
  }
};
