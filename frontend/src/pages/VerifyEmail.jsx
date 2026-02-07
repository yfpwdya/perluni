import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`, {
                    method: 'POST'
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email berhasil diverifikasi! Anda sekarang dapat login.');
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verifikasi gagal. Link mungkin sudah kedaluwarsa atau tidak valid.');
                }
            } catch (error) {
                setStatus('error');
                setMessage('Terjadi kesalahan koneksi. Silakan coba lagi.');
            }
        };

        if (token) {
            verify();
        } else {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan.');
        }
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-surface-light">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-fade-in">
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-6"></div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Memverifikasi Email...</h2>
                        <p className="text-gray-500">Mohon tunggu sebentar.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                            <FiCheckCircle className="text-4xl text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Berhasil!</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Link to="/login" className="btn btn-primary w-full py-3 inline-block">
                            Masuk ke Akun
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <FiXCircle className="text-4xl text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifikasi Gagal</h2>
                        <p className="text-gray-600 mb-8">{message}</p>
                        <Link to="/register" className="text-primary-500 font-medium hover:underline">
                            Daftar Ulang
                        </Link>
                        <span className="mx-2 text-gray-400">|</span>
                        <Link to="/" className="text-primary-500 font-medium hover:underline">
                            Ke Beranda
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
