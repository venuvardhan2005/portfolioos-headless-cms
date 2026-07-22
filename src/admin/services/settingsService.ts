import { supabase } from '../../lib/supabase';

export interface ProfileSettings {
  full_name: string;
  role: string;
  hero_title: string;
  hero_subtitle: string;
  about_me: string;
  avatar_url: string;
  availability_status: boolean;

  // Contact
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  leetcode: string;
  hackerrank: string;

  // Social
  instagram: string;
  twitter: string;
  youtube: string;
  portfolio_url: string;

  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  og_image_url: string;
  favicon_url: string;

  // Theme
  default_theme: 'dark' | 'light' | 'system';
  accent_color: string;
  animations_enabled: boolean;
  reduced_motion: boolean;
}

export const defaultSettings: ProfileSettings = {
  full_name: 'P VENU VARDHAN SHETTY',
  role: 'Full Stack React Developer & AI Practitioner',
  hero_title: 'Architecting High-Performance Web Applications & AI Tools',
  hero_subtitle: 'Full Stack Developer proficient in React, TypeScript, Python, Node.js, and Supabase.',
  about_me: 'Computer Science & Engineering undergraduate passionate about building scalable, high-performance web applications and AI-driven products.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
  availability_status: true,

  email: 'venuvardhan2005@gmail.com',
  phone: '+91 9876543210',
  location: 'Ballari, Karnataka, India',
  linkedin: 'https://linkedin.com/in/p-venu-vardhan-shetty',
  github: 'https://github.com/venuvardhan2005',
  leetcode: 'https://leetcode.com/venuvardhan',
  hackerrank: 'https://hackerrank.com/venuvardhan',

  instagram: 'https://instagram.com',
  twitter: 'https://x.com',
  youtube: 'https://youtube.com',
  portfolio_url: 'https://portfolio-os.vercel.app',

  seo_title: 'P Venu Vardhan Shetty | Full Stack React Developer & PortfolioOS',
  seo_description: 'Official Portfolio of P Venu Vardhan Shetty. Full Stack React Developer building modern Web Applications.',
  seo_keywords: 'React, TypeScript, Portfolio, Full Stack, Software Engineer, Supabase',
  og_image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop',
  favicon_url: '',

  default_theme: 'dark',
  accent_color: '#6366f1',
  animations_enabled: true,
  reduced_motion: false,
};

export const settingsService = {
  /**
   * Fetch current settings from settings table
   */
  async getSettings(): Promise<ProfileSettings> {
    console.log('[debugging] Reading settings from public.settings table...');
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[debugging] Database settings query error:', error.message);
    }

    if (data) {
      return {
        ...defaultSettings,
        ...data,
      };
    }

    const local = localStorage.getItem('portfolio_os_settings');
    if (local) {
      try {
        return {
          ...defaultSettings,
          ...JSON.parse(local),
        };
      } catch {
        // ignore fallback
      }
    }

    return defaultSettings;
  },

  /**
   * Upload profile or OG image to 'profile-images' bucket
   */
  async uploadImage(file: File, folder: string = 'avatars'): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

    const { error } = await supabase.storage.from('profile-images').upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data } = supabase.storage.from('profile-images').getPublicUrl(fileName);
    return data.publicUrl;
  },

  /**
   * Save settings payload into database & local cache
   */
  async saveSettings(settings: ProfileSettings): Promise<void> {
    localStorage.setItem('portfolio_os_settings', JSON.stringify(settings));

    console.log('[debugging] Writing settings to public.settings table...');
    const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();

    const payload = {
      full_name: settings.full_name,
      role: settings.role,
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      about_me: settings.about_me,
      avatar_url: settings.avatar_url,
      availability_status: settings.availability_status,
      email: settings.email,
      phone: settings.phone,
      location: settings.location,
      github: settings.github,
      linkedin: settings.linkedin,
      instagram: settings.instagram,
      twitter: settings.twitter,
      youtube: settings.youtube,
      leetcode: settings.leetcode,
      hackerrank: settings.hackerrank,
      portfolio_url: settings.portfolio_url,
      seo_title: settings.seo_title,
      seo_description: settings.seo_description,
      seo_keywords: settings.seo_keywords,
      og_image_url: settings.og_image_url,
      favicon_url: settings.favicon_url,
      default_theme: settings.default_theme,
      accent_color: settings.accent_color,
      animations_enabled: settings.animations_enabled,
      reduced_motion: settings.reduced_motion,
      updated_at: new Date().toISOString(),
    };

    let writeError;
    if (existing?.id) {
      const { error } = await supabase.from('settings').update(payload).eq('id', existing.id);
      writeError = error;
    } else {
      const { error } = await supabase.from('settings').insert([payload]);
      writeError = error;
    }

    if (writeError) {
      console.error('[debugging] Error saving settings to DB:', writeError.message);
      throw writeError;
    }
  },

  /**
   * Export all system settings to JSON file
   */
  exportJSON(settings: ProfileSettings) {
    const jsonStr = JSON.stringify(settings, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_os_settings_${Date.now()}.json`;
    link.click();
  }
};
