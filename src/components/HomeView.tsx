import React from 'react';
import { School } from '../types';
import { useHomeState } from './home/hooks/useHomeState';
import HomeHeader from './home/components/HomeHeader';
import HomeHero from './home/components/HomeHero';
import HomeHighlights from './home/components/HomeHighlights';
import HomeWorkflow from './home/components/HomeWorkflow';
import HomeSyllabus from './home/components/HomeSyllabus';
import HomeTimeline from './home/components/HomeTimeline';
import HomeBenefits from './home/components/HomeBenefits';
import HomeFaq from './home/components/HomeFaq';
import HomeContact from './home/components/HomeContact';
import HomeFooter from './home/components/HomeFooter';

interface HomeViewProps {
  onOpenModal: (type: 'studentLogin' | 'schoolLogin' | 'adminLogin' | 'studentRegister' | 'schoolRegister') => void;
  schools: School[];
}

export default function HomeView({ onOpenModal, schools }: HomeViewProps) {
  const {
    selectedSyllabusGroup,
    setSelectedSyllabusGroup,
    faqOpen,
    toggleFaq
  } = useHomeState();

  const approvedSchools = schools.filter(s => s.status === 'APPROVED');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans" id="eno-public-portal">
      {/* Header (including dates banner notification ticker) */}
      <HomeHeader onOpenModal={onOpenModal} />

      {/* Hero Section */}
      <HomeHero onOpenModal={onOpenModal} />

      {/* Highlights Bar */}
      <HomeHighlights />

      {/* Workflow steps */}
      <HomeWorkflow />

      {/* Syllabus Grid & Exam Pattern breakdown */}
      <HomeSyllabus 
        selectedSyllabusGroup={selectedSyllabusGroup}
        setSelectedSyllabusGroup={setSelectedSyllabusGroup}
      />

      {/* Agenda & Important deadlines */}
      <HomeTimeline />

      {/* Benefits list & registration stats */}
      <HomeBenefits approvedSchoolsCount={approvedSchools.length} />

      {/* FAQ list */}
      <HomeFaq faqOpen={faqOpen} toggleFaq={toggleFaq} />

      {/* Helpdesk connect & queries */}
      <HomeContact />

      {/* Footer copyright */}
      <HomeFooter />
    </div>
  );
}
