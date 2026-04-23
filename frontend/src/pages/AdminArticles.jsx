import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash2 } from 'react-icons/fi';
import { articlesAPI } from '../services/api';

const categoryOptions = ['berita', 'pengumuman', 'kegiatan', 'artikel'];
const statusOptions = ['all', 'published', 'draft'];

const defaultForm = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: 'artikel',
  status: 'draft',
  tags: '',
};

const AdminArticles = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');

  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState('');

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await articlesAPI.getAll({
        page,
        limit: 10,
        ...(status !== 'all' ? { status } : {}),
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const payload = response.data?.data;
      setItems(payload?.articles || []);
      setPagination(payload?.pagination || { page: 1, pages: 1, total: 0, limit: 10 });
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Gagal memuat publikasi admin.');
      setItems([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: 10 });
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim(),
      coverImage: form.coverImage.trim() || null,
      category: form.category,
      status: form.status,
      tags: form.tags,
    };

    try {
      if (editingId) {
        await articlesAPI.update(editingId, payload);
      } else {
        await articlesAPI.create(payload);
      }

      resetForm();
      await fetchArticles();
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Gagal menyimpan publikasi.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      excerpt: item.excerpt || '',
      content: item.content || '',
      coverImage: item.coverImage || '',
      category: item.category || 'artikel',
      status: item.status || 'draft',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus publikasi ini?')) return;

    setError('');
    try {
      await articlesAPI.delete(id);
      await fetchArticles();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Gagal menghapus publikasi.');
    }
  };

  const totalPages = Math.max(Number(pagination.pages) || 1, 1);

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-white/80">Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Manajemen Publikasi</h1>
        <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
          Kelola artikel organisasi: tambah, edit, atur status draft/published, dan hapus konten.
        </p>
      </section>

      <section className="card mt-5 p-5 border-brand-100/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="text-lg font-semibold">{editingId ? 'Edit Publikasi' : 'Tambah Publikasi Baru'}</h2>
          {editingId && (
            <button type="button" className="btn btn-secondary text-sm" onClick={resetForm}>
              Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            className="input-base"
            placeholder="Judul publikasi"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />

          <div className="grid md:grid-cols-3 gap-3">
            <select
              className="input-base"
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
            >
              {categoryOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              className="input-base"
              value={form.status}
              onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>

            <input
              className="input-base"
              placeholder="Tags (pisahkan koma)"
              value={form.tags}
              onChange={(e) => setForm((prev) => ({ ...prev, tags: e.target.value }))}
            />
          </div>

          <input
            className="input-base"
            placeholder="URL cover image (opsional)"
            value={form.coverImage}
            onChange={(e) => setForm((prev) => ({ ...prev, coverImage: e.target.value }))}
          />

          <textarea
            className="input-base min-h-24"
            placeholder="Ringkasan publikasi"
            value={form.excerpt}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
          />

          <textarea
            className="input-base min-h-40"
            placeholder="Konten publikasi"
            value={form.content}
            onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
            required
          />

          <button type="submit" className="btn btn-primary w-fit" disabled={submitting}>
            <FiPlus /> {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Publikasi'}
          </button>
        </form>
      </section>

      <section className="card mt-5 p-4 md:p-5 border-brand-100/70">
        <div className="grid md:grid-cols-[1fr_180px_auto] gap-3">
          <input
            className="input-base"
            placeholder="Cari judul/konten publikasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="input-base"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            {statusOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button type="button" className="btn btn-secondary text-sm" onClick={fetchArticles}>
            <FiRefreshCcw /> Refresh
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">Total publikasi: {pagination.total}</p>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <section className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat data publikasi...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <article key={item.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip capitalize">{item.category}</span>
                    <span className={`chip ${item.status === 'published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold mt-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mt-1 line-clamp-2">{item.excerpt || 'Tanpa ringkasan'}</p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => handleEdit(item)}>
                    <FiEdit2 /> Edit
                  </button>
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => handleDelete(item.id)}>
                    <FiTrash2 /> Hapus
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">Belum ada publikasi yang cocok dengan filter.</p>
        )}
      </section>

      <section className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Halaman {pagination.page} dari {totalPages}
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
            disabled={page >= totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Berikutnya
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminArticles;
