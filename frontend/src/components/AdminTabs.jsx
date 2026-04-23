import { NavLink } from 'react-router-dom';
import { FiFileText, FiGrid, FiMessageSquare, FiUsers } from 'react-icons/fi';

const tabs = [
  { to: '/admin', label: 'Dashboard', icon: <FiGrid /> },
  { to: '/admin/feedback', label: 'Feedback', icon: <FiMessageSquare /> },
  { to: '/admin/publikasi', label: 'Publikasi', icon: <FiFileText /> },
  { to: '/admin/users', label: 'Role User', icon: <FiUsers /> },
];

const AdminTabs = () => {
  return (
    <nav className="mt-5 rounded-2xl border border-slate-200 bg-white p-2 overflow-x-auto">
      <div className="flex min-w-max gap-2">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === '/admin'}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-brand-300 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
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
