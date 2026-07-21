import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  School, 
  UserCheck, 
  BookOpen, 
  Terminal, 
  Play, 
  Pause, 
  Check, 
  ChevronRight, 
  Clock, 
  Code2, 
  MapPin, 
  Award,
  ShieldCheck
} from 'lucide-react';

export default function HomeWorkflow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const steps = [
    {
      title: "School Onboarding",
      subtitle: "Institutional Verification",
      badge: "Step 01",
      role: "School Coordinator",
      desc: "School coordinators submit request parameters. The Admin panel reviews and instantly issues a unique School ID and portal passwords.",
      features: [
        "Verified Directory Request Form",
        "Administrative Approval Desk Review",
        "Auto-Generated School ID & Password",
        "SMTP email credentials dispatch"
      ],
      icon: School,
      themeColor: "blue",
      gradient: "from-blue-600 to-cyan-500",
      glowColor: "rgba(59, 130, 246, 0.15)"
    },
    {
      title: "Candidate Enrollment",
      subtitle: "Profile Activation",
      badge: "Step 02",
      role: "Olympiad Candidate",
      desc: "Students sign up, link with their approved school, and complete a simulated ₹200 fee. Credentials are sent securely via email.",
      features: [
        "School-Link Search Verification",
        "Mock Razorpay Payment Gateway",
        "Hashed Secure Password Database",
        "Instant Prep Material unlock"
      ],
      icon: UserCheck,
      themeColor: "emerald",
      gradient: "from-emerald-600 to-teal-500",
      glowColor: "rgba(16, 185, 129, 0.15)"
    },
    {
      title: "Stage 1 Practice & Test",
      subtitle: "Curriculum Screening",
      badge: "Step 03",
      role: "Assessment phase",
      desc: "Candidates access syllabus guides and take unlimited AI-generated mock tests. The Stage 1 exam is held at their school.",
      features: [
        "Interactive Practice Mock Exams",
        "Class Level Syllabus Guides",
        "Instant Grading & Statistics",
        "Auto-Evaluated Qualifier Statuses"
      ],
      icon: BookOpen,
      themeColor: "purple",
      gradient: "from-purple-600 to-indigo-500",
      glowColor: "rgba(139, 92, 246, 0.15)"
    },
    {
      title: "Stage 2 Mains Finals",
      subtitle: "National Coding Exams",
      badge: "Step 04",
      role: "Qualified Candidates (Top 10%)",
      desc: "Qualified rankers progress to the Stage 2 coding and logic examination hosted synchronously at certified regional computer centers.",
      features: [
        "Regional IT Proctored Centers",
        "Center Seat Allocation system",
        "Release of Secure Stage 2 Admit Cards",
        "National Merit Score Rankings"
      ],
      icon: Terminal,
      themeColor: "violet",
      gradient: "from-violet-600 to-fuchsia-500",
      glowColor: "rgba(124, 58, 237, 0.15)"
    }
  ];

  // Autoplay effect
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const selectStep = (idx: number) => {
    setActiveStep(idx);
    setIsPlaying(false); // Pause autoplay on manual selection
  };

  return (
    <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden no-print" id="how-it-works">
      {/* Background Graphic Rings */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-800/10 rounded-full border border-slate-700/20 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 text-left">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[10px] bg-blue-500/10 border border-blue-400/20 text-blue-300 font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-widest">
              Interactive System Lifecycle
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white mt-4 mb-2 tracking-tight">
              Olympiad Flow Simulation
            </h2>
            <p className="text-slate-400 text-sm max-w-2xl font-medium">
              Click through the stages below to simulate the complete candidate, coordinator, and administrative lifecycle.
            </p>
          </div>

          {/* Autoplay Controller */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-6 md:mt-0 flex items-center gap-2 p-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold tracking-wider uppercase transition cursor-pointer text-slate-300 hover:text-white"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Pause Autoplay</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                <span>Autoplay Demo</span>
              </>
            )}
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            const isActive = idx === activeStep;
            return (
              <button
                key={idx}
                onClick={() => selectStep(idx)}
                className={`relative flex items-center gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? `bg-slate-800/80 border-slate-600 shadow-xl shadow-black/30` 
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-90'
                }`}
              >
                {/* Active Underline Indicator */}
                {isActive && (
                  <motion.div 
                    layoutId="activeTimelineGlow"
                    className={`absolute bottom-0 left-6 right-6 h-1 rounded-full bg-gradient-to-r ${item.gradient}`}
                  />
                )}

                <div className={`p-3 rounded-xl bg-slate-800 text-slate-200 ${isActive ? `bg-gradient-to-br ${item.gradient} text-white` : ''}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">{item.badge}</span>
                  <span className="text-sm font-bold text-white tracking-tight">{item.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Simulator Workspace */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-3xl p-6 lg:p-10 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column: Description & Metadata */}
              <div className="lg:col-span-5 text-left space-y-6">
                <div className="space-y-1">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] bg-slate-900 border border-slate-800 font-black uppercase tracking-widest px-3 py-1 rounded-md text-${steps[activeStep].themeColor}-400`}>
                    {steps[activeStep].role}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-extrabold font-display text-white tracking-tight mt-3">
                    {steps[activeStep].title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold tracking-wide">
                    {steps[activeStep].subtitle}
                  </p>
                </div>

                <p className="text-sm text-slate-300 font-medium leading-relaxed">
                  {steps[activeStep].desc}
                </p>

                {/* Features Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Verified Mechanics:</span>
                  <div className="grid grid-cols-1 gap-2.5">
                    {steps[activeStep].features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-3">
                        <div className={`p-0.5 rounded-full bg-slate-900 border border-slate-800 text-${steps[activeStep].themeColor}-400`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs text-slate-300 font-semibold">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Beautiful Interactive Graphics Dashboard Mock */}
              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-lg aspect-[1.45/1] rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl relative overflow-hidden flex flex-col justify-between">
                  
                  {/* Browser top-bar */}
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[9px] font-mono text-slate-600 bg-slate-950/60 p-1 px-3.5 rounded-full border border-slate-850">
                      https://portal.eno.org/{steps[activeStep].themeColor}-panel
                    </span>
                    <span className="w-3.5" />
                  </div>

                  {/* Dynamic Mock View based on Active Step */}
                  <div className="flex-1 flex flex-col justify-center py-4 relative">
                    
                    {/* STEP 1 MOCK - SCHOOL ONBOARDING */}
                    {activeStep === 0 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 text-xs font-sans text-left max-w-sm mx-auto w-full bg-slate-950/40 p-4 rounded-xl border border-slate-800"
                      >
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                          <span className="font-bold text-slate-300">DPS R.K. Puram Coordinates</span>
                          <span className="text-[9px] font-mono text-slate-500">Request: RQ-1082</span>
                        </div>
                        <div className="space-y-1.5 text-[11px] text-slate-400">
                          <p><span className="text-slate-500">Coordinator:</span> Dr. Rakesh Verma</p>
                          <p><span className="text-slate-500">Email Contact:</span> cs.admin@dpsrkp.edu</p>
                        </div>
                        
                        {/* Status approval animation */}
                        <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                            <span className="font-bold text-slate-300">Approval State:</span>
                          </div>
                          
                          <motion.span 
                            initial={{ content: "PENDING", backgroundColor: "#3f2001", color: "#f59e0b" }}
                            animate={{ content: "APPROVED", backgroundColor: "#022c22", color: "#10b981" }}
                            transition={{ delay: 2, duration: 1 }}
                            className="text-[9px] font-black px-2.5 py-1 rounded tracking-wider uppercase"
                          >
                            PENDING
                          </motion.span>
                        </div>

                        {/* Slide-in School ID */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 3.2 }}
                          className="bg-blue-950/40 border border-blue-900/30 p-2.5 rounded-lg text-center"
                        >
                          <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-wider">Credential Synchronized</span>
                          <span className="font-mono text-blue-300 font-extrabold text-sm mt-0.5 block">Official ID: SCH-2938</span>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 2 MOCK - CANDIDATE REGISTER & PAY */}
                    {activeStep === 1 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 text-xs font-sans text-left max-w-sm mx-auto w-full bg-slate-950/40 p-4 rounded-xl border border-slate-800"
                      >
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                          <span className="font-bold text-slate-300">Olympiad Admission Checkout</span>
                          <span className="font-bold text-emerald-400">₹200.00 Due</span>
                        </div>
                        <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-300">Simulate Razorpay Wallet</p>
                            <p className="text-[10px] text-slate-500">Secure Direct Checkout</p>
                          </div>
                          
                          <motion.button
                            initial={{ backgroundColor: "#2563eb", content: "Pay Now" }}
                            animate={{ backgroundColor: "#059669", content: "Successful!" }}
                            transition={{ delay: 2.2, duration: 0.8 }}
                            className="p-2 px-3 rounded-lg text-[10px] font-bold text-white cursor-pointer hover:bg-opacity-90"
                          >
                            Pay Now
                          </motion.button>
                        </div>

                        {/* Success card popping up */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 3.5 }}
                          className="bg-emerald-950/40 border border-emerald-900/30 p-2.5 rounded-lg flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-full bg-emerald-900/60 text-emerald-400 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <span className="text-[10px] text-emerald-400 font-bold block uppercase tracking-wider">Olympiad Profile Activated</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Access credentials securely sent to email.</span>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 3 MOCK - STAGE 1 EXAM SCREEN */}
                    {activeStep === 2 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-3 text-xs font-sans text-left max-w-sm mx-auto w-full bg-slate-950/40 p-4 rounded-xl border border-slate-800"
                      >
                        {/* IDE Header */}
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2 text-[10px]">
                          <span className="font-bold text-slate-400 flex items-center gap-1">
                            <Code2 className="w-3.5 h-3.5 text-purple-400" />
                            stage_1_algorithms.py
                          </span>
                          <span className="text-red-400 font-mono flex items-center gap-1 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            Time Left: 29:45
                          </span>
                        </div>

                        {/* Code Simulator Lines */}
                        <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 font-mono text-[9px] text-slate-400 space-y-1">
                          <p><span className="text-purple-400">def</span> <span className="text-blue-400">binary_search</span>(arr, target):</p>
                          <p className="pl-4 text-slate-500"># Perform binary search divide & conquer</p>
                          <p className="pl-4">mid = len(arr) // 2</p>
                          <p className="pl-4"><span className="text-orange-400">return</span> arr[mid] == target</p>
                        </div>

                        {/* Click Submit Answers */}
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-slate-500">Auto-grading instant engine</span>
                          <motion.button
                            initial={{ scale: 1, backgroundColor: "#6d28d9" }}
                            animate={{ scale: [1, 0.96, 1], backgroundColor: "#4c1d95" }}
                            transition={{ delay: 2.5, duration: 0.5 }}
                            className="p-1.5 px-3 rounded text-[10px] font-bold text-white cursor-pointer"
                          >
                            Submit Answers
                          </motion.button>
                        </div>

                        {/* Success grading banner */}
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 3.5 }}
                          className="bg-purple-950/40 border border-purple-900/30 p-2 text-center rounded text-[10px]"
                        >
                          <span className="font-black text-purple-400 block tracking-wider uppercase">Grading Finished: 92% Score</span>
                          <span className="text-slate-400 mt-0.5 block font-bold">STATUS: QUALIFIED FOR STAGE 2 MAINS</span>
                        </motion.div>
                      </motion.div>
                    )}

                    {/* STEP 4 MOCK - STAGE 2 FINALS MAP/CENTER */}
                    {activeStep === 3 && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4 text-xs font-sans text-left max-w-sm mx-auto w-full bg-slate-950/40 p-4 rounded-xl border border-slate-800"
                      >
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                          <span className="font-bold text-slate-300">Stage 2 Mains Admit Ticket</span>
                          <span className="text-[9px] font-mono text-violet-400 font-bold bg-violet-950/60 p-0.5 px-2 rounded border border-violet-900/30">Verified seat</span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex gap-2.5 items-start">
                            <MapPin className="w-4 h-4 text-violet-400 mt-0.5 shrink-0 animate-bounce" />
                            <div>
                              <p className="font-bold text-slate-300">Regional Technical Center Allocation</p>
                              <p className="text-[10px] text-slate-500 font-medium">Metro Technology Center HQ, Delhi (CEN-3928)</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2.5 items-start">
                            <Award className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                            <div>
                              <p className="font-bold text-slate-300">Olympiad Merit Awards</p>
                              <p className="text-[10px] text-slate-500 font-medium">Contend for national rank citations and gold medallions.</p>
                            </div>
                          </div>
                        </div>

                        {/* Bottom visual seat grid */}
                        <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-[10px]">
                          <span className="text-slate-400 font-semibold">Seat coordinates status:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1 uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Allocated Seat A-12
                          </span>
                        </div>
                      </motion.div>
                    )}

                  </div>

                  {/* Browser bottom-bar status */}
                  <div className="flex items-center justify-between border-t border-slate-850 pt-2 shrink-0">
                    <span className="text-[9px] text-slate-500 font-medium">Active Demonstration Simulation</span>
                    <span className="text-[9px] font-bold text-slate-500">Olympiad lifecycle</span>
                  </div>

                </div>
              </div>

            </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  );
}
