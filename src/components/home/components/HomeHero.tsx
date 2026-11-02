import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Lightbulb, 
  Target, 
  Trophy, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  FileText, 
  ArrowRight, 
  Code2, 
  Atom, 
  Laptop,
  Sparkles
} from 'lucide-react';

interface HomeHeroProps {
  onOpenModal: (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => void;
}

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

export default function HomeHero({ onOpenModal }: HomeHeroProps) {
  const [images, setImages] = useState<string[]>(['/student_trophy_banner.png']);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/settings/slider')
      .then(res => {
        if (res.ok && res.headers.get('content-type')?.includes('application/json')) {
          return res.json();
        }
        throw new Error("Invalid response content-type");
      })
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setImages(data);
        }
      })
      .catch(err => {
        console.warn("Error fetching slider images (using default banner):", err.message);
        setImages(['/student_trophy_banner.png']);
      });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative w-full bg-white font-sans overflow-hidden p-0 m-0">
      {/* Main Banner Container with Curved Right Split */}
      <div className="w-full relative bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] lg:min-h-[500px]">
          
          {/* Left Content Area (Light Theme) */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10 text-left bg-gradient-to-br from-white via-slate-50 to-blue-50/20 relative">
            
            {/* Main Headlines */}
            <div className="my-auto">
              {/* Prominent Free Registration & November Exam Announcement Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-300 text-emerald-900 font-extrabold text-xs px-4 py-2 rounded-full mb-4 shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
                <span>Free Registration • One Exam in November • Exam Date Mutually Scheduled with Your School</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-wider sm:tracking-widest leading-[1.2] font-display"
              >
                <span className="text-slate-900 block">IGNITE KNOWLEDGE.</span>
                <span className="text-sky-600 block mt-1">INSPIRE EXCELLENCE.</span>
              </motion.h1>

              {/* Accent Yellow Bar */}
              <div className="w-20 h-1.5 bg-amber-400 rounded-full my-4" />

              {/* Sub-headline */}
              <p className="text-slate-700 font-semibold text-base sm:text-lg leading-relaxed max-w-xl mb-8">
                A National Level Olympiad to Recognize, Reward &amp; Nurture Young Minds. 100% Free Student Registration.
              </p>

              {/* 4 Feature Columns */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200 pt-6 mt-auto">
                
                {/* Feature 1 */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 border-r-0 sm:border-r border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-600">Enhance</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Conceptual Understanding</p>
                </div>

                {/* Feature 2 */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 border-r-0 sm:border-r border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                    <Target className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-600">Boost</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Confidence &amp; Competitive Edge</p>
                </div>

                {/* Feature 3 */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left pr-2 border-r-0 sm:border-r border-slate-200">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-600">Win Exciting</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">Prizes &amp; Recognition</p>
                </div>

                {/* Feature 4 */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                  <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 mb-2">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-blue-600">Track Progress</h4>
                  <p className="text-[11px] text-slate-600 font-medium leading-tight mt-0.5">&amp; Improve Performance</p>
                </div>

              </div>
            </div>

          </div>

          {/* Right Visual Portal Area (Dark Blue Curve Theme) */}
          <div className="lg:col-span-5 relative bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 flex items-center justify-center p-6 lg:p-8 min-h-[360px] lg:min-h-[460px] overflow-hidden">
            
            {/* Smooth SVG Curved Dividing Line on Large Screens */}
            <div className="hidden lg:block absolute -left-10 top-0 bottom-0 w-20 z-20 pointer-events-none">
              <svg className="w-full h-full text-white fill-current" viewBox="0 0 100 800" preserveAspectRatio="none">
                <path d="M0,0 C60,250 80,550 0,800 L0,0 Z" />
              </svg>
            </div>

            {/* Glowing Radial Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sky-500/20 via-transparent to-transparent pointer-events-none" />
            
            {/* Concentric Portal Rings */}
            <div className="absolute w-[300px] sm:w-[380px] h-[300px] sm:h-[380px] rounded-full border border-sky-400/30 animate-pulse pointer-events-none" />
            <div className="absolute w-[240px] sm:w-[300px] h-[240px] sm:h-[300px] rounded-full border-2 border-cyan-400/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] pointer-events-none" />

            {/* Floating Sci/Tech Neon Badges */}
            <div className="absolute top-6 left-6 bg-blue-900/80 border border-cyan-400/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-cyan-300 text-xs font-bold shadow-lg flex items-center gap-1.5 z-20 animate-bounce">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span>&lt;/&gt;</span>
            </div>

            <div className="absolute top-8 right-6 bg-blue-900/80 border border-blue-400/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-blue-300 text-xs font-semibold shadow-lg z-20">
              <Trophy className="w-4 h-4 text-amber-400 inline mr-1" />
              <span>Winners</span>
            </div>

            <div className="absolute bottom-10 left-6 bg-blue-900/80 border border-sky-400/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-sky-300 text-xs font-mono font-bold shadow-lg z-20">
              <span>∑ x/y</span>
            </div>

            <div className="absolute bottom-8 right-6 bg-blue-900/80 border border-cyan-400/40 backdrop-blur-md p-2 rounded-xl text-cyan-300 shadow-lg z-20">
              <Atom className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>

            {/* Main Student Graphic / Slider */}
            <div className="relative z-10 w-full max-w-sm h-full flex items-center justify-center">
              {images.map((imgUrl, idx) => (
                <motion.img 
                  key={idx}
                  src={resolveImageUrl(imgUrl)} 
                  alt={`Hero Graphic ${idx + 1}`} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: idx === currentIndex ? 1 : 0, scale: idx === currentIndex ? 1 : 0.95 }}
                  transition={{ duration: 0.7 }}
                  className={`max-h-[340px] lg:max-h-[380px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] ${
                    idx === currentIndex ? 'relative z-10' : 'absolute z-0 pointer-events-none'
                  }`}
                />
              ))}
            </div>

          </div>

        </div>

        {/* Bottom Feature & Action Bar */}
        <div className="bg-[#071633] border-t border-blue-900/60 p-4 sm:p-5 lg:px-12 text-white flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* CTA Register Button & Domain */}
          <div className="flex items-center gap-4">
            <button
              id="banner-register-now-btn"
              onClick={() => onOpenModal('studentRegister')}
              className="px-7 py-3 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm rounded-full transition shadow-lg shadow-amber-500/25 flex items-center gap-3 transform hover:scale-105 active:scale-95 cursor-pointer font-sans tracking-wide"
            >
              REGISTER NOW
              <div className="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <div className="text-left hidden sm:block">
              <p className="text-[11px] text-blue-300 font-medium tracking-wide">Official Website</p>
              <p className="text-xs font-bold text-white tracking-wide">www.enfiniteolympiad.com</p>
            </div>
          </div>

          {/* 3 Key Highlights */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-6 sm:gap-8 text-left">
            
            {/* Highlight 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white leading-tight">Trusted &amp; Secure</h5>
                <p className="text-[11px] text-blue-300 font-medium leading-tight">Platform</p>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="w-px h-7 bg-blue-800/60 hidden sm:block" />

            {/* Highlight 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-sky-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white leading-tight">For Classes</h5>
                <p className="text-[11px] text-amber-400 font-bold leading-tight">5th to 12th</p>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="w-px h-7 bg-blue-800/60 hidden sm:block" />

            {/* Highlight 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white leading-tight">Single November Exam</h5>
                <p className="text-[11px] text-emerald-400 font-bold leading-tight">Free Registration</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
