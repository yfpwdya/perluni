import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { feedbackAPI } from '../services/api';
import { FiMessageSquare, FiSend, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';

const Feedback = () => {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim() || formData.message.trim().length < 5) {
      setError('Subjek dan pesan wajib diisi (minimal 5 karakter).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sanitizedSubject = DOMPurify.sanitize(formData.subject.trim());
      const sanitizedMessage = DOMPurify.sanitize(formData.message.trim());

      await feedbackAPI.create({
        name: user.name,
        email: user.email,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        sourcePage: 'feedback',
      });
      setSuccess(true);
      setFormData({ subject: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim masukan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container-app py-16 flex items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 text-center rounded-3xl bg-[#1c1c1c]/80 backdrop-blur-xl border border-brand-300/30 shadow-[0_0_40px_rgba(201,168,76,0.15)] relative overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-brand-300/10 blur-3xl" />
          <div className="w-20 h-20 rounded-full bg-brand-300/10 border border-brand-300/30 flex items-center justify-center mx-auto mb-5 relative">
            <FiCheckCircle className="text-4xl text-brand-300" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Masukan Terkirim!</h2>
          <p className="text-sm text-[#d4d4d4] mt-3">
            Terima kasih atas feedback yang Anda berikan. Masukan Anda sangat berharga untuk pengembangan Perluni Tiongkok.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="w-full mt-8 py-3 rounded-xl bg-brand-gradient text-white font-medium hover:scale-[1.02] transition-transform shadow-glow"
          >
            Kirim Masukan Lain
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="container-app py-16 relative z-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] items-stretch max-w-6xl mx-auto">
          
          {/* Left side info panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-[#1c1c1c]/60 backdrop-blur-lg border border-[#2c2c2c]/50 p-8 md:p-10 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-brand-500/20 blur-[100px]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-300/10 border border-brand-300/20 px-3 py-1.5 text-xs font-medium text-brand-300">
                <HiOutlineSparkles className="text-sm" /> Portal Internal
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-6 tracking-tight text-white leading-tight">
                Beri Masukan &
                <br />
                <span className="text-transparent bg-clip-text bg-brand-gradient">Feedback Anda</span>
              </h1>
              <p className="text-[#d4d4d4] mt-5 text-sm md:text-base leading-relaxed">
                Kritik, saran, maupun aspirasi Anda sangat berarti untuk membangun Perluni Tiongkok yang lebih solid, transparan, dan kolaboratif.
              </p>
            </div>

            <div className="relative mt-10 rounded-2xl border border-brand-300/20 bg-[#1c1c1c]/50 p-6 backdrop-blur-sm">
              <h3 className="text-sm font-semibold text-brand-300 mb-4 flex items-center gap-2">
                <FiMessageSquare /> Kenapa feedback Anda penting?
              </h3>
              <ul className="space-y-3 text-xs text-[#d4d4d4]">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-300" />
                  <span>Membantu kami mendeteksi bug atau kendala teknis pada sistem portal informasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-300" />
                  <span>Wadah aspirasi anggota untuk pengembangan program kerja organisasi.</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-brand-300" />
                  <span>Menjaga transparansi dan akurasi data keanggotaan lintas universitas.</span>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Right side form panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex flex-col justify-center"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px bg-brand-gradient flex-1 opacity-50" />
                <span className="text-xs uppercase tracking-widest text-brand-300 font-semibold">Formulir</span>
                <div className="h-px bg-brand-gradient flex-1 opacity-50" />
              </div>

              <p className="text-sm text-[#a0a0a0] mb-6 text-center">
                Mengirim sebagai <strong className="text-white">{user?.name}</strong> ({user?.email})
              </p>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 flex items-center gap-2"
                >
                  <FiInfo className="shrink-0" />
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Subjek
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                    placeholder="Contoh: Laporan Bug pada Profil"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Isi Pesan
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373] resize-y"
                    placeholder="Ketik kritik, saran, masukan, atau kendala Anda di sini..."
                    required
                  />
                  <div className="flex justify-end mt-2">
                    <span className={`text-[10px] ${formData.message.length < 5 ? 'text-brand-300/70' : 'text-[#737373]'}`}>
                      {formData.message.length} karakter
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-brand-gradient text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-glow disabled:opacity-70 disabled:hover:scale-100 mt-4"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <FiSend /> Kirim Feedback
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
