
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import LeadForm from './components/LeadForm';
import LeadTable from './components/LeadTable';
import { AppStatus, Lead } from './types';
import { searchLeads } from './services/geminiService';
import { Search, Loader2, CheckCircle2, AlertTriangle, ChevronRight, Bookmark, BarChart3, Target, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (business: string, location: string) => {
    setStatus(AppStatus.SEARCHING);
    setError(null);
    try {
      const result = await searchLeads(business, location);
      setLeads(result.leads);
      setMarkdown(result.markdown);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gemini API connection failed. Please ensure the API key is valid.');
      setStatus(AppStatus.ERROR);
    }
  };

  const copyMarkdown = useCallback(() => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      alert('Markdown table copied! You can now paste it directly into Excel.');
    }
  }, [markdown]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
            <ShieldCheck className="w-4 h-4" />
            Gemini 3 Pro + Search Grounding Active
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            AI <span className="text-blue-600">Lead Prospector</span> & SEO Auditor
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Find real-time business leads using Google's most powerful AI model. We audit their technical SEO on the fly.
          </p>
        </div>

        <LeadForm onSearch={handleSearch} isLoading={status === AppStatus.SEARCHING} />

        {status === AppStatus.SEARCHING && (
          <div className="mt-12 flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-slate-200 border-dashed animate-pulse">
            <div className="bg-blue-50 p-4 rounded-full mb-6">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Gemini is Researching...</h3>
            <div className="max-w-md text-center space-y-2">
              <p className="text-slate-500">Connecting to Google Search to verify business details and audit websites.</p>
              <div className="flex flex-col gap-2 mt-6">
                <div className="flex items-center gap-2 text-xs font-bold text-green-500 justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>GOOGLE SEARCH GROUNDING ENABLED</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-blue-500 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>EXTRACTING TECHNICAL SEO FLAWS</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.ERROR && (
          <div className="mt-12 bg-red-50 border border-red-100 p-8 rounded-2xl flex items-start gap-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">API Error</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <button 
                onClick={() => setStatus(AppStatus.IDLE)}
                className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
              >
                Reset & Try Again
              </button>
            </div>
          </div>
        )}

        {status === AppStatus.SUCCESS && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <LeadTable leads={leads} onCopyMarkdown={copyMarkdown} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 text-white shadow-xl">
                <div className="bg-white/10 w-fit p-3 rounded-2xl mb-6">
                  <Bookmark className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Outreach Strategy</h3>
                <p className="text-slate-300 opacity-90 mb-6 leading-relaxed">
                  Focus on leads with "Poor Page Speed" or "Missing Alt Text". These are visual and easy to explain to business owners.
                </p>
                <div className="space-y-3">
                  {['Mention their specific SEO weak points', 'Show them their lack of GBP (if applicable)', 'Offer a free speed optimization test'].map((tip, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm font-medium">
                      <ChevronRight className="w-4 h-4 text-blue-400" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Export Data</h3>
                  <p className="text-slate-500 mb-6 leading-relaxed">
                    The data is formatted for spreadsheets. Click the button below to copy the entire table.
                  </p>
                </div>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-300 p-4 rounded-xl text-[10px] overflow-hidden h-32 opacity-40 select-none">
                    {markdown.substring(0, 500)}...
                  </pre>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={copyMarkdown}
                      className="px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 font-bold rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-lg active:scale-95"
                    >
                      Copy Markdown for Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {status === AppStatus.IDLE && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12">
            {[
              { 
                title: "Google Search Grounding", 
                desc: "Real-time verification of business information through Google's search engine.",
                icon: <Search className="w-6 h-6 text-blue-600" />
              },
              { 
                title: "On-the-fly SEO Audit", 
                desc: "Automatically identifies 3+ technical issues for every business found.",
                icon: <BarChart3 className="w-6 h-6 text-blue-600" />
              },
              { 
                title: "High Conversion Leads", 
                desc: "Target businesses that need help with their digital presence immediately.",
                icon: <Target className="w-6 h-6 text-blue-600" />
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 bg-white rounded-2xl border border-slate-100 hover:border-blue-200 transition-all hover:shadow-xl group">
                <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-xl mb-4 group-hover:bg-blue-600 transition-colors">
                  <div className="group-hover:text-white transition-colors">
                    {feature.icon}
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-sm text-slate-400 font-medium">
            &copy; 2024 LeadGen Pro Auditor. Powered by Google Gemini 3 Pro.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
