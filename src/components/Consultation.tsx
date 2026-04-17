import React from 'react';
import { MessageSquare, User, MapPin, Camera, Plane, CheckCircle2, Info, Search } from 'lucide-react';

export const Consultation: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <MessageSquare size={24} className="sm:w-7 sm:h-7" />
          Client Consultation
        </h2>
        <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 self-start sm:self-auto">
          Ref: CON-2026-042
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Client & Site Info */}
        <section>
          <div className="section-header text-brand-green">
            <User size={20} />
            Client & Site Info
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Client Name</label>
              <input type="text" className="input-field" placeholder="Full Name" />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Site Address</label>
              <div className="relative">
                <input type="text" className="input-field pl-9" placeholder="Location" />
                <MapPin className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* Client Requirements */}
        <section>
          <div className="section-header text-brand-green">
            <Info size={20} />
            Client Requirements & Objectives
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Primary Concern</label>
              <select className="input-field">
                <option>Tree Safety / Risk</option>
                <option>Light / View Obstruction</option>
                <option>Structural Damage (Roots/Branches)</option>
                <option>Pest / Disease Identification</option>
                <option>Aesthetic Pruning</option>
                <option>Site Development Planning</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Detailed Client Brief</label>
              <textarea className="input-field min-h-[100px]" placeholder="What does the client want to achieve?"></textarea>
            </div>
          </div>
        </section>

        {/* Drone-Assisted Inspection */}
        <section className="bg-brand-vibrant/5 p-4 sm:p-6 rounded-2xl border border-brand-vibrant/20">
          <div className="section-header text-brand-vibrant border-brand-vibrant/20">
            <Plane size={20} className="animate-pulse" />
            Drone-Assisted Canopy Inspection
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <p className="text-xs font-bold text-brand-vibrant uppercase">Visual Findings (Aerial)</p>
              <div className="space-y-2">
                {['Upper Canopy Dieback', 'Cavities in High Unions', 'Power Line Proximity', 'Nesting Birds / Wildlife'].map(finding => (
                  <label key={finding} className="flex items-center gap-3 p-2 border border-brand-vibrant/10 rounded-lg hover:bg-white cursor-pointer transition-all">
                    <input type="checkbox" className="w-4 h-4 accent-brand-vibrant" />
                    <span className="text-xs font-medium text-gray-700">{finding}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold text-brand-vibrant uppercase">Aerial Photo/Video Log</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Camera className="text-gray-400 w-6 h-6" />
                </div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Camera className="text-gray-400 w-6 h-6" />
                </div>
              </div>
              <button className="w-full py-2 bg-brand-vibrant text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity">
                Upload Drone Media
              </button>
            </div>
          </div>
        </section>

        {/* Initial Recommendations */}
        <section>
          <div className="section-header text-brand-green">
            <Search size={20} />
            Initial Recommendations
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Proposed Work Plan</label>
              <textarea className="input-field min-h-[100px]" placeholder="Outline the suggested approach..."></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Estimated Quote Range</label>
                <input type="text" className="input-field" placeholder="e.g. $800 - $1,200" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase text-gray-500">Follow-up Required</label>
                <select className="input-field">
                  <option>Send Formal Quote</option>
                  <option>Detailed Tree Survey Needed</option>
                  <option>Planning Permission Required</option>
                  <option>No Further Action</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button className="btn-primary w-full py-4 text-lg bg-brand-green">
            <CheckCircle2 size={24} />
            Finalize Consultation Report
          </button>
        </section>
      </div>
    </div>
  );
};
