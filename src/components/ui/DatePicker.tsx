import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DatePickerProps {
  value: string; // YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select Date",
  required = false,
  className = ""
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Parse initial date value or default to current date
  const initialDate = value ? new Date(value) : new Date();
  const [month, setMonth] = useState(initialDate.getMonth());
  const [year, setYear] = useState(initialDate.getFullYear());

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setMonth(d.getMonth());
        setYear(d.getFullYear());
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate Year Options (-50 to +10 years)
  const currentYearNum = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let y = currentYearNum - 40; y <= currentYearNum + 10; y++) {
    yearOptions.push(y);
  }

  // Get days array for current month
  const getDaysInMonth = (m: number, y: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (m: number, y: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(month, year);
  const firstDayIndex = getFirstDayOfMonth(month, year);

  // Generate date cells
  const dayCells: (number | null)[] = [];
  // Empty slots for alignment
  for (let i = 0; i < firstDayIndex; i++) {
    dayCells.push(null);
  }
  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    dayCells.push(d);
  }

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(prev => prev - 1);
    } else {
      setMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(prev => prev + 1);
    } else {
      setMonth(prev => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDateStr = `${year}-${formattedMonth}-${formattedDay}`;
    onChange(selectedDateStr);
    setIsOpen(false);
  };

  // Check if cell matches currently selected value
  const isSelectedDate = (day: number | null) => {
    if (!day || !value) return false;
    const [vYear, vMonth, vDay] = value.split('-').map(Number);
    return vYear === year && vMonth === (month + 1) && vDay === day;
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {/* DatePicker input wrapper */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mt-1 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl p-2.5 text-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 cursor-pointer"
      >
        <input
          type="text"
          readOnly
          required={required}
          placeholder={placeholder}
          value={value ? new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
          className="bg-transparent border-none outline-none text-slate-800 placeholder-slate-500 font-medium text-sm w-full cursor-pointer select-none"
        />
        <CalendarIcon className={`w-4 h-4 text-slate-400 shrink-0 transition ${isOpen ? 'text-blue-500' : ''}`} />
      </div>

      {/* Date Picker Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 mt-1 max-w-[320px] w-full bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl p-4 focus:outline-none"
          >
            {/* Header controls */}
            <div className="flex justify-between items-center mb-3">
              <button 
                type="button" 
                onClick={handlePrevMonth}
                className="p-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-1.5 text-xs font-bold text-slate-800">
                {/* Month Selector */}
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1 px-1.5 focus:outline-none cursor-pointer"
                >
                  {monthNames.map((name, idx) => (
                    <option key={idx} value={idx}>{name}</option>
                  ))}
                </select>

                {/* Year Selector */}
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-lg p-1 px-1.5 focus:outline-none cursor-pointer"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <button 
                type="button" 
                onClick={handleNextMonth}
                className="p-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Days Grid header */}
            <div className="grid grid-cols-7 text-center text-[10px] font-black uppercase text-slate-400 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold">
              {dayCells.map((day, idx) => {
                if (day === null) {
                  return <span key={`empty-${idx}`} />;
                }
                const isSelected = isSelectedDate(day);
                const isCurrent = isToday(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`py-1.5 rounded-lg transition cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white font-extrabold shadow-sm'
                        : isCurrent
                          ? 'bg-blue-50 border border-blue-200 text-blue-600 font-extrabold'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
