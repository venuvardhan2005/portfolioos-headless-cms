import { supabase } from '../../lib/supabase';

export interface SkillRecord {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'AI & Data' | 'Developer Tools';
  icon: string;
  display_order: number;
  visible?: boolean;
  created_at?: string;
}

export type SkillInput = Omit<SkillRecord, 'id' | 'created_at'>;

export const skillsService = {
  /**
   * Fetch all skills ordered by display_order
   */
  async getSkills(): Promise<SkillRecord[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('display_order', { ascending: true });

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('Supabase skills table query error:', error.message);
    }

    return (data as SkillRecord[]) || [];
  },

  /**
   * Create a new skill record
   */
  async createSkill(input: SkillInput): Promise<SkillRecord> {
    const { data, error } = await supabase
      .from('skills')
      .insert([input])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as SkillRecord;
  },

  /**
   * Update an existing skill record
   */
  async updateSkill(id: string, input: Partial<SkillInput>): Promise<SkillRecord> {
    const { data, error } = await supabase
      .from('skills')
      .update(input)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as SkillRecord;
  },

  /**
   * Toggle visibility status
   */
  async toggleVisibility(id: string, currentVisible: boolean): Promise<boolean> {
    const nextState = !currentVisible;
    const { error } = await supabase
      .from('skills')
      .update({ visible: nextState })
      .eq('id', id);

    if (error) throw error;
    return nextState;
  },

  /**
   * Delete a skill record by ID
   */
  async deleteSkill(id: string): Promise<void> {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (error) throw error;
  }
};
