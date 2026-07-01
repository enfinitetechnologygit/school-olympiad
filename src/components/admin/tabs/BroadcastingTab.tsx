import React from 'react';
import { Send } from 'lucide-react';
import { Announcement } from '../../../types';

interface BroadcastingTabProps {
  announcements: Announcement[];
  noticeTitle: string;
  setNoticeTitle: (val: string) => void;
  noticeContent: string;
  setNoticeContent: (val: string) => void;
  noticeAudience: 'ALL' | 'SCHOOLS' | 'STUDENTS';
  setNoticeAudience: (val: 'ALL' | 'SCHOOLS' | 'STUDENTS') => void;
  handleCreateAnnouncement: (e: React.FormEvent) => void;
}

export default function BroadcastingTab({
  announcements,
  noticeTitle,
  setNoticeTitle,
  noticeContent,
  setNoticeContent,
  noticeAudience,
  setNoticeAudience,
  handleCreateAnnouncement
}: BroadcastingTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold font-display text-slate-950">Release Broadcaster Notifications</h3>
          <p className="text-xs text-slate-500 mt-1">Transmits instant notice broadsheets to specific coordinate target audiences.</p>
        </div>

        <form onSubmit={handleCreateAnnouncement} className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="font-bold block">Announcement Headline</label>
              <input
                type="text" required placeholder="e.g. Schedule for Mains Stage 2 exam locked in Pune"
                value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg text-sm font-semibold"
              />
            </div>

            <div>
              <label className="font-bold block">Target Audience Group</label>
              <select
                value={noticeAudience} onChange={(e) => setNoticeAudience(e.target.value as any)}
                className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg font-bold"
              >
                <option value="ALL">Everyone (ALL Users)</option>
                <option value="SCHOOLS">School Coordinators Only</option>
                <option value="STUDENTS">Olympiad Students Only</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold block">Body Script Content Details</label>
            <textarea
              rows={4} required placeholder="Post coordinates of regional centers or registration date extensions..."
              value={noticeContent} onChange={(e) => setNoticeContent(e.target.value)}
              className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg leading-relaxed text-sm font-light text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1 cursor-pointer transition active:scale-98"
          >
            <Send className="w-4 h-4" />
            Transmit Broadcast Announcement
          </button>
        </form>
      </div>

      {/* Notifications Timeline preview */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
        <h4 className="font-bold font-display text-slate-950 text-sm">Active Broadcast Timeline ({announcements.length})</h4>
        <div className="space-y-3">
          {announcements.map((anc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">Audience: {anc.audience}</span>
                <span className="text-slate-400 font-mono">{new Date(anc.date).toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-slate-900 mt-1 font-display leading-tight">{anc.title}</h4>
              <p className="text-slate-600 font-light leading-relaxed">{anc.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
