import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Mic, Trash2, Volume2, VolumeX, Layers, Download, Loader2, Edit2, Check, X, Sparkles, Disc, RefreshCw } from 'lucide-react';
import { audioEngine } from '../services/audioEngine';
import { loadSession, saveSession, clearSession } from '../services/trackStorage';
import { LoopTrack } from '../types';

interface LooperProps {
    onRecordingComplete?: () => void;
    onGenerateDrums?: (track: LoopTrack) => void;
    isGeneratingDrums?: boolean;
}

export const Looper: React.FC<LooperProps> = ({ onRecordingComplete, onGenerateDrums, isGeneratingDrums }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [tracks, setTracks] = useState<LoopTrack[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Renaming State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Refs for audio elements to control volume directly
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  // Load Session on Mount
  useEffect(() => {
    const init = async () => {
        const savedTracks = await loadSession();
        if (savedTracks.length > 0) {
            setTracks(savedTracks);
        }
        setIsLoading(false);
    };
    init();
  }, []);

  // Auto-Save Session on Change (Debounced)
  useEffect(() => {
    if (isLoading) return; // Don't save empty state while loading
    
    const handler = setTimeout(() => {
        saveSession(tracks);
    }, 1000);
    
    return () => clearTimeout(handler);
  }, [tracks, isLoading]);

  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingTime(t => t + 0.1);
      }, 100);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecord = async () => {
    if (isRecording) {
      // Stop
      try {
        const blob = await audioEngine.stopRecording();
        const url = URL.createObjectURL(blob);
        const newTrack: LoopTrack = {
          id: Date.now().toString(),
          blob,
          url,
          duration: recordingTime,
          isMuted: false,
          isSolo: false,
          volume: 1.0,
          name: `Loop Layer ${tracks.length + 1}`,
          timestamp: Date.now()
        };
        setTracks(prev => [...prev, newTrack]);
        
        if (onRecordingComplete) {
            onRecordingComplete();
        }

      } catch (e) {
        console.error("Recording failed", e);
      }
      setIsRecording(false);
    } else {
      // Start
      audioEngine.startRecording();
      setIsRecording(true);
    }
  };

  const deleteTrack = (id: string) => {
    setTracks(prev => {
      const track = prev.find(t => t.id === id);
      if (track) URL.revokeObjectURL(track.url);
      const newTracks = prev.filter(t => t.id !== id);
      delete audioRefs.current[id];
      return newTracks;
    });
  };

  const clearAllTracks = async () => {
      if (confirm("Clear all loops? This cannot be undone.")) {
          setTracks([]);
          await clearSession();
      }
  };

  const toggleMute = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isMuted: !t.isMuted } : t));
  };

  const toggleSolo = (id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, isSolo: !t.isSolo } : t));
  };

  const updateVolume = (id: string, vol: number) => {
      setTracks(prev => prev.map(t => t.id === id ? { ...t, volume: vol } : t));
      // Update audio element immediately
      const el = audioRefs.current[id];
      if (el) el.volume = vol;
  };

  // Determine effective mute state based on solo logic
  const hasSolo = tracks.some(t => t.isSolo);
  const shouldBeMuted = (track: LoopTrack) => {
    if (hasSolo) {
        return !track.isSolo;
    }
    return track.isMuted;
  };

  const handleExportMix = async () => {
    if (tracks.length === 0) return;
    setIsExporting(true);
    try {
        const wavBlob = await audioEngine.exportMix(tracks);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `neuroamp-mix-${Date.now()}.wav`;
        document.body.appendChild(a);
        a.click();
        
        window.setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    } catch (e) {
        console.error("Export failed", e);
        alert("Failed to export mix. Ensure you have active tracks.");
    } finally {
        setIsExporting(false);
    }
  };

  const startEditing = (track: LoopTrack) => {
    setEditingId(track.id);
    setEditName(track.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      setTracks(prev => prev.map(t => t.id === editingId ? { ...t, name: editName.trim() } : t));
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-purple-900/10 to-transparent pointer-events-none"></div>

      {/* 1. Header Section */}
      <div className="shrink-0 p-5 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur z-20 flex justify-between items-center">
        <div>
            <h2 className="text-lg font-black font-mono tracking-tighter text-white leading-none flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                LOOP STATION
            </h2>
            <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${tracks.length > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-700'}`}></div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                    {isLoading ? 'Loading Session...' : `${tracks.length} Active Loops`}
                </span>
            </div>
        </div>
        
        <div className="flex gap-2">
            {tracks.length > 0 && (
                <>
                <button 
                    onClick={clearAllTracks}
                    className="p-2 text-zinc-600 hover:text-red-400 hover:bg-zinc-900 rounded transition-colors"
                    title="Clear Session"
                >
                    <Trash2 size={16} />
                </button>
                <button 
                    onClick={handleExportMix}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-purple-300 text-xs font-bold uppercase tracking-wider rounded border border-zinc-800 transition-all"
                >
                    {isExporting ? <Loader2 size={12} className="animate-spin"/> : <Download size={12} />}
                    <span className="hidden sm:inline">Mixdown</span>
                </button>
                </>
            )}
        </div>
      </div>

      {/* 2. Track List Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar z-10">
        {!isLoading && tracks.length === 0 && !isRecording && (
          <div className="h-full flex flex-col items-center justify-center text-zinc-700 opacity-60">
            <Disc size={48} className="mb-4 animate-slow-spin opacity-20" />
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-zinc-600">Tape Empty</p>
            <p className="text-[10px] text-zinc-700 mt-2">Hit the pedal to start looping</p>
          </div>
        )}
        
        {tracks.map((track, index) => {
            const muted = shouldBeMuted(track);
            return (
              <div key={track.id} className={`relative p-3 rounded-r-lg border-l-4 transition-all group overflow-hidden
                ${track.isSolo ? 'bg-amber-950/20 border-l-amber-500' : 'bg-zinc-900 border-l-purple-500'}
                ${muted ? 'opacity-50 grayscale-[0.8]' : ''}
              `}>
                
                {/* Track Content */}
                <div className="flex flex-col gap-3 relative z-10">
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Track Number / Icon */}
                            <div className="text-xs font-black text-zinc-600 font-mono w-6">{(index + 1).toString().padStart(2, '0')}</div>
                            
                            {/* Name Editor */}
                            <div className="flex-1 min-w-0">
                                {editingId === track.id ? (
                                    <div className="flex items-center gap-1 w-full mr-2">
                                         <input 
                                            autoFocus
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            onBlur={saveEdit}
                                            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                                            className="bg-black text-white text-xs px-2 py-1 rounded border border-purple-500/50 outline-none w-full font-bold font-mono"
                                         />
                                    </div>
                                ) : (
                                     <div className="flex items-center gap-2 group/title w-full overflow-hidden">
                                         <span 
                                            onClick={() => startEditing(track)}
                                            className="text-xs font-bold text-zinc-300 truncate cursor-pointer hover:text-white transition-colors uppercase tracking-wide font-mono"
                                         >
                                            {track.name}
                                         </span>
                                         <Edit2 size={10} className="opacity-0 group-hover/title:opacity-100 text-zinc-600" />
                                     </div>
                                )}
                            </div>
                         </div>

                         {/* Track Toolbar */}
                         <div className="flex gap-1">
                             {onGenerateDrums && (
                                <button 
                                    onClick={() => onGenerateDrums(track)}
                                    className="w-6 h-6 flex items-center justify-center rounded bg-zinc-800 hover:bg-purple-900/40 text-purple-500 hover:text-purple-300 transition-colors"
                                    title="Auto-Drum"
                                >
                                    {isGeneratingDrums ? <Loader2 size={10} className="animate-spin" /> : <Sparkles size={10} />}
                                </button>
                             )}
                             <button 
                              onClick={() => toggleSolo(track.id)}
                              className={`w-6 h-6 flex items-center justify-center rounded text-[8px] font-black uppercase tracking-wider transition-all
                                ${track.isSolo ? 'bg-amber-500 text-black shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 'bg-zinc-800 text-zinc-600 hover:text-zinc-300'}
                              `}
                            >
                              S
                            </button>
                            <button 
                              onClick={() => toggleMute(track.id)}
                              className={`w-6 h-6 flex items-center justify-center rounded transition-all
                                ${track.isMuted ? 'bg-red-900/30 text-red-500' : 'bg-zinc-800 text-zinc-600 hover:text-zinc-300'}
                              `}
                            >
                              {track.isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                            </button>
                            <button 
                              onClick={() => deleteTrack(track.id)}
                              className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-900/20 text-zinc-700 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={10} />
                            </button>
                         </div>
                    </div>

                    {/* Volume Fader */}
                    <div className="flex items-center gap-3">
                         <div className="flex-1 h-1.5 bg-zinc-800 rounded-full relative group/fader cursor-pointer">
                             <div 
                                className="absolute top-0 left-0 h-full bg-purple-600 rounded-full"
                                style={{ width: `${track.volume * 100}%` }}
                             />
                             {/* Thumb */}
                             <div 
                                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-zinc-200 rounded-full shadow opacity-0 group-hover/fader:opacity-100 transition-opacity"
                                style={{ left: `${track.volume * 100}%`, transform: 'translate(-50%, -50%)' }}
                             />
                             <input 
                                type="range"
                                min={0}
                                max={1}
                                step={0.01}
                                value={track.volume}
                                onChange={(e) => updateVolume(track.id, parseFloat(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                             />
                         </div>
                    </div>
                </div>

                {/* Hidden Audio Player */}
                <audio 
                    ref={(el) => { audioRefs.current[track.id] = el; if (el) el.volume = track.volume; }}
                    src={track.url} 
                    autoPlay 
                    loop 
                    muted={muted} 
                />
              </div>
            );
        })}
      </div>

      {/* 3. The Pedal (Bottom Control) */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-900 z-30">
         <button 
            onClick={toggleRecord}
            className={`w-full h-20 rounded-lg relative overflow-hidden transition-all duration-200 transform active:scale-[0.98] shadow-2xl flex items-center justify-center group
                ${isRecording 
                    ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.4)] border-red-500' 
                    : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700'}
                border-t-4 border-b-8
            `}
         >
             {/* Pedal Texture */}
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-leather.png')] opacity-30 mix-blend-overlay"></div>
             
             {/* Content */}
             <div className="relative z-10 flex flex-col items-center">
                 {isRecording ? (
                     <>
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 bg-white rounded-full animate-ping"></div>
                            <span className="text-2xl font-black text-white tracking-widest font-mono">REC {recordingTime.toFixed(1)}s</span>
                        </div>
                        <span className="text-[10px] text-red-200 font-bold uppercase tracking-widest mt-1">Tap to Loop</span>
                     </>
                 ) : (
                     <>
                        <Mic className="text-zinc-400 group-hover:text-white mb-1 transition-colors" size={24} />
                        <span className="text-sm font-black text-zinc-500 group-hover:text-white uppercase tracking-[0.2em] transition-colors">
                            {tracks.length === 0 ? 'START RECORDING' : 'OVERDUB / NEW LOOP'}
                        </span>
                     </>
                 )}
             </div>

             {/* Recording Progress Bar */}
             {isRecording && (
                 <div className="absolute bottom-0 left-0 h-1.5 bg-white/50 w-full">
                     <div 
                        className="h-full bg-white transition-all duration-100 ease-linear"
                        style={{ width: `${(recordingTime % 4) / 4 * 100}%` }}
                     ></div>
                 </div>
             )}
         </button>
      </div>
    </div>
  );
};