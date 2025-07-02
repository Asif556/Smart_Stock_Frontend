import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Professional particle system
    let animationId;
    let time = 0;

    // Floating elements array
    const particles = [];

    // Create subtle floating particles
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: Math.random() * 0.5 + 0.2,
        angle: Math.random() * Math.PI * 2,
        drift: Math.random() * 0.02 + 0.01
      });
    }

    // Grid lines for professional look
    const drawGrid = () => {
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.1;

      const gridSize = 100;
      
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    // Animation loop
    const animate = () => {
      // Clear with dark gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#0f0f23');
      gradient.addColorStop(0.5, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      time += 0.005;

      particles.forEach((particle, index) => {
        // Update position with subtle floating motion
        particle.x += Math.cos(particle.angle + time) * particle.speed;
        particle.y += Math.sin(particle.angle + time) * particle.speed * 0.5;
        particle.angle += particle.drift;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Subtle opacity animation
        particle.opacity = (Math.sin(time * 2 + index) * 0.1 + 0.2);

        // Draw particle
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = '#6366f1';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Add subtle light beams
      ctx.globalAlpha = 0.05;
      for (let i = 0; i < 3; i++) {
        const beamGradient = ctx.createLinearGradient(
          Math.sin(time + i) * canvas.width,
          0,
          Math.cos(time + i) * canvas.width,
          canvas.height
        );
        beamGradient.addColorStop(0, '#6366f1');
        beamGradient.addColorStop(0.5, '#8b5cf6');
        beamGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = beamGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};

export default AnimatedBackground;