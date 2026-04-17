import React from 'react';
import { CloudLightning, AlertTriangle, Plane, CheckCircle2, Shield, Search, Camera, Activity } from 'lucide-react';

export const StormDamage: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-red-600 flex items-center gap-2">
          <CloudLightning size={24} className="sm:w-7 sm:h-7 animate-pulse" />
          Storm Damage Assessment
        </h2>
        <div className="text-[10px] sm:text-xs font-mono bg-red-50 px-2 py-1 rounded text-red-600 border border-red-100 self-start sm:self-auto uppercase font-bold">
          Urgent Response Required
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8 border-red-200 shadow-red-100 shadow-lg">
        {/* Incident Info */}
        <section>
          <div className="section-header text-red-600 border-red-100">
            <AlertTriangle size={20} />
            Incident Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Date of Incident</label>
              <input type="date" className="input-field border-red-100 focus:ring-red-500 focus:border-red-500" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Storm Event Name</label>
              <input type="text" className="input-field border-red-100 focus:ring-red-500 focus:border-red-500" placeholder="e.g. Storm Ciara" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Priority Level</label>
              <select className="input-field border-red-100 focus:ring-red-500 focus:border-red-500 bg-red-50 text-red-700 font-bold">
                <option>P1 - Immediate Hazard (Life/Property)</option>
                <option>P2 - High Risk (Blocked Access)</option>
                <option>P3 - Medium Risk (Structural Damage)</option>
                <option>P4 - Low Risk (Debris Only)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Hazard Identification */}
        <section>
          <div className="section-header text-red-600 border-red-100">
            <Shield size={20} />
            Hazard Identification
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'Downed Power Lines',
              'Hanging Branches (Widowmakers)',
              'Uprooted / Leaning Trees',
              'Split Trunks / Stems',
              'Blocked Public Highway',
              'Damage to Buildings / Property'
            ].map(hazard => (
              <label key={hazard} className="flex items-center gap-3 p-3 border border-red-100 rounded-lg hover:bg-red-50 cursor-pointer transition-all">
                <input type="checkbox" className="w-5 h-5 accent-red-600" />
                <span className="text-sm font-bold text-gray-700">{hazard}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Drone Damage Survey (Safe Distance) */}
        <section className="bg-red-50 p-4 sm:p-6 rounded-2xl border border-red-200">
          <div className="section-header text-red-600 border-red-200">
            <Plane size={20} className="animate-bounce" />
            Drone Damage Survey (Safe Distance)
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-xs font-bold text-red-600 uppercase">Aerial Assessment Findings</p>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Upper Canopy Damage</label>
                <textarea className="input-field border-red-100 bg-white min-h-[80px]" placeholder="Describe damage observed from above..."></textarea>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Structural Integrity (Aerial View)</label>
                <select className="input-field border-red-100 bg-white">
                  <option>Stable</option>
                  <option>Unstable - Immediate Risk</option>
                  <option>Compromised - Monitor</option>
                  <option>Critical Failure</option>
                </select>
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-red-600 uppercase">Evidence Capture</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
                  <Camera className="text-red-200 w-6 h-6" />
                </div>
                <div className="aspect-square bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-red-200">
                  <Activity className="text-red-200 w-6 h-6" />
                </div>
              </div>
              <button className="w-full py-2 bg-red-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                Upload Damage Evidence
              </button>
            </div>
          </div>
        </section>

        {/* Emergency Work Plan */}
        <section>
          <div className="section-header text-red-600 border-red-100">
            <Search size={20} />
            Emergency Work Plan
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Immediate Actions Required</label>
              <textarea className="input-field border-red-100 min-h-[100px]" placeholder="Outline the steps to make the site safe..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Specialist Equipment Needed</label>
                <input type="text" className="input-field border-red-100" placeholder="e.g. 100t Crane, MEWP" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Estimated Response Time</label>
                <input type="text" className="input-field border-red-100" placeholder="e.g. 2 hours" />
              </div>
            </div>
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t border-red-100">
          <button className="btn-primary w-full py-4 text-lg bg-red-600 hover:bg-red-700">
            <CheckCircle2 size={24} />
            Authorize Emergency Response
          </button>
        </section>
      </div>
    </div>
  );
};
