import { useEffect } from 'react';
import {
  FiBookOpen,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';

const DetailItem = ({ icon, label, value }) => (
  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
    <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">{label}</p>
    <div className="flex items-start gap-2 text-sm text-slate-700">
      <span className="text-brand-600 mt-0.5">{icon}</span>
      <span>{value || '-'}</span>
    </div>
  </div>
);

const ProfileModal = ({ data, onClose }) => {
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [onClose]);

  if (!data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-brand-gradient px-6 py-5 text-white flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-white/80">Detail Anggota</p>
            <h3 className="text-xl font-semibold mt-1">{data.name}</h3>
            <p className="text-sm text-white/90 mt-1">{data.sheet || 'Database Organisasi'}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="p-6 grid gap-4 sm:grid-cols-2">
          <DetailItem icon={<FiUser />} label="Jenis Kelamin" value={data.gender} />
          <DetailItem icon={<FiMapPin />} label="Asal" value={data.origin} />
          <DetailItem icon={<MdSchool />} label="Universitas" value={data.university} />
          <DetailItem icon={<FiBookOpen />} label="Program Studi" value={data.major} />
          <DetailItem icon={<FiCalendar />} label="Angkatan" value={data.entry_year} />
          <DetailItem icon={<FiClock />} label="Durasi" value={data.duration} />
          <DetailItem icon={<FiBookOpen />} label="Jenjang" value={data.education_level} />
          <DetailItem icon={<FiBookOpen />} label="Jenis Beasiswa" value={data.scholarship_type} />
        </div>

        {data.hospital && (
          <div className="px-6 pb-4">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Afiliasi / Instansi</p>
              <p className="text-sm text-slate-700">{data.hospital}</p>
            </div>
          </div>
        )}

        {data.remarks && (
          <div className="px-6 pb-6">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
              <p className="text-xs uppercase tracking-wide text-amber-700 mb-1">Catatan</p>
              <p className="text-sm text-amber-800">{data.remarks}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
