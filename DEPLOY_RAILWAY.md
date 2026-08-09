# Deploy Apotek Kusuma Sari ke Railway

Project ini memakai Next.js 14, Prisma 5, dan MySQL.

## 1. Upload project ke GitHub
Jangan upload folder `node_modules`, `.next`, atau file `.env` lokal.

## 2. Buat project Railway
- New Project
- Deploy from GitHub repo
- Pilih repository project ini

## 3. Tambahkan MySQL
Di Railway Project Canvas:
- `+ New`
- Database
- MySQL

## 4. Hubungkan DATABASE_URL
Pada service Next.js -> Variables, tambahkan:

`DATABASE_URL=${{MySQL.MYSQL_URL}}`

Jika nama service database bukan `MySQL`, sesuaikan nama service-nya.

## 5. Deploy
File `railway.json` sudah mengatur:
- Build: `npm run build`
- Pre-deploy migration: `npm run db:deploy`
- Start: `npm run start`
- Healthcheck: `/api/health`

## 6. Isi data database pertama kali
Setelah deploy dan migrasi berhasil, buka Shell/CLI service lalu jalankan satu kali:

`npm run db:seed`

Catatan: fitur rekomendasi utama juga membaca data dari `scripts/seed-data/dataobat_kusuma sari.xlsx` yang sudah disertakan di source.

## 7. Buat URL publik
Service Next.js -> Settings -> Networking -> Generate Domain.

## 8. Verifikasi
Buka:
- `/` halaman utama
- `/products` daftar obat
- `/api/health` harus menghasilkan JSON dengan `status: ok`
- Uji form rekomendasi sampai hasil obat muncul
