# Panduan Mendapatkan Sengrid API Key

Berikut adalah langkah-langkah untuk mendapatkan API Key dari SendGrid:

## 1. Mendaftar Akun SendGrid
1. Buka [SendGrid Website](https://sendgrid.com/).
2. Klik **Start for Free** atau **Sign Up**.
3. Isi formulir pendaftaran dan verifikasi email Anda.

## 2. Membuat Sender Identity (Wajib)
Sebelum bisa mengirim email, Anda harus memverifikasi identitas pengirim.
1. Masuk ke Dashboard SendGrid.
2. Di menu sebelah kiri, pilih **Settings** > **Sender Authentication**.
3. Klik **Verify a Single Sender**.
4. Klik **Create New Sender**.
5. Isi formulir dengan detail Anda:
   - **From Name**: Nama Pengirim (misal: Perluni App)
   - **From Email**: Email yang akan digunakan untuk mengirim (misal: email pribadi Anda atau email bisnis). **Email ini harus sama dengan `SENDGRID_FROM_EMAIL` di file `.env`.**
   - **Reply To**: Email untuk balasan.
   - Isi alamat fisik (sesuai regulasi anti-spam).
6. Klik **Create**.
7. Cek inbox email tersebut dan klik link verifikasi dari SendGrid.

## 3. Membuat API Key
1. Di Dashboard, pilih **Settings** > **API Keys**.
2. Klik tombol biru **Create API Key**.
3. **API Key Name**: Beri nama, misalnya `Perluni Backend`.
4. **API Key Permissions**: Pilih **Full Access**.
5. Klik **Create & View**.
6. **PENTING:** Copy API Key yang muncul (awalan `SG.`). Kunci ini hanya muncul SEKALI.
7. Paste API Key tersebut ke file `.env` di variabel `SENDGRID_API_KEY`.

## Konfigurasi di Project Perluni
Pastikan file `.env` Anda memiliki baris berikut:

```env
SENDGRID_API_KEY=SG.paste_kunci_anda_disini
SENDGRID_FROM_EMAIL=email_yang_sudah_diverifikasi@example.com
```

Setelah konfigurasi selesai, restart server backend (`npm run dev`) jika perlu, dan coba fitur register.
