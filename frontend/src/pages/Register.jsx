import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiCheckCircle } from 'react-icons/fi';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

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

        if (formData.password !== formData.confirmPassword) {
            setError('Password tidak cocok');
            setLoading(false);
            return;
        }

        try {
            await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            setSuccess(true);

            // Auto redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Terjadi kesalahan saat registrasi');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-surface-light">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiCheckCircle className="text-4xl text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Registrasi Berhasil!</h2>
                    <p className="text-gray-600 mb-8">
                        Silakan cek email Anda untuk melakukan aktivasi akun.
                        <br />
                        <span className="text-sm text-gray-500">(Cek folder Spam jika tidak ada di Inbox)</span>
                    </p>
                    <p className="text-gray-600 mb-8">
                        Mengalihkan ke halaman login...
                    </p>
                    <Link to="/login" className="btn btn-primary w-full py-3 inline-block">
                        Login Sekarang
                    </Link>
                </div>
            </div>
        );
    }

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
                            Bergabung <span className="gradient-text">Bersama Kami</span>
                        </h1>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Daftarkan diri Anda untuk menjadi bagian dari komunitas Perluni Tiongkok.
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
                            <h2 className="text-3xl font-bold mb-2">Daftar Akun</h2>
                            <p className="text-gray-400">Lengkapi data di bawah ini</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-lg text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">Nama Lengkap</label>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        className="input pl-12"
                                        placeholder="Masukkan nama lengkap"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

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
                                        placeholder="Minimal 6 karakter"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        minLength={6}
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

                            <div className="flex flex-col gap-2">
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">Konfirmasi Password</label>
                                <div className="relative">
                                    <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        className="input pl-12"
                                        placeholder="Ulangi password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
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
                                            Daftar Sekarang
                                            <FiArrowRight />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-gray-400 text-sm">
                            Sudah punya akun? <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Login di sini</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
