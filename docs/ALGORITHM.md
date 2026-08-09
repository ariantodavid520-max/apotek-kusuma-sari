# Algoritma Rekomendasi

Sistem memakai pendekatan Content-Based Filtering. Rekomendasi dihitung dari kesamaan konten antara input keluhan pengguna dan atribut obat di database.

## Input

Input utama berasal dari form:

1. Keluhan
2. Durasi indikasi
3. Riwayat penyakit

## Representasi Data Obat

Setiap obat direpresentasikan dari gabungan kolom:

1. `preprocessedText`
2. `category`
3. `symptoms`
4. `indication`
5. `usageDescription`
6. `mainFeatures`
7. `complaintGroup`

## Tahapan

1. Normalisasi teks menjadi huruf kecil.
2. Penghapusan tanda baca.
3. Tokenisasi.
4. Penghapusan stopword.
5. Normalisasi sinonim sederhana, misalnya panas menjadi demam.
6. Pembentukan vektor TF-IDF.
7. Perhitungan Cosine Similarity.
8. Pengurutan rekomendasi berdasarkan similarity tertinggi.

## Lokasi Source Code

Kode utama terdapat pada:

```txt
lib/recommendation.ts
```

## Output

API menghasilkan daftar rekomendasi berisi:

1. Data obat.
2. Nilai similarity.
3. Persentase similarity.
4. Fitur yang cocok.
5. Alasan rekomendasi.
