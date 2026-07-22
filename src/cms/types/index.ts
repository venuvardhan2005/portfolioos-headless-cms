export interface CMSProject {
  id?: string;
  title: string;
  is_featured: boolean;
  description: string;
  features?: string[];
  tech: string[];
  image_url: string;
  demo_url?: string;
  github_url?: string;
  status: 'Completed' | 'In Progress' | 'Beta';
  eta?: string;
  future_improvements?: string;
  accent_color?: string;
  created_at?: string;
}

export interface CMSSkill {
  id?: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'AI & Data' | 'Developer Tools';
  description: string;
  color: string;
  created_at?: string;
}

export interface CMSExperience {
  id?: string;
  role: string;
  organization: string;
  duration: string;
  highlights: string[];
  technologies: string[];
  created_at?: string;
}

export interface CMSCertificate {
  id?: string;
  title: string;
  organization: string;
  issue_date: string;
  credential_id: string;
  skills: string[];
  image_url: string;
  verify_url?: string;
  download_url?: string;
  is_featured: boolean;
  created_at?: string;
}

export interface CMSContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at?: string;
}
