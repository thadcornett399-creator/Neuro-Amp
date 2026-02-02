import React, { useState, useEffect, useRef } from 'react';

interface KnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (val: number) => void;
  color?: string;
  step?: number;
}

export const Knob: React.FC<KnobProps> = ({ 
  label, 
  value, 
  min, 
  max, 
  onChange, 
  color = 'border-zinc-500', 
  step = 0.01 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const knobRef = useRef<HTMLDivElement>(null);

  // Map value to rotation (-135deg to 135deg)
  const percentage = (value - min) / (max - min);
  const rotation = -135 + (percentage * 270);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = startY - e.clientY;
      // Sensitivity: 200px = full range
      const deltaValue = (deltaY / 200) * (max - min);
      let newValue = startValue + deltaValue;
      newValue = Math.min(Math.max(newValue, min), max);
      
      // Snap to step if needed, but smooth is better for DSP
      if (step) {
        newValue = Math.round(newValue / step) * step;
      }
      
      onChange(newValue);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startY, startValue, min, max, onChange, step]);

  return (
    <div className="flex flex-col items-center gap-2 select-none group">
      <div 
        ref={knobRef}
        className={`relative w-16 h-16 rounded-full border-4 ${color} bg-zinc-800 shadow-xl cursor-ns-resize hover:scale-105 transition-transform active:scale-95`}
        style={{ transform: `rotate(${rotation}deg)` }}
        onMouseDown={handleMouseDown}
      >
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-white rounded-full shadow-[0_0_8px_white]"></div>
      </div>
      <div className="text-center">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{label}</div>
        <div className="text-[10px] text-zinc-500 font-mono">{value.toFixed(2)}</div>
      </div>
    </div>
  );
};