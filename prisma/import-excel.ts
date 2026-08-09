import {
  PrismaClient,
  type Prisma
} from "@prisma/client";

import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

type ExcelRow = {
  No?: number | string;
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
    "File Excel dibaca:",
    filePath
  );

  /**
   * Membaca file Excel.
   */
  const workbook =
    XLSX.readFile(filePath);

  console.log(
    "Daftar sheet:",
    workbook.SheetNames
  );

  /**
   * Mencari nama sheet yang sesuai.
   * Jika tidak ditemukan, gunakan sheet pertama.
   */
  const sheetName =
    workbook.SheetNames.includes(
      "dataobat_kusuma sari"
    )
      ? "dataobat_kusuma sari"
      : workbook.SheetNames.includes(
          "dataobat_kusuma sari"
        )
        ? "Ddataobat_kusuma sari"
        : workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(
      "File Excel tidak memiliki sheet."
    );
  }

  const sheet =
    workbook.Sheets[sheetName];

  if (!sheet) {
    throw new Error(
      `Sheet ${sheetName} tidak ditemukan.`
    );
  }

  console.log(
    "Sheet yang digunakan:",
    sheetName
  );

  /**
   * Mengubah data Excel menjadi array.
   */
  const rows =
    XLSX.utils.sheet_to_json<ExcelRow>(
      sheet,
      {
        defval: "",
        blankrows: false
      }
    );

  console.log(
    "Total baris terbaca:",
    rows.length
  );

  /**
   * Membentuk data sesuai model Medicine
   * pada schema.prisma.
   */
  const data:
    Prisma.MedicineCreateManyInput[] =
    rows
      .filter(
        (row) =>
          text(row["Nama Obat"]) !== ""
      )
      .map((row, index) => {
        return {
          sourceNo:
            Number(row.No) ||
            index + 1,

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
      "Tidak ada data obat valid yang berhasil dibaca dari Excel."
    );
  }

  console.log(
    "Total data valid:",
    data.length
  );

  console.log(
    "Contoh data pertama:",
    data[0]
  );

  /**
   * Menghapus data obat lama.
   * Riwayat rekomendasi tidak dihapus.
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
    `Import selesai. ${data.length} data obat berhasil dimasukkan.`
  );
}

main()
  .catch((error) => {
    console.error(
      "Import Excel gagal:",
      error
    );

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });