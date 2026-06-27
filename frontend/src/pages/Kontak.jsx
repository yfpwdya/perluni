import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { FiMapPin, FiBookOpen, FiSend, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DOMPurify from 'dompurify';
import { contactAPI } from '../services/api';
import { motion } from 'framer-motion';

const Kontak = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.message.trim() || formData.message.trim().length < 5) {
      setNotification({ type: 'error', text: 'Subjek dan Pesan wajib diisi (minimal 5 karakter).' });
      return;
    }

    setLoading(true);
    setNotification({ type: '', text: '' });

    try {
      const sanitizedSubject = DOMPurify.sanitize(formData.subject.trim());
      const sanitizedMessage = DOMPurify.sanitize(formData.message.trim());

      await contactAPI.send({
        name: user.name,
        email: user.email,
        subject: sanitizedSubject,
        message: sanitizedMessage
      });

      setNotification({ type: 'success', text: 'Pesan berhasil terkirim. Terima kasih!' });
      setFormData({ subject: '', message: '' });
    } catch (error) {
      setNotification({ 
        type: 'error', 
        text: error.response?.data?.message || 'Gagal mengirim pesan. Silakan coba lagi nanti.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden pb-12">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />

      <section className="mt-10 relative z-10">
        <div className="container-app">
          {/* Sekretariat Card */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#1c1c1c]/60 backdrop-blur-lg border border-brand-300/20 text-white p-6 md:p-8 grid gap-6 md:grid-cols-2 relative overflow-hidden max-w-4xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-glow transition-shadow"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />
            <div className="relative z-10">
              <p className="text-xs uppercase tracking-widest font-semibold text-brand-300">Sekretariat Organisasi</p>
              <h2 className="text-3xl font-bold tracking-tight mt-2 text-white">Perluni Tiongkok</h2>
              <p className="text-sm text-[#d4d4d4] mt-3 leading-relaxed">
                Untuk pembaruan data anggota atau kebutuhan organisasi spesifik lainnya, silakan hubungi kanal resmi atau kirim pesan di bawah ini.
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-200 relative z-10 flex flex-col justify-center">
              <div className="flex items-center gap-3 bg-[#1c1c1c]/50 p-3 rounded-xl border border-[#2c2c2c]/50">
                <div className="w-10 h-10 rounded-lg bg-brand-300/10 border border-brand-300/20 flex items-center justify-center shrink-0">
                  <FiMapPin className="text-brand-300 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-[#a0a0a0]">Lokasi</p>
                  <p className="font-medium text-slate-200">Beijing, Tiongkok</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#1c1c1c]/50 p-3 rounded-xl border border-[#2c2c2c]/50">
                <div className="w-10 h-10 rounded-lg bg-brand-300/10 border border-brand-300/20 flex items-center justify-center shrink-0">
                  <FiBookOpen className="text-brand-300 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-[#a0a0a0]">Email Resmi</p>
                  <p className="font-medium text-slate-200">contact@perluni.org</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 max-w-2xl mx-auto rounded-3xl bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px bg-brand-gradient flex-1 opacity-50" />
              <span className="text-xs uppercase tracking-widest text-brand-300 font-semibold flex items-center gap-2"><FiSend /> Kirim Pesan Langsung</span>
              <div className="h-px bg-brand-gradient flex-1 opacity-50" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {notification.text && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-xl text-sm flex items-start gap-3 ${
                    notification.type === 'success' 
                      ? 'bg-green-500/10 text-green-200 border border-green-500/30' 
                      : 'bg-red-500/10 text-red-200 border border-red-500/30'
                  }`}
                >
                  {notification.type === 'success' ? <FiCheckCircle className="shrink-0 mt-0.5" /> : <FiInfo className="shrink-0 mt-0.5" />}
                  <span className="leading-relaxed">{notification.text}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Nama Pengirim</label>
                  <input type="text" value={user?.name || ''} className="w-full bg-[#1c1c1c]/30 border border-[#2c2c2c]/50 text-[#a0a0a0] text-sm rounded-xl px-4 py-3 cursor-not-allowed" disabled />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Email</label>
                  <input type="email" value={user?.email || ''} className="w-full bg-[#1c1c1c]/30 border border-[#2c2c2c]/50 text-[#a0a0a0] text-sm rounded-xl px-4 py-3 cursor-not-allowed" disabled />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Subjek Pesan</label>
                <input 
                  type="text" 
                  name="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                  placeholder="Contoh: Info Kemitraan" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Pesan</label>
                <textarea 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373] min-h-[140px] resize-y" 
                  placeholder="Tulis pesan lengkap Anda di sini..." 
                  required 
                ></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl bg-brand-gradient text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-glow disabled:opacity-70 disabled:hover:scale-100 mt-2">
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSend /> Kirim Pesan</>}
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Kontak;
