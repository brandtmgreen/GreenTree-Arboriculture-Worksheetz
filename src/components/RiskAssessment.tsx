import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Shield, Zap, Wind, HardHat, Eye, Activity, Sparkles, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useSiteContext } from '../context/SiteContext';
import { db, setDoc, doc, handleFirestoreError, OperationType, auth } from '../firebase';
import { serverTimestamp } from 'firebase/firestore';

export const RiskAssessment: React.FC = () => {
  const { siteData } = useSiteContext();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [weather, setWeather] = useState('Sunny / Clear');
  const [groundConditions, setGroundConditions] = useState('Dry / Firm');
  const [selectedPPE, setSelectedPPE] = useState<string[]>([]);

  const handleSmartFill = () => {
    if (siteData) {
      if (siteData.weather) setWeather(siteData.weather);
      if (siteData.siteConditions) setGroundConditions(siteData.siteConditions);
    }
  };

  const togglePPE = (id: string) => {
    setSelectedPPE(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) return;
    
    setIsSaving(true);
    setSaveSuccess(false);
    
    const id = `RA-${Date.now()}`;
    const path = `riskAssessments/${id}`;
    
    try {
      await setDoc(doc(db, 'riskAssessments', id), {
        id,
        userId: auth.currentUser.uid,
        date: new Date().toISOString().split('T')[0],
        weather,
        groundConditions,
        ppe: selectedPPE,
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
        <h2 className="text-xl sm:text-2xl font-bold text-brand-vibrant flex items-center gap-2">
          <AlertTriangle size={24} className="sm:w-7 sm:h-7" />
          Risk Assessment
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
            Ref: RA-2026-001
          </div>
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* PPE Requirements */}
        <section>
          <div className="section-header text-brand-green">
            <Shield size={20} />
            PPE Requirements
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {[
              { id: 'hardhat', label: 'Hard Hat', icon: HardHat },
              { id: 'eye', label: 'Eye Protection', icon: Eye },
              { id: 'ear', label: 'Ear Protection', icon: Activity },
              { id: 'vis', label: 'High Vis Vest', icon: Zap },
              { id: 'trousers', label: 'Chainsaw Trousers', icon: Shield },
              { id: 'gloves', label: 'Gloves', icon: Shield },
              { id: 'boots', label: 'Steel Toe Boots', icon: Shield },
              { id: 'harness', label: 'Climbing Harness', icon: Shield },
            ].map((item) => {
              const checked = selectedPPE.includes(item.id);
              return (
                <motion.label 
                  key={item.id} 
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 group ${
                    checked ? 'bg-brand-vibrant/5 border-brand-vibrant shadow-md' : 'bg-white border-gray-200 hover:border-brand-vibrant/30 hover:bg-gray-50'
                  }`}
                >
                  <motion.div 
                    animate={checked ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] } : { scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                      checked ? 'bg-brand-vibrant text-white shadow-lg shadow-brand-vibrant/30' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-vibrant/20 group-hover:text-brand-vibrant'
                    }`}
                  >
                    <item.icon size={20} className="sm:w-6 sm:h-6" />
                  </motion.div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={checked}
                      onChange={() => togglePPE(item.id)}
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 accent-brand-vibrant" 
                    />
                    <span className={`text-[10px] sm:text-xs font-bold uppercase text-center transition-colors duration-300 ${
                      checked ? 'text-brand-vibrant' : 'text-gray-600'
                    }`}>{item.label}</span>
                  </div>
                </motion.label>
              );
            })}
          </div>
        </section>

        {/* Environmental Conditions */}
        <section>
          <div className="section-header text-brand-green">
            <Wind size={20} />
            Environmental Conditions
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Weather</label>
              <select 
                className="input-field" 
                value={weather} 
                onChange={(e) => setWeather(e.target.value)}
              >
                <option>Sunny / Clear</option>
                <option>Overcast</option>
                <option>Light Rain</option>
                <option>Heavy Rain</option>
                <option>Windy</option>
                <option>Stormy</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Wind Speed (Est.)</label>
              <input type="text" className="input-field" placeholder="e.g. 10-15 mph" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Ground Conditions</label>
              <select 
                className="input-field" 
                value={groundConditions} 
                onChange={(e) => setGroundConditions(e.target.value)}
              >
                <option>Dry / Firm</option>
                <option>Wet / Soft</option>
                <option>Muddy</option>
                <option>Frozen</option>
                <option>Uneven</option>
              </select>
            </div>
          </div>
        </section>

        {/* Risk Matrix */}
        <section>
          <div className="section-header text-brand-green">
            <Activity size={20} />
            Risk Matrix
          </div>
          <div className="bg-gray-50 p-3 sm:p-6 rounded-xl border border-gray-100">
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-6 gap-1 w-full max-w-md">
                <div className="col-span-1"></div>
                {['Low', 'Med', 'High', 'Ext', 'Crit'].map(l => (
                  <div key={l} className="text-[8px] sm:text-[10px] font-bold uppercase text-center text-gray-400 py-1">{l}</div>
                ))}
                
                {['Minor', 'Mod', 'Major', 'Sev', 'Cat'].map((impact, i) => {
                  const [selectedCell, setSelectedCell] = React.useState<number | null>(null);
                  return (
                    <React.Fragment key={impact}>
                      <div className="text-[8px] sm:text-[10px] font-bold uppercase flex items-center text-gray-400">{impact}</div>
                      {[1, 2, 3, 4, 5].map((prob, j) => {
                        const score = (i + 1) * (j + 1);
                        const isSelected = selectedCell === j;
                        
                        let color = 'bg-green-100 text-green-700 hover:bg-green-200';
                        if (score > 5) color = 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
                        if (score > 10) color = 'bg-orange-100 text-orange-700 hover:bg-orange-200';
                        if (score > 15) color = 'bg-red-100 text-red-700 hover:bg-red-200';
                        
                        if (isSelected) color = 'bg-brand-ink text-white ring-2 ring-brand-vibrant ring-offset-1';

                        return (
                          <button 
                            key={j} 
                            onClick={() => setSelectedCell(isSelected ? null : j)}
                            className={`h-8 sm:h-10 flex items-center justify-center rounded text-[10px] sm:text-xs font-bold transition-all transform hover:scale-105 active:scale-95 ${color}`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </React.Fragment>
                  );
                })}
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4 text-[10px] text-gray-500 italic">
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-green-400 rounded-full"></div> Low Risk</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full"></div> Moderate</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-orange-400 rounded-full"></div> High Risk</div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-400 rounded-full"></div> Extreme</div>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button 
            onClick={handleSubmit}
            disabled={isSaving}
            className={`btn-primary w-full py-4 text-lg bg-brand-vibrant ${saveSuccess ? 'bg-green-600' : ''}`}
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={24} />
            ) : saveSuccess ? (
              <CheckCircle2 size={24} />
            ) : (
              <CheckCircle2 size={24} />
            )}
            {isSaving ? 'Submitting...' : saveSuccess ? 'Submitted Successfully!' : 'Submit Risk Assessment'}
          </button>
        </section>
      </div>
    </div>
  );
};
