# Mapping Dataset Excel

File Excel yang digunakan berisi 300 data obat non-resep. Sheet utama adalah `Dataset_Obat`.

## Mapping

| Excel | Database | Keterangan |
|---|---|---|
| No | sourceNo | Nomor data |
| Nama Obat | name | Nama produk obat |
| Kategori Obat | category | Kelompok farmakologis atau kategori apotek |
| Bentuk Sediaan | dosageForm | Tablet, sirup, sachet, dan bentuk lain |
| Gejala | symptoms | Gejala yang ditangani |
| Indikasi/Kegunaan | indication | Kegunaan obat |
| Deskripsi Penggunaan | usageDescription | Deskripsi singkat penggunaan |
| Data Awal | rawText | Gabungan atribut sebelum preprocessing |
| Hasil Preprocessing | preprocessedText | Teks bersih untuk perhitungan |
| Fitur Utama | mainFeatures | Kata kunci utama |
| Kelompok Keluhan | complaintGroup | Kelompok gejala utama |

## Catatan

Data pada `scripts/seed-data/medicines.json` adalah hasil konversi dari Excel. File ini dipakai oleh `prisma/seed.ts`.
