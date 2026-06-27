import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#101010] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />

      {/* Left panel */}
      <div className="hidden lg:flex bg-[#0a0a0a] text-white p-12 flex-col justify-between border-r border-brand-300/10 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-brand-300/10 blur-[100px]" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-300/5 blur-[100px]" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img src="/logo-cinanew.png" alt="Perluni" className="w-12 h-12 rounded-xl ring-2 ring-brand-300/30 object-cover" />
          <div>
            <p className="text-xl font-bold tracking-wide">Perluni Tiongkok</p>
            <p className="text-xs text-brand-300 font-medium uppercase tracking-widest">Sistem Informasi Organisasi</p>
          </div>
        </div>

        {/* Photo section */}
        <div className="relative w-full flex flex-col items-center">

          <div className="relative w-full">
            <div className="absolute inset-x-0 bottom-0 h-40 bg-brand-300/10 blur-[60px] rounded-full" />
            <img
              src="foto-cinanew.png"
              alt="Kebersamaan anggota Perluni"
              className="relative w-full max-h-[420px] object-contain drop-shadow-[0_20px_40px_rgba(201,168,76,0.2)]"
            />
          </div>

          <div className="mt-4 w-full grid grid-cols-3 gap-2">
            {[['100+', 'Anggota'], ['10+', 'Universitas'], ['5+', 'Kota']].map(([val, label]) => (
              <div key={label} className="rounded-xl bg-brand-300/5 border border-brand-300/10 py-2.5 text-center">
                <p className="text-sm font-bold text-brand-300">{val}</p>
                <p className="text-[10px] text-[#a0a0a0] mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">Selamat Datang Kembali</h1>
          <p className="mt-3 text-[#a0a0a0] text-sm leading-relaxed max-w-md">
            Masuk untuk mengakses data anggota dan fitur internal organisasi Perluni Tiongkok secara aman.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="p-6 md:p-10 flex items-center justify-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-300/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />

          <div className="mb-6 relative z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-300/10 border border-brand-300/20 px-3 py-1 text-xs font-semibold text-brand-300">
              Akses Internal
            </span>
            <h2 className="text-2xl font-bold text-white mt-3 tracking-tight">Login Akun</h2>
            <p className="text-xs text-[#a0a0a0] mt-1">Masuk ke akun Anda untuk melanjutkan ke portal.</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                placeholder="Alamat Email"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                placeholder="Kata Sandi"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-white transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-brand-gradient text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-glow disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Masuk <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-[#a0a0a0] mt-6 text-center relative z-10">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-brand-300 hover:text-brand-400 transition-colors">
              Daftar di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;