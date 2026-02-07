# Perluni - Website Organisasi

Website organisasi modern menggunakan React, Express, dan MongoDB (MERN Stack).

## 📁 Struktur Project

```
Perluni/
├── backend/          # Express.js API Server
│   ├── src/
│   │   ├── config/       # Database configuration
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Auth middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Helper functions
│   ├── .env             # Environment variables
│   ├── package.json
│   └── server.js        # Entry point
│
├── frontend/         # React.js Application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── context/      # React Context
│   │   ├── hooks/        # Custom hooks
│   │   ├── layouts/      # Page layouts
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── styles/       # CSS files
│   │   └── utils/        # Helper functions
│   ├── .env
│   └── package.json
│
└── README.md
```

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (atau MongoDB lokal)

### Setup Backend

1. Masuk ke folder backend:
   ```bash
   cd backend
   ```

2. Edit file `.env` dan masukkan MongoDB URI Anda:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   JWT_EXPIRES_IN=7d
   ```

3. Jalankan server:
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:5000`

### Setup Frontend

1. Masuk ke folder frontend:
   ```bash
   cd frontend
   ```

2. Jalankan development server:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:5173`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Articles
- `GET /api/articles` - Get semua artikel
- `GET /api/articles/:id` - Get artikel by ID
- `POST /api/articles` - Buat artikel baru (admin only)
- `PUT /api/articles/:id` - Update artikel (admin only)
- `DELETE /api/articles/:id` - Delete artikel (admin only)

### Health Check
- `GET /api/health` - Cek status server

## 📝 Fitur

- ✅ Landing page modern dengan animasi
- ✅ Halaman About dengan visi, misi & timeline
- ✅ Halaman Articles dengan search & filter
- ✅ Halaman Contact dengan form
- ✅ Login & Authentication dengan JWT
- ✅ Responsive design untuk mobile
- ✅ Dark theme dengan glassmorphism

## 🛠️ Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- React Icons
- Vite

### Backend
- Express.js
- Mongoose (MongoDB ODM)
- JWT (JSON Web Token)
- bcryptjs
- CORS
- dotenv

## 📧 Kontak

Untuk pertanyaan, silakan hubungi team developer.
