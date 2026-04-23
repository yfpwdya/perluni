import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiCheckCircle,
  FiClock,
  FiRefreshCcw,
  FiSearch,
  FiShield,
  FiUser,
} from 'react-icons/fi';
import { feedbackAPI } from '../services/api';

const statusOptions = [
  { value: 'all', label: 'Semua' },
  { value: 'new', label: 'Baru' },
  { value: 'reviewed', label: 'Sudah Direview' },
];

const defaultPagination = { page: 1, pages: 1, total: 0, limit: 10 };
const defaultStats = { total: 0, new: 0, reviewed: 0, filtered: 0 };

const formatDateTime = (value) =>
  new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatNumber = (value) => new Intl.NumberFormat('id-ID').format(Number(value || 0));

const AdminFeedback = () => {
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [debouncedKeyword, setDebouncedKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(defaultStats);
  const [pagination, setPagination] = useState(defaultPagination);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [keyword]);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await feedbackAPI.getAll({
        status,
        page,
        limit: 10,
        ...(debouncedKeyword ? { search: debouncedKeyword } : {}),
      });

      const payload = response.data?.data;
      const incomingPagination = payload?.pagination || defaultPagination;

      setItems(payload?.feedbacks || []);
      setPagination(incomingPagination);
      setStats({
        ...(payload?.stats || defaultStats),
        filtered: payload?.stats?.filtered ?? incomingPagination.total ?? 0,
      });
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Gagal memuat feedback. Coba refresh.');
      setItems([]);
      setStats(defaultStats);
      setPagination(defaultPagination);
    } finally {
      setLoading(false);
    }
  }, [status, page, debouncedKeyword]);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const summaryCards = useMemo(
    () => [
      {
        label: 'Total Feedback',
        value: formatNumber(stats.total),
        helper: 'Semua masukan yang tersimpan',
      },
      {
        label: 'Feedback Baru',
        value: formatNumber(stats.new),
        helper: 'Perlu ditindaklanjuti',
      },
      {
        label: 'Sudah Direview',
        value: formatNumber(stats.reviewed),
        helper: 'Sudah diproses admin',
      },
      {
        label: 'Hasil Filter Aktif',
        value: formatNumber(stats.filtered),
        helper: debouncedKeyword ? `Pencarian: “${debouncedKeyword}”` : 'Sesuai status & halaman saat ini',
      },
    ],
    [stats, debouncedKeyword]
  );

  const handleMarkReviewed = async (id) => {
    setActionLoadingId(id);
    setError('');

    try {
      await feedbackAPI.markReviewed(id);
      await fetchFeedbacks();
    } catch (actionError) {
      setError(actionError.response?.data?.message || 'Gagal menandai feedback sebagai reviewed.');
    } finally {
      setActionLoadingId('');
    }
  };

  const totalPages = Math.max(Number(pagination.pages) || 1, 1);

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-wide text-white/80">Admin Panel</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Dashboard Feedback Organisasi</h1>
          <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
            Lihat ringkasan feedback, cari nama/email anggota, lalu tandai masukan yang sudah direview.
          </p>
        </div>
      </section>

      <section className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((item) => (
          <article key={item.label} className="card p-4 border-brand-100/70">
            <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
            <p className="text-2xl font-semibold text-slate-900 mt-2">{item.value}</p>
            <p className="text-xs text-slate-500 mt-1">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="card mt-5 p-4 md:p-5 border-brand-100/70">
        <div className="grid md:grid-cols-[1fr_auto] gap-3 md:items-center">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={keyword}
              onChange={(event) => {
                setKeyword(event.target.value);
                setPage(1);
              }}
              className="input-base pl-10"
              placeholder="Cari feedback berdasarkan nama atau email..."
            />
          </div>

          <button type="button" onClick={fetchFeedbacks} className="btn btn-secondary text-sm">
            <FiRefreshCcw /> Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setStatus(option.value);
                setPage(1);
              }}
              className={`px-3 py-2 text-xs md:text-sm rounded-lg border transition-colors ${
                status === option.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Menampilkan {formatNumber(pagination.total)} feedback
          {debouncedKeyword ? ` untuk kata kunci “${debouncedKeyword}”` : ''}.
        </p>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat feedback...</p>
        ) : items.length > 0 ? (
          items.map((item) => {
            const isReviewed = item.status === 'reviewed';

            return (
              <article key={item.id} className="card p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`chip ${isReviewed ? 'bg-green-50 text-green-700' : ''}`}>
                        {isReviewed ? 'Sudah Direview' : 'Baru'}
                      </span>

                      {item.sourcePage && (
                        <span className="chip bg-slate-100 text-slate-600">
                          <FiShield className="text-xs" /> {item.sourcePage}
                        </span>
                      )}

                      <span className="text-xs text-slate-400 inline-flex items-center gap-1">
                        <FiClock />
                        {formatDateTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-900 inline-flex items-center gap-2">
                      <FiUser className="text-brand-600" /> {item.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.email || 'Email tidak dicantumkan'}</p>
                    <p className="text-sm text-slate-700 mt-3 whitespace-pre-wrap">{item.message}</p>
                  </div>

                  <div className="md:w-52">
                    <button
                      type="button"
                      onClick={() => handleMarkReviewed(item.id)}
                      disabled={isReviewed || actionLoadingId === item.id}
                      className={`btn w-full text-sm ${
                        isReviewed ? 'btn-secondary cursor-not-allowed opacity-70' : 'btn-primary'
                      }`}
                    >
                      {actionLoadingId === item.id ? (
                        'Memproses...'
                      ) : isReviewed ? (
                        <>
                          <FiCheckCircle /> Reviewed
                        </>
                      ) : (
                        <>
                          <FiCheckCircle /> Tandai Reviewed
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">Belum ada feedback yang cocok dengan filter atau pencarian ini.</p>
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

export default AdminFeedback;
