import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, ArrowRight, School as SchoolIcon, Cpu } from 'lucide-react';

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
  const [images, setImages] = useState<string[]>(['/girl_laptop.png']);
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
        console.warn("Error fetching slider images (using fallback):", err.message);
        setImages(['/girl_laptop.png']); // Fallback slider image
      });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white py-20 px-6 lg:py-28">
      {/* Background visual graphics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-700/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="col-span-1 lg:col-span-7 flex flex-col justify-center text-left">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-semibold tracking-wide w-fit mb-6"
          >
            <Award className="w-4 h-4 text-blue-400" />
            National Computer Science Talent Search
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display mb-6 leading-tight"
          >
            Master the Code.<br />
            Represent Your <span className="text-blue-500 bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">State.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-300 text-lg md:text-xl font-light leading-relaxed max-w-xl mb-8"
          >
            A premier national-level Computer Science challenge for brilliant young minds of <span className="font-semibold text-white">Class 5th to 12th</span>. Unleash potential in logic, algorithms and algorithms theory.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button 
              id="hero-student-register-btn"
              onClick={() => onOpenModal('studentRegister')}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 transform active:scale-95 cursor-pointer font-sans"
            >
              Student Registration
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              id="hero-school-register-btn"
              onClick={() => onOpenModal('schoolRegister')}
              className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-xl transition border border-white/20 flex items-center gap-2 cursor-pointer font-sans"
            >
              <SchoolIcon className="w-5 h-5" />
              Register School
            </button>
          </motion.div>

          {/* Core facts */}
          <div className="grid grid-cols-3 gap-4 border-t border-slate-800 pt-8 mt-12">
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-display text-white">Class 5-12</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Eligibility Core</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-display text-blue-400">100% CS</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Pure Tech Focus</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold font-display text-white">₹200 Only</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Simplicity Fee</p>
            </div>
          </div>
        </div>

        {/* Right Hero Illustration */}
        <div className="col-span-1 lg:col-span-5 relative flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border border-blue-500/20 shadow-2xl relative bg-slate-900/50 backdrop-blur-sm"
          >
            {images.map((imgUrl, idx) => (
              <img 
                key={idx}
                src={resolveImageUrl(imgUrl)} 
                alt={`Slide ${idx + 1}`} 
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
