import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FiArrowLeft, FiClock } from 'react-icons/fi';
import { articlesAPI } from '../services/api';

const PublicationDetail = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError('');

      try {
        const response = await articlesAPI.getById(id);
        setArticle(response.data?.data?.article || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Publikasi tidak ditemukan.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container-app py-8">
        <p className="text-sm text-slate-500">Memuat detail publikasi...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="container-app py-8">
        <div className="card p-6">
          <p className="text-slate-700">{error || 'Data publikasi tidak tersedia.'}</p>
          <Link to="/publikasi" className="btn btn-secondary mt-4">
            <FiArrowLeft /> Kembali ke Publikasi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8">
      <Link to="/publikasi" className="btn btn-secondary text-sm">
        <FiArrowLeft /> Kembali ke Publikasi
      </Link>

      <article className="card p-6 md:p-8 mt-4">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="chip capitalize">{article.category || 'publikasi'}</span>
          <span className="text-xs text-slate-400 inline-flex items-center gap-1">
            <FiClock />
            {new Date(article.createdAt).toLocaleDateString('id-ID', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold leading-snug">{article.title}</h1>
        <p className="text-sm text-slate-500 mt-3">Ditulis oleh {article.author?.name || 'Admin Perluni'}</p>

        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="mt-5 rounded-2xl w-full max-h-[420px] object-cover border border-slate-200"
          />
        )}

        <div className="max-w-none mt-6 whitespace-pre-line text-slate-700 leading-relaxed text-sm md:text-base">
          {article.content}
        </div>
      </article>
    </div>
  );
};

export default PublicationDetail;
