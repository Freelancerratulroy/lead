
import React from 'react';
import { Target, Search, BarChart3 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Target className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-900 leading-none">LeadGen Pro</h1>
            <p className="text-xs text-slate-500 font-medium">SEO Audit Specialist</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium">
            <Search className="w-4 h-4" />
            <span>Prospect Finder</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer text-sm font-medium">
            <BarChart3 className="w-4 h-4" />
            <span>SEO Dashboard</span>
          </div>
        </nav>

        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 font-bold rounded uppercase tracking-wider">
            Live Data
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
