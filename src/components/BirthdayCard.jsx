import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Gift } from 'lucide-react';

const BirthdayCard = ({ onOpenGift }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      style={{
        width: '90%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(15px)',
        borderRadius: '30px',
        boxShadow: '0 20px 40px rgba(255, 77, 109, 0.15), inset 0 0 0 2px rgba(255, 255, 255, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.8)'
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        style={{ marginBottom: '1rem' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', color: 'var(--primary)' }}>
          <Sparkles size={28} />
          <Heart size={32} fill="var(--primary)" />
          <Sparkles size={28} />
        </div>
      </motion.div>

      <h1 style={{ 
        fontFamily: 'var(--font-cursive)', 
        fontSize: '3.5rem', 
        color: 'var(--primary)',
        margin: '10px 0',
        textShadow: '2px 2px 4px rgba(0,0,0,0.05)'
      }}>
        Happy Birthday!
      </h1>
      <h2 style={{ 
        fontFamily: 'var(--font-cursive)', 
        fontSize: '2rem', 
        color: 'var(--text-muted)',
        marginBottom: '1.5rem'
      }}>
        Gửi em yêu của anh 💖
      </h2>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.5)',
        padding: '1.5rem',
        borderRadius: '20px',
        marginBottom: '2rem',
        color: 'var(--text-main)',
        fontSize: '1.1rem',
        lineHeight: '1.6'
      }}>
        <p style={{ marginBottom: '1rem' }}>
          Chúc em một ngày sinh nhật thật rực rỡ và tràn ngập niềm vui. Cảm ơn em đã đến và mang lại cho anh những ngày tháng hạnh phúc nhất.
        </p>
        <p>
          Anh yêu em rất nhiều! Hãy luôn xinh đẹp và tươi cười như thế này nhé! 🥰
        </p>
      </div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button 
          className="btn-primary" 
          onClick={onOpenGift}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Gift size={20} />
          Nhận quà của anh nhé
        </button>
      </motion.div>
    </motion.div>
  );
};

export default BirthdayCard;
