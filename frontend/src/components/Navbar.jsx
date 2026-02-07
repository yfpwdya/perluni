import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

import {
  FiMenu,
  FiX,
  FiHome,
  FiLogIn,
  FiLogOut,
  FiUser
} from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Beranda', icon: <FiHome /> }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background-dark/90 backdrop-blur-xl shadow-lg py-3' : 'py-4 bg-transparent'
      }`}>
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-2xl text-white hover:opacity-90 transition-opacity group">
          <img src="/logo cina.avif" alt="Perluni Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
          <span className="text-[#252423]">Perluni</span>
          <span className="text-[#dfc47b]">Tiongkok</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 px-4 py-2.5 font-medium rounded-lg transition-all ${location.pathname === link.path
                    ? 'text-primary-400 bg-primary-400/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-gray-300 font-medium">
                  <FiUser className="text-primary-400" />
                  {user?.name}
                </span>
                <button onClick={logout} className="btn btn-secondary px-5 py-2 text-sm">
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary px-5 py-2 text-sm">
                <FiLogIn />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-2xl text-white bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Mobile Menu */}
        <div className={`md:hidden fixed inset-0 top-[60px] bg-background-dark/95 backdrop-blur-xl transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
          }`}>
          <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 px-4 py-4 text-lg font-medium rounded-xl transition-all ${location.pathname === link.path
                      ? 'text-primary-400 bg-primary-400/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto border-t border-white/10 pt-6">
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 px-4 py-2 text-gray-300">
                    <FiUser className="text-2xl text-primary-400" />
                    <span className="text-lg font-medium">{user?.name}</span>
                  </div>
                  <button onClick={logout} className="btn btn-secondary w-full justify-center">
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary w-full justify-center">
                  <FiLogIn />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
