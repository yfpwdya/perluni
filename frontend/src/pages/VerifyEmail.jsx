import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        const verify = async () => {
            try {
                await authAPI.verifyEmail(token);
                setStatus('success');
                setMessage('Email berhasil diverifikasi! Anda akan dialihkan ke halaman utama...');

                // Redirect to homepage after 3 seconds
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verifikasi gagal. Link mungkin sudah kedaluwarsa atau tidak valid.');
            }
        };

        if (token) {
            verify();
        } else {
            setStatus('error');
            setMessage('Token verifikasi tidak ditemukan.');
        }
    }, [token, navigate]);

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
                        <div className="flex gap-4 w-full">
                            <Link to="/login" className="btn btn-outline flex-1 py-3 text-center">
                                Login
                            </Link>
                            <Link to="/" className="btn btn-primary flex-1 py-3 text-center">
                                Ke Beranda
                            </Link>
                        </div>
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
