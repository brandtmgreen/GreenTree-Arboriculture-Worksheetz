import React from 'react';
import { JobBriefing } from './JobBriefing';
import { RiskAssessment } from './RiskAssessment';
import { HealthAssessment } from './HealthAssessment';
import { WorkOrder } from './WorkOrder';
import { Consultation } from './Consultation';
import { TreeSurvey } from './TreeSurvey';
import { StormDamage } from './StormDamage';
import { WeeklySafetyMeeting } from './WeeklySafetyMeeting';
import { EquipmentInspection } from './EquipmentInspection';
import { MediaDocumentation } from './MediaDocumentation';

export const PrintableTemplates: React.FC = () => {
  return (
    <div id="printable-templates" className="hidden print:block bg-white text-black p-0 m-0">
      <div className="space-y-0">
        <TemplateWrapper title="Job Briefing Template"><JobBriefing /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Risk Assessment Template"><RiskAssessment /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Health Assessment Template"><HealthAssessment /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Work Order Template"><WorkOrder /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Consultation Template"><Consultation /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Tree Survey Template"><TreeSurvey /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Storm Damage Template"><StormDamage /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Weekly Safety Meeting Template"><WeeklySafetyMeeting /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Equipment & PPE Inspection Template"><EquipmentInspection /></TemplateWrapper>
        <div className="page-break" />
        <TemplateWrapper title="Media Documentation Template"><MediaDocumentation /></TemplateWrapper>
      </div>
    </div>
  );
};

const TemplateWrapper: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="p-8 border-b-2 border-gray-100 last:border-0">
    <div className="mb-8 flex justify-between items-end border-b-4 border-brand-green pb-4">
      <div>
        <h1 className="text-3xl font-black text-brand-green uppercase tracking-tighter">GreenTree</h1>
        <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-gray-400">Arboriculture • Blank Template</p>
      </div>
      <div className="text-right">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-xs text-gray-500">Standard Operating Procedure Document</p>
      </div>
    </div>
    <div className="print-template-content">
      {children}
    </div>
    <div className="mt-12 pt-4 border-t border-gray-200 flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-widest">
      <span>GreenTree Arboriculture • Internal Use Only</span>
      <span>Page Template • Rev 2026.03</span>
    </div>
  </div>
);
