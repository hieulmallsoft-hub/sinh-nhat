import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Volume2, VolumeX, Film, Layout, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

const mediaFiles = [
  '/photos/65564d1c-5777-4834-b562-47d35fbcc83a.mp4',
  '/photos/bafb7048-aae4-449d-89ca-d57256587b1b.jpg',
  '/photos/cc78718f-a74c-4544-a12a-6be12b23f0d3.jpg',
  '/photos/c7027819-05fe-4d90-9f80-836f52f11ef2.jpg',
  '/photos/0fbd80cb-227c-4844-bd3d-49df31743abc.jpg',
  '/photos/51644701-bf47-4c61-a15e-89c36a29c89f.jpg',
  '/photos/884bd769-2e4a-4a1b-95d7-a82e728584e3.jpg',
  '/photos/094bb768-51a3-407b-8173-bafe9f136630.mp4',
  '/photos/16dec41f-696e-4ca3-b48d-4a2be2ca5822.jpg',
  '/photos/16e63f0b-b1de-4ace-adbc-cd38f439e5e7.jpg',
  '/photos/1aae8d56-52db-49d4-a95d-301f5124c527.jpg',
  '/photos/2dce6046-96f6-41ce-82ba-1dc3c15c7600.jpg',
  '/photos/394293b6-6a3e-4145-b8af-2e8746bbaa7c.jpg',
  '/photos/56ef848d-fe67-4321-bb2c-38ea2a506707.jpg',
  '/photos/6297ff3e-2399-4356-9d32-8bb5cda49e3c.jpg',
  '/photos/7cd0f89c-8973-466d-8538-835c85be93d8.jpg',
  '/photos/8f6eccf7-805f-4e7e-ac42-61d248087795.jpg',
  '/photos/91847d23-9bc5-4d38-a349-b9f246d63aec.jpg',
  '/photos/9db44705-ea21-4340-ad94-db51bb7d13fd.mp4',
  '/photos/a31de06d-ce5a-400d-aff4-dd57ab0009fc.jpg',
  '/photos/abe5c77b-42e8-41a7-b84b-5acc848d11be.jpg',
  '/photos/b2111374-4a1c-490b-9eae-ec18566874e7.jpg',
  '/photos/f247e857-abd6-406e-b650-e7c096553062.jpg',
];

// Unique retro handwriting captions for each memory polaroid
const CAPTIONS = [
  "Khoảnh khắc mới của tụi mình 🎥",
  "Một nụ cười làm anh nhớ mãi 💗",
  "Ngày đẹp nhất là ngày có em 🌷",
  "Cất thêm một ký ức thật xinh ✨",
  "Yêu em trong từng ánh nhìn 💘",
  "Bức ảnh nhỏ, thương yêu thật nhiều 💞",
  "Kỷ niệm mới trong tim anh 🌹",
  "Bên em là hạnh phúc 🌸", // mp4
  "Nụ cười của công chúa ☀️",
  "Bình yên là khi có em 💑",
  "Yêu em từ cái nhìn đầu tiên 💘",
  "Chuyến đi đong đầy niềm vui ✈️",
  "Gương mặt cute nhất quả đất 🐱",
  "Em là công chúa nhỏ của anh 👑",
  "Nắm chặt tay nhau không buông 🤝",
  "Nhõng nhẽo một tí nhưng rất yêu 🥺",
  "Mỗi ngày đều là valentine 🌹",
  "Ánh mắt lấp lánh ngàn vì sao ✨",
  "Đoạn phim tình yêu ngọt ngào 🎥", // mp4
  "Trái tim anh chỉ chứa bóng em 💞",
  "Hẹn hò lãng mạn cùng em yêu 🍽️",
  "Giận dỗi thế thôi chứ thương lắm 🧸",
  "Hành trình hạnh phúc bất tận ♾️",
];

const WashiTapeColors = [
  'rgba(255, 77, 109, 0.4)',
  'rgba(212, 175, 55, 0.35)',
  'rgba(76, 201, 240, 0.4)',
  'rgba(249, 160, 63, 0.35)',
  'rgba(6, 214, 160, 0.35)',
];

const HEART_LAYOUT = [
  [-42, -19], [-34, -30], [-24, -35], [-14, -32], [-6, -24],
  [6, -24], [14, -32], [24, -35], [34, -30], [42, -19],
  [45, -5], [39, 10], [30, 23], [20, 33], [10, 41],
  [0, 47], [-10, 41], [-20, 33], [-30, 23], [-39, 10],
  [-45, -5], [-24, -10], [24, -10],
];

const positions = mediaFiles.map((_, index) => {
  const [x, y] = HEART_LAYOUT[index % HEART_LAYOUT.length];

  return {
    rotate: `${index % 3 === 0 ? -5 : index % 3 === 1 ? 4 : 0}deg`,
    x: `${x}vw`,
    y: `${y}vh`,
  };
});

const PhotoGallery = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [photoBurst, setPhotoBurst] = useState(null);
  
  // Audio state
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioElRef = useRef(null);

  // Slideshow state
  const [slideshowMode, setSlideshowMode] = useState(false);
  const [slideshowIndex, setSlideshowIndex] = useState(0);

  // Synchronize audio element directly from document DOM (robust & clean)
  useEffect(() => {
    const audio = document.querySelector('audio');
    if (audio) {
      audioElRef.current = audio;
      setAudioPlaying(!audio.paused);
      
      const handlePlay = () => setAudioPlaying(true);
      const handlePause = () => setAudioPlaying(false);
      
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, []);

  const toggleMusic = () => {
    if (!audioElRef.current) return;
    if (audioPlaying) {
      audioElRef.current.pause();
    } else {
      audioElRef.current.play().catch(err => console.warn(err));
    }
  };

  const handleCakeClick = () => {
    if (unlockedCount < mediaFiles.length) {
      const nextIndex = unlockedCount;
      setPhotoBurst({
        id: Date.now(),
        src: mediaFiles[nextIndex],
        x: positions[nextIndex].x,
        y: positions[nextIndex].y,
        rotate: positions[nextIndex].rotate,
      });
      setTimeout(() => setPhotoBurst(null), 780);
      setUnlockedCount(prev => prev + 1);
      confetti({
        particleCount: 26,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });
    } else {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.5 },
      });
    }
  };

  // Slideshow automated cycle
  useEffect(() => {
    if (!slideshowMode) return;
    
    // Automatically set unlockedCount to max in slideshow mode
    setUnlockedCount(mediaFiles.length);

    const interval = setInterval(() => {
      setSlideshowIndex(prev => (prev + 1) % mediaFiles.length);
    }, 4200);

    return () => clearInterval(interval);
  }, [slideshowMode]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(16,8,28,0.92) 0%, rgba(5,2,8,0.98) 100%)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* ── COZY TWINKLING FAIRY LIGHTS ON TOP ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '40px',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '0 15px', zIndex: 100, pointerEvents: 'none'
      }}>
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="fairy-light"
            style={{
              width: '10px', height: '10px',
              borderRadius: '50%',
              background: i % 2 === 0 ? '#ffb3c1' : '#f0d060',
              boxShadow: `0 0 10px ${i % 2 === 0 ? '#ff4d6d' : '#ffd6e7'}`,
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      {/* ── RETRO VINYL MUSIC CONTROLLER (Top Right) ── */}
      <div style={{
        position: 'absolute', top: '25px', right: '25px', zIndex: 100,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        {/* Floating animated music waves */}
        {audioPlaying && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '22px' }}>
            {[1, 2, 3, 4].map(w => (
              <motion.div
                key={w}
                animate={{ height: [6, 22, 6] }}
                transition={{ repeat: Infinity, duration: 0.6 + w * 0.12, ease: 'easeInOut' }}
                style={{ width: '3px', background: 'var(--primary)', borderRadius: '3px' }}
              />
            ))}
          </div>
        )}

        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleMusic}
          style={{
            position: 'relative', width: '56px', height: '56px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #252525 0%, #111111 80%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.1)',
            cursor: 'pointer',
            border: '2px solid rgba(255,255,255,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
        >
          {/* Vinyl Grooves inside */}
          <div style={{
            position: 'absolute', inset: 4, borderRadius: '50%',
            border: '1.5px solid rgba(255,255,255,0.06)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
          }} />

          {/* Vinyl Spinning record body */}
          <div
            className={audioPlaying ? 'spinning-vinyl' : ''}
            style={{
              width: '100%', height: '100%', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Center Label (Pink/Gold) */}
            <div style={{
              width: '18px', height: '18px', borderRadius: '50%',
              background: 'radial-gradient(circle, #f0d060 0%, #ff4d6d 80%)',
              border: '1px solid #111',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
            }}>
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#111' }} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── ACTION CONTROLS BAR (Top Left) ── */}
      <div style={{
        position: 'absolute', top: '25px', left: '25px', zIndex: 100,
        display: 'flex', gap: '12px'
      }}>
        {/* Close Gallery */}
        <motion.button
          whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          style={{
            background: 'rgba(15, 8, 22, 0.7)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '50px',
            padding: '9px 18px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
          }}
        >
          <X size={16} /> Thoát ❌
        </motion.button>

        {/* Toggle Slideshow mode */}
        <motion.button
          whileHover={{ scale: 1.06, background: 'rgba(255,255,255,0.15)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setSlideshowMode(prev => !prev);
            setSlideshowIndex(0);
          }}
          style={{
            background: slideshowMode ? 'rgba(255, 77, 109, 0.25)' : 'rgba(15, 8, 22, 0.7)',
            border: `1px solid ${slideshowMode ? 'var(--primary)' : 'rgba(255,255,255,0.12)'}`,
            borderRadius: '50px',
            padding: '9px 18px',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease',
          }}
        >
          {slideshowMode ? <Layout size={16} color="var(--primary)" /> : <Film size={16} />}
          {slideshowMode ? 'Về Dạng Scrapbook 🖼️' : 'Trình Chiếu 🎥'}
        </motion.button>
      </div>

      {/* ── VIEWPORT CONTENT CONTAINER ── */}
      <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* ── NORMAL MODE: SCATTERED INTERACTIVE POLAROIDS ── */}
        {!slideshowMode && (
          <>
            <AnimatePresence>
              {photoBurst && (
                <motion.div
                  key={photoBurst.id}
                  initial={{ opacity: 0, scale: 0.25, x: 0, y: 0, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.25, 1.12, 0.96, 0.8],
                    x: photoBurst.x,
                    y: photoBurst.y,
                    rotate: photoBurst.rotate,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.72, ease: 'easeOut' }}
                  style={{
                    position: 'absolute',
                    width: 'clamp(88px, 6.6vw, 118px)',
                    height: 'clamp(122px, 8.8vw, 158px)',
                    padding: '9px 9px 32px',
                    background: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 18px 42px rgba(255,77,109,0.36), 0 10px 28px rgba(0,0,0,0.35)',
                    zIndex: 90,
                    pointerEvents: 'none',
                    overflow: 'hidden',
                  }}
                >
                  {photoBurst.src.endsWith('.mp4') ? (
                    <video src={photoBurst.src} muted style={{ width: '100%', height: 'calc(100% - 32px)', objectFit: 'cover', background: '#000' }} />
                  ) : (
                    <img src={photoBurst.src} alt="" style={{ width: '100%', height: 'calc(100% - 32px)', objectFit: 'cover' }} />
                  )}
                  <div style={{
                    position: 'absolute',
                    bottom: 7,
                    left: 4,
                    right: 4,
                    height: 18,
                    borderRadius: 999,
                    background: 'linear-gradient(90deg, rgba(255,77,109,0.22), rgba(212,175,55,0.22))',
                  }} />
                </motion.div>
              )}
            </AnimatePresence>
            {/* Render unlocked polaroids */}
            {mediaFiles.slice(0, unlockedCount).map((media, index) => {
              const isVideo = media.endsWith('.mp4');
              const tapeColor = WashiTapeColors[index % WashiTapeColors.length];
              return (
                <motion.div
                  key={index}
                  layoutId={`media-${index}`}
                  drag={!selectedId}
                  dragConstraints={{ left: -600, right: 600, top: -450, bottom: 450 }}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    x: positions[index].x, 
                    y: positions[index].y, 
                    rotate: positions[index].rotate 
                  }}
                  transition={{ 
                    type: 'spring', 
                    damping: 18, 
                    stiffness: 90
                  }}
                  whileHover={{ scale: 1.1, zIndex: 40 }}
                  whileDrag={{ scale: 1.12, zIndex: 45, cursor: 'grabbing' }}
                  onClick={() => setSelectedId(index)}
                  style={{
                    position: 'absolute',
                    padding: '9px 9px 32px 9px',
                    background: '#fff',
                    borderRadius: '4px',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.35), 0 3px 6px rgba(0,0,0,0.2)',
                    cursor: 'grab',
                    width: 'clamp(88px, 6.6vw, 118px)',
                    height: 'clamp(122px, 8.8vw, 158px)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    overflow: 'visible', // Visible for tape overhang
                    zIndex: index + 5,
                    border: '1px solid rgba(0,0,0,0.08)'
                  }}
                >
                  {/* Decorative Overlapping Washi Tape */}
                  <div style={{
                    position: 'absolute', top: '-14px', width: '70px', height: '24px',
                    background: tapeColor,
                    transform: `rotate(${positions[index].rotate.replace('deg','') * 0.4}deg)`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.06)',
                    borderRadius: '2px',
                    zIndex: 20,
                  }} />

                  {/* Media frame */}
                  {isVideo ? (
                    <div style={{ width: '100%', height: 'calc(100% - 32px)', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                      <Play color="#fff" size={28} style={{ position: 'absolute', opacity: 0.8, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))', zIndex: 5 }} />
                      <video src={media} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.72 }} />
                    </div>
                  ) : (
                    <img src={media} alt={`Memory ${index}`} style={{ width: '100%', height: 'calc(100% - 32px)', objectFit: 'cover' }} pointerEvents="none" />
                  )}

                  {/* Polaroid handwritten sweet caption */}
                  <div style={{
                    position: 'absolute', bottom: '7px', left: 4, right: 4,
                    fontFamily: 'var(--font-handwriting)', fontSize: 'clamp(0.72rem, 0.88vw, 0.95rem)',
                    color: '#3d2b1f', textAlign: 'center', lineHeight: 1.1,
                    textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap'
                  }}>
                    {CAPTIONS[index]}
                  </div>
                </motion.div>
              );
            })}

            {/* Giant Spawner cake in center */}
            <motion.div 
              style={{ zIndex: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
              onClick={handleCakeClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={{ y: [0, -16, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                style={{ fontSize: '9.2rem', filter: 'drop-shadow(0 25px 35px rgba(0,0,0,0.45))' }}
              >
                🎂
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ 
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.8) 100%)', 
                  padding: '10px 24px', 
                  borderRadius: '30px', 
                  boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
                  marginTop: '15px',
                  border: '1.5px solid rgba(255,77,109,0.3)',
                }}
              >
                <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '1.9rem', color: 'var(--primary)', margin: 0 }}>
                  {unlockedCount < mediaFiles.length ? `Mở kỷ niệm (${unlockedCount}/${mediaFiles.length})` : 'Tất cả kỷ niệm đã mở!'}
                </h2>
              </motion.div>
            </motion.div>
          </>
        )}

        {/* ── CINEMATIC AUTOPLAY SLIDESHOW MODE (Ken Burns effect) ── */}
        {slideshowMode && (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', width: '100%', maxWidth: '850px', zIndex: 10
          }}>
            <div style={{ position: 'relative', width: '380px', height: '480px' }}>
              <AnimatePresence mode="wait">
                {mediaFiles.map((media, index) => {
                  if (index !== slideshowIndex) return null;
                  const isVideo = media.endsWith('.mp4');
                  const tapeColor = WashiTapeColors[index % WashiTapeColors.length];
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.88, rotate: -6, y: 20 }}
                      animate={{ opacity: 1, scale: 1.05, rotate: index % 2 === 0 ? 3 : -3, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, rotate: index % 2 === 0 ? -10 : 10, y: -40, filter: 'blur(8px)' }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                      style={{
                        position: 'absolute', inset: 0,
                        padding: '16px 16px 65px 16px',
                        background: '#fff',
                        borderRadius: '6px',
                        boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', overflow: 'hidden',
                        border: '2px solid rgba(255,255,255,0.85)',
                      }}
                    >
                      {/* Decorative Washi Tape overlay */}
                      <div style={{
                        position: 'absolute', top: '-10px', width: '90px', height: '26px',
                        background: tapeColor, zIndex: 30, borderRadius: '2px'
                      }} />

                      {/* Ken burns image zoom container */}
                      <div style={{ width: '100%', height: '370px', overflow: 'hidden', background: '#000', borderRadius: '2px' }}>
                        {isVideo ? (
                          <video
                            src={media}
                            autoPlay
                            muted
                            loop
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover',
                            }}
                          />
                        ) : (
                          <motion.img
                            src={media}
                            alt="Ken Burns memory"
                            initial={{ scale: 1.0 }}
                            animate={{ scale: 1.25, x: [0, 8, -8, 0], y: [0, -6, 6, 0] }}
                            transition={{ duration: 4.2, ease: 'linear' }}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>

                      {/* Big Cursive Caption text */}
                      <div style={{
                        position: 'absolute', bottom: '12px', left: 10, right: 10,
                        fontFamily: 'var(--font-handwriting)', fontSize: '2.1rem',
                        color: '#3d2b1f', textAlign: 'center', fontWeight: 'bold'
                      }}>
                        {CAPTIONS[index]}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Slide dot indicator bar */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '3.2rem', justifyContent: 'center' }}>
              {mediaFiles.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setSlideshowIndex(i)}
                  style={{
                    width: i === slideshowIndex ? '18px' : '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: i === slideshowIndex ? 'var(--primary)' : 'rgba(255,255,255,0.25)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: i === slideshowIndex ? '0 0 10px var(--primary)' : 'none',
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── POLAROID FULLSCREEN PREVIEW MODAL ── */}
      <AnimatePresence>
        {selectedId !== null && !slideshowMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(5, 2, 10, 0.92)',
              zIndex: 150,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'zoom-out'
            }}
          >
            <motion.div
              layoutId={`media-${selectedId}`}
              style={{
                width: 'auto',
                height: 'auto',
                maxWidth: '90vw',
                maxHeight: '85vh',
                padding: '16px 16px 80px 16px',
                background: '#fff',
                borderRadius: '8px',
                position: 'relative',
                boxShadow: '0 35px 80px rgba(0,0,0,0.85)',
                cursor: 'default',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedId(null)}
                style={{
                  position: 'absolute', top: '-18px', right: '-18px',
                  background: '#fff', border: 'none', borderRadius: '50%',
                  width: '38px', height: '38px', cursor: 'pointer', zIndex: 160,
                  boxShadow: '0 5px 15px rgba(0,0,0,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={20} color="#111" />
              </button>
              
              {mediaFiles[selectedId].endsWith('.mp4') ? (
                <video
                  src={mediaFiles[selectedId]}
                  autoPlay
                  controls
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(85vh - 90px)',
                    objectFit: 'contain',
                    borderRadius: '2px',
                  }}
                />
              ) : (
                <img
                  src={mediaFiles[selectedId]}
                  alt="Zoomed memory"
                  style={{
                    maxWidth: '100%',
                    maxHeight: 'calc(85vh - 90px)',
                    objectFit: 'contain',
                    borderRadius: '2px',
                  }}
                />
              )}
              
              {/* Gold footer note */}
              <div style={{
                position: 'absolute', bottom: '15px', left: 0, right: 0,
                textAlign: 'center', fontFamily: 'var(--font-handwriting)',
                fontSize: '2.5rem', color: '#2d1b0f', fontWeight: 'bold'
              }}>
                {CAPTIONS[selectedId]} 💕
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoGallery;
