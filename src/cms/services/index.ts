import { supabase } from '../../lib/supabase';
import type { CMSProject, CMSSkill, CMSExperience, CMSCertificate, CMSContactMessage } from '../types';

/**
 * Service placeholders for Phase 2 Supabase CRUD operations
 */

export const cmsProjectsService = {
  async getAll(): Promise<CMSProject[]> {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const cmsSkillsService = {
  async getAll(): Promise<CMSSkill[]> {
    const { data, error } = await supabase.from('skills').select('*');
    if (error) throw error;
    return data || [];
  },
};

export const cmsExperienceService = {
  async getAll(): Promise<CMSExperience[]> {
    const { data, error } = await supabase.from('experiences').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};

export const cmsCertificatesService = {
  async getAll(): Promise<CMSCertificate[]> {
    const { data, error } = await supabase.from('certificates').select('*');
    if (error) throw error;
    return data || [];
  },
};

export const cmsMessagesService = {
  async getAll(): Promise<CMSContactMessage[]> {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },
};
