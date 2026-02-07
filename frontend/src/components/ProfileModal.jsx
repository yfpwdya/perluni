import { FiX, FiUser, FiMapPin, FiBook, FiAward, FiCalendar, FiClock } from 'react-icons/fi';
import { MdSchool } from 'react-icons/md';

const ProfileModal = ({ data, onClose }) => {
    if (!data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up relative">

                {/* Header Background */}
                <div className="h-32 bg-gradient-to-r from-primary-500 to-secondary-600 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
                    >
                        <FiX className="text-xl" />
                    </button>
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center shadow-lg overflow-hidden">
                            {data.gender === 'Perempuan' ? (
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&gender=female" alt="Avatar" className="w-full h-full" />
                            ) : (
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&gender=male" alt="Avatar" className="w-full h-full" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pt-20 px-8 pb-8">
                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">{data.name}</h2>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                            <FiMapPin className="text-primary-500" />
                            <span>{data.origin || '-'}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium border border-primary-100">
                                {data.education_level || 'S1'}
                            </span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100">
                                {data.scholarship_type || 'Mandiri'}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Universitas & Jurusan</label>
                                <div className="flex items-start gap-3 mt-1">
                                    <MdSchool className="text-xl text-primary-500 mt-1" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{data.university}</p>
                                        <p className="text-gray-600 font-medium">{data.major}</p>
                                    </div>
                                </div>
                            </div>

                            {data.hospital && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rumah Sakit Afiliasi</label>
                                    <div className="flex items-start gap-3 mt-1">
                                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-1">
                                            <span className="text-red-500 text-xs font-bold">+</span>
                                        </div>
                                        <p className="font-medium text-gray-800">{data.hospital}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Masa Studi</label>
                                <div className="flex items-center gap-3 mt-1 text-gray-700">
                                    <FiCalendar className="text-primary-500" />
                                    <span className="font-medium">Angkatan {data.entry_year}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-2 text-gray-700">
                                    <FiClock className="text-primary-500" />
                                    <span className="font-medium">Durasi: {data.duration || '-'}</span>
                                </div>
                            </div>

                            {data.sheet && (
                                <div>
                                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kategori</label>
                                    <div className="flex items-center gap-3 mt-1">
                                        <FiAward className="text-primary-500" />
                                        <span className="font-medium capitalize">{data.sheet}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {data.remarks && (
                        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                            <span className="font-bold block mb-1">Keterangan:</span>
                            {data.remarks}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
