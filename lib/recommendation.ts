import type {
  MedicineRecord,
  RecommendationItem
} from "@/types/medicine";


const STOPWORDS = new Set([
  "dan",
  "atau",
  "yang",
  "dengan",
  "untuk",
  "pada",
  "dari",
  "di",
  "ke",
  "ini",
  "itu",
  "karena",
  "agar",
  "dalam",
  "sesuai",
  "pakai",
  "digunakan",
  "obat",
  "bentuk",
  "produk",
  "sediaan",
  "tahun",
  "usia"
]);


const SYNONYMS: Record<string, string> = {
  sakit: "nyeri",
  nyeri: "nyeri",

  panas: "demam",
  meriang: "demam",

  pilek: "flu",
  influenza: "flu",

  mencret: "diare",

  pusing: "sakit kepala"
};


/**
 * Membersihkan dan menyeragamkan teks.
 */
function normalizeText(value: string): string {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}


/**
 * Menyeragamkan kata dengan sinonim.
 */
function normalizeToken(token: string): string {
  return SYNONYMS[token] ?? token;
}


/**
 * tf idf
 */
export function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(" ")
    .map(normalizeToken)
    .filter(
      (token) =>
        token.length > 1 &&
        !STOPWORDS.has(token)
    );
}


/**
 * Menghitung frekuensi setiap kata/ term frequency
 */
function termFrequency(
  tokens: string[]
): Map<string, number> {
  const result = new Map<string, number>();

  for (const token of tokens) {
    result.set(
      token,
      (result.get(token) ?? 0) + 1
    );
  }

  const total = Math.max(tokens.length, 1);

  for (const [token, count] of result.entries()) {
    result.set(
      token,
      count / total
    );
  }

  return result;
}


/**
 * Menghitung cosine similarity.
 */
function cosineSimilarity(
  firstVector: Map<string, number>,
  secondVector: Map<string, number>
): number {
  let dotProduct = 0;
  let firstNorm = 0;
  let secondNorm = 0;

  for (const value of firstVector.values()) {
    firstNorm += value * value;
  }

  for (const value of secondVector.values()) {
    secondNorm += value * value;
  }

  for (
    const [token, value] of firstVector.entries()
  ) {
    dotProduct +=
      value *
      (secondVector.get(token) ?? 0);
  }

  if (
    firstNorm === 0 ||
    secondNorm === 0
  ) {
    return 0;
  }

  return (
    dotProduct /
    (
      Math.sqrt(firstNorm) *
      Math.sqrt(secondNorm)
    )
  );
}


/**
 * Membentuk teks obat untuk perhitungan TF-IDF.
 *
 * Usia dan riwayat penyakit dilarang tidak
 * dimasukkan karena keduanya digunakan
 * sebagai filter, bukan sebagai similarity.
 */
function documentText(
  medicine: MedicineRecord
): string {
  return [
    medicine.name,
    medicine.category,
    medicine.indication,
    medicine.usageDescription
  ]
    .filter(Boolean)
    .join(" ");
}


/**
 * Membentuk TF-IDF untuk data obat dan
 * keluhan pengguna.
 */
function buildTfidfVectors(
  documents: string[],
  query: string
) {
  const tokenizedDocuments =
    documents.map(tokenize);

  const queryTokens =
    tokenize(query);

  const allDocuments = [
    ...tokenizedDocuments,
    queryTokens
  ];

  const totalDocuments =
    allDocuments.length;

  const documentFrequency =
    new Map<string, number>();

  for (const tokens of allDocuments) {
    const uniqueTerms =
      new Set(tokens);

    for (const term of uniqueTerms) {
      documentFrequency.set(
        term,
        (documentFrequency.get(term) ?? 0) + 1
      );
    }
  }

  function toTfidf(
    tokens: string[]
  ): Map<string, number> {
    const tf =
      termFrequency(tokens);

    const vector =
      new Map<string, number>();

    for (const [term, weight] of tf.entries()) {
      const df =
        documentFrequency.get(term) ?? 0;

      const idf =
        Math.log(
          (totalDocuments + 1) /
          (df + 1)
        ) + 1;

      vector.set(
        term,
        weight * idf
      );
    }

    return vector;
  }

  return {
    documentVectors:
      tokenizedDocuments.map(toTfidf),

    queryVector:
      toTfidf(queryTokens),

    queryTokens
  };
}


/**
 * Mencari kata yang cocok antara keluhan
 * pengguna dan informasi obat.
 */
function matchedTerms(
  queryTokens: string[],
  medicine: MedicineRecord
): string[] {
  const medicineTokens = new Set(
    tokenize(
      [
        medicine.name,
        medicine.category,
        medicine.indication,
        medicine.usageDescription
      ]
        .filter(Boolean)
        .join(" ")
    )
  );

  return Array.from(
    new Set(queryTokens)
  )
    .filter(
      (token) =>
        medicineTokens.has(token)
    )
    .slice(0, 10);
}


/**
 * Memisahkan beberapa riwayat penyakit.
 *
 * Contoh:
 * asma, hipertensi; penyakit jantung
 */
function splitDiseaseHistory(
  value: string
): string[] {
  const ignoredValues = new Set([
    "",
    "-",
    "tidak",
    "tidak ada",
    "tidak memiliki",
    "tidak punya",
    "tidak ada riwayat",
    "none"
  ]);

  return String(value ?? "")
    .split(/[,;|\/]+/)
    .map((item) => normalizeText(item))
    .filter(
      (item) =>
        item.length > 0 &&
        !ignoredValues.has(item)
    );
}


/**
 * Memeriksa apakah obat dilarang untuk
 * riwayat penyakit pengguna.
 */
function isForbiddenForPatient(
  medicine: MedicineRecord,
  diseaseHistory?: string
): boolean {
  const patientDiseases =
    splitDiseaseHistory(
      diseaseHistory ?? ""
    );

  const forbiddenDiseases =
    splitDiseaseHistory(
      medicine.forbiddenDiseaseHistory ?? ""
    );

  if (
    patientDiseases.length === 0 ||
    forbiddenDiseases.length === 0
  ) {
    return false;
  }

  return patientDiseases.some(
    (patientDisease) =>
      forbiddenDiseases.some(
        (forbiddenDisease) =>
          forbiddenDisease === patientDisease ||
          forbiddenDisease.includes(
            patientDisease
          ) ||
          patientDisease.includes(
            forbiddenDisease
          )
      )
  );
}


/**
 * Memeriksa apakah usia pengguna sesuai
 * dengan ketentuan usia obat.
 *
 * Format yang dapat dibaca:
 *
 * 6-12 tahun
 * 6 sampai 12 tahun
 * 6 hingga 12 tahun
 * >= 12 tahun
 * ≥ 12 tahun
 * 12 tahun ke atas
 * minimal 12 tahun
 * <= 12 tahun
 * ≤ 12 tahun
 * 12 tahun ke bawah
 * maksimal 12 tahun
 * dewasa
 * anak
 * bayi
 * balita
 * semua usia
 */
function isAgeAllowed(
  medicineAge: string,
  userAge?: string | number
): boolean {
  if (
    userAge === undefined ||
    userAge === null ||
    String(userAge).trim() === ""
  ) {
    return true;
  }

  const age = Number(userAge);

  if (
    !Number.isFinite(age) ||
    age < 0
  ) {
    return false;
  }

  const rule = String(
    medicineAge ?? ""
  )
    .toLowerCase()
    .replace(/,/g, ".")
    .replace(/\s+/g, " ")
    .trim();

  if (
    !rule ||
    rule === "-" ||
    rule.includes("semua usia") ||
    rule.includes("segala usia") ||
    rule.includes("semua umur")
  ) {
    return true;
  }

  /**
   * Contoh:
   * 6-12 tahun
   * 6–12 tahun
   * 6 sampai 12 tahun
   */
  const rangeMatch = rule.match(
    /(\d+(?:\.\d+)?)\s*(?:-|–|—|sampai|hingga|s\/d|sd)\s*(\d+(?:\.\d+)?)/
  );

  if (rangeMatch) {
    const minimumAge =
      Number(rangeMatch[1]);

    const maximumAge =
      Number(rangeMatch[2]);

    return (
      age >= minimumAge &&
      age <= maximumAge
    );
  }

  /**
   * Contoh:
   * >= 12 tahun
   * ≥ 12 tahun
   */
  const greaterOrEqualMatch = rule.match(
    /(?:>=|≥)\s*(\d+(?:\.\d+)?)/
  );

  if (greaterOrEqualMatch) {
    return age >=
      Number(greaterOrEqualMatch[1]);
  }

  /**
   * Contoh:
   * > 12 tahun
   */
  const greaterMatch = rule.match(
    /(?:>)\s*(\d+(?:\.\d+)?)/
  );

  if (greaterMatch) {
    return age >
      Number(greaterMatch[1]);
  }

  /**
   * Contoh:
   * <= 12 tahun
   * ≤ 12 tahun
   */
  const lessOrEqualMatch = rule.match(
    /(?:<=|≤)\s*(\d+(?:\.\d+)?)/
  );

  if (lessOrEqualMatch) {
    return age <=
      Number(lessOrEqualMatch[1]);
  }

  /**
   * Contoh:
   * < 12 tahun
   */
  const lessMatch = rule.match(
    /(?:<)\s*(\d+(?:\.\d+)?)/
  );

  if (lessMatch) {
    return age <
      Number(lessMatch[1]);
  }

  /**
   * Contoh:
   * minimal 12 tahun
   * mulai 12 tahun
   * 12 tahun ke atas
   */
  const minimumMatch =
    rule.match(
      /(?:minimal|mulai dari|mulai)\s*(\d+(?:\.\d+)?)/
    ) ??
    rule.match(
      /(\d+(?:\.\d+)?)\s*tahun\s*ke atas/
    );

  if (minimumMatch) {
    return age >=
      Number(minimumMatch[1]);
  }

  /**
   * Contoh:
   * lebih dari 12 tahun
   * di atas 12 tahun
   */
  const aboveMatch = rule.match(
    /(?:lebih dari|di atas)\s*(\d+(?:\.\d+)?)/
  );

  if (aboveMatch) {
    return age >
      Number(aboveMatch[1]);
  }

  /**
   * Contoh:
   * maksimal 12 tahun
   * 12 tahun ke bawah
   */
  const maximumMatch =
    rule.match(
      /(?:maksimal|paling tinggi)\s*(\d+(?:\.\d+)?)/
    ) ??
    rule.match(
      /(\d+(?:\.\d+)?)\s*tahun\s*ke bawah/
    );

  if (maximumMatch) {
    return age <=
      Number(maximumMatch[1]);
  }

  /**
   * Contoh:
   * kurang dari 12 tahun
   * di bawah 12 tahun
   */
  const belowMatch = rule.match(
    /(?:kurang dari|di bawah)\s*(\d+(?:\.\d+)?)/
  );

  if (belowMatch) {
    return age <
      Number(belowMatch[1]);
  }

  /**
   * Jika tertulis anak dan dewasa,
   * berarti boleh untuk keduanya.
   */
  if (
    rule.includes("anak") &&
    rule.includes("dewasa")
  ) {
    return true;
  }

  /**
   * Aturan kategori usia umum.
   */
  if (rule.includes("bayi")) {
    return age < 2;
  }

  if (rule.includes("balita")) {
    return age < 5;
  }

  if (rule.includes("remaja")) {
    return (
      age >= 10 &&
      age < 18
    );
  }

  if (
    rule.includes("anak") &&
    !rule.includes("dewasa")
  ) {
    return age < 18;
  }

  if (
    rule.includes("dewasa") &&
    !rule.includes("anak")
  ) {
    return age >= 18;
  }

  /**
   * Jika format usia tidak dikenali,
   * obat tidak langsung ditolak.
   */
  return true;
}


/**
 * Membuat alasan rekomendasi.
 */
function buildReason(
  matches: string[],
  medicine: MedicineRecord,
  userAge?: string | number
): string {
  const matchText =
    matches.length > 0
      ? `memiliki kesesuaian dengan keluhan pada kata ${matches.join(", ")}`
      : "memiliki kemiripan berdasarkan indikasi dan deskripsi obat";

  const ageText =
    userAge !== undefined &&
    String(userAge).trim() !== ""
      ? `serta lolos pemeriksaan usia ${userAge} tahun`
      : "";

  return `${medicine.name} ${matchText} ${ageText}.`;
}


/**
 * Fungsi utama rekomendasi obat.
 */
export function recommendMedicines(
  payload: {
    symptoms: string;
    age?: string | number;
    diseaseHistory?: string;
  },

  medicines: MedicineRecord[],
  limit = 10
): RecommendationItem[] {
  /**
   * Similarity hanya berdasarkan keluhan.
   * Usia dan riwayat penyakit digunakan
   * sebagai filter wajib.
   */
  const query = normalizeText(
    payload.symptoms
  );

  if (!query) {
    return [];
  }

  /**
   * Menyaring obat berdasarkan:
   *
   * 1. Kesesuaian usia.
   * 2. Riwayat penyakit yang dilarang.
   */
  const eligibleMedicines =
    medicines.filter((medicine) => {
      const ageAllowed =
        isAgeAllowed(
          medicine.age,
          payload.age
        );

      const forbiddenForPatient =
        isForbiddenForPatient(
          medicine,
          payload.diseaseHistory
        );

      return (
        ageAllowed &&
        !forbiddenForPatient
      );
    });

  if (eligibleMedicines.length === 0) {
    return [];
  }

  const documents =
    eligibleMedicines.map(
      documentText
    );

  const {
    documentVectors,
    queryVector,
    queryTokens
  } = buildTfidfVectors(
    documents,
    query
  );

  return eligibleMedicines
    .map(
      (
        medicine,
        index
      ): RecommendationItem => {
        const documentVector =
          documentVectors[index] ??
          new Map<string, number>();

        const similarity =
          cosineSimilarity(
            queryVector,
            documentVector
          );

        const matches =
          matchedTerms(
            queryTokens,
            medicine
          );

        return {
          medicine,

          similarity,

          similarityPercent:
            Math.round(
              similarity * 100
            ),

          matchedTerms:
            matches,

          reason:
            buildReason(
              matches,
              medicine,
              payload.age
            )
        };
      }
    )

    /**
     * Hanya menampilkan hasil dengan
     * similarity minimal 15%.
     */
    .filter(
      (item) =>
        item.similarity >= 0.15
    )

    /**
     * Urutkan dari similarity terbesar.
     */
    .sort(
      (first, second) =>
        second.similarity -
        first.similarity
    )

    /**
     * Batasi jumlah rekomendasi.
     */
    .slice(0, limit);
}