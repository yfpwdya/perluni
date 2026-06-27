import { NavLink } from 'react-router-dom';
import { FiFileText, FiGrid, FiMessageSquare, FiUsers } from 'react-icons/fi';

const tabs = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/feedback', label: 'Feedback', icon: <FiMessageSquare /> },
  { to: '/admin/publikasi', label: 'Publikasi', icon: <FiFileText /> },
  { to: '/admin/members', label: 'Data Anggota', icon: <FiUsers /> },
  { to: '/admin/users', label: 'Role User', icon: <FiUsers /> },
];

const AdminTabs = () => {
  return (
    <nav className="mt-5 rounded-2xl border border-brand-300/20 bg-[#1c1c1c] p-2 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/admin'}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-gradient text-white shadow-glow'
                  : 'text-[#a0a0a0] hover:bg-[#2c2c2c] hover:text-white'
              }`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default AdminTabs;
