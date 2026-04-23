import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle, FiLoader, FiXCircle } from 'react-icons/fi';
import { authAPI } from '../services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Token verifikasi tidak ditemukan.');
        return;
      }

      try {
        await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage('Email berhasil diverifikasi. Anda akan diarahkan ke beranda.');
        setTimeout(() => navigate('/'), 2500);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verifikasi gagal. Token mungkin tidak valid.');
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="card max-w-md w-full p-7 text-center">
        {status === 'loading' && (
          <>
            <FiLoader className="text-5xl text-brand-600 animate-spin mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Memverifikasi Email</h1>
            <p className="text-sm text-slate-600 mt-2">Mohon tunggu sebentar...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <FiCheckCircle className="text-5xl text-green-600 mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Verifikasi Berhasil</h1>
            <p className="text-sm text-slate-600 mt-2">{message}</p>
            <div className="mt-5 flex gap-2 justify-center">
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/" className="btn btn-primary">Beranda</Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <FiXCircle className="text-5xl text-red-600 mx-auto" />
            <h1 className="text-xl font-semibold mt-4">Verifikasi Gagal</h1>
            <p className="text-sm text-slate-600 mt-2">{message}</p>
            <div className="mt-5 flex gap-2 justify-center">
              <Link to="/register" className="btn btn-secondary">Daftar Ulang</Link>
              <Link to="/" className="btn btn-primary">Beranda</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
