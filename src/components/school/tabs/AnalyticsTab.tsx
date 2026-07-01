import React from 'react';
import { Student } from '../../../types';

interface AnalyticsTabProps {
  students: Student[];
  paidCount: number;
}

export default function AnalyticsTab({ students, paidCount }: AnalyticsTabProps) {
  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
        <div>
          <h4 className="text-base font-bold font-display text-slate-950">Campus Enrollment Distribution Analytics</h4>
          <p className="text-xs text-slate-500 mt-1">Visualizing pupil registration parameters divided by division blocks.</p>
        </div>

        {/* Custom Responsive Chart */}
        <div className="w-full bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
          <div className="flex justify-between items-center text-xs pb-4 border-b">
            <span className="font-bold text-slate-700">Class Block Demographics</span>
            <span className="text-[11px] text-slate-400">Total verified sample: {students.length} pupils</span>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {["Class 5-6", "Class 7-8", "Class 9-10", "Class 11-12"].map((grp, gIdx) => {
              // Calculate counts
              const totalGrpStudents = students.filter(s => {
                if (grp === "Class 5-6") return s.classLevel.includes('5') || s.classLevel.includes('6');
                if (grp === "Class 7-8") return s.classLevel.includes('7') || s.classLevel.includes('8');
                if (grp === "Class 9-10") return s.classLevel.includes('9') || s.classLevel.includes('10');
                return s.classLevel.includes('11') || s.classLevel.includes('12');
              }).length;

              const percentage = students.length > 0 ? (totalGrpStudents / students.length) * 100 : 0;

              return (
                <div key={gIdx} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-700 font-semibold">
                    <span>{grp} Division</span>
                    <span>{totalGrpStudents} candidates ({Math.round(percentage)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage || 5}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-dashed text-center text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">FINANCIAL CLEARED PROPORTION</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {students.length > 0 ? Math.round((paidCount / students.length) * 100) : 0}% Registered Checkout
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase">AVERAGE PRACTICE GRADE</p>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {students.some(s => s.score !== undefined) 
                  ? `${Math.round(students.reduce((acc, cr) => acc + (cr.score || 0), 0) / students.filter(s => s.score !== undefined).length)}% Average`
                  : "No Attempts Yet"}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
