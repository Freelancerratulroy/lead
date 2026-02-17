
import React, { useState, useEffect, useRef } from 'react';
import { Code2, Eye, Paintbrush, ImageIcon, Link as LinkIcon, Type, Sparkles, Copy, Check, Download, RotateCcw } from 'lucide-react';
import { analyzeHTMLCode, updateHTMLCode } from '../services/geminiService';
import { HTMLAnalysis, EditableField } from '../types';

interface HTMLVisualizerProps {
  onBack?: () => void;
}

const HTMLVisualizer: React.FC<HTMLVisualizerProps> = () => {
  const [htmlCode, setHtmlCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [analysis, setAnalysis] = useState<HTMLAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiCommand, setAiCommand] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleAnalyze = async () => {
    if (!htmlCode.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await analyzeHTMLCode(htmlCode);
      setAnalysis(result);
      setOriginalCode(htmlCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyAI = async (command?: string) => {
    const instr = command || aiCommand;
    if (!instr.trim()) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await updateHTMLCode(htmlCode, instr);
      setHtmlCode(result.code);
      setAiCommand('');
      // Re-analyze for fresh fields if major changes happened
      const freshAnalysis = await analyzeHTMLCode(result.code);
      setAnalysis(freshAnalysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFieldChange = async (field: EditableField, newValue: string) => {
    const instruction = `Change the ${field.type} for "${field.label}" to "${newValue}". Ensure the rest of the code remains identical.`;
    setIsProcessing(true);
    try {
      const result = await updateHTMLCode(htmlCode, instruction);
      setHtmlCode(result.code);
    } catch (err: any) {
      setError("Failed to update field: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setHtmlCode(originalCode);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'modified-page.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-200">
            <Code2 className="text-white w-8 h-8" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">HTML Visual Editor</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Paste your HTML code below. Our AI will analyze the structure and provide you with an easy-to-use visual interface to swap images, links, and styles.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-2">Source HTML</span>
          </div>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            placeholder="<!-- Paste your code here... -->"
            className="w-full h-96 p-6 font-mono text-sm focus:outline-none bg-slate-50/30"
          />
          <div className="p-6 bg-slate-50 border-t border-slate-200">
            <button
              onClick={handleAnalyze}
              disabled={isProcessing || !htmlCode.trim()}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>Analyze & Start Editing</span>
            </button>
          </div>
        </div>
        {error && <p className="mt-4 text-red-500 text-center font-bold">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] animate-in fade-in duration-500">
      {/* Toolbar */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setAnalysis(null)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <RotateCcw className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h3 className="font-bold text-slate-900 leading-none">{analysis.title}</h3>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">AI Visual Workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Reset</button>
          <button onClick={handleCopy} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>Copy Code</span>
          </button>
          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-black rounded-xl transition-colors">
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Controls */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-inner overflow-y-auto">
          <div className="p-6 space-y-8">
            {/* AI Command Box */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Magic Edit</label>
              <div className="relative">
                <textarea
                  value={aiCommand}
                  onChange={(e) => setAiCommand(e.target.value)}
                  placeholder="e.g. Make the text colors blue, change font to Roboto..."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                />
                <button
                  onClick={() => handleApplyAI()}
                  disabled={isProcessing}
                  className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Controls */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold border-b border-slate-100 pb-2">
                <Paintbrush className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Visual Components</span>
              </div>
              
              {analysis.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      {field.type === 'image' && <ImageIcon className="w-3 h-3 text-slate-400" />}
                      {field.type === 'link' && <LinkIcon className="w-3 h-3 text-slate-400" />}
                      {field.type === 'text' && <Type className="w-3 h-3 text-slate-400" />}
                      {field.type === 'color' && <Paintbrush className="w-3 h-3 text-slate-400" />}
                      {field.label}
                    </label>
                  </div>
                  {field.type === 'color' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue={field.currentValue}
                        onBlur={(e) => handleFieldChange(field, e.target.value)}
                        className="w-10 h-10 rounded-lg border border-slate-200 p-1 cursor-pointer"
                      />
                      <input 
                        type="text" 
                        defaultValue={field.currentValue}
                        onBlur={(e) => handleFieldChange(field, e.target.value)}
                        className="flex-1 text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                      />
                    </div>
                  ) : (
                    <input
                      type="text"
                      defaultValue={field.currentValue}
                      onBlur={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field.type}...`}
                      className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex flex-col bg-slate-50 p-6 overflow-hidden">
          <div className="flex bg-white rounded-2xl shadow-sm border border-slate-200 p-1 mb-4 w-fit mx-auto">
            <button 
              onClick={() => setActiveTab('visual')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'visual' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
            <button 
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold transition-all ${activeTab === 'code' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}
            >
              <Code2 className="w-4 h-4" />
              <span>Code Editor</span>
            </button>
          </div>

          <div className="flex-1 rounded-3xl overflow-hidden border border-slate-200 shadow-2xl bg-white relative">
            {isProcessing && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
                <div className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 flex flex-col items-center">
                   <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
                   <p className="text-slate-900 font-black text-xs uppercase tracking-widest">AI is rewriting code...</p>
                </div>
              </div>
            )}

            {activeTab === 'visual' ? (
              <iframe
                ref={iframeRef}
                srcDoc={htmlCode}
                className="w-full h-full"
                title="Preview"
              />
            ) : (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                className="w-full h-full p-8 font-mono text-sm bg-slate-900 text-blue-300 focus:outline-none resize-none"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLVisualizer;
