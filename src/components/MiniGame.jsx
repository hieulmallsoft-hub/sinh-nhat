import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, Award, Calendar, Fingerprint, Heart, ShieldAlert, User } from 'lucide-react';
import confetti from 'canvas-confetti';

const LOVE_CODES = ['LOVE', '24.04', 'HIEU', '100%', 'LOCK', 'SYNC', 'OK'];

const playTone = (ok = false) => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = ok ? 'triangle' : 'square';
    osc.frequency.setValueAtTime(ok ? 720 : 180, now);
    osc.frequency.exponentialRampToValueAtTime(ok ? 980 : 95, now + 0.12);
    gain.gain.setValueAtTime(ok ? 0.08 : 0.055, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  } catch (err) {
    console.warn('Audio feedback failed:', err);
  }
};

const MiniGame = ({ onWin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');
  const [invalidField, setInvalidField] = useState('');
  const [errorShake, setErrorShake] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);

  const showError = (message, field = 'all') => {
    playTone(false);
    setError(message);
    setInvalidField(field);
    setErrorShake(prev => prev + 1);
    setIsSubmitting(false);
    setTimeout(() => setInvalidField(''), 900);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSubmitting || isScanning) return;

    setIsSubmitting(true);
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanDob = dob.trim().replace(/\s+/g, '');

    if (!cleanName || !cleanDob) {
      showError('Điền đủ 2 ô trước nha em!');
      return;
    }

    if (cleanName !== 'lê minh hiếu' && cleanName !== 'le minh hieu') {
      showError('Sai tên rồi nè, thử lại nha!', 'name');
      return;
    }

    if (cleanDob !== '24/04/2003' && cleanDob !== '24-04-2003' && cleanDob !== '24/4/2003') {
      showError('Sai ngày sinh rồi. Gợi ý: 24/04/2003', 'dob');
      return;
    }

    setError('');
    setInvalidField('');
    playTone(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsScanning(true);
    }, 180);
  };

  useEffect(() => {
    if (!isScanning) return undefined;

    const timer1 = setTimeout(() => setScanStep(1), 350);
    const timer2 = setTimeout(() => setScanStep(2), 720);
    const timer3 = setTimeout(() => setScanStep(3), 1080);
    const timer4 = setTimeout(() => {
      confetti({
        particleCount: 55,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#ff4d6d', '#f0d060', '#06d6a0', '#ffffff'],
      });
      onWin();
    }, 1550);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [isScanning, onWin]);

  const accessProgress = scanStep === 0 ? 18 : scanStep === 1 ? 48 : scanStep === 2 ? 78 : 100;
  const inputStyle = (field) => {
    const hasError = invalidField === 'all' || invalidField === field;

    return {
      width: '100%',
      padding: '14px 20px 14px 48px',
      borderRadius: '16px',
      border: `1.5px solid ${hasError ? '#ff375f' : 'rgba(255, 77, 109, 0.35)'}`,
      fontSize: '1.05rem',
      fontWeight: 500,
      outline: 'none',
      background: hasError ? 'rgba(255, 55, 95, 0.12)' : 'rgba(15, 8, 22, 0.72)',
      color: '#fff',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
      boxShadow: hasError
        ? '0 0 0 3px rgba(255, 55, 95, 0.16), inset 0 2px 4px rgba(0,0,0,0.45)'
        : 'inset 0 2px 4px rgba(0,0,0,0.45)',
    };
  };

  const clearError = () => {
    if (error) setError('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: errorShake ? [0, -8, 8, -6, 6, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 1.15, filter: 'blur(15px)' }}
      transition={errorShake ? { duration: 0.34 } : undefined}
      className="glass"
      style={{
        padding: '2.5rem 2rem',
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '480px',
        width: '100%',
        boxShadow: '0 22px 58px rgba(255, 77, 109, 0.2), inset 0 0 0 1px rgba(255,255,255,0.12)',
        position: 'relative',
        minHeight: '430px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        border: '1px solid rgba(255, 77, 109, 0.25)',
      }}
    >
      {isScanning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 42%, rgba(6,214,160,0.16), transparent 35%), radial-gradient(circle at 50% 60%, rgba(255,77,109,0.18), transparent 48%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,77,109,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,109,0.025) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <AnimatePresence mode="wait">
        {step === 1 && !isScanning && (
          <motion.div
            key="warning"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ zIndex: 1, position: 'relative' }}
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              style={{ marginBottom: '1.3rem', color: '#ff8fa3', display: 'flex', justifyContent: 'center' }}
            >
              <div style={{
                position: 'relative',
                background: 'rgba(255, 77, 109, 0.14)',
                padding: '18px',
                borderRadius: '50%',
                border: '2px solid rgba(255,77,109,0.35)',
                boxShadow: '0 0 18px rgba(255,77,109,0.2)',
              }}>
                <ShieldAlert size={54} />
              </div>
            </motion.div>

            <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.8rem', color: 'var(--primary)', marginBottom: '0.8rem', textShadow: '0 0 12px rgba(255,77,109,0.2)' }}>
              Cảnh báo bảo mật!
            </h2>

            <p style={{ fontSize: '1.05rem', marginBottom: '2rem', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: 500 }}>
              Muốn mở thư thì phải vượt qua cổng xác thực tình yêu.
            </p>

            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 12px 30px rgba(255,77,109,0.5)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary"
              onClick={() => setStep(2)}
              style={{ padding: '15px 36px', fontSize: '1.15rem', display: 'inline-flex', alignItems: 'center', gap: 10 }}
            >
              <Fingerprint size={22} /> Bắt đầu xác thực
            </motion.button>
          </motion.div>
        )}

        {step === 2 && !isScanning && (
          <motion.div
            key="input-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            style={{ width: '100%', zIndex: 1 }}
          >
            <h2 style={{
              fontFamily: 'var(--font-cursive)',
              fontSize: '2.55rem',
              background: 'linear-gradient(135deg, #fff, #ff8fa3)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '0.65rem',
              lineHeight: '1.25',
            }}>
              Thử thách trí nhớ
            </h2>

            <p style={{ marginBottom: '1.7rem', color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: '1.5', padding: '0 10px' }}>
              Nhập đúng tên và ngày sinh để mở khóa món quà.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%', alignItems: 'stretch' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '16px', color: 'rgba(255, 77, 109, 0.75)', zIndex: 2 }}>
                  <User size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Họ và tên anh yêu"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError();
                  }}
                  style={inputStyle('name')}
                />
              </div>

              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ position: 'absolute', left: '16px', color: 'rgba(255, 77, 109, 0.75)', zIndex: 2 }}>
                  <Calendar size={20} />
                </span>
                <input
                  type="text"
                  placeholder="Ngày sinh (VD: 24/04/2003)"
                  value={dob}
                  onChange={(e) => {
                    setDob(e.target.value);
                    clearError();
                  }}
                  style={inputStyle('dob')}
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    style={{
                      color: '#ff6b8a',
                      fontWeight: 700,
                      margin: 0,
                      fontSize: '0.92rem',
                      background: 'rgba(255,77,109,0.12)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,77,109,0.22)',
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                style={{
                  marginTop: '6px',
                  fontSize: '1.14rem',
                  padding: '15px',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #ff4d6d, #c9184a)',
                  boxShadow: '0 8px 25px rgba(255, 77, 109, 0.45)',
                  opacity: isSubmitting ? 0.78 : 1,
                  cursor: isSubmitting ? 'wait' : 'pointer',
                }}
              >
                {isSubmitting ? 'Đang kiểm tra...' : 'Xác nhận mở quà!'}
              </motion.button>
            </form>
          </motion.div>
        )}

        {isScanning && (
          <motion.div
            key="hologram-scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ width: '100%', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ position: 'relative', width: 168, height: 168, marginBottom: '1.25rem' }}>
              {LOVE_CODES.map((code, index) => {
                const angle = (index / LOVE_CODES.length) * Math.PI * 2;
                const radius = 75;
                return (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
                    animate={{
                      opacity: scanStep >= 3 ? [0, 1, 0.85] : [0.2, 0.75, 0.2],
                      scale: scanStep >= 3 ? [0.65, 1.08, 0.95] : 0.82,
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                    }}
                    transition={{
                      duration: scanStep >= 3 ? 0.55 : 1.8,
                      repeat: scanStep >= 3 ? 0 : Infinity,
                      delay: index * 0.05,
                    }}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      padding: '3px 7px',
                      borderRadius: 999,
                      border: '1px solid rgba(6,214,160,0.36)',
                      background: 'rgba(2, 12, 18, 0.72)',
                      color: index % 2 ? '#ff8fa3' : '#06d6a0',
                      fontFamily: 'monospace',
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      letterSpacing: 1,
                      boxShadow: '0 0 14px rgba(6,214,160,0.18)',
                    }}
                  >
                    {code}
                  </motion.div>
                );
              })}

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: '50%',
                  border: '1px dashed rgba(6,214,160,0.35)',
                  boxShadow: '0 0 24px rgba(6,214,160,0.12)',
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: 22,
                  borderRadius: '50%',
                  border: '2px dotted rgba(255,143,163,0.4)',
                }}
              />

              <div style={{
                position: 'absolute',
                inset: 20,
                borderRadius: '50%',
                border: '2px solid rgba(255, 77, 109, 0.32)',
                boxShadow: '0 0 15px rgba(255, 77, 109, 0.1)',
                background: 'rgba(255, 77, 109, 0.05)',
              }} />

              <div
                className="radar-sweep"
                style={{
                  position: 'absolute',
                  inset: 20,
                  borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, transparent 45%, rgba(255,77,109,0.46) 100%)',
                  pointerEvents: 'none',
                }}
              />

              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'heart-pulse-heavy 1.2s ease-in-out infinite',
              }}>
                <Heart size={44} color="var(--primary)" fill="var(--primary)" />
              </div>

              <div
                className="laser-line"
                style={{
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #ff8fa3, #fff, #ff8fa3, transparent)',
                  boxShadow: '0 0 12px #ff4d6d, 0 0 20px #ff8fa3',
                  zIndex: 2,
                }}
              />

              {scanStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.2 }}
                  animate={{ opacity: [0, 1, 0], scale: [0.2, 1.65, 2.2] }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    inset: 18,
                    borderRadius: '50%',
                    border: '2px solid rgba(6,214,160,0.8)',
                    boxShadow: '0 0 38px rgba(6,214,160,0.55)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </div>

            <h3 style={{
              fontFamily: 'monospace',
              fontSize: '1.18rem',
              color: '#ff8fa3',
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              textShadow: '0 0 10px rgba(255,77,109,0.45)',
            }}>
              Love Access Scan
            </h3>

            <AnimatePresence>
              {scanStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    width: '100%',
                    marginBottom: '0.85rem',
                    padding: '10px 12px',
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, rgba(6,214,160,0.16), rgba(255,77,109,0.14))',
                    border: '1px solid rgba(6,214,160,0.36)',
                    boxShadow: '0 0 28px rgba(6,214,160,0.16)',
                    color: '#eafffb',
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    letterSpacing: 2,
                    textShadow: '0 0 14px rgba(6,214,160,0.6)',
                  }}
                >
                  LOVE OS UNLOCKED
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{
              width: '100%',
              marginBottom: '1rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(6,214,160,0.25)',
              borderRadius: 999,
              padding: 4,
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: '8%' }}
                animate={{ width: `${accessProgress}%` }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #06d6a0, #4cc9f0, #ff8fa3)',
                  boxShadow: '0 0 18px rgba(6,214,160,0.55)',
                }}
              />
            </div>

            <div style={{
              background: 'rgba(5, 2, 10, 0.82)',
              border: '1.5px solid rgba(255, 77, 109, 0.24)',
              borderRadius: '15px',
              padding: '16px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              textAlign: 'left',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              color: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 10px 28px rgba(0,0,0,0.42)',
            }}>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={15} color={scanStep >= 1 ? '#06d6a0' : '#f9a03f'} />
                <span>Heartbeat:</span>
                <span style={{ color: scanStep >= 1 ? '#06d6a0' : '#f9a03f', fontWeight: 700 }}>
                  {scanStep >= 1 ? '[OK] 140 BPM' : '[Scanning...]'}
                </span>
              </motion.div>

              {scanStep >= 1 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Award size={15} color={scanStep >= 2 ? '#06d6a0' : '#f9a03f'} />
                  <span>Boyfriend check:</span>
                  <span style={{ color: scanStep >= 2 ? '#06d6a0' : '#f9a03f', fontWeight: 700 }}>
                    {scanStep >= 2 ? '[9999%]' : '[Scanning...]'}
                  </span>
                </motion.div>
              )}

              {scanStep >= 2 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Heart size={14} color={scanStep >= 3 ? '#ff4d6d' : '#f9a03f'} fill={scanStep >= 3 ? '#ff4d6d' : 'none'} />
                  <span>Love sync:</span>
                  <span style={{ color: scanStep >= 3 ? '#ff4d6d' : '#f9a03f', fontWeight: 700 }}>
                    {scanStep >= 3 ? '[100%]' : '[Loading...]'}
                  </span>
                </motion.div>
              )}

              {scanStep >= 3 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  style={{
                    color: '#06d6a0',
                    fontWeight: 900,
                    textAlign: 'center',
                    borderTop: '1px solid rgba(255, 77, 109, 0.22)',
                    paddingTop: '10px',
                    marginTop: 2,
                    fontSize: '0.9rem',
                    letterSpacing: '1px',
                  }}
                >
                  ACCESS GRANTED - LOVE 100%
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MiniGame;
