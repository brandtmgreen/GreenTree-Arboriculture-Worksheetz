import React, { createContext, useContext, useState } from 'react';

export interface ResourceRecommendation {
  title: string;
  url: string;
  type: 'video' | 'notebook';
  reason: string;
}

export interface SiteData {
  date?: string;
  location?: string;
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
  surveyorName?: string;
  surveyPurpose?: string;
  surveyArea?: string;
  treeSpecies?: string[];
  hazards?: string[];
  siteConditions?: string;
  weather?: string;
  droneNotes?: string;
  canopyHealth?: string;
  structuralIntegrity?: string;
  recommendations?: ResourceRecommendation[];
}

interface SiteContextType {
  siteData: SiteData;
  updateSiteData: (data: Partial<SiteData>) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (val: boolean) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [siteData, setSiteData] = useState<SiteData>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateSiteData = (data: Partial<SiteData>) => {
    setSiteData(prev => ({ ...prev, ...data }));
  };

  return (
    <SiteContext.Provider value={{ siteData, updateSiteData, isAnalyzing, setIsAnalyzing }}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};
