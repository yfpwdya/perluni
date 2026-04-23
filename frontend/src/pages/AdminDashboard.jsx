import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiShield, FiUsers } from 'react-icons/fi';
import { articlesAPI, authAPI, feedbackAPI } from '../services/api';

const fallbackStats = {
  feedbackTotal: 0,
  feedbackNew: 0,
  articleTotal: 0,
  articlePublished: 0,
  articleDraft: 0,
  userTotal: 0,
};

const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(fallbackStats);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      try {
        const [feedbackRes, articleAllRes, articlePublishedRes, articleDraftRes, usersRes] = await Promise.all([
          feedbackAPI.getAll({ status: 'all', page: 1, limit: 1 }),
          articlesAPI.getAll({ page: 1, limit: 1 }),
          articlesAPI.getAll({ status: 'published', page: 1, limit: 1 }),
          articlesAPI.getAll({ status: 'draft', page: 1, limit: 1 }),
          authAPI.getUsers(),
        ]);

        const feedbackStats = feedbackRes.data?.data?.stats || {};

        setStats({
          feedbackTotal: feedbackStats.total || 0,
          feedbackNew: feedbackStats.new || 0,
          articleTotal: articleAllRes.data?.data?.pagination?.total || 0,
          articlePublished: articlePublishedRes.data?.data?.pagination?.total || 0,
          articleDraft: articleDraftRes.data?.data?.pagination?.total || 0,
          userTotal: usersRes.data?.data?.total || 0,
        });
      } catch {
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Feedback Baru',
      value: stats.feedbackNew,
      helper: 'Masukan yang belum direview',
      icon: <FiMessageSquare className="text-brand-600" />,
    },
    {
      title: 'Total Feedback',
      value: stats.feedbackTotal,
      helper: 'Semua data masukan',
      icon: <FiMessageSquare className="text-brand-600" />,
    },
    {
      title: 'Publikasi',
      value: stats.articleTotal,
      helper: `${formatNumber(stats.articlePublished)} published • ${formatNumber(stats.articleDraft)} draft`,
      icon: <FiFileText className="text-brand-600" />,
    },
    {
      title: 'User',
      value: stats.userTotal,
      helper: 'Total akun terdaftar',
      icon: <FiUsers className="text-brand-600" />,
    },
  ];

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-white/80">Admin</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Dashboard Admin Organisasi</h1>
        <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
          Akses cepat untuk feedback, publikasi, dan manajemen role pengguna.
        </p>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((item) => (
          <article key={item.title} className="card p-4 border-brand-100/70">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-slate-500">{item.title}</p>
              {item.icon}
            </div>
            <p className="text-2xl font-semibold text-slate-900 mt-2">{loading ? '...' : formatNumber(item.value)}</p>
            <p className="text-xs text-slate-500 mt-1">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-3">
        <Link to="/admin/feedback" className="card p-5 hover:border-brand-200 transition-colors">
          <p className="text-xs uppercase tracking-wide text-slate-500">Modul</p>
          <p className="text-lg font-semibold mt-2 text-slate-900">Manajemen Feedback</p>
          <p className="text-sm text-slate-600 mt-2">Review masukan anggota, filter status, dan tandai reviewed.</p>
        </Link>

        <Link to="/admin/publikasi" className="card p-5 hover:border-brand-200 transition-colors">
          <p className="text-xs uppercase tracking-wide text-slate-500">Modul</p>
          <p className="text-lg font-semibold mt-2 text-slate-900">Manajemen Publikasi</p>
          <p className="text-sm text-slate-600 mt-2">Tambah, edit, dan hapus artikel publikasi organisasi.</p>
        </Link>

        <Link to="/admin/users" className="card p-5 hover:border-brand-200 transition-colors">
          <p className="text-xs uppercase tracking-wide text-slate-500">Modul</p>
          <p className="text-lg font-semibold mt-2 text-slate-900">Manajemen Role User</p>
          <p className="text-sm text-slate-600 mt-2">Promote/demote role user untuk kebutuhan akses admin.</p>
        </Link>
      </section>

      <section className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/60 p-4 text-sm text-slate-700">
        <p className="inline-flex items-center gap-2">
          <FiShield className="text-brand-700" />
          Gunakan akses admin hanya untuk kebutuhan operasional organisasi.
        </p>
      </section>
    </div>
  );
};

export default AdminDashboard;
