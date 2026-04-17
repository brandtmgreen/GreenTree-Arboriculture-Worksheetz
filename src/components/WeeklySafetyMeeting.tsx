import React, { useState } from 'react';
import { ShieldAlert, Users, Mic, BookOpen, PenTool, Zap, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

export const WeeklySafetyMeeting: React.FC = () => {
  const [attendees, setAttendees] = useState<{ id: number; name: string }[]>([
    { id: 1, name: '' },
    { id: 2, name: '' },
    { id: 3, name: '' },
    { id: 4, name: '' },
    { id: 5, name: '' },
  ]);

  const addAttendee = () => {
    setAttendees([...attendees, { id: Date.now(), name: '' }]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h2 className="text-xl sm:text-2xl font-bold text-brand-green flex items-center gap-2">
          <ShieldAlert size={24} className="sm:w-7 sm:h-7" />
          Weekly Safety Meeting
        </h2>
        <div className="text-[10px] sm:text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500 self-start sm:self-auto">
          Ref: WSM-2026-04
        </div>
      </div>

      <div className="worksheet-card p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Meeting Details */}
        <section>
          <div className="section-header text-brand-green">
            <BookOpen size={20} />
            Meeting Details
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Date & Time</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="datetime-local" className="input-field pl-10" defaultValue={`${new Date().toISOString().split('T')[0]}T07:00`} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Presenter / Instructor</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" className="input-field pl-10" placeholder="Name of person giving the brief..." defaultValue="Safety Officer Davis" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Topic</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" className="input-field pl-10" defaultValue="Electrical Hazards & Minimum Approach Distances (MAD)" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase text-gray-500">Source Material / References</label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input type="text" className="input-field pl-10" defaultValue="ANSI Z133 Safety Requirements, OSHA 1910.269" />
              </div>
            </div>
          </div>
        </section>

        {/* Presenter's Script */}
        <section className="bg-brand-vibrant/5 p-4 sm:p-6 rounded-2xl border border-brand-vibrant/20">
          <div className="section-header text-brand-vibrant border-brand-vibrant/20">
            <Mic size={20} />
            Presenter's Script & Guide
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-brand-vibrant/10 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                <span className="text-xl">🎭</span> Icebreakers (Keep it light before getting serious)
              </h4>
              <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600 italic">
                <li>"Alright team, listen up. Why do trees hate riddles? ...Because it's too easy to get stumped!"</li>
                <li>"What's a tree's least favorite month? ...Sep-timber! Okay, okay, groan all you want, but I need your attention now."</li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-xl border border-brand-vibrant/10 shadow-sm">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                <span className="text-xl">📖</span> Core Material: The 10-Foot Rule
              </h4>
              <p className="text-sm text-gray-700 space-y-2">
                Today we are talking about Minimum Approach Distances (MAD). Unless you are a line-clearance certified arborist, the golden rule is <strong>10 feet</strong>. That means your body, your tools, your ropes, and the branches you are cutting must NEVER come within 10 feet of a power line. Remember, electricity can arc. You don't have to touch the wire to get electrocuted.
              </p>
            </div>

            <div className="bg-red-50 p-4 rounded-xl border border-red-200 shadow-sm">
              <h4 className="text-sm font-bold text-red-800 flex items-center gap-2 mb-2">
                <Zap size={18} className="text-red-600" />
                Shocking Reality (Read this exactly)
              </h4>
              <p className="text-sm text-red-900 font-medium">
                "If you think 'it's just a quick cut, I'll be fine,' listen to this: In 2022, an experienced climber in Ohio was working near a 7.2kV distribution line. It had rained the night before. His climbing rope, which was slightly damp, swung and came within 6 inches of the line. The electricity arced directly to the rope, traveling down to his harness. The arc flash caused third-degree burns over 40% of his body and blew him out of the tree. He survived, but he lost three fingers and his career ended in a fraction of a second. Electricity doesn't give warnings, and it doesn't care how much experience you have."
              </p>
            </div>
          </div>
        </section>

        {/* Attendee Signatures */}
        <section>
          <div className="section-header text-brand-green">
            <Users size={20} />
            Attendee Sign-In
          </div>
          <p className="text-xs text-gray-500 mb-4">
            By signing below, I acknowledge that I have attended this safety briefing, understood the material presented, and agree to follow the safety guidelines discussed.
          </p>
          
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold text-gray-600 uppercase text-xs w-12">#</th>
                    <th className="py-3 px-4 font-bold text-gray-600 uppercase text-xs w-1/3">Print Name</th>
                    <th className="py-3 px-4 font-bold text-gray-600 uppercase text-xs">Signature</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {attendees.map((attendee, index) => (
                    <tr key={attendee.id} className="bg-white">
                      <td className="py-3 px-4 text-gray-400 font-mono">{index + 1}</td>
                      <td className="py-3 px-4">
                        <input 
                          type="text" 
                          className="w-full bg-transparent border-b border-dashed border-gray-300 focus:border-brand-green focus:outline-none py-1" 
                          placeholder="Attendee Name"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="w-full h-8 border-b border-gray-300 bg-gray-50/50 rounded flex items-center justify-center text-gray-300 italic text-xs">
                          Sign here
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <button 
            onClick={addAttendee}
            className="mt-4 text-xs font-bold text-brand-green hover:text-brand-vibrant flex items-center gap-1 transition-colors"
          >
            <PenTool size={14} />
            + Add Another Row
          </button>
        </section>

        {/* Sign Off */}
        <section className="pt-4 border-t">
          <button className="btn-primary w-full py-4 text-lg">
            <CheckCircle2 size={24} />
            Complete & File Safety Meeting
          </button>
        </section>
      </div>
    </div>
  );
};
