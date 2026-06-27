import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi';
import { authAPI } from '../services/api';
import { motion } from 'framer-motion';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan.');
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage('Email berhasil diverifikasi. Anda akan diarahkan ke beranda.');
        setTimeout(() => navigate('/'), 2500);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verifikasi gagal. Token mungkin tidak valid.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-1/4 w-[500px] h-[500px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-brand-300/20 bg-slate-900 p-8 text-center max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative z-10 overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-300/10 blur-3xl" />

        {status === 'loading' && (
          <>
            <FiLoader className="text-5xl text-brand-300 animate-spin mx-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-white mt-6">Memverifikasi Email</h1>
            <p className="text-sm text-slate-400 mt-2">Mohon tunggu sebentar...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FiCheckCircle className="text-5xl text-brand-300 mx-auto animate-bounce" />
            <h1 className="text-2xl font-bold tracking-tight text-white mt-6">Verifikasi Berhasil</h1>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed">{message}</p>
            <div className="mt-8 flex gap-3 justify-center">
              <Link to="/login" className="py-2.5 px-5 rounded-xl border border-brand-300/30 text-brand-300 font-medium hover:bg-brand-500/10 hover:scale-[1.02] transition-all text-sm">
                Login
              </Link>
              <Link to="/" className="py-2.5 px-5 rounded-xl bg-brand-gradient text-white font-medium hover:scale-[1.02] transition-all shadow-glow text-sm">
                Beranda
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle className="text-5xl text-red-500 mx-auto" />
            <h1 className="text-2xl font-bold tracking-tight text-white mt-6">Verifikasi Gagal</h1>
            <p className="text-sm text-slate-400 mt-3 leading-relaxed">{message}</p>
            <div className="mt-8 flex gap-3 justify-center">
              <Link to="/register" className="py-2.5 px-5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 hover:scale-[1.02] transition-all text-sm">
                Daftar Ulang
              </Link>
              <Link to="/" className="py-2.5 px-5 rounded-xl bg-brand-gradient text-white font-medium hover:scale-[1.02] transition-all shadow-glow text-sm">
                Beranda
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
