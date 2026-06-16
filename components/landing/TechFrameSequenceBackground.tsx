'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';

interface TechFrameSequenceBackgroundProps {
  scrollYProgress: MotionValue<number>;
}

export default function TechFrameSequenceBackground({
  scrollYProgress,
}: TechFrameSequenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Keep references to loaded images and draw state in refs to avoid React re-renders during scroll
  const imagesRef = useRef<{ [key: number]: HTMLImageElement }>({});
  const lastDrawnFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const TOTAL_FRAMES = 138;
    let isComponentMounted = true;
    let animationFrameId: number;

    // Canvas scaling to match viewport with "cover" aspect ratio
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame();
    };

    const drawFrame = () => {
      if (!ctx || !canvas) return;

      // Get current scroll progress (value between 0 and 1)
      const progress = scrollYProgress.get();
      
      // Calculate target frame index
      const targetIndex = Math.min(
        Math.max(Math.floor(progress * TOTAL_FRAMES), 0),
        TOTAL_FRAMES - 1
      );

      // Find the closest loaded frame to targetIndex to prevent flickering during loading
      let bestIndex = -1;
      let minDistance = Infinity;

      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (imagesRef.current[i]) {
          const distance = Math.abs(i - targetIndex);
          if (distance < minDistance) {
            minDistance = distance;
            bestIndex = i;
          }
        }
      }

      if (bestIndex === -1) return;

      const img = imagesRef.current[bestIndex];
      if (!img || img.naturalWidth === 0) return;

      // If we've already drawn this exact image frame, skip to save performance
      if (lastDrawnFrameRef.current === bestIndex && canvas.width === window.innerWidth) {
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cover aspect scaling algorithm
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const imgRatio = imgW / imgH;
      const canvasRatio = canvasW / canvasH;

      let drawW = canvasW;
      let drawH = canvasH;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        drawW = canvasH * imgRatio;
        // Shift the image to the right (keeping the wallet fully visible on the right side of the screen)
        drawX = (canvasW - drawW) * 0.05;
      } else {
        drawH = canvasW / imgRatio;
        drawY = (canvasH - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      lastDrawnFrameRef.current = bestIndex;
    };

    // Load first frame immediately for fast initial paint
    const firstImg = new Image();
    firstImg.src = '/tech_frames/img_00001.jpg';
    firstImg.onload = () => {
      if (!isComponentMounted) return;
      imagesRef.current[0] = firstImg;
      drawFrame();
      
      // Now start loading all other frames progressively in the background
      let loadedCount = 1;
      
      // Priority keyframes (every 8th frame) to get a quick rough animation sync first
      const priorityIndices: number[] = [];
      const normalIndices: number[] = [];

      for (let i = 1; i < TOTAL_FRAMES; i++) {
        if (i % 8 === 0) {
          priorityIndices.push(i);
        } else {
          normalIndices.push(i);
        }
      }

      const loadQueue = [...priorityIndices, ...normalIndices];
      
      // Load image helper
      const loadImage = (index: number) => {
        if (!isComponentMounted) return;
        const img = new Image();
        const frameNum = String(index + 1).padStart(5, '0');
        img.src = `/tech_frames/img_${frameNum}.jpg`;
        img.onload = () => {
          if (!isComponentMounted) return;
          imagesRef.current[index] = img;
          loadedCount++;
          
          setLoadingProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));
          
          if (loadedCount === TOTAL_FRAMES) {
            setIsLoaded(true);
          }
          
          // Draw frame if the current scroll matches the newly loaded frame
          drawFrame();

          // Load next in queue
          if (loadQueue.length > 0) {
            const nextIdx = loadQueue.shift();
            if (nextIdx !== undefined) {
              loadImage(nextIdx);
            }
          }
        };
        img.onerror = () => {
          // Fallback skip on error to continue loading sequence
          if (loadQueue.length > 0) {
            const nextIdx = loadQueue.shift();
            if (nextIdx !== undefined) {
              loadImage(nextIdx);
            }
          }
        };
      };

      // Start multiple parallel download workers (limit to 4 to avoid browser connection choke)
      const CONCURRENCY = 4;
      for (let c = 0; c < CONCURRENCY; c++) {
        const nextIdx = loadQueue.shift();
        if (nextIdx !== undefined) {
          loadImage(nextIdx);
        }
      }
    };

    // Continuous tick checks to re-draw canvas when scroll changes
    const tick = () => {
      if (!isComponentMounted) return;
      drawFrame();
      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animationFrameId = requestAnimationFrame(tick);

    return () => {
      isComponentMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [scrollYProgress]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-guardian-obsidian flex items-center justify-center">
      {/* 2D Image Sequence Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full pointer-events-none select-none opacity-85"
        style={{ contentVisibility: 'auto' }}
      />
      
      {/* Tech Overlay: Faint grid & radial vignette to blend the 3D frame background */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,var(--color-guardian-obsidian)_100%] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,20,28,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(18,20,28,0.1)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
      
      {/* Loading Progress Indicator (Sleek corner-glowing bar) */}
      {!isLoaded && (
        <div className="absolute bottom-6 right-6 z-20 flex flex-col items-end gap-1.5 select-none pointer-events-none">
          <span className="text-[8px] font-mono font-bold tracking-[0.2em] text-guardian-cyan uppercase">
            Buffering 3D Environment...
          </span>
          <div className="w-48 h-[2px] bg-guardian-slate/50 rounded-full overflow-hidden relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-guardian-cyan to-blue-500 rounded-full"
              style={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
          <span className="text-[8px] font-mono font-semibold text-guardian-ash">
            {loadingProgress}%
          </span>
        </div>
      )}
    </div>
  );
}
