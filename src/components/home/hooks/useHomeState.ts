import { useState } from 'react';

export function useHomeState() {
  const [selectedSyllabusGroup, setSelectedSyllabusGroup] = useState<string>('5-6');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({
    0: true,
  });

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({ ...prev, [index]: !prev[index] }));
  };

  return {
    selectedSyllabusGroup,
    setSelectedSyllabusGroup,
    faqOpen,
    toggleFaq
  };
}
