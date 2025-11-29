import React, { useState, useEffect, useRef } from 'react';
import { Play, Sparkles, Eraser, MessageSquare, Loader2, Save } from 'lucide-react';
import { DatabaseSchema } from '../types';
import { generateSqlFromPrompt, explainSql } from '../services/geminiService';

interface SqlEditorProps {
  value: string;
  onChange: (val: string) => void;
  onRun: () => void;
  schema: DatabaseSchema;
  dbType: string;
  isExecuting: boolean;
}

const SqlEditor: React.FC<SqlEditorProps> = ({ 
  value, 
  onChange, 
  onRun, 
  schema, 
  dbType,
  isExecuting 
}) => {
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    setExplanation(null);
    try {
      const sql = await generateSqlFromPrompt(aiPrompt, schema, dbType);
      onChange(sql);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExplain = async () => {
    if (!value.trim()) return;
    setIsGenerating(true);
    try {
      const exp = await explainSql(value);
      setExplanation(exp);
    } finally {
      setIsGenerating(false);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg overflow-hidden border border-slate-700 shadow-xl">
      {/* AI Bar */}
      <div className="bg-slate-800 p-3 border-b border-slate-700 flex flex-col gap-2">
        <div className="flex items-center gap-2">
            <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                <input 
                type="text" 
                placeholder="Ask AI to write a query (e.g., 'Show top 5 users by spend')"
                className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder:text-slate-500"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
                />
            </div>
            <button 
                onClick={handleAiGenerate}
                disabled={isGenerating || !aiPrompt}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
            >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate SQL'}
            </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 relative bg-[#0d1117] font-mono text-sm group">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full bg-transparent text-slate-200 p-4 resize-none focus:outline-none leading-relaxed"
          placeholder="SELECT * FROM..."
          spellCheck={false}
        />
      </div>

      {/* Toolbar */}
      <div className="bg-slate-800 p-2 border-t border-slate-700 flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <button 
                onClick={onRun}
                disabled={isExecuting || !value}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-700 disabled:text-slate-500 text-white px-4 py-1.5 rounded text-xs font-semibold uppercase tracking-wide transition-all"
            >
                {isExecuting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                <span>Run Query</span>
            </button>
            <button 
                onClick={() => onChange('')}
                className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded hover:bg-slate-700"
                title="Clear Editor"
            >
                <Eraser className="w-4 h-4" />
            </button>
            <button 
                onClick={handleExplain}
                className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors rounded hover:bg-slate-700 flex items-center gap-1 text-xs"
                title="Explain Query"
            >
                <MessageSquare className="w-4 h-4" />
                <span>Explain</span>
            </button>
        </div>
        <div className="text-xs text-slate-500 font-mono">
            {dbType} Mode
        </div>
      </div>

      {/* Explanation Panel */}
      {explanation && (
        <div className="p-4 bg-slate-800/50 border-t border-slate-700 text-sm text-slate-300 animate-in slide-in-from-bottom-2 fade-in">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" /> AI Explanation
                </h4>
                <button onClick={() => setExplanation(null)} className="text-slate-500 hover:text-white">&times;</button>
            </div>
            <div className="prose prose-invert prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{explanation}</p>
            </div>
        </div>
      )}
    </div>
  );
};

export default SqlEditor;