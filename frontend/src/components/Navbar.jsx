import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiLogIn, FiLogOut, FiMenu, FiShield, FiUser, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Tentang', href: '/tentang' },
  { label: 'Profil', href: '/profil-organisasi' },
  { label: 'Publikasi', href: '/publikasi' },
  { label: 'Sensus', href: '/cari-anggota' },
  { label: 'Feedback', href: '/feedback' },
  { label: 'Kontak', href: '/kontak' },
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
      <div className="bg-[#0a0a0a] text-brand-300 text-[11px] sm:text-xs border-b border-brand-300/10">
        <div className="container-app h-8 flex items-center justify-between gap-2">
          <p className="truncate font-medium tracking-wide">Portal Data Organisasi Perluni Tiongkok</p>
          <span className="hidden sm:inline text-[#a0a0a0]">Layanan resmi internal organisasi</span>
        </div>
      </div>

      <div
        className={`transition-all border-b ${scrolled
          ? 'bg-[#0F0F0F]/95 backdrop-blur-xl border-brand-300/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
          : 'bg-[#0F0F0F]/90 border-brand-300/10'
          }`}
      >
        <div className="container-app h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img src="/logo-cinanew.png" alt="Logo Perluni" className="w-9 h-9 rounded-lg object-cover ring-2 ring-brand-300/30" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-white tracking-wide">Perluni Tiongkok</p>
              <p className="text-[10px] text-brand-300/80 uppercase font-semibold tracking-wider">Sistem Informasi</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-brand-300 hover:bg-slate-800/40 rounded-lg transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-brand-300 text-sm font-semibold border border-brand-300/20 flex items-center gap-1.5 transition-all">
                    <FiShield /> Admin
                  </Link>
                )}

                <Link to="/profil" className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-300/10 text-brand-300 text-sm font-semibold border border-brand-300/20 hover:bg-brand-300/20 transition-all">
                  <FiUser className="text-brand-300" />
                  <span className="max-w-32 truncate">{user?.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-2 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 text-sm font-medium transition-all"
                >
                  <FiLogOut /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="px-4 py-2 rounded-xl bg-brand-gradient text-white text-sm font-semibold hover:scale-105 transition-all shadow-glow flex items-center gap-1.5">
                <FiLogIn /> Login
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg border border-brand-300/20 text-brand-300 bg-slate-900"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-brand-300/10 bg-[#0F0F0F] pb-4">
            <div className="container-app py-3 flex flex-col gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all"
                >
                  {item.label}
                </Link>
              ))}

              {isAuthenticated && isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-brand-300 bg-slate-900 border border-brand-300/20 rounded-xl mt-2 flex items-center gap-2"
                >
                  <FiShield /> Admin Panel
                </Link>
              )}

              {isAuthenticated && (
                <Link
                  to="/profil"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-brand-300 bg-slate-900 border border-brand-300/20 rounded-xl mt-1 flex items-center gap-2"
                >
                  <FiUser /> Profil Saya
                </Link>
              )}

              <div className="pt-3 mt-2 border-t border-slate-800">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full py-2.5 rounded-xl border border-slate-700 text-slate-300 font-medium hover:bg-slate-800 transition-all text-sm"
                  >
                    <FiLogOut /> Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full py-2.5 rounded-xl bg-brand-gradient text-white font-medium flex items-center justify-center gap-1.5 hover:scale-[1.01] transition-transform text-sm shadow-glow"
                  >
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
