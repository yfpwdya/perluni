import { useEffect, useMemo, useState } from 'react';
import {
  FiBookOpen,
  FiCheckCircle,
  FiMapPin,
  FiSearch,
  FiUsers,
} from 'react-icons/fi';
import ProfileModal from '../components/ProfileModal';
import { sensusAPI } from '../services/api';

const categoryOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'mahasiswa', label: 'Mahasiswa' },
  { value: 'alumni', label: 'Alumni' },
];

const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

const organizationValues = [
  {
    title: 'Kolaboratif',
    description: 'Mendorong jejaring aktif antaranggota lintas universitas dan lintas angkatan.',
  },
  {
    title: 'Terstruktur',
    description: 'Data anggota dikelola rapi untuk kebutuhan komunikasi dan program organisasi.',
  },
  {
    title: 'Transparan',
    description: 'Informasi inti organisasi disajikan jelas, ringan, dan mudah diakses anggota.',
  },
];

const Sensus = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const [stats, setStats] = useState(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setDashboardLoading(true);
      try {
        const response = await sensusAPI.getStats();
        setStats(response.data?.stats || null);
      } catch {
        setStats(null);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const keyword = search.trim();

      if (keyword.length < 2 && category === 'all') {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await sensusAPI.search(keyword, category);
        setSearchResults(response.data?.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [search, category]);

  const statCards = useMemo(
    () => [
      {
        label: 'Total Anggota',
        value: formatNumber(stats?.total_records),
      },
      {
        label: 'Mahasiswa',
        value: formatNumber(stats?.total_mahasiswa),
      },
      {
        label: 'Alumni',
        value: formatNumber(stats?.total_dokter),
      },
      {
        label: 'Asal Universitas',
        value: formatNumber(stats?.total_universities),
      },
    ],
    [stats]
  );

  return (
    <div className="pb-12">
      {selectedProfile && (
        <ProfileModal
          data={selectedProfile}
          onClose={() => {
            setSelectedProfile(null);
            setShowResults(false);
          }}
        />
      )}

      <section className="pt-10" id="tentang">
        <div className="container-app grid gap-5 lg:grid-cols-[1.2fr_1fr] items-stretch">
          <article className="rounded-3xl bg-brand-gradient text-white p-7 md:p-9 shadow-soft relative overflow-hidden">
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/15 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                <FiCheckCircle className="text-sm" /> Portal Organisasi
              </span>
              <h1 className="text-3xl md:text-5xl font-semibold mt-4 leading-tight text-white">
                Sistem Informasi
                <br />
                Perluni Tiongkok
              </h1>
              <p className="text-white/90 mt-4 max-w-2xl text-sm md:text-base">
                Antarmuka modern untuk profil organisasi dan pencarian anggota secara cepat.
                Dirancang ringan, jelas, dan nyaman digunakan seperti pola dashboard institusi.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <a href="#cari-anggota" className="btn bg-white text-brand-700 hover:bg-brand-50 text-sm">
                  Mulai Cari Anggota
                </a>
                <a href="#profil-organisasi" className="btn bg-white/15 text-white border border-white/25 hover:bg-white/20 text-sm">
                  Lihat Profil Organisasi
                </a>
              </div>
            </div>
          </article>

          <article className="card p-5 md:p-6">
            <p className="text-xs uppercase tracking-wide text-slate-500">Ringkasan Keanggotaan</p>
            <h2 className="text-xl font-semibold mt-2">Data Inti Organisasi</h2>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {statCards.map((item) => (
                <div key={item.label} className="soft-panel p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.label}</p>
                  <p className="text-xl font-semibold text-slate-900 mt-1">
                    {dashboardLoading ? '...' : item.value}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-4">
              Data diperbarui dari basis data anggota internal organisasi.
            </p>
          </article>
        </div>
      </section>

      <section className="mt-8" id="foto-anggota">
        <div className="container-app">
          <div className="max-w-5xl mx-auto card overflow-hidden shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
            <div className="bg-gradient-to-b from-brand-50 to-slate-100 px-4 py-4 md:px-7 md:py-6">
              <img
                src="/foto%20cina.avif"
                alt="Foto anggota Perluni Tiongkok"
                className="w-full max-h-[640px] object-contain object-center mx-auto"
              />
            </div>
            <div className="px-5 py-5 text-center bg-white">
              <p className="text-base font-semibold text-slate-800">Foto Anggota Perluni Tiongkok</p>
              <p className="text-sm text-slate-500 mt-1">
                Representasi kebersamaan anggota dari berbagai kampus di Tiongkok.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12" id="profil-organisasi">
        <div className="container-app">
          <article className="card p-6 md:p-7">
            <span className="chip">Profil Organisasi</span>
            <h2 className="section-title mt-3">Tentang Perluni Tiongkok</h2>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              Perluni Tiongkok adalah wadah komunikasi, jejaring, dan kolaborasi mahasiswa/alumni Indonesia
              di Tiongkok. Portal ini difokuskan pada layanan inti yang benar-benar dibutuhkan organisasi:
              profil organisasi dan pencarian data anggota secara akurat.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {organizationValues.map((item) => (
                <div key={item.title} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-12" id="cari-anggota">
        <div className="container-app">
          <article className="card p-6 md:p-7 relative z-40 overflow-visible">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="chip">Pencarian Anggota</span>
                <h2 className="section-title mt-3">Cari Data Anggota</h2>
                <p className="text-sm text-slate-600 mt-2">
                  Ketik minimal 2 huruf untuk mencari berdasarkan nama, universitas, atau program studi.
                  Atau pilih kategori Mahasiswa/Alumni untuk menampilkan daftar berdasarkan kategori.
                </p>
              </div>
              <span className="chip">
                <FiUsers className="text-xs" /> Data Anggota
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 mb-3 max-w-sm">
              {categoryOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setCategory(item.value);
                    setShowResults(true);
                  }}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${
                    category === item.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onFocus={() => setShowResults(true)}
                className="input-base pl-10"
                placeholder="Contoh: Andi, Tsinghua, Kedokteran"
              />

              {showResults && (search.trim().length >= 2 || category !== 'all') && (
                <div className="absolute z-40 top-[calc(100%+8px)] left-0 right-0 card max-h-80 overflow-auto">
                  {isSearching ? (
                    <p className="text-sm text-slate-500 px-4 py-3">Mencari data...</p>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedProfile(item);
                          setShowResults(false);
                        }}
                        className="w-full text-left px-4 py-3 border-b border-slate-100 last:border-b-0 hover:bg-brand-50/50"
                      >
                        <p className="text-sm font-medium text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {item.university || '-'} • {item.major || '-'}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 px-4 py-3">Data tidak ditemukan.</p>
                  )}
                </div>
              )}
            </div>
          </article>
        </div>
      </section>

      <section className="mt-12" id="kontak">
        <div className="container-app">
          <div className="rounded-3xl bg-slate-900 text-white p-6 md:p-7 grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Sekretariat Organisasi</p>
              <p className="text-2xl font-semibold mt-2 text-white">Perluni Tiongkok</p>
              <p className="text-sm text-slate-300 mt-2">
                Untuk pembaruan data anggota atau kebutuhan organisasi, silakan hubungi kanal resmi Perluni.
              </p>
            </div>

            <div className="space-y-2 text-sm text-slate-200">
              <p className="inline-flex items-center gap-2">
                <FiMapPin className="text-brand-300" /> Beijing, Tiongkok
              </p>
              <p className="inline-flex items-center gap-2">
                <FiBookOpen className="text-brand-300" /> contact@perluni.org
              </p>
            </div>
          </div>
        </div>
      </section>

      {showResults && (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default"
          onClick={() => setShowResults(false)}
          aria-label="close search result"
        />
      )}
    </div>
  );
};

export default Sensus;
