import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import FloatingHearts from './components/FloatingHearts';
import BirthdayCakeCard from './components/BirthdayCakeCard';
import GiftBox from './components/GiftBox';
import PhotoGallery from './components/PhotoGallery';
import MiniGame from './components/MiniGame';
import Envelope from './components/Envelope';
import SparkleTrail from './components/SparkleTrail';

const PortalReveal = () => {
  const tunnelRings = Array.from({ length: 9 });
  const lightStreaks = Array.from({ length: 18 });
  const dataChips = ['LOVE KEY', 'MEMORY VAULT', '24.04', 'HEART ID', 'ACCESS', 'FOREVER'];

  return (
    <motion.div
      key="portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.18, filter: 'blur(22px)' }}
      transition={{ duration: 0.28 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 50% 50%, rgba(255,77,109,0.22) 0%, rgba(6,214,160,0.13) 24%, rgba(8,2,15,0.98) 58%, #020006 100%)',
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.38, 0.18, 0.44] }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          transform: 'perspective(700px) rotateX(62deg) scale(1.7)',
          transformOrigin: '50% 55%',
        }}
      />

      <motion.div
        initial={{ height: '50vh' }}
        animate={{ height: ['50vh', '14vh', '8vh'] }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, background: '#020006', zIndex: 5 }}
      />
      <motion.div
        initial={{ height: '50vh' }}
        animate={{ height: ['50vh', '14vh', '8vh'] }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#020006', zIndex: 5 }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 900,
        }}
      >
        {tunnelRings.map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0.14 + i * 0.1,
              rotateZ: i * 12,
              rotateX: 70,
            }}
            animate={{
              opacity: [0, 0.85, 0.25],
              scale: [0.16 + i * 0.1, 1.55 + i * 0.11],
              rotateZ: i % 2 ? -190 : 190,
              rotateX: [70, 58, 70],
            }}
            transition={{
              duration: 1.25,
              delay: i * 0.055,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{
              position: 'absolute',
              width: 'min(72vw, 460px)',
              aspectRatio: '1',
              borderRadius: i % 3 === 0 ? '42% 58% 44% 56%' : '50%',
              border: `${i % 2 ? 1 : 2}px solid ${i % 2 ? 'rgba(6,214,160,0.42)' : 'rgba(255,143,163,0.5)'}`,
              boxShadow: i % 2
                ? '0 0 30px rgba(6,214,160,0.18), inset 0 0 20px rgba(6,214,160,0.1)'
                : '0 0 34px rgba(255,77,109,0.22), inset 0 0 20px rgba(255,77,109,0.12)',
            }}
          />
        ))}

        {lightStreaks.map((_, i) => {
          const angle = (i / lightStreaks.length) * 360;
          const color = i % 3 === 0 ? '#06d6a0' : i % 3 === 1 ? '#ff8fa3' : '#f0d060';
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scaleX: 0.12, x: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scaleX: [0.12, 1.15, 0.25],
                x: [0, 420],
              }}
              transition={{
                duration: 0.9,
                delay: 0.18 + (i % 6) * 0.08,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: 190,
                height: 2,
                borderRadius: 999,
                background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
                boxShadow: `0 0 16px ${color}`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: '-8px 50%',
              }}
            />
          );
        })}

        {dataChips.map((chip, i) => {
          const angle = (i / dataChips.length) * Math.PI * 2;
          return (
            <motion.div
              key={chip}
              initial={{ opacity: 0, x: Math.cos(angle) * 310, y: Math.sin(angle) * 210, scale: 0.75 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [Math.cos(angle) * 310, Math.cos(angle) * 150, 0],
                y: [Math.sin(angle) * 210, Math.sin(angle) * 100, 0],
                scale: [0.75, 1, 0.25],
              }}
              transition={{ duration: 1.1, delay: 0.18 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: 'absolute',
                padding: '7px 11px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.18)',
                background: 'rgba(3, 12, 18, 0.78)',
                color: i % 2 ? '#ffb3c1' : '#8ffff1',
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: '0.72rem',
                letterSpacing: 1.4,
                boxShadow: '0 10px 28px rgba(0,0,0,0.32), 0 0 20px rgba(6,214,160,0.16)',
              }}
            >
              {chip}
            </motion.div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.25, rotateY: 70 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.25, 1.18, 1.02, 2.2],
            rotateY: [70, 0, 0, -35],
            filter: [
              'drop-shadow(0 0 10px rgba(255,77,109,0.55))',
              'drop-shadow(0 0 54px rgba(255,77,109,0.95))',
              'drop-shadow(0 0 70px rgba(6,214,160,0.8))',
              'drop-shadow(0 0 120px rgba(255,255,255,1))',
            ],
          }}
          transition={{ duration: 1.65, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: 'min(34vw, 190px)',
            aspectRatio: '1',
            borderRadius: '38% 62% 42% 58%',
            background:
              'radial-gradient(circle at 35% 25%, #ffffff 0%, #ffd6e7 18%, #ff4d6d 43%, #8b0f3b 64%, rgba(6,214,160,0.5) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(3.6rem, 8vw, 5.8rem)',
            boxShadow:
              'inset 0 0 30px rgba(255,255,255,0.32), 0 0 90px rgba(255,77,109,0.72), 0 0 140px rgba(6,214,160,0.22)',
          }}
        >
          ♥
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: [0, 1, 1, 0], y: [30, 0, 0, -12] }}
          transition={{ duration: 1.45, delay: 0.18, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: '16vh',
            padding: '10px 16px',
            border: '1px solid rgba(6,214,160,0.38)',
            background: 'rgba(3, 12, 18, 0.62)',
            borderRadius: 999,
            fontFamily: 'monospace',
            letterSpacing: 4,
            fontWeight: 900,
            color: '#eafffb',
            textAlign: 'center',
            textShadow: '0 0 18px rgba(6,214,160,0.8)',
            boxShadow: '0 0 35px rgba(6,214,160,0.16)',
          }}
        >
          MEMORY VAULT BREACH
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 0] }}
        transition={{ duration: 1.85, times: [0, 0.72, 0.88, 1] }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 9,
          background: '#fff',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

function App() {
  const [step, setStep] = useState('envelope');
  const audioRef = React.useRef(null);
  const portalTimerRef = React.useRef(null);

  React.useEffect(() => () => {
    if (portalTimerRef.current) clearTimeout(portalTimerRef.current);
  }, []);

  const handleOpenEnvelope = () => {
    setStep('minigame');
    if (audioRef.current) {
      audioRef.current.volume = 0.55;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleWinGame = () => {
    const duration = 2500;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff'],
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setStep('portal');
    if (portalTimerRef.current) clearTimeout(portalTimerRef.current);
    portalTimerRef.current = setTimeout(() => {
      setStep('cakecard');
    }, 1900);
  };

  const handleShowGallery = () => setStep('gallery');

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '20px',
        overflow: 'hidden',
      }}
    >
      <SparkleTrail />
      <FloatingHearts />

      <audio
        ref={audioRef}
        src="/photos/Happy Birthday to You (Always 14) - AMEE x Hoàng Dũng x Obito x Hứa Kim Tuyền  OFFICIAL LYRIC VIDEO - WeChoice Awards.mp3"
        loop
      />

      <AnimatePresence mode="wait">
        {step === 'envelope' && (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(15px)' }}
            transition={{ duration: 0.7 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}
          >
            <Envelope onOpen={handleOpenEnvelope} />
          </motion.div>
        )}

        {step === 'minigame' && (
          <motion.div
            key="minigame"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15, filter: 'blur(15px)' }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}
          >
            <MiniGame onWin={handleWinGame} />
          </motion.div>
        )}

        {step === 'portal' && <PortalReveal />}

        {step === 'cakecard' && (
          <motion.div
            key="cakecard"
            initial={{ opacity: 0, scale: 0.72, y: 55, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)' }}
            transition={{ duration: 0.75, type: 'spring', bounce: 0.34 }}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', zIndex: 10 }}
          >
            <BirthdayCakeCard onNext={handleShowGallery} />
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
            exit={{ opacity: 0, scale: 0.8 }}
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
