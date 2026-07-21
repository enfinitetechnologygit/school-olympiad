import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Option {
  value: string | number;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string | number;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  required = false,
  className = ""
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Find currently selected option
  const selectedOption = options.find(opt => opt.value === value);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search query
  const filteredOptions = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt: Option) => {
    onChange(opt.value);
    setSearch('');
    setIsOpen(false);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearch(''); // Clear search query on focus to show all options
  };

  return (
    <div ref={wrapperRef} className={`relative w-full ${className}`}>
      {/* Combobox Input field wrapper */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full mt-1 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl p-2.5 text-sm transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 cursor-pointer"
      >
        <input
          type="text"
          required={required && !value}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={isOpen ? search : (selectedOption ? selectedOption.label : '')}
          onChange={(e) => {
            setSearch(e.target.value);
            setIsOpen(true);
          }}
          onFocus={handleInputFocus}
          className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-500 font-medium text-sm select-none"
        />
        
        <ChevronDown 
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ml-2 ${
            isOpen ? 'rotate-180 text-blue-500' : ''
          }`} 
        />
      </div>

      {/* HeroUI v3 Popover Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl shadow-xl p-1.5 focus:outline-none scrollbar-thin"
          >
            {/* Search icon indicator inside list if filtered */}
            {search && filteredOptions.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">
                <Search className="w-3 h-3" />
                <span>Search Matches</span>
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleSelect(opt)}
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-bold rounded-xl cursor-pointer transition ${
                      isSelected 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-4 text-center text-xs text-slate-400 font-medium">
                No matching options found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
