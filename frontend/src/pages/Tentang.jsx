import { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { sensusAPI } from '../services/api';
import { motion } from 'framer-motion';

const historyMilestones = [
  {
    year: '2010',
    title: 'Berdirinya Perluni Tiongkok',
    description:
      'Perluni Tiongkok resmi didirikan oleh sekelompok mahasiswa Indonesia di Beijing sebagai wadah komunikasi dan koordinasi antar pelajar Indonesia di Tiongkok.',
  },
  {
    year: '2013',
    title: 'Ekspansi ke Kota-kota Besar',
    description:
      'Jaringan Perluni mulai berkembang ke Shanghai, Guangzhou, dan Wuhan. Anggota aktif mencapai lebih dari 200 mahasiswa lintas universitas.',
  },
  {
    year: '2016',
    title: 'Peluncuran Program Beasiswa Internal',
    description:
      'Perluni mulai menginisiasi program pendampingan beasiswa untuk membantu mahasiswa baru dalam proses adaptasi akademik dan administrasi.',
  },
  {
    year: '2019',
    title: 'Kolaborasi dengan KBRI Beijing',
    description:
      'Terjalin kerjasama resmi dengan KBRI Beijing dalam agenda kebudayaan, pendataan WNI, dan advokasi mahasiswa Indonesia di Tiongkok.',
  },
  {
    year: '2022',
    title: 'Digitalisasi Data Keanggotaan',
    description:
      'Perluni meluncurkan sistem basis data digital pertama untuk mengelola data anggota aktif dan alumni secara terpusat dan terstruktur.',
  },
  {
    year: '2024',
    title: 'Portal Informasi Perluni 2.0',
    description:
      'Peluncuran portal web modern Perluni 2.0 — sistem informasi berbasis data real-time untuk seluruh anggota, alumni, dan publik.',
  },
];

const Tentang = () => {
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

  const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

  const statCards = [
    { label: 'Total Anggota', value: formatNumber(stats?.total_records) },
    { label: 'Mahasiswa', value: formatNumber(stats?.total_mahasiswa) },
    { label: 'Alumni', value: formatNumber(stats?.total_dokter) },
    { label: 'Asal Universitas', value: formatNumber(stats?.total_universities) },
  ];

  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden pb-20">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-1/4 w-[500px] h-[500px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero + Stats */}
      <section className="pt-10 relative z-10">
        <div className="container-app grid gap-6 lg:grid-cols-[1.3fr_1fr] items-stretch max-w-5xl mx-auto">
          
          {/* Hero Main Card */}
          <motion.article 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-brand-gradient text-white p-8 md:p-10 shadow-[0_8px_30px_rgba(201,168,76,0.15)] relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute -right-16 -top-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold">
                <FiCheckCircle className="text-sm text-white" /> Portal Resmi
              </span>
              <h1 className="text-3xl md:text-5xl font-bold mt-6 leading-tight text-white tracking-tight">
                Sistem Informasi
                <br />
                Perluni Tiongkok
              </h1>
              <p className="text-white/95 mt-5 text-sm md:text-base leading-relaxed">
                Antarmuka modern premium untuk profil organisasi dan pencarian anggota secara cepat.
                Dirancang ringan, aman, dan nyaman digunakan untuk seluruh mahasiswa dan alumni Indonesia di Tiongkok.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 relative z-10">
              <Link to="/cari-anggota" className="btn bg-white text-[#A07830] hover:bg-slate-100 text-sm shadow-md hover:scale-105 transition-all font-semibold">
                Mulai Cari Anggota
              </Link>
              <Link to="/profil-organisasi" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm hover:scale-105 transition-all">
                Profil Organisasi
              </Link>
              <Link to="/publikasi" className="btn bg-white/10 text-white border border-white/20 hover:bg-white/20 text-sm hover:scale-105 transition-all">
                Lihat Publikasi
              </Link>
            </div>
          </motion.article>

          {/* Stats Summary Card */}
          <motion.article 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-brand-300/20 bg-[#1c1c1c] p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          >
            <div>
              <p className="text-xs uppercase tracking-widest text-brand-300 font-semibold">Ringkasan Keanggotaan</p>
              <h2 className="text-2xl font-bold mt-2 text-white">Data Inti Organisasi</h2>
              
              <div className="mt-6 grid grid-cols-2 gap-4">
                {statCards.map((item, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.05 }}
                    key={item.label} 
                    className="rounded-2xl border border-brand-300/10 bg-[#1c1c1c]/30 p-4 hover:border-brand-300/20 transition-colors"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[#a0a0a0]">{item.label}</p>
                    <p className="text-2xl font-bold text-white mt-1">
                      {dashboardLoading ? (
                        <span className="inline-block w-8 h-6 bg-[#2c2c2c]/50 rounded animate-pulse" />
                      ) : (
                        item.value
                      )}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            <p className="text-xs text-[#737373] mt-6 leading-relaxed">
              * Data diperbarui secara real-time dari basis data anggota internal organisasi Perluni Tiongkok.
            </p>
          </motion.article>

        </div>
      </section>

      {/* === SEJARAH ORGANISASI === */}
      <section className="relative z-10 mt-20">
        <div className="container-app max-w-5xl mx-auto">

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-300/30 bg-brand-300/10 px-4 py-1.5 text-xs font-semibold text-brand-300 mb-4">
              <FiClock className="text-sm" /> Perjalanan Organisasi
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Sejarah{' '}
              <span className="text-transparent bg-clip-text bg-brand-gradient">
                Perluni Tiongkok
              </span>
            </h2>
            <p className="text-[#a0a0a0] mt-3 max-w-xl text-sm leading-relaxed">
              Lebih dari satu dekade hadir sebagai jembatan komunitas mahasiswa dan alumni Indonesia di Tiongkok.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Garis vertikal tengah — hanya tampil di md+ */}
            <div className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-brand-300/50 via-brand-300/20 to-transparent hidden md:block" />

            <div className="space-y-8">
              {historyMilestones.map((item, index) => {
                const isLeft = index % 2 === 0;
                return (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.08 }}
                    className={`relative flex flex-col items-start md:items-center gap-4 md:gap-0 ${
                      isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Card */}
                    <div className={`w-full md:w-[calc(50%-2.5rem)] ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                      <div className="rounded-2xl border border-brand-300/20 bg-[#1c1c1c] p-5 hover:border-brand-300/40 hover:-translate-y-0.5 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                        <div className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                          <HiSparkles className="text-brand-300 shrink-0" />
                          <span className="text-xs font-bold text-brand-300 tracking-widest">{item.year}</span>
                        </div>
                        <h3 className="text-base font-semibold text-white leading-snug">{item.title}</h3>
                        <p className="text-sm text-[#a0a0a0] mt-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Dot tengah timeline */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-brand-gradient border-2 border-[#101010] shadow-glow z-10" />

                    {/* Spacer sisi kosong */}
                    <div className="hidden md:block md:w-[calc(50%-2.5rem)]" />
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Tentang;
