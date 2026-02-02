import React, { useState } from 'react';
import { Brain, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { learningService } from '../services/learningService';
import { StyleAnalysis, AudioSettings, RhythmSettings } from '../types';

interface StyleAssistantProps {
  onApplySettings: (settings: Partial<AudioSettings>) => void;
  onApplyRhythm: (rhythm: Partial<RhythmSettings>) => void;
}

export const StyleAssistant: React.FC<StyleAssistantProps> = ({ onApplySettings, onApplyRhythm }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<StyleAnalysis | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysis(null);
    try {
      const result = await learningService.analyzeStyle();
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      // Mock error state if needed, or rely on service fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-xs font-bold uppercase tracking-wider
          ${isOpen ? 'bg-cyan-900/50 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-zinc-900 border-zinc-700 text-zinc-500 hover:text-cyan-400 hover:border-cyan-800'}
        `}
      >
        <Brain size={14} />
        <span>Neural Link</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 w-80 md:w-96 bg-zinc-900/95 backdrop-blur-xl border border-cyan-900/50 rounded-xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-black italic text-cyan-500 flex items-center gap-2">
                <Sparkles size={16} /> STYLE ASSOCIATE
              </h3>
              <p className="text-[10px] text-cyan-700 font-mono">analyzing user behavior patterns...</p>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-zinc-600 hover:text-zinc-400"
            >
              ✕
            </button>
          </div>

          {!analysis && !isAnalyzing && (
            <div className="text-center py-8">
              <p className="text-zinc-400 text-sm mb-4">
                I can analyze your playing history to identify your sonic fingerprint and suggest new ideas.
              </p>
              <button 
                onClick={handleAnalyze}
                className="bg-cyan-700 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-all active:scale-95"
              >
                ANALYZE MY STYLE
              </button>
            </div>
          )}

          {isAnalyzing && (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
              <span className="text-xs font-mono text-cyan-400 animate-pulse">PROCESSING NEURAL DATA...</span>
            </div>
          )}

          {analysis && (
            <div className="space-y-6">
              <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block mb-1">Detected Fingerprint</span>
                <div className="text-2xl font-black text-white tracking-tight">{analysis.fingerprint}</div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">AI Suggestions</span>
                {analysis.suggestions.map((s, i) => (
                  <div key={i} className="group bg-zinc-950/50 border border-zinc-800 hover:border-cyan-700 p-3 rounded-lg transition-colors">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-cyan-200">{s.title}</h4>
                      <button 
                        onClick={() => {
                          onApplySettings(s.settings);
                          if (s.rhythm && s.rhythm.bpm) {
                            onApplyRhythm({ bpm: s.rhythm.bpm, pattern: s.rhythm.patternName || undefined });
                          }
                        }}
                        className="text-[10px] bg-zinc-800 hover:bg-cyan-900 text-cyan-500 px-2 py-1 rounded flex items-center gap-1 transition-colors"
                      >
                        APPLY <ArrowRight size={10} />
                      </button>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed mb-2">{s.reasoning}</p>
                    {s.rhythm && (
                      <div className="text-[10px] font-mono text-zinc-600 flex gap-3 border-t border-zinc-800/50 pt-1">
                         {s.rhythm.bpm && <span>BPM: {s.rhythm.bpm}</span>}
                         {s.rhythm.patternName && <span>Pattern: {s.rhythm.patternName}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <button 
                onClick={handleAnalyze}
                className="w-full py-2 text-xs text-zinc-500 hover:text-cyan-400 border-t border-zinc-800 mt-2"
              >
                Refresh Analysis
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};