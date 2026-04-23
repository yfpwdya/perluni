import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiLogOut, FiMenu, FiShield, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Tentang', href: '/#tentang' },
  { label: 'Profil Organisasi', href: '/#profil-organisasi' },
  { label: 'Cari Anggota', href: '/#cari-anggota' },
  { label: 'Kontak', href: '/#kontak' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-brand-800 text-white text-[11px] sm:text-xs">
        <div className="container-app h-8 flex items-center justify-between gap-2">
          <p className="truncate">Portal Data Organisasi Perluni Tiongkok</p>
          <span className="hidden sm:inline text-white/80">Layanan resmi internal organisasi</span>
        </div>
      </div>

      <div
        className={`transition-all border-b ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl border-slate-200 shadow-[0_10px_30px_rgba(15,23,42,0.06)]'
            : 'bg-white/90 border-slate-100'
        }`}
      >
        <div className="container-app h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo cina.avif" alt="Logo Perluni" className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-100" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-900">Perluni Tiongkok</p>
              <p className="text-[11px] text-slate-500">Sistem Informasi Organisasi</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-3 py-2 text-sm text-slate-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-secondary text-sm border-brand-100 text-brand-700">
                    <FiShield /> Admin
                  </Link>
                )}

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-50 text-slate-700 text-sm border border-brand-100">
                  <FiUser className="text-brand-600" />
                  <span className="max-w-32 truncate">{user?.name}</span>
                </div>
                <button type="button" onClick={logout} className="btn btn-secondary text-sm">
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary text-sm">
                <FiLogIn /> Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-700"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="container-app py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                >
                  {item.label}
                </a>
              ))}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 text-sm text-brand-700 bg-brand-50 rounded-lg mt-1"
                >
                  <span className="inline-flex items-center gap-2">
                    <FiShield /> Admin Panel
                  </span>
                </Link>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="btn btn-secondary w-full text-sm"
                  >
                    <FiLogOut /> Logout
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="btn btn-primary w-full text-sm">
                    <FiLogIn /> Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
