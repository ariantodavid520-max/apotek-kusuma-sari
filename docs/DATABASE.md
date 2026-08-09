# Desain Database

Database memakai MySQL dan Prisma ORM.

## Tabel `medicines`

Tabel ini menyimpan data obat non-resep dari Excel.

Kolom penting:

| Kolom | Fungsi |
|---|---|
| sourceNo | Nomor urut dari Excel |
| name | Nama obat |
| category | Kategori obat |
| dosageForm | Bentuk sediaan |
| symptoms | Gejala |
| indication | Indikasi atau kegunaan |
| usageDescription | Deskripsi penggunaan |
| rawText | Gabungan teks awal |
| preprocessedText | Teks hasil preprocessing |
| mainFeatures | Fitur utama |
| complaintGroup | Kelompok keluhan |
| price | Harga demo |
| imageUrl | Gambar produk lokal |

## Tabel `recommendation_histories`

Tabel ini menyimpan riwayat rekomendasi.

Kolom penting:

| Kolom | Fungsi |
|---|---|
| patientName | Nama pengguna |
| age | Usia |
| complaint | Keluhan |
| duration | Durasi indikasi |
| diseaseHistory | Riwayat penyakit |
| topMedicineName | Rekomendasi teratas |
| topSimilarity | Nilai similarity tertinggi |
| resultSnapshot | Snapshot hasil rekomendasi |
