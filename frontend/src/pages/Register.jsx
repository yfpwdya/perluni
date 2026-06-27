import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiLock,
  FiMail,
  FiUser,
  FiMapPin,
  FiBook,
  FiCalendar,
  FiClock,
  FiAward,
  FiBookOpen,
  FiUsers,
  FiSearch,
} from 'react-icons/fi';
import { authAPI, sensusAPI } from '../services/api';
// import { motion } from 'framer-motion';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    origin: '',
    university: '',
    major: '',
    educationLevel: '',
    entryYear: '',
    duration: '',
    scholarshipType: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Member search autocomplete state
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const searchTimeout = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Handle pre-populated data from Sensus search page
  useEffect(() => {
    if (location.state?.member) {
      const member = location.state.member;
      setSelectedMember(member);
      setFormData((prev) => ({
        ...prev,
        name: member.name || prev.name,
        gender: member.gender || '',
        origin: member.origin || '',
        university: member.university || '',
        major: member.major || '',
        educationLevel: member.education_level || '',
        entryYear: member.entry_year ? String(member.entry_year) : '',
        duration: member.duration || '',
        scholarshipType: member.scholarship_type || '',
      }));
    }
  }, [location.state]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search members when name changes
  const searchMembers = useCallback(async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const response = await sensusAPI.search(query, 'all', 'name');
      const results = response.data?.data || [];
      setSearchResults(results.slice(0, 8));
      setShowDropdown(results.length > 0);
    } catch {
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');

    // Trigger member search on name input
    if (name === 'name') {
      setSelectedMember(null);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      searchTimeout.current = setTimeout(() => searchMembers(value), 350);
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setShowDropdown(false);
    setFormData((prev) => ({
      ...prev,
      name: member.name || prev.name,
      gender: member.gender || '',
      origin: member.origin || '',
      university: member.university || '',
      major: member.major || '',
      educationLevel: member.education_level || '',
      entryYear: member.entry_year ? String(member.entry_year) : '',
      duration: member.duration || '',
      scholarshipType: member.scholarship_type || '',
    }));
  };

  const handleNextStep = (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePrevStep = () => {
    setError('');
    setStep(1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      await authAPI.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender || undefined,
        origin: formData.origin || undefined,
        university: formData.university || undefined,
        major: formData.major || undefined,
        educationLevel: formData.educationLevel || undefined,
        entryYear: formData.entryYear ? parseInt(formData.entryYear, 10) : undefined,
        duration: formData.duration || undefined,
        scholarshipType: formData.scholarshipType || undefined,
        memberId: selectedMember ? selectedMember.id : undefined,
      });

      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#101010] relative overflow-hidden flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
        <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl border border-brand-300/20 bg-[#1c1c1c] p-8 text-center max-w-md w-full shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative z-10"
        >
          <div className="w-16 h-16 rounded-full bg-brand-300/10 border border-brand-300/30 flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="text-3xl text-brand-300 animate-bounce" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">Registrasi Berhasil</h2>
          <p className="text-sm text-[#d4d4d4] mt-3 leading-relaxed">Silakan cek email untuk verifikasi akun Anda.</p>
          <p className="text-xs text-slate-500 mt-4 animate-pulse">Mengalihkan ke halaman login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#101010] relative overflow-hidden">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />

      {/* Left Branding Column */}
      <div className="hidden lg:flex bg-[#0a0a0a] text-white p-12 flex-col justify-between border-r border-brand-300/10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-brand-300/10 blur-[100px]" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-brand-300/5 blur-[100px]" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <img src="/logo-cinanew.png" alt="Perluni" className="w-12 h-12 rounded-xl ring-2 ring-brand-300/30 object-cover" />
            <div>
              <p className="text-lg font-bold tracking-wide">Perluni Tiongkok</p>
              <p className="text-[10px] text-brand-300 font-medium uppercase tracking-wider">Sistem Informasi</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mt-10 text-white leading-tight">Bergabung dengan Portal Perluni</h2>
          <p className="text-sm text-[#a0a0a0] mt-3 max-w-md leading-relaxed">
            Registrasi akun untuk mengakses layanan internal organisasi dan informasi anggota secara aman.
          </p>
        </div>

        {/* Step indicator */}
        <div className="relative space-y-4">
          <div className={`flex items-center gap-3.5 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ${step === 1 ? 'border-brand-300/40 bg-brand-300/10' : 'border-[#2c2c2c] bg-[#1c1c1c]/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 1 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-[#2c2c2c] text-[#a0a0a0]'}`}>1</div>
            <div>
              <p className="text-sm font-semibold text-white">Informasi Akun</p>
              <p className="text-xs text-[#a0a0a0]">Nama, email, dan password</p>
            </div>
            {step > 1 && <FiCheckCircle className="ml-auto text-brand-300" />}
          </div>

          <div className={`flex items-center gap-3.5 rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 ${step === 2 ? 'border-brand-300/40 bg-brand-300/10' : 'border-[#2c2c2c] bg-[#1c1c1c]/40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step === 2 ? 'bg-brand-gradient text-white shadow-glow' : 'bg-[#2c2c2c] text-[#a0a0a0]'}`}>2</div>
            <div>
              <p className="text-sm font-semibold text-white">Data Anggota</p>
              <p className="text-xs text-[#a0a0a0]">Universitas, program studi, angkatan</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-2xl border border-brand-300/10 bg-[#1c1c1c]/40 p-4 backdrop-blur-sm">
          <p className="text-xs text-[#d4d4d4] leading-relaxed">
            💡 Tips: Ketik nama Anda di kolom pencarian untuk menemukan data anggota yang sudah terdaftar. Sistem akan mengisi form secara otomatis.
          </p>
        </div>
      </div>

      {/* Right Column containing Form Card */}
      <div className="p-6 md:p-10 flex items-center justify-center relative z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg bg-[#1c1c1c] border border-brand-300/20 p-6 md:p-8 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-visible"
        >
          <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />

          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-300/10 border border-brand-300/20 px-3 py-1.5 text-xs font-semibold text-brand-300">
              Registrasi — Langkah {step}/2
            </span>
            {/* Mobile step indicator dots */}
            <div className="flex items-center gap-1.5 lg:hidden">
              <div className={`w-2 h-2 rounded-full transition-colors ${step >= 1 ? 'bg-brand-300' : 'bg-slate-700'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${step >= 2 ? 'bg-brand-300' : 'bg-slate-700'}`} />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white">
            {step === 1 ? 'Buat Akun Baru' : 'Data Anggota'}
          </h1>
          <p className="text-xs text-[#a0a0a0] mt-1">
            {step === 1
              ? 'Cari nama Anda atau isi data akun di bawah ini.'
              : 'Verifikasi dan lengkapi data keanggotaan Anda.'}
          </p>

          {/* Member auto-fill success badge */}
          {selectedMember && step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-xs text-green-200 leading-relaxed"
            >
              <FiCheckCircle className="shrink-0 mt-0.5 text-green-400" />
              <span>
                Data terhubung: <strong>{selectedMember.name}</strong> ({selectedMember.university || 'N/A'}). Form data akan terisi secara otomatis.
              </span>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-200"
            >
              {error}
            </motion.div>
          )}

          {/* Step 1: Account Info */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 mt-6 relative z-10">
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg z-10" />
                {searching && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
                    <div className="w-4 h-4 border-2 border-brand-300 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                  placeholder="Ketik nama lengkap Anda..."
                  autoComplete="off"
                  required
                />

                {/* Search results dropdown overlay */}
                {showDropdown && searchResults.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-[#1c1c1c] border border-brand-300/20 shadow-glow rounded-2xl z-50 max-h-72 overflow-y-auto divide-y divide-[#2c2c2c]"
                  >
                    <div className="px-4 py-2 bg-[#0a0a0a] border-b border-brand-300/10">
                      <p className="text-[10px] font-bold text-brand-300 uppercase tracking-wider flex items-center gap-1.5">
                        <FiSearch className="text-brand-300" />
                        {searchResults.length} Anggota Terdaftar
                      </p>
                    </div>
                    {searchResults.map((member) => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleSelectMember(member)}
                        className="w-full text-left px-4 py-3 hover:bg-brand-500/10 transition-colors flex flex-col gap-0.5"
                      >
                        <p className="text-sm font-semibold text-white">
                          {member.name}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5 text-xs text-[#a0a0a0]">
                          {member.university && (
                            <span className="flex items-center gap-1">
                              <FiBookOpen className="text-[10px] text-brand-300" />
                              {member.university}
                            </span>
                          )}
                          {member.major && (
                            <span className="flex items-center gap-1">
                              <FiBook className="text-[10px] text-brand-300" />
                              {member.major}
                            </span>
                          )}
                          {member.entry_year && (
                            <span className="flex items-center gap-1">
                              <FiCalendar className="text-[10px] text-brand-300" />
                              {member.entry_year}
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                  placeholder="Alamat Email"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-11 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                  placeholder="Password (min. 8 karakter, ada huruf besar/kecil & angka)"
                  minLength={8}
                  pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}"
                  title="Minimal 8 karakter dan mengandung huruf besar, huruf kecil, serta angka"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                  placeholder="Konfirmasi password"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl bg-brand-gradient text-white font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-glow"
              >
                Lanjut Langkah Berikutnya <FiArrowRight />
              </button>
            </form>
          )}

          {/* Step 2: Member Data */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6 relative z-10">
              {selectedMember && (
                <div className="rounded-xl border border-brand-300/10 bg-brand-300/5 px-4 py-2.5 text-xs text-brand-200 leading-relaxed mb-2">
                  Formulir terisi otomatis dari data <strong>{selectedMember.name}</strong>. Anda dapat menyesuaikan jika ada yang berubah.
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jenis Kelamin */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Jenis Kelamin
                  </label>
                  <div className="relative">
                    <FiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg pointer-events-none" />
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1c1c1c] text-[#a0a0a0]">— Pilih —</option>
                      <option value="Laki-laki" className="bg-[#1c1c1c] text-white">Laki-laki</option>
                      <option value="Perempuan" className="bg-[#1c1c1c] text-white">Perempuan</option>
                    </select>
                  </div>
                </div>

                {/* Asal */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Asal Daerah
                  </label>
                  <div className="relative">
                    <FiMapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                      placeholder="Kota / provinsi asal"
                    />
                  </div>
                </div>

                {/* Universitas */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Universitas di Tiongkok
                  </label>
                  <div className="relative">
                    <FiBookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                    <input
                      type="text"
                      name="university"
                      value={formData.university}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                      placeholder="Nama universitas"
                    />
                  </div>
                </div>

                {/* Program Studi */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Program Studi (Jurusan)
                  </label>
                  <div className="relative">
                    <FiBook className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                    <input
                      type="text"
                      name="major"
                      value={formData.major}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                      placeholder="Contoh: Clinical Medicine"
                    />
                  </div>
                </div>

                {/* Angkatan */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Tahun Masuk (Angkatan)
                  </label>
                  <div className="relative">
                    <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                    <input
                      type="number"
                      name="entryYear"
                      value={formData.entryYear}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                      placeholder="Contoh: 2015"
                      min={1950}
                      max={2100}
                    />
                  </div>
                </div>

                {/* Durasi */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Durasi Studi
                  </label>
                  <div className="relative">
                    <FiClock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg" />
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all placeholder:text-[#737373]"
                      placeholder="Contoh: 6 Tahun"
                    />
                  </div>
                </div>

                {/* Jenjang */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Jenjang
                  </label>
                  <div className="relative">
                    <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg pointer-events-none" />
                    <select
                      name="educationLevel"
                      value={formData.educationLevel}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1c1c1c] text-[#a0a0a0]">— Pilih —</option>
                      <option value="D3" className="bg-[#1c1c1c] text-white">D3</option>
                      <option value="D4" className="bg-[#1c1c1c] text-white">D4</option>
                      <option value="S1" className="bg-[#1c1c1c] text-white">S1</option>
                      <option value="S2" className="bg-[#1c1c1c] text-white">S2</option>
                      <option value="S3" className="bg-[#1c1c1c] text-white">S3</option>
                      <option value="Profesi" className="bg-[#1c1c1c] text-white">Profesi</option>
                      <option value="Spesialis" className="bg-[#1c1c1c] text-white">Spesialis</option>
                    </select>
                  </div>
                </div>

                {/* Jenis Beasiswa */}
                <div>
                  <label className="block text-xs font-medium text-[#d4d4d4] uppercase tracking-wider mb-2">
                    Jenis Beasiswa
                  </label>
                  <div className="relative">
                    <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-300 text-lg pointer-events-none" />
                    <select
                      name="scholarshipType"
                      value={formData.scholarshipType}
                      onChange={handleChange}
                      className="w-full bg-[#1c1c1c]/50 border border-[#2c2c2c] text-white text-sm rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-brand-300 focus:ring-1 focus:ring-brand-300 transition-all appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-[#1c1c1c] text-[#737373]">— Pilih —</option>
                      <option value="Mandiri" className="bg-[#1c1c1c] text-white">Mandiri</option>
                      <option value="CSC" className="bg-[#1c1c1c] text-white">CSC (Chinese Government Scholarship)</option>
                      <option value="Beasiswa Provinsi" className="bg-[#1c1c1c] text-white">Beasiswa Provinsi</option>
                      <option value="Beasiswa Universitas" className="bg-[#1c1c1c] text-white">Beasiswa Universitas</option>
                      <option value="Lainnya" className="bg-[#1c1c1c] text-white">Lainnya</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="py-3 px-5 rounded-xl border border-[#2c2c2c] text-[#d4d4d4] font-semibold hover:bg-[#2c2c2c] hover:scale-[1.02] transition-transform text-sm flex-1 flex items-center justify-center gap-1.5"
                >
                  <FiArrowLeft /> Kembali
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="py-3 px-5 rounded-xl bg-brand-gradient text-white font-semibold flex items-center justify-center gap-1.5 hover:scale-[1.02] transition-transform shadow-glow text-sm flex-1"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Daftar <FiArrowRight />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <p className="text-xs text-[#a0a0a0] mt-6 text-center relative z-10">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-brand-300 hover:text-brand-400 transition-colors">
              Login di sini
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
