import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface HomeFaqProps {
  faqOpen: Record<number, boolean>;
  toggleFaq: (index: number) => void;
}

export default function HomeFaq({ faqOpen, toggleFaq }: HomeFaqProps) {
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

  return (
    <section className="bg-white py-20 px-6 border-t border-slate-100 font-sans no-print">
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
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-slate-50 transition cursor-pointer outline-none border-none"
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
  );
}
