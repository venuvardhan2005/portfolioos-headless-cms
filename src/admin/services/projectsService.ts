import { supabase } from '../../lib/supabase';

export interface ProjectRecord {
  id: string;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  github_url: string;
  live_url: string;
  technologies: string[];
  featured: boolean;
  status: 'Completed' | 'In Progress' | 'Beta';
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ProjectInput = Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'>;

export const projectsService = {
  /**
   * Fetch all projects ordered by display_order
   */
  async getProjects(): Promise<ProjectRecord[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('display_order', { ascending: true });

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('Supabase projects table query error:', error.message);
    }

    return (data as ProjectRecord[]) || [];
  },

  /**
   * Upload an image to the 'project-images' bucket and return its public URL
   */
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage.from('project-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Create a new project record
   */
  async createProject(input: ProjectInput): Promise<ProjectRecord> {
    const { data, error } = await supabase
      .from('projects')
      .insert([input])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ProjectRecord;
  },

  /**
   * Update an existing project record
   */
  async updateProject(id: string, input: Partial<ProjectInput>): Promise<ProjectRecord> {
    const { data, error } = await supabase
      .from('projects')
      .update(input)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as ProjectRecord;
  },

  /**
   * Toggle the featured boolean on a project
   */
  async toggleFeatured(id: string, currentFeatured: boolean): Promise<boolean> {
    const nextState = !currentFeatured;
    const { error } = await supabase
      .from('projects')
      .update({ featured: nextState })
      .eq('id', id);

    if (error) throw error;
    return nextState;
  },

  /**
   * Delete a project record by ID
   */
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) throw error;
  },

  /**
   * Bulk update display_order
   */
  async updateDisplayOrders(items: { id: string; display_order: number }[]): Promise<void> {
    for (const item of items) {
      await supabase.from('projects').update({ display_order: item.display_order }).eq('id', item.id);
    }
  }
};
