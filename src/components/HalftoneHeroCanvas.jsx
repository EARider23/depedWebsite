import React, { useRef, useEffect } from 'react';

// --- VIDEO HALFTONE SETTINGS ---
// Adjust these values to perfectly tune the video effect!
const hfGridSize = 4;       // The density of the dots (spacing between dots)
const hfMaxDotSize = 3.8;     // Controls how big the biggest dots get

// --- TEXT STYLE SETTINGS ---
// true  = Text matches the exact dot size and density of your video (High Detail)
// false = Text uses the classic, locked 6px spacing (Maximum Legibility)
const hfMatchTextToVideo = false;

// Internal Engine Math (Hidden)
const hfContrast = 1;
const hfBrightness = 1;
const hfGamma = 1.2;
const hfInvert = true;
const hfShape = 'square';

const VIDEO_COLOR_CACHE = [];
const bgR = 195, bgG = 197, bgB = 201, bgAlpha = 0.52;
for (let i = 0; i <= 32; i++) {
  const videoBrightness = i / 32;
  const r = Math.round(videoBrightness * bgR);
  const g = Math.round(videoBrightness * bgG);
  const b = Math.round(videoBrightness * bgB);
  const alpha = 1.0 - ((1.0 - bgAlpha) * videoBrightness);
  VIDEO_COLOR_CACHE.push(`rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`);
}

export default function HalftoneHeroCanvas({ text1, text2, getFrequencyData, themeColor, videoSrc }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const themeColorRef = useRef(themeColor);
  const getFrequencyDataRef = useRef(getFrequencyData);
  const cursorDataRef = useRef(null);
  const lastCursorStateRef = useRef(false);
  const videoRef = useRef(null);
  const videoCanvasRef = useRef(null);

  // Keep the refs up to date without re-running the effect
  useEffect(() => {
    getFrequencyDataRef.current = getFrequencyData;
  }, [getFrequencyData]);

  useEffect(() => {
    themeColorRef.current = themeColor;
  }, [themeColor]);

  // Video Initialization
  useEffect(() => {
    if (!videoSrc) return;

    const video = document.createElement('video');
    video.src = videoSrc;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;

    // Force play to kickstart loading in some browsers when off-DOM
    video.play().catch(e => console.warn("Video autoplay blocked or CORS issue:", e));

    // Force seamless looping by snapping back right before the browser naturally pauses it at the end
    video.addEventListener('timeupdate', () => {
      if (video.duration && video.currentTime >= video.duration - 0.05) {
        video.currentTime = 0;
        video.play();
      }
    });

    const handleReady = () => {
      if (videoCanvasRef.current) return; // already initialized
      if (video.videoWidth === 0) return; // not truly ready

      const vCanvas = document.createElement('canvas');
      const aspect = video.videoWidth / video.videoHeight;
      // Increase the sample canvas size to match the high density of hfGridSize
      vCanvas.width = 640;
      vCanvas.height = 640 / aspect;

      videoCanvasRef.current = vCanvas;
    };

    video.addEventListener('loadeddata', handleReady);
    video.addEventListener('canplay', handleReady);

    videoRef.current = video;

    return () => {
      video.pause();
      video.removeEventListener('loadeddata', handleReady);
      video.removeEventListener('canplay', handleReady);
      video.src = "";
      videoRef.current = null;
      videoCanvasRef.current = null;
    };
  }, [videoSrc]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });

    let resizeTimeout;
    let animationFrameId = null;
    let isVisible = true;
    let videoFade = 1.0; // 1.0 = video fully visible, 0.0 = completely hidden
    let bgDotData = [];
    let textDotData = [];

    let width = 0;
    let height = 0;
    let needsRedraw = true;
    let lastMouse = { x: -1000, y: -1000 };

    let startTime = Date.now();

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

      const offCanvas = document.createElement('canvas');
      offCanvas.width = width;
      offCanvas.height = height;
      const offCtx = offCanvas.getContext('2d');

      offCtx.fillStyle = 'black';
      offCtx.textBaseline = 'middle';
      offCtx.textAlign = 'center';

      const fontSize = width < 768 ? 60 : 110;
      offCtx.font = `900 ${fontSize}px Sora, sans-serif`;

      const textCenterY = height * 0.45;
      offCtx.fillText(text1, width / 2, textCenterY - fontSize * 0.55);

      const text2Width = offCtx.measureText(text2).width;
      offCtx.fillText(text2, width / 2, textCenterY + fontSize * 0.55);

      // Draw the cursor mask as a solid rectangle so we can perfectly control thickness and position
      // It will still be converted into dots by the rasterizer

      // --- CURSOR TUNING OFFSETS ---
      // Adjust these numbers to easily move the cursor!
      const cursorOffsetX = -15; // Positive moves right, negative moves left
      const cursorOffsetY = 5; // Positive moves down, negative moves up

      const cursorStartX = width / 2 + text2Width / 2 + (width < 768 ? 12 : 20) + cursorOffsetX;
      const cursorW = fontSize * 0.5;
      const cursorH = fontSize * 0.18; // Thicker cursor
      const cursorY = textCenterY + fontSize * 0.55 - cursorH * -0.3 + cursorOffsetY;

      offCtx.fillStyle = 'black';
      offCtx.fillRect(cursorStartX, cursorY, cursorW, cursorH);

      const imageData = offCtx.getImageData(0, 0, width, height).data;

      bgDotData = [];
      textDotData = [];

      const fadeStart = height * 0.15;
      const fadeEnd = height * 0.6;

      // Setup Text Dots (Toggled between classic 6px or unified video density)
      const textSpacing = hfMatchTextToVideo ? hfGridSize : 6;
      for (let y = textSpacing / 2; y < height; y += textSpacing) {
        const rowAlpha = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
        for (let x = textSpacing / 2; x < width; x += textSpacing) {
          const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
          const alpha = imageData[pixelIndex + 3];

          const isCursorDot = alpha > 128 && y > height * 0.45 && x > cursorStartX - 5;

          if (alpha > 128 || isCursorDot) {
            textDotData.push({
              x,
              y,
              isText: alpha > 128 && !isCursorDot,
              isCursor: isCursorDot,
              rowAlpha
            });
          }
        }
      }

      // Setup Background Dots (dynamic spacing via hfGridSize)
      const bgSpacing = hfGridSize;
      for (let y = bgSpacing / 2; y < height; y += bgSpacing) {
        const rowAlpha = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
        for (let x = bgSpacing / 2; x < width; x += bgSpacing) {
          const pixelIndex = (Math.floor(y) * width + Math.floor(x)) * 4;
          const alpha = imageData[pixelIndex + 3];

          // We add ALL dots to the background grid so videos and visualizers can flow seamlessly behind the text.
          // However, we flag them so we know NOT to draw static grey background dots under the text, 
          // which would cause a messy overlap.
          bgDotData.push({
            x,
            y,
            isText: false,
            isCursor: false,
            rowAlpha,
            inTextMask: alpha > 128
          });
        }
      }
      needsRedraw = true;
      startTime = Date.now();
    };

    const render = () => {
      if (!isVisible) {
        animationFrameId = null;
        return;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const elapsed = Date.now() - startTime;
      const isTyping = elapsed < 3500;

      // Get frequency data via ref (always fresh, no stale closure)
      const freqData = getFrequencyDataRef.current ? getFrequencyDataRef.current() : null;
      const hasAudio = freqData !== null;

      // Handle Blinking Cursor
      const showCursor = Math.floor(Date.now() / 500) % 2 === 0;
      const cursorChanged = showCursor !== lastCursorStateRef.current;
      if (cursorChanged) {
        lastCursorStateRef.current = showCursor;
      }
      const isCursorBlinking = elapsed > 2300;

      // Handle Video Frame
      let videoImageData = null;
      let isVideoPlaying = false;
      if (videoRef.current && videoRef.current.readyState >= 2 && videoCanvasRef.current && !videoRef.current.paused) {
        isVideoPlaying = true;
        const vCanvas = videoCanvasRef.current;
        const vCtx = vCanvas.getContext('2d', { willReadFrequently: true });
        vCtx.drawImage(videoRef.current, 0, 0, vCanvas.width, vCanvas.height);
        try {
          videoImageData = vCtx.getImageData(0, 0, vCanvas.width, vCanvas.height).data;
        } catch (e) {
          console.warn("Video canvas is tainted (CORS), cannot read pixels.", e);
          isVideoPlaying = false; // Prevents spamming errors
        }
      }

      // Handle Smooth Video Fading
      if (hasAudio) {
        if (videoFade > 0) needsRedraw = true;
        videoFade = Math.max(0, videoFade - 0.15); // Fast fade out (when song plays)
      } else {
        if (videoFade < 1) needsRedraw = true;
        videoFade = Math.min(1, videoFade + 0.1); // Fast fade in (when song stops)
      }

      // Redraw if mouse moved, resize, typing, audio is playing, cursor blink state changed, OR video is playing
      if (needsRedraw || mx !== lastMouse.x || my !== lastMouse.y || isTyping || hasAudio || (isCursorBlinking && cursorChanged) || isVideoPlaying) {
        lastMouse.x = mx;
        lastMouse.y = my;
        needsRedraw = false;

        const p1 = Math.min(1, Math.max(0, elapsed / 1200));
        const p2 = Math.min(1, Math.max(0, (elapsed - 1100) / 1200));
        const revealX1 = width * p1;
        const revealX2 = width * p2;

        const checkIsText = (dot) => {
          if (!dot.isText) return false;
          if (dot.y < height * 0.45) return dot.x <= revealX1;
          return dot.x <= revealX2;
        };

        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        const bgSizeBase = 0.6;
        // If true, use small video dots. If false, use the original big bold 4.4px dots!
        const textSizeBase = hfMatchTextToVideo ? Math.max(0.6, hfMaxDotSize * 0.85) : 4.4;
        const hoverRadius = 90;

        let currentAlpha = -1;

        // Draw grey background dots + visualizer bars + video dots
        ctx.fillStyle = '#c3c5c985';
        for (let i = 0; i < bgDotData.length; i++) {
          const dot = bgDotData[i];

          if (currentAlpha !== dot.rowAlpha) {
            ctx.globalAlpha = dot.rowAlpha;
            currentAlpha = dot.rowAlpha;
          }

          let drawX = dot.x;
          let drawY = dot.y;
          let size = bgSizeBase;

          const dx = dot.x - mx;
          const dy = dot.y - my;
          const distSq = dx * dx + dy * dy;

          // Visualizer math
          let effectiveIntensity = 0;
          let isVisualizerDot = false;

          if (hasAudio && dot.y > height * 0.5) {
            // How far is the dot from the center? (0 at center, 1 at edges)
            const distanceFromCenter = Math.abs((dot.x - width / 2) / (width / 2));

            // Most music has zero audio data in the extremely high frequencies (the end of the array).
            // We restrict the mapping to the first 65% of the array so the edges aren't dead silent!
            const maxFreqIndex = Math.floor((freqData.length - 1) * 0.65);

            // Quantize the visualizer into 64 distinct "bands" instead of a smooth continuous shape
            const numBands = 64;
            const bandedDistance = Math.floor(distanceFromCenter * numBands) / numBands;
            const freqIndex = Math.floor(bandedDistance * maxFreqIndex);

            // Get raw audio value (0-255)
            const rawIntensity = freqData[freqIndex] || 0;

            // Apply an exponential curve (power of 3). This mathematically crushes background noise 
            // and forces the visualizer to ONLY spike dramatically when a hard beat hits!
            const normalizedIntensity = Math.pow(rawIntensity / 255, 3.0);

            // Boost the high frequencies (edges) so they bounce as high as the bass (center)
            const boostedIntensity = Math.min(1.0, normalizedIntensity * (1 + bandedDistance * 2.5));

            if (boostedIntensity > 0.01) {
              // Maximum peak height for all frequencies across the screen (straight/linear style)
              const maxBarHeight = height * 0.24;
              const currentBarHeight = maxBarHeight * boostedIntensity;

              // If the dot falls within the calculated peak height
              const yFromBottom = height - dot.y;
              if (yFromBottom <= currentBarHeight) {
                effectiveIntensity = boostedIntensity * (1 - (yFromBottom / currentBarHeight));
                isVisualizerDot = true;

                // Add subtle height-based growth logic
                const heightIntensity = 1 - (yFromBottom / currentBarHeight);
                // Make the visualizer dots massively expand based on the beat!
                size += (effectiveIntensity * 4.0) + (heightIntensity * 2.0);
              }
            }
          }

          // Video Halftone Math
          let isVideoDot = false;
          let videoBrightness = 0;
          let vR = 0, vG = 0, vB = 0;

          if (videoFade > 0 && videoImageData) { // Full screen projection
            const vCanvas = videoCanvasRef.current;
            const aspect = vCanvas.width / vCanvas.height;

            // --- VIDEO TUNING ---
            const videoScale = 1.0;
            const videoOffsetY = height * 0.1;

            let projW = width * videoScale;
            let projH = projW / aspect;

            const projXStart = width / 2 - projW / 2; // Centers it horizontally
            const projYStart = videoOffsetY;

            if (dot.x >= projXStart && dot.x <= projXStart + projW && dot.y >= projYStart && dot.y <= projYStart + projH) {
              isVideoDot = true;

              // Map dot coordinate to video canvas pixel
              const vx = Math.floor(((dot.x - projXStart) / projW) * vCanvas.width);
              const vy = Math.floor(((dot.y - projYStart) / projH) * vCanvas.height);

              // Constrain bounds safely
              const safeVx = Math.max(0, Math.min(vx, vCanvas.width - 1));
              const safeVy = Math.max(0, Math.min(vy, vCanvas.height - 1));

              const pIndex = (safeVy * vCanvas.width + safeVx) * 4;
              vR = videoImageData[pIndex];
              vG = videoImageData[pIndex + 1];
              vB = videoImageData[pIndex + 2];

              // 1. Calculate base luminance (0.0 to 1.0)
              let luminance = ((vR * 0.299) + (vG * 0.587) + (vB * 0.114)) / 255;

              // 2. Apply Halftone-fx Adjustments
              // Gamma Correction
              luminance = Math.pow(luminance, 1.0 / hfGamma);
              // Contrast
              luminance = (luminance - 0.5) * hfContrast + 0.5;
              // Brightness
              luminance = luminance * hfBrightness;
              luminance = Math.max(0, Math.min(1, luminance)); // Clamp exactly to 0-1

              // 3. Map to Dot Size
              videoBrightness = luminance;
              const dotScale = hfInvert ? (1.0 - luminance) : luminance;

              const targetSize = bgSizeBase + (dotScale * hfMaxDotSize);
              // Scale the size down to the background size as the video fades out!
              size = bgSizeBase + ((targetSize - bgSizeBase) * videoFade);
            }
          }

          if (distSq < hoverRadius * hoverRadius) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / hoverRadius;
            const pushStrength = 4;
            drawX += (dx / dist) * (force * pushStrength);
            drawY += (dy / dist) * (force * pushStrength);
            size += force * 0.5;
          }

          // Cap the size to ensure it never overlaps
          size = Math.min(size, 2.8);

          // If the video is fading out, draw a solid grey background dot under it so it doesn't leave a white hole
          if (isVideoDot && videoFade < 1.0 && !isVisualizerDot && !dot.inTextMask) {
            ctx.fillStyle = '#c3c5c985';
            ctx.fillRect(drawX - bgSizeBase / 2, drawY - bgSizeBase / 2, bgSizeBase, bgSizeBase);
          }

          if (isVisualizerDot) {
            const currentThemeColor = themeColorRef.current;
            if (currentThemeColor) {
              let r = 128, g = 90, b = 213; // Fallback purple
              if (typeof currentThemeColor === 'string' && currentThemeColor.startsWith('#')) {
                const hex = currentThemeColor.slice(1);
                r = parseInt(hex.substring(0, 2), 16);
                g = parseInt(hex.substring(2, 4), 16);
                b = parseInt(hex.substring(4, 6), 16);
              } else if (Array.isArray(currentThemeColor)) {
                [r, g, b] = currentThemeColor;
              }
              const alpha = Math.min(1, effectiveIntensity + 0.3);
              const brightness = 1 + (effectiveIntensity * 0.5);
              ctx.fillStyle = `rgba(${Math.min(255, r * brightness)}, ${Math.min(255, g * brightness)}, ${Math.min(255, b * brightness)}, ${alpha})`;
            } else {
              const hue = 270 + (dot.x / width) * 60;
              const alpha = Math.min(1, effectiveIntensity + 0.3);
              ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`;
            }
          } else if (isVideoDot) {
            const colorIndex = Math.min(32, Math.max(0, Math.floor(videoBrightness * 32)));
            ctx.fillStyle = VIDEO_COLOR_CACHE[colorIndex];
          } else {
            ctx.fillStyle = '#c3c5c985';
          }

          // Render the dot
          // Skip drawing static grey background dots if they are directly underneath the text mask
          if (!isVideoDot && !isVisualizerDot && dot.inTextMask) {
            continue;
          }

          if (isVideoDot && size > 0.5 && !isVisualizerDot) {
            ctx.globalAlpha = dot.rowAlpha * videoFade; // Apply fade opacity only during draw
            if (hfShape === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(drawX - size / 2, drawY - size / 2, size, size);
            }
            ctx.globalAlpha = dot.rowAlpha; // Instantly reset it so we don't break the visualizer
          } else {
            if (hfShape === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(drawX - size / 2, drawY - size / 2, size, size);
            }
          }
        }

        // Determine Text Colors
        let colorLine1 = '#030712';
        let colorLine2 = '#030712';
        if (elapsed > 2400) {
          const colorProgress = Math.min(1, (elapsed - 2400) / 600);

          const r1 = Math.round(3 + (15 - 3) * colorProgress);
          const g1 = Math.round(7 + (23 - 7) * colorProgress);
          const b1 = Math.round(18 + (42 - 18) * colorProgress);
          colorLine1 = `rgb(${r1}, ${g1}, ${b1})`;

          const r2 = Math.round(3 + (107 - 3) * colorProgress);
          const g2 = Math.round(7 + (33 - 7) * colorProgress);
          const b2 = Math.round(18 + (168 - 18) * colorProgress);
          colorLine2 = `rgb(${r2}, ${g2}, ${b2})`;
        }

        // Draw text dots
        currentAlpha = -1;
        let currentFill = null;
        for (let i = 0; i < textDotData.length; i++) {
          const dot = textDotData[i];
          if (!checkIsText(dot)) continue;

          if (currentAlpha !== dot.rowAlpha) {
            ctx.globalAlpha = dot.rowAlpha;
            currentAlpha = dot.rowAlpha;
          }

          const targetColor = dot.y < height * 0.45 ? colorLine1 : colorLine2;
          if (currentFill !== targetColor) {
            ctx.fillStyle = targetColor;
            currentFill = targetColor;
          }

          let drawX = dot.x;
          let drawY = dot.y;
          let size = textSizeBase;

          const dx = dot.x - mx;
          const dy = dot.y - my;
          const distSq = dx * dx + dy * dy;

          if (distSq < hoverRadius * hoverRadius) {
            const dist = Math.sqrt(distSq);
            const force = 1 - dist / hoverRadius;
            const pushStrength = 5;
            drawX += (dx / dist) * (force * pushStrength);
            drawY += (dy / dist) * (force * pushStrength);
            size += force * 0.8;
          }

          const maxTextSize = hfMatchTextToVideo ? hfMaxDotSize : 5.6;
          size = Math.min(size, maxTextSize);

          if (hfShape === 'circle') {
            ctx.beginPath();
            ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(drawX - size / 2, drawY - size / 2, size, size);
          }
        }

        // Draw Blinking Cursor (Dotted Style)
        if (isCursorBlinking && showCursor) {
          ctx.fillStyle = colorLine2;
          for (let i = 0; i < textDotData.length; i++) {
            const dot = textDotData[i];
            if (!dot.isCursor) continue;

            let drawX = dot.x;
            let drawY = dot.y;
            let size = textSizeBase;

            const dx = dot.x - mx;
            const dy = dot.y - my;
            const distSq = dx * dx + dy * dy;

            if (distSq < hoverRadius * hoverRadius) {
              const dist = Math.sqrt(distSq);
              const force = 1 - dist / hoverRadius;
              const pushStrength = 5;
              drawX += (dx / dist) * (force * pushStrength);
              drawY += (dy / dist) * (force * pushStrength);
              size += force * 0.8;
            }

            const maxTextSize = hfMatchTextToVideo ? hfMaxDotSize : 5.6;
            size = Math.min(size, maxTextSize);
            ctx.globalAlpha = dot.rowAlpha;

            if (hfShape === 'circle') {
              ctx.beginPath();
              ctx.arc(drawX, drawY, size / 2, 0, Math.PI * 2);
              ctx.fill();
            } else {
              ctx.fillRect(drawX - size / 2, drawY - size / 2, size, size);
            }
          }
        }

        ctx.globalAlpha = 1; // reset alpha
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

    // Pause rendering when the canvas is scrolled out of view to save CPU!
    const visibilityObserver = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
      if (isVisible && !animationFrameId) {
        needsRedraw = true;
        render();
      }
    });
    visibilityObserver.observe(canvas);

    return () => {
      observer.disconnect();
      visibilityObserver.disconnect();
      clearTimeout(resizeTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [text1, text2]);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
  );
}
