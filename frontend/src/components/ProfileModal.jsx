import { useEffect } from 'react';
import { FiX, FiCheckCircle } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

/* ── Komponen satu baris biodata ── */
const BioRow = ({ label, value, accent = false }) => (
  <div className="flex flex-col gap-0.5">
    <p className="text-[10px] uppercase tracking-wider text-[#737373] font-medium">
      {label}
    </p>
    <p
      className={`text-sm font-bold leading-snug ${
        accent ? 'text-brand-300' : 'text-white'
      }`}
    >
      {value || '-'}
    </p>
  </div>
);

/* ── Garis pemisah tipis ── */
const Divider = () => (
  <div className="border-t border-[#2c2c2c]" />
);

const ProfileModal = ({ data, onClose }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  /* Tutup dengan tombol Escape */
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!data) return null;

  const categoryLabel = data.category === 'alumni' ? 'Alumni' : 'Mahasiswa';
  const categoryColor =
    data.category === 'alumni'
      ? 'bg-brand-300/10 text-brand-300 border-brand-300/20'
      : 'bg-green-500/10 text-green-400 border-green-500/20';

  /* Susun label jenjang + prodi */
  const jenjangProdi = [data.education_level, data.major]
    .filter(Boolean)
    .join(' — ');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-2xl bg-[#141414] border border-brand-300/20 rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-40 -right-40 w-72 h-72 rounded-full bg-brand-300/10 blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-brand-300/5 blur-[80px] pointer-events-none" />

        {/* ── Header dengan gradient brand ── */}
        <div className="bg-brand-gradient px-6 py-5 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${categoryColor}`}
                >
                  {categoryLabel}
                </span>
                {data.sheet && (
                  <span className="text-[10px] text-white/50 uppercase tracking-wider">
                    {data.sheet}
                  </span>
                )}
              </div>
              <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white leading-tight">
                Biodata {categoryLabel}
              </h3>
              <p className="text-xs text-white/60 mt-0.5">
                Detail informasi anggota terdaftar
              </p>
            </div>

            {/* Tombol tutup */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 flex items-center justify-center border border-white/10 transition-all hover:scale-105 active:scale-95 shrink-0"
              aria-label="Tutup modal"
            >
              <FiX className="text-white" />
            </button>
          </div>
        </div>

        {/* ── Body: grid 2 kolom ── */}
        <div className="relative z-10 px-6 pt-6 pb-4 space-y-0">

          {/* Baris 1: Nama | Perguruan Tinggi */}
          <div className="grid grid-cols-2 gap-6 pb-4">
            <BioRow label="Nama" value={data.name} />
            <BioRow label="Perguruan Tinggi" value={data.university} accent />
          </div>
          <Divider />

          {/* Baris 2: Jenis Kelamin | Tanggal Masuk */}
          <div className="grid grid-cols-2 gap-6 py-4">
            <BioRow label="Jenis Kelamin" value={data.gender} />
            <BioRow label="Angkatan / Tahun Masuk" value={data.entry_year} />
          </div>
          <Divider />

          {/* Baris 3: NIM / ID | Jenjang – Program Studi */}
          <div className="grid grid-cols-2 gap-6 py-4">
            <BioRow
              label="Asal Daerah"
              value={data.origin}
            />
            <BioRow
              label="Jenjang — Program Studi"
              value={jenjangProdi || data.major}
              accent
            />
          </div>
          <Divider />

          {/* Baris 4: Status Awal | Status Terakhir / Durasi */}
          <div className="grid grid-cols-2 gap-6 py-4">
            <BioRow label="Jenis Beasiswa" value={data.scholarship_type} />
            <BioRow label="Durasi Studi" value={data.duration} />
          </div>

          {/* Afiliasi / Instansi (jika ada) */}
          {data.hospital && (
            <>
              <Divider />
              <div className="py-4">
                <BioRow label="Afiliasi / Instansi" value={data.hospital} accent />
              </div>
            </>
          )}

          {/* Catatan (jika ada) */}
          {data.remarks && (
            <>
              <Divider />
              <div className="py-4">
                <p className="text-[10px] uppercase tracking-wider text-[#737373] font-medium mb-1">
                  Catatan
                </p>
                <p className="text-sm text-[#d4d4d4] leading-relaxed">
                  {data.remarks}
                </p>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-[#222222] flex flex-wrap justify-end gap-3 relative z-10 bg-[#0e0e0e]/50">
          {!isAuthenticated && (
            <button
              type="button"
              onClick={() => {
                navigate('/register', { state: { member: data } });
                onClose();
              }}
              className="py-2.5 px-5 rounded-xl bg-brand-gradient text-white font-semibold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform shadow-glow text-sm"
            >
              <FiCheckCircle />
              Gunakan Data Register
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl border border-[#2c2c2c] text-[#a0a0a0] hover:bg-[#2c2c2c] hover:text-white transition-all text-sm"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;