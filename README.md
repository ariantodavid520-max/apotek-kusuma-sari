# Kusuma Sari Recommendation System

## Fitur Utama

1. Halaman beranda dengan desain gradasi mirip referensi Hero Farma.
2. Halaman Tentang Kami berisi visi, misi, dan komitmen.
3. Halaman Produk dengan pencarian obat, kategori, indikasi, dan keluhan.
4. Halaman Rekomendasi dengan input nama, usia, keluhan, durasi indikasi, dan riwayat penyakit.
5. API rekomendasi berbasis TF-IDF dan Cosine Similarity.
6. Database MySQL dengan Prisma ORM.
7. Seed data 300 obat non-resep dari Excel.
8. Riwayat hasil rekomendasi tersimpan di database.

## Struktur Folder

```txt
hero-farma-recommendation-system
├── app
│   ├── api
│   │   ├── health
│   │   └── recommendations
│   ├── about
│   ├── kontak
│   ├── products
│   ├── rekomendasi
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
├── docs
├── lib
├── prisma
│   ├── migrations
│   ├── schema.prisma
│   └── seed.ts
├── public
├── scripts
│   └── seed-data
├── sql
├── types
├── docker-compose.yml
├── package.json
└── README.md
```

## Cara Menjalankan

### 1. Siapkan database MySQL

Pilihan cepat memakai Docker:

```bash
docker compose up -d
```

Database otomatis dibuat dengan nama:

```txt
hero_farma
```

Koneksi default Docker:

```txt
mysql://hero_user:hero_password@localhost:3306/hero_farma
```

### 2. Buat file environment

Salin file contoh:

```bash
cp .env.example .env
```

Isi `.env`:

```env
DATABASE_URL="mysql://hero_user:hero_password@localhost:3306/hero_farma"
```

Jika memakai MySQL lokal tanpa Docker, sesuaikan user dan password.

### 3. Install dependency

```bash
npm install
```

### 4. Jalankan migrasi database

```bash
npm run db:migrate
```

### 5. Masukkan data obat

```bash
npm run db:seed
```

### 6. Jalankan aplikasi

```bash
npm run dev
```

Buka:

```txt
http://localhost:3000
```

## Alternatif Import SQL Manual

Jika tidak memakai Prisma migrate, jalankan file SQL berikut:

```bash
mysql -u root -p hero_farma < sql/schema.sql
mysql -u root -p hero_farma < sql/seed_medicines.sql
```

## Alur Rekomendasi

1. User mengisi keluhan pada halaman `/rekomendasi`.
2. Sistem mengambil semua data obat dari MySQL.
3. Teks obat dibentuk dari kategori, gejala, indikasi, deskripsi, fitur utama, dan kelompok keluhan.
4. Sistem melakukan preprocessing teks.
5. Sistem menghitung bobot TF-IDF.
6. Sistem menghitung Cosine Similarity antara input user dan setiap data obat.
7. Sistem mengurutkan hasil berdasarkan nilai similarity tertinggi.
8. Sistem menyimpan riwayat rekomendasi ke tabel `recommendation_histories`.

## Catatan Dataset

Kolom utama dari Excel yang dipakai:

| Kolom Excel | Kolom Database |
|---|---|
| No | sourceNo |
| Nama Obat | name |
| Kategori Obat | category |
| Bentuk Sediaan | dosageForm |
| Gejala | symptoms |
| Indikasi/Kegunaan | indication |
| Deskripsi Penggunaan | usageDescription |
| Data Awal | rawText |
| Hasil Preprocessing | preprocessedText |
| Fitur Utama | mainFeatures |
| Kelompok Keluhan | complaintGroup |

Kolom harga dan gambar tidak tersedia pada Excel. Nilai harga dibuat sebagai data demo agar tampilan produk mirip contoh. Gambar memakai placeholder SVG lokal di `public/images/medicine-placeholder.svg`.

## Endpoint API

### Cek koneksi database

```http
GET /api/health
```

Contoh respons:

```json
{
  "status": "ok",
  "database": "connected",
  "medicineCount": 300
}
```

### Rekomendasi obat

```http
POST /api/recommendations
```

Body:

```json
{
  "name": "Irfan",
  "age": 22,
  "symptoms": "demam dan sakit kepala",
  "duration": "2 hari",
  "diseaseHistory": "maag"
}
```

## Catatan Medis

Sistem ini hanya membantu pencarian informasi awal untuk obat non-resep. Sistem tidak menggantikan diagnosis dokter, konsultasi apoteker, atau pemeriksaan tenaga kesehatan.
