import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail } from 'lucide-react';
import FloatingHearts from './components/FloatingHearts';
import BirthdayCard from './components/BirthdayCard';
import GiftBox from './components/GiftBox';
import PhotoGallery from './components/PhotoGallery';
import MiniGame from './components/MiniGame';

function App() {
  const [step, setStep] = useState('envelope'); // 'envelope', 'card', 'gift', 'minigame', 'gallery'
  const audioRef = React.useRef(null);

  const handleOpenEnvelope = () => {
    setStep('minigame');
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const handleWinGame = () => {
    setStep('card');
    
    // Fire confetti!
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleOpenGift = () => {
    setStep('gallery');
  };

  const handleShowGallery = () => {
    setStep('gallery');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      position: 'relative',
      padding: '20px'
    }}>
      <FloatingHearts />
      <audio ref={audioRef} src="/photos/Happy Birthday to You (Always 14) - AMEE x Hoàng Dũng x Obito x Hứa Kim Tuyền  OFFICIAL LYRIC VIDEO - WeChoice Awards.mp3" loop />
      
      <AnimatePresence mode="wait">
        {step === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="glass"
            style={{ 
              padding: '4rem 3rem', 
              textAlign: 'center', 
              zIndex: 10,
              maxWidth: '450px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(255, 77, 109, 0.3), inset 0 0 0 2px rgba(255,255,255,0.5)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Shimmer effect */}
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              style={{
                position: 'absolute', top: 0, left: 0, width: '50%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                transform: 'skewX(-20deg)'
              }}
            />

            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ marginBottom: '2rem', color: 'var(--primary)', filter: 'drop-shadow(0 10px 15px rgba(255,77,109,0.4))' }}
            >
              <Mail size={80} style={{ margin: '0 auto' }} />
            </motion.div>
            
            <h2 style={{ 
              fontFamily: 'var(--font-cursive)', 
              fontSize: '3rem', 
              color: 'var(--primary)',
              textShadow: '0 2px 10px rgba(255,77,109,0.2)',
              marginBottom: '1rem'
            }}>
              Anh có một món quà...
            </h2>
            <p style={{ color: 'var(--text-main)', marginBottom: '2.5rem', fontSize: '1.2rem', fontWeight: 500 }}>
              Dành riêng cho công chúa của anh! 👑
            </p>
            
            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(255,77,109,0.6)' }}
              whileTap={{ scale: 0.95 }}
              animate={{ boxShadow: ['0 0 0 0 rgba(255,77,109,0.4)', '0 0 0 15px rgba(255,77,109,0)'] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="btn-primary" 
              onClick={handleOpenEnvelope}
              style={{ fontSize: '1.3rem', padding: '16px 40px' }}
            >
              Mở ra nhé 💕
            </motion.button>
          </motion.div>
        )}

        {step === 'minigame' && (
          <motion.div
            key="minigame"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <MiniGame onWin={handleWinGame} />
          </motion.div>
        )}

        {step === 'card' && (
          <motion.div
            key="card"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <BirthdayCard onOpenGift={handleOpenGift} />
          </motion.div>
        )}

        {step === 'gift' && (
          <motion.div
            key="gift"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8 }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}
          >
            <GiftBox onShowGallery={handleShowGallery} />
          </motion.div>
        )}

        {step === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: 'spring' }}
            style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}
          >
            <PhotoGallery onClose={() => setStep('gift')} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
