import { useEffect, useState } from 'react';
import { FiSearch, FiUsers } from 'react-icons/fi';
import ProfileModal from '../components/ProfileModal';
import { sensusAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'mahasiswa', label: 'Mahasiswa' },
  { value: 'alumni', label: 'Alumni' },
];

const fieldOptions = [
  { value: 'all', label: 'Semua Kolom' },
  { value: 'name', label: 'Nama' },
  { value: 'university', label: 'Universitas' },
  { value: 'major', label: 'Program Studi' },
  { value: 'origin', label: 'Asal Daerah' },
  { value: 'education_level', label: 'Jenjang' },
  { value: 'entry_year', label: 'Angkatan' },
  { value: 'hospital', label: 'Afiliasi/Instansi' },
  { value: 'scholarship_type', label: 'Beasiswa' },
  { value: 'remarks', label: 'Catatan' },
];

const Sensus = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [searchField, setSearchField] = useState('all');
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      const keyword = search.trim();

      if (keyword.length < 2 && category === 'all') {
        setSearchResults([]);
        return;
      }

      try {
        setIsSearching(true);
        const response = await sensusAPI.search(keyword, category, searchField);
        setSearchResults(response.data?.data || []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [search, category, searchField]);

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden pb-16">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-1/4 w-[500px] h-[500px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence>
        {selectedProfile && (
          <ProfileModal
            data={selectedProfile}
            onClose={() => {
              setSelectedProfile(null);
              setShowResults(false);
            }}
          />
        )}
      </AnimatePresence>

      <section className="pt-10 relative z-40" id="cari-anggota">
        <div className="container-app max-w-3xl mx-auto">
          <motion.article 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-visible"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />
            
            <div className="flex items-start justify-between gap-4 flex-wrap relative z-10">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-300/10 border border-brand-300/20 px-3 py-1 text-xs font-semibold text-brand-300">
                  Pencarian Anggota
                </span>
                <h2 className="text-3xl font-bold tracking-tight text-white mt-3">Cari Data Anggota</h2>
                <p className="text-xs md:text-sm text-[#a0a0a0] mt-2 leading-relaxed">
                  Ketik minimal 2 huruf untuk mencari berdasarkan nama, universitas, program studi, asal daerah,
                  angkatan, dan kolom lainnya. Gunakan filter kategori untuk mempersempit pencarian.
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1c1c1c] border border-[#2c2c2c] px-3 py-1 text-xs font-medium text-[#d4d4d4]">
                <FiUsers className="text-brand-300" /> Data Anggota
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-6 mb-4 max-w-md relative z-10">
              {categoryOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    setCategory(item.value);
                    setShowResults(true);
                  }}
                  className={`rounded-xl px-2 py-2.5 text-xs font-medium transition-all hover:scale-[1.02] active:scale-95 ${
                    category === item.value
                      ? 'bg-brand-gradient text-white shadow-glow border border-transparent'
                      : 'bg-[#1c1c1c]/60 text-[#d4d4d4] border border-[#2c2c2c]/50 hover:bg-[#1c1c1c]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 relative z-10">
              <div className="md:col-span-1">
                <select
                  value={searchField}
                  onChange={(event) => {
                    setSearchField(event.target.value);
                    setShowResults(true);
                  }}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all"
                >
                  {fieldOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#1c1c1c] text-white">
                      Kolom: {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onFocus={() => setShowResults(true)}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                  placeholder={
                    searchField === 'all'
                      ? 'Cari nama, universitas, jurusan...'
                      : `Cari di kolom ${fieldOptions.find((f) => f.value === searchField)?.label || 'data'}...`
                  }
                />

                {showResults && (search.trim().length >= 2 || category !== 'all') && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute z-40 top-[calc(100%+8px)] left-0 right-0 rounded-2xl bg-[#1c1c1c] border border-brand-300/20 shadow-glow max-h-80 overflow-auto divide-y divide-[#2c2c2c]"
                  >
                    {isSearching ? (
                      <p className="text-sm text-[#a0a0a0] px-4 py-3.5 animate-pulse">Mencari data...</p>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setSelectedProfile(item);
                            setShowResults(false);
                          }}
                          className="w-full text-left px-4 py-3.5 text-[#d4d4d4] hover:bg-brand-500/10 hover:text-white transition-colors flex flex-col gap-0.5"
                        >
                          <p className="text-sm font-semibold text-white">{item.name}</p>
                          <p className="text-xs text-[#a0a0a0]">
                            {item.university || '-'} • {item.major || '-'}
                          </p>
                        </button>
                      ))
                    ) : (
                      <p className="text-sm text-[#737373] px-4 py-3.5">Data tidak ditemukan.</p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.article>
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
