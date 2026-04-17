import React, { useState, useEffect } from 'react';
import { Briefcase, Calendar, MapPin, User, Users, Clock, CheckCircle2, AlertCircle, Camera, Video, Image as ImageIcon, Sparkles, Loader2 } from 'lucide-react';
import { useSiteContext } from '../context/SiteContext';
import { db, setDoc, doc, handleFirestoreError, OperationType, auth } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';

export const JobBriefing: React.FC = () => {
  const { siteData } = useSiteContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    address: '',
    client: '',
    crewLeader: '',
    scope: '',
  });

  const handleSmartFill = () => {
    if (siteData) {
      setFormData(prev => ({
        ...prev,
        date: siteData.date || prev.date,
        address: siteData.location || prev.address,
        scope: `Tree Species: ${siteData.treeSpecies?.join(', ') || 'N/A'}. \nSite Conditions: ${siteData.siteConditions || 'N/A'}. \nHazards: ${siteData.hazards?.join(', ') || 'N/A'}.`,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    const id = `JB-${Date.now()}`;
    const path = `jobBriefings/${id}`;
    
    try {
      await setDoc(doc(db, 'jobBriefings', id), {
        ...formData,
        id,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <Briefcase size={24} className="sm:w-7 sm:h-7" />
          Job Briefing
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
            Ref: JB-2026-001
          </div>
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Basic Info */}
        <section>
          <div className="section-header text-brand-green">
            <Calendar size={20} />
            General Information
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Date</label>
              <input 
                type="date" 
                className="input-field" 
                value={formData.date} 
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Job Site Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="Enter address..." 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Client Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="Client name..." 
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Crew Leader</label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  className="input-field pl-10" 
                  placeholder="Lead arborist..." 
                  value={formData.crewLeader}
                  onChange={(e) => setFormData({...formData, crewLeader: e.target.value})}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Scope of Work */}
        <section>
          <div className="section-header text-brand-green">
            <CheckCircle2 size={20} />
            Scope of Work
          </div>
          <div className="space-y-4">
            <textarea 
              className="input-field min-h-[100px]" 
              placeholder="Describe the work to be performed (e.g., Removal of 2x Eucalyptus, Pruning of Oak)..."
              value={formData.scope}
              onChange={(e) => setFormData({...formData, scope: e.target.value})}
            ></textarea>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {['Removal', 'Pruning', 'Stump Grinding', 'Planting', 'Cabling', 'Consultancy'].map((item) => (
                <label key={item} className="flex items-center gap-2 p-2 sm:p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <input type="checkbox" className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-brand-vibrant" />
                  <span className="text-xs sm:text-sm font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </section>

        {/* Hazards & Controls */}
        <section>
          <div className="section-header text-brand-vibrant">
            <AlertCircle size={20} />
            Site Specific Hazards
          </div>
          <div className="space-y-2 sm:space-y-3">
            {[
              'Power Lines / Utilities',
              'Traffic / Pedestrians',
              'Underground Services',
              'Steep Terrain / Slopes',
              'Wildlife / Bees / Wasps',
              'Public Access'
            ].map((hazard) => (
              <div key={hazard} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 gap-2">
                <span className="text-xs sm:text-sm font-medium">{hazard}</span>
                <div className="flex gap-2">
                  <button className="flex-1 sm:flex-none px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-red-100 text-red-700 border border-red-200">High Risk</button>
                  <button className="flex-1 sm:flex-none px-2 py-1 text-[9px] sm:text-[10px] font-bold uppercase rounded bg-gray-200 text-gray-600">Controlled</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Info */}
        <section className="bg-red-50 p-4 rounded-lg border border-red-100">
          <div className="section-header text-red-700 border-red-200">
            <Clock size={20} />
            Emergency Response Plan
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-red-600">Nearest Hospital</label>
              <input type="text" className="input-field border-red-200 focus:ring-red-500" placeholder="Hospital name..." />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-red-600">Site Emergency Contact</label>
              <input type="text" className="input-field border-red-200 focus:ring-red-500" placeholder="Name & Phone..." />
            </div>
          </div>
        </section>

        {/* Media Enhancement */}
        <section>
          <div className="section-header text-brand-green">
            <Camera size={20} />
            Media & Documentation Links
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Drone Footage URL</label>
              <div className="relative">
                <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" className="input-field pl-10" placeholder="Paste YouTube/Vimeo link..." />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Before/After Photos Folder</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" className="input-field pl-10" placeholder="Cloud storage link..." />
              </div>
            </div>
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary w-full py-4 text-lg ${saveSuccess ? 'bg-green-600' : ''}`}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={24} />
            ) : saveSuccess ? (
              <CheckCircle2 size={24} />
            ) : (
              <CheckCircle2 size={24} />
            )}
            {isSaving ? 'Saving...' : saveSuccess ? 'Saved Successfully!' : 'Complete Briefing & Sign Off'}
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            By signing off, the crew acknowledges they have been briefed on the hazards and controls for this site.
          </p>
        </section>
      </div>
    </div>
  );
};
