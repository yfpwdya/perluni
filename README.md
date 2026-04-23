# Perluni - Website Organisasi

Website organisasi berbasis **React + Express** dengan backend SQL (default: **PostgreSQL**).

## Tech Stack

### Frontend
- React (Vite)
- Axios
- React Router

### Backend
- Express.js
- Sequelize ORM
- PostgreSQL (recommended) / MySQL (opsional)
- JWT authentication
- SendGrid (opsional untuk verifikasi email)

---

## Struktur Project

```
Perluni/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    ├── .env
    └── package.json
```

---

## Setup Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Install dependency:
   ```bash
   npm install
   ```

3. Copy env file:
   ```bash
   cp .env.example .env
   ```

4. Isi konfigurasi database di `.env` (disarankan PostgreSQL):
   ```env
   DATABASE_URL=postgres://postgres:postgres@localhost:5432/perluni_db
   DB_DIALECT=postgres
   JWT_SECRET=your_secret
   JWT_EXPIRES_IN=7d
   ```

5. Jalankan server:
   ```bash
   npm run dev
   ```

Saat startup pertama, backend akan:
- membuat tabel SQL otomatis (`sequelize.sync`)
- mengimpor data sensus dari file Excel ke tabel `members` jika tabel masih kosong

---

## Setup Frontend

1. Masuk ke folder frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

Frontend default ke API:
`http://localhost:5000/api`

---

## Endpoint Utama

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/verify-email/:token`
- `GET /api/auth/me`
- `GET /api/auth/users` (admin)
- `PATCH /api/auth/users/:id/role` (admin)

### Sensus Organisasi
- `GET /api/sensus`
- `GET /api/sensus/search?query=...&category=mahasiswa|alumni|all`
- `GET /api/sensus/stats`
- `GET /api/sensus/universities`
- `GET /api/sensus/sheets`
- `GET /api/sensus/sheet/:sheetName`

### Artikel
- `GET /api/articles`
- `GET /api/articles/:id`
- `POST /api/articles` (admin)
- `PUT /api/articles/:id` (admin)
- `DELETE /api/articles/:id` (admin)

### Feedback Organisasi
- `POST /api/feedback` (publik)
- `GET /api/feedback` (admin) dengan query opsional:
  - `status=all|new|reviewed`
  - `search=nama/email`
  - `page` & `limit`
  - response menyertakan `stats` (total/new/reviewed/filtered)
- `PATCH /api/feedback/:id/review` (admin)

### Frontend Route
- `/` (landing organisasi: profil organisasi + container foto anggota di tengah + pencarian anggota)
- `/publikasi` (daftar publikasi + search, filter kategori, pagination)
- `/publikasi/:id` (detail publikasi)
- `/admin` (dashboard admin ringkas)
- `/admin/feedback` (dashboard admin feedback: ringkasan statistik + pencarian nama/email + review)
- `/admin/publikasi` (manajemen publikasi: create/edit/delete + filter)
- `/admin/users` (manajemen role user: promote/demote admin)

### Catatan UI
- Asset visual lokal:
  - `logo cina.avif` dipakai untuk branding (navbar/footer)
  - `foto cina.avif` difokuskan sebagai container foto anggota di halaman utama agar lebih relevan dengan scope organisasi.

---

## Catatan Migrasi

Backend sudah dimigrasikan dari MongoDB ke SQL.
Untuk kebutuhan organisasi dan data terstruktur (anggota, artikel, auth), **PostgreSQL lebih direkomendasikan** daripada MySQL karena dukungan query teks dan tipe data lebih fleksibel.
