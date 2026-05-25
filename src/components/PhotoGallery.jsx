import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play } from 'lucide-react';
import confetti from 'canvas-confetti';

const mediaFiles = [
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

const positions = mediaFiles.map(() => {
  return {
    rotate: (Math.random() * 40 - 20) + 'deg',
    x: (Math.random() * 70 - 35) + 'vw',
    y: (Math.random() * 70 - 35) + 'vh'
  };
});

const PhotoGallery = ({ onClose }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [unlockedCount, setUnlockedCount] = useState(0);

  const handleCakeClick = () => {
    if (unlockedCount < mediaFiles.length) {
      setUnlockedCount(prev => prev + 1);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ffb3c1', '#ffffff']
      });
    } else {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 },
      });
    }
  };

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
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Render unlocked photos */}
        {mediaFiles.slice(0, unlockedCount).map((media, index) => {
          const isVideo = media.endsWith('.mp4');
          return (
            <motion.div
              key={index}
              layoutId={`media-${index}`}
              drag={!selectedId}
              dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
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
                damping: 15, 
                stiffness: 100
              }}
              whileHover={{ scale: 1.1, zIndex: 20 }}
              whileDrag={{ scale: 1.15, zIndex: 30, cursor: 'grabbing' }}
              onClick={() => setSelectedId(index)}
              style={{
                position: 'absolute',
                padding: '10px 10px 40px 10px',
                background: '#fff',
                borderRadius: '4px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                cursor: 'grab',
                width: '180px',
                height: '220px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                overflow: 'hidden',
                zIndex: index
              }}
            >
              {isVideo ? (
                <div style={{ width: '100%', height: '100%', background: '#000', display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
                  <Play color="#fff" size={48} style={{ position: 'absolute', opacity: 0.8 }} />
                  <video src={media} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }} />
                </div>
              ) : (
                <img src={media} alt={`Memory ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} pointerEvents="none" />
              )}
              <div style={{ position: 'absolute', bottom: '8px', fontFamily: 'var(--font-cursive)', fontSize: '1.2rem', color: '#555' }}>
                ❤️
              </div>
            </motion.div>
          );
        })}

        {/* The Giant Cake Spawner */}
        <motion.div 
          style={{ zIndex: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
          onClick={handleCakeClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '10rem', filter: 'drop-shadow(0 20px 30px rgba(0,0,0,0.3))' }}
          >
            🎂
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              background: 'rgba(255,255,255,0.8)', 
              padding: '10px 20px', 
              borderRadius: '30px', 
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              marginTop: '20px'
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '2rem', color: 'var(--primary)', margin: 0 }}>
              {unlockedCount < mediaFiles.length ? 'Nhấn để thổi nến nhé!' : 'Chúc em sinh nhật vui vẻ!'}
            </h2>
          </motion.div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedId !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedId(null)}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 100,
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
                padding: '15px 15px 60px 15px',
                background: '#fff',
                borderRadius: '8px',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedId(null)}
                style={{ position: 'absolute', top: '-20px', right: '-20px', background: '#fff', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 110, boxShadow: '0 4px 10px rgba(0,0,0,0.3)' }}
              >
                <X size={24} />
              </button>
              
              {mediaFiles[selectedId].endsWith('.mp4') ? (
                <video src={mediaFiles[selectedId]} autoPlay controls style={{ maxWidth: '100%', maxHeight: 'calc(85vh - 75px)', objectFit: 'contain' }} />
              ) : (
                <img src={mediaFiles[selectedId]} alt="Zoomed memory" style={{ maxWidth: '100%', maxHeight: 'calc(85vh - 75px)', objectFit: 'contain' }} />
              )}
              
              <div style={{ position: 'absolute', bottom: '15px', left: 0, right: 0, textAlign: 'center', fontFamily: 'var(--font-cursive)', fontSize: '2rem', color: '#333' }}>
                Mãi yêu em 💕
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PhotoGallery;
