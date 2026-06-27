import { useEffect, useState, useMemo } from 'react';
import { FiMessageSquare, FiCheck, FiTrash2, FiClock, FiInbox } from 'react-icons/fi';
import { feedbackAPI, contactAPI } from '../services/api';
import AdminTabs from '../components/AdminTabs';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all'); // all | unread | read

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const [feedbackRes, contactRes] = await Promise.all([
        feedbackAPI.getAll({ status: 'all', limit: 100 }),
        contactAPI.getAll({ status: 'all', limit: 100 }),
      ]);

      const feedbacks = (feedbackRes.data?.data?.data || []).map((item) => ({
        ...item,
        type: 'feedback',
        isRead: item.status === 'reviewed',
      }));

      const contacts = (contactRes.data?.data || []).map((item) => ({
        ...item,
        type: 'contact',
        isRead: item.status === 'read',
      }));

      // Merge and sort by newest
      const merged = [...feedbacks, ...contacts].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setMessages(merged);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id, type) => {
    try {
      if (type === 'feedback') {
        await feedbackAPI.markReviewed(id);
      } else {
        await contactAPI.markRead(id);
      }
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isRead: true, status: type === 'feedback' ? 'reviewed' : 'read' } : msg
        )
      );
    } catch (error) {
      alert('Gagal menandai pesan.');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Yakin ingin menghapus pesan ini?')) return;
    try {
      if (type === 'feedback') {
        await feedbackAPI.delete(id);
      } else {
        await contactAPI.delete(id);
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    } catch (error) {
      alert('Gagal menghapus pesan.');
    }
  };

  const filteredMessages = useMemo(() => {
    if (filter === 'unread') return messages.filter((m) => !m.isRead);
    if (filter === 'read') return messages.filter((m) => m.isRead);
    return messages;
  }, [messages, filter]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="container-app py-8 min-h-screen bg-[#101010]">
      <section className="rounded-3xl bg-[#1c1c1c] border border-brand-300/20 text-white p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-300/10 blur-[80px]" />
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-widest text-brand-300 font-semibold flex items-center gap-2">
            <FiInbox /> Dashboard Admin
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">Kelola Pesan Masuk</h1>
          <p className="text-[#d4d4d4] mt-3 max-w-2xl text-sm md:text-base leading-relaxed">
            Daftar semua masukan dari form Feedback dan Kontak. Tandai pesan yang sudah ditindaklanjuti.
          </p>
        </div>
      </section>

      <div className="mb-6">
        <AdminTabs />
      </div>

      <section className="rounded-2xl border border-brand-300/20 bg-[#1c1c1c] p-5 md:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.4)] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-white">Inbox</h2>
            {unreadCount > 0 && (
              <span className="bg-brand-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <div className="flex bg-[#1c1c1c]/50 p-1 rounded-xl border border-[#2c2c2c]/50">
            {['all', 'unread', 'read'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  filter === tab
                    ? 'bg-brand-gradient text-white shadow-glow'
                    : 'text-[#a0a0a0] hover:text-white'
                }`}
              >
                {tab === 'all' ? 'Semua' : tab === 'unread' ? 'Belum Dibaca' : 'Sudah Dibaca'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4 relative z-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-[#1c1c1c]/50 rounded-xl" />
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="py-12 text-center relative z-10 border border-dashed border-[#2c2c2c] rounded-xl bg-[#1c1c1c]/20">
            <FiMessageSquare className="mx-auto text-4xl text-[#525252] mb-3" />
            <p className="text-[#a0a0a0] text-sm">Tidak ada pesan yang sesuai filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full text-left text-sm text-[#d4d4d4]">
              <thead className="text-xs uppercase bg-[#1c1c1c]/80 text-brand-300 border-b border-[#2c2c2c]">
                <tr>
                  <th className="px-4 py-3 rounded-tl-xl">Status</th>
                  <th className="px-4 py-3">Pengirim</th>
                  <th className="px-4 py-3">Subjek / Tipe</th>
                  <th className="px-4 py-3 min-w-[200px]">Pesan</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3 rounded-tr-xl text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2c2c2c]">
                {filteredMessages.map((msg) => (
                  <tr key={`${msg.type}-${msg.id}`} className="hover:bg-[#1c1c1c]/40 transition-colors">
                    <td className="px-4 py-3">
                      {msg.isRead ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                          <FiCheck /> Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-brand-500/10 text-brand-300 text-xs font-medium border border-brand-500/20">
                          <FiClock /> New
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{msg.name}</p>
                      <p className="text-xs text-[#737373]">{msg.email || '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white truncate max-w-[150px]" title={msg.subject || '-'}>
                        {msg.subject || '-'}
                      </p>
                      <p className="text-[10px] uppercase tracking-wider text-brand-400 mt-0.5">
                        {msg.type}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="line-clamp-2 text-xs leading-relaxed" title={msg.message}>
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap text-[#a0a0a0]">
                      {new Date(msg.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!msg.isRead && (
                          <button
                            onClick={() => handleMarkRead(msg.id, msg.type)}
                            className="p-1.5 text-brand-300 hover:bg-brand-500/20 rounded-lg transition-colors border border-transparent hover:border-brand-500/30"
                            title="Tandai dibaca"
                          >
                            <FiCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id, msg.type)}
                          className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
                          title="Hapus"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
