import { useEffect, useMemo, useState } from 'react';
import { FiRefreshCcw, FiSearch, FiUserCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [keyword, setKeyword] = useState('');
  const [savingId, setSavingId] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.getUsers();
      setItems(response.data?.data?.users || []);
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Gagal memuat daftar user.');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return items;

    return items.filter((item) =>
      [item.name, item.email]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q))
    );
  }, [items, keyword]);

  const updateRole = async (targetUser, role) => {
    if (targetUser.role === role) return;

    setSavingId(targetUser.id);
    setError('');

    try {
      await authAPI.updateUserRole(targetUser.id, role);
      await fetchUsers();
    } catch (saveError) {
      setError(saveError.response?.data?.message || 'Gagal memperbarui role user.');
    } finally {
      setSavingId('');
    }
  };

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-white/80">Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Manajemen Role User</h1>
        <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
          Kelola role akses user untuk mengatur siapa yang memiliki hak admin.
        </p>
      </section>

      <section className="card mt-5 p-4 md:p-5 border-brand-100/70">
        <div className="grid md:grid-cols-[1fr_auto] gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input-base pl-10"
              placeholder="Cari user berdasarkan nama/email"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>

          <button type="button" onClick={fetchUsers} className="btn btn-secondary text-sm">
            <FiRefreshCcw /> Refresh
          </button>
        </div>
      </section>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}

      <section className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat user...</p>
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((item) => {
            const isSelf = currentUser?.id === item.id;
            const roleValue = item.role || 'user';

            return (
              <article key={item.id} className="card p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 inline-flex items-center gap-2">
                      <FiUserCheck className="text-brand-600" /> {item.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{item.email}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Bergabung {new Date(item.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>

                  <div className="md:w-56">
                    <select
                      className="input-base"
                      value={roleValue}
                      disabled={savingId === item.id || isSelf}
                      onChange={(e) => updateRole(item, e.target.value)}
                    >
                      <option value="user">user</option>
                      <option value="admin">admin</option>
                    </select>
                    {isSelf && <p className="text-[11px] text-slate-400 mt-1">Role akun login saat ini tidak diubah dari sini.</p>}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <p className="text-sm text-slate-500">Tidak ada user yang cocok dengan pencarian.</p>
        )}
      </section>
    </div>
  );
};

export default AdminUsers;
