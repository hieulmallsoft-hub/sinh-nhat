import React, { useEffect, useState } from 'react';

/* Premium particle config */
const EMOJI_TYPES = [
  { emoji: '🌸', sizeRange: [0.9, 1.3], speedRange: [9, 15], opacityRange: [0.15, 0.45] },
  { emoji: '✨', sizeRange: [0.7, 1.0], speedRange: [6, 10], opacityRange: [0.2, 0.55] },
  { emoji: '💖', sizeRange: [0.8, 1.1], speedRange: [8, 14], opacityRange: [0.12, 0.38] },
  { emoji: '🌺', sizeRange: [0.9, 1.2], speedRange: [10, 16], opacityRange: [0.1, 0.35] },
  { emoji: '🌟', sizeRange: [0.7, 1.0], speedRange: [7, 12], opacityRange: [0.15, 0.4] },
  { emoji: '💕', sizeRange: [0.8, 1.0], speedRange: [8, 13], opacityRange: [0.1, 0.3] },
  { emoji: '⭐', sizeRange: [0.6, 0.9], speedRange: [9, 14], opacityRange: [0.12, 0.35] },
  { emoji: '🎀', sizeRange: [0.9, 1.1], speedRange: [10, 15], opacityRange: [0.1, 0.28] },
];

/* Ambient glow orb configs */
const ORBS = [
  { pos: { bottom: '-15%', left: '-8%' },  size: 520, color: 'rgba(255,77,109,0.13)',  duration: 9 },
  { pos: { top: '-12%', right: '-5%' },    size: 420, color: 'rgba(212,175,55,0.09)',  duration: 11 },
  { pos: { top: '38%', left: '58%' },      size: 360, color: 'rgba(162,59,114,0.10)', duration: 13 },
  { pos: { top: '18%', left: '-4%' },      size: 310, color: 'rgba(76,201,240,0.07)', duration: 8 },
  { pos: { bottom: '8%', right: '8%' },    size: 280, color: 'rgba(249,160,63,0.09)', duration: 15 },
];

const rnd = (min, max) => min + Math.random() * (max - min);

const FloatingHearts = () => {
  const [particles, setParticles] = useState([]);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    /* Emoji particles */
    const parts = Array.from({ length: 22 }).map((_, i) => {
      const t = EMOJI_TYPES[i % EMOJI_TYPES.length];
      return {
        id: i,
        left: `${rnd(0, 100)}vw`,
        speed: rnd(...t.speedRange),
        delay: rnd(0, 12),
        size: `${rnd(...t.sizeRange)}rem`,
        opacity: rnd(...t.opacityRange),
        emoji: t.emoji,
        blur: Math.random() > 0.55 ? `${rnd(0.5, 2.5)}px` : '0px',
        drift: rnd(-30, 30), // horizontal drift during fall
      };
    });
    setParticles(parts);

    /* Tiny twinkling dot stars */
    const strs = Array.from({ length: 38 }).map((_, i) => ({
      id: i,
      left: `${rnd(0, 100)}%`,
      top: `${rnd(0, 100)}%`,
      size: `${rnd(1, 3.5)}px`,
      opacity: rnd(0.15, 0.8),
      duration: `${rnd(1.5, 4)}s`,
      delay: `${rnd(0, 6)}s`,
    }));
    setStars(strs);
  }, []);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
    }}>

      {/* ── Twinkling dot stars ── */}
      {stars.map(s => (
        <div
          key={`star-${s.id}`}
          style={{
            position: 'absolute',
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            borderRadius: '50%',
            background: '#fff',
            opacity: s.opacity,
            animation: `twinkle ${s.duration} ease-in-out ${s.delay} infinite alternate`,
            boxShadow: `0 0 ${parseFloat(s.size) * 2}px rgba(255,255,255,0.6)`,
          }}
        />
      ))}

      {/* ── Emoji particles ── */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-10vh',
            fontSize: p.size,
            opacity: p.opacity,
            animation: `heart-fall ${p.speed}s linear ${p.delay}s infinite`,
            filter: `blur(${p.blur})`,
          }}
        >
          {p.emoji}
        </div>
      ))}

      {/* ── Aurora ambient orbs ── */}
      {ORBS.map((orb, i) => (
        <div
          key={`orb-${i}`}
          style={{
            position: 'absolute',
            ...orb.pos,
            width: orb.size,
            height: orb.size,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            animation: `aurora-breathe ${orb.duration}s ease-in-out infinite ${i % 2 === 1 ? 'reverse' : ''}`,
            filter: `blur(${45 + i * 8}px)`,
          }}
        />
      ))}

    </div>
  );
};

export default FloatingHearts;
