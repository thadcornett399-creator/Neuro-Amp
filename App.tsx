import React, { useState, useEffect } from 'react';
import { Zap, Mic, Wand2, Share, Mic2, Guitar } from 'lucide-react';
import { AudioSettings, RhythmSettings, LoopTrack } from './types';
import { audioEngine } from './services/audioEngine';
import { learningService } from './services/learningService';
import { generateToneFromDescription, generateDrumPattern } from './services/geminiService';
import { Knob } from './components/Knob';
import { RackUnit } from './components/RackUnit';
import { Visualizer } from './components/Visualizer';
import { Looper } from './components/Looper';
import { DrumMachine } from './components/DrumMachine';
import { StyleAssistant } from './components/StyleAssistant';
import { PresetManager } from './components/PresetManager';

const INITIAL_SETTINGS: AudioSettings = {
  inputMode: 'guitar',
  inputGain: 1.0,
  drive: 0.0,
  driveModel: 'overdrive',
  toneBass: 0.0,
  toneMid: 0.0,
  toneTreble: 0.0,
  delayTime: 0.3,
  delayFeedback: 0.0,
  reverbMix: 0.1,
  chorusSpeed: 1.0,
  chorusDepth: 0.0,
  chorusMix: 0.0,
  tremoloSpeed: 4.0,
  tremoloDepth: 0.0,
  compressorThreshold: -24,
  compressorRatio: 12,
  outputVolume: 0.8
};

const INITIAL_RHYTHM: RhythmSettings = {
  bpm: 120,
  pattern: 'basic-rock',
  volume: 0.6,
  isPlaying: false,
  kickType: 'classic',
  snareType: 'classic',
  hihatType: 'classic'
};

const App: React.FC = () => {
  const [isAudioStarted, setIsAudioStarted] = useState(false);
  const [settings, setSettings] = useState<AudioSettings>(INITIAL_SETTINGS);
  const [rhythmSettings, setRhythmSettings] = useState<RhythmSettings>(INITIAL_RHYTHM);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingDrums, setIsGeneratingDrums] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareStatus, setShareStatus] = useState<string>('');

  // Check URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('s');
    if (sharedData) {
      try {
        const decoded = JSON.parse(atob(sharedData));
        if (decoded.audio) setSettings(prev => ({ ...prev, ...decoded.audio }));
        if (decoded.rhythm) setRhythmSettings(prev => ({ ...prev, ...decoded.rhythm }));
        // Clean URL without reload
        window.history.replaceState({}, '', window.location.pathname);
      } catch (e) {
        console.error("Failed to parse shared settings", e);
      }
    }
  }, []);

  // Initialize Audio on user interaction
  const startAudio = async () => {
    try {
      await audioEngine.startInput();
      setIsAudioStarted(true);
      setError(null);
    } catch (err) {
      setError("Please allow microphone access to use the interface.");
    }
  };

  // Sync settings to engine
  useEffect(() => {
    if (isAudioStarted) {
      audioEngine.updateSettings(settings);
    }
  }, [settings, isAudioStarted]);

  // Sync rhythm settings
  useEffect(() => {
    if (isAudioStarted) {
      audioEngine.setRhythmSettings(rhythmSettings);
    }
  }, [rhythmSettings, isAudioStarted]);

  const updateSetting = (key: keyof AudioSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAIToneGen = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const newSettings = await generateToneFromDescription(aiPrompt);
    setSettings(prev => ({ ...prev, ...newSettings }));
    setIsGenerating(false);
  };

  const handleRecordingComplete = () => {
    // When a user commits a recording, we assume this setup is significant to their style.
    learningService.logSession(settings, rhythmSettings);
  };

  const handleGenerateDrums = async (track: LoopTrack) => {
    setIsGeneratingDrums(true);
    // Use the current prompt context, or a default rock description if empty
    const description = aiPrompt || "Standard rock beat with dynamic feel";
    
    // Save current pattern state just in case
    const oldPattern = rhythmSettings.pattern;
    
    const newPatternData = await generateDrumPattern(description, rhythmSettings.bpm);
    const newName = `AI-Loop-Gen-${Date.now().toString().slice(-4)}`;
    
    audioEngine.savePattern(newName, newPatternData);
    
    setRhythmSettings(prev => ({
        ...prev,
        pattern: newName,
        isPlaying: true // Auto start to preview
    }));
    
    setIsGeneratingDrums(false);
  };

  const applyAiSettings = (newSettings: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const applyAiRhythm = (newRhythm: Partial<RhythmSettings>) => {
    setRhythmSettings(prev => ({ ...prev, ...newRhythm }));
  };

  const handleShare = () => {
    const data = {
        audio: settings,
        rhythm: { ...rhythmSettings, isPlaying: false } // Don't auto-start on load
    };
    try {
        const b64 = btoa(JSON.stringify(data));
        const url = `${window.location.origin}${window.location.pathname}?s=${b64}`;
        navigator.clipboard.writeText(url);
        setShareStatus('COPIED LINK!');
        setTimeout(() => setShareStatus(''), 2000);
    } catch (e) {
        setShareStatus('ERROR');
    }
  };

  if (!isAudioStarted) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-zinc-950 text-white p-4 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-900/20 blur-[100px] rounded-full"></div>
        
        <div className="z-10 text-center max-w-lg">
          <div className="mb-6 flex justify-center">
            <Zap className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">NEURO<span className="text-yellow-500">AMP</span> AI</h1>
          <p className="text-zinc-400 mb-8 text-lg">
            Next-gen browser DSP. Neural-assisted tone shaping. Infinite loop layering.
          </p>
          
          {error && (
             <div className="mb-6 p-4 bg-red-900/30 border border-red-800 text-red-200 rounded-lg text-sm">
               {error}
             </div>
          )}

          <button 
            onClick={startAudio}
            className="group relative px-8 py-4 bg-zinc-100 text-zinc-950 font-bold text-xl rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
          >
            <span className="flex items-center gap-2">
               <Mic className="w-5 h-5" />
               JACK IN
            </span>
          </button>
          
          <p className="mt-8 text-xs text-zinc-600 font-mono">
            * Requires Microphone Permission.<br/>
            * Headphones recommended to prevent feedback loops.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col md:flex-row bg-zinc-950 text-zinc-100">
      {/* LEFT: Main Rack Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* Header / Visualizer */}
        <div className="h-48 shrink-0 p-4 bg-zinc-900 border-b border-zinc-800 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Zap className="text-yellow-500 fill-yellow-500" size={20}/>
                <h1 className="font-bold tracking-tight text-lg">NEURO<span className="text-yellow-500">AMP</span></h1>
            </div>
            <div className="flex gap-4 items-center">
                {/* Share Button */}
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  title="Copy Link to Clipboard"
                >
                    <Share size={14} />
                    <span>{shareStatus || 'SHARE SETUP'}</span>
                </button>

                {/* Style Associate Button */}
                <StyleAssistant 
                  onApplySettings={applyAiSettings}
                  onApplyRhythm={applyAiRhythm}
                />

                {/* AI Prompt Input */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-1 py-1 focus-within:border-yellow-500 transition-colors w-48 md:w-80">
                    <Wand2 size={16} className="text-purple-500 mr-2" />
                    <input 
                      type="text" 
                      placeholder="Describe tone..."
                      className="bg-transparent border-none outline-none text-sm text-zinc-200 flex-1 placeholder:text-zinc-700 min-w-0"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAIToneGen()}
                    />
                    <button 
                      onClick={handleAIToneGen}
                      disabled={isGenerating}
                      className="bg-purple-900/50 hover:bg-purple-800 text-purple-200 text-xs font-bold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 shrink-0"
                    >
                      {isGenerating ? '...' : 'GENERATE'}
                    </button>
                </div>
            </div>
          </div>
          <div className="flex-1 relative">
             <Visualizer />
          </div>
        </div>

        {/* Rack Scroll Area */}
        <div className="flex-1 overflow-y-auto bg-zinc-950 custom-scrollbar pb-20 md:pb-0">
          
          {/* Unit 0: Rhythm Machine */}
          <RackUnit title="DRUM CORE" color="border-l-amber-500" isOn={true}>
            <DrumMachine settings={rhythmSettings} onChange={setRhythmSettings} />
          </RackUnit>

          {/* Unit 1: Pre-Amp / Drive */}
          <RackUnit title="PRE-AMP" color="border-l-red-500">
             
             {/* Mode Selector */}
             <div className="flex flex-col items-center justify-center gap-2 mr-4 border-r border-zinc-800 pr-6">
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Input Mode</label>
                 <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                     <button 
                        onClick={() => updateSetting('inputMode', 'guitar')}
                        className={`p-2 rounded transition-all ${settings.inputMode === 'guitar' ? 'bg-zinc-700 text-white shadow' : 'text-zinc-600 hover:text-zinc-400'}`}
                        title="Guitar Mode (Amp Modeling)"
                     >
                         <Guitar size={18} />
                     </button>
                     <button 
                        onClick={() => updateSetting('inputMode', 'vocal')}
                        className={`p-2 rounded transition-all ${settings.inputMode === 'vocal' ? 'bg-cyan-900 text-cyan-200 shadow' : 'text-zinc-600 hover:text-zinc-400'}`}
                        title="Vocal/Studio Mic Mode (Transparent)"
                     >
                         <Mic2 size={18} />
                     </button>
                 </div>
             </div>

             {/* Drive Controls (Disabled visually in Vocal Mode) */}
             <div className={`flex items-center gap-8 transition-opacity duration-300 ${settings.inputMode === 'vocal' ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
                <div className="flex flex-col items-center justify-center gap-2 mr-4">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Model</label>
                    <select 
                       value={settings.driveModel}
                       onChange={(e) => updateSetting('driveModel', e.target.value)}
                       className="bg-zinc-900 text-red-400 font-mono text-xs border border-red-900/50 rounded p-1 outline-none cursor-pointer hover:bg-zinc-800 uppercase"
                    >
                        <option value="overdrive">Overdrive</option>
                        <option value="distortion">Distortion</option>
                        <option value="fuzz">Fuzz</option>
                    </select>
                </div>
                <Knob label="Input" value={settings.inputGain} min={0} max={2} onChange={(v) => updateSetting('inputGain', v)} color="border-zinc-400" />
                <Knob label="Drive" value={settings.drive} min={0} max={1} onChange={(v) => updateSetting('drive', v)} color="border-red-500" />
             </div>
             
             <div className="w-px h-16 bg-zinc-800 mx-4"></div>
             <Knob label="Output" value={settings.outputVolume} min={0} max={1} onChange={(v) => updateSetting('outputVolume', v)} />
          </RackUnit>

          {/* Unit 2: Equalizer */}
          <RackUnit title="TONE STACK" color="border-l-blue-500">
             <Knob label="Bass" value={settings.toneBass} min={-20} max={20} onChange={(v) => updateSetting('toneBass', v)} color="border-blue-400" />
             <Knob label="Mid" value={settings.toneMid} min={-20} max={20} onChange={(v) => updateSetting('toneMid', v)} color="border-blue-400" />
             <Knob label="Treble" value={settings.toneTreble} min={-20} max={20} onChange={(v) => updateSetting('toneTreble', v)} color="border-blue-400" />
          </RackUnit>
          
          {/* Unit 3: Modulation & Tremolo */}
          <RackUnit title="MODULATION" color="border-l-indigo-500">
             <div className="flex items-center gap-8 border-r border-zinc-800 pr-8">
                 <span className="text-[10px] font-bold text-indigo-400/50 -rotate-90">CHORUS</span>
                 <Knob label="Speed" value={settings.chorusSpeed} min={0.1} max={5.0} onChange={(v) => updateSetting('chorusSpeed', v)} color="border-indigo-400" />
                 <Knob label="Depth" value={settings.chorusDepth} min={0} max={1.0} onChange={(v) => updateSetting('chorusDepth', v)} color="border-indigo-400" />
                 <Knob label="Mix" value={settings.chorusMix} min={0} max={1.0} onChange={(v) => updateSetting('chorusMix', v)} color="border-indigo-400" />
             </div>
             <div className="flex items-center gap-4">
                 <span className="text-[10px] font-bold text-orange-400/50 -rotate-90">TREMOLO</span>
                 <Knob label="Rate" value={settings.tremoloSpeed} min={0.5} max={12.0} onChange={(v) => updateSetting('tremoloSpeed', v)} color="border-orange-400" />
                 <Knob label="Intensity" value={settings.tremoloDepth} min={0} max={1.0} onChange={(v) => updateSetting('tremoloDepth', v)} color="border-orange-400" />
             </div>
          </RackUnit>

          {/* Unit 4: Time Effects */}
          <RackUnit title="TEMPORAL" color="border-l-emerald-500">
             <Knob label="DLY Time" value={settings.delayTime} min={0} max={2.0} onChange={(v) => updateSetting('delayTime', v)} color="border-emerald-400" />
             <Knob label="Feedback" value={settings.delayFeedback} min={0} max={0.95} onChange={(v) => updateSetting('delayFeedback', v)} color="border-emerald-400" />
             <div className="w-px h-16 bg-zinc-800 mx-4"></div>
             <Knob label="Reverb" value={settings.reverbMix} min={0} max={1} onChange={(v) => updateSetting('reverbMix', v)} color="border-purple-400" />
          </RackUnit>

          {/* Unit 5: Dynamics */}
          <RackUnit title="DYNAMICS" color="border-l-cyan-500">
             <div className="flex items-center gap-4">
                 <Knob label="Threshold" value={settings.compressorThreshold} min={-60} max={0} onChange={(v) => updateSetting('compressorThreshold', v)} color="border-cyan-400" step={1} />
                 <Knob label="Ratio" value={settings.compressorRatio} min={1} max={20} onChange={(v) => updateSetting('compressorRatio', v)} color="border-cyan-400" step={1} />
                 <div className="flex flex-col justify-center text-[10px] text-zinc-500 font-mono w-24">
                     <p>Auto-Leveling</p>
                     <p>Peak Reduction</p>
                 </div>
             </div>
          </RackUnit>

           {/* Unit 6: Memory Bank */}
          <RackUnit title="MEMORY BANK" color="border-l-pink-500">
              <PresetManager currentSettings={settings} onLoad={applyAiSettings} />
          </RackUnit>
        </div>
      </div>

      {/* RIGHT: Loop Station Sidebar */}
      <div className="w-full md:w-96 h-96 md:h-full border-l border-zinc-800 shrink-0">
        <Looper 
            onRecordingComplete={handleRecordingComplete} 
            onGenerateDrums={handleGenerateDrums}
            isGeneratingDrums={isGeneratingDrums}
        />
      </div>
    </div>
  );
};

export default App;