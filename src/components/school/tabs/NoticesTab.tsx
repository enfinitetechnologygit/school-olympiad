import React from 'react';
import { Volume2 } from 'lucide-react';
import { Announcement } from '../../../types';

interface NoticesTabProps {
  announcements: Announcement[];
}

export default function NoticesTab({ announcements }: NoticesTabProps) {
  return (
    <div className="space-y-6">
      
      <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-base font-bold font-display text-slate-950 flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-blue-600 animate-pulse" />
            Administrative Notices & Regional Circulars
          </h4>
        </div>

        <div className="space-y-4">
          {announcements.length === 0 ? (
            <p className="text-xs text-slate-500">No active notices logged.</p>
          ) : (
            announcements.map((anc, idx) => (
              <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 font-sans">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-0.5 rounded">
                    POSTED BY: {anc.postedBy}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {new Date(anc.date).toLocaleDateString()}
                  </span>
                </div>
                <h5 className="font-bold text-slate-900 font-display text-sm">{anc.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{anc.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
