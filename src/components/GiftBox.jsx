import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Heart, Stars } from 'lucide-react';
import confetti from 'canvas-confetti';

const GiftBox = ({ onShowGallery }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    
    // Big confetti blast
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}>
      {!isOpen ? (
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}
        >
          <motion.div
            animate={{ 
              rotate: [0, -10, 10, -10, 10, 0],
            }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
          >
            <Gift size={120} color="var(--primary)" />
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.5rem', color: 'var(--text-main)', marginTop: '1rem' }}>
            Nhấn để mở quà!
          </h2>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="glass"
          style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', width: '90%', cursor: 'pointer' }}
          onClick={onShowGallery}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ marginBottom: '1rem', fontSize: '8rem' }}
          >
            🎂
          </motion.div>
          
          <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            Chúc Mừng Sinh Nhật!
          </h2>
          
          <p style={{ fontSize: '1.3rem', color: 'var(--text-main)', lineHeight: '1.6', marginBottom: '1rem', fontWeight: 600 }}>
            Nhấn vào chiếc bánh này để "thổi nến" và xem điều diệu kỳ nhé! ✨
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
              <Stars color="#f5cb5c" size={32} />
            </motion.div>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }}>
              <Heart color="var(--primary)" size={32} fill="var(--primary)" />
            </motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}>
              <Stars color="#f5cb5c" size={32} />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GiftBox;
