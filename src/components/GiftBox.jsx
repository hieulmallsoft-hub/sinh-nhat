import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stars, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

const BALLOON_EMOJIS = ['🎈', '🎈', '💖', '🌸', '💕', '🌸', '✨', '⭐', '🌺', '💝'];

const GiftBox = ({ onShowGallery }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [balloons, setBalloons] = useState([]);
  const [showPortal, setShowPortal] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    
    // Spawn floating balloons
    const list = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      emoji: BALLOON_EMOJIS[i % BALLOON_EMOJIS.length],
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 1.5}s`,
      speed: `${4 + Math.random() * 4}s`,
      scale: 0.6 + Math.random() * 0.7,
      rotate: `${Math.random() * 360}deg`
    }));
    setBalloons(list);

    // Show memory portal shortly after nắp hộp bay
    setTimeout(() => {
      setShowPortal(true);
    }, 600);

    // Big confetti blast sequence
    const duration = 4.5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 40 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 45 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.25 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.25 }
      });
    }, 200);
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      height: '100%', width: '100%', position: 'relative', overflow: 'visible'
    }}>
      
      {/* Shower of floating balloons */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 30, overflow: 'hidden' }}>
        <AnimatePresence>
          {balloons.map(b => (
            <div
              key={b.id}
              className="balloon-particle"
              style={{
                position: 'absolute',
                left: b.left,
                bottom: '-10vh',
                fontSize: `${3.5 * b.scale}rem`,
                animationDelay: b.delay,
                animationDuration: b.speed,
                transform: `rotate(${b.rotate})`,
              }}
            >
              {b.emoji}
            </div>
          ))}
        </AnimatePresence>
      </div>

      {!isOpen ? (
        /* CLOSED STATE: CUSTOM WOBBLING GIFT BOX */
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.45 }}
          onClick={handleOpen}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {/* Custom Physical Gift Box Container */}
          <div
            className="wobbling-box"
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              margin: '0 auto',
              cursor: 'pointer',
              zIndex: 10,
              filter: 'drop-shadow(0 20px 40px rgba(255, 77, 109, 0.35))',
            }}
          >
            {/* Box Lid */}
            <div style={{
              position: 'absolute', top: 0, left: '-5px', width: '170px', height: '40px',
              background: 'linear-gradient(to bottom, #ff5c7d, #ff4d6d)',
              borderRadius: '8px 8px 4px 4px',
              border: '2px solid rgba(255,255,255,0.15)',
              zIndex: 3,
            }}>
              {/* Lid Ribbon top Knot */}
              <div style={{
                position: 'absolute', top: '-18px', left: '50%', transform: 'translateX(-50%)',
                width: '45px', height: '20px',
                background: '#ffd6e7', borderRadius: '15px 15px 0 0',
                border: '2px solid rgba(255,255,255,0.2)',
                boxShadow: '0 0 10px rgba(212,175,55,0.4)',
              }} />
              {/* Lid ribbon horizontal path */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '32px', height: '100%', background: '#ffd6e7',
              }} />
            </div>

            {/* Box Body */}
            <div style={{
              position: 'absolute', top: '38px', left: 0, width: '160px', height: '122px',
              background: 'linear-gradient(to bottom, #a4133c, #800f2f)',
              borderRadius: '0 0 12px 12px',
              border: '2px solid rgba(255,255,255,0.1)',
              overflow: 'hidden',
              zIndex: 1,
            }}>
              {/* Box Body vertical ribbon */}
              <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '32px', height: '100%', background: '#ffd6e7',
              }} />
              {/* Shadow reflection inside */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
                pointerEvents: 'none',
              }} />
            </div>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-cursive)',
            fontSize: '2.8rem',
            color: 'rgba(255,255,255,0.95)',
            marginTop: '2rem',
            textShadow: '0 5px 15px rgba(255,77,109,0.3)',
            letterSpacing: '1px',
          }}>
            Nhấn để mở quà! 🎁
          </h2>
          <p style={{ color: 'rgba(255,200,220,0.7)', fontSize: '0.95rem', marginTop: '0.3rem', fontWeight: 500 }}>
            Một điều diệu kỳ đang chờ đón em...
          </p>
        </motion.div>
      ) : (
        /* OPEN STATE: MAGICAL GLOWING MEMORY PORTAL */
        <AnimatePresence>
          {showPortal && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="glass"
              style={{
                padding: '3rem 2rem',
                textAlign: 'center',
                maxWidth: '480px',
                width: '92%',
                cursor: 'pointer',
                border: '1.5px solid rgba(212,175,55,0.3)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.65), 0 0 35px rgba(212,175,55,0.2)',
                position: 'relative',
                zIndex: 20,
              }}
              onClick={onShowGallery}
              whileHover={{ scale: 1.02, boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 50px rgba(212,175,55,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Floating Magic Cake Portal Circle */}
              <div style={{ position: 'relative', width: '130px', height: '130px', margin: '0 auto 1.5rem' }}>
                {/* Rotating Gold Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: 0,
                    borderRadius: '50%',
                    border: '3px dotted #f0d060',
                    filter: 'drop-shadow(0 0 8px rgba(240,208,96,0.6))',
                  }}
                />
                
                {/* Rotating Cake Emoji */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                    scale: [1, 1.08, 1],
                    filter: ['drop-shadow(0 0 10px rgba(255,77,109,0.4))', 'drop-shadow(0 0 25px rgba(255,77,109,0.85))', 'drop-shadow(0 0 10px rgba(255,77,109,0.4))']
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{
                    fontSize: '6.2rem',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  🎂
                </motion.div>
              </div>
              
              <h2 style={{
                fontFamily: 'var(--font-cursive)',
                fontSize: '3.4rem',
                background: 'linear-gradient(135deg, #d4af37, #f0d060, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                lineHeight: 1.1,
              }}>
                Cổng Kỷ Niệm 🌸
              </h2>
              
              <p style={{
                fontSize: '1.08rem',
                color: 'rgba(255,255,255,0.85)',
                lineHeight: '1.75',
                marginBottom: '2rem',
                fontWeight: 500,
                padding: '0 10px',
              }}>
                Hộp quà đã mở ra một làn sóng ký ức! Em yêu hãy **chạm vào chiếc bánh sinh nhật** ở trên để bước vào thế giới kỷ niệm lãng mạn của hai ta nhé! ✨
              </p>
              
              {/* Star-Heart Sparkle Indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                  <Stars color="#f5cb5c" size={26} />
                </motion.div>
                <motion.div animate={{ scale: [1, 1.25, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}>
                  <Heart color="var(--primary)" size={28} fill="var(--primary)" style={{ animation: 'heart-pulse-heavy 1.5s infinite' }} />
                </motion.div>
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
                  <Stars color="#f5cb5c" size={26} />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default GiftBox;
