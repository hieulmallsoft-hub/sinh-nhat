import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MiniGame = ({ onWin }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Normalize string for checking
    const cleanName = name.trim().toLowerCase().replace(/\s+/g, ' ');
    const cleanDob = dob.trim().replace(/\s+/g, '');

    if (!cleanName || !cleanDob) {
      setError("Em phải nhập đầy đủ thông tin nha!");
      return;
    }

    if (cleanName !== 'lê minh hiếu' && cleanName !== 'le minh hieu') {
      setError("Sai tên người yêu rồi kìa! Khai mau, đang nghĩ tới ai? 😡");
      return;
    }

    if (cleanDob !== '24/04/2003' && cleanDob !== '24-04-2003' && cleanDob !== '24/4/2003') {
      setError("Chết dở, không nhớ sinh nhật anh yêu à? Gợi ý: 24/04/2003 nhaaa 🥲");
      return;
    }

    setError('');
    onWin();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
      className="glass"
      style={{
        padding: '3rem',
        textAlign: 'center',
        zIndex: 10,
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(255, 77, 109, 0.3), inset 0 0 0 2px rgba(255,255,255,0.5)',
        position: 'relative',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '3.5rem', color: 'var(--primary)', marginBottom: '1rem' }}>
            Khoan đã! 🛑
          </h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--text-main)', lineHeight: '1.6' }}>
            Hệ thống an ninh phát hiện người lạ đang cố mở quà.<br/>
            Cần phải xác thực danh tính để vào trong! 🕵️‍♀️
          </p>
          <button className="btn-primary" onClick={() => setStep(2)} style={{ padding: '16px 30px', fontSize: '1.2rem' }}>
            Bắt đầu xác thực 🔐
          </button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ width: '100%' }}>
          <h2 style={{ fontFamily: 'var(--font-cursive)', fontSize: '2.5rem', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.4' }}>
            Thử thách trí nhớ! 🧠
          </h2>
          <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
            Hãy điền chính xác họ tên và ngày sinh của người đẹp trai nhất hệ mặt trời, người yêu em nhất trần đời!
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <input 
                type="text" 
                placeholder="Họ và tên anh yêu (VD: Nguyễn Văn A)" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '15px',
                  border: '2px solid var(--primary-light)',
                  fontSize: '1.1rem',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.8)'
                }}
              />
            </div>
            
            <div>
              <input 
                type="text" 
                placeholder="Ngày sinh (VD: 01/01/2000)" 
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 20px',
                  borderRadius: '15px',
                  border: '2px solid var(--primary-light)',
                  fontSize: '1.1rem',
                  outline: 'none',
                  background: 'rgba(255,255,255,0.8)'
                }}
              />
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ color: '#d00000', fontWeight: 'bold', margin: '5px 0' }}
              >
                {error}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary"
              style={{
                marginTop: '10px',
                fontSize: '1.2rem',
                padding: '15px',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ff4d6d, #c9184a)'
              }}
            >
              Xác nhận mở quà! 🎁
            </motion.button>
          </form>

        </motion.div>
      )}
    </motion.div>
  );
};

export default MiniGame;
