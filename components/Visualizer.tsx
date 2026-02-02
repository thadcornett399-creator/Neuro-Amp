import React, { useEffect, useRef } from 'react';
import { audioEngine } from '../services/audioEngine';

export const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!audioEngine.analyser) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }

      const bufferLength = audioEngine.analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      audioEngine.analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = '#09090b'; // zinc-950
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2; // Scale down

        // Gradient color based on height/intensity
        const r = barHeight + 25 * (i / bufferLength);
        const g = 250 * (i / bufferLength);
        const b = 50;

        ctx.fillStyle = `rgb(${r},${g},${b})`;
        // Create a mirror effect
        ctx.fillRect(x, canvas.height / 2 - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }

      // Draw Time Domain (Oscilloscope) overlay
      const timeData = new Uint8Array(bufferLength);
      audioEngine.analyser.getByteTimeDomainData(timeData);
      
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.beginPath();
      
      const sliceWidth = canvas.width / bufferLength;
      let tx = 0;
      
      for(let i = 0; i < bufferLength; i++) {
        const v = timeData[i] / 128.0;
        const y = v * canvas.height / 2;
        
        if(i === 0) {
          ctx.moveTo(tx, y);
        } else {
          ctx.lineTo(tx, y);
        }
        tx += sliceWidth;
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={120} 
      className="w-full h-full bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner"
    />
  );
};