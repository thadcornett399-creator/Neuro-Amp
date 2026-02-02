import React, { useState, useEffect } from 'react';
import { Save, Trash2, Download, HardDrive } from 'lucide-react';
import { presetService } from '../services/presetService';
import { AudioSettings, TonePreset } from '../types';

interface PresetManagerProps {
    currentSettings: AudioSettings;
    onLoad: (settings: Partial<AudioSettings>) => void;
}

export const PresetManager: React.FC<PresetManagerProps> = ({ currentSettings, onLoad }) => {
    const [presets, setPresets] = useState<TonePreset[]>([]);
    const [name, setName] = useState('');
    const [statusMsg, setStatusMsg] = useState('');

    useEffect(() => {
        loadPresets();
    }, []);

    const loadPresets = () => {
        setPresets(presetService.getPresets());
    };

    const handleSave = () => {
        if (!name.trim()) return;
        const newPreset: TonePreset = {
            name: name,
            description: 'User Custom Preset',
            settings: currentSettings,
            readonly: false
        };
        presetService.savePreset(newPreset);
        loadPresets();
        setName('');
        showStatus('SAVED');
    };

    const handleDelete = (presetName: string) => {
        if (confirm(`Delete preset "${presetName}"?`)) {
            presetService.deletePreset(presetName);
            loadPresets();
        }
    };

    const handleLoad = (p: TonePreset) => {
        onLoad(p.settings);
        showStatus(`LOADED: ${p.name}`);
    };

    const showStatus = (msg: string) => {
        setStatusMsg(msg);
        setTimeout(() => setStatusMsg(''), 2000);
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Input Row */}
            <div className="flex gap-4 items-end">
                <div className="flex-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                        Store Current State
                    </label>
                    <div className="flex gap-2 items-center bg-zinc-950 p-1.5 rounded border border-zinc-800 focus-within:border-pink-500 transition-colors">
                        <HardDrive size={14} className="text-zinc-600 ml-2" />
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Preset Name..."
                            className="bg-transparent border-none outline-none text-zinc-200 text-sm flex-1 font-mono placeholder:text-zinc-700"
                            maxLength={20}
                        />
                        <button 
                            onClick={handleSave}
                            disabled={!name.trim()}
                            className="p-1.5 bg-zinc-800 hover:bg-pink-900 text-zinc-400 hover:text-pink-200 rounded disabled:opacity-30 disabled:hover:bg-zinc-800 transition-colors"
                        >
                            <Save size={16} />
                        </button>
                    </div>
                </div>
                {statusMsg && (
                    <div className="pb-3 text-xs font-mono text-pink-500 animate-pulse">
                        {statusMsg}
                    </div>
                )}
            </div>

            {/* Presets Grid */}
            <div className="w-full">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">
                    Memory Banks
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {presets.map(p => (
                        <div key={p.name} className="bg-zinc-800/30 p-3 rounded border border-zinc-800 hover:border-pink-500/50 group transition-all flex flex-col justify-between gap-3">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold truncate ${p.readonly ? 'text-zinc-400' : 'text-pink-200'}`} title={p.name}>
                                        {p.name}
                                    </span>
                                    {!p.readonly && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleDelete(p.name); }} 
                                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                </div>
                                <p className="text-[10px] text-zinc-600 truncate">{p.description}</p>
                            </div>
                            
                            <button 
                                onClick={() => handleLoad(p)}
                                className="w-full py-1.5 bg-zinc-900 hover:bg-pink-900/40 text-[10px] font-bold text-zinc-500 hover:text-pink-300 rounded border border-zinc-800 hover:border-pink-800 flex items-center justify-center gap-2 transition-colors"
                            >
                                <Download size={10} /> LOAD
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};