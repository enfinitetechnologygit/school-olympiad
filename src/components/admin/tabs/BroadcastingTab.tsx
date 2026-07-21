import React from 'react';
import { Send, Save, Trash2, Upload } from 'lucide-react';
import { Announcement } from '../../../types';
import Combobox from '../../ui/Combobox';

const resolveImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('drive.google.com/file/d/')) {
    const match = url.match(/\/file\/d\/([^\/]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  if (url.includes('drive.google.com/open?id=')) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return url;
};

interface BroadcastingTabProps {
  announcements: Announcement[];
  noticeTitle: string;
  setNoticeTitle: (val: string) => void;
  noticeContent: string;
  setNoticeContent: (val: string) => void;
  noticeAudience: 'ALL' | 'SCHOOLS' | 'STUDENTS';
  setNoticeAudience: (val: 'ALL' | 'SCHOOLS' | 'STUDENTS') => void;
  handleCreateAnnouncement: (e: React.FormEvent) => void;
  headerAnnouncementText: string;
  setHeaderAnnouncementText: (val: string) => void;
  savingHeaderAnnouncement: boolean;
  headerAnnouncementSuccess: string;
  handleSaveHeaderAnnouncement: (text: string) => void;
  handleDeleteHeaderAnnouncement: () => void;
  sliderImages: string[];
  newSliderImageUrl: string;
  setNewSliderImageUrl: (val: string) => void;
  savingSliderImage: boolean;
  sliderSuccess: string;
  handleSaveSliderImage: (e: React.FormEvent) => void;
  handleDeleteSliderImage: (url: string) => void;
  handleUploadSliderImage: (file: File) => void;
}

export default function BroadcastingTab({
  announcements,
  noticeTitle,
  setNoticeTitle,
  noticeContent,
  setNoticeContent,
  noticeAudience,
  setNoticeAudience,
  handleCreateAnnouncement,
  headerAnnouncementText,
  setHeaderAnnouncementText,
  savingHeaderAnnouncement,
  headerAnnouncementSuccess,
  handleSaveHeaderAnnouncement,
  handleDeleteHeaderAnnouncement,
  sliderImages,
  newSliderImageUrl,
  setNewSliderImageUrl,
  savingSliderImage,
  sliderSuccess,
  handleSaveSliderImage,
  handleDeleteSliderImage,
  handleUploadSliderImage
}: BroadcastingTabProps) {
  return (
    <div className="space-y-6">
      {/* Header Ticker Announcement Bar Controller */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold font-display text-slate-950">Home Page Header Announcement Bar</h3>
          <p className="text-xs text-slate-500 mt-1">Configure or delete the ticker message appearing at the very top header of the homepage portal.</p>
        </div>

        {headerAnnouncementSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100 animate-fade-in">
            {headerAnnouncementSuccess}
          </div>
        )}

        <div className="space-y-4 text-xs text-slate-700">
          <div>
            <label className="font-bold block">Announcement Bar Text</label>
            <input
              type="text"
              placeholder="e.g. Registration ends July 15, 2026. Stage 1 National Pre-Exams on July 30, 2026."
              value={headerAnnouncementText}
              onChange={(e) => setHeaderAnnouncementText(e.target.value)}
              className="w-full mt-1 bg-slate-50 border p-2.5 rounded-lg text-sm font-semibold"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleSaveHeaderAnnouncement(headerAnnouncementText)}
              disabled={savingHeaderAnnouncement}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition active:scale-98"
            >
              <Save className="w-4 h-4" />
              {savingHeaderAnnouncement ? "Saving..." : "Save Header Announcement"}
            </button>

            {headerAnnouncementText && (
              <button
                onClick={handleDeleteHeaderAnnouncement}
                disabled={savingHeaderAnnouncement}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition active:scale-98"
              >
                <Trash2 className="w-4 h-4" />
                Delete Announcement Bar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Slider Images Controller */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-base font-bold font-display text-slate-950">Home Page Banner Slider Images</h3>
          <p className="text-xs text-slate-500 mt-1">Add or delete images displayed in the slider on the right side of the home page banner.</p>
        </div>

        {sliderSuccess && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-100">
            {sliderSuccess}
          </div>
        )}

        <div className="space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Option A: Direct File Upload */}
            <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 p-6 rounded-2xl text-center flex flex-col justify-center items-center gap-3 transition relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleUploadSliderImage(e.target.files[0]);
                  }
                }}
                disabled={savingSliderImage}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-100 transition">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Upload Banner Image File</p>
                <p className="text-[10px] text-slate-500 mt-1">Drag-and-drop or click to select image (PNG, JPG, WebP)</p>
              </div>
              {savingSliderImage && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-30">
                  <p className="text-xs font-bold text-blue-600 animate-pulse">Uploading...</p>
                </div>
              )}
            </div>

            {/* Option B: Add by URL */}
            <div className="border border-slate-200 p-6 rounded-2xl space-y-3 bg-white flex flex-col justify-center">
              <label className="font-bold block text-slate-900">Add by External Image Link</label>
              <form onSubmit={handleSaveSliderImage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Paste image URL (e.g. https://example.com/image.png)"
                  value={newSliderImageUrl}
                  onChange={(e) => setNewSliderImageUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border p-2.5 rounded-lg text-xs font-semibold"
                  required
                />
                <button
                  type="submit"
                  disabled={savingSliderImage || !newSliderImageUrl.trim()}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 text-white font-extrabold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition active:scale-98"
                >
                  <Save className="w-4 h-4" />
                  Add Link
                </button>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {sliderImages.map((imgUrl, idx) => (
              <div key={idx} className="relative border rounded-xl overflow-hidden bg-slate-50 flex flex-col justify-between shadow-sm">
                <div className="aspect-[4/3] w-full bg-slate-200 relative flex items-center justify-center">
                  <img src={resolveImageUrl(imgUrl)} alt={`Slide ${idx}`} className="w-full h-full object-cover" />
                </div>
                <div className="p-2 flex items-center justify-between gap-2 border-t bg-white">
                  <span className="text-[10px] text-slate-500 truncate flex-1">{imgUrl}</span>
                  <button
                    onClick={() => handleDeleteSliderImage(imgUrl)}
                    className="p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition cursor-pointer"
                    title="Delete Image"
                    type="button"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
              <Combobox
                options={[
                  { value: "ALL", label: "Everyone (ALL Users)" },
                  { value: "SCHOOLS", label: "School Coordinators Only" },
                  { value: "STUDENTS", label: "Olympiad Students Only" }
                ]}
                value={noticeAudience}
                onChange={(val) => setNoticeAudience(val as any)}
                placeholder="Select Audience..."
              />
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
