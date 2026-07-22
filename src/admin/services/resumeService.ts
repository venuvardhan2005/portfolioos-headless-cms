import { supabase } from '../../lib/supabase';

export interface ResumeRecord {
  id: string;
  file_url: string;
  version: string;
  file_name?: string;
  file_size?: string;
  uploaded_at: string;
}

export const resumeService = {
  async getResume(): Promise<ResumeRecord | null> {
    console.log('[debugging] Fetching the latest resume from public.resume table...');
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .order('uploaded_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.error('[debugging] Error fetching active resume:', error.message);
    }

    if (data) {
      console.log('[debugging] Resume loaded:', data.file_url);
    } else {
      console.log('[debugging] No active resume found.');
    }

    return (data as ResumeRecord) || null;
  },

  /**
   * Upload or Replace the single active resume file
   */
  async uploadResume(file: File, versionStr: string = 'v1.0.0'): Promise<ResumeRecord> {
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF documents are permitted.');
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error('File size exceeds the 10 MB limit.');
    }

    // 1. Fetch current active resume to clean up storage
    const currentResume = await this.getResume();
    if (currentResume?.file_url) {
      try {
        const path = currentResume.file_url.split('/resume/')[1];
        if (path) {
          await supabase.storage.from('resume').remove([path]);
        }
      } catch {
        // Continue if old file removal fails
      }
    }

    // 2. Upload file to 'resume' bucket
    const fileName = `resume-${Date.now()}.pdf`;
    const filePath = `documents/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(filePath, file, { upsert: true, contentType: 'application/pdf' });

    if (uploadError) throw uploadError;

    const { data: publicData } = supabase.storage.from('resume').getPublicUrl(filePath);
    const publicUrl = publicData.publicUrl;

    // 3. Update or Insert database record
    if (currentResume?.id) {
      const { data, error } = await supabase
        .from('resume')
        .update({
          file_url: publicUrl,
          version: versionStr,
          uploaded_at: new Date().toISOString(),
        })
        .eq('id', currentResume.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data as ResumeRecord;
    } else {
      const { data, error } = await supabase
        .from('resume')
        .insert([
          {
            file_url: publicUrl,
            version: versionStr,
            uploaded_at: new Date().toISOString(),
          },
        ])
        .select()
        .maybeSingle();

      if (error) throw error;
      return data as ResumeRecord;
    }
  },

  /**
   * Delete active resume record and remove file from storage
   */
  async deleteResume(id: string, fileUrl?: string): Promise<void> {
    if (fileUrl) {
      try {
        const path = fileUrl.split('/resume/')[1];
        if (path) {
          await supabase.storage.from('resume').remove([path]);
        }
      } catch {
        // Storage remove fallback
      }
    }

    const { error } = await supabase.from('resume').delete().eq('id', id);
    if (error) throw error;
  }
};
