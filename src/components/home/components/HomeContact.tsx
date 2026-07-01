import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function HomeContact() {
  const handleSubmitQuery = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Counselors queried! We will contact you at school coordinates shortly.");
  };

  return (
    <section className="bg-slate-900 text-white py-16 px-6 font-sans no-print">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="col-span-1 lg:col-span-6 text-left">
          <h2 className="text-2xl font-bold font-display text-white mb-4">
            Connect with Olympiad Desk
          </h2>
          <p className="text-slate-400 mb-8 text-sm sm:text-base leading-relaxed">
            Facing difficulties during card generation, receipt dispatch or listing coordinates? Our national academic technical counselors are available.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Academic Counselors Email</p>
                <p className="text-sm font-semibold">support@enfinite-olympiad.org</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">National Helpline Call Desk</p>
                <p className="text-sm font-semibold">+91 98450 98450 (9:00 AM - 6:00 PM)</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-blue-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-400">National Headquarters Office</p>
                <p className="text-sm font-semibold">Enfinite Technology Labs, Hinjewadi Sector II, Pune</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-1 lg:col-span-6 bg-slate-800 p-6 rounded-2xl border border-slate-700 text-left">
          <h3 className="text-lg font-bold font-display text-white mb-4">Quick Counseling Query</h3>
          <form onSubmit={handleSubmitQuery} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium">Your Name</label>
                <input type="text" required className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium">Class / Coordinator role</label>
                <input type="text" required placeholder="e.g. Class 10th or Teacher" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium">Your Email Address</label>
              <input type="email" required className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium">Brief Description of Problem</label>
              <textarea rows={3} required placeholder="e.g. School missing in selector lookup..." className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500 outline-none" />
            </div>

            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition active:scale-95 cursor-pointer font-sans">
              Send Query Request
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
