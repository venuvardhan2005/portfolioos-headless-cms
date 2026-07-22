import { projectsService } from '../admin/services/projectsService';
import { skillsService } from '../admin/services/skillsService';
import { experienceService } from '../admin/services/experienceService';
import { certificatesService } from '../admin/services/certificatesService';
import { resumeService } from '../admin/services/resumeService';
import { settingsService, defaultSettings } from '../admin/services/settingsService';
import { highlightsService } from '../admin/services/highlightsService';
import type { ProjectRecord } from '../admin/services/projectsService';
import type { SkillRecord } from '../admin/services/skillsService';
import type { ExperienceRecord } from '../admin/services/experienceService';
import type { CertificateRecord } from '../admin/services/certificatesService';
import type { ProfileSettings } from '../admin/services/settingsService';
import type { HighlightRecord } from '../admin/services/highlightsService';

export interface PublicPortfolioData {
  settings: ProfileSettings;
  projects: ProjectRecord[];
  skills: SkillRecord[];
  experiences: ExperienceRecord[];
  certificates: CertificateRecord[];
  highlights: HighlightRecord[];
  resumeUrl: string;
}

export const publicPortfolioService = {
  /**
   * Fetch all portfolio data concurrently with fast fallbacks
   */
  async getPublicData(): Promise<PublicPortfolioData> {
    try {
      const [settings, projects, skills, experiences, certificates, highlights, resume] = await Promise.all([
        settingsService.getSettings().catch(() => defaultSettings),
        projectsService.getProjects().catch(() => []),
        skillsService.getSkills().catch(() => []),
        experienceService.getExperiences().catch(() => []),
        certificatesService.getCertificates().catch(() => []),
        highlightsService.getHighlights().catch(() => []),
        resumeService.getResume().catch(() => null),
      ]);

      const finalResumeUrl = resume?.file_url ?? '#';
      console.log('[debugging] publicPortfolioService loaded resume URL:', finalResumeUrl);

      return {
        settings: settings || defaultSettings,
        projects: projects || [],
        skills: skills || [],
        experiences: experiences || [],
        certificates: certificates || [],
        highlights: highlights || [],
        resumeUrl: finalResumeUrl,
      };
    } catch {
      return {
        settings: defaultSettings,
        projects: [],
        skills: [],
        experiences: [],
        certificates: [],
        highlights: [],
        resumeUrl: '#',
      };
    }
  }
};
