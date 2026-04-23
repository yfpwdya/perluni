import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
} from 'react-icons/fi';
import { authAPI } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="card max-w-md w-full p-8 text-center">
          <FiCheckCircle className="text-5xl text-green-600 mx-auto" />
          <h2 className="text-2xl font-semibold mt-4">Registrasi Berhasil</h2>
          <p className="text-sm text-slate-600 mt-2">Silakan cek email untuk verifikasi akun.</p>
          <p className="text-xs text-slate-500 mt-1">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-100">
      <div className="hidden lg:flex bg-slate-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-600/25 blur-3xl" />

        <div className="relative">
          <img src="/logo cina.avif" alt="Perluni" className="w-12 h-12 rounded-xl ring-2 ring-white/35" />
          <h2 className="text-3xl font-semibold mt-5">Bergabung dengan Portal Perluni</h2>
          <p className="text-sm text-slate-300 mt-3 max-w-md">
            Registrasi akun untuk mengakses layanan internal organisasi dan informasi anggota.
          </p>
        </div>

        <div className="relative rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm">
          <p className="text-sm text-slate-200">
            Akun baru akan melalui verifikasi email sebelum aktif sepenuhnya.
          </p>
        </div>
      </div>

      <div className="p-6 md:p-10 flex items-center justify-center">
        <div className="card w-full max-w-lg p-6 md:p-8 border-brand-100/70">
          <span className="chip">Registrasi</span>
          <h1 className="text-2xl font-semibold mt-3">Buat Akun Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar untuk mengakses portal organisasi.</p>

          {error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 mt-5">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-base pl-10"
                placeholder="Nama lengkap"
                required
              />
            </div>

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
                placeholder="Password (min. 6 karakter)"
                minLength={6}
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

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-base pl-10"
                placeholder="Konfirmasi password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2">
              {loading ? 'Memproses...' : 'Daftar'} {!loading && <FiArrowRight />}
            </button>
          </form>

          <p className="text-sm text-slate-600 mt-5">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-brand-700 hover:text-brand-800">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
