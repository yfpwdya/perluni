import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-surface-glass border border-surface-border rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-between p-12 w-1/2 bg-gradient-to-br from-primary-900/40 to-secondary-900/40 relative overflow-hidden">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl text-white relative z-10 w-fit">
            <span className="text-3xl text-primary-400">🏢</span>
            <span className="bg-gradient-to-br from-primary-400 to-secondary-500 bg-clip-text text-transparent">Perluni</span>
          </Link>

          <div className="relative z-10 mt-auto mb-12">
            <h1 className="text-4xl font-bold mb-4 leading-tight">
              Selamat Datang <span className="gradient-text">Kembali</span>
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Masuk ke akun Anda untuk mengakses dashboard dan fitur eksklusif Perluni.
            </p>
          </div>

          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-64 h-64 bg-primary-500/20 rounded-full blur-3xl top-[-20%] right-[-20%] animate-pulse"></div>
            <div className="absolute w-64 h-64 bg-secondary-500/20 rounded-full blur-3xl bottom-[-20%] left-[-20%] animate-pulse animation-delay-2000"></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-background-card/50 backdrop-blur-md flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8 text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Login</h2>
              <p className="text-gray-400">Masukkan kredensial Anda untuk melanjutkan</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-300">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="input pl-12"
                    placeholder="Masukkan email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="input pl-12 pr-12"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3.5 shadow-lg shadow-primary-500/20"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    <>
                      Login
                      <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>

            Belum punya akun? <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Daftar di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
