import { supabase } from '../../lib/supabase';

export interface ExperienceRecord {
  id: string;
  company: string;
  role: string;
  description?: string;
  technologies: string[];
  start_date: string;
  end_date: string;
  current_job: boolean;
  display_order: number;
  created_at?: string;
}

export type ExperienceInput = Omit<ExperienceRecord, 'id' | 'created_at'>;

export const experienceService = {
  /**
   * Fetch all experience entries ordered by display_order
   */
  async getExperiences(): Promise<ExperienceRecord[]> {
    const { data, error } = await supabase
      .from('experience')
      .select('*')
      .order('display_order', { ascending: true });

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('Supabase experience table query error:', error.message);
    }

    return (data as ExperienceRecord[]) || [];
  },

  /**
   * Create a new experience record
   */
  async createExperience(input: ExperienceInput): Promise<ExperienceRecord> {
    const { data, error } = await supabase
      .from('experience')
      .insert([input])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ExperienceRecord;
  },

  /**
   * Update an existing experience record
   */
  async updateExperience(id: string, input: Partial<ExperienceInput>): Promise<ExperienceRecord> {
    const { data, error } = await supabase
      .from('experience')
      .update(input)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ExperienceRecord;
  },

  /**
   * Toggle current_job status
   */
  async toggleCurrentJob(id: string, currentJob: boolean): Promise<boolean> {
    const nextState = !currentJob;
    const { error } = await supabase
      .from('experience')
      .update({ current_job: nextState })
      .eq('id', id);

    if (error) throw error;
    return nextState;
  },

  /**
   * Delete an experience record by ID
   */
  async deleteExperience(id: string): Promise<void> {
    const { error } = await supabase.from('experience').delete().eq('id', id);
    if (error) throw error;
  }
};
