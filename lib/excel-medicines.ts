import * as XLSX from "xlsx";
import path from "path";
import fs from "fs";
import type { MedicineRecord } from "@/types/medicine";

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
 * Mengubah harga dari Excel menjadi angka.
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

  return Number(cleaned);
}

/**
 * Membaca seluruh data obat dari file Excel.
 */
export function getMedicinesFromExcel(): MedicineRecord[] {
  const filePath = path.join(
    process.cwd(),
    "scripts",
    "seed-data",
    "dataobat_kusuma sari.xlsx"
  );

  if (!fs.existsSync(filePath)) {
    console.error(
      "File Excel tidak ditemukan:",
      filePath
    );

    return [];
  }

  let fileBuffer: Buffer;

  try {
    fileBuffer = fs.readFileSync(filePath);
  } catch (error) {
    console.error(
      "File Excel tidak dapat dibaca:",
      filePath
    );

    console.error(error);

    return [];
  }

  const workbook = XLSX.read(
    fileBuffer,
    {
      type: "buffer"
    }
  );

  /**
   * File Excel Anda menggunakan sheet
   * Dataset_Obat_200.
   *
   * Jika nama sheet berubah, sistem akan
   * menggunakan sheet pertama.
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
    console.error(
      "Sheet Excel tidak ditemukan."
    );

    return [];
  }

  const rows =
    XLSX.utils.sheet_to_json<ExcelRow>(
      sheet,
      {
        defval: "",
        blankrows: false
      }
    );

  return rows
    .filter(
      (row) =>
        text(row["Nama Obat"]) !== ""
    )
    .map(
      (
        row,
        index
      ): MedicineRecord => {
        const name =
          text(row["Nama Obat"]);

        const category =
          text(row.Kategori);

        const indication =
          text(row.Indikasi);

        const usageDescription =
          text(row.Deskripsi);

        const age =
          text(row.Usia);

        const forbiddenDiseaseHistory =
          text(
            row[
              "Riwayat Penyakit Dilarang"
            ]
          );

        const price =
          numberValue(
            row["Harga (Rp)"]
          );

        const imageUrl =
          text(row.ImageURL) ||
          "/images/medicine-placeholder.svg";

        return {
          id: index + 1,
          sourceNo: index + 1,

          name,
          category,
          indication,
          usageDescription,
          age,
          forbiddenDiseaseHistory,

          price,
          imageUrl
        };
      }
    );
}