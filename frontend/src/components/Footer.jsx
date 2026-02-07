import { Link } from 'react-router-dom';
import {
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiMail,
  FiPhone,
  FiMapPin
} from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary-900 border-t border-white/5 pt-16 pb-8 mt-auto text-white">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center gap-3 font-bold text-2xl text-white group">
              <img src="/logo cina.avif" alt="Perluni Logo" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
              <span className="bg-gradient-to-br from-primary-400 to-primary-600 bg-clip-text text-transparent">Perluni</span>
              <span className="text-white">Tiongkok</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-xs text-sm">
              Mewujudkan Perluni Tiongkok sebagai katalisator transformasi kesehatan global berbasis kolaborasi strategis dan inovasi berkelanjutan.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all transform hover:-translate-y-1" aria-label="Facebook">
                <FiFacebook className="text-lg" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all transform hover:-translate-y-1" aria-label="Twitter">
                <FiTwitter className="text-lg" />
              </a>
              <a href="https://www.instagram.com/perlunitiongkok" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all transform hover:-translate-y-1" aria-label="Instagram">
                <FiInstagram className="text-lg" />
              </a>
              <a href="#" className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:bg-primary-500 hover:border-primary-500 hover:text-white transition-all transform hover:-translate-y-1" aria-label="LinkedIn">
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Menu</h4>
            <ul className="flex flex-col gap-3 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">Beranda</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold text-white">Kontak</h4>
            <ul className="flex flex-col gap-3.5 text-sm">
              <li className="flex items-start gap-3 text-gray-400">
                <FiMapPin className="text-primary-400 text-xl shrink-0 mt-0.5" />
                <span>Dongzhimenwai Dajie No.4 Chaoyang District, Beijing, China
                </span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiPhone className="text-primary-400 text-xl shrink-0" />
                <span>+62 822-9975-1945</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <FiMail className="text-primary-400 text-xl shrink-0" />
                <span>contact@perluni.org</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm">&copy; {currentYear} Perluni Tiongkok. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
