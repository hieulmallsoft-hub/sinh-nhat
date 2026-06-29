import React, { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

export default function Envelope({ onOpen }) {
  const [opened, setOpened] = useState(false);
  const [flapOpened, setFlapOpened] = useState(false);
  const [letterPulled, setLetterPulled] = useState(false);
  const [sealBurst, setSealBurst] = useState([]);
  const envelopeRef = useRef(null);

  // Mouse tilt tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [15, -15]), { stiffness: 180, damping: 25 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-15, 15]), { stiffness: 180, damping: 25 });

  const handleMouseMove = useCallback((e) => {
    if (opened) return; // Disable tilt after opening to keep letter stable
    const rect = envelopeRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY, opened]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const triggerOpenFlow = () => {
    if (opened) return;
    setOpened(true);
    setSealBurst(Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      symbol: i % 3 === 0 ? '💖' : i % 3 === 1 ? '✦' : '●',
      color: i % 3 === 1 ? '#f0d060' : '#ff8fa3',
      x: (Math.cos((i / 14) * Math.PI * 2) * (70 + (i % 4) * 12)),
      y: (Math.sin((i / 14) * Math.PI * 2) * (55 + (i % 5) * 8)),
      rotate: i * 24,
    })));
    setTimeout(() => setSealBurst([]), 850);
    
    // Keep the reveal responsive while still showing the opening sequence.
    setTimeout(() => {
      setFlapOpened(true);
      setTimeout(() => {
        setLetterPulled(true);
      }, 320);
    }, 120);
  };

  return (
    <div
      ref={envelopeRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: 1200,
        width: '100%',
        maxWidth: '460px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        userSelect: 'none',
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          width: '100%',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* ENVELOPE BACKPLATE & flaps */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '280px',
            background: 'linear-gradient(135deg, #1c0022 0%, #0e0015 100%)',
            border: '1px solid rgba(255,255,255,0.06)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
            borderRadius: '16px',
            overflow: 'visible', // Must be visible for top flap to fold back
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Outer glowing border */}
          <div style={{
            position: 'absolute', inset: -1, borderRadius: '16px', zIndex: -1,
            background: 'linear-gradient(45deg, var(--primary), #d4af37, #f9a03f)',
            opacity: 0.25, filter: 'blur(8px)',
          }} />

          {/* Sparkles orbiting background */}
          <div style={{ position: 'absolute', inset: 8, border: '1px dashed rgba(212,175,55,0.15)', borderRadius: '12px', pointerEvents: 'none' }} />

          {/* LETTER CARD (Slides out of the envelope) */}
          <motion.div
            initial={{ y: 5, scale: 0.95, zIndex: 2 }}
            animate={{
              y: letterPulled ? -160 : 5,
              scale: letterPulled ? 1.05 : 0.95,
              zIndex: letterPulled ? 10 : 2,
            }}
            transition={{
              type: 'spring',
              stiffness: 80,
              damping: 18,
            }}
            style={{
              position: 'absolute',
              top: '15px',
              left: '4%',
              width: '92%',
              height: '250px',
              background: 'linear-gradient(150deg, #fffcf0 0%, #f7f1db 100%)',
              border: '2.5px double rgba(212,175,55,0.6)',
              borderRadius: '12px',
              padding: '24px 20px',
              boxShadow: letterPulled 
                ? '0 30px 80px rgba(0, 0, 0, 0.75), 0 0 25px rgba(255, 77, 109, 0.25)' 
                : 'inset 0 -20px 40px rgba(0,0,0,0.3)',
              color: '#3d2b1f',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              pointerEvents: letterPulled ? 'auto' : 'none',
              cursor: letterPulled ? 'pointer' : 'default',
              transformStyle: 'preserve-3d',
            }}
            onClick={letterPulled ? onOpen : undefined}
          >
            {/* Elegant Letter Content */}
            <div>
              <div style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.6rem', color: 'var(--primary)', lineHeight: 1.1, marginBottom: 8 }}>
                Bức thư gửi Ngọc
              </div>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '1.05rem', fontWeight: 600, color: '#5c4535', lineHeight: 1.5, padding: '0 10px' }}>
                Đây là món quà đặc biệt a muốn dành tặng cho em, mong em sẽ vui 💕
              </p>
            </div>

            {/* Action Button inside Letter */}
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 10px 25px rgba(255,77,109,0.5)' }}
              whileTap={{ scale: 0.96 }}
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                onOpen();
              }}
              style={{
                background: 'linear-gradient(135deg, var(--primary), #c9184a)',
                fontSize: '1.15rem',
                padding: '12px 35px',
                border: 'none',
                cursor: 'pointer',
                opacity: letterPulled ? 1 : 0,
                transition: 'opacity 0.15s ease',
              }}
            >
              Mở bức thư nhé 👑
            </motion.button>

            {/* Decorative Gold Stars */}
            <div style={{ position: 'absolute', bottom: 12, right: 15, fontSize: '1.2rem', opacity: 0.5 }}>✦</div>
            <div style={{ position: 'absolute', top: 12, left: 15, fontSize: '1.2rem', opacity: 0.5 }}>✦</div>
          </motion.div>

          {/* LEFT FLAP (Decorative SVG) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '50%', height: '100%',
            overflow: 'hidden', pointerEvents: 'none', zIndex: 4,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 200 280" preserveAspectRatio="none">
              <path d="M0,0 L200,140 L0,280 Z" fill="url(#leftFlapGrad)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <defs>
                <linearGradient id="leftFlapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2c0533" />
                  <stop offset="100%" stopColor="#120017" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* RIGHT FLAP (Decorative SVG) */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0, width: '50%', height: '100%',
            overflow: 'hidden', pointerEvents: 'none', zIndex: 4,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 200 280" preserveAspectRatio="none">
              <path d="M200,0 L0,140 L200,280 Z" fill="url(#rightFlapGrad)" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
              <defs>
                <linearGradient id="rightFlapGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#22002b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#0a000e" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* BOTTOM FLAP (Decorative SVG) */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, width: '100%', height: '62%',
            overflow: 'hidden', pointerEvents: 'none', zIndex: 5,
          }}>
            <svg width="100%" height="100%" viewBox="0 0 400 173" preserveAspectRatio="none">
              <path d="M0,173 L200,0 L400,173 Z" fill="url(#bottomFlapGrad)" stroke="rgba(255,255,255,0.04)" />
              <defs>
                <linearGradient id="bottomFlapGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#1e0024" />
                  <stop offset="100%" stopColor="#15001c" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* TOP FLAP (Folds up via 3D Rotate) */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={{ rotateX: flapOpened ? -180 : 0 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '140px',
              transformOrigin: 'top center',
              zIndex: flapOpened ? 1 : 6, // Low z-index when flipped up, high when closed
              pointerEvents: 'none',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front flap (visible when closed) */}
            <div style={{
              position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
                <path d="M0,0 L200,140 L400,0 Z" fill="url(#topFlapGrad)" stroke="rgba(255,255,255,0.06)" />
                <defs>
                  <linearGradient id="topFlapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#350042" />
                    <stop offset="100%" stopColor="#1d0026" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Back flap (visible when fully open) */}
            <div style={{
              position: 'absolute', inset: 0,
              transform: 'rotateX(180deg)',
              backfaceVisibility: 'hidden',
            }}>
              <svg width="100%" height="100%" viewBox="0 0 400 140" preserveAspectRatio="none">
                <path d="M0,0 L200,140 L400,0 Z" fill="#14001b" stroke="rgba(255,255,255,0.03)" />
              </svg>
            </div>
          </motion.div>

          {/* WAX SEAL (Centered on envelope front, locks flaps) */}
          <AnimatePresence>
            {sealBurst.map(piece => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 1, scale: 0.4, x: '-50%', y: '-50%' }}
                animate={{
                  opacity: 0,
                  scale: [0.6, 1.15, 0.7],
                  x: `calc(-50% + ${piece.x}px)`,
                  y: `calc(-50% + ${piece.y}px)`,
                  rotate: piece.rotate,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  top: '140px',
                  left: '50%',
                  zIndex: 12,
                  color: piece.color,
                  fontSize: piece.symbol === '●' ? '0.75rem' : '1.2rem',
                  textShadow: `0 0 10px ${piece.color}`,
                  pointerEvents: 'none',
                }}
              >
                {piece.symbol}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* WAX SEAL (Centered on envelope front, locks flaps) */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                exit={{
                  scale: 0,
                  opacity: 0,
                  rotate: [0, 15, -15],
                  filter: 'drop-shadow(0 0 30px rgba(212,175,55,1))',
                  transition: { duration: 0.25 },
                }}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={triggerOpenFlow}
                style={{
                  position: 'absolute',
                  top: '140px',
                  left: '50%',
                  x: '-50%',
                  y: '-50%',
                  zIndex: 8,
                  cursor: 'pointer',
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 35% 35%, #ffd6e7 0%, #d4af37 40%, #a07820 85%)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5), 0 0 20px rgba(212,175,55,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.1rem',
                  border: '3px solid rgba(240,208,96,0.6)',
                  animation: 'seal-pulse 2s ease-in-out infinite',
                }}
              >
                💖
                {/* Dashed outer orbit ring */}
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: '50%',
                  border: '2px dashed rgba(212,175,55,0.3)',
                  animation: 'radar-sweep 8s linear infinite',
                }} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Seal Prompt Hint */}
          <AnimatePresence>
            {!opened && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 0.85, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  bottom: '22px',
                  left: 0, right: 0,
                  textAlign: 'center',
                  color: 'rgba(212,175,55,0.85)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '1px',
                  zIndex: 7,
                  pointerEvents: 'none',
                }}
              >
                ✨ Chạm vào con dấu Trái Tim để mở thư ✨
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
