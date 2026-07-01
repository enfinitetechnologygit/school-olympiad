import React from 'react';

export default function HomeWorkflow() {
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
    <section className="py-20 px-6 max-w-6xl mx-auto text-center font-sans no-print" id="how-it-works">
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
  );
}
