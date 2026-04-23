import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

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
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      <div className="hidden lg:flex bg-brand-gradient text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <img src="/logo cina.avif" alt="Perluni" className="w-12 h-12 rounded-xl ring-2 ring-white/40" />
          <div>
            <p className="text-xl font-semibold">Perluni Tiongkok</p>
            <p className="text-sm text-white/80">Sistem Informasi Organisasi</p>
          </div>
        </div>

        <div className="relative max-w-md mx-auto w-full">
          <div className="rounded-2xl bg-white/10 backdrop-blur-sm p-3 shadow-[0_24px_50px_rgba(2,6,23,0.45)] border border-white/30">
            <img
              src="/foto%20cina.avif"
              alt="Kebersamaan anggota Perluni"
              className="w-full max-h-[320px] object-contain object-center rounded-xl opacity-80"
            />
          </div>
        </div>

        <div className="relative">
          <h1 className="text-4xl font-semibold text-white leading-tight">Selamat Datang Kembali</h1>
          <p className="mt-3 text-white/90 max-w-md">
            Masuk untuk mengakses data anggota dan fitur internal organisasi Perluni.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10 flex items-center justify-center">
        <div className="w-full max-w-md card p-6 md:p-8 border-brand-100/70">
          <div className="mb-6">
            <span className="chip">Akses Internal</span>
            <h2 className="text-2xl font-semibold mt-3">Login Akun</h2>
            <p className="text-sm text-slate-500 mt-1">Masuk ke akun Anda untuk melanjutkan.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-base pl-10"
                placeholder="Email"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-base pl-10 pr-10"
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-1">
              {loading ? 'Memproses...' : 'Login'} {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-5">
            Belum punya akun?{' '}
            <Link to="/register" className="font-medium text-brand-700 hover:text-brand-800">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
