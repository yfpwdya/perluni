import { useCallback, useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiRefreshCcw, FiTrash2, FiX } from 'react-icons/fi';
import { sensusAPI } from '../services/api';
import AdminTabs from '../components/AdminTabs';

const defaultForm = {
  name: '',
  gender: '',
  origin: '',
  university: '',
  major: '',
  educationLevel: '',
  entryYear: '',
  duration: '',
  hospital: '',
  scholarshipType: '',
  remarks: '',
  category: 'mahasiswa',
  sourceSheet: 'Manual Entry',
};

const AdminMembers = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 20 });

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [auditLoading, setAuditLoading] = useState(false);
  const [selectedAuditMember, setSelectedAuditMember] = useState(null);
  const [auditRows, setAuditRows] = useState([]);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await sensusAPI.getMembersAdmin({
        page,
        limit: 20,
        category,
        status,
        ...(search.trim() ? { search: search.trim() } : {}),
      });

      const payload = response.data?.data;
      setItems(payload?.members || []);
      setPagination(payload?.pagination || { page: 1, pages: 1, total: 0, limit: 20 });
    } catch (fetchError) {
      setError(fetchError.response?.data?.message || 'Gagal memuat data anggota.');
      setItems([]);
      setPagination({ page: 1, pages: 1, total: 0, limit: 20 });
    } finally {
      setLoading(false);
    }
  }, [page, category, status, search]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    const payload = {
      ...form,
      entryYear: form.entryYear ? Number(form.entryYear) : null,
    };

    try {
      if (editingId) {
        await sensusAPI.updateMember(editingId, payload);
      } else {
        await sensusAPI.createMember(payload);
      }

      resetForm();
      await fetchMembers();
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Gagal menyimpan data anggota.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      gender: item.gender || '',
      origin: item.origin || '',
      university: item.university || '',
      major: item.major || '',
      educationLevel: item.education_level || '',
      entryYear: item.entry_year || '',
      duration: item.duration || '',
      hospital: item.hospital || '',
      scholarshipType: item.scholarship_type || '',
      remarks: item.remarks || '',
      category: item.category || 'mahasiswa',
      sourceSheet: item.sheet || 'Manual Entry',
    });
  };

  const handleDeactivate = async (id) => {
    if (!window.confirm('Nonaktifkan member ini?')) return;

    try {
      await sensusAPI.deactivateMember(id);
      await fetchMembers();
    } catch (deleteError) {
      setError(deleteError.response?.data?.message || 'Gagal menonaktifkan member.');
    }
  };

  const handleLoadAudits = async (item) => {
    setAuditLoading(true);
    setSelectedAuditMember(item);
    setAuditRows([]);

    try {
      const response = await sensusAPI.getMemberAudits(item.id);
      setAuditRows(response.data?.data?.audits || []);
    } catch (auditError) {
      setError(auditError.response?.data?.message || 'Gagal memuat audit trail member.');
    } finally {
      setAuditLoading(false);
    }
  };

  const totalPages = Math.max(Number(pagination.pages) || 1, 1);

  return (
    <div className="container-app py-8">
      <section className="rounded-3xl bg-brand-gradient text-white p-6 md:p-8 shadow-soft">
        <p className="text-xs uppercase tracking-wide text-white/80">Admin Panel</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mt-2">Manajemen Data Anggota</h1>
        <p className="text-white/90 mt-3 max-w-2xl text-sm md:text-base">
          CRUD data member organisasi dengan logging audit untuk keamanan dan jejak perubahan.
        </p>
      </section>

      <AdminTabs />

      <section className="card mt-5 p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">{editingId ? 'Edit Member' : 'Tambah Member Baru'}</h2>
          {editingId && (
            <button type="button" className="btn btn-secondary text-sm" onClick={resetForm}>
              <FiX /> Batal Edit
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid md:grid-cols-2 gap-3">
            <input className="input-base" placeholder="Nama" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
            <input className="input-base" placeholder="Jenis Kelamin" value={form.gender} onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))} />
            <input className="input-base" placeholder="Asal" value={form.origin} onChange={(e) => setForm((p) => ({ ...p, origin: e.target.value }))} />
            <input className="input-base" placeholder="Universitas" value={form.university} onChange={(e) => setForm((p) => ({ ...p, university: e.target.value }))} />
            <input className="input-base" placeholder="Program Studi" value={form.major} onChange={(e) => setForm((p) => ({ ...p, major: e.target.value }))} />
            <input className="input-base" placeholder="Jenjang" value={form.educationLevel} onChange={(e) => setForm((p) => ({ ...p, educationLevel: e.target.value }))} />
            <input className="input-base" type="number" min="1950" max="2100" placeholder="Tahun Masuk" value={form.entryYear} onChange={(e) => setForm((p) => ({ ...p, entryYear: e.target.value }))} />
            <input className="input-base" placeholder="Durasi" value={form.duration} onChange={(e) => setForm((p) => ({ ...p, duration: e.target.value }))} />
            <input className="input-base" placeholder="Rumah Sakit/Afiliasi" value={form.hospital} onChange={(e) => setForm((p) => ({ ...p, hospital: e.target.value }))} />
            <input className="input-base" placeholder="Jenis Beasiswa" value={form.scholarshipType} onChange={(e) => setForm((p) => ({ ...p, scholarshipType: e.target.value }))} />
            <select className="input-base" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
              <option value="mahasiswa">mahasiswa</option>
              <option value="alumni">alumni</option>
            </select>
            <input className="input-base" placeholder="Source Sheet" value={form.sourceSheet} onChange={(e) => setForm((p) => ({ ...p, sourceSheet: e.target.value }))} required />
          </div>

          <textarea className="input-base min-h-20" placeholder="Catatan" value={form.remarks} onChange={(e) => setForm((p) => ({ ...p, remarks: e.target.value }))} />

          <button type="submit" className="btn btn-primary w-fit" disabled={submitting}>
            <FiPlus /> {submitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Member'}
          </button>
        </form>
      </section>

      <section className="card mt-5 p-4 md:p-5">
        <div className="grid md:grid-cols-[1fr_180px_180px_auto] gap-3">
          <input
            className="input-base"
            placeholder="Cari nama/universitas/prodi"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select className="input-base" value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
            <option value="all">Semua Kategori</option>
            <option value="mahasiswa">Mahasiswa</option>
            <option value="alumni">Alumni</option>
          </select>
          <select className="input-base" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <button type="button" className="btn btn-secondary text-sm" onClick={fetchMembers}>
            <FiRefreshCcw /> Refresh
          </button>
        </div>

        <p className="text-xs text-slate-500 mt-3">Total anggota (hasil filter): {pagination.total}</p>
      </section>

      {error && <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</div>}

      <section className="mt-5 space-y-3">
        {loading ? (
          <p className="text-sm text-slate-500">Memuat data anggota...</p>
        ) : items.length > 0 ? (
          items.map((item) => (
            <article key={item.id} className="card p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip capitalize">{item.category}</span>
                    <span className={`chip ${item.is_active ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {item.is_active ? 'aktif' : 'nonaktif'}
                    </span>
                  </div>
                  <p className="text-base font-semibold text-white mt-2">{item.name}</p>
                  <p className="text-sm text-slate-400 mt-1">{item.university || '-'} • {item.major || '-'}</p>
                  <p className="text-xs text-slate-400 mt-1">{item.sheet || 'Manual Entry'}</p>
                </div>

                <div className="flex gap-2 shrink-0 flex-wrap">
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => handleEdit(item)}>
                    <FiEdit2 /> Edit
                  </button>
                  <button type="button" className="btn btn-secondary text-sm" onClick={() => handleLoadAudits(item)}>
                    Audit
                  </button>
                  {item.is_active && (
                    <button type="button" className="btn btn-secondary text-sm" onClick={() => handleDeactivate(item.id)}>
                      <FiTrash2 /> Nonaktifkan
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="text-sm text-slate-500">Belum ada data anggota yang cocok dengan filter.</p>
        )}
      </section>

      {selectedAuditMember && (
        <section className="card mt-5 p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-white">Audit Trail: {selectedAuditMember.name}</h3>
              <p className="text-xs text-slate-500 mt-1">Menampilkan histori create/update/deactivate data anggota.</p>
            </div>
            <button
              type="button"
              className="btn btn-secondary text-sm"
              onClick={() => {
                setSelectedAuditMember(null);
                setAuditRows([]);
              }}
            >
              <FiX /> Tutup
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {auditLoading ? (
              <p className="text-sm text-slate-500">Memuat audit trail...</p>
            ) : auditRows.length > 0 ? (
              auditRows.map((audit) => (
                <article key={audit.id} className="rounded-xl border border-slate-700 bg-slate-800/50 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip capitalize">{audit.action}</span>
                    <span className="text-xs text-slate-500">{new Date(audit.createdAt).toLocaleString('id-ID')}</span>
                    <span className="text-xs text-slate-500">oleh {audit.actor?.name || 'System'}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Changed fields: {(audit.changedFields || []).join(', ') || '-'}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-500">Belum ada data audit.</p>
            )}
          </div>
        </section>
      )}

      <section className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-400">Halaman {pagination.page} dari {totalPages}</p>
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

export default AdminMembers;
