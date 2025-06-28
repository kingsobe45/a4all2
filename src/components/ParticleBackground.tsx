import React, { useEffect, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { currentTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Skip particles for simple theme
    if (currentTheme.id === 'simple') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
    }> = [];

    // Create particles with theme-specific colors
    const particleCount = currentTheme.id === 'cyberpunk' || currentTheme.id === 'matrix' ? 80 : 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * (currentTheme.id === 'stranger-things' ? 1.5 : 0.5),
        vy: (Math.random() - 0.5) * (currentTheme.id === 'stranger-things' ? 1.5 : 0.5),
        size: Math.random() * (currentTheme.id === 'cyberpunk' ? 4 : 2) + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: getParticleColor()
      });
    }

    function getParticleColor() {
      switch (currentTheme.id) {
        case 'got':
          return Math.random() > 0.5 ? currentTheme.colors.primary : currentTheme.colors.secondary;
        case 'breaking-bad':
          return Math.random() > 0.7 ? currentTheme.colors.primary : 
                 Math.random() > 0.5 ? currentTheme.colors.secondary : currentTheme.colors.accent;
        case 'witcher':
          return Math.random() > 0.6 ? currentTheme.colors.primary : currentTheme.colors.secondary;
        case 'stranger-things':
          return Math.random() > 0.6 ? currentTheme.colors.primary : 
                 Math.random() > 0.3 ? currentTheme.colors.secondary : currentTheme.colors.accent;
        case 'mandalorian':
          return Math.random() > 0.7 ? currentTheme.colors.primary : currentTheme.colors.secondary;
        case 'cyberpunk':
          return Math.random() > 0.6 ? currentTheme.colors.primary : 
                 Math.random() > 0.3 ? currentTheme.colors.secondary : currentTheme.colors.accent;
        case 'vikings':
          return Math.random() > 0.5 ? currentTheme.colors.primary : currentTheme.colors.secondary;
        case 'matrix':
          return Math.random() > 0.8 ? currentTheme.colors.secondary : currentTheme.colors.primary;
        case 'avatar':
          return Math.random() > 0.5 ? currentTheme.colors.primary : currentTheme.colors.secondary;
        default:
          return currentTheme.colors.primary;
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Special effects for certain themes
        if (currentTheme.id === 'matrix') {
          // Matrix rain effect
          particle.vy = Math.abs(particle.vy) + 0.5;
          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }
        } else if (currentTheme.id === 'stranger-things') {
          // Chaotic movement
          particle.vx += (Math.random() - 0.5) * 0.1;
          particle.vy += (Math.random() - 0.5) * 0.1;
          particle.vx = Math.max(-2, Math.min(2, particle.vx));
          particle.vy = Math.max(-2, Math.min(2, particle.vy));
        }

        // Draw particle with glow effect
        ctx.save();
        
        // Glow effect for cyberpunk and neon themes
        if (['cyberpunk', 'stranger-things', 'matrix', 'breaking-bad'].includes(currentTheme.id)) {
          ctx.shadowColor = particle.color;
          ctx.shadowBlur = particle.size * 4;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.globalAlpha = particle.opacity;
        ctx.fill();
        
        ctx.restore();
      });

      // Draw connections for non-chaotic themes
      if (!['stranger-things', 'matrix'].includes(currentTheme.id)) {
        particles.forEach((particle, i) => {
          particles.slice(i + 1).forEach((otherParticle) => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 120) {
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              
              const opacity = (1 - distance / 120) * 0.3;
              ctx.strokeStyle = `${currentTheme.colors.primary}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          });
        });
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-5"
      style={{ 
        opacity: currentTheme.id === 'simple' ? 0 : currentTheme.id === 'default' ? 0.4 : 0.6,
        mixBlendMode: currentTheme.id === 'cyberpunk' || currentTheme.id === 'matrix' ? 'screen' : 'normal'
      }}
    />
  );
}