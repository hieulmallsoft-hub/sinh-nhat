import React, { useEffect, useState } from 'react';

const FloatingHearts = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const emojis = ['❤️', '✨', '💕', '🌟', '💖', '🎀', '💗', '⭐'];
    const newParticles = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 12 + 6}s`,
      animationDelay: `${Math.random() * 8}s`,
      size: `${Math.random() * 1.2 + 0.6}rem`,
      opacity: Math.random() * 0.4 + 0.15,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      blur: Math.random() > 0.6 ? `${Math.random() * 3}px` : '0px',
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            fontSize: p.size,
            opacity: p.opacity,
            animation: `heart-fall ${p.animationDuration} linear ${p.animationDelay} infinite`,
            top: '-10vh',
            filter: `blur(${p.blur})`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* Ambient glow orbs */}
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-10%',
        width: '400px', height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,109,0.15) 0%, transparent 70%)',
        animation: 'float 8s ease-in-out infinite',
        filter: 'blur(60px)',
      }} />
      <div style={{
        position: 'absolute', top: '-10%', right: '-5%',
        width: '300px', height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(249,160,63,0.12) 0%, transparent 70%)',
        animation: 'float 10s ease-in-out infinite reverse',
        filter: 'blur(50px)',
      }} />
    </div>
  );
};

export default FloatingHearts;
