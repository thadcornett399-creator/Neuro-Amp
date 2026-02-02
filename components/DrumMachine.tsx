import React, { useState, useEffect } from 'react';
import { Play, Square, Music, Save, Trash2, Plus, Grid } from 'lucide-react';
import { Knob } from './Knob';
import { RhythmSettings, DrumPattern, KickType, SnareType, HiHatType } from '../types';
import { audioEngine } from '../services/audioEngine';

interface DrumMachineProps {
  settings: RhythmSettings;
  onChange: (settings: RhythmSettings) => void;
}

export const DrumMachine: React.FC<DrumMachineProps> = ({ settings, onChange }) => {
  const [availablePatterns, setAvailablePatterns] = useState<string[]>([]);
  const [currentPatternData, setCurrentPatternData] = useState<DrumPattern>({
    length: 16, kick: [], snare: [], hihat: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newPatternName, setNewPatternName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  // Initial load
  useEffect(() => {
    refreshPatternList();
  }, []);

  // When selected pattern changes in parent, update local data from engine
  useEffect(() => {
    const data = audioEngine.getPattern(settings.pattern);
    if (data) {
      setCurrentPatternData(JSON.parse(JSON.stringify(data))); // Deep copy to allow editing
    }
  }, [settings.pattern]);

  const refreshPatternList = () => {
    setAvailablePatterns(audioEngine.getPatterns());
  };

  const togglePlay = () => {
    onChange({ ...settings, isPlaying: !settings.isPlaying });
  };

  const updateSetting = (key: keyof RhythmSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('pattern', e.target.value);
    setIsEditing(false);
  };

  const handleGridClick = (instrument: 'kick' | 'snare' | 'hihat', step: number) => {
    const newData = { ...currentPatternData };
    
    // Ensure arrays exist and are long enough
    if (!newData.kick) newData.kick = new Array(16).fill(0);
    if (!newData.snare) newData.snare = new Array(16).fill(0);
    if (!newData.hihat) newData.hihat = new Array(16).fill(0);
    
    const track = newData[instrument];
    // Toggle: 1 -> 0, 0 -> 1
    track[step] = track[step] ? 0 : 1;
    
    setCurrentPatternData(newData);
    setIsEditing(true);
    
    // Send live update to engine
    audioEngine.updateLivePattern(newData);
  };

  const handleSavePattern = () => {
    if (!newPatternName.trim()) return;
    audioEngine.savePattern(newPatternName, currentPatternData);
    refreshPatternList();
    updateSetting('pattern', newPatternName);
    setShowSaveDialog(false);
    setNewPatternName('');
    setIsEditing(false);
  };

  const handleDeletePattern = () => {
    if (confirm(`Delete pattern "${settings.pattern}"?`)) {
      audioEngine.deletePattern(settings.pattern);
      refreshPatternList();
      // Fallback to metronome
      updateSetting('pattern', 'metronome');
    }
  };

  // Helper to render grid row
  const renderRow = (
      label: string, 
      instrument: 'kick' | 'snare' | 'hihat', 
      colorClass: string,
      currentType: string,
      onTypeChange: (val: string) => void,
      options: string[]
    ) => {
    const steps = currentPatternData[instrument] || [];
    return (
      <div className="flex items-center gap-2 mb-2">
        {/* Instrument Control */}
        <div className="w-20 flex flex-col items-end gap-0.5">
           <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</div>
           <select 
             value={currentType} 
             onChange={(e) => onTypeChange(e.target.value)}
             className="text-[9px] bg-transparent text-zinc-400 font-mono text-right border-none outline-none cursor-pointer hover:text-white"
           >
             {options.map(o => (
                <option key={o} value={o} className="bg-zinc-900">{o.toUpperCase()}</option>
             ))}
           </select>
        </div>

        {/* Steps Grid */}
        <div className="flex gap-1">
          {Array.from({ length: 16 }).map((_, i) => {
            const isActive = steps[i] === 1;
            const isBeat = i % 4 === 0;
            return (
              <div 
                key={i}
                onClick={() => handleGridClick(instrument, i)}
                className={`w-3 h-5 md:w-4 md:h-8 rounded-sm cursor-pointer transition-all ${
                  isActive 
                    ? colorClass 
                    : isBeat ? 'bg-zinc-700' : 'bg-zinc-800'
                } hover:opacity-80`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full gap-6">
        {/* Controls Row */}
        <div className="flex flex-wrap items-center justify-center gap-6 w-full">
            {/* Play Button */}
            <button
                onClick={togglePlay}
                className={`flex items-center justify-center w-14 h-14 rounded-full border-4 transition-all shadow-lg shrink-0 ${
                    settings.isPlaying 
                    ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_15px_#f59e0b]' 
                    : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
            >
                {settings.isPlaying ? <Square className="fill-current w-5 h-5" /> : <Play className="fill-current w-5 h-5 ml-1" />}
            </button>

            {/* Knobs */}
            <div className="flex gap-4">
                <Knob 
                    label="Tempo" 
                    value={settings.bpm} 
                    min={40} 
                    max={240} 
                    step={1}
                    onChange={(v) => updateSetting('bpm', v)} 
                    color="border-amber-500"
                />
                <Knob 
                    label="Level" 
                    value={settings.volume} 
                    min={0} 
                    max={1} 
                    onChange={(v) => updateSetting('volume', v)} 
                    color="border-zinc-500"
                />
            </div>

            {/* Pattern Manager */}
            <div className="flex flex-col gap-2 w-48">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pattern</label>
                    <div className="flex gap-1">
                        <button 
                            onClick={() => setShowSaveDialog(true)}
                            title="Save Pattern"
                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-amber-400"
                        >
                            <Save size={14} />
                        </button>
                        <button 
                            onClick={handleDeletePattern}
                            title="Delete Pattern"
                            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>
                
                <div className="relative">
                    <Music className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <select 
                        value={settings.pattern}
                        onChange={handlePatternChange}
                        className="w-full bg-zinc-800 text-zinc-200 text-xs font-mono py-2 pl-9 pr-2 rounded border border-zinc-700 focus:border-amber-500 outline-none appearance-none cursor-pointer hover:bg-zinc-750"
                    >
                        {availablePatterns.map(p => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                </div>
                
                {isEditing && (
                    <div className="text-[10px] text-amber-500 font-mono text-center animate-pulse">
                        * Modified - Unsaved
                    </div>
                )}
            </div>
        </div>

        {/* Step Sequencer Grid */}
        <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800 self-center shadow-inner">
            {renderRow(
                "KICK", "kick", 
                "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]", 
                settings.kickType || 'classic', 
                (v) => updateSetting('kickType', v),
                ['classic', 'heavy', 'electronic']
            )}
            
            {renderRow(
                "SNARE", "snare", 
                "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]",
                settings.snareType || 'classic',
                (v) => updateSetting('snareType', v),
                ['classic', 'tight', 'electronic']
            )}

            {renderRow(
                "HAT", "hihat", 
                "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]",
                settings.hihatType || 'classic',
                (v) => updateSetting('hihatType', v),
                ['classic', 'acoustic', 'electronic']
            )}
        </div>

        {/* Save Dialog Modal Overlay */}
        {showSaveDialog && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
                <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-2xl w-80">
                    <h3 className="text-lg font-bold mb-4">Save Pattern</h3>
                    <input 
                        type="text"
                        placeholder="Pattern Name"
                        value={newPatternName}
                        onChange={(e) => setNewPatternName(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-zinc-100 mb-4 focus:border-amber-500 outline-none"
                    />
                    <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => setShowSaveDialog(false)}
                            className="px-4 py-2 text-sm text-zinc-400 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSavePattern}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold rounded"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};