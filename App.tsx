
import React, { useState, useCallback } from 'react';
import Header from './components/Header.tsx';
import LeadForm from './components/LeadForm.tsx';
import LeadTable from './components/LeadTable.tsx';
import HTMLVisualizer from './components/HTMLVisualizer.tsx';
import { AppStatus, Lead } from './types.ts';
import { searchLeads } from './services/geminiService.ts';
import { Search, Loader2, CheckCircle2, AlertTriangle, ChevronRight, Bookmark, BarChart3, Target, ShieldCheck, Sparkles, Copy, Globe, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'leads' | 'htmlvis'>('leads');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [markdown, setMarkdown] = useState('');
  const [sources, setSources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (business: string, location: string) => {
    setStatus(AppStatus.SEARCHING);
    setError(null);
    setSources([]);
    try {
      const result = await searchLeads(business, location);
      setLeads(result.leads);
      setMarkdown(result.markdown);
      setSources(result.sources);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      setError(err?.message || 'The Gemini API request failed. Please check your configuration.');
      setStatus(AppStatus.ERROR);
    }
  };

  const copyMarkdown = useCallback(() => {
    if (markdown) {
      navigator.clipboard.writeText(markdown);
      alert('Table data copied as Markdown! You can paste this directly into Excel or Google Sheets.');
    }
  }, [markdown]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-blue-100 selection:text-blue-900 bg-slate-50/50">
      <Header currentView={view} onViewChange={setView} />
      
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {view === 'leads' ? (
          <>
            <div className="mb-12 text-center max-w-3xl mx-auto animate-in fade-in duration-700">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider mb-6 border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                Gemini 3 Pro Integration
              </div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight mb-6">
                AI <span className="text-blue-600">Lead Intelligence</span> & SEO Audit
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                Instantly discover high-intent businesses using Google Search grounding and identify technical failures to create the perfect outreach pitch.
              </p>
            </div>

            <LeadForm onSearch={handleSearch} isLoading={status === AppStatus.SEARCHING} />

            {status === AppStatus.SEARCHING && (
              <div className="mt-12 flex flex-col items-center justify-center p-20 bg-white rounded-[3rem] border border-slate-200 border-dashed animate-pulse shadow-inner">
                <div className="bg-blue-600 p-6 rounded-3xl mb-8 shadow-2xl shadow-blue-200">
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-3">Gemini is Thinking...</h3>
                <div className="max-w-md text-center space-y-4">
                  <p className="text-slate-500 font-medium">Scanning live business directories and performing technical SEO audits on matching domains.</p>
                  <div className="flex flex-col items-center gap-3 mt-8">
                    <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-4 py-2 rounded-full border border-green-100">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Search Grounding Active</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      <Sparkles className="w-4 h-4 animate-bounce" />
                      <span>Extracting Contact Intel</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === AppStatus.ERROR && (
              <div className="mt-12 bg-red-50 border border-red-100 p-8 rounded-[2.5rem] flex items-start gap-6 shadow-xl shadow-red-100/50">
                <div className="bg-red-600 p-4 rounded-2xl shadow-lg shadow-red-200">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-red-900 mb-2">Connection Failure</h3>
                  <p className="text-red-700 mb-6 font-medium leading-relaxed">{error}</p>
                  <button 
                    onClick={() => setStatus(AppStatus.IDLE)}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-xl shadow-red-200 active:scale-95"
                  >
                    Reset Dashboard
                  </button>
                </div>
              </div>
            )}

            {status === AppStatus.SUCCESS && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <LeadTable leads={leads} onCopyMarkdown={copyMarkdown} />

                {sources.length > 0 && (
                  <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-blue-600" />
                      Verification Sources
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {sources.map((source, idx) => (
                        source.web && (
                          <a 
                            key={idx} 
                            href={source.web.uri} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 rounded-xl border border-slate-200 transition-colors"
                          >
                            <span className="truncate max-w-[200px]">{source.web.title || source.web.uri}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
                  <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                    <div className="bg-white/10 w-fit p-4 rounded-2xl mb-8 border border-white/10 shadow-xl backdrop-blur-md">
                      <Bookmark className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-black mb-4 tracking-tight">Outreach Strategy</h3>
                    <p className="text-slate-300 font-medium mb-8 leading-relaxed opacity-90">
                      Target businesses with <span className="text-white font-bold">"No GBP"</span> status first. These are high-intent leads who are currently invisible to local customers.
                    </p>
                    <div className="space-y-4">
                      {[
                        'Mention specific SEO flaws found by Gemini',
                        'Attach a performance audit of their slow pages',
                        'Offer to claim their business profile for free'
                      ].map((tip, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-100 group-hover:translate-x-1 transition-transform">
                          <ChevronRight className="w-5 h-5 text-blue-500 bg-blue-500/10 rounded-full p-1" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-[3rem] p-10 flex flex-col justify-between shadow-xl relative overflow-hidden">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">CRM Data Export</h3>
                      <p className="text-slate-500 mb-8 leading-relaxed font-medium">
                        Copy the raw intelligence report below to instantly populate your CRM or sales automation tools.
                      </p>
                    </div>
                    <div className="relative group">
                      <pre className="bg-slate-50 text-slate-400 p-6 rounded-[2rem] text-[10px] overflow-hidden h-40 opacity-60 select-none border border-slate-100 group-hover:opacity-80 transition-opacity font-mono leading-relaxed">
                        {markdown.substring(0, 1000)}...
                      </pre>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button 
                          onClick={copyMarkdown}
                          className="px-10 py-5 bg-white border-2 border-slate-900 text-slate-900 font-black rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-2xl shadow-slate-200 active:scale-95 flex items-center gap-3"
                        >
                          <Copy className="w-5 h-5" />
                          <span>Sync Intelligence Report</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {status === AppStatus.IDLE && (
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {[
                  { 
                    title: "Gemini 3 Pro Core", 
                    desc: "Leveraging the latest multimodal architecture for superior business data reasoning.",
                    icon: <Target className="w-6 h-6 text-white" />,
                    color: "bg-blue-600"
                  },
                  { 
                    title: "Deep SEO Analysis", 
                    desc: "Instantly detect critical missing components in technical site performance.",
                    icon: <BarChart3 className="w-6 h-6 text-white" />,
                    color: "bg-indigo-600"
                  },
                  { 
                    title: "Sales Automation", 
                    desc: "Perfectly formatted lead lists ready for your cold outreach sequences.",
                    icon: <Sparkles className="w-6 h-6 text-white" />,
                    color: "bg-slate-900"
                  }
                ].map((feature, i) => (
                  <div key={i} className="p-8 bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all hover:shadow-2xl hover:-translate-y-1 group">
                    <div className={`${feature.color} w-16 h-16 flex items-center justify-center rounded-2xl mb-6 shadow-xl shadow-slate-100 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <HTMLVisualizer />
        )}
      </main>

      <footer className="border-t border-slate-200 py-12 bg-white mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col items-center gap-4">
             <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <span className="font-black text-slate-900 tracking-tighter text-lg">LeadGen<span className="text-blue-600">Pro</span></span>
             </div>
             <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
               &copy; {new Date().getFullYear()} AI Specialist Hub • Powered by Gemini API
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
