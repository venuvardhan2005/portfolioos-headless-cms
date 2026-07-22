import React, { createContext, useContext, useState, useEffect } from 'react';
import { publicPortfolioService } from '../lib/publicPortfolioService';
import type { PublicPortfolioData } from '../lib/publicPortfolioService';
import { defaultSettings } from '../admin/services/settingsService';

interface PublicContextType {
  data: PublicPortfolioData;
  loading: boolean;
  refetch: () => Promise<void>;
  validatedResumeUrl: string | null;
}

const initialData: PublicPortfolioData = {
  settings: defaultSettings,
  projects: [],
  skills: [],
  experiences: [],
  certificates: [],
  highlights: [],
  resumeUrl: '#',
};

const PublicPortfolioContext = createContext<PublicContextType>({
  data: initialData,
  loading: true,
  refetch: async () => {},
  validatedResumeUrl: null,
});

export const PublicPortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PublicPortfolioData>(initialData);
  const [loading, setLoading] = useState(true);

  const fetchPublicData = async () => {
    try {
      console.log('[debugging] Fetching public portfolio data...');
      const result = await publicPortfolioService.getPublicData();
      setData(result);
      console.log('[debugging] Public portfolio data fetched successfully. Resume URL:', result.resumeUrl);
    } catch (err) {
      console.error('[debugging] Error fetching public data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicData();
  }, []);

  // Validation function
  const getValidatedResumeUrl = (url: string | null | undefined): string | null => {
    if (!url || url === '#' || typeof url !== 'string') {
      return null;
    }
    
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('https://')) {
      console.warn('[debugging] Resume URL validation failed: must start with https://');
      return null;
    }

    if (!cleanUrl.includes('/storage/v1/object/public/resume')) {
      console.warn('[debugging] Resume URL validation failed: must point to the public resume bucket');
      return null;
    }

    try {
      const urlObj = new URL(cleanUrl);
      urlObj.searchParams.set('download', '1');
      const finalUrl = urlObj.toString();
      console.log('[debugging] Resume URL validated and ready:', finalUrl);
      return finalUrl;
    } catch (e) {
      console.error('[debugging] Malformed Resume URL detected:', cleanUrl);
      return null;
    }
  };

  const validatedResumeUrl = getValidatedResumeUrl(data.resumeUrl);

  return (
    <PublicPortfolioContext.Provider value={{ data, loading, refetch: fetchPublicData, validatedResumeUrl }}>
      {children}
    </PublicPortfolioContext.Provider>
  );
};

export const usePublicPortfolio = () => useContext(PublicPortfolioContext);
