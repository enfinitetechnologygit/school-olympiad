import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Info } from 'lucide-react';
import { OLYMPIAD_SYLLABUS, EXAM_PATTERN } from '../../../types';

interface HomeSyllabusProps {
  selectedSyllabusGroup: string;
  setSelectedSyllabusGroup: (val: string) => void;
}

export default function HomeSyllabus({
  selectedSyllabusGroup,
  setSelectedSyllabusGroup
}: HomeSyllabusProps) {
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

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 70, damping: 15, delay: 0.2 }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="bg-slate-900 text-white py-24 px-6 border-t border-slate-800 font-sans relative overflow-hidden" 
      id="syllabus-section"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="text-center space-y-4"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 font-extrabold tracking-widest text-[10px] rounded-full uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            Official Academic Course Guidelines
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            Official Olympiad Curriculum Syllabus
          </h2>
          <p className="text-slate-400 text-sm lg:text-base max-w-3xl mx-auto leading-relaxed">
            Select any of the class groups from the menu tab below to explore standard topics in Computer Science, programming block designs, cybersecurity regulations and modern AI paradigms.
          </p>
        </motion.div>

        {/* Workspace Layout */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={gridVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10"
        >
          
          {/* Left Box: Menu/Topics Column */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Group Menu Selectors */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/30 p-1.5 rounded-2xl border border-slate-800/80">
              {Object.entries(OLYMPIAD_SYLLABUS).map(([id, syllabus]) => {
                const isActive = selectedSyllabusGroup === id;
                const groupNo = id === '5-6' ? '1' : id === '7-8' ? '2' : id === '9-10' ? '3' : '4';
                const classLabelMap: Record<string, string> = {
                  '5-6': 'Class 5th & 6th',
                  '7-8': 'Class 7th & 8th',
                  '9-10': 'Class 9th & 10th',
                  '11-12': 'Class 11th & 12th'
                };
                
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedSyllabusGroup(id)}
                    className={`p-4 rounded-xl text-left relative border cursor-pointer z-10 transition-colors duration-300 ${
                      isActive
                        ? 'border-blue-500 text-white shadow-xl shadow-blue-950/35'
                        : 'bg-transparent border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {/* Sliding active highlight background */}
                    {isActive && (
                      <motion.div
                        layoutId="activeSyllabusTabBg"
                        className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-500/20"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}

                    <div className={`font-mono text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-blue-200' : 'text-slate-500'}`}>
                      Group {groupNo}
                    </div>
                    <div className="font-extrabold text-sm font-display mt-1">
                      {classLabelMap[id] || `Class ${id}`}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Animated Syllabus Breakdown display */}
            <div className="min-h-[350px]">
              <AnimatePresence mode="wait">
                {selectedSyllabusGroup && OLYMPIAD_SYLLABUS[selectedSyllabusGroup] && (
                  <motion.div
                    key={selectedSyllabusGroup}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="bg-slate-950/70 p-6 rounded-3xl border border-slate-800/80 space-y-6 shadow-2xl"
                  >
                    <div>
                      <h3 className="text-xl font-bold font-display text-white tracking-tight">
                        {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                        {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].description}
                      </p>
                    </div>

                    {/* Modules grid layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].modules.map((mod, mIdx) => (
                        <motion.div
                          key={mIdx}
                          whileHover={{ scale: 1.015, borderColor: "rgba(59, 130, 246, 0.3)" }}
                          className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3.5 transition-all duration-300"
                        >
                          <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 font-mono flex items-center gap-2 border-b border-slate-800 pb-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            {mod.name}
                          </h4>
                          <ul className="space-y-2">
                            {mod.topics.map((topic, tIdx) => (
                              <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2.5">
                                <span className="text-blue-500 font-extrabold text-[13px] leading-none">•</span>
                                <span className="font-semibold text-[11.5px] leading-snug">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      ))}
                    </div>

                    {/* Syllabus Disclaimer Badge */}
                    <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl text-xs text-slate-300 leading-relaxed flex items-center gap-3.5">
                      <Info className="w-5 h-5 text-blue-400 shrink-0" />
                      <div className="font-semibold">
                        <span className="font-bold text-white">Trial Prep Notice:</span> Dynamic custom test generators inside the student's learning library strictly calibrate themselves to this structured list to boost computational competence.
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Right Box: Exam Pattern Breakdown Column */}
          <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 p-6 rounded-3xl space-y-6 shadow-2xl">
            <div>
              <h3 className="text-xl font-bold font-display text-white tracking-tight">National Exam Pattern</h3>
              <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                Topic weightage map distributed across multi-stage evaluations.
              </p>
            </div>

            {/* Progress-style weightage list */}
            <div className="space-y-5">
              {EXAM_PATTERN.map((pattern, pIdx) => {
                const weightVal = parseInt(pattern.weightage);
                return (
                  <div key={pIdx} className="space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[11px] font-semibold">
                      <span className="text-slate-200">{pattern.section}</span>
                      <span className="font-extrabold font-mono text-blue-400 bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">{pattern.weightage}</span>
                    </div>
                    
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-slate-900 border border-slate-800/80 rounded-full h-2 block overflow-hidden">
                      <motion.div
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full"
                        initial={{ width: "0%" }}
                        animate={isInView ? { width: `${weightVal}%` } : { width: "0%" }}
                        transition={{ duration: 1.5, ease: "easeOut", delay: pIdx * 0.1 }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick tip box */}
            <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-2xl text-[11px] leading-relaxed text-slate-400 font-semibold">
              <span className="font-bold text-slate-200 block mb-1">Testing Information:</span>
              Each Stage 1 test consists of timed interactive multiple choice questions conforming rigidly to these specific segment weightages.
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
}
