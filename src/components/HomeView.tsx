import React, { useState } from 'react';
import { 
  Award, 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Cpu, 
  FileText, 
  HelpCircle, 
  Info, 
  Layers, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Users, 
  ArrowRight,
  Sparkles,
  Search,
  School as SchoolIcon,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { School, OLYMPIAD_SYLLABUS, EXAM_PATTERN } from '../types';

interface HomeViewProps {
  onOpenModal: (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => void;
  schools: School[];
}

export default function HomeView({ onOpenModal, schools }: HomeViewProps) {
  const [selectedSyllabusGroup, setSelectedSyllabusGroup] = useState<string>('5-6');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const approvedSchools = schools.filter(s => s.status === 'APPROVED');

  const faqs = [
    {
      q: "Who is eligible to participate in the Enfinite National Olympiad?",
      a: "The Olympiad is exclusively for students enrolled in Class 5th to Class 12th in any recognized school board (CBSE, ICSE, State Boards, IB, etc.) across the national territory. It strictly focuses on Computer Science, programming, and logical reasoning."
    },
    {
      q: "How can my school register for this Olympiad?",
      a: "School authorities or designated Computer Science coordinators can register their institution using the 'Register School' portal. Once submitted, the National Olympiad Committee reviews and approves the application, issuing a unique School ID and portal passwords."
    },
    {
      q: "Can students register individually if their school is not listed?",
      a: "Yes! If your school has not yet completed registration, you can still register using the student portal by choosing a nearby registered school as your geographical Pre-Exam center from our extensive nationwide drop-down list."
    },
    {
      q: "What is the fee structure and the payment model?",
      a: "A nominal entry fee of ₹200 (including tax) is charged per student to support national question drafting, automated timers, secure centers, and merit logistics. The payment is handled via our integrated secure checkout system which issues digital receipt proofs."
    },
    {
      q: "What are the two stages of the Olympiad examination?",
      a: "Stage 1 (Pre-Examination) is conducted inside respective campus environments (online/offline support). High scorers (top 15% per region) qualify for Stage 2 (Mains Examination), which is conducted synchronously under strict live visual oversight at designated national regional information centers."
    }
  ];

  const examsProcess = [
    {
      step: "01",
      title: "School Enrollment",
      desc: "Coordinator teachers complete school registration and obtain official School IDs to establish pre-exam support."
    },
    {
      step: "02",
      title: "Student Sign up & Prep",
      desc: "Students sign up, link with their listed school coordinates, complete the ₹200 fee, and access syllabus guides + unlimited mock test grids."
    },
    {
      step: "03",
      title: "Pre-Exam Stage 1",
      desc: "A fixed-date test hosted right at schools across basic programming and analytics. Passing scores automatically qualify the top rankers for Mains."
    },
    {
      step: "04",
      title: "Mains Exam Stage 2",
      desc: "Qualifiers progress to the high-stakes final coding and system architecture examination hosted synchronously at certified local computer centers."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" id="eno-public-portal">
      
      {/* Premium Notification Ticker */}
      <div className="bg-blue-600 text-white text-xs py-2 px-4 font-semibold text-center tracking-wider uppercase flex items-center justify-center gap-2">
        <Sparkles className="w-4.5 h-4.5 animate-pulse text-yellow-300" />
        <span>Registration ends July 15, 2026. Stage 1 National Pre-Exams on July 30, 2026.</span>
      </div>

      {/* High-fidelity Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-blue-600 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-950 font-display">
              Enfinite National <span className="text-blue-600">Olympiad</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Computer Science • Class 5th - 12th
            </p>
          </div>
        </div>

        {/* Global Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <a href="#how-it-works" className="text-slate-600 hover:text-blue-600 transition">Process</a>
          <a href="#syllabus-section" className="text-slate-600 hover:text-blue-650 hover:text-blue-600 transition flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-100 uppercase tracking-widest text-[9px]">
            <BookOpen className="w-3.5 h-3.5" />
            Curriculum Syllabus
          </a>
          <a href="#agenda-section" className="text-slate-600 hover:text-blue-600 transition">Dates</a>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          <button 
            id="btn-school-login-nav"
            onClick={() => onOpenModal('schoolLogin')} 
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-slate-350 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold text-sm transition bg-white cursor-pointer"
          >
            <SchoolIcon className="w-4 h-4 text-slate-500" />
            School Login
          </button>
          
          <button 
            id="btn-student-login-nav"
            onClick={() => onOpenModal('studentLogin')} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm shadow-blue-100 transition cursor-pointer"
          >
            Student Login
          </button>

          {/* Quick Admin backdoor */}
          <button 
            id="btn-admin-portal-backdoor"
            onClick={() => onOpenModal('adminLogin')} 
            className="text-[10px] text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider underline cursor-pointer ml-1"
          >
            Admin Portal
          </button>
        </div>

      </header>

      {/* Hero Section */}
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
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base rounded-xl transition shadow-lg shadow-blue-500/20 flex items-center gap-2 transform active:scale-95"
              >
                Student Registration
                <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                id="hero-school-register-btn"
                onClick={() => onOpenModal('schoolRegister')}
                className="px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm sm:text-base rounded-xl transition border border-white/20 flex items-center gap-2"
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
                <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 text-slate-400">Pure Tech Focus</p>
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
              className="w-full max-w-sm aspect-square bg-gradient-to-tr from-blue-900 to-indigo-900 rounded-2xl p-6 relative border border-blue-500/25 flex flex-col justify-between shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold uppercase tracking-widest px-2.5 py-1 rounded-full">
                  LIVE INTERFACE
                </span>
                <Cpu className="w-8 h-8 text-blue-400 animate-spin-slow" />
              </div>

              <div>
                <p className="text-slate-400 uppercase tracking-widest text-[9px] font-bold">Olympiad Syllabus Base</p>
                <h3 className="text-xl font-bold font-display leading-tight text-white mt-1">
                  Computational Intel & Logic Patterns
                </h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">Basic Programming</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">Logic & Truth Grids</span>
                  <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded text-slate-300">Binary Arithmetic</span>
                </div>
              </div>

              <div className="bg-slate-950/60 backdrop-blur-md border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600/30 rounded-lg flex items-center justify-center border border-blue-500/40 text-blue-400">
                    <AwardsCount />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">National Scholar Cash</h4>
                    <p className="text-[10px] text-slate-400">Certificate & Rank Medals</p>
                  </div>
                </div>
                <span className="text-xs bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                  STAGE 1 & 2
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Highlights Focus Bar: Strict parameters */}
      <section className="bg-white border-b border-slate-100 py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex gap-4 items-start">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Computer Science Only</h3>
              <p className="text-sm text-slate-500 mt-1">This national challenge is exclusively dedicated to computing, logic, and informatics mechanics.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Classes 5th to 12th</h3>
              <p className="text-sm text-slate-500 mt-1">Categorized into class blocks: 5-6, 7-8, 9-10, and 11-12. Tasks tailored to standard curriculum levels.</p>
            </div>
          </div>
          <div className="flex gap-4 items-start">
            <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">National Staged Assessment</h3>
              <p className="text-sm text-slate-500 mt-1">Participate alongside thousands of students nationwide to achieve top state credentials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Exam Process Workflow block */}
      <section className="py-20 px-6 max-w-6xl mx-auto text-center" id="how-it-works">
        <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          STAGED WORKFLOW
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-950 mt-3 mb-4">
          How the National Olympiad Works
        </h2>
        <p className="text-slate-500 text-base max-w-2xl mx-auto mb-16">
          A balanced, secure step-by-step examination pattern that screens logical aptitudes inside school walls before graduating top performers to local technical centers.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {examsProcess.map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 relative flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="text-3xl font-extrabold text-blue-600 font-display">{item.step}</span>
                <h4 className="text-lg font-bold text-slate-900 font-display mt-2 mb-1">{item.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEW: Interactive Syllabus & Exam Pattern Section */}
      <section className="bg-slate-900 text-white py-20 px-6 border-t border-slate-800" id="syllabus-section">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 font-bold font-mono tracking-widest text-[10px] rounded-full uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              Official Academic Course Guidelines
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-white">
              Official Olympiad Curriculum Syllabus
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Select any of the class groups from the menu tab below to explore standard topics in Computer Science, programming block designs, cybersecurity regulations and modern AI paradigms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box: Menu/Topics Column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Group Menu Selectors */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Object.entries(OLYMPIAD_SYLLABUS).map(([id, syllabus]) => {
                  const isActive = selectedSyllabusGroup === id;
                  const groupNo = id === '5-6' ? '1' : id === '7-8' ? '2' : id === '9-10' ? '3' : '4';
                  
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSelectedSyllabusGroup(id)}
                      className={`p-4 rounded-xl text-left transition relative border cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 border-blue-500 text-white shadow-xl shadow-blue-900/40'
                          : 'bg-slate-950/60 hover:bg-slate-800 border-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="font-mono text-[9px] font-black uppercase tracking-widest text-blue-400">
                        Group {groupNo}
                      </div>
                      <div className="font-extrabold text-sm font-display mt-1">
                        Class {id}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Syllabus Breakdown Details display */}
              {selectedSyllabusGroup && OLYMPIAD_SYLLABUS[selectedSyllabusGroup] && (
                <div className="bg-slate-950/70 p-6 rounded-2xl border border-slate-800 space-y-6">
                  <div>
                    <h3 className="text-lg font-black font-display text-white">
                      {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].description}
                    </p>
                  </div>

                  {/* Modules grid layout */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {OLYMPIAD_SYLLABUS[selectedSyllabusGroup].modules.map((mod, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-slate-900/90 border border-slate-800/80 p-4 rounded-xl space-y-3 hover:border-blue-500/35 transition"
                      >
                        <h4 className="text-xs font-black uppercase tracking-wider text-blue-400 font-mono flex items-center gap-1.5 border-b border-slate-800 pb-1.5">
                          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          {mod.name}
                        </h4>
                        <ul className="space-y-1.5">
                          {mod.topics.map((topic, tIdx) => (
                            <li key={tIdx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-blue-500 font-extrabold">•</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Syllabus Disclaimer Badge */}
                  <div className="bg-blue-500/10 border border-blue-500/25 p-4 rounded-xl text-xs text-slate-300 leading-relaxed flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0" />
                    <div>
                      <span className="font-bold text-white">Trial Prep Notice:</span> Dynamic custom test generators inside the student's learning library strictly calibrate themselves to this structured list to boost computational competence.
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Right Box: Exam Pattern Breakdown Column */}
            <div className="lg:col-span-4 bg-slate-950/70 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h3 className="text-lg font-black font-display text-white">National Exam Pattern</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Topic weightage map distributed across multi-stage evaluations.
                </p>
              </div>

              {/* Progress-style weightage list */}
              <div className="space-y-4">
                {EXAM_PATTERN.map((pattern, pIdx) => {
                  const weightVal = parseInt(pattern.weightage);
                  return (
                    <div key={pIdx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-bold text-slate-200">{pattern.section}</span>
                        <span className="font-extrabold font-mono text-blue-400">{pattern.weightage}</span>
                      </div>
                      
                      {/* Interactive sleek progress bar */}
                      <div className="w-full bg-slate-900 border border-slate-820 rounded-full h-1.5 block overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${weightVal}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick tip box */}
              <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-[11px] leading-relaxed text-slate-400">
                <span className="font-bold text-slate-200 block mb-1">Testing Information:</span>
                Each Stage 1 test consists of timed interactive multiple choice questions conforming rigidly to these specific segment ratios.
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Important Dates Timeline Cards */}
      <section className="bg-white py-20 px-6 border-y border-slate-100" id="agenda-section">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-bold px-3 py-1 bg-blue-50 rounded-full uppercase tracking-wider">
                COMPETITION AGENDA
              </span>
              <h2 className="text-3xl font-bold font-display text-slate-950 mt-3">
                Important Registration & Exam Dates
              </h2>
            </div>
            <p className="text-slate-500 max-w-md mt-4 md:mt-0 text-sm">
              Keep custom track of deadlines. System locks automated admit configurations as soon as scheduling concludes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 border border-slate-100 bg-slate-50 rounded-xl relative flex flex-col justify-between">
              <div>
                <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-900 font-display text-base">May 1 - July 15, 2026</h4>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Registration Portal Open</p>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">Schools obtain authorization first, followed by students registering online.</p>
            </div>

            <div className="p-5 border border-blue-200 bg-blue-50/50 rounded-xl relative flex flex-col justify-between">
              <span className="absolute top-2 right-2 bg-blue-600 text-[9px] font-bold text-white uppercase tracking-wider px-2 py-0.5 rounded">
                MAIN ASSAY
              </span>
              <div>
                <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-blue-900 font-display text-base">July 30, 2026</h4>
                <p className="text-xs text-blue-600 uppercase font-semibold tracking-wider mt-1">Stage 1 Pre-Exam Date</p>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">Conducted offline/online at respective campus classrooms under teacher supervision.</p>
            </div>

            <div className="p-5 border border-slate-100 bg-slate-50 rounded-xl relative flex flex-col justify-between">
              <div>
                <Calendar className="w-8 h-8 text-blue-600 mb-3" />
                <h4 className="font-bold text-slate-900 font-display text-base font-display">August 10, 2026</h4>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Result & Admit Roll</p>
              </div>
              <p className="text-xs text-slate-500 mt-3 leading-relaxed">Publishing of list of qualified students eligible for high-stakes Mains examination.</p>
            </div>

            <div className="p-5 border border-indigo-200 bg-indigo-50/40 rounded-xl relative flex flex-col justify-between">
              <div>
                <Calendar className="w-8 h-8 text-indigo-600 mb-3" />
                <h4 className="font-bold text-indigo-900 font-display text-base">August 25, 2026</h4>
                <p className="text-xs text-indigo-600 uppercase font-semibold tracking-wider mt-1">Stage 2 Mains Examination</p>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">Hosted inside certified city centers under live online monitoring systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits checklist */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="col-span-1 lg:col-span-6">
            <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              RECOGNITION & PRIZES
            </span>
            <h2 className="text-3xl font-bold font-display text-slate-950 mt-3 mb-6 leading-tight">
              Benefits of Participating in Enfinite National Olympiad
            </h2>
            <p className="text-slate-500 mb-8 font-light text-base leading-relaxed">
              We look beyond standardized scoring systems, rewarding students for logical persistence, deep analytical curiosity, and computing ingenuity.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-950 font-display leading-none">Scholarship Grants</h4>
                  <p className="text-xs text-slate-500 mt-1">Cash assistance funds pool for state top scorers.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-950 font-display leading-none">Official Badges</h4>
                  <p className="text-xs text-slate-500 mt-1">ISO aligned digital skill medals & trophies.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-950 font-display leading-none">National Analytics</h4>
                  <p className="text-xs text-slate-500 mt-1">Pinpoint skill gaps relative to global peer metrics.</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-950 font-display leading-none">School Honors</h4>
                  <p className="text-xs text-slate-500 mt-1">Prestigious computing institute cups for active coordinators.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats panel */}
          <div className="col-span-1 lg:col-span-6 bg-blue-900 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-700/20 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-6">
              <Cpu className="w-6 h-6 text-blue-400" />
              <span className="font-semibold text-sm text-blue-300">Live Registration Registry Stats</span>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-5xl font-extrabold font-display">{approvedSchools.length || 4}+</p>
                <p className="text-xs text-blue-300 mt-1 font-semibold tracking-wider uppercase">Approved Schools</p>
              </div>
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="text-5xl font-extrabold font-display">12,500+</p>
                <p className="text-xs text-blue-300 mt-1 font-semibold tracking-wider uppercase">Active Students</p>
              </div>
            </div>

            <div className="bg-slate-950/40 p-4 rounded-xl border border-blue-500/10">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                &ldquo;Our school joined last season. It was beautifully timed, high caliber, and our student rohan achieved top state ranks in logical thinking benchmarks.&rdquo;
              </p>
              <p className="text-[10px] text-blue-300 font-bold uppercase tracking-wider mt-2.5">
                — Coordinator Dr. Rajesh Sharma, DPS Delhi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="bg-white py-20 px-6 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-10 h-10 text-blue-600 mx-auto" />
            <h2 className="text-3xl font-bold font-display text-slate-950 mt-3 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Answers regarding national syllabus parameters, payment loops, and centers.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-100 rounded-xl overflow-hidden bg-slate-50">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition cursor-pointer"
                >
                  <span className="font-bold text-slate-950 font-display text-sm sm:text-base pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${faqOpen[index] ? 'rotate-180' : ''}`} />
                </button>
                {faqOpen[index] && (
                  <div className="p-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed bg-slate-50/55">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Help desk section */}
      <section className="bg-slate-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="col-span-1 lg:col-span-6">
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

          <div className="col-span-1 lg:col-span-6 bg-slate-800 p-6 rounded-2xl border border-slate-700">
            <h3 className="text-lg font-bold font-display text-white mb-4">Quick Counseling Query</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert("Counselors queried! We will contact you at school coordinates shortly."); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-300 font-medium">Your Name</label>
                  <input type="text" required className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-slate-300 font-medium">Class / Coordinator role</label>
                  <input type="text" required placeholder="e.g. Class 10th or Teacher" className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Your Email Address</label>
                <input type="email" required className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500" />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-medium">Brief Description of Problem</label>
                <textarea rows={3} required placeholder="e.g. School missing in selector lookup..." className="w-full mt-1 bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-blue-500" />
              </div>

              <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-lg transition active:scale-95">
                Send Query Request
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* High impact educational footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800 text-center text-xs">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-sm font-bold text-white tracking-widest uppercase">ENFINITE NATIONAL OLYMPIAD BOARD</h4>
            <p className="mt-1">Organized in association with major national tech corporations and educational research institutes.</p>
          </div>
          <p className="text-slate-500">
            &copy; 2026 Enfinite National Olympiad (Computer Science Board). All rights reserved. Registered under scholastic national trusts.
          </p>
        </div>
      </footer>

    </div>
  );
}

function AwardsCount() {
  return (
    <span className="font-mono text-lg font-extrabold tracking-tight">₹1.5L</span>
  );
}
