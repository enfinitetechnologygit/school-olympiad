import React from 'react';

export default function HomeFooter() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800 text-center text-xs font-sans">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h4 className="text-sm font-bold text-white tracking-widest uppercase">ENFINITE NATIONAL OLYMPIAD BOARD</h4>
          <p className="mt-1 text-slate-400">Organized in association with major national tech corporations and educational research institutes.</p>
        </div>
        <p className="text-slate-500">
          &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved. Registered under scholastic national trusts.
        </p>
      </div>
    </footer>
  );
}
