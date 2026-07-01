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
      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
        <h3 className="text-base font-bold font-display text-slate-950">Master National Exam Center Directory</h3>
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                <th className="p-3">Proctored Venue Network Name</th>
                <th className="p-3">City Region</th>
                <th className="p-3">Seating Capacity Limit</th>
                <th className="p-3 text-center">Allocated Scholars</th>
                <th className="p-3">Capacity Gauge Metric</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700 font-medium text-xs">
              {centers.map((cen, idx) => {
                const usageRatio = Math.round((cen.allocatedStudentsCount / cen.capacity) * 100);
                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="p-3 font-extrabold text-slate-900 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                      {cen.name}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">{cen.city}</td>
                    <td className="p-3 font-mono font-bold text-slate-500">{cen.capacity} Seats</td>
                    <td className="p-3 text-center font-mono font-bold text-blue-600">{cen.allocatedStudentsCount} Candidates</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full" style={{ width: `${Math.min(usageRatio || 1, 100)}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 font-bold">{usageRatio}% filled</span>
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
