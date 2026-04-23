import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiFileText, FiSearch } from 'react-icons/fi';
import { articlesAPI } from '../services/api';

const categoryOptions = [
  { value: 'all', label: 'Semua Kategori' },
  { value: 'berita', label: 'Berita' },
  { value: 'pengumuman', label: 'Pengumuman' },
  { value: 'kegiatan', label: 'Kegiatan' },
  { value: 'artikel', label: 'Artikel' },
];

const fallbackPublications = [
  {
    id: 'fallback-1',
    title: 'Laporan Organisasi Perluni 2024',
    excerpt: 'Ringkasan kegiatan tahunan, capaian program, dan rencana kerja organisasi.',
    category: 'laporan',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'fallback-2',
    title: 'Statistik Keanggotaan Perluni 2023',
    excerpt: 'Data agregat anggota berdasarkan universitas, kategori, dan angkatan.',
    category: 'statistik',
    createdAt: new Date().toISOString(),
  },
];

const Publications = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 9, total: 0, pages: 1 });

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);

      try {
        const response = await articlesAPI.getAll({
          page,
          limit: 9,
          ...(category !== 'all' ? { category } : {}),
          ...(search.trim() ? { search: search.trim() } : {}),
        });

        const payload = response.data?.data;
        setItems(payload?.articles || []);
        setPagination(payload?.pagination || { page: 1, limit: 9, total: 0, pages: 1 });
      } catch {
        setItems([]);
        setPagination({ page: 1, limit: 9, total: 0, pages: 1 });
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, [category, search, page]);

  const renderItems = useMemo(() => {
    if (items.length > 0) return items;
    if (!search.trim() && category === 'all' && page === 1) return fallbackPublications;
    return [];
  }, [items, search, category, page]);

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-white/80">Pusat Publikasi</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Publikasi Organisasi Perluni</h1>
          <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
            Dokumentasi kegiatan, pengumuman resmi, dan artikel organisasi dalam satu halaman.
          </p>
        </div>
      </section>

      <section className="card mt-5 p-4 md:p-5 border-brand-100/70">
        <div className="grid md:grid-cols-[1fr_220px] gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              className="input-base pl-10"
              placeholder="Cari judul atau konten publikasi..."
            />
          </div>

          <select
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
            className="input-base"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-slate-500 mt-3">Total data: {pagination.total}</p>
      </section>

      <section className="mt-5 grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat publikasi...</p>
        ) : renderItems.length > 0 ? (
          renderItems.map((item) => (
            <article key={item.id} className="card p-5 flex flex-col hover:-translate-y-0.5 transition-transform">
              <div className="flex items-center justify-between gap-2">
                <span className="chip capitalize">{item.category || 'publikasi'}</span>
                <FiFileText className="text-brand-600" />
              </div>

              <h3 className="text-base font-semibold text-slate-900 mt-3 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-slate-600 mt-2 line-clamp-3 flex-1">{item.excerpt || 'Tidak ada ringkasan.'}</p>

              <p className="text-xs text-slate-400 mt-4">
                {new Date(item.createdAt).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>

              {String(item.id).startsWith('fallback-') ? (
                <button type="button" className="btn btn-secondary mt-4 text-sm" disabled>
                  Belum tersedia detail
                </button>
              ) : (
                <Link to={`/publikasi/${item.id}`} className="btn btn-primary mt-4 text-sm">
                  Baca Detail <FiArrowRight />
                </Link>
              )}
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">Tidak ada publikasi yang cocok dengan filter.</p>
        )}
      </section>

      <section className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Halaman {pagination.page} dari {pagination.pages}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-secondary text-sm"
            disabled={page <= 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Sebelumnya
          </button>
          <button
            type="button"
            className="btn btn-secondary text-sm"
            disabled={page >= pagination.pages}
            onClick={() => setPage((prev) => Math.min(prev + 1, pagination.pages || 1))}
          >
            Berikutnya
          </button>
        </div>
      </section>
    </div>
  );
};

export default Publications;
