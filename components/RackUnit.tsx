import React from 'react';

interface RackUnitProps {
  title: string;
  children: React.ReactNode;
  color?: string; // Border accent color
  isOn?: boolean;
  onToggle?: () => void;
}

export const RackUnit: React.FC<RackUnitProps> = ({ 
  title, 
  children, 
  color = 'border-l-zinc-600',
  isOn = true,
  onToggle 
}) => {
  return (
    <div className={`relative bg-zinc-900 border-y border-zinc-800 p-4 shadow-lg flex flex-col md:flex-row items-center gap-6 overflow-hidden ${!isOn ? 'opacity-50 grayscale' : ''}`}>
      {/* Rack Ears */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-zinc-800 border-r border-zinc-950 flex flex-col justify-between py-2 items-center">
        <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700 shadow-inner"></div>
        <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700 shadow-inner"></div>
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-zinc-800 border-l border-zinc-950 flex flex-col justify-between py-2 items-center">
        <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700 shadow-inner"></div>
        <div className="w-4 h-4 rounded-full bg-zinc-950 border border-zinc-700 shadow-inner"></div>
      </div>

      {/* Main Content */}
      <div className={`ml-8 flex-1 w-full flex flex-col md:flex-row items-center gap-8 border-l-4 pl-4 ${color}`}>
        <div className="w-full md:w-32 flex flex-col justify-center items-start shrink-0">
          <h3 className="text-xl font-black uppercase tracking-tighter text-zinc-100 font-mono">{title}</h3>
          {onToggle && (
            <button 
              onClick={onToggle}
              className={`mt-2 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded border transition-colors ${isOn ? 'bg-red-900/50 text-red-200 border-red-800' : 'bg-zinc-800 text-zinc-500 border-zinc-700'}`}
            >
              {isOn ? 'Active' : 'Bypass'}
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap justify-center gap-8 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};