import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Mic, MicOff, Wind, RotateCcw } from 'lucide-react';

/* ══════════════════════════════════════════
   AUDIO SYNTHESIZER (Pure Web Audio - No Assets Required)
   ══════════════════════════════════════════ */
const playBlowChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.15);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start(now);
    osc.stop(now + 0.2);
  } catch (e) {
    console.error(e);
  }
};

const playSuccessChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // ASCENDING ARPEGGIOC-E-G-C-E-G-C
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      
      gain.gain.setValueAtTime(0.12, now + index * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.35);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.45);
    });
  } catch (e) {
    console.error(e);
  }
};

/* ══════════════════════════════════════════
   CAKE TIERS CONFIG
   ══════════════════════════════════════════ */
const TIERS = [
  { id: 'plate', h: 14, w: 210, bg: '#f5e6d3', border: '#e0c090', shadow: 'rgba(220,180,100,0.6)', delay: 0.0, label: null },
  { id: 't1',    h: 72, w: 190, bg: null,       border: '#a41030', shadow: 'rgba(255,60,90,0.6)',   delay: 0.15, label: '✨ Sinh Nhật Vui Vẻ ✨', labelColor: '#fff' },
  { id: 't2',    h: 62, w: 148, bg: null,       border: '#e070a0', shadow: 'rgba(255,130,180,0.5)', delay: 0.3, label: '🎀 Happy Birthday 🎀',   labelColor: '#a41030' },
  { id: 't3',    h: 52, w: 108, bg: null,       border: '#ffb3c1', shadow: 'rgba(255,180,200,0.5)', delay: 0.45, label: '🌸 Em Yêu 🌸',           labelColor: '#c9184a' },
];

const TIER_GRADIENTS = [
  null,
  'linear-gradient(160deg, #ff6b8a 0%, #ff4d6d 50%, #c9184a 100%)',
  'linear-gradient(160deg, #ffcce0 0%, #ffb3c1 50%, #ff8fa3 100%)',
  'linear-gradient(160deg, #fff5f8 0%, #ffe8f0 50%, #ffd6e7 100%)',
];

const CANDLE_COLS = ['#ff4d6d', '#f9a03f', '#4cc9f0', '#b84de0', '#06d6a0'];
const WISH_LINES = [
  'Điều ước đã được gửi lên bầu trời! 🌟',
  'Chúc em luôn vui vẻ hạnh phúc mỗi ngày.',
  'Bây giờ mở món quà bí mật nha! 🎁',
];

/* ─── Animated Flame ─── */
const Flame = ({ color, delay }) => (
  <div
    style={{
      position: 'absolute', top: -16, left: '50%',
      width: 9, height: 16,
      background: `radial-gradient(ellipse at 50% 85%, #fffde0 0%, ${color} 55%, transparent 100%)`,
      borderRadius: '50% 50% 50% 50% / 65% 65% 35% 35%',
      transformOrigin: 'bottom center',
      animation: `candle-flicker 0.8s ease-in-out ${delay}s infinite`,
      filter: `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 10px ${color}80)`,
    }}
  />
);

/* ─── Candle ─── */
const Candle = ({ color, lit, visible, delay, onClick }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        exit={{ scaleY: 0, opacity: 0 }}
        transition={{ delay, duration: 0.35, type: 'spring', bounce: 0.7 }}
        onClick={onClick}
        style={{
          position: 'relative', width: 9, height: 30,
          background: `linear-gradient(to bottom, ${color}cc, ${color})`,
          borderRadius: '5px 5px 3px 3px',
          transformOrigin: 'bottom center',
          boxShadow: `0 0 8px ${color}90, 0 0 18px ${color}40`,
          cursor: lit ? 'pointer' : 'default',
        }}
      >
        {lit && <Flame color={color} delay={delay + 0.4} />}
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Sprinkles ─── */
const Sprinkles = ({ count = 14, delay }) => {
  const cols = ['#ff4d6d','#f9a03f','#4cc9f0','#b84de0','#06d6a0','#fff700','#ff85a1'];
  return Array.from({ length: count }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay + i * 0.05, duration: 0.25 }}
      style={{
        position: 'absolute',
        width: i % 3 === 0 ? 6 : 5,
        height: i % 3 === 0 ? 6 : 5,
        borderRadius: '50%',
        background: cols[i % cols.length],
        left: `${6 + (i * 6.3) % 88}%`,
        top: `${18 + (i * 8) % 60}%`,
        boxShadow: `0 0 5px ${cols[i % cols.length]}`,
      }}
    />
  ));
};

/* ─── Drip Frosting ─── */
const Drips = ({ count, color, delay }) =>
  Array.from({ length: count }).map((_, i) => (
    <motion.div
      key={i}
      initial={{ scaleY: 0 }}
      animate={{ scaleY: 1 }}
      transition={{ delay: delay + 0.15 + i * 0.08, duration: 0.35, type: 'spring' }}
      style={{
        position: 'absolute',
        top: -10, left: `${4 + i * (84 / (count - 1))}%`,
        width: 13, height: 17 + (i % 3) * 6,
        background: color,
        borderRadius: '0 0 50% 50%',
        transformOrigin: 'top center',
        opacity: 0.88,
        zIndex: 5,
      }}
    />
  ));

/* ─── Tier Entry ─── */
const CakeTier = ({ tier, gradient, idx, visible }) => {
  if (!visible) return null;
  return (
    <motion.div
      initial={{ y: -90, opacity: 0, scaleX: 0.3, rotate: -4 }}
      animate={{ y: 0, opacity: 1, scaleX: 1, rotate: 0 }}
      transition={{ duration: 0.65, type: 'spring', bounce: 0.42 }}
      style={{
        position: 'relative',
        width: tier.w, height: tier.h,
        borderRadius: idx === 0 ? '0 0 60% 60%' : '12px 12px 5px 5px',
        background: gradient || tier.bg,
        border: `3px solid ${tier.border}`,
        boxShadow: `0 8px 28px ${tier.shadow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
        overflow: 'visible',
        zIndex: 5 - idx,
      }}
    >
      {idx > 0 && (
        <>
          <Drips
            count={Math.floor(tier.w / 32)}
            color={idx === 1 ? 'rgba(255,90,120,0.75)' : idx === 2 ? 'rgba(255,143,180,0.75)' : 'rgba(255,180,210,0.75)'}
            delay={tier.delay}
          />
          <Sprinkles delay={tier.delay + 0.25} count={12 + idx * 2} />
        </>
      )}
      {tier.label && (
        <div style={{
          position: 'absolute', bottom: idx === 1 ? 12 : 8,
          width: '100%', textAlign: 'center',
          fontSize: idx === 1 ? '0.72rem' : '0.68rem',
          fontWeight: 700, color: tier.labelColor,
          textShadow: idx === 1 ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
          letterSpacing: '0.5px',
        }}>
          {tier.label}
        </div>
      )}
    </motion.div>
  );
};

/* ─── Full Interactive Cake with Audio API ─── */
const BirthdayCake = ({ active, onBlownOut }) => {
  const [shown, setShown] = useState([]);
  const [candlesOn, setCandlesOn] = useState(false);
  const [litCandles, setLitCandles] = useState([true, true, true, true, true]);
  const [smokeParticles, setSmokeParticles] = useState([]);
  const [isMicListening, setIsMicListening] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(''), 4500);
    return () => clearTimeout(t);
  }, [toastMessage]);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const sourceRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const fired = useRef(false);
  const litCandlesRef = useRef(litCandles);
  const completedRef = useRef(false);

  useEffect(() => {
    litCandlesRef.current = litCandles;
  }, [litCandles]);

  // Initialize cake tiers
  useEffect(() => {
    if (!active || fired.current) return;
    fired.current = true;

    const timers = TIERS.map(t => (
      setTimeout(() => setShown(p => [...p, t.id]), t.delay * 1000)
    ));
    timers.push(setTimeout(() => {
      setCandlesOn(true);
      const resetCandles = [true, true, true, true, true];
      litCandlesRef.current = resetCandles;
      completedRef.current = false;
      setLitCandles(resetCandles);
    }, 900));

    return () => timers.forEach(clearTimeout);
  }, [active]);

  // Spawn smoke particles
  const spawnSmoke = (candleIndex) => {
    const spacing = 12; // Gap of candles
    const totalWidth = spacingsOffset(spacing);
    const xOffset = (candleIndex * (spacing + 9)) - (totalWidth / 2) + 4;
    setSmokeParticles(prev => [
      ...prev,
      { id: Date.now() + Math.random(), x: xOffset, y: -45 }
    ]);
  };

  const spacingsOffset = (spacing) => {
    return (5 * 9) + (4 * spacing);
  };

  // Blow candle
  const blowCandle = useCallback((idx) => {
    setLitCandles(prev => {
      if (!prev[idx]) return prev;
      const next = [...prev];
      next[idx] = false;
      litCandlesRef.current = next;
      
      // Spawn smoke and sound
      spawnSmoke(idx);
      playBlowChime();

      // Check if all blown
      const allExtinguished = next.every(lit => !lit);
      if (allExtinguished && !completedRef.current) {
        completedRef.current = true;
        setTimeout(() => {
          stopMicListening();
          playSuccessChime();
          // Massive success confetti burst
          confetti({ particleCount: 120, spread: 130, origin: { y: 0.4 }, colors: ['#ff4d6d','#d4af37','#06d6a0','#4cc9f0','#ffffff'] });
          onBlownOut();
        }, 300);
      }
      return next;
    });
  }, [onBlownOut]);

  // Extinguish all candles at once (Wind button)
  const blowAllCandles = () => {
    let delay = 0;
    litCandlesRef.current.forEach((lit, idx) => {
      if (lit) {
        setTimeout(() => {
          blowCandle(idx);
        }, delay);
        delay += 150;
      }
    });
  };

  // Microphone Volume Listener
  const startMicListening = async () => {
    if (isMicListening) {
      stopMicListening();
      return;
    }

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Microphone API is not available in this browser/context');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContextClass();
      if (audioCtx.state === 'suspended') {
        await audioCtx.resume();
      }
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;

      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);
      dataArrayRef.current = dataArray;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsMicListening(true);

      // Check audio volume loop
      let lastBlowTime = 0;
      const checkVolume = () => {
        if (!analyserRef.current || !dataArrayRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

        // Compute RMS volume. It works better for short breath bursts than raw frequency average.
        let sumSquares = 0;
        for (let i = 0; i < bufferLength; i++) {
          const centeredSample = (dataArrayRef.current[i] - 128) / 128;
          sumSquares += centeredSample * centeredSample;
        }
        const volume = Math.sqrt(sumSquares / bufferLength);

        // Breath near the mic is usually above 0.06 RMS; keep a short cooldown per candle.
        if (volume > 0.06 && Date.now() - lastBlowTime > 280) {
          lastBlowTime = Date.now();
          
          // Extinguish next available candle
          const nextLitIndex = litCandlesRef.current.findIndex(lit => lit);
          if (nextLitIndex !== -1) {
            blowCandle(nextLitIndex);
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch (err) {
      console.warn('Microphone access denied or error:', err);
      setToastMessage('Không khởi tạo được micro. Bạn hãy click vào ngọn nến hoặc nhấn nút Thổi Nến nha! 💨');
    }
  };

  const stopMicListening = () => {
    setIsMicListening(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup micro listening on unmount
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (micStreamRef.current) micStreamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  const has = id => shown.includes(id);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 24, gap: 0, position: 'relative' }}>
      
      {/* Smoke particles */}
      <AnimatePresence>
        {smokeParticles.map(p => (
          <div
            key={p.id}
            className="smoke-particle"
            style={{
              position: 'absolute',
              left: `calc(50% + ${p.x}px)`,
              top: '55px',
              fontSize: '1.2rem',
              pointerEvents: 'none',
              zIndex: 35,
            }}
          >
            💨
          </div>
        ))}
      </AnimatePresence>

      {/* Candles Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 50, marginBottom: -3, zIndex: 10 }}>
        {CANDLE_COLS.map((col, i) => (
          <Candle
            key={i}
            color={col}
            lit={litCandles[i]}
            visible={candlesOn}
            delay={i * 0.1}
            onClick={() => blowCandle(i)}
          />
        ))}
      </div>

      {/* Cake Tiers */}
      <AnimatePresence>
        {has('t3') && <CakeTier tier={TIERS[3]} gradient={TIER_GRADIENTS[3]} idx={3} visible />}
        {has('t2') && <CakeTier tier={TIERS[2]} gradient={TIER_GRADIENTS[2]} idx={2} visible />}
        {has('t1') && <CakeTier tier={TIERS[1]} gradient={TIER_GRADIENTS[1]} idx={1} visible />}
        {has('plate') && <CakeTier tier={TIERS[0]} gradient={null} idx={0} visible />}
      </AnimatePresence>

      {/* Interactive Controls below cake */}
      {candlesOn && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ display: 'flex', gap: '10px', marginTop: '1.5rem', zIndex: 20 }}
        >
          {/* Micro blow-out toggle button */}
          <button
            onClick={startMicListening}
            style={{
              background: isMicListening ? 'rgba(6, 214, 160, 0.25)' : 'rgba(255,255,255,0.06)',
              border: `1px solid ${isMicListening ? '#06d6a0' : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '50px',
              padding: '8px 18px',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: isMicListening ? '#06d6a0' : 'rgba(255,255,255,0.8)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              outline: 'none',
              boxShadow: isMicListening ? '0 0 15px rgba(6, 214, 160, 0.4)' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            {isMicListening ? <Mic size={15} /> : <MicOff size={15} />}
            {isMicListening ? 'Đang lắng nghe hơi thổi...' : 'Bật thổi bằng Mic 🎙️'}
          </button>

          {/* Quick wind blowout button */}
          {litCandles.some(lit => lit) && (
            <button
              onClick={blowAllCandles}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50px',
                padding: '8px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.12)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.06)'}
            >
              <Wind size={15} color="#4cc9f0" />
              Thổi nến 💨
            </button>
          )}
        </motion.div>
      )}

      {/* Custom Premium Glassmorphic Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 35, scale: 0.92, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 20, scale: 0.92, x: '-50%', transition: { duration: 0.25 } }}
            style={{
              position: 'fixed',
              bottom: '40px',
              left: '50%',
              zIndex: 99999,
              background: 'rgba(15, 8, 22, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: '1.5px solid rgba(255, 77, 109, 0.45)',
              borderRadius: '18px',
              padding: '14px 24px',
              color: '#fff',
              fontSize: '0.94rem',
              fontWeight: 600,
              lineHeight: '1.45',
              boxShadow: '0 20px 50px rgba(255, 77, 109, 0.35), 0 5px 15px rgba(0,0,0,0.5)',
              maxWidth: '350px',
              width: '88%',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ══════════════════════════════════════════
   CLOSED LUXURY CARD (tilt and shine)
   ══════════════════════════════════════════ */
const ClosedCard = ({ onOpen }) => {
  const cardRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [14, -14]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-14, 14]), { stiffness: 200, damping: 30 });

  const handleMouseMove = useCallback((e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0); mouseY.set(0);
  }, [mouseX, mouseY]);

  const orbitAngles = [0, 72, 144, 216, 288];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 60 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotateY: -90, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.38 }}
      style={{ perspective: 1100, cursor: 'pointer', userSelect: 'none' }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
    >
      <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        <div style={{ position: 'relative', borderRadius: 30, padding: 3 }}>
          
          {/* Spinning border ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: 30, zIndex: 0,
              background: 'conic-gradient(from 0deg, #ff4d6d 0%, #d4af37 18%, #f9a03f 30%, #fff8e1 42%, #d4af37 55%, #ff8fa3 70%, #d4af37 82%, #ff4d6d 100%)',
            }}
          />

          <div style={{
            position: 'absolute', inset: 3, borderRadius: 28, zIndex: 0,
            boxShadow: 'inset 0 0 20px rgba(212,175,55,0.3)',
            background: 'transparent',
          }} />

          {/* CARD SURFACE */}
          <div style={{
            position: 'relative', zIndex: 1,
            borderRadius: 28,
            background: 'linear-gradient(145deg, #120020 0%, #1a0030 40%, #0e001a 70%, #160028 100%)',
            padding: '2.8rem 2.4rem 2.6rem',
            minWidth: 320,
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 -1px 0 rgba(0,0,0,0.5)',
          }}>
            <motion.div
              animate={{ x: ['-130%', '230%'] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'linear', repeatDelay: 1.5 }}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '45%', height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.12), rgba(255,255,255,0.08), transparent)',
                transform: 'skewX(-12deg)', pointerEvents: 'none', zIndex: 2,
              }}
            />

            <div style={{
              position: 'absolute', inset: 0, borderRadius: 28,
              background: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
              opacity: 0.4, pointerEvents: 'none', zIndex: 1,
            }} />

            {/* Corner ornaments */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
              <div key={pos} style={{
                position: 'absolute',
                top: pos.includes('top') ? 16 : 'auto',
                bottom: pos.includes('bottom') ? 16 : 'auto',
                left: pos.includes('left') ? 16 : 'auto',
                right: pos.includes('right') ? 16 : 'auto',
                color: 'rgba(212,175,55,0.55)',
                fontSize: '1.1rem',
                lineHeight: 1,
                zIndex: 3,
              }}>
                ✦
              </div>
            ))}

            <div style={{
              position: 'absolute', inset: 12,
              border: '1px dashed rgba(212,175,55,0.25)',
              borderRadius: 20, pointerEvents: 'none', zIndex: 3,
            }} />

            <div style={{ position: 'relative', zIndex: 4, textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 80, height: 80, margin: '0 auto 1rem' }}>
                <motion.div
                  animate={{ scale: [1, 1.08, 1], filter: ['drop-shadow(0 0 8px rgba(255,77,109,0.5))', 'drop-shadow(0 0 20px rgba(255,77,109,0.9))', 'drop-shadow(0 0 8px rgba(255,77,109,0.5))'] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                  style={{ fontSize: '3.8rem', lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}
                >
                  🌹
                </motion.div>

                {orbitAngles.map((angle, i) => (
                  <motion.div
                    key={i}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                    style={{
                      position: 'absolute', top: '50%', left: '50%',
                      width: 6, height: 6,
                      marginTop: -3, marginLeft: -3,
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      width: 6, height: 6,
                      borderRadius: '50%',
                      background: i % 2 === 0 ? '#d4af37' : '#ff8fa3',
                      boxShadow: `0 0 6px ${i % 2 === 0 ? '#d4af37' : '#ff8fa3'}`,
                      transform: `rotate(${angle}deg) translateX(42px)`,
                    }} />
                  </motion.div>
                ))}
              </div>

              <div style={{ marginBottom: '0.3rem' }}>
                <span style={{ color: 'rgba(212,175,55,0.5)', fontSize: '0.8rem', letterSpacing: 4, textTransform: 'uppercase', fontWeight: 500 }}>
                  ── ✦ ──
                </span>
              </div>
              <h2 style={{
                fontFamily: 'var(--font-cursive)',
                fontSize: '2.6rem',
                background: 'linear-gradient(135deg, #d4af37, #f0d060, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '0.3rem',
                lineHeight: 1.2,
              }}>
                Thiệp Sinh Nhật
              </h2>
              <p style={{ color: 'rgba(255,200,220,0.7)', fontSize: '0.95rem', marginBottom: '1.8rem', letterSpacing: 0.5 }}>
                Dành riêng cho em yêu 💝
              </p>

              <div style={{ marginBottom: '1.6rem', display: 'flex', justifyContent: 'center' }}>
                <motion.div
                  animate={{
                    scale: [1, 1.07, 1],
                    boxShadow: ['0 0 12px rgba(212,175,55,0.4)', '0 0 28px rgba(212,175,55,0.8)', '0 0 12px rgba(212,175,55,0.4)'],
                  }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  style={{
                    width: 64, height: 64,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at 35% 35%, #f0d060, #d4af37 55%, #a07820)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem',
                    border: '3px solid rgba(240,208,96,0.6)',
                    position: 'relative',
                  }}
                >
                  💌
                  <div style={{
                    position: 'absolute', inset: -6,
                    borderRadius: '50%',
                    border: '2px dashed rgba(212,175,55,0.35)',
                  }} />
                </motion.div>
              </div>

              <motion.div
                animate={{ opacity: [0.6, 1, 0.6], y: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: 50,
                  padding: '9px 24px',
                  color: 'rgba(240,208,96,0.9)',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: 0.5,
                }}
              >
                ✨ Nhấn để mở thiệp ✨
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ══════════════════════════════════════════
   OPENED CARD SURFACE (letter, glowing neon)
   ══════════════════════════════════════════ */
const OpenCard = ({ onNext }) => {
  const [cakeActive, setCakeActive] = useState(false);
  const [candlesExtinguished, setCandlesExtinguished] = useState(false);
  const [visibleWishLines, setVisibleWishLines] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setCakeActive(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!candlesExtinguished) return undefined;
    setVisibleWishLines(0);
    const timers = WISH_LINES.map((_, index) => (
      setTimeout(() => setVisibleWishLines(index + 1), 260 + index * 520)
    ));
    return () => timers.forEach(clearTimeout);
  }, [candlesExtinguished]);

  const finishCandleStep = () => {
    if (candlesExtinguished) return;
    playSuccessChime();
    confetti({
      particleCount: 120,
      spread: 130,
      origin: { y: 0.45 },
      colors: ['#ff4d6d', '#d4af37', '#06d6a0', '#4cc9f0', '#ffffff'],
    });
    setCandlesExtinguished(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotateY: 25, y: 30 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
      transition={{ duration: 0.7, type: 'spring', bounce: 0.28 }}
      style={{
        width: '100%',
        maxWidth: 460,
        borderRadius: 28,
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #0e0018 0%, #1c0028 50%, #0a0014 100%)',
        border: '1px solid rgba(212,175,55,0.25)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div style={{ height: 5, background: 'linear-gradient(90deg, #a07820, #d4af37, #f0d060, #d4af37, #a07820)' }} />

      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Sparkle background dots */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0, 0.6, 0] }}
            transition={{ delay: 0.3 + i * 0.2, duration: 2, repeat: Infinity, repeatDelay: Math.random() * 4 }}
            style={{
              position: 'absolute',
              width: 2, height: 2, borderRadius: '50%', background: '#fff',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              pointerEvents: 'none',
            }}
          />
        ))}

        <div style={{ padding: '2rem 1.6rem 1.8rem' }}>
          
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ textAlign: 'center', marginBottom: '1.2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.9rem' }}>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.5))' }} />
              {['🌸', '💖', '🌸'].map((e, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.12, type: 'spring', bounce: 0.6 }}
                  style={{ fontSize: '1.1rem' }}
                >
                  {e}
                </motion.span>
              ))}
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.5), transparent)' }} />
            </div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', bounce: 0.4 }}
              style={{
                fontFamily: 'var(--font-cursive)',
                fontSize: '3.4rem',
                background: 'linear-gradient(135deg, #ff8fa3 0%, #ff4d6d 45%, #c9184a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 15px rgba(255,77,109,0.4))',
                lineHeight: 1.1,
                margin: '0 0 4px',
              }}
            >
              Happy Birthday!
            </motion.h1>

            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              style={{
                fontFamily: 'var(--font-cursive)',
                fontSize: '1.65rem',
                color: 'rgba(240,208,96,0.85)',
                fontWeight: 500,
              }}
            >
              Gửi em yêu của anh 💖
            </motion.h3>
          </motion.div>

          {/* Letter Body */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 18,
              padding: '1.2rem 1.4rem',
              marginBottom: '0.5rem',
              color: 'rgba(255,255,255,0.82)',
              fontSize: '0.98rem',
              lineHeight: 1.75,
              textAlign: 'left',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3)',
            }}
          >
            <span style={{ position: 'absolute', top: 8, left: 14, fontSize: '3rem', color: 'rgba(212,175,55,0.12)', fontFamily: 'Georgia, serif', lineHeight: 1 }}>"</span>
            <p style={{ marginBottom: '0.7rem', paddingLeft: '0.5rem' }}>
              Chúc em sinh nhật tuổi 23 thật nhiều niềm vui, chúc em lúc nào cũng xinh đẹp, chúc em luôn vui vẻ hạnh phúc.
            </p>
            <p style={{ marginBottom: '0.7rem', paddingLeft: '0.5rem' }}>
              Chúc em đánh cầu hay hơn và tìm được công việc mà phù hợp với em để mỗi ngày đi làm em sẽ thấy vui vẻ hơn.
            </p>
            <p style={{ paddingLeft: '0.5rem', fontWeight: 700, color: 'rgba(255,143,163,0.95)' }}>
              Anh yêu em nhiều hơn tất cả 💕
            </p>
          </motion.div>

          {/* Gold divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.55 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0.6rem 0' }}
          >
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.4))' }} />
            <span style={{ color: 'rgba(212,175,55,0.7)', fontSize: '0.8rem' }}>🌹 🎂 🌹</span>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,175,55,0.4), transparent)' }} />
          </motion.div>

          {/* Interactive Birthday Cake */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <BirthdayCake active={cakeActive} onBlownOut={finishCandleStep} />
          </div>

          {/* Success next stage button */}
          <div style={{ minHeight: '80px', marginTop: '1.2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <AnimatePresence mode="wait">
              {!candlesExtinguished ? (
                <motion.div
                  key="blow-instruction"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', width: '100%' }}
                >
                  <motion.p
                    animate={{ opacity: [0.65, 1, 0.65] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    style={{
                      fontFamily: 'var(--font-handwriting)',
                      fontSize: '1.5rem',
                      color: 'rgba(240,208,96,0.9)',
                      margin: '0 0 0.9rem',
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    Click vào nến hoặc bấm nút để thổi nến nha.
                  </motion.p>
                  <motion.button
                    whileHover={{ scale: 1.04, boxShadow: '0 12px 35px rgba(76,201,240,0.45)' }}
                    whileTap={{ scale: 0.96 }}
                    onClick={finishCandleStep}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      minWidth: 220,
                      border: '1px solid rgba(76,201,240,0.55)',
                      borderRadius: 50,
                      padding: '12px 22px',
                      background: 'linear-gradient(135deg, rgba(76,201,240,0.25), rgba(6,214,160,0.2))',
                      color: '#fff',
                      fontSize: '1rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.28)',
                    }}
                  >
                    <Wind size={18} color="#4cc9f0" /> Thổi nến ngay
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="get-gift-btn"
                  initial={{ opacity: 0, scale: 0.8, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 120 }}
                  style={{ textAlign: 'center', width: '100%' }}
                >
                  <ChaseTargetGame onWon={onNext} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>

      <div style={{ height: 5, background: 'linear-gradient(90deg, #a07820, #d4af37, #f0d060, #d4af37, #a07820)' }} />
    </motion.div>
  );
};

/* ─── Chase Target Mini Game ─── */
const ChaseTargetGame = ({ onWon }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clicked, setClicked] = useState(false);
  const containerRef = useRef(null);

  // Randomly teleport the avatar to a new position on screen
  const teleport = useCallback(() => {
    if (clicked) return;
    const padding = 80;
    const maxX = window.innerWidth - padding * 2;
    const maxY = window.innerHeight - padding * 2;
    
    // Random position relative to viewport
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));
    
    setPosition({ x: randomX, y: randomY });
  }, [clicked]);

  // Run or teleport away when cursor gets close (optional but fun)
  useEffect(() => {
    teleport();
    const interval = setInterval(teleport, 1400); // changes position every 1.4s
    return () => clearInterval(interval);
  }, [teleport]);

  const handleCatch = () => {
    setClicked(true);
    playSuccessChime();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  return (
    <div ref={containerRef} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {!clicked ? (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              fontFamily: 'var(--font-cursive)',
              fontSize: '1.4rem',
              color: '#f0d060',
              fontWeight: 'bold',
              margin: '0 0 10px',
              textShadow: '0 2px 10px rgba(240,208,96,0.3)',
            }}
          >
            Tìm anh để lên xe đi nhận quà nha! 🏍️💨
          </motion.p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            (Hãy click vào hình anh đang chạy nhảy trên màn hình)
          </p>

          {/* Portal representation for the flying face */}
          <AnimatePresence>
            <motion.div
              drag
              dragConstraints={{ top: 0, left: 0, right: window.innerWidth, bottom: window.innerHeight }}
              animate={{
                x: position.x - 60,
                y: position.y - 60,
              }}
              transition={{
                type: 'spring',
                stiffness: 80,
                damping: 12
              }}
              onClick={handleCatch}
              onMouseEnter={teleport} // Teleport on hover to make it extra fun and dynamic!
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 120,
                height: 120,
                zIndex: 99999,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Text Balloon above the rider */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                color: '#1a0030',
                padding: '4px 8px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                marginBottom: 6,
                position: 'relative',
                border: '1px solid #ff4d6d'
              }}>
                Lên a đèo đi xem quà nhé!
                <div style={{
                  position: 'absolute',
                  bottom: -4,
                  left: '50%',
                  transform: 'translateX(-50%) rotate(45deg)',
                  width: 8,
                  height: 8,
                  background: '#e9e9e9',
                }} />
              </div>

              {/* Character container: Cut-out effect (circle frame) */}
              <div style={{
                width: 75,
                height: 75,
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #ff4d6d',
                boxShadow: '0 0 15px rgba(255, 77, 109, 0.8), 0 8px 16px rgba(0,0,0,0.4)',
                background: '#fff',
              }}>
                <img
                  src="/photos/surprise-ride.jpg"
                  alt="Surprise Rider"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ width: '100%', textAlign: 'center' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(6,214,160,0.15), rgba(76,201,240,0.1))',
            border: '2px solid #06d6a0',
            borderRadius: 18,
            padding: '1.2rem',
            marginBottom: '1rem',
          }}>
            <p style={{ fontSize: '1.4rem', color: '#06d6a0', fontWeight: 'bold', margin: '0 0 5px' }}>
              Đã bắt được anh! 🎉
            </p>
            <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Chuẩn bị đi xem quà thôi nàoo! 🏍️💨
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 12px 35px rgba(255,77,109,0.7)' }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary"
            onClick={onWon}
            style={{ width: '100%', justifyContent: 'center', fontSize: '1.15rem', padding: '15px' }}
          >
            <Gift size={20} /> Nhận quà của anh nhé
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT EXPORT
   ══════════════════════════════════════════ */
const BirthdayCakeCard = ({ onNext }) => {
  const [phase, setPhase] = useState('closed'); // 'closed' | 'open'

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: 480,
      padding: '0 12px',
    }}>
      <AnimatePresence mode="wait">
        {phase === 'closed' ? (
          <ClosedCard key="closed" onOpen={() => setPhase('open')} />
        ) : (
          <OpenCard key="open" onNext={onNext} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default BirthdayCakeCard;
