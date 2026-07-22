import { supabase } from '../../lib/supabase';

export interface CertificateRecord {
  id: string;
  title: string;
  organization: string;
  category?: 'Certification' | 'Internship' | 'Achievement';
  image_url: string;
  pdf_url?: string;
  credential_id: string;
  issue_date: string;
  verify_url?: string;
  display_order: number;
  visible?: boolean;
  created_at?: string;
}

export type CertificateInput = Omit<CertificateRecord, 'id' | 'created_at'>;

export const certificatesService = {
  /**
   * Fetch all certificates ordered by display_order
   */
  async getCertificates(): Promise<CertificateRecord[]> {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('display_order', { ascending: true });

    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      console.warn('Supabase certificates table query error:', error.message);
    }

    return (data as CertificateRecord[]) || [];
  },

  /**
   * Upload an image to the 'certificate-images' bucket and return its public URL
   */
  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `certificates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('certificate-images')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('certificate-images').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Upload a PDF file to the 'resume' bucket and return its public URL
   */
  async uploadPdf(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `certificates-pdf/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('resume')
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('resume').getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * Create a new certificate record
   */
  async createCertificate(input: CertificateInput): Promise<CertificateRecord> {
    const { data, error } = await supabase
      .from('certificates')
      .insert([input])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as CertificateRecord;
  },

  /**
   * Update an existing certificate record
   */
  async updateCertificate(id: string, input: Partial<CertificateInput>): Promise<CertificateRecord> {
    const { data, error } = await supabase
      .from('certificates')
      .update(input)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) throw error;
    return data as CertificateRecord;
  },

  /**
   * Toggle visibility status
   */
  async toggleVisibility(id: string, currentVisible: boolean): Promise<boolean> {
    const nextState = !currentVisible;
    const { error } = await supabase
      .from('certificates')
      .update({ visible: nextState })
      .eq('id', id);

    if (error) throw error;
    return nextState;
  },

  /**
   * Delete a certificate record by ID
   */
  async deleteCertificate(id: string): Promise<void> {
    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (error) throw error;
  }
};
