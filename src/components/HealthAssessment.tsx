import React, { useState } from 'react';
import { TreePine, CheckCircle2, Activity, Search, Info, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';

export const HealthAssessment: React.FC = () => {
  const { siteData } = useSiteContext();
  const [species, setSpecies] = useState('');
  const [findings, setFindings] = useState('');

  const handleSmartFill = () => {
    if (siteData) {
      if (siteData.treeSpecies) setSpecies(siteData.treeSpecies.join(', '));
      setFindings(`Canopy Health: ${siteData.canopyHealth || 'N/A'}. \nStructural Integrity: ${siteData.structuralIntegrity || 'N/A'}. \nDrone Notes: ${siteData.droneNotes || 'N/A'}.`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <TreePine size={24} className="sm:w-7 sm:h-7" />
          Tree Health Assessment
        </h2>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {siteData && Object.keys(siteData).length > 0 && (
            <button 
              onClick={handleSmartFill}
              className="btn-secondary text-xs py-1.5 bg-brand-vibrant/10 border-brand-vibrant text-brand-vibrant hover:bg-brand-vibrant hover:text-white animate-pulse"
            >
              <Sparkles size={14} />
              Smart Fill from AI
            </button>
          )}
          <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
            Ref: THA-2026-001
          </div>
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Tree Identification */}
        <section>
          <div className="section-header text-brand-green">
            <Search size={20} />
            Tree Identification
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Species (Common/Scientific)</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="e.g. Quercus robur / English Oak" 
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Tree Reference ID</label>
              <input type="text" className="input-field" placeholder="T1, T2, etc." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Height (Est.)</label>
              <input type="text" className="input-field" placeholder="e.g. 15m" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">DBH (Diameter at Breast Height)</label>
              <input type="text" className="input-field" placeholder="e.g. 60cm" />
            </div>
          </div>
        </section>

        {/* Visual Inspection */}
        <section>
          <div className="section-header text-brand-green">
            <Info size={20} />
            Visual Inspection
          </div>
          <div className="space-y-6">
            {[
              { id: 'roots', label: 'Roots / Root Collar', options: ['Good', 'Fair', 'Poor', 'Girdling Roots', 'Decay', 'Compaction'] },
              { id: 'trunk', label: 'Trunk / Stem', options: ['Good', 'Fair', 'Poor', 'Cavities', 'Cracks', 'Decay', 'Cankers'] },
              { id: 'branches', label: 'Branches / Canopy', options: ['Good', 'Fair', 'Poor', 'Deadwood', 'Co-dominant', 'Weak Unions'] },
              { id: 'foliage', label: 'Foliage', options: ['Normal', 'Chlorotic', 'Sparse', 'Pests', 'Disease'] },
            ].map((part) => {
              const [selected, setSelected] = React.useState<string[]>([]);
              
              const toggleOption = (option: string) => {
                setSelected(prev => 
                  prev.includes(option) 
                    ? prev.filter(o => o !== option) 
                    : [...prev, option]
                );
              };

              return (
                <div key={part.label} className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 flex justify-between items-center">
                    {part.label}
                    {selected.length > 0 && (
                      <span className="text-[10px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full">
                        {selected.length} selected
                      </span>
                    )}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {part.options.map((option) => {
                      const isActive = selected.includes(option);
                      return (
                        <button 
                          key={option} 
                          onClick={() => toggleOption(option)}
                          className={`px-3 py-1.5 text-xs font-medium border rounded-full transition-all ${
                            isActive 
                              ? 'bg-brand-green text-white border-brand-green shadow-sm' 
                              : 'bg-white text-gray-600 border-gray-200 hover:border-brand-green hover:text-brand-green'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* VTA (Visual Tree Assessment) Findings */}
        <section>
          <div className="section-header text-brand-vibrant">
            <Activity size={20} />
            VTA Findings & Recommendations
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Detailed Findings</label>
              <textarea 
                className="input-field min-h-[100px]" 
                placeholder="Describe any specific issues, decay, or structural defects..."
                value={findings}
                onChange={(e) => setFindings(e.target.value)}
              ></textarea>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Recommended Action</label>
              <select className="input-field">
                <option>No Action Required</option>
                <option>Monitor (Annual Inspection)</option>
                <option>Deadwood Removal</option>
                <option>Crown Reduction</option>
                <option>Crown Thinning</option>
                <option>Sectional Felling / Removal</option>
                <option>Cabling / Bracing</option>
              </select>
            </div>
          </div>
        </section>

        {/* Priority Level */}
        <section>
          <div className="section-header text-brand-green">
            <AlertCircle size={20} />
            Priority Level
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { label: 'Low', color: 'bg-green-100 text-green-700 border-green-200' },
              { label: 'Medium', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
              { label: 'High', color: 'bg-orange-100 text-orange-700 border-orange-200' },
              { label: 'Urgent', color: 'bg-red-100 text-red-700 border-red-200' },
            ].map((p) => (
              <button key={p.label} className={`py-3 px-2 rounded-lg border font-bold text-[10px] sm:text-xs uppercase transition-all hover:scale-105 ${p.color}`}>
                {p.label}
              </button>
            ))}
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button className="btn-primary w-full py-4 text-lg">
            <ShieldCheck size={24} />
            Submit Health Assessment
          </button>
        </section>
      </div>
    </div>
  );
};
