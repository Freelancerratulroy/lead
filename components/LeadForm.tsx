
import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Zap } from 'lucide-react';

interface LeadFormProps {
  onSearch: (business: string, location: string) => void;
  isLoading: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSearch, isLoading }) => {
  const [business, setBusiness] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (business && location) {
      onSearch(business, location);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Find Your Next Clients</h2>
        <p className="text-slate-500">Enter a business niche and location to generate high-quality leads with pre-audited SEO data.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5 relative">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Business Niche</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              placeholder="e.g. Roofers, Dental Clinics, Real Estate"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-4 relative">
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase ml-1">Target Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. New York, London, Miami"
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-3 flex items-end">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-[54px] flex items-center justify-center gap-2 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all ${
              isLoading 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current" />
                <span>Generate Leads</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-xs text-slate-400 font-medium">Popular:</span>
        {['Dentists in Chicago', 'HVAC in Dallas', 'Lawyers in Sydney'].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              const [b, l] = tag.split(' in ');
              setBusiness(b);
              setLocation(l);
            }}
            className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full hover:bg-slate-200 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeadForm;
