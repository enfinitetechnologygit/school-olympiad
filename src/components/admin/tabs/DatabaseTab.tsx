import React from 'react';
import { DBItem, DBUser } from '../../../types';

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
                <select
                  value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-lg font-medium text-slate-900 focus:outline-blue-600 text-xs"
                >
                  <option value="Study Material">Study Material</option>
                  <option value="Past Paper">Past Paper</option>
                  <option value="Exam Kit">Exam Kit</option>
                </select>
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
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm p-6 space-y-4">
            <h3 className="text-base font-bold font-display text-slate-950 text-sm">Published Study Resources ({dbItems.length})</h3>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 font-bold text-slate-600 border-b uppercase text-[9px] tracking-wider">
                    <th className="p-3">Resource Details</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Price</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {dbItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-slate-500">No resources found in database.</td>
                    </tr>
                  ) : (
                    dbItems.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 text-xs">
                        <td className="p-3 max-w-sm">
                          <p className="font-extrabold text-slate-900">{item.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal leading-relaxed mt-0.5">{item.description}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded uppercase">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 font-mono font-bold text-slate-900">
                          {Number(item.price) === 0 ? 'FREE' : `₹${item.price}`}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => item.id && handleDeleteDBItem(item.id)}
                            className="px-2.5 py-1 text-red-600 hover:text-red-500 bg-red-50 hover:bg-red-100 rounded-lg text-[10px] font-bold transition select-none cursor-pointer"
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
          <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold font-display text-slate-950 text-sm">Database Users Registry</h3>
              <p className="text-xs text-slate-500 mt-1">Lists all credentials stored in the SQL users table used for auth.</p>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
              {dbUsers.length === 0 ? (
                <p className="text-center text-xs text-slate-500 py-6">No users found in database registry.</p>
              ) : (
                dbUsers.map((u, i) => (
                  <div key={i} className="p-4 bg-slate-50 border rounded-xl flex flex-col justify-between gap-2 font-sans">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-extrabold text-slate-950 text-xs font-display leading-tight">{u.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{u.email}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                        u.role === 'admin' ? 'bg-red-50 text-red-700 border border-red-200' :
                        u.role === 'school' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {u.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 pt-1.5 border-t border-slate-200/50">
                      <span>SQL User ID: <strong>{u.id}</strong></span>
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
