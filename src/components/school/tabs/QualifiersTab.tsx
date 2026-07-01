import React from 'react';
import { Award } from 'lucide-react';
import { Student } from '../../../types';

interface QualifiersTabProps {
  students: Student[];
}

export default function QualifiersTab({ students }: QualifiersTabProps) {
  const qualifiedStudents = students.filter(s => s.qualificationStatus === 'QUALIFIED');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-950">Mains Stage 2 Qualified Scholar Pool</h3>
        <p className="text-xs text-slate-500 mt-1">
          Students listed here have achieved a high-scale practice/pre-exam mock score at or above <strong>60%</strong> and are authorized for Mains Stage 2 final.
        </p>
      </div>

      {qualifiedStudents.length === 0 ? (
        <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-2">
          <Award className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Currently no students under this campus coordinates hit the Stage 2 criteria threshold.</p>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b uppercase text-[9px] tracking-wider">
                <th className="p-4">Qualifying Candidate</th>
                <th className="p-4">Olympiad Roll ID</th>
                <th className="p-4">Highest Registered Score</th>
                <th className="p-4">Allotted Mains Center Network</th>
                <th className="p-4">Admit Token</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium">
              {qualifiedStudents.map((st, i) => (
                <tr key={i} className="hover:bg-slate-50/40">
                  <td className="p-4">
                    <p className="font-extrabold text-slate-900">{st.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono italic">{st.classLevel}</p>
                  </td>
                  <td className="p-4 font-mono text-blue-600 font-bold">{st.id}</td>
                  <td className="p-4 font-mono font-bold text-emerald-600">{st.score}% Achieve</td>
                  <td className="p-4 text-slate-700">
                    <strong>{st.schoolName.includes('Kolkata') ? "Salt Lake InfoTech Center" :
                             st.schoolName.includes('Pune') ? "Hinjewadi Tech Labs" :
                             st.schoolName.includes('Bengaluru') ? "Silicon Valley Institute" :
                             "National Tech Center, New Delhi"}</strong>
                  </td>
                  <td className="p-4 font-mono font-semibold text-slate-500">{st.admitCardNumber || "Pending"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
