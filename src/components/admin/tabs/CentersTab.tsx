import React from 'react';
import { MapPin } from 'lucide-react';
import { ExamCenter } from '../../../types';

interface CentersTabProps {
  centers: ExamCenter[];
  cenName: string;
  setCenName: (val: string) => void;
  cenCity: string;
  setCenCity: (val: string) => void;
  cenCap: number;
  setCenCap: (val: number) => void;
  handleCreateCenter: (e: React.FormEvent) => void;
}

export default function CentersTab({
  centers,
  cenName,
  setCenName,
  cenCity,
  setCenCity,
  cenCap,
  setCenCap,
  handleCreateCenter
}: CentersTabProps) {
  return (
    <div className="space-y-6">
      
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold font-display text-slate-950">Register National Exam Center Networks</h3>
          <p className="text-xs text-slate-500 mt-1">Setup geographically secure, certified local computing centers equipped for Stage 2 Mains synchronous tests.</p>
        </div>

        <form onSubmit={handleCreateCenter} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end text-xs text-slate-700">
          <div>
            <label className="font-bold block mb-1">Center Venue Name</label>
            <input
              type="text" required placeholder="e.g. Salt Lake InfoTech Center"
              value={cenName} onChange={(e) => setCenName(e.target.value)}
              className="w-full bg-slate-50 border p-2.5 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Regional City Location</label>
            <input
              type="text" required placeholder="e.g. Kolkata"
              value={cenCity} onChange={(e) => setCenCity(e.target.value)}
              className="w-full bg-slate-50 border p-2.5 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="font-bold block mb-1">Seating System Capacity Pool</label>
            <input
              type="number" required min="50"
              value={cenCap} onChange={(e) => setCenCap(Number(e.target.value))}
              className="w-full bg-slate-50 border p-2.5 rounded-lg text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition"
          >
            Verify & Create Center
          </button>
        </form>
      </div>

      {/* Exam center directories lists */}
      <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
        <h3 className="text-lg font-black font-display text-slate-950 tracking-tight">Master National Exam Center Directory</h3>
        <div className="overflow-x-auto rounded-2xl border border-slate-150 shadow-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-widest">
                <th className="p-4 pl-6">Proctored Venue Network Name</th>
                <th className="p-4">City Region</th>
                <th className="p-4">Seating Capacity Limit</th>
                <th className="p-4 text-center">Allocated Scholars</th>
                <th className="p-4 pr-6">Capacity Gauge Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {centers.map((cen, idx) => {
                const usageRatio = Math.round((cen.allocatedStudentsCount / cen.capacity) * 100);
                return (
                  <tr key={idx} className="hover:bg-blue-50/20 transition duration-150">
                    <td className="p-4 pl-6 font-black text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      {cen.name}
                    </td>
                    <td className="p-4 font-bold text-slate-800">{cen.city}</td>
                    <td className="p-4 font-mono font-bold text-slate-500">{cen.capacity} Seats</td>
                    <td className="p-4 text-center font-mono font-black text-blue-600">
                      <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 text-xs">{cen.allocatedStudentsCount} Candidates</span>
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center gap-2.5">
                        <div className="w-28 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full" style={{ width: `${Math.min(usageRatio || 1, 100)}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 font-extrabold">{usageRatio}% filled</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
