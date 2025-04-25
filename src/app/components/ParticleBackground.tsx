// src/app/components/ParticleBackground.tsx
'use client'; // Needs browser APIs (canvas, requestAnimationFrame)

import React, { useRef, useEffect } from 'react';

// --- Configuration ---
const PARTICLE_COUNT = 100; // How many particles
const PARTICLE_SPEED = 0.5; // Base speed (pixels per frame)
const PARTICLE_COLOR = 'rgba(255, 174, 0, 0.6)'; // #FFAE00 with some transparency
const PARTICLE_SIZE_MIN = 1;
const PARTICLE_SIZE_MAX = 3;
// ---------------------

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number; // Add opacity for variation
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Function to initialize or reset particles
  const initializeParticles = (canvas: HTMLCanvasElement) => {
    particlesRef.current = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height, // Start randomly positioned
        size: Math.random() * (PARTICLE_SIZE_MAX - PARTICLE_SIZE_MIN) + PARTICLE_SIZE_MIN,
        speed: PARTICLE_SPEED + Math.random() * 0.5, // Slight speed variation
        opacity: 0.2 + Math.random() * 0.6 // Slight opacity variation
      });
    }
  };

  // Function to draw particles
  const drawParticles = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas each frame

    particlesRef.current.forEach((p) => {
      // Update position
      p.y += p.speed;

      // Reset particle if it goes off screen (loop from top)
      if (p.y > canvas.height + p.size) {
        p.y = -p.size; // Reset position above the screen
        p.x = Math.random() * canvas.width; // Randomize horizontal position
      }

      // Draw particle (simple circle)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 174, 0, ${p.opacity})`; // Use particle-specific opacity
      ctx.fill();
    });
  };

  // Animation loop
  const animate = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    drawParticles(ctx, canvas);
    animationFrameId.current = requestAnimationFrame(() => animate(ctx, canvas));
  };

  // Effect to set up canvas, particles, animation, and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handler
    const handleResize = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      // Re-initialize particles on resize to fit new dimensions
      initializeParticles(canvasRef.current);
    };

    // Initial setup
    handleResize(); // Set initial size and create particles
    animate(ctx, canvas); // Start animation loop

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <canvas
      ref={canvasRef}
      // Style to position behind everything else
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none" // Fixed position, full screen, behind content, ignore clicks
    />
  );
}
