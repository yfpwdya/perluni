import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiLock, FiBookOpen, FiMapPin, FiSave, FiCheckCircle, FiInfo } from 'react-icons/fi';
import { motion } from 'framer-motion';

const ProfilSaya = () => {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    origin: '',
    university: '',
    major: '',
    educationLevel: '',
    entryYear: '',
    duration: '',
    scholarshipType: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isAuthenticated && user) {
      const fetchProfile = async () => {
        try {
          const res = await authAPI.getMe();
          const u = res.data?.data?.user;
          if (u) {
            setFormData({
              name: u.name || '',
              gender: u.gender || '',
              origin: u.origin || '',
              university: u.university || '',
              major: u.major || '',
              educationLevel: u.educationLevel || '',
              entryYear: u.entryYear || '',
              duration: u.duration || '',
              scholarshipType: u.scholarshipType || '',
            });
          }
        } catch (error) {
          console.error("Failed to load profile details", error);
        }
      };
      fetchProfile();
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await authAPI.updateProfile(formData);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui.' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Terjadi kesalahan saat memperbarui profil.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    try {
      await authAPI.changePassword(passwordData);
      setPasswordMessage({ type: 'success', text: 'Password berhasil diubah.' });
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      setPasswordMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Terjadi kesalahan saat mengubah password.' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#101010] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#d4d4d4]">Silakan login terlebih dahulu</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden pb-16">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-1/4 w-[500px] h-[500px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-app py-10 relative z-10 max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-white">Profil Saya</h1>
          <p className="text-sm text-[#a0a0a0] mt-1">Kelola informasi pribadi dan keamanan akun Anda.</p>
        </motion.div>

        {/* Informasi Pribadi */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />
          <h2 className="text-xl font-semibold border-b border-brand-300/10 pb-3 mb-6 text-white">Informasi Pribadi</h2>
          
          {message.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm flex items-start gap-3 mb-6 ${
                message.type === 'success' 
                  ? 'bg-green-500/10 text-green-200 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-200 border border-red-500/30'
              }`}
            >
              {message.type === 'success' ? <FiCheckCircle className="shrink-0 mt-0.5" /> : <FiInfo className="shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{message.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Nama Lengkap</label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Email (Tidak bisa diubah)</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]" />
                  <input 
                    type="email" 
                    value={user?.email || ''} 
                    className="w-full bg-[#1c1c1c]/20 border border-[#2c2c2c] text-[#737373] text-sm rounded-xl pl-11 pr-4 py-3 cursor-not-allowed" 
                    disabled 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Jenis Kelamin</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all"
                >
                  <option value="" className="bg-[#1c1c1c] text-[#a0a0a0]">Pilih Jenis Kelamin</option>
                  <option value="Laki-laki" className="bg-[#1c1c1c] text-white">Laki-laki</option>
                  <option value="Perempuan" className="bg-[#1c1c1c] text-white">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Asal Daerah (Indonesia)</label>
                <div className="relative">
                  <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                  <input 
                    type="text" 
                    name="origin" 
                    value={formData.origin} 
                    onChange={handleChange} 
                    className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                    placeholder="Contoh: Jakarta" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Universitas di Tiongkok</label>
                <div className="relative">
                  <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                  <input 
                    type="text" 
                    name="university" 
                    value={formData.university} 
                    onChange={handleChange} 
                    className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                    placeholder="Nama Universitas" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Jurusan / Program Studi</label>
                <input 
                  type="text" 
                  name="major" 
                  value={formData.major} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                  placeholder="Contoh: Kedokteran Klinis" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Jenjang Pendidikan</label>
                <select 
                  name="educationLevel" 
                  value={formData.educationLevel} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all"
                >
                  <option value="" className="bg-[#1c1c1c] text-[#a0a0a0]">Pilih Jenjang</option>
                  <option value="S1" className="bg-[#1c1c1c] text-white">S1 / Bachelor</option>
                  <option value="S2" className="bg-[#1c1c1c] text-white">S2 / Master</option>
                  <option value="S3" className="bg-[#1c1c1c] text-white">S3 / PhD</option>
                  <option value="Non-Degree" className="bg-[#1c1c1c] text-white">Non-Degree / Bahasa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Tahun Masuk (Angkatan)</label>
                <input 
                  type="number" 
                  name="entryYear" 
                  value={formData.entryYear} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                  placeholder="Contoh: 2021" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Durasi Studi</label>
                <input 
                  type="text" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                  placeholder="Contoh: 4 Tahun" 
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Jenis Beasiswa</label>
                <input 
                  type="text" 
                  name="scholarshipType" 
                  value={formData.scholarshipType} 
                  onChange={handleChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]" 
                  placeholder="Contoh: CGS / Mandiri" 
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="submit" 
                disabled={loading} 
                className="py-3 px-6 rounded-xl bg-brand-gradient text-white font-medium flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-glow disabled:opacity-75"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave /> Simpan Perubahan</>}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Ubah Password */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
        >
          <h2 className="text-xl font-semibold border-b border-brand-300/10 pb-3 mb-6 text-white">Ubah Password</h2>
          
          {passwordMessage.text && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm flex items-start gap-3 mb-6 ${
                passwordMessage.type === 'success' 
                  ? 'bg-green-500/10 text-green-200 border border-green-500/30' 
                  : 'bg-red-500/10 text-red-200 border border-red-500/30'
              }`}
            >
              {passwordMessage.type === 'success' ? <FiCheckCircle className="shrink-0 mt-0.5" /> : <FiInfo className="shrink-0 mt-0.5" />}
              <span className="leading-relaxed">{passwordMessage.text}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-md">
            <div>
              <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Password Lama</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">Password Baru</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300" />
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all" 
                  required 
                  minLength="8" 
                />
              </div>
              <p className="text-[10px] text-[#737373] mt-2 leading-relaxed">Minimal 8 karakter, mengandung huruf besar, huruf kecil, dan angka.</p>
            </div>

            <div className="mt-6">
              <button 
                type="submit" 
                disabled={passwordLoading} 
                className="py-3 px-6 rounded-xl border border-brand-300/30 text-brand-300 font-medium hover:bg-brand-500/10 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
              >
                {passwordLoading ? 'Memproses...' : 'Ubah Password'}
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default ProfilSaya;
