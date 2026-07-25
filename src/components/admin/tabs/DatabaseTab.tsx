import React from 'react';
import { DBItem, DBUser } from '../../../types';
import Combobox from '../../ui/Combobox';

interface DatabaseTabProps {
  dbItems: DBItem[];
  dbUsers: DBUser[];
  newItemName: string;
  setNewItemName: (val: string) => void;
  newItemCategory: string;
  setNewItemCategory: (val: string) => void;
  newItemDesc: string;
  setNewItemDesc: (val: string) => void;
  newItemPrice: number;
  setNewItemPrice: (val: number) => void;
  handleCreateDBItem: (e: React.FormEvent) => void;
  handleDeleteDBItem: (id: number) => void;
}

export default function DatabaseTab({
  dbItems,
  dbUsers,
  newItemName,
  setNewItemName,
  newItemCategory,
  setNewItemCategory,
  newItemDesc,
  setNewItemDesc,
  newItemPrice,
  setNewItemPrice,
  handleCreateDBItem,
  handleDeleteDBItem
}: DatabaseTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Items Manager (8 cols) */}
        <div className="xl:col-span-8 space-y-6">
          
          {/* Create New Item Form */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-base font-bold font-display text-slate-950">Add Premium Olympiad Resource</h3>
              <p className="text-xs text-slate-500 mt-1">Publish a new textbook, solved past papers booklet, or algorithmic study guide to the student portal.</p>
            </div>

            <form onSubmit={handleCreateDBItem} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end text-xs text-slate-700">
              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">Resource Name</label>
                <input
                  type="text" required placeholder="e.g. Relational Databases & SQL Solved Guide"
                  value={newItemName} onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Resource Category</label>
                <Combobox
                  options={[
                    { value: "Study Material", label: "Study Material" },
                    { value: "Past Paper", label: "Past Paper" },
                    { value: "Exam Kit", label: "Exam Kit" }
                  ]}
                  value={newItemCategory}
                  onChange={setNewItemCategory}
                  placeholder="Select Category"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold block mb-1">Resource Description</label>
                <input
                  type="text" required placeholder="Detailed notes covering schema, projections, select queries..."
                  value={newItemDesc} onChange={(e) => setNewItemDesc(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600 text-xs"
                />
              </div>

              <div>
                <label className="font-bold block mb-1">Price (INR)</label>
                <input
                  type="number" required min="0"
                  value={newItemPrice} onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600 text-xs"
                />
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow cursor-pointer transition active:scale-98"
                >
                  Verify & Publish Resource
                </button>
              </div>
            </form>
          </div>

          {/* Registered Items Directory */}
          <div className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-black font-display text-slate-950 tracking-tight">Published Study Resources ({dbItems.length})</h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-150 shadow-sm">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="bg-slate-900 text-white font-extrabold uppercase text-[10px] tracking-widest">
                    <th className="p-4 pl-6">Resource Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 pr-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {dbItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500 font-semibold">No resources found in database.</td>
                    </tr>
                  ) : (
                    dbItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/20 transition duration-150">
                        <td className="p-4 pl-6 max-w-sm">
                          <p className="font-black text-slate-900 text-sm">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold leading-relaxed mt-1">{item.description}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-lg border border-blue-100 uppercase tracking-wide">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-black text-slate-900">
                          {Number(item.price) === 0 ? 'FREE' : `₹${item.price}`}
                        </td>
                        <td className="p-4 pr-6 text-center">
                          <button
                            onClick={() => item.id && handleDeleteDBItem(item.id)}
                            className="px-3 py-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl text-[11px] font-extrabold transition select-none cursor-pointer shadow-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Column 2: Database Users Registry (4 cols) */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-black font-display text-slate-950 tracking-tight">Database Users Registry</h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Lists all credentials stored in the SQL users table used for auth.</p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {dbUsers.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">No users found in database registry.</p>
              ) : (
                dbUsers.map((u, i) => (
                  <div key={i} className="p-4 bg-slate-50 hover:bg-slate-100/50 border border-slate-100 rounded-2xl flex flex-col justify-between gap-2 font-sans transition">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-black text-slate-950 text-xs font-display leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono font-bold">{u.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-rose-50 text-rose-700 border border-rose-250' :
                        u.role === 'school' ? 'bg-amber-50 text-amber-750 border border-amber-250' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span>SQL User ID: <strong className="font-mono">{u.id}</strong></span>
                      <span>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
