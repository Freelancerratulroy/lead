
import React from 'react';
import { Lead } from '../types';
import { Globe, Phone, Mail, ExternalLink, Copy, CheckCircle, AlertCircle, Share2 } from 'lucide-react';

interface LeadTableProps {
  leads: Lead[];
  onCopyMarkdown: () => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ leads, onCopyMarkdown }) => {
  if (leads.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
      <div className="p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Found {leads.length} Qualified Leads</h3>
          <p className="text-sm text-slate-500">Real-time business data with verified contact info and SEO audits.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCopyMarkdown}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Table (Excel/Sheets)</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors shadow-md shadow-green-100"
          >
            <Share2 className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Business Name</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Contact Info</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Status & Presence</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">SEO Audit (Weak Points)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{lead.businessName}</div>
                  <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-slate-500 transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="text-xs truncate max-w-[150px]">{lead.website !== 'N/A' ? lead.website.replace('https://', '') : 'No Website'}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="truncate max-w-[180px]">{lead.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5">
                      {lead.businessStatus.toLowerCase().includes('yes') || lead.businessStatus.toLowerCase().includes('verified') ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded border border-green-100">
                          <CheckCircle className="w-3 h-3" />
                          GBP VERIFIED
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          <AlertCircle className="w-3 h-3" />
                          NO GBP FOUND
                        </div>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">Social: {lead.socialMedia}</div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex flex-wrap gap-1.5">
                    {lead.seoWeakPoints.map((point, i) => (
                      <span key={i} className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                        {point}
                      </span>
                    ))}
                    {lead.seoWeakPoints.length === 0 && <span className="text-xs text-slate-400 italic">No weaknesses detected</span>}
                  </div>
                </td>
                <td className="px-6 py-5">
                  {lead.website !== 'N/A' && (
                    <a
                      href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all inline-block"
                      title="Visit Website"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-center text-xs text-slate-400 font-medium">
        End of lead list. For higher volume, try refining your location parameters.
      </div>
    </div>
  );
};

export default LeadTable;
