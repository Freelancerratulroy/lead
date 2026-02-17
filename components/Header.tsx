
import React from 'react';
import { Target, Search, BarChart3, Code2 } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: any) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <button 
          onClick={() => onViewChange('leads')}
          className="flex items-center gap-2 hover:opacity-80 transition-all text-left"
        >
          <div className="bg-blue-600 p-2 rounded-lg">
            <Target className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-none">LeadGen Pro</h1>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">SEO Specialist</p>
          </div>
        </button>
        
        <nav className="hidden md:flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => onViewChange('leads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'leads' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Search className="w-4 h-4" />
            <span>Prospect Finder</span>
          </button>
          <button 
            onClick={() => onViewChange('htmlvis')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${currentView === 'htmlvis' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
          >
            <Code2 className="w-4 h-4" />
            <span>HTML VIS Editor</span>
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-[10px] px-2.5 py-1 bg-green-500 text-white font-black rounded-lg uppercase tracking-wider shadow-lg shadow-green-100">
            Gemini 3 Pro
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
