import React from 'react';
import { BookOpen } from 'lucide-react';
import { DBItem } from '../../../types';

interface MaterialsTabProps {
  dbItems: DBItem[];
}

export default function MaterialsTab({ dbItems }: MaterialsTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold font-display text-slate-950">National Olympiad Study Materials</h3>
        <p className="text-xs text-slate-500 mt-1">
          Enhance your learning with expert-curated books, previous years' question papers, and interactive kits.
        </p>
      </div>

      {dbItems.length === 0 ? (
        <div className="p-8 bg-white text-center rounded-xl border border-dashed space-y-3">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-500">No study materials are currently available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {dbItems.map((item, idx) => (
            <div key={idx} className="bg-white border rounded-2xl p-5 flex flex-col justify-between shadow-sm relative hover:shadow-md transition">
              <span className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase">
                {item.category}
              </span>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-extrabold font-mono">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-slate-950 font-display text-base leading-tight">{item.name}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-light">{item.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t flex items-center justify-between">
                <span className="text-sm font-extrabold text-slate-900 font-mono">
                  {Number(item.price) === 0 ? 'FREE' : `₹${item.price}`}
                </span>
                <button
                  onClick={() => alert(`Unlocked resource: ${item.name}! You can download or view this from your resources dashboard.`)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer transition active:scale-98"
                >
                  {Number(item.price) === 0 ? 'Access Resource' : 'Unlock Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
