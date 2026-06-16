'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FRAME_LIST } from './frameList';

interface FrameSequenceBackgroundProps {
  onFrameChange?: (index: number) => void;
}

export default function FrameSequenceBackground({ onFrameChange }: FrameSequenceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'entry' | 'idle'>('entry');
  const onFrameChangeRef = useRef(onFrameChange);

  useEffect(() => {
    onFrameChangeRef.current = onFrameChange;
  }, [onFrameChange]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let frameIndex = 0;
    let lastTickTime = performance.now();
    const fpsInterval = 1000 / 24; // Lock precisely to 24 FPS (41.66ms per frame)
    
    // Memory buffer array for preloaded images
    const imagesBuffer: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Force resize handling for viewport cover aspect scaling
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drawFrame();
    };

    const drawFrame = () => {
      if (imagesBuffer.length === 0) return;
      const currentImg = imagesBuffer[frameIndex];
      
      // Prevent drawing if frame is not fully initialized or loaded in buffer
      if (!currentImg || currentImg.naturalWidth === 0) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Compute cover aspect scaling ratio
      const imgW = currentImg.naturalWidth;
      const imgH = currentImg.naturalHeight;
      const canvasW = canvas.width;
      const canvasH = canvas.height;

      const imgRatio = imgW / imgH;
      const canvasRatio = canvasW / canvasH;

      let drawW = canvasW;
      let drawH = canvasH;
      let drawX = 0;
      let drawY = 0;

      if (imgRatio > canvasRatio) {
        // Image is wider than container
        drawW = canvasH * imgRatio;
        drawX = (canvasW - drawW) / 2;
      } else {
        // Image is taller than container
        drawH = canvasW / imgRatio;
        drawY = (canvasH - drawH) / 2;
      }

      ctx.drawImage(currentImg, drawX, drawY, drawW, drawH);
    };

    // Preload complete array into memory buffer on mount sequence
    FRAME_LIST.forEach((filename) => {
      const img = new Image();
      img.src = `/frames/${filename}`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_LIST.length) {
          setImagesLoaded(true);
        }
      };
      imagesBuffer.push(img);
    });

    // Intercept native browser ticks using delta timing logic
    const tick = (now: number) => {
      const elapsed = now - lastTickTime;
      if (elapsed >= fpsInterval) {
        // Continuous infinite loop advancement logic
        frameIndex = (frameIndex + 1) % FRAME_LIST.length;
        lastTickTime = now - (elapsed % fpsInterval);
        drawFrame();
        if (onFrameChangeRef.current) {
          onFrameChangeRef.current(frameIndex);
        }
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div 
      className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-guardian-obsidian flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      <motion.div
        initial={{ 
          opacity: 0, 
          y: 100,
          rotateX: 0,
          rotateY: 0,
          filter: 'brightness(0)'
        }}
        animate={
          animationPhase === 'entry'
            ? { 
                opacity: 1, 
                y: 0,
                filter: 'brightness(1.0)',
              }
            : {
                opacity: 1,
                y: [0, -8, 0, 8, 0],
                rotateX: [0, 1, 0, -1, 0],
                rotateY: [0, -1.5, 0, 1.5, 0],
                filter: [
                  'brightness(1.0) drop-shadow(0 0 8px rgba(255, 0, 13, 0.1))',
                  'brightness(1.05) drop-shadow(0 0 12px rgba(255, 0, 13, 0.15))',
                  'brightness(0.98) drop-shadow(0 0 6px rgba(255, 0, 13, 0.08))',
                  'brightness(1.03) drop-shadow(0 0 10px rgba(255, 0, 13, 0.12))',
                  'brightness(1.0) drop-shadow(0 0 8px rgba(255, 0, 13, 0.1))'
                ]
              }
        }
        transition={
          animationPhase === 'entry'
            ? {
                delay: 0.3,
                type: 'spring',
                mass: 1,
                stiffness: 80,
                damping: 12,
              }
            : {
                y: {
                  duration: 4.8,
                  repeat: Infinity,
                  ease: 'easeInOut'
                },
                rotateX: {
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                },
                rotateY: {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                },
                filter: {
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }
              }
        }
        onAnimationComplete={() => {
          if (animationPhase === 'entry') {
            setAnimationPhase('idle');
          }
        }}
        className="w-full h-full flex items-center justify-center"
      >
        {/* 2D Image Sequence Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full pointer-events-none select-none"
          style={{ contentVisibility: 'auto' }}
        />
      </motion.div>
    </div>
  );
}
