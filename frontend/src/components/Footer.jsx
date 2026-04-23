const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="kontak" className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="container-app py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <img src="/logo cina.avif" alt="Perluni" className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-300/40" />
            <div className="leading-tight">
              <p className="font-semibold text-white">Perluni Tiongkok</p>
              <p className="text-xs text-slate-400">Portal Organisasi</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Wadah kolaborasi mahasiswa dan alumni Indonesia di Tiongkok untuk pertukaran data, publikasi,
            dan penguatan jejaring organisasi.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><a href="/#tentang" className="hover:text-brand-300">Tentang</a></li>
            <li><a href="/#profil-organisasi" className="hover:text-brand-300">Profil Organisasi</a></li>
            <li><a href="/#cari-anggota" className="hover:text-brand-300">Cari Anggota</a></li>
            <li><a href="/#kontak" className="hover:text-brand-300">Kontak</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li>Email: contact@perluni.org</li>
            <li>Telepon: +62 822-9975-1945</li>
            <li>Beijing, Tiongkok</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="container-app py-4 text-xs text-slate-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {year} Perluni Tiongkok. Hak cipta dilindungi.</span>
          <span>Portal resmi organisasi mahasiswa dan alumni Indonesia di Tiongkok.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
