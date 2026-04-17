import React, { useState } from 'react';
import { ClipboardList, Users, Truck, Plane, CheckCircle2, Calendar, Clock, ShieldCheck, Zap, Radio, Navigation, AlertTriangle, Info, ChevronRight, PlayCircle, Globe, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const WorkOrder: React.FC = () => {
  const [missionStarted, setMissionStarted] = useState(false);
  const [compliance, setCompliance] = useState({
    airspace: false,
    battery: false,
    weather: false,
    exclusion: false,
    signal: false
  });

  const allCompliant = Object.values(compliance).every(v => v);

  const toggleCompliance = (key: keyof typeof compliance) => {
    setCompliance(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <ClipboardList size={24} className="sm:w-7 sm:h-7" />
          Work Order
        </h2>
        <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 self-start sm:self-auto">
          Ref: WO-2026-782
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Job Details */}
        <section>
          <div className="section-header text-brand-green">
            <Calendar size={20} />
            Schedule & Assignment
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Date of Work</label>
              <input type="date" className="input-field" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Estimated Duration</label>
              <div className="relative">
                <input type="text" className="input-field pl-9" placeholder="e.g. 6 hours" />
                <Clock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Crew Leader</label>
              <div className="relative">
                <input type="text" className="input-field pl-9" placeholder="Name" />
                <Users className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>
        </section>

        {/* UAV Mission: By The Numbers & 3D Infographic */}
        <section className="bg-brand-green/5 p-4 sm:p-8 rounded-3xl border border-brand-green/20 overflow-hidden relative">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="section-header text-brand-green border-none mb-0">
                <Plane size={24} className={missionStarted ? "animate-pulse text-brand-vibrant" : ""} />
                <span className="text-xl font-black tracking-tighter uppercase italic">UAV Mission: By The Numbers</span>
              </div>
              {!missionStarted && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-brand-vibrant/10 rounded-full border border-brand-vibrant/20">
                  <span className="w-2 h-2 bg-brand-vibrant rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-brand-vibrant uppercase">Ready for Initiation</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Instructions Column */}
              <div className="lg:col-span-7 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {[
                    { num: '01', title: 'Site Calibration', desc: 'Set Home Point and verify GPS lock (min 12 satellites).', icon: Navigation },
                    { num: '02', title: 'Exclusion Zone', desc: 'Deploy physical barriers and verify 30m radius clear of non-crew.', icon: ShieldCheck },
                    { num: '03', title: 'Flight Pattern', desc: 'Execute automated grid at 40m AGL with 70% overlap.', icon: Radio },
                    { num: '04', title: 'Data Capture', desc: 'Verify high-res orthomosaic imagery and 3D point cloud density.', icon: Zap }
                  ].map((step, idx) => (
                    <motion.div 
                      key={step.num}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white shadow-sm hover:shadow-md transition-shadow group"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-brand-green text-white rounded-xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-brand-green/20 group-hover:scale-110 transition-transform">
                        {step.num}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <step.icon size={16} className="text-brand-green" />
                          <h4 className="font-bold text-gray-900 uppercase tracking-tight">{step.title}</h4>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Compliance Toggles */}
                <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ShieldCheck size={14} />
                    Mission Initiation & Compliance
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { key: 'airspace', label: 'CAA/FAA Airspace Clear', icon: Globe },
                      { key: 'battery', label: 'Battery Health > 90%', icon: Zap },
                      { key: 'weather', label: 'Wind < 15mph / No Rain', icon: Info },
                      { key: 'exclusion', label: 'Exclusion Zone Secured', icon: AlertTriangle },
                      { key: 'signal', label: 'RC Link & Telemetry Verified', icon: Radio }
                    ].map((item) => (
                      <button
                        key={item.key}
                        onClick={() => toggleCompliance(item.key as keyof typeof compliance)}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                          compliance[item.key as keyof typeof compliance] 
                            ? 'bg-brand-green/10 border-brand-green text-brand-green' 
                            : 'bg-gray-50 border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <item.icon size={16} />
                          <span className="text-xs font-bold uppercase tracking-tight">{item.label}</span>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          compliance[item.key as keyof typeof compliance] ? 'bg-brand-green border-brand-green' : 'border-gray-200'
                        }`}>
                          {compliance[item.key as keyof typeof compliance] && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <button 
                    disabled={!allCompliant || missionStarted}
                    onClick={() => setMissionStarted(true)}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-lg ${
                      allCompliant && !missionStarted
                        ? 'bg-brand-vibrant text-white hover:scale-[1.02] active:scale-95 shadow-brand-vibrant/20'
                        : missionStarted 
                          ? 'bg-green-500 text-white cursor-default'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {missionStarted ? (
                      <>
                        <Activity className="animate-pulse" size={20} />
                        Mission In Progress
                      </>
                    ) : (
                      <>
                        <PlayCircle size={20} />
                        Initiate UAV Mission
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* 3D Infographic Column */}
              <div className="lg:col-span-5 flex flex-col justify-center items-center">
                <div className="relative w-full aspect-square max-w-[350px] perspective-1000">
                  <motion.div 
                    animate={{ 
                      rotateY: [0, 10, -10, 0],
                      rotateX: [20, 25, 15, 20],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-full h-full relative preserve-3d"
                  >
                    {/* Ground Plane */}
                    <div className="absolute inset-0 bg-brand-green/10 rounded-full border-4 border-brand-green/20 transform rotate-x-90 translate-z-[-50px] flex items-center justify-center">
                      <div className="w-3/4 h-3/4 border-2 border-dashed border-brand-green/30 rounded-full animate-spin-slow" />
                      <div className="w-1/2 h-1/2 border-2 border-brand-green/40 rounded-full" />
                    </div>

                    {/* Exclusion Zone Cylinder (Visual) */}
                    <div className="absolute inset-x-10 inset-y-0 bg-gradient-to-t from-brand-vibrant/20 to-transparent border-x-2 border-brand-vibrant/30 transform translate-z-0" />

                    {/* Tree Placeholder */}
                    <div className="absolute left-1/2 bottom-1/2 -translate-x-1/2 translate-y-1/2 w-16 h-32 transform translate-z-10">
                      <div className="w-4 h-full bg-amber-900/40 mx-auto rounded-full" />
                      <div className="w-24 h-24 bg-brand-green/40 rounded-full -mt-28 -ml-10 blur-sm" />
                    </div>

                    {/* Drone & Flight Path */}
                    <motion.div 
                      animate={{ 
                        y: [-20, 20, -20],
                        x: [-30, 30, -30],
                        rotateZ: [0, 360]
                      }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-1/4 left-1/4 w-12 h-12 transform translate-z-40"
                    >
                      <div className="relative w-full h-full">
                        <Plane className="text-brand-vibrant drop-shadow-2xl" size={48} />
                        <div className="absolute -inset-4 border-2 border-brand-vibrant/20 rounded-full animate-ping" />
                      </div>
                    </motion.div>

                    {/* Labels */}
                    <div className="absolute top-0 right-0 p-2 bg-white/80 backdrop-blur-md rounded-lg border border-brand-green/20 shadow-xl transform translate-z-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-brand-vibrant rounded-full" />
                        <span className="text-[10px] font-black uppercase text-gray-600">Exclusion Zone: 30m</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                  <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-black text-gray-400 uppercase">Target Alt</div>
                    <div className="text-xl font-black text-brand-green tracking-tighter">40m AGL</div>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-[10px] font-black text-gray-400 uppercase">Overlap</div>
                    <div className="text-xl font-black text-brand-green tracking-tighter">70% / 70%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Task List */}
        <section>
          <div className="section-header text-brand-green">
            <ClipboardList size={20} />
            Task Specification
          </div>
          <div className="space-y-3">
            {[
              'Crown Reduction (20%)',
              'Deadwood Removal',
              'Sectional Felling',
              'Stump Grinding',
              'Site Clearance & Chipping',
              'Drone Site Monitoring'
            ].map((task) => (
              <label key={task} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-all">
                <input type="checkbox" className="w-5 h-5 accent-brand-vibrant" />
                <span className="text-sm font-medium text-gray-700">{task}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Equipment & Resources */}
        <section>
          <div className="section-header text-brand-green">
            <Truck size={20} />
            Equipment & Resources
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Wood Chipper', 'MEWP (Lift)', 'Stump Grinder', 'Rigging Kit', 'Traffic Control', 'Drone Unit'].map(item => (
              <div key={item} className="flex items-center gap-2 p-2 bg-gray-50 rounded border border-gray-100">
                <input type="checkbox" className="w-4 h-4 accent-brand-green" />
                <span className="text-[11px] font-bold text-gray-600 uppercase">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button className="btn-primary w-full py-4 text-lg bg-brand-green">
            <CheckCircle2 size={24} />
            Approve & Dispatch Work Order
          </button>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .rotate-x-90 { transform: rotateX(90deg); }
        .translate-z-[-50px] { transform: translateZ(-50px); }
        .translate-z-0 { transform: translateZ(0); }
        .translate-z-10 { transform: translateZ(10px); }
        .translate-z-40 { transform: translateZ(40px); }
        .translate-z-50 { transform: translateZ(50px); }
        .animate-spin-slow { animation: spin 12s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};
