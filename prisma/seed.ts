import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

type ExcelRow = {
  "Nama Obat"?: string;
  Kategori?: string;
  Indikasi?: string;
  Deskripsi?: string;
  Usia?: string;
  "Riwayat Penyakit Dilarang"?: string;
  "Harga (Rp)"?: number | string;
  ImageURL?: string;
};

/**
 * Mengubah nilai Excel menjadi teks.
 */
function text(value: unknown): string {
  return String(value ?? "").trim();
}

/**
 * Mengubah nilai harga menjadi angka.
 */
function numberValue(
  value: unknown
): number | null {
  const cleaned = String(value ?? "")
    .replace(/[^\d]/g, "")
    .trim();

  if (!cleaned) {
    return null;
  }

  const result = Number(cleaned);

  return Number.isFinite(result)
    ? result
    : null;
}

async function main() {
  /**
   * Lokasi file Excel.
   */
  const filePath = path.join(
    process.cwd(),
    "scripts",
    "seed-data",
    "dataobat_kusuma sari.xlsx"
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File Excel tidak ditemukan di: ${filePath}`
    );
  }

  console.log(
    "Membaca file Excel:",
    filePath
  );

  /**
   * Membaca workbook Excel.
   */
  const workbook =
    XLSX.readFile(filePath);

  /**
   * Dataset Anda menggunakan sheet:
   * Dataset_Obat_200
   *
   * Jika sheet tersebut tidak ditemukan,
   * gunakan sheet pertama.
   */
  const sheetName =
    workbook.SheetNames.includes(
      "dataobat_kusuma sari"
    )
      ? "dataobat_kusuma sari"
      : workbook.SheetNames[0];

  const sheet =
    workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(
      "Sheet Excel tidak ditemukan."
    );
  }

  console.log(
    "Sheet yang digunakan:",
    sheetName
  );

  /**
   * Mengubah isi Excel menjadi array object.
   */
  const rows =
    XLSX.utils.sheet_to_json<ExcelRow>(
      sheet,
      {
        defval: "",
        blankrows: false
      }
    );

  /**
   * Mengubah data Excel agar sesuai
   * dengan model Medicine pada Prisma.
   */
  const data = rows
    .filter(
      (row) =>
        text(row["Nama Obat"]) !== ""
    )
    .map((row, index) => {
      return {
        sourceNo: index + 1,

        name:
          text(row["Nama Obat"]),

        category:
          text(row.Kategori),

        indication:
          text(row.Indikasi),

        usageDescription:
          text(row.Deskripsi),

        age:
          text(row.Usia),

        forbiddenDiseaseHistory:
          text(
            row[
              "Riwayat Penyakit Dilarang"
            ]
          ),

        price:
          numberValue(
            row["Harga (Rp)"]
          ),

        imageUrl:
          text(row.ImageURL) ||
          "/images/medicine-placeholder.svg"
      };
    });

  if (data.length === 0) {
    throw new Error(
      "Tidak ada data obat yang berhasil dibaca dari Excel."
    );
  }

  console.log(
    `Total data yang akan dimasukkan: ${data.length}`
  );

  console.log(
    "Contoh data pertama:",
    data[0]
  );

  /**
   * Menghapus data obat lama.
   *
   * Riwayat rekomendasi tidak dihapus
   * agar data riwayat pengguna tetap aman.
   */
  await prisma.medicine.deleteMany();

  /**
   * Memasukkan data obat terbaru.
   */
  await prisma.medicine.createMany({
    data,
    skipDuplicates: true
  });

  console.log(
    `Seed selesai. ${data.length} data obat berhasil dimasukkan.`
  );
}

main()
  .catch((error) => {
    console.error(
      "Seed gagal:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });