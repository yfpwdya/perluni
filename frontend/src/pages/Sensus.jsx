import { useState, useEffect } from "react";
import { FiSearch, FiArrowRight, FiUsers, FiTarget, FiAward, FiHeart, FiUser } from "react-icons/fi";
import { MdMenuBook } from "react-icons/md";
import { FaUserGraduate, FaUniversity, FaChartBar, FaBook, FaBullhorn, FaMapMarkedAlt } from "react-icons/fa";
import ProfileModal from "../components/ProfileModal";
import { sensusAPI } from "../services/api";

const Sensus = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [showResults, setShowResults] = useState(false);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.length >= 2) {
                performSearch(search, category);
            } else {
                setSearchResults([]);
                setShowResults(false);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, category]);

    const performSearch = async (query, cat) => {
        setIsLoading(true);
        try {
            const response = await sensusAPI.search(query, cat);
            if (response.data.success) {
                setSearchResults(response.data.data);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
        // If there is a search term, re-trigger search with new category immediately
        if (search.length >= 2) {
            performSearch(search, newCategory);
        }
    };

    const categories = [
        { value: "all", label: "Semua" },
        { value: "alumni", label: "Alumni" },
        { value: "mahasiswa", label: "Mahasiswa Aktif" },
    ];

    const dashboardItems = [
        {
            label: "Program Studi",
            icon: <MdMenuBook />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        },
        {
            label: "Perguruan Tinggi",
            icon: <FaUniversity />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        },
        {
            label: "Statistik",
            icon: <FaChartBar />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        },
        {
            label: "Publikasi",
            icon: <FaUserGraduate />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        },
        {
            label: "Pengumuman",
            icon: <FaBullhorn />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        },
        {
            label: "Peta",
            icon: <FaMapMarkedAlt />,
            color: "bg-gradient-to-br from-primary-400 to-primary-600"
        }
    ];

    const features = [
        {
            icon: <FiUsers />,
            title: 'Komunitas Solid',
            description: 'Bergabung dengan ribuan anggota yang berdedikasi untuk tujuan bersama.'
        },
        {
            icon: <FiTarget />,
            title: 'Visi Jelas',
            description: 'Fokus pada pencapaian tujuan dengan strategi yang terukur dan terarah.'
        },
        {
            icon: <FiAward />,
            title: 'Prestasi Gemilang',
            description: 'Berbagai pencapaian dan kontribusi nyata untuk masyarakat.'
        },
        {
            icon: <FiHeart />,
            title: 'Dedikasi Tinggi',
            description: 'Komitmen penuh untuk memberikan yang terbaik bagi anggota dan masyarakat.'
        }
    ];

    const stats = [
        { number: '1000+', label: 'Anggota Aktif' },
        { number: '50+', label: 'Program' },
        { number: '100+', label: 'Kegiatan/Tahun' },
        { number: '10+', label: 'Tahun Berdiri' }
    ];

    const testimonials = [
        {
            name: "dr. Adi Putra Korompis, MBBS.",
            role: "Ketua Umum Perluni 2020/2021",
            content: "PERLUNI adalah organisasi yang mengajarkan kami dunia kedokteran tidak hanya secara akademis tapi juga secara aktivis. Rumah kami pulang untuk berkeluh kesah dan wadah pencetak aktivis dan akademisi yg piawai dalam mengadvokasi dunia kedokteran, kesehatan serta kenegaraan pada umumnya."
        },
        {
            name: "dr. Imanuel Oktavianus, MBBS.",
            role: "Ketua Perluni Tiongkok 2022/2023",
            content: "Perluni bukan hanya tempat berkumpul, melainkan wadah untuk berkontemplasi, berdiskusi, dan berkreasi dengan semangat kebersamaan. Perluni berkomitmen menciptakan ruang yang nyaman dan inspiratif untuk saling bertukar ide, mengasah potensi, serta memperkuat jejaring dalam semangat kolaborasi."
        }
    ];

    return (
        <div className="overflow-x-hidden">
            {selectedProfile && (
                <ProfileModal
                    data={selectedProfile}
                    onClose={() => setSelectedProfile(null)}
                />
            )}

            {/* Hero Section */}
            <section className="min-h-[calc(100vh-80px)] flex items-center py-20 relative bg-white">
                <div className="container grid lg:grid-cols-2 gap-16 items-center">
                    <div className="flex flex-col gap-6 z-10">
                        <span className="inline-flex items-center gap-2 px-4 py-2 w-fit bg-primary-50 border border-primary-200 rounded-full text-sm font-semibold text-primary-600">
                            🎉 Selamat Datang di Perluni
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] text-secondary-900">
                            Kabinet <span className="text-primary-500">Reborn</span> for Indonesia Emas 2045
                        </h1>
                        <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                            Mewujudkan Perluni Tiongkok sebagai katalisator transformasi kesehatan global berbasis kolaborasi strategis,
                            inovasi berkelanjutan, dan kontribusi nyata demi terwujudnya Indonesia Emas 2045.
                        </p>
                    </div>

                    <div className="relative flex items-center justify-center min-h-[500px] lg:min-h-[600px]">
                        {/* Large Dark Circle Background */}
                        <div className="absolute w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] bg-secondary-900 rounded-full z-0"></div>

                        {/* Logo in white circle - top right */}
                        <div className="absolute top-0 right-0 lg:right-8 w-20 h-20 lg:w-24 lg:h-24 bg-white rounded-full shadow-xl flex items-center justify-center z-30">
                            <img
                                src="/logo cina.avif"
                                alt="Perluni Logo"
                                className="w-14 h-14 lg:w-16 lg:h-16 object-contain"
                            />
                        </div>

                        {/* Team Photo - positioned in front of circle */}
                        <div className="relative z-10 w-full max-w-[500px] lg:max-w-[600px]">
                            <img
                                src="/foto cina.avif"
                                alt="Tim Perluni Tiongkok"
                                className="w-full h-auto object-contain drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 -mt-12 relative z-20">
                <div className="container">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="clean-card p-8 flex flex-col items-center justify-center text-center gap-2 hover:-translate-y-1 transition-transform duration-300">
                                <span className="text-4xl lg:text-5xl font-bold text-primary-500 font-display">{stat.number}</span>
                                <span className="text-gray-500 font-medium">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sensus Dashboard Section */}
            <section className="py-24 bg-surface-light">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-12 px-4">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 rounded-full text-sm font-semibold text-primary-600 mb-4">
                            Database Sensus
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary-900">
                            Data <span className="text-primary-500">Sensus</span> Perluni
                        </h2>
                    </div>

                    <div className="glass-card p-4 flex flex-col md:flex-row gap-4 justify-between items-center shadow-lg shadow-black/20 mb-8 relative z-30">
                        <div className="relative w-full md:w-96">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                className="input pl-10"
                                placeholder="Cari nama mahasiswa atau dokter..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onFocus={() => search.length >= 2 && setShowResults(true)}
                            />

                            {/* Search Results Dropdown */}
                            {showResults && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 max-h-96 overflow-y-auto z-50 animate-fade-in">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500">
                                            <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                                            Mencari data...
                                        </div>
                                    ) : searchResults.length > 0 ? (
                                        <div className="divide-y divide-gray-50">
                                            {searchResults.map((result) => (
                                                <div
                                                    key={result.id}
                                                    onClick={() => {
                                                        setSelectedProfile(result);
                                                        setShowResults(false);
                                                    }}
                                                    className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                                                >
                                                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 shrink-0">
                                                        <FiUser />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-gray-900">{result.name}</h4>
                                                        <p className="text-xs text-gray-500 line-clamp-1">{result.university} • {result.major}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 text-center text-gray-500">
                                            Tidak ditemukan hasil untuk "{search}"
                                        </div>
                                    )}
                                </div>
                            )}

                            {showResults && (
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowResults(false)}
                                ></div>
                            )}
                        </div>
                        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                            {categories.map((cat) => (
                                <button
                                    key={cat.value}
                                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${category === cat.value
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-white/5 text-gray-600 hover:text-primary-500 hover:bg-primary-50'
                                        }`}
                                    onClick={() => handleCategoryChange(cat.value)}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardItems.map((item, index) => (
                            <div key={index} className="glass-card p-8 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition-transform duration-300 cursor-pointer group">
                                <div className={`w-16 h-16 rounded-2xl ${item.color} flex items-center justify-center text-3xl text-white mb-6 shadow-lg shadow-current/30 group-hover:scale-110 transition-transform duration-300`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-primary-400 transition-colors">
                                    {item.label}
                                </h3>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white">
                <div className="container">
                    <div className="text-center max-w-2xl mx-auto mb-16 px-4">
                        <span className="inline-block px-4 py-1.5 bg-primary-100 rounded-full text-sm font-semibold text-primary-600 mb-4">
                            Keunggulan Kami
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary-900">
                            Mengapa Bergabung dengan <span className="text-primary-500">Perluni</span>?
                        </h2>
                        <p className="text-lg text-gray-600 leading-relaxed">
                            Kami menawarkan berbagai keunggulan yang membuat organisasi kami berbeda dari yang lain.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="clean-card p-8 flex flex-col gap-4 hover:-translate-y-2 hover:shadow-xl transition-all duration-300 group">
                                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-primary-500 text-white text-2xl shadow-lg shadow-primary-500/20 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-secondary-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section (Dark Theme) */}
            <section className="py-24 bg-secondary-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-white/5 to-transparent pointer-events-none"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">
                            Kata Mereka <span className="text-primary-400">Tentang Perluni</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                        {testimonials.map((item, index) => (
                            <div key={index} className="bg-white/5 border border-white/10 p-8 rounded-2xl md:p-10 hover:bg-white/10 transition-colors duration-300">
                                <div className="flex flex-col items-center text-center gap-6">
                                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-gray-700 overflow-hidden border-4 border-primary-400/50 shadow-2xl shadow-primary-500/20 mb-2">
                                        <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                            <FiUser className="text-6xl text-gray-600" />
                                        </div>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed italic text-lg">
                                        "{item.content}"
                                    </p>
                                    <div className="mt-2">
                                        <h4 className="text-xl font-bold text-white">{item.name}</h4>
                                        <p className="text-primary-400 text-sm mt-1">{item.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Voice/Feedback Section */}
            <section className="py-24 relative bg-black">
                <div className="absolute inset-0 bg-secondary-900/90 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-0 opacity-80"></div>

                <div className="container relative z-10">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">
                            Suara Untuk <span className="text-primary-400">Perluni Tiongkok</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Kami membuka ruang bagi seluruh mahasiswa dan alumni untuk menyampaikan kritik, saran, maupun apresiasi.
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        <form className="flex flex-col items-center gap-6">
                            <div className="w-full">
                                <textarea
                                    className="w-full bg-gray-100/90 text-gray-900 rounded-xl px-6 py-4 outline-none focus:ring-4 focus:ring-primary-500/50 transition-all text-lg placeholder-gray-500 min-h-[150px]"
                                    placeholder="Enter your message..."
                                    required
                                ></textarea>
                            </div>

                            <button className="bg-primary-400 text-white font-bold py-4 px-12 rounded-full hover:bg-primary-500 transition-all transform hover:scale-105 shadow-xl shadow-primary-500/20 text-lg">
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Sensus;