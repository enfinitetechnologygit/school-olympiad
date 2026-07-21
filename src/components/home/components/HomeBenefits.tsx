import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Cpu, ArrowUpRight } from 'lucide-react';

interface HomeBenefitsProps {
  approvedSchoolsCount: number;
}

// Smooth count-up counter that triggers when visible
function AnimatedCounter({ value, suffix = "", trigger = false }: { value: number; suffix?: string; trigger?: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds transition

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * value));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [value, trigger]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function HomeBenefits({ approvedSchoolsCount }: HomeBenefitsProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Animate once
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      title: "Scholarship Grants",
      desc: "Cash assistance funds pool and scholarships awarded to top state-level performers.",
      accent: "from-blue-500 to-indigo-500"
    },
    {
      title: "Official Badges",
      desc: "ISO aligned digital skill credentials, certificates, and physical medallions.",
      accent: "from-emerald-500 to-teal-500"
    },
    {
      title: "National Analytics",
      desc: "Detailed performance reports mapping programming skill gaps against peer benchmarks.",
      accent: "from-purple-500 to-fuchsia-500"
    },
    {
      title: "School Honors",
      desc: "Prestigious computing institute trophies and cups awarded to active school coordinators.",
      accent: "from-amber-500 to-orange-500"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 px-6 max-w-7xl mx-auto font-sans relative overflow-hidden no-print" 
      id="benefits"
    >
      {/* Background visual glowing elements */}
      <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        
        {/* Left Column: Information Header & Benefits Cards Grid */}
        <div className="col-span-1 lg:col-span-7 text-left space-y-8">
          
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 80, damping: 15 }}
            className="space-y-4"
          >
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-50 border border-blue-200 text-blue-700 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest">
              RECOGNITION & PRIZES
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-slate-900 tracking-tight leading-tight">
              Benefits of Participating in Enfinite Olympiad
            </h2>
            <p className="text-slate-500 font-medium text-sm lg:text-base leading-relaxed max-w-2xl">
              We look beyond standardized scoring systems, rewarding students for logical persistence, deep analytical curiosity, and computational ingenuity.
            </p>
          </motion.div>

          {/* Cards Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {benefits.map((item, idx) => (
              <motion.div 
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-start gap-4"
              >
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 font-display text-base leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Right Column: Premium Live Stats Dashboard Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.94, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          whileHover={{ y: -8 }}
          className="col-span-1 lg:col-span-5 bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between shadow-2xl h-[420px] transition-all duration-300 border border-blue-800/40"
        >
          {/* Glowing gradient backdrops inside card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Header Row */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl text-blue-300">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <span className="font-bold text-xs tracking-wider uppercase text-blue-300">
                Live Registration Registry Stats
              </span>
            </div>
            <ArrowUpRight className="w-5 h-5 text-white/40 group-hover:text-white transition" />
          </div>

          {/* Stats Counters Grid */}
          <div className="grid grid-cols-2 gap-8 my-6">
            <div className="border-l-3 border-blue-500 pl-4 space-y-1">
              <p className="text-4xl sm:text-5xl font-black font-display tracking-tight">
                <AnimatedCounter value={Math.max(approvedSchoolsCount, 3)} suffix="+" trigger={isInView} />
              </p>
              <p className="text-[10px] text-blue-300 font-extrabold tracking-widest uppercase mt-1">
                Approved Schools
              </p>
            </div>
            <div className="border-l-3 border-blue-500 pl-4 space-y-1">
              <p className="text-4xl sm:text-5xl font-black font-display tracking-tight">
                <AnimatedCounter value={12500} suffix="+" trigger={isInView} />
              </p>
              <p className="text-[10px] text-blue-300 font-extrabold tracking-widest uppercase mt-1">
                Active Candidates
              </p>
            </div>
          </div>

          {/* Customer Quote Review */}
          <div className="bg-slate-950/40 p-5 rounded-2xl border border-white/5 relative z-10">
            <p className="text-xs text-slate-300 leading-relaxed font-semibold italic">
              &ldquo;Our school joined last season. It was beautifully timed, high caliber, and our student Rohan achieved top state ranks in logical thinking benchmarks.&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-[9px] text-blue-300 font-black uppercase tracking-widest">
                — Coordinator Dr. Rajesh Sharma, DPS Delhi
              </p>
            </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
