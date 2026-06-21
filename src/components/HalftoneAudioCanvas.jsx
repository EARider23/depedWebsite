import React, { useRef, useEffect } from 'react';

export default function HalftoneAudioCanvas({ getFrequencyData }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let resizeTimeout;
    let animationFrameId;
    let dotData = [];
    let width = 0;
    let height = 0;

    const setupDots = () => {
      const parent = canvas.parentElement;
      width = parent.clientWidth;
      height = parent.clientHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      const spacing = 12; // Grid spacing
      dotData = [];

      for (let y = spacing; y < height; y += spacing) {
        for (let x = spacing; x < width; x += spacing) {
          dotData.push({ x, y, baseX: x, baseY: y });
        }
      }
    };

    const render = () => {
      ctx.fillStyle = '#ffffffff'; // White background
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.001;
      const freqData = getFrequencyData ? getFrequencyData() : null;
      
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const hoverRadius = 100;

      ctx.fillStyle = '#030712'; // Dark color for dots

      for (let i = 0; i < dotData.length; i++) {
        const dot = dotData[i];
        let drawX = dot.baseX;
        let drawY = dot.baseY;
        let size = 1.5;

        // --- Idle Wavy Animation (Grass/Wind effect) ---
        // Create a wave based on X and Y position and time
        const waveX = Math.sin(dot.baseY * 0.02 + time) * 3;
        const waveY = Math.cos(dot.baseX * 0.02 + time) * 3;
        drawX += waveX;
        drawY += waveY;

        // --- Audio Reactive Animation ---
        if (freqData) {
            // Map the dot's X position to an index in the frequency array
            // frequency bin count is usually 128 (for fftSize 256)
            const numBands = freqData.length;
            const normalizedX = dot.baseX / width;
            const freqIndex = Math.floor(normalizedX * numBands);
            const freqValue = freqData[freqIndex] || 0; // 0 to 255
            
            // The louder the frequency, the higher it shifts up and bigger it gets
            const intensity = freqValue / 255;
            
            // Make the bottom dots react more, or center dots react more.
            // Let's just lift them up based on intensity
            drawY -= intensity * 40; // Jump up to 40px
            size += intensity * 3;   // Grow up to 3px extra
            
            // Add some color variance based on intensity
            if (intensity > 0.5) {
                ctx.fillStyle = `rgba(107, 33, 168, ${intensity})`; // Purple
            } else {
                ctx.fillStyle = '#030712';
            }
        }

        // --- Mouse Interaction ---
        const dx = drawX - mx;
        const dy = drawY - my;
        const distSq = dx * dx + dy * dy;

        if (distSq < hoverRadius * hoverRadius) {
          const dist = Math.sqrt(distSq);
          const force = 1 - dist / hoverRadius;
          drawX += (dx / dist) * (force * 10);
          drawY += (dy / dist) * (force * 10);
          size += force * 1.5;
        }

        ctx.beginPath();
        ctx.arc(drawX, drawY, size, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    setupDots();
    render();

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    const observer = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setupDots();
      }, 100);
    });
    observer.observe(canvas.parentElement);

    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [getFrequencyData]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
  );
}
