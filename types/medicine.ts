export type MedicineRecord = {
  id: number;
  sourceNo?: number;

  // Data obat dari Excel
  name: string;
  category: string;
  indication: string;
  usageDescription: string;
  age: string;

  // Penyakit yang tidak diperbolehkan memakai obat ini
  forbiddenDiseaseHistory: string;

  // Data tambahan untuk tampilan
  price: number | null;
  imageUrl: string | null;
};

export type RecommendationPayload = {
  // Keluhan yang dimasukkan pengguna
  symptoms: string;

  // Usia pengguna
  age?: number | string;

  // Riwayat penyakit pengguna
  diseaseHistory?: string;
};

export type RecommendationItem = {
  medicine: MedicineRecord;

  // Nilai cosine similarity dalam bentuk desimal
  similarity: number;

  // Nilai cosine similarity dalam bentuk persen
  similarityPercent: number;

  // Kata yang cocok antara keluhan dan data obat
  matchedTerms: string[];

  // Alasan obat direkomendasikan
  reason: string;
};