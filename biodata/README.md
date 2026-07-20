# Student Insight Form — Panduan Setup

Aplikasi profiling siswa kelas 11 Fisika (Kurikulum Merdeka).

## Struktur File

```
BIODATA/
├── index.html       ← Aplikasi web utama (buka ini di browser)
├── style.css        ← Desain glassmorphism + bento grid
├── app.js           ← Logika form, validasi, submit
├── gas/
│   └── Code.gs      ← Backend Google Apps Script
└── README.md
```

## Langkah Setup Backend (Google Apps Script)

### 1. Buat Apps Script Project
1. Buka [https://script.google.com](https://script.google.com)
2. Klik **New Project**
3. Hapus isi default, lalu copy-paste seluruh isi `gas/Code.gs`
4. Beri nama project: `Student Insight Form`

### 2. Buat Database Spreadsheet (sekali jalan)
1. Di editor Apps Script, pilih fungsi **`setupSpreadsheet`** dari dropdown
2. Klik **▶ Run**
3. Setujui permission yang diminta
4. Cek **Execution log** untuk URL Spreadsheet yang baru dibuat

### 3. (Opsional) Buat Google Form Backup
1. Pilih fungsi **`setupGoogleForm`** → klik **▶ Run**
2. Google Form akan otomatis dibuat dan terhubung ke Spreadsheet yang sama

### 4. Deploy Web App
1. Klik **Deploy** → **New Deployment**
2. Pilih type: **Web App**
3. Konfigurasi:
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Klik **Deploy** → Copy **Web App URL**

### 5. Hubungkan ke Front-End
1. Buka file `app.js`
2. Ganti nilai `GAS_URL` di baris paling atas:
   ```js
   const GAS_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec';
   ```
3. Simpan file

### 6. Deploy Front-End
Karena ini adalah file HTML/CSS/JS statis, kamu bisa host di:
- **GitHub Pages** (gratis) — upload repo ke GitHub, aktifkan Pages
- **Netlify** / **Vercel** (gratis) — drag & drop folder
- **Google Sites** — embed via Custom Code widget
- Atau cukup buka `index.html` langsung di browser untuk testing lokal

## Cara Mengakses Data Siswa

1. Buka Google Spreadsheet yang dibuat pada langkah 2
2. Semua submission siswa tersimpan di sheet **Responses**
3. Bisa langsung di-filter, sort, atau export ke CSV

## Catatan Teknis

- **CORS**: Front-end menggunakan `mode: 'no-cors'` saat fetch ke Apps Script.
  Ini artinya response tidak bisa dibaca JS, tapi data tetap terkirim dengan benar.
  Halaman "Thank You" akan selalu muncul setelah submit (tidak bisa mendeteksi error server-side dari client).

- **Keamanan**: Spreadsheet hanya bisa diakses oleh akun Google yang menjalankan setup.
  Jangan ubah sharing ke "Anyone with link can edit".

- **Kuota Apps Script**: Gratis, cukup untuk ratusan submission per hari.
  Lebih dari cukup untuk 1–5 kelas (±150 siswa).
