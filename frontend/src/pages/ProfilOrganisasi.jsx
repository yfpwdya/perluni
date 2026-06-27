import { motion } from 'framer-motion';
import { HiOutlineSparkles } from 'react-icons/hi2';

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

const ProfilOrganisasi = () => {
  return (
    <div className="min-h-screen bg-[#101010] relative overflow-hidden pb-12">
      {/* Background Dot Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5 pointer-events-none" />
      <div className="absolute top-20 -left-1/4 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 -right-1/4 w-[500px] h-[500px] bg-brand-300/5 rounded-full blur-[120px] pointer-events-none" />

      <section className="mt-10 relative z-10">
        <div className="container-app">
          <motion.article
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 text-white p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative overflow-hidden max-w-4xl mx-auto"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-300/10 border border-brand-300/20 px-3 py-1 text-xs font-semibold text-brand-300 mb-4">
                <HiOutlineSparkles className="text-sm" /> Profil Organisasi
              </span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Tentang Perluni Tiongkok</h2>
              <p className="text-sm md:text-base text-[#d4d4d4] mt-4 leading-relaxed">
                Perluni Tiongkok adalah wadah komunikasi, jejaring, dan kolaborasi mahasiswa/alumni Indonesia
                di Tiongkok. Portal ini difokuskan pada layanan inti yang benar-benar dibutuhkan organisasi:
                profil organisasi dan pencarian data anggota secara akurat.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {organizationValues.map((item, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    key={item.title}
                    className="rounded-xl border border-brand-300/10 bg-[#1c1c1c]/30 p-5 hover:border-brand-300/30 transition-all hover:bg-[#1c1c1c]/50"
                  >
                    <p className="text-sm font-bold text-brand-300">{item.title}</p>
                    <p className="text-xs text-[#a0a0a0] mt-2 leading-relaxed">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section className="mt-8 relative z-10">
        <div className="container-app">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto rounded-3xl bg-[#1c1c1c] border border-brand-300/20 overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
          >
            <div className="bg-[#0a0a0a] px-4 py-4 md:px-7 md:py-6 flex items-center justify-center">
              <img
                src="foto-cinanew.png"
                alt="Foto anggota Perluni Tiongkok"
                className="w-full max-h-[500px] object-contain rounded-2xl mx-auto shadow-lg"
              />
            </div>
            <div className="px-6 py-5 text-center bg-[#1c1c1c] border-t border-brand-300/10">
              <p className="text-base font-semibold text-white">Kebersamaan Anggota Perluni Tiongkok</p>
              <p className="text-xs text-[#a0a0a0] mt-1">
                Representasi kebersamaan mahasiswa dan alumni Indonesia di Tiongkok.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ProfilOrganisasi;
